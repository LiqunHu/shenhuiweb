const db = require('../../util/db');

module.exports = db.defineModel('tbl_shenhui_article', {
  article_id: {
    type: db.IDNO,
    autoIncrement: true,
    primaryKey: true
  },
  article_type: {
    type: db.STRING(10), // 1-律所动态 2-经典案例 3-律师简介
  }, 
  article_title: {
    type: db.STRING(100),
  },
  article_body: {
    type: db.TEXT,
  },
  article_img: {
    type: db.STRING(50)
  }
});