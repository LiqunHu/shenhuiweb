const fs = require('fs');
const common = require('../../../util/CommonUtil');
const GLBConfig = require('../../../util/GLBConfig');
const Sequence = require('../../../util/Sequence');
const logger = require('../../../util/Logger').createLogger('GroupControlSRV');
const model = require('../../../model');

// tables
const sequelize = model.sequelize;
const tb_common_domain = model.common_domain;
const tb_common_apidomain = model.common_apidomain;

exports.DomainSelectDialogResource = (req, res) => {
    let method = req.query.method
    if (method === 'search') {
        searchAct(req, res)
    } else if (method === 'modify') {
        modifyAct(req, res)
    } else {
        common.sendError(res, 'common_01');
    }
};

async function searchAct(req, res) {
    try {
        let doc = common.docTrim(req.body),
            user = req.user,
            returnData = {};
        returnData.follow_list = []

        let queryStr = `select *, b.domain_id bdomain_id, a.state state from tbl_common_apidomain a, tbl_common_domain b
                      where a.follow_domain_id = b.domain_id
                      and not (a.effect_state = '0' and a.state = '1' )
                      and a.api_name = ?
                      and a.domain_id = ?
                      `;
        let replacements = [doc.api_name, user.domain_id];

        let result = await common.simpleSelect(sequelize, queryStr, replacements);

        for (let r of result) {
            let row = JSON.parse(JSON.stringify(r))

            if (row.effect_state === GLBConfig.ENABLE && row.state === GLBConfig.ENABLE) {
                row.follow_state = '关注'
            } else if (row.effect_state === GLBConfig.DISABLE && row.state === GLBConfig.DISABLE) {
                row.follow_state = '关注申请中'
            }

            returnData.follow_list.push(row)
        }

        returnData.defollow_list = []

        let dequeryStr = `select *, b.domain_id bdomain_id, a.state state from tbl_common_apidomain a, tbl_common_domain b
                      where a.follow_domain_id = b.domain_id
                      and (a.effect_state = '0' and a.state = '1' )
                      and a.api_name = ?
                      and a.domain_id = ?
                      `;
        let dereplacements = [doc.api_name, user.domain_id];

        let deresult = await common.simpleSelect(sequelize, dequeryStr, dereplacements);

        for (let r of deresult) {
            let row = JSON.parse(JSON.stringify(r))

            if (row.effect_state === GLBConfig.DISABLE && row.state === GLBConfig.ENABLE) {
                row.follow_state = '取消关注中'
            }
            returnData.defollow_list.push(row)
        }

        let domains = await tb_common_domain.findAll({
            where: {
                domain_id: {
                    $ne: user.domain_id
                },
                state: GLBConfig.ENABLE
            }
        });

        returnData.domains = domains
        common.sendData(res, returnData);
    } catch (error) {
        common.sendFault(res, error);
    }
}

async function modifyAct(req, res) {
    try {
        let doc = common.docTrim(req.body),
            user = req.user,
            returnData = [];

        let ids = []

        for (let d of doc.resultDomains) {
            ids.push(d.follow_domain_id)
        }

        let rFowllow = null
        if (ids.length > 0) {
            rFowllow = await tb_common_apidomain.findAll({
                where: {
                    domain_id: user.domain_id,
                    api_name: doc.api_name,
                    follow_domain_id: {
                        $notIn: ids,
                    }
                }
            })
        } else {
            rFowllow = await tb_common_apidomain.findAll({
                where: {
                    domain_id: user.domain_id,
                    api_name: doc.api_name
                }
            })
        }

        // 删除关联关系申请
        let rids = []
        for (let rf of rFowllow) {
            rids.push(rf.follow_domain_id)
            if (rf.effect_state === GLBConfig.DISABLE && rf.state === GLBConfig.DISABLE) {
                await rf.destroy()
            } else if (rf.effect_state === GLBConfig.DISABLE && rf.state === GLBConfig.ENABLE) {

            } else if (rf.effect_state === GLBConfig.ENABLE && rf.state === GLBConfig.ENABLE) {
                rf.effect_state = GLBConfig.DISABLE
                rf.user_id = user.user_id
                await rf.save()
            }
        }

        // 修改关联关系
        let mFowllow = null
        if (rids.length > 0) {
            mFowllow = await tb_common_apidomain.findAll({
                where: {
                    domain_id: user.domain_id,
                    api_name: doc.api_name,
                    follow_domain_id: {
                        $notIn: rids,
                    }
                }
            })

        } else {
            mFowllow = await tb_common_apidomain.findAll({
                where: {
                    domain_id: user.domain_id,
                    api_name: doc.api_name
                }
            })
        }

        for (let d of doc.resultDomains) {
            let addFlag = true
            for (let mf of mFowllow) {
                if (d.follow_domain_id === mf.follow_domain_id) {
                    if (mf.effect_state === GLBConfig.DISABLE && mf.state === GLBConfig.ENABLE) {
                        mf.effect_state = GLBConfig.ENABLE
                        await mf.save()
                    }
                    addFlag = false
                    break
                }
            }
            if (addFlag) {
                await tb_common_apidomain.create({
                    api_name: doc.api_name,
                    domain_id: user.domain_id,
                    follow_domain_id: d.follow_domain_id,
                    user_id: user.user_id,
                    effect_state: GLBConfig.DISABLE,
                    state: GLBConfig.DISABLE
                })
            }
        }

        common.sendData(res);
    } catch (error) {
        common.sendFault(res, error);
    }
}

function genPosition(usergroup_id, usergroups) {
    let positionName = '',
        parent_id;

    function isEqual(element, index, array) {
        if (element.usergroup_id === usergroup_id) {
            positionName = element.usergroup_name
            parent_id = element.parent_id
            return true
        } else {
            return false
        }
    }

    if (usergroups.some(isEqual)) {
        positionName = genPosition(parent_id, usergroups) + '>' + positionName
    }
    return positionName
}
