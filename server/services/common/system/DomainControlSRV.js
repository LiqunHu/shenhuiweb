const fs = require('fs');
const common = require('../../../util/CommonUtil');
const GLBConfig = require('../../../util/GLBConfig');
const Sequence = require('../../../util/Sequence');
const logger = require('../../../util/Logger').createLogger('GroupControlSRV');
const model = require('../../../model');

// tables
const sequelize = model.sequelize
const tb_common_domain = model.common_domain
const tb_common_domaintemplate = model.common_domaintemplate
const tb_usergroup = model.common_usergroup;
const tb_user = model.common_user;
const tb_common_templatemenu = model.common_templatemenu;
const tb_common_domainmenu = model.common_domainmenu;
const tb_common_systemmenu = model.common_systemmenu;
const tb_usergroupmenu = model.common_usergroupmenu;

exports.DomainControlResource = (req, res) => {
    let method = req.query.method
    if (method === 'init') {
        initAct(req, res);
    } else if (method === 'search') {
        searchAct(req, res)
    } else if (method === 'add') {
        addAct(req, res)
    } else if (method === 'modify') {
        modifyAct(req, res)
    } else if (method === 'searchDomainMenu') {
        searchDomainMenuAct(req, res)
    } else if (method === 'addFolder') {
        addFolderAct(req, res)
    } else if (method === 'modifyFolder') {
        modifyFolderAct(req, res)
    } else if (method === 'deleteSelect') {
        deleteSelectAct(req, res)
    } else if (method === 'addMenus') {
        addMenusAct(req, res)
    } else {
        common.sendError(res, 'common_01');
    }
};

async function initAct(req, res) {
    try {
        let doc = common.docTrim(req.body),
            user = req.user,
            returnData = {};
        let templates = await tb_common_domaintemplate.findAll()
        returnData.templateInfo = []
        for (let t of templates) {
            returnData.templateInfo.push({
                id: t.domaintemplate_id,
                text: t.domaintemplate_name
            });
        }
        returnData.sysmenus = [{
            systemmenu_id: 0,
            name: '根目录',
            isParent: true,
            node_type: GLBConfig.MTYPE_ROOT,
            children: []
        }];
        returnData.sysmenus[0].children = JSON.parse(JSON.stringify(await genMenu('0')));

        common.sendData(res, returnData)
    } catch (error) {
        common.sendFault(res, error);
    }
}

async function genMenu(parentId) {
    let return_list = [];
    let menus = await tb_common_systemmenu.findAll({
        where: {
            parent_id: parentId
        },
        order: [
            ['created_at', 'DESC']
        ]
    });
    for (let m of menus) {
        let sub_menus = [];
        if (m.node_type === GLBConfig.MTYPE_ROOT) {
            sub_menus = await genMenu(m.systemmenu_id);
            return_list.push({
                systemmenu_id: m.systemmenu_id,
                systemmenu_name: m.systemmenu_name,
                systemmenu_icon: m.systemmenu_icon,
                node_type: m.node_type,
                systemmenu_type: m.systemmenu_type,
                name: m.systemmenu_name,
                isParent: true,
                parent_id: m.parent_id,
                children: sub_menus
            });
        } else {
            return_list.push({
                systemmenu_id: m.systemmenu_id,
                systemmenu_name: m.systemmenu_name,
                api_id: m.api_id,
                api_function: m.api_function,
                node_type: m.node_type,
                systemmenu_type: m.systemmenu_type,
                name: m.systemmenu_name + '->' + m.api_function,
                isParent: false,
                parent_id: m.parent_id,
            });
        }
    }
    return return_list;
}

