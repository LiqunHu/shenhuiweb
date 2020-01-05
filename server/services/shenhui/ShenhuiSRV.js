const rp = require("request-promise");
const moment = require("moment");

const MarkdownIt = require("../../util/markdown.js");
const common = require("../../util/CommonUtil");
const GLBConfig = require("../../util/GLBConfig");
const Sequence = require("../../util/Sequence");
const logger = require("../../util/Logger").createLogger("FarmerbuyMPSRV");
const config = require("../../config");
const model = require("../../model");
const Security = require("../../util/Security");
const AuthSRV = require("../../util/AuthSRV");

const sequelize = model.sequelize;
const tb_shenhui_article = model.shenhui_article;

exports.ShenhuiResource = (req, res) => {
  let method = req.query.method;
  if (method === "init") {
    initAct(req, res);
  } else if (method === "getHome") {
    getHomeAct(req, res);
  } else if (method === "getArticle") {
    getArticleAct(req, res);
  } else if (method === "getDynamic") {
    getDynamicAct(req, res);
  } else if (method === "getCases") {
    getCasesAct(req, res);
  } else if (method === "getAttornys") {
    getAttornysAct(req, res);
  } else if (method === "getParty") {
    getPartyAct(req, res);
  } else if (method === "addArticle") {
    addArticleAct(req, res);
  } else if (method === "modifyArticle") {
    modifyArticleAct(req, res);
  } else if (method === "deleteArticle") {
    deleteArticleAct(req, res);
  } else if (method === "searchHome") {
    searchHomeAct(req, res);
  } else if (method === "modifyHome") {
    modifyHomeAct(req, res);
  } else if (method === "searchDynamic") {
    searchDynamicAct(req, res);
  } else if (method === "searchCase") {
    searchCaseAct(req, res);
  } else if (method === "searchAttorny") {
    searchAttornyAct(req, res);
  } else if (method === "searchParty") {
    searchPartyAct(req, res);
  } else if (method === "mdupload") {
    mduploadAct(req, res);
  } else if (method === "mddelete") {
    mddeleteAct(req, res);
  } else {
    common.sendError(res, "common_01");
  }
};

async function initAct(req, res) {
  try {
    let doc = common.docTrim(req.body),
      returnData = { YEARSINFO: GLBConfig.YEARSINFO };
    let attornys = await tb_shenhui_article.findAll({
      where: {
        article_type: "3"
      },
      order: [["created_at", "DESC"]]
    });

    returnData.attornys = [];
    for (let a of attornys) {
      returnData.attornys.push({
        id: a.article_id,
        text: a.article_author
      });
    }

    common.sendData(res, returnData);
  } catch (error) {
    common.sendFault(res, error);
  }
}

async function getHomeAct(req, res) {
  try {
    let returnData = {
      data: {
        dynamic: [],
        cases: [],
        abstract: "",
        scope: ""
      }
    };

    let abstract = await tb_shenhui_article.findOne({
      where: {
        article_type: "5"
      }
    });
    if(abstract) {
      returnData.data.abstract = MarkdownIt.render(abstract.article_body)
    }

    let scope = await tb_shenhui_article.findOne({
      where: {
        article_type: "6"
      }
    });
    if(scope) {
      returnData.data.scope = MarkdownIt.render(scope.article_body)
    }

    let dynamic = await tb_shenhui_article.findAll({
      where: {
        article_type: "1"
      },
      limit: 5,
      order: [["created_at", "DESC"]]
    });
    for (let d of dynamic) {
      returnData.data.dynamic.push({
        article_id: d.article_id,
        article_title: d.article_title,
        created_at: moment(d.created_at).format("YYYY年MM月DD日")
      });
    }

    let cases = await tb_shenhui_article.findAll({
      where: {
        article_type: "2"
      },
      limit: 6,
      order: [["created_at", "DESC"]]
    });

    for (let c of cases) {
      returnData.data.cases.push({
        article_id: c.article_id,
        article_title: c.article_title,
        created_at: moment(c.created_at).format("YYYY年MM月DD日")
      });
    }

    common.sendData(res, returnData);
  } catch (error) {
    common.sendFault(res, error);
  }
}

