const common = require('../util/CommonUtil.js');
const logger = require('./Logger').createLogger('Authority.js');

const model = require('../model');
const Security = require('./Security');
const GLBConfig = require('../util/GLBConfig');

// table
const tb_common_api = model.common_api;

exports.AuthMiddleware = async (req, res, next) => {
    try {
        let apiList = await tb_common_api.findAll({
            where: {
                auth_flag: GLBConfig.AUTH,
                state: GLBConfig.ENABLE
            }
        });

        let apis = {};
        for (let a of apiList) {
            if (a.api_path) {
                apis[a.api_function] = a.auth_flag
            }
        }

        let patha = req.path.split('/')
        let func = patha[patha.length - 1].toUpperCase()
        let checkresult = await Security.token2user(req)

        if (func in apis) {
            if (checkresult != 0) {
                if (checkresult === -2) {
                    logger.info('UNAUTHORIZED')
                    return res.status(401).send({
                        errno: -2,
                        msg: 'Login from other place',
                    });
                } else {
                    logger.info('UNAUTHORIZED')
                    return res.status(401).send({
                        errno: -1,
                        msg: 'Auth Failed or session expired',
                    });
                }
            }
        }
    } catch (error) {
        logger.error(error);
        return common.sendFault(res, error);
    }
    next();
}
