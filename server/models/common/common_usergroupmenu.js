const db = require('../../util/db');

module.exports = db.defineModel('tbl_common_usergroupmenu', {
    usergroup_id: {
        type: db.IDNO,
        allowNull: false
    },
    domainmenu_id: {
        type: db.IDNO,
        allowNull: true
    }
});
