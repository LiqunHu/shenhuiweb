const db = require('../../util/db');
const GLBConfig = require('../../util/GLBConfig');

module.exports = db.defineModel('tbl_common_api', {
    api_id: {
        type: db.IDNO,
        autoIncrement: true,
        primaryKey: true
    },
    api_name: {
        type: db.STRING(300),
        defaultValue: '',
        allowNull: false
    },
    api_kind: { // 1 menuwithauth 2 auth 3 gourp 4 specil
        type: db.STRING(3),
        defaultValue: '1',
        allowNull: false
    },
    api_path: {
        type: db.STRING(300),
        defaultValue: '',
        allowNull: false
    },
    api_function: {
        type: db.STRING(100),
        unique: true
    },
    auth_flag: {
        type: db.STRING(2),
        defaultValue: GLBConfig.AUTH // 1 need auth, 0 not
    },
    show_flag: {
        type: db.STRING(2),
        defaultValue: GLBConfig.TRUE // 1 need auth, 0 not
    },
    sys_usergroup_type: {
      type: db.STRING(10),
      allowNull: true
    } // MGROUPINFO
});
