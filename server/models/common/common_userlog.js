const db = require('../../util/db');

module.exports = db.defineModel('tbl_common_userlog', {
  userlog_id: {
    type: db.IDNO,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: db.ID,
  },
  api_function: {
    type: db.STRING(100)
  },
  userlog_method: {
    type: db.STRING(50)
  },
  userlog_para: {
    type: db.TEXT
  } 
});