async function searchAct(req, res) {
    try {
        let doc = common.docTrim(req.body),
            user = req.user,
            returnData = {}

        let queryStr = `select * from tbl_common_domain where state = '1' `
        let replacements = []

        if (doc.search_text) {
            queryStr += ' and (domain like ? or domain_name like ? or domain_address like ?)'
            let search_text = '%' + doc.search_text + '%'
            replacements.push(search_text)
            replacements.push(search_text)
            replacements.push(search_text)
        }

        let result = await common.queryWithCount(sequelize, req, queryStr, replacements)

        returnData.total = result.count
        returnData.rows = result.data

        common.sendData(res, returnData);
    } catch (error) {
        common.sendFault(res, error);
    }
}

async function addAct(req, res) {
    try {
        let doc = common.docTrim(req.body);
        let user = req.user
        let domain = await tb_common_domain.findOne({
            where: {
                $or: [{
                        domain: doc.domain
                    },
                    {
                        domain_name: doc.domain_name
                    }
                ]
            }
        });
        if (domain) {
            common.sendError(res, 'domain_01');
            return
        } else {
            domain = await tb_common_domain.create({
                domain: doc.domain,
                domaintemplate_id: doc.domaintemplate_id,
                domain_name: doc.domain_name,
                domain_province: doc.domain_province,
                domain_city: doc.domain_city,
                domain_district: doc.domain_district,
                domain_address: doc.domain_address,
                domain_coordinate: domain_coordinate,
                domain_contact: doc.domain_contact,
                domain_phone: doc.domain_phone,
                domain_description: doc.domain_description
            })

            let usergroup = await tb_usergroup.create({
                domain_id: domain.domain_id,
                usergroup_name: 'administrator',
                usergroup_type: GLBConfig.TYPE_ADMINISTRATOR,
                node_type: GLBConfig.MTYPE_ROOT,
                parent_id: 0
            })

            let adduser = await tb_user.create({
                user_id: await Sequence.genUserID(),
                domain_id: domain.domain_id,
                usergroup_id: usergroup.usergroup_id,
                user_username: doc.domain + 'admin',
                user_name: 'admin',
                user_password: 'admin',
                user_type: GLBConfig.TYPE_ADMINISTRATOR
            })

            async function genDomainMenu(domaintemplate_id, parentId, cparentId) {
                let menus = await tb_common_templatemenu.findAll({
                    where: {
                        domaintemplate_id: domaintemplate_id,
                        parent_id: parentId
                    }
                });
                for (let m of menus) {
                    let sub_menus = [];
                    if (m.node_type === GLBConfig.MTYPE_ROOT) {
                        let dm = await tb_common_domainmenu.create({
                            domain_id: domain.domain_id,
                            domainmenu_name: m.templatemenu_name,
                            domainmenu_icon: m.templatemenu_icon,
                            api_id: m.api_id,
                            api_function: m.api_function,
                            node_type: m.node_type,
                            parent_id: cparentId
                        })
                        sub_menus = await genDomainMenu(domaintemplate_id, m.templatemenu_id, dm.domainmenu_id);
                    } else {
                        let dm = await tb_common_domainmenu.create({
                            domain_id: domain.domain_id,
                            domainmenu_name: m.templatemenu_name,
                            domainmenu_icon: m.templatemenu_icon,
                            api_id: m.api_id,
                            api_function: m.api_function,
                            node_type: m.node_type,
                            parent_id: cparentId
                        })
                    }
                }
            }

            await genDomainMenu(doc.domaintemplate_id, '0', '0')

            return common.sendData(res, domain)
        }
    } catch (error) {
        return common.sendFault(res, error)
    }
}

async function modifyAct(req, res) {
    try {
        let doc = common.docTrim(req.body)
        let user = req.user
        let domain = await tb_common_domain.findOne({
            where: {
                domain_id: doc.old.domain_id
            }
        })
        if (domain) {
            domain.domain_name = doc.new.domain_name
            domain.domain_address = doc.new.domain_address
            domain.domain_contact = doc.new.domain_contact
            domain.domain_phone = doc.new.domain_phone
            domain.domain_description = doc.new.domain_description
            await domain.save()
            return common.sendData(res, domain)
        } else {
            return common.sendError(res, 'group_02')
        }
    } catch (error) {
        common.sendFault(res, error)
    }
}

