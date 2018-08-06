const common = require('./util/CommonUtil');
const Sequence = require('./util/Sequence');
const GLBConfig = require('./util/GLBConfig');
const logger = require('./util/Logger').createLogger('init-data');
const model = require('./model.js');

let tb_common_domain = model.common_domain;
let tb_common_user = model.common_user;
let tb_common_usergroup = model.common_usergroup;
let tb_common_api = model.common_api;
let tb_common_systemmenu = model.common_systemmenu;

(async () => {
  try {
    let menu = null
    let fmenuID1 = null
    let fmenuID2 = null
    let api = null
    let usergroup = null

    let domain = await tb_common_domain.create({
      domain: 'admin',
      domain_type: GLBConfig.DOMAIN_ADMINISTRATOR,
      domain_name: 'administratorGroup',
      domain_description: 'admin'
    });

    usergroup = await tb_common_usergroup.create({
      domain_id: domain.domain_id,
      usergroup_name: 'default',
      usergroup_type: GLBConfig.TYPE_DEFAULT,
      node_type: '01',
      parent_id: 0
    });

    usergroup = await tb_common_usergroup.create({
      domain_id: domain.domain_id,
      usergroup_name: 'administrator',
      usergroup_type: GLBConfig.TYPE_ADMINISTRATOR,
      node_type: '01',
      parent_id: 0
    });

    let user = await tb_common_user.create({
      user_id: await Sequence.genUserID(),
      domain_id: domain.domain_id,
      usergroup_id: usergroup.usergroup_id,
      user_type: GLBConfig.TYPE_ADMINISTRATOR,
      user_username: 'admin',
      user_name: 'admin',
      user_password: 'admin'
    });

    // common
    menu = await tb_common_systemmenu.create({
      systemmenu_name: 'common',
      node_type: '00',
      parent_id: '0'
    });
    fmenuID1 = menu.systemmenu_id

    menu = await tb_common_systemmenu.create({
      systemmenu_name: 'components',
      node_type: '00',
      parent_id: fmenuID1
    });
    fmenuID2 = menu.systemmenu_id
    api = await tb_common_api.create({
      api_name: '机构选择组件',
      api_path: '/common/components/DomainSelectDialogControl',
      api_function: 'DOMAINSELECTDIALOGCONTROL',
      auth_flag: '0',
      show_flag: '0',
      api_kind: '1'
    })
    menu = await tb_common_systemmenu.create({
      systemmenu_name: api.api_name,
      api_id: api.api_id,
      api_function: api.api_function,
      node_type: '01',
      parent_id: fmenuID2
    });
    api = await tb_common_api.create({
      api_name: '操作员选择组件',
      api_path: '/common/components/userSelectDialogControl',
      api_function: 'USERSELECTDIALOGCONTROL',
      auth_flag: '0',
      show_flag: '0',
      api_kind: '1'
    })
    menu = await tb_common_systemmenu.create({
      systemmenu_name: api.api_name,
      api_id: api.api_id,
      api_function: api.api_function,
      node_type: '01',
      parent_id: fmenuID2
    });

    menu = await tb_common_systemmenu.create({
      systemmenu_name: 'baseconfig',
      node_type: '00',
      parent_id: fmenuID1
    });
    fmenuID2 = menu.systemmenu_id
    api = await tb_common_api.create({
      api_name: '关注审核',
      api_path: '/common/baseconfig/FollowerControl',
      api_function: 'FOLLOWERCONTROL',
      auth_flag: '1',
      show_flag: '1',
      api_kind: '1'
    })
    menu = await tb_common_systemmenu.create({
      systemmenu_name: api.api_name,
      api_id: api.api_id,
      api_function: api.api_function,
      node_type: '01',
      parent_id: fmenuID2
    });

    menu = await tb_common_systemmenu.create({
      systemmenu_name: 'system',
      node_type: '00',
      parent_id: fmenuID1
    });
    fmenuID2 = menu.systemmenu_id
    api = await tb_common_api.create({
      api_name: '系统菜单维护',
      api_path: '/common/system/SystemApiControl',
      api_function: 'SYSTEMAPICONTROL',
      auth_flag: '1',
      show_flag: '1',
      api_kind: '1'
    })
    menu = await tb_common_systemmenu.create({
      systemmenu_name: api.api_name,
      api_id: api.api_id,
      api_function: api.api_function,
      node_type: '01',
      parent_id: fmenuID2
    });
    api = await tb_common_api.create({
      api_name: '机构模板维护',
      api_path: '/common/system/DomainTemplateControl',
      api_function: 'DOMAINTEMPLATECONTROL',
      auth_flag: '1',
      show_flag: '1',
      api_kind: '1'
    })
    menu = await tb_common_systemmenu.create({
      systemmenu_name: api.api_name,
      api_id: api.api_id,
      api_function: api.api_function,
      node_type: '01',
      parent_id: fmenuID2
    });
    api = await tb_common_api.create({
      api_name: '机构维护',
      api_path: '/common/system/DomainControl',
      api_function: 'DOMAINCONTROL',
      auth_flag: '1',
      show_flag: '1',
      api_kind: '1'
    })
    menu = await tb_common_systemmenu.create({
      systemmenu_name: api.api_name,
      api_id: api.api_id,
      api_function: api.api_function,
      node_type: '01',
      parent_id: fmenuID2
    });
    api = await tb_common_api.create({
      api_name: '系统组权限维护',
      api_path: '/common/system/DomainGroupApiControl',
      api_function: 'DomainGROUPAPICONTROL',
      auth_flag: '1',
      show_flag: '1',
      api_kind: '1'
    })
    menu = await tb_common_systemmenu.create({
      systemmenu_name: api.api_name,
      api_id: api.api_id,
      api_function: api.api_function,
      node_type: '01',
      parent_id: fmenuID2
    });
    api = await tb_common_api.create({
      api_name: '用户设置',
      api_path: '/common/system/UserSetting',
      api_function: 'USERSETTING',
      auth_flag: '1',
      show_flag: '0',
      api_kind: '1'
    })
    menu = await tb_common_systemmenu.create({
      systemmenu_name: api.api_name,
      api_id: api.api_id,
      api_function: api.api_function,
      node_type: '01',
      parent_id: fmenuID2
    });
    api = await tb_common_api.create({
      api_name: '角色设置',
      api_path: '/common/system/DomainGroupControl',
      api_function: 'DOMAINGROUPCONTROL',
      auth_flag: '1',
      show_flag: '1',
      api_kind: '1'
    })
    menu = await tb_common_systemmenu.create({
      systemmenu_name: api.api_name,
      api_id: api.api_id,
      api_function: api.api_function,
      node_type: '01',
      parent_id: fmenuID2
    });
    api = await tb_common_api.create({
      api_name: '员工维护',
      api_path: '/common/system/OperatorControl',
      api_function: 'OPERATORCONTROL',
      auth_flag: '1',
      show_flag: '1',
      api_kind: '1'
    })
    menu = await tb_common_systemmenu.create({
      systemmenu_name: api.api_name,
      api_id: api.api_id,
      api_function: api.api_function,
      node_type: '01',
      parent_id: fmenuID2
    });
    api = await tb_common_api.create({
      api_name: '重置密码',
      api_path: '/common/system/ResetPassword',
      api_function: 'RESETPASSWORD',
      auth_flag: '1',
      show_flag: '1',
      api_kind: '1'
    })
    menu = await tb_common_systemmenu.create({
      systemmenu_name: api.api_name,
      api_id: api.api_id,
      api_function: api.api_function,
      node_type: '01',
      parent_id: fmenuID2
    });

    process.exit(0)
  } catch (error) {
    console.log(error);
    process.exit(0)
  }
})();
