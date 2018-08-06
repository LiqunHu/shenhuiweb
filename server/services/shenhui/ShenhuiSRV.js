const rp = require('request-promise');
const moment = require('moment');

const common = require('../../util/CommonUtil');
const GLBConfig = require('../../util/GLBConfig');
const Sequence = require('../../util/Sequence');
const logger = require('../../util/Logger').createLogger('FarmerbuyMPSRV');
const config = require('../../config');
const model = require('../../model');
const Security = require('../../util/Security');
const AuthSRV = require('../../util/AuthSRV');

const tb_shenhui_article = model.shenhui_article;

exports.ShenhuiResource = (req, res) => {
  let method = req.query.method
  if (method === 'getIndex') {
    getIndexAct(req, res)
  } else if (method === 'getArticle') {
    getArticleAct(req, res)
  } else if (method === 'getDynamic') {
    getDynamicAct(req, res)
  } else if (method === 'getCases') {
    getCasesAct(req, res)
  } else {
    common.sendError(res, 'common_01');
  }
}

async function getIndexAct(req, res) {
  try {
    let returnData = {
      data: {
        dynamic: [],
        cases: []
      }
    }

    let dynamic = await tb_shenhui_article.findAll({
      where: {
        article_type: '1'
      },
      limit: 5,
      order: [
        ['created_at', 'DESC']
      ]
    })
    for(let d of dynamic) {
      returnData.data.dynamic.push({
        article_id: d.article_id,
        article_title: d.article_title,
        created_at: moment(d.created_at).format("YYYY年MM月DD日")
      })
    }

    let cases = await tb_shenhui_article.findAll({
      where: {
        article_type: '2'
      },
      limit: 6,
      order: [
        ['created_at', 'DESC']
      ]
    })

    for(let c of cases) {
      returnData.data.cases.push({
        article_id: c.article_id,
        article_title: c.article_title,
        created_at: moment(c.created_at).format("YYYY年MM月DD日")
      })
    }

    common.sendData(res, returnData);
  } catch (error) {
    common.sendFault(res, error);
  }
}

async function getArticleAct(req, res) {
  try {
    let doc = common.docTrim(req.body)

    let article = await tb_shenhui_article.findOne({
      where: {
        article_id: doc.article_id
      }
    })

    common.sendData(res, article);
  } catch (error) {
    common.sendFault(res, error);
  }
}

async function getDynamicAct(req, res) {
  try {
    let returnData = {
      data: {
        dynamic: []
      }
    }

    let dynamic = await tb_shenhui_article.findAll({
      where: {
        article_type: '1'
      },
      order: [
        ['created_at', 'DESC']
      ]
    })
    for(let d of dynamic) {
      returnData.data.dynamic.push({
        article_id: d.article_id,
        article_title: d.article_title,
        created_at: moment(d.created_at).format("YYYY年MM月DD日")
      })
    }

    common.sendData(res, returnData);
  } catch (error) {
    common.sendFault(res, error);
  }
}

async function getCasesAct(req, res) {
  try {
    let returnData = {
      data: {
        cases: []
      }
    }

    let dynamic = await tb_shenhui_article.findAll({
      where: {
        article_type: '2'
      },
      order: [
        ['created_at', 'DESC']
      ]
    })
    
    for(let c of cases) {
      returnData.data.cases.push({
        article_id: c.article_id,
        article_title: c.article_title,
        created_at: moment(c.created_at).format("YYYY年MM月DD日")
      })
    }

    common.sendData(res, returnData);
  } catch (error) {
    common.sendFault(res, error);
  }
}