async function searchDomainMenuAct(req, res) {
    try {
        let doc = common.docTrim(req.body),
            user = req.user;

        let menus = [{
            domainmenu_id: 0,
            name: '根目录',
            isParent: true,
            node_type: GLBConfig.MTYPE_ROOT,
            children: []
        }]
        menus[0].children = JSON.parse(JSON.stringify(await genDomainMenu(doc.domain_id, '0')))

        common.sendData(res, menus)
    } catch (error) {
        common.sendFault(res, error)
    }
}

async function genDomainMenu(domain_id, parentId) {
    let return_list = [];
    let menus = await tb_common_domainmenu.findAll({
        where: {
            domain_id: domain_id,
            parent_id: parentId
        }
    })
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
            })
        } else {
            return_list.push({
                domainmenu_id: m.domainmenu_id,
                domainmenu_name: m.domainmenu_name,
                api_id: m.api_id,
                node_type: m.node_type,
                name: m.domainmenu_name,
                isParent: false,
                parent_id: m.parent_id,
            })
        }
    }
    return return_list;
}

async function addFolderAct(req, res) {
    try {
        let doc = common.docTrim(req.body);
        let user = req.user;

        let folder = await tb_common_domainmenu.create({
            domain_id: doc.domain_id,
            domainmenu_name: doc.domainmenu_name,
            domainmenu_icon: doc.domainmenu_icon,
            node_type: '00', //NODETYPEINFO
            parent_id: doc.parent_id
        })

        common.sendData(res);
    } catch (error) {
        common.sendFault(res, error);
    }
}

async function modifyFolderAct(req, res) {
    try {
        let doc = common.docTrim(req.body);
        let user = req.user;

        let folder = await tb_common_domainmenu.findOne({
            where: {
                domainmenu_id: doc.domainmenu_id
            }
        })

        if (folder) {
            folder.domainmenu_name = doc.domainmenu_name
            folder.domainmenu_icon = doc.domainmenu_icon
            await folder.save()
        } else {
            return common.sendError(res, 'common_api_02');
        }

        common.sendData(res);
    } catch (error) {
        common.sendFault(res, error);
    }
}

async function deleteSelectAct(req, res) {
    try {
        let doc = common.docTrim(req.body);
        let user = req.user;

        let tm = await tb_common_domainmenu.findOne({
            where: {
                domainmenu_id: doc.domainmenu_id
            }
        })
        if (tm) {
            if (doc.node_type === '00') {
                await folderDelete(tm.domainmenu_id)
            }
            await tm.destroy()
        }

        common.sendData(res);
    } catch (error) {
        common.sendFault(res, error);
    }
}

async function folderDelete(domainmenu_id) {
    let subM = await tb_common_domainmenu.findAll({
        where: {
            parent_id: domainmenu_id
        },
        order: [
            ['node_type'],
        ]
    })

    for (let sm of subM) {
        if (sm.node_type = '00') {
            await folderDelete(sm.domainmenu_id)
        }
        await sm.destroy()
    }
}

async function addMenusAct(req, res) {
    try {
        let doc = common.docTrim(req.body);
        let user = req.user;

        let existM = await tb_common_domainmenu.findAll({
            where: {
                domain_id: doc.domain_id,
                parent_id: doc.parent_id
            }
        })

        let addMenus = []
        for (let m of doc.menus) {
            let addFlag = true
            for (let em of existM) {
                if (m.api_id === em.api_id) {
                    addFlag = false
                    break
                }
            }
            if (addFlag) {
                addMenus.push(m)
            }
        }

        for (let am of addMenus) {
            await tb_common_domainmenu.create({
                domain_id: doc.domain_id,
                domainmenu_name: am.systemmenu_name,
                api_id: am.api_id,
                api_function: am.api_function,
                node_type: '01', //NODETYPEINFO
                parent_id: doc.parent_id
            })
        }

        common.sendData(res);
    } catch (error) {
        common.sendFault(res, error);
    }
}
