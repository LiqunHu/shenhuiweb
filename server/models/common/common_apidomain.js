const db = require('../../util/db');

module.exports = db.defineModel('tbl_common_apidomain', {
    apidomain_id: {
        type: db.IDNO,
        autoIncrement: true,
        primaryKey: true
    },
    api_name: {
        type: db.STRING(100),
        defaultValue: '',
        allowNull: false
    },
    domain_id: {
        type: db.IDNO,
        allowNull: true
    },
    follow_domain_id: {
        type: db.IDNO,
        allowNull: true
    },
    user_id: {
      type: db.ID,
      defaultValue: '',
      allowNull: false
    },
    effect_state: { //生效状态
      type: db.STRING(5),
      defaultValue: '0',
      allowNull: false
    }
});
