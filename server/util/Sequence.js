const util = require('util');
const moment = require('moment');
const db = require('./db');
const common = require('../util/CommonUtil');
const logger = require('./Logger').createLogger('Sequence');
const sequelize = db.sequelize;

let genUserID = async () => {
    try {
        let queryRst = await sequelize.query('select nextval(\'userIDSeq\') num', {
            type: sequelize.QueryTypes.SELECT
        });
        let currentIndex = ('000000000000000' + queryRst[0].num).slice(-15)

        let today = moment().format('[UI]YYYYMMDD')

        return today + currentIndex;
    } catch (error) {
        logger.error(error);
        return error;
    }
};

module.exports = {
    genUserID: genUserID,
};
