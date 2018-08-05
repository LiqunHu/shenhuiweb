const fs = require('fs');
const common = require('../../../util/CommonUtil');
const GLBConfig = require('../../../util/GLBConfig');
const logger = require('../../../util/Logger').createLogger('GroupControlSRV');
const model = require('../../../model');

// tables
const sequelize = model.sequelize
const tb_common_systemmenu = model.common_systemmenu;
const tb_common_api = model.common_api;

exports.SystemApiControlResource = (req, res) => {
    let method = req.query.method;
    if (method === 'init') {
        initAct(req, res);
    } else if (method === 'search') {
        searchAct(req, res)
    } else if (method === 'addFolder') {
        addFolderAct(req, res)
    } else if (method === 'modifyFolder') {
        modifyFolderAct(req, res)
    } else if (method === 'addMenu') {
        addMenuAct(req, res)
    } else if (method === 'modifyMenu') {
        modifyMenuAct(req, res)
    } else if (method === 'getApi') {
        getApiAct(req, res)
    } else {
        common.sendError(res, 'common_01');
    }
};

async function initAct(req, res) {
    try {
        let user = req.user,
            returnData = {
                authInfo: GLBConfig.AUTHINFO,
                tfInfo: GLBConfig.TFINFO
            };

        common.sendData(res, returnData)
    } catch (error) {
        common.sendFault(res, error);
    }
}

async function searchAct(req, res) {
    try {
        let user = req.user;
        let menus = [{
            systemmenu_id: 0,
            name: '根目录',
            isParent: true,
            node_type: GLBConfig.MTYPE_ROOT,
            children: []
        }];
        menus[0].children = JSON.parse(JSON.stringify(await genMenu('0')));
        common.sendData(res, menus);
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
                node_type: m.node_type,
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
                node_type: m.node_type,
                name: m.systemmenu_name + '->' + m.api_function,
                isParent: false,
                parent_id: m.parent_id,
            });
        }
    }
    return return_list;
}

async function addFolderAct(req, res) {
    try {
        let doc = common.docTrim(req.body);
        let user = req.user;

        let afolder = await tb_common_systemmenu.findOne({
            where: {
                systemmenu_name: doc.systemmenu_name
            }
        })

        let aapi = await tb_common_api.findOne({
            where: {
                api_name: doc.systemmenu_name
            }
        })

        if (afolder || aapi) {
            return common.sendError(res, 'common_api_01');
        }

        let folder = await tb_common_systemmenu.create({
            systemmenu_name: doc.systemmenu_name,
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

        let afolder = await tb_common_systemmenu.findOne({
            where: {
                systemmenu_name: doc.systemmenu_name
            }
        })

        let aapi = await tb_common_api.findOne({
            where: {
                api_name: doc.systemmenu_name
            }
        })

        if (afolder || aapi) {
            return common.sendError(res, 'common_api_01');
        }

        let folder = await tb_common_systemmenu.findOne({
            where: {
                systemmenu_id: doc.systemmenu_id
            }
        })

        if (folder) {
            folder.systemmenu_name = doc.systemmenu_name
            await folder.save()
        } else {
            return common.sendError(res, 'common_api_02');
        }

        common.sendData(res);
    } catch (error) {
        common.sendFault(res, error);
    }
}

async function addMenuAct(req, res) {
    try {
        let doc = common.docTrim(req.body);
        let user = req.user;

        let afolder = await tb_common_systemmenu.findOne({
            where: {
                systemmenu_name: doc.systemmenu_name
            }
        })

        let aapi = await tb_common_api.findOne({
            where: {
                api_name: doc.systemmenu_name
            }
        })

        let tapi = await tb_common_api.findOne({
            where: {
                api_function: common.getApiName(doc.api_path)
            }
        })
        if (afolder || aapi || tapi) {
            return common.sendError(res, 'common_api_01')
        } else {
            let api = await tb_common_api.create({
                api_name: doc.systemmenu_name,
                api_path: doc.api_path,
                api_function: common.getApiName(doc.api_path),
                auth_flag: doc.auth_flag,
                show_flag: doc.show_flag
            })

            let folder = await tb_common_systemmenu.create({
                systemmenu_name: doc.systemmenu_name,
                api_id: api.api_id,
                api_function: api.api_function,
                node_type: '01', //NODETYPEINFO
                parent_id: doc.parent_id
            })
        }

        common.sendData(res);
    } catch (error) {
        common.sendFault(res, error);
    }
}

async function modifyMenuAct(req, res) {
    try {
        let doc = common.docTrim(req.body);
        let user = req.user;

        let menum = await tb_common_systemmenu.findOne({
            where: {
                systemmenu_id: doc.systemmenu_id
            }
        })

        if (menum) {
            let api = await tb_common_api.findOne({
                where: {
                    api_id: menum.api_id
                }
            })

            if (api.api_name != doc.systemmenu_name) {
                let afolder = await tb_common_systemmenu.findOne({
                    where: {
                        systemmenu_name: doc.systemmenu_name
                    }
                })

                let aapi = await tb_common_api.findOne({
                    where: {
                        api_name: doc.systemmenu_name
                    }
                })
                if (afolder || aapi) {
                    return common.sendError(res, 'common_api_01')
                }
            }

            if (api.api_function != common.getApiName(doc.api_path)) {
                let tapi = await tb_common_api.findOne({
                    where: {
                        api_function: common.getApiName(doc.api_path)
                    }
                })
                if (tapi) {
                    return common.sendError(res, 'common_api_01')
                }
            }

            if (api) {
                api.api_name = doc.systemmenu_name
                api.api_path = doc.api_path
                api.api_function = common.getApiName(doc.api_path)
                api.auth_flag = doc.auth_flag
                api.show_flag = doc.show_flag
                await api.save()
                menum.systemmenu_name = doc.systemmenu_name
                menum.api_function = api.api_function
                await menum.save()
            } else {
                return common.sendError(res, 'common_api_02');
            }

        } else {
            return common.sendError(res, 'common_api_02');
        }

        common.sendData(res);
    } catch (error) {
        common.sendFault(res, error);
    }
}

async function getApiAct(req, res) {
    try {
        let doc = common.docTrim(req.body);
        let user = req.user;

        let api = await tb_common_api.findOne({
            where: {
                api_id: doc.api_id
            }
        })

        common.sendData(res, api);
    } catch (error) {
        common.sendFault(res, error);
    }
}
