const Sequelize = require('sequelize');
const uuid = require('uuid');

const config = require('../config');
const common = require('./CommonUtil.js');
const logger = require('./Logger').createLogger('db.js');
const elaClient = require('./elasticsearchClient.js')

logger.debug('init sequelize...');

let sequelize = new Sequelize(config.sequelize.database, config.sequelize.username, config.sequelize.password, {
    host: config.sequelize.host,
    port: config.sequelize.port,
    dialect: config.sequelize.dialect,
    timezone: '+08:00', //东八时区
    pool: {
        max: 5, // max
        min: 0, // min
        idle: 10000 //10 seconds
    },
    retry: {
        match: 'getaddrinfo ENOTFOUND',
        max: 3
    },
    logging: function(sql) {
        logger.debug(sql);
    }
});

const ID_TYPE = Sequelize.STRING(30);
const IDNO_TYPE = Sequelize.BIGINT;

function defineModel(name, attributes, params) {
    let attrs = {};
    let tbpara = arguments[2] ? arguments[2] : {};

    for (let key in attributes) {
        let value = attributes[key];
        if (typeof value === 'object' && value['type']) {
            value.allowNull = value.allowNull || false;
            attrs[key] = value;
        } else {
            attrs[key] = {
                type: value,
                allowNull: false
            };
        }
    }

    attrs.state = {
        type: Sequelize.STRING(5),
        defaultValue: '1'
    };

    attrs.version = {
        type: Sequelize.BIGINT,
        defaultValue: 0,
        allowNull: false
    };
    // console.log('model defined for table: ' + name + '\n' + JSON.stringify(attrs, function(k, v) {
    //     if (k === 'type') {
    //         for (let key in Sequelize) {
    //             if (key === 'ABSTRACT' || key === 'NUMBER') {
    //                 continue;
    //             }
    //             let dbType = Sequelize[key];
    //             if (typeof dbType === 'function') {
    //                 if (v instanceof dbType) {
    //                     if (v._length) {
    //                         return `${dbType.key}(${v._length})`;
    //                     }
    //                     return dbType.key;
    //                 }
    //                 if (v === dbType) {
    //                     return dbType.key;
    //                 }
    //             }
    //         }
    //     }
    //     return v;
    // }, '  '));
    return sequelize.define(name, attrs, Object.assign({
        tableName: name,
        timestamps: true,
        underscored: true,
        hooks: {
            beforeValidate: function(obj) {
                if (obj.isNewRecord) {
                    logger.debug('will create entity...' + obj);
                    obj.version = 0;
                } else {
                    logger.debug('will update entity...');
                    obj.version++;
                }
            },
            afterCreate: function(obj) {
                if (config.elasticsearchFlag) {
                    try {
                        let jsonObj = JSON.parse(JSON.stringify(obj))
                        if (obj.constructor.tableName === 'tbl_common_user') {
                            delete jsonObj.password
                        }
                        elaClient.create({
                            index: config.elasticsearch.index + '-' + obj.constructor.tableName,
                            type: 'table',
                            id: obj[obj.constructor.primaryKeyField],
                            body: jsonObj
                        }).then(function(resp) {

                        }, function(err) {
                            logger.error(err);
                        });
                    } catch (error) {
                        logger.error(err);
                    }
                }
            },
            afterUpdate: function(obj) {
                if (config.elasticsearchFlag) {
                    try {
                        let jsonObj = JSON.parse(JSON.stringify(obj))
                        if (obj.constructor.tableName === 'tbl_common_user') {
                            delete jsonObj.password
                        }
                        elaClient.index({
                            index: config.elasticsearch.index + '-' + obj.constructor.tableName,
                            type: 'table',
                            id: obj[obj.constructor.primaryKeyField],
                            body: jsonObj
                        }).then(function(resp) {

                        }, function(err) {
                            logger.error(err);
                        });
                    } catch (error) {
                        logger.error(err);
                    }
                }
            },
            afterBulkCreate: function(instances) {
                if (config.elasticsearchFlag) {
                    try {
                        for (let obj of instances) {
                            let jsonObj = JSON.parse(JSON.stringify(obj))
                            if (obj.constructor.tableName === 'tbl_common_user') {
                                delete jsonObj.password
                            }
                            elaClient.create({
                                index: config.elasticsearch.index + '-' + obj.constructor.tableName,
                                type: 'table',
                                id: obj[obj.constructor.primaryKeyField],
                                body: jsonObj
                            }).then(function(resp) {

                            }, function(err) {
                                logger.error(err);
                            });
                        }
                    } catch (error) {
                        logger.error(err);
                    }
                }
            }
        }
    }, tbpara));
}

const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'DATE', 'BOOLEAN'];

let exp = {
    defineModel: defineModel,
    sync: () => {
        // only allow create ddl in non-production environment:
        if (process.env.NODE_ENV !== 'production') {
            return sequelize.sync({
                alter: true
            });
        } else {
            throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
        }
    }
};

for (let type of TYPES) {
    exp[type] = Sequelize[type];
}

exp.ID = ID_TYPE;
exp.IDNO = IDNO_TYPE;
exp.sequelize = sequelize;

module.exports = exp;
