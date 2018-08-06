const fs = require('fs');
const common = require('../../../util/CommonUtil');
const GLBConfig = require('../../../util/GLBConfig');
const Sequence = require('../../../util/Sequence');
const logger = require('../../../util/Logger').createLogger('GroupControlSRV');
const model = require('../../../model');

// tables
const sequelize = model.sequelize
const tb_domain = model.common_domain
const tb_common_apidomain = model.common_apidomain;

exports.FollowerControlResource = (req, res) => {
    let method = req.query.method
    if (method === 'init') {
        initAct(req, res)
    } else if (method === 'search') {
        searchAct(req, res)
    } else if (method === 'approve') {
        approveAct(req, res)
    } else if (method === 'reject') {
        rejectAct(req, res)
    } else if (method === 'cancel') {
        cancelAct(req, res)
    } else {
        common.sendError(res, 'common_01');
    }
};

async function initAct(req, res) {
    try {
        let doc = common.docTrim(req.body),
            user = req.user,
            returnData = {};

        let queryStr = `select *, a.state state from tbl_common_apidomain a, tbl_common_domain b
                          where a.domain_id = b.domain_id
                          and a.state = '1'
                          and a.follow_domain_id = ?
                          `;
        let replacements = [user.domain_id]

        let result = await common.simpleSelect(sequelize, queryStr, replacements)

        returnData.domains = []
        for (let r of result) {
            returnData.domains.push({
                id: r.domain_id,
                text: r.domain + '-' + r.domain_name
            })
        }

        common.sendData(res, returnData);
    } catch (error) {
        common.sendFault(res, error);
    }
}

async function searchAct(req, res) {
    try {
        let doc = common.docTrim(req.body),
            user = req.user,
            returnData = {};


        let queryStr = `select *, a.state state, c.api_name api_name from tbl_common_apidomain a, tbl_common_domain b, tbl_common_api c
                      where a.domain_id = b.domain_id
                      and a.api_name = c.api_function
                      and a.follow_domain_id = ?
                      `;
        let replacements = [user.domain_id]

        if (doc.domain_id) {
            queryStr += " and a.domain_id = ?"
            replacements.push(doc.domain_id)
        } else {
            queryStr += " and a.effect_state = '0'"
        }

        let result = await common.queryWithCount(sequelize, req, queryStr, replacements)

        returnData.total = result.count
        returnData.rows = []
        for (let r of result.data) {
            let result = JSON.parse(JSON.stringify(r));
            if (result.effect_state === GLBConfig.DISABLE && result.state === GLBConfig.DISABLE) {
                result.follow_state = '申请关注'
            } else if (result.effect_state === GLBConfig.DISABLE && result.state === GLBConfig.ENABLE) {
                result.follow_state = '取消关注'
            }
            returnData.rows.push(result)
        }

        common.sendData(res, returnData);
    } catch (error) {
        common.sendFault(res, error);
    }
}

async function approveAct(req, res) {
    try {
        let doc = common.docTrim(req.body)
        let user = req.user

        let ad = await tb_common_apidomain.findOne({
            where: {
                functiondomain_id: doc.functiondomain_id,
                follow_domain_id: user.domain_id,
                effect_state: GLBConfig.DISABLE
            }
        })

        if (ad) {
            if (ad.state === GLBConfig.DISABLE) {
                ad.state = GLBConfig.ENABLE
                ad.effect_state = GLBConfig.ENABLE
                await ad.save()
            } else {
                await ad.destroy()
            }
            common.sendData(res)
        } else {
            return common.sendError(res, 'follow_01')
        }

    } catch (error) {
        common.sendFault(res, error)
    }
}

async function rejectAct(req, res) {
    try {
        let doc = common.docTrim(req.body)
        let user = req.user

        let ad = await tb_common_apidomain.findOne({
            where: {
                functiondomain_id: doc.functiondomain_id,
                follow_domain_id: user.domain_id,
                effect_state: GLBConfig.DISABLE
            }
        })

        if (ad) {
            if (ad.state === GLBConfig.DISABLE) {
                await ad.destroy()
            } else {
                ad.effect_state = GLBConfig.ENABLE
                await ad.save()
            }
            common.sendData(res)
        } else {
            return common.sendError(res, 'follow_01')
        }

    } catch (error) {
        common.sendFault(res, error)
    }
}

async function cancelAct(req, res) {
    try {
        let doc = common.docTrim(req.body)
        let user = req.user

        let ad = await tb_common_apidomain.findOne({
            where: {
                functiondomain_id: doc.functiondomain_id,
                follow_domain_id: user.domain_id,
                effect_state: GLBConfig.ENABLE
            }
        })

        if (ad) {
            await ad.destroy()
            common.sendData(res)
        } else {
            return common.sendError(res, 'follow_01')
        }

    } catch (error) {
        common.sendFault(res, error)
    }
}
