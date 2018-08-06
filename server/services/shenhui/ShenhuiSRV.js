const rp = require('request-promise');

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
  } else {
    common.sendError(res, 'common_01');
  }
}

async function getIndexAct(req, res) {
  try {
    let returnData = {
      data: [{
          url: 'tfs/TB1.Zy6OFXXXXbhXpXXXXXXXXXX-1280-520.jpg'
        },
        {
          url: 'tps/TB1YTkBOpXXXXbLaXXXXXXXXXXX-1280-520.jpg'
        },
        {
          url: 'tps/TB1TikAOpXXXXaWXFXXXXXXXXXX-1280-520.jpg'
        },
        {
          url: 'tps/TB1pre1OFXXXXaGXXXXXXXXXXXX-1280-520.jpg'
        },
      ]
    }
    common.sendData(res, returnData);
  } catch (error) {
    common.sendFault(res, error);
  }
}
