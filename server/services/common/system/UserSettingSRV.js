const fs = require('fs');
const common = require('../../../util/CommonUtil');
const GLBConfig = require('../../../util/GLBConfig');
const logger = require('../../../util/Logger').createLogger('UserSettingSRV');
const model = require('../../../model');

const tb_user = model.common_user;

exports.UserSettingResource = (req, res) => {
    let method = req.query.method
    if (method === 'setpwd') {
        setpwdAct(req, res);
    } else if (method === 'modify') {
        modifyAct(req, res)
    } else if (method === 'upload') {
        uploadAct(req, res)
    } else {
        common.sendError(res, 'common_01')
    }
}

async function setpwdAct(req, res) {
    try {
        let doc = common.docTrim(req.body)
        let user = req.user;

        if (user.password != doc.oldPwd) {
            common.sendError(res, 'usersetting_01');
            return
        }

        let modiuser = await tb_user.findOne({
            where: {
                user_id: user.user_id,
                state: GLBConfig.ENABLE
            }
        });

        if (modiuser) {
            modiuser.user_password = doc.pwd
            await modiuser.save()
            common.sendData(res);
        } else {
            return common.sendError(res, 'usersetting_02');
        }
    } catch (error) {
        common.sendFault(res, error);
    }
}

async function modifyAct(req, res) {
    try {
        let doc = common.docTrim(req.body)
        let user = req.user;

        let modiuser = await tb_user.findOne({
            where: {
                user_id: user.user_id,
                state: GLBConfig.ENABLE
            }
        });

        if (modiuser) {
            if (doc.avatar) {
                if (doc.user_avatar != modiuser.user_avatar) {
                    modiuser.avatar = await common.fileMove(doc.avatar, 'avatar')
                }
            }

            modiuser.user_name = doc.user_name
            modiuser.user_phone = doc.user_phone
            await modiuser.save()
            delete modiuser.user_password
            common.sendData(res, modiuser)
            return
        } else {
            common.sendError(res, 'usersetting_02')
            return
        }
    } catch (error) {
        common.sendFault(res, error)
        return null
    }
}



async function uploadAct(req, res) {
    try {
        let uploadurl = await common.fileSave(req)
        common.sendData(res, {
            uploadurl: uploadurl
        })
    } catch (error) {
        common.sendFault(res, error)
        return
    }
}
