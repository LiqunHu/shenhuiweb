const fs = require('fs');
const common = require('../../../util/CommonUtil');
const GLBConfig = require('../../../util/GLBConfig');
const logger = require('../../../util/Logger').createLogger('GroupControlSRV');
const model = require('../../../model');

// tables
const tb_common_usergroup = model.common_usergroup;
const tb_common_user = model.common_user;
const tb_common_domainmenu = model.common_domainmenu;
const tb_common_usergroupmenu = model.common_usergroupmenu;

exports.DomainGroupControlResource = (req, res) => {
    let method = req.query.method;
    if (method === 'init') {
        initAct(req, res);
    } else if (method === 'search') {
        searchAct(req, res)
    } else if (method === 'getcheck') {
        getCheckAct(req, res)
    } else if (method === 'add') {
        addAct(req, res)
    } else if (method === 'modify') {
        modifyAct(req, res)
    } else if (method === 'delete') {
        deleteAct(req, res)
    } else {
        common.sendError(res, 'common_01');
    }
};

async function initAct(req, res) {
    try {
        let user = req.user,
            returnData = {};

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
        let user = req.user;
        let groups = [{
            usergroup_id: 0,
            name: '总机构',
            isParent: true,
            node_type: GLBConfig.MTYPE_ROOT,
            children: []
        }];
        groups[0].children = JSON.parse(JSON.stringify(await genUserGroup(user.domain_id, '0')));
        common.sendData(res, groups);
    } catch (error) {
        common.sendFault(res, error);
    }
}

async function genUserGroup(domain_id, parentId) {
    let return_list = [];
    let groups = await tb_common_usergroup.findAll({
        where: {
            domain_id: domain_id,
            parent_id: parentId,
            usergroup_type: GLBConfig.TYPE_OPERATOR
        }
    });
    for (let g of groups) {
        let sub_group = [];
        if (g.node_type === GLBConfig.MTYPE_ROOT) {
            sub_group = await genUserGroup(domain_id, g.usergroup_id);
            return_list.push({
                usergroup_id: g.usergroup_id,
                node_type: g.node_type,
                usergroup_type: g.usergroup_type,
                name: g.usergroup_name,
                isParent: true,
                parent_id: g.parent_id,
                children: sub_group
            });
        } else {
            return_list.push({
                usergroup_id: g.usergroup_id,
                node_type: g.node_type,
                usergroup_type: g.usergroup_type,
                name: g.usergroup_name,
                isParent: false,
                parent_id: g.parent_id,
            });
        }
    }
    return return_list;
}

async function getCheckAct(req, res) {
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

async function addAct(req, res) {
    try {
        let doc = common.docTrim(req.body);
        let user = req.user;

        let usergroup = await tb_common_usergroup.create({
            domain_id: user.domain_id,
            usergroup_name: doc.usergroup_name,
            usergroup_type: GLBConfig.TYPE_OPERATOR,
            node_type: doc.node_type,
            parent_id: doc.parent_id
        })

        if (doc.node_type === '01') {
            for (let m of doc.menus) {
                await tb_common_usergroupmenu.create({
                    usergroup_id: usergroup.usergroup_id,
                    domainmenu_id: m.domainmenu_id
                })
            }
        }

        common.sendData(res, usergroup);
    } catch (error) {
        common.sendFault(res, error);
    }
}

async function modifyAct(req, res) {
    try {
        let doc = common.docTrim(req.body);
        let user = req.user;
        let usergroup = await tb_common_usergroup.findOne({
            where: {
                usergroup_id: doc.usergroup_id
            }
        });
        if (usergroup) {
            usergroup.usergroup_name = doc.usergroup_name;
            await usergroup.save();

            if (usergroup.node_type === '01') {
                await tb_common_usergroupmenu.destroy({
                    where: {
                        usergroup_id: doc.usergroup_id
                    }
                })

                for (let m of doc.menus) {
                    await tb_common_usergroupmenu.create({
                        usergroup_id: usergroup.usergroup_id,
                        domainmenu_id: m.domainmenu_id
                    })
                }
            }
            common.sendData(res, usergroup)
        } else {
            common.sendError(res, 'group_02');
        }
    } catch (error) {
        common.sendFault(res, error)
    }
}

async function deleteAct(req, res) {
    try {
        let doc = common.docTrim(req.body);
        let user = req.user;
        let usergroup = await tb_common_usergroup.findOne({
            where: {
                domain_id: user.domain_id,
                usergroup_id: doc.usergroup_id
            }
        });

        let usersCount = await tb_common_user.count({
            where: {
                usergroup_id: usergroup.usergroup_id
            }
        });

        if (usersCount > 0) {
            common.sendError(res, 'group_03');
            return;
        }

        if (usergroup) {
            await tb_common_usergroupmenu.destroy({
                where: {
                    usergroup_id: usergroup.usergroup_id
                }
            })
            await usergroup.destroy();
            common.sendData(res);
        } else {
            common.sendError(res, 'group_02');
        }
    } catch (error) {
        common.sendFault(res, error)
    }
}
