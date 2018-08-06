/* 域表 */
const db = require('../../util/db');

module.exports = db.defineModel('tbl_common_domain', {
    domain_id: {
        type: db.IDNO,
        autoIncrement: true,
        primaryKey: true
    },
    domain: {
        type: db.STRING(100),
        unique: true
    },
    domain_type: {
        type: db.STRING(3),
        defaultValue: '',
        allowNull: true
    },
    domaintemplate_id: {
        type: db.IDNO,
        allowNull: true
    },
    domain_name: {
        type: db.STRING(50),
        defaultValue: '',
        allowNull: false
    },
    domain_province: { //省
        type: db.STRING(20),
        defaultValue: '',
        allowNull: true
    },
    domain_city: { //市/县
        type: db.STRING(20),
        defaultValue: '',
        allowNull: true
    },
    domain_district: { //区
        type: db.STRING(20),
        defaultValue: '',
        allowNull: true
    },
    domain_address: {
        type: db.STRING(100),
        defaultValue: '',
        allowNull: false
    },
    domain_contact: {
        type: db.STRING(100),
        defaultValue: '',
        allowNull: false
    },
    domain_phone: {
        type: db.STRING(100),
        defaultValue: '',
        allowNull: false
    },
    domain_fax: {
        type: db.STRING(100),
        defaultValue: '',
        allowNull: false
    },
    domain_description: {
        type: db.STRING(200),
        allowNull: true
    }
});
