const db = require('../../util/db');

module.exports = db.defineModel('tbl_common_usergroup', {
    usergroup_id: {
        type: db.IDNO,
        autoIncrement: true,
        primaryKey: true
    },
    domain_id: {
        type: db.IDNO,
        allowNull: false
    },
    usergroup_type: {
        type: db.STRING(3),
        allowNull: true
    },
    usergroup_name: {
        type: db.STRING(50),
        allowNull: false
    },
    node_type: {
        type: db.STRING(2),
        allowNull: true
    },
    parent_id: {
        type: db.ID,
        allowNull: true
    }
});