async function getArticleAct(req, res) {
  try {
    let doc = common.docTrim(req.body);

    let article = await tb_shenhui_article.findOne({
      where: {
        article_id: doc.article_id
      }
    });

    let rel_dynamic_articles = [];
    let rel_case_articles = [];
    if (article.article_type === "3") {
      rel_dynamic_articles = await tb_shenhui_article.findAll({
        where: {
          article_attorny: article.article_id,
          article_type: 1
        }
      });
      rel_case_articles = await tb_shenhui_article.findAll({
        where: {
          article_attorny: article.article_id,
          article_type: 2
        }
      });
    }

    let returnData = JSON.parse(JSON.stringify(article));
    returnData.rel_dynamic_articles = [];
    for (let at of rel_dynamic_articles) {
      returnData.rel_dynamic_articles.push({
        article_id: at.article_id,
        article_title: at.article_title,
        created_at: moment(at.created_at).format("YYYY年MM月DD日")
      });
    }

    returnData.rel_case_articles = [];
    for (let at of rel_case_articles) {
      returnData.rel_case_articles.push({
        article_id: at.article_id,
        article_title: at.article_title,
        created_at: moment(at.created_at).format("YYYY年MM月DD日")
      });
    }

    returnData.article_markdown = MarkdownIt.render(returnData.article_body);
    returnData.created_at = moment(article.created_at).format("YYYY年MM月DD日");
    common.sendData(res, returnData);
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
    };

    let dynamic = await tb_shenhui_article.findAll({
      where: {
        article_type: "1"
      },
      order: [["created_at", "DESC"]]
    });
    for (let d of dynamic) {
      returnData.data.dynamic.push({
        article_id: d.article_id,
        article_title: d.article_title,
        created_at: moment(d.created_at).format("YYYY年MM月DD日")
      });
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
    };

    let cases = await tb_shenhui_article.findAll({
      where: {
        article_type: "2"
      },
      order: [["created_at", "DESC"]]
    });

    for (let c of cases) {
      returnData.data.cases.push({
        article_id: c.article_id,
        article_title: c.article_title,
        created_at: moment(c.created_at).format("YYYY年MM月DD日")
      });
    }

    common.sendData(res, returnData);
  } catch (error) {
    common.sendFault(res, error);
  }
}

async function getAttornysAct(req, res) {
  try {
    let returnData = {
      data: {
        attornys: []
      }
    };

    let attornys = await tb_shenhui_article.findAll({
      where: {
        article_type: "3"
      },
      order: [["article_index"]]
    });

    for (let a of attornys) {
      returnData.data.attornys.push({
        article_id: a.article_id,
        article_title: a.article_title,
        article_img: a.article_img,
        created_at: moment(a.created_at).format("YYYY年MM月DD日")
      });
    }

    common.sendData(res, returnData);
  } catch (error) {
    common.sendFault(res, error);
  }
}

async function getPartyAct(req, res) {
  try {
    let doc = common.docTrim(req.body),
      returnData = {
        data: {
          party: []
        }
      };

    let queryStr = `SELECT *
    FROM
      tbl_shenhui_article
    WHERE
      state = "1"
    AND article_type = "4"
    and article_year = ?
    ORDER BY
      created_at DESC`;
    let replacements = [doc.year];

    let party = await common.simpleSelect(sequelize, queryStr, replacements);

    for (let a of party) {
      returnData.data.party.push({
        article_id: a.article_id,
        article_title: a.article_title,
        article_img: a.article_img,
        created_at: moment(a.created_at).format("YYYY年MM月DD日")
      });
    }

    common.sendData(res, returnData);
  } catch (error) {
    common.sendFault(res, error);
  }
}

async function addArticleAct(req, res) {
  try {
    let doc = common.docTrim(req.body);
    if (!doc.article_img) {
      doc.article_img = "";
    }

    let article = await tb_shenhui_article.create({
      article_type: doc.article_type,
      article_title: doc.article_title,
      article_index: doc.article_index,
      article_year: doc.article_year,
      article_author: doc.article_author,
      article_attorny: doc.article_attorny,
      article_body: doc.article_body,
      article_img: doc.article_img
    });

    common.sendData(res, article);
  } catch (error) {
    common.sendFault(res, error);
    return;
  }
}

async function modifyArticleAct(req, res) {
  try {
    let doc = common.docTrim(req.body);

    let article = await tb_shenhui_article.findOne({
      where: {
        article_id: doc.old.article_id
      }
    });
    article.article_title = doc.new.article_title;
    article.article_index = parseInt(doc.new.article_index || "0");
    article.article_year = doc.new.article_year;
    article.article_author = doc.new.article_author;
    article.article_img = doc.new.article_img;
    article.article_body = doc.new.article_body;
    article.article_attorny = doc.new.article_attorny;
    await article.save();

    common.sendData(res, article);
  } catch (error) {
    common.sendFault(res, error);
    return;
  }
}

async function deleteArticleAct(req, res) {
  try {
    let doc = common.docTrim(req.body);

    let article = await tb_shenhui_article.findOne({
      where: {
        article_id: doc.article_id
      }
    });

    article.destroy();

    common.sendData(res);
  } catch (error) {
    common.sendFault(res, error);
    return;
  }
}

