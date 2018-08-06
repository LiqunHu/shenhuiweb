const db = require('../../util/db');
const GLBConfig = require('../../util/GLBConfig');

module.exports = db.defineModel('tbl_common_domaintemplate', {
    domaintemplate_id: {
        type: db.IDNO,
        autoIncrement: true,
        primaryKey: true
    },
    domaintemplate_name: {
        type: db.STRING(50),
        allowNull: false
    }
});
