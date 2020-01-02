const db = require('../../util/db');

module.exports = db.defineModel('tbl_shenhui_article', {
  article_id: {
    type: db.IDNO,
    autoIncrement: true,
    primaryKey: true
  },
  article_type: {
    type: db.STRING(10) // 1-律所动态 2-经典案例 3-律师简介 4-律所党建
  }, 
  article_title: {
    type: db.STRING(200),
    allowNull: true
  },
  article_index: {
    type: db.INTEGER,
    allowNull: true
  },
  article_year: {
    type: db.STRING(20),
    allowNull: true
  },
  article_author: {
    type: db.STRING(200),
    allowNull: true
  },
  article_attorny: {
    type: db.IDNO,
    allowNull: true
  },
  article_body: {
    type: db.TEXT,
    allowNull: true
  },
  article_img: {
    type: db.STRING(300),
    allowNull: true
  }
});