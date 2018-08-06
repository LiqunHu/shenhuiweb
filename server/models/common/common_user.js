/* 用户表 */
const CryptoJS = require('crypto-js');
const db = require('../../util/db');
const GLBConfig = require('../../util/GLBConfig');

module.exports = db.defineModel('tbl_common_user', {
    user_id: {
        type: db.ID,
        primaryKey: true
    },
    domain_id: {
        type: db.IDNO,
        allowNull: true
    },
    usergroup_id: {// 用户组
        type: db.IDNO,
        allowNull: true
    },
    user_username: {
        type: db.STRING(100),
        allowNull: false,
        unique: true
    },
    user_wx_openid: {
      type: db.STRING(200),
      defaultValue: '',
      allowNull: false
    },
    user_type: {
        type: db.STRING(10),
        defaultValue: '',
        allowNull: true
    },
    user_email: {
        type: db.STRING(100),
        defaultValue: '',
        allowNull: true
    },
    user_phone: {
        type: db.STRING(20),
        defaultValue: '',
        allowNull: true
    },
    user_password: {
        type: db.STRING(100),
        allowNull: false,
        set: function(val) {
            this.setDataValue('user_password', CryptoJS.MD5(val).toString());
        }
    },
    user_name: {
        type: db.STRING(100),
        defaultValue: '',
        allowNull: true
    },
    user_gender: {
        type: db.STRING(1),
        defaultValue: '',
        allowNull: true
    },
    user_avatar: {
        type: db.STRING(200),
        defaultValue: '',
        allowNull: true
    },
    user_province: {//省
        type: db.STRING(20),
        defaultValue: '',
        allowNull: true
    },
    user_city: {//市/县
        type: db.STRING(20),
        defaultValue: '',
        allowNull: true
    },
    user_district: {//区
        type: db.STRING(20),
        defaultValue: '',
        allowNull: true
    },
    user_address: {
        type: db.STRING(100),
        defaultValue: '',
        allowNull: true
    },
    user_zipcode: {
        type: db.STRING(32),
        defaultValue: '',
        allowNull: true
    },
    user_remark: {
        type: db.STRING(200),
        defaultValue: '',
        allowNull: false
    }
});
