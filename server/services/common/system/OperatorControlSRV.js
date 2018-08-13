const fs = require('fs');
const common = require('../../../util/CommonUtil');
const GLBConfig = require('../../../util/GLBConfig');
const Sequence = require('../../../util/Sequence');
const logger = require('../../../util/Logger').createLogger('GroupControlSRV');
const model = require('../../../model');
const RedisClient = require('../../../util/RedisClient');

const sequelize = model.sequelize
const tb_usergroup = model.common_usergroup;
const tb_user = model.common_user;

let groups = []

exports.OperatorControlResource = (req, res) => {
    let method = req.query.method
    if (method === 'init') {
        initAct(req, res);
    } else if (method === 'search') {
        searchAct(req, res)
    } else if (method === 'add') {
        addAct(req, res)
    } else if (method === 'modify') {
        modifyAct(req, res)
    } else if (method === 'delete') {
        deleteAct(req, res)
    } else {
        common.sendError(res, 'common_01')
    }
}

async function initAct(req, res) {
    try {
        let returnData = {}
        let user = req.user;

        groups = []
        await genUserGroup(user.domain_id, '0', 0)
        returnData.groupInfo = groups

        common.sendData(res, returnData)
    } catch (error) {
        common.sendFault(res, error);
    }
}

async function searchAct(req, res) {
    try {
        let doc = common.docTrim(req.body),
            user = req.user,
            returnData = {}

        let queryStr = 'select * from tbl_common_user where domain_id = ? and state = "1" and user_type = "' + GLBConfig.TYPE_OPERATOR + '"'
        let replacements = [user.domain_id]

        if (doc.search_text) {
            queryStr += ' and (user_username like ? or user_email like ? or user_phone like ? or user_name like ? or user_address like ?)'
            let search_text = '%' + doc.search_text + '%'
            replacements.push(search_text)
            replacements.push(search_text)
            replacements.push(search_text)
            replacements.push(search_text)
            replacements.push(search_text)
        }

        let result = await common.queryWithCount(sequelize, req, queryStr, replacements)

        returnData.total = result.count
        returnData.rows = []

        for (let ap of result.data) {
            let d = JSON.parse(JSON.stringify(ap))
            delete d.user_password
            returnData.rows.push(d)
        }

        common.sendData(res, returnData);
    } catch (error) {
        common.sendFault(res, error);
        return
    }
}

async function addAct(req, res) {
    try {
        let doc = common.docTrim(req.body)
        let user = req.user

        let usergroup = await tb_usergroup.findOne({
            where: {
                usergroup_id: doc.usergroup_id
            }
        });

        if (usergroup) {
            let adduser = await tb_user.findOne({
                where: {
                    user_phone: doc.user_phone
                }
            });
            if (adduser) {
                return common.sendError(res, 'operator_02');
            }
            adduser = await tb_user.findOne({
                where: {
                    user_username: doc.user_username
                }
            });
            if (adduser) {
                return common.sendError(res, 'operator_02');
            }
            adduser = await tb_user.create({
                user_id: await Sequence.genUserID(),
                domain_id: user.domain_id,
                usergroup_id: doc.usergroup_id,
                user_username: doc.user_username,
                user_email: doc.user_email,
                user_phone: doc.user_phone,
                user_password: GLBConfig.INITPASSWORD,
                user_name: doc.user_name,
                user_gender: doc.user_gender,
                user_address: doc.user_address,
                user_zipcode: doc.user_zipcode,
                user_type: usergroup.usergroup_type
            });
            delete adduser.password
            common.sendData(res, adduser)
        } else {
            common.sendError(res, 'operator_01')
            return
        }

    } catch (error) {
        common.sendFault(res, error)
        return
    }
}

async function modifyAct(req, res) {
    try {
        let doc = common.docTrim(req.body)
        let user = req.user

        let modiuser = await tb_user.findOne({
            where: {
                domain_id: user.domain_id,
                user_id: doc.old.user_id,
                state: GLBConfig.ENABLE
            }
        });
        let usergroup = await tb_usergroup.findOne({
            where: {
                usergroup_id: doc.new.usergroup_id
            }
        });
        if (modiuser) {
            modiuser.user_email = doc.new.user_email;
            modiuser.user_phone = doc.new.user_phone;
            modiuser.user_name = doc.new.user_name;
            modiuser.user_gender = doc.new.user_gender
            modiuser.user_avatar = doc.new.user_avatar;
            modiuser.user_address = doc.new.user_address;
            modiuser.user_state = doc.new.user_state;
            modiuser.user_zipcode = doc.new.user_zipcode;
            modiuser.usergroup_id = doc.new.usergroup_id;
            modiuser.user_type = usergroup.usergroup_type;
            await modiuser.save();
            delete modiuser.user_password;
            common.sendData(res, modiuser);
            return
        } else {
            common.sendError(res, 'operator_03')
            return
        }
    } catch (error) {
        common.sendFault(res, error)
        return null
    }
}

async function deleteAct(req, res) {
    try {
        let doc = common.docTrim(req.body)
        let user = req.user

        let deluser = await tb_user.findOne({
            where: {
                domain_id: user.domain_id,
                user_id: doc.user_id,
                state: GLBConfig.ENABLE
            }
        });

        if (deluser) {
            deluser.state = GLBConfig.DISABLE
            await deluser.save()
            RedisClient.removeItem(GLBConfig.REDISKEY.AUTH + 'WEB' + doc.user_id);
            RedisClient.removeItem(GLBConfig.REDISKEY.AUTH + 'MOBILE' + doc.user_id);
            common.sendData(res)
        } else {
            return common.sendError(res, 'operator_03')

        }
    } catch (error) {
        return common.sendFault(res, error)
    }
}

async function genUserGroup(domain_id, parentId, lev) {
    let actgroups = await tb_usergroup.findAll({
        where: {
            domain_id: domain_id,
            parent_id: parentId,
            usergroup_type: GLBConfig.TYPE_OPERATOR
        }
    });
    for (let g of actgroups) {
        if (g.node_type === GLBConfig.MTYPE_ROOT) {
            groups.push({
                id: g.usergroup_id,
                text: '--'.repeat(lev) + g.usergroup_name,
                disabled: true
            });
            await genUserGroup(domain_id, g.usergroup_id, lev + 1);
        } else {
            groups.push({
                id: g.usergroup_id,
                text: '--'.repeat(lev) + g.usergroup_name
            });
        }
    }
}
