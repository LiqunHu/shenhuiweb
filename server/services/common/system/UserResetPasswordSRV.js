/**
 * Created by Szane on 17/5/17.
 */
const common = require('../../../util/CommonUtil.js');
const GLBConfig = require('../../../util/GLBConfig');
const logger = require('../../../util/Logger').createLogger('UserResetPassword');
const model = require('../../../model');

const tb_usergroup = model.common_usergroup;;
const tb_user = model.common_user;;
let groups = [];
exports.UserResetPasswordResource = (req, res) => {
    let method = req.query.method;
    if (method === 'init') {
        initAct(req, res);
    } else if (method === 'search') {
        searchAct(req, res);
    } else if (method === 'reset') {
        resetAct(req, res);
    } else {
        common.sendError(res, 'common_01')
    }
};
let initAct = async (req, res) => {
    try {
        let returnData = {};
        let user = req.user;
        await genUserGroup(user.domain_id, '0', 0);
        returnData.groupInfo = groups;

        common.sendData(res, returnData)
    } catch (error) {
        common.sendFault(res, error);
    }
};
let searchAct = async (req, res) => {
    try {
        let doc = common.docTrim(req.body);
        let user = req.user;
        let returnData = {};
        let users = await tb_user.findAll({
            attributes: ['user_id', 'username'],
            where: {
                domain_id: user.domain_id,
                state: GLBConfig.ENABLE,
                user_username: {
                    $ne: 'admin'
                }
            }
        });
        let re = [];
        for (let user of users) {
            re.push({
                id: user.user_id,
                text: user.user_username
            });
        }
        common.sendData(res, re);
    } catch (error) {
        common.sendFault(res, error);
    }
};
let resetAct = async (req, res) => {
    try {
        let doc = common.docTrim(req.body);
        let user = req.user;
        let modUser = await tb_user.findOne({
            where: {
                domain_id: user.domain_id,
                user_id: doc.user_id,
                state: GLBConfig.ENABLE
            }
        });
        if (modUser) {
            modUser.user_password = doc.user_password;
            await modUser.save();
            common.sendData(res, modUser);
        } else {
            common.sendError(res, 'operator_03');
        }
    } catch (error) {
        return common.sendFault(res, error);
    }
};
