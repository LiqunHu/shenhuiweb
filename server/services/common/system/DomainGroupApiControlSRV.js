const fs = require('fs');
const common = require('../../../util/CommonUtil');
const GLBConfig = require('../../../util/GLBConfig');
const logger = require('../../../util/Logger').createLogger('SysGroupApiControl');
const model = require('../../../model');

const tb_usergroup = model.common_usergroup;
const tb_common_usergroupmenu = model.common_usergroupmenu;
const tb_domain = model.common_domain;
const tb_common_domainmenu = model.common_domainmenu;

let groups = []

exports.DomainGroupApiControlResource = (req, res) => {
    let method = req.query.method
    if (method === 'init') {
        initAct(req, res);
    } else if (method === 'search') {
        searchAct(req, res)
    } else if (method === 'modify') {
        modifyAct(req, res)
    } else {
        common.sendError(res, 'common_01');
    }
}

async function initAct(req, res) {
    try {
        let returnData = {}
        let user = req.user;

        groups = []
        await genUserGroup(user.domain_id, '0', 0)

        returnData.groupInfo = groups

        returnData.menuInfo = [{
            domainmenu_id: 0,
            name: '根目录',
            isParent: true,
            node_type: GLBConfig.MTYPE_ROOT,
            children: []
        }]

        returnData.menuInfo[0].children = JSON.parse(JSON.stringify(await genDomainMenu(user.domain_id, '0')));
        common.sendData(res, returnData)
    } catch (error) {
        common.sendFault(res, error);
        return;
    }
}

async function genDomainMenu(domain_id, parentId) {
    let return_list = [];
    let menus = await tb_common_domainmenu.findAll({
        where: {
            domain_id: domain_id,
            parent_id: parentId
        }
    });
    for (let m of menus) {
        let sub_menus = [];
        if (m.node_type === GLBConfig.MTYPE_ROOT) {
            sub_menus = await genDomainMenu(domain_id, m.domainmenu_id);
            return_list.push({
                domainmenu_id: m.domainmenu_id,
                domainmenu_name: m.domainmenu_name,
                domainmenu_icon: m.domainmenu_icon,
                node_type: m.node_type,
                name: m.domainmenu_name,
                isParent: true,
                parent_id: m.parent_id,
                children: sub_menus
            });
        } else {
            return_list.push({
                domainmenu_id: m.domainmenu_id,
                domainmenu_name: m.domainmenu_name,
                api_id: m.api_id,
                node_type: m.node_type,
                name: m.domainmenu_name,
                isParent: false,
                parent_id: m.parent_id,
            });
        }
    }
    return return_list;
}

async function searchAct(req, res) {
    try {
        let doc = common.docTrim(req.body)
        let returnData = {}
        returnData.groupMenu = []

        let groupmenus = await tb_common_usergroupmenu.findAll({
            where: {
                usergroup_id: doc.usergroup_id
            }
        });
        for (let item of groupmenus) {
            returnData.groupMenu.push(item.domainmenu_id)
        }
        common.sendData(res, returnData);
    } catch (error) {
        return common.sendFault(res, error);
    }
}

async function modifyAct(req, res) {
    try {
        let doc = common.docTrim(req.body)

        await tb_common_usergroupmenu.destroy({
            where: {
                usergroup_id: doc.usergroup_id
            }
        })

        for (let m of doc.menus) {
            await tb_common_usergroupmenu.create({
                usergroup_id: doc.usergroup_id,
                domainmenu_id: m.domainmenu_id
            })
        }

        common.sendData(res)
    } catch (error) {
        return common.sendFault(res, error)
    }
}

async function genUserGroup(domain_id, parentId, lev) {
    let actgroups = await tb_usergroup.findAll({
        where: {
            domain_id: domain_id,
            parent_id: parentId,
            usergroup_type: {
                $notIn: [GLBConfig.TYPE_ADMINISTRATOR, GLBConfig.TYPE_OPERATOR]
            }
        }
    });
    for (let g of actgroups) {
        if (g.node_type === GLBConfig.MTYPE_ROOT) {
            groups.push({
                id: g.usergroup_id,
                text: '--'.repeat(lev) + g.usergroup_name,
                disabled: true
            });
            groups.concat(await genUserGroup(domain_id, g.usergroup_id, lev + 1));
        } else {
            groups.push({
                id: g.usergroup_id,
                text: '--'.repeat(lev) + g.usergroup_name,
            });
        }
    }
}