async function searchHomeAct(req, res) {
  try {
    let doc = common.docTrim(req.body),
      returnData = {
        abstract: "",
        scope: "",
        fullabstract: ""
      };

    let abstract = await tb_shenhui_article.findOne({
      where: {
        article_type: "5"
      }
    });
    if(abstract) {
      returnData.abstract = abstract.article_body
    }

    let scope = await tb_shenhui_article.findOne({
      where: {
        article_type: "6"
      }
    });
    if(scope) {
      returnData.scope = scope.article_body
    }

    let fullabstract = await tb_shenhui_article.findOne({
      where: {
        article_type: "7"
      }
    });
    if(fullabstract) {
      returnData.fullabstract = fullabstract.article_body
    }

    common.sendData(res, returnData);
  } catch (error) {
    common.sendFault(res, error);
    return;
  }
}

async function modifyHomeAct(req, res) {
  try {
    let doc = common.docTrim(req.body)

      let abstract = await tb_shenhui_article.findOne({
        where: {
          article_type: "5"
        }
      });
      if(abstract) {
        abstract.article_body = doc.abstract
        await abstract.save()
      } else {
        await tb_shenhui_article.create({
          article_type: "5",
          article_body: doc.abstract
        })
      }
  
      let scope = await tb_shenhui_article.findOne({
        where: {
          article_type: "6"
        }
      });
      if(scope) {
        scope.article_body = doc.scope
        await scope.save()
      } else {
        await tb_shenhui_article.create({
          article_type: "6",
          article_body: doc.scope
        })
      }
  
      let fullabstract = await tb_shenhui_article.findOne({
        where: {
          article_type: "7"
        }
      });
      if(fullabstract) {
        fullabstract.article_body = doc.fullabstract
        await fullabstract.save()
      } else {
        await tb_shenhui_article.create({
          article_type: "7",
          article_body: doc.fullabstract
        })
      }

    common.sendData(res, {});
  } catch (error) {
    common.sendFault(res, error);
    return;
  }
}

async function searchDynamicAct(req, res) {
  try {
    let doc = common.docTrim(req.body),
      user = req.user,
      returnData = {};

    let queryStr =
      'select * from tbl_shenhui_article where state = "1" and article_type = "1" order by created_at desc';
    let replacements = [];

    let result = await common.queryWithCount(
      sequelize,
      req,
      queryStr,
      replacements
    );

    returnData.total = result.count;
    returnData.rows = result.data;

    common.sendData(res, returnData);
  } catch (error) {
    common.sendFault(res, error);
    return;
  }
}

async function searchCaseAct(req, res) {
  try {
    let doc = common.docTrim(req.body),
      user = req.user,
      returnData = {};

    let queryStr =
      'select * from tbl_shenhui_article where state = "1" and article_type = "2" order by created_at desc';
    let replacements = [];

    let result = await common.queryWithCount(
      sequelize,
      req,
      queryStr,
      replacements
    );

    returnData.total = result.count;
    returnData.rows = result.data;

    common.sendData(res, returnData);
  } catch (error) {
    common.sendFault(res, error);
    return;
  }
}

async function searchAttornyAct(req, res) {
  try {
    let doc = common.docTrim(req.body),
      user = req.user,
      returnData = {};

    let queryStr =
      'select * from tbl_shenhui_article where state = "1" and article_type = "3" order by article_index';
    let replacements = [];

    let result = await common.queryWithCount(
      sequelize,
      req,
      queryStr,
      replacements
    );

    returnData.total = result.count;
    returnData.rows = result.data;

    common.sendData(res, returnData);
  } catch (error) {
    common.sendFault(res, error);
    return;
  }
}

async function searchPartyAct(req, res) {
  try {
    let doc = common.docTrim(req.body),
      user = req.user,
      returnData = {};

    let queryStr = `select *
    from
      tbl_shenhui_article
    where
      state = "1"
    and article_type = "4"
    order by
      created_at DESC`;

    let replacements = [];

    let result = await common.queryWithCount(
      sequelize,
      req,
      queryStr,
      replacements
    );

    returnData.total = result.count;
    returnData.rows = result.data;

    common.sendData(res, returnData);
  } catch (error) {
    common.sendFault(res, error);
    return;
  }
}

async function mduploadAct(req, res) {
  try {
    let uploadurl = await common.fileSave(req);
    let fileUrl = await common.fileMove(uploadurl.url, "upload");
    common.sendData(res, {
      uploadurl: fileUrl
    });
  } catch (error) {
    common.sendFault(res, error);
    return;
  }
}

async function mddeleteAct(req, res) {
  try {
    let doc = common.docTrim(req.body);
    await common.fileRemove(doc.file_url);

    common.sendData(res);
  } catch (error) {
    common.sendFault(res, error);
    return;
  }
}
