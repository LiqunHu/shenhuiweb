const CryptoJS = require('crypto-js')
const common = require('../util/CommonUtil.js');
const logger = require('./Logger').createLogger('Security.js');

const RedisClient = require('../util/RedisClient');
const model = require('../model');
const config = require('../config');
const GLBConfig = require('./GLBConfig');

// table
const sequelize = model.sequelize;
const tb_common_userlog = model.common_userlog;

exports.token2user = async (req) => {
  try {
    let token_str = req.get('authorization');
    if (!token_str) {
      logger.info('no token');
      return -1;
    }

    let tokensplit = token_str.split('-');
    if (tokensplit.length != 5) {
      return -1;
    }

    let type = tokensplit[0],
      uid = tokensplit[1],
      magicNo = tokensplit[2],
      expires = tokensplit[3],
      sha1 = tokensplit[4]

    if (type != 'MOBILE') {
      if (parseInt(expires) < Date.now()) {
        logger.error('expires');
        return -1;
      }
    }

    let authData = await RedisClient.getItem(GLBConfig.REDISKEY.AUTH + type + uid)
    if (authData) {
      let user = authData.user
      if (!user) {
        logger.error('user do not exist');
        return -1;
      }
      req.user = user

      if (authData.session_token != token_str) {
        logger.error('login from other place');
        return -2;
      }

      let s = ''
      if (type === 'WEB' || type === 'MOBILE') {
        let idf = aesEncryptModeCFB(user.user_username, user.user_password, magicNo)
        s = [type, uid, idf, expires, config.SECRET_KEY].join('-')
      } else if (type === 'WEIXIN') {
        s = [type, uid, user.user_wx_openid, expires, config.SECRET_KEY].join('-')
      }

      if (sha1 != CryptoJS.SHA1(s).toString()) {
        logger.error('invalid sha1');
        return -1;
      }

      let patha = req.path.split('/')
      let func = patha[patha.length - 1].toUpperCase()
      let method = req.query.method

      if (config.syslogFlag && func !== 'AUTH' && method !== 'init' && method !== 'search' && method.search(/search/i) < 0) {
        tb_common_userlog.create({
          user_id: user.user_id,
          api_function: func,
          userlog_method: method,
          userlog_para: JSON.stringify(req.body)
        })
      }

      let apiList = authData.authApis;

      //auth control
      let apis = {};
      for (let m of apiList) {
        apis[m.api_function] = ''
      }

      if (func in apis) {
        return 0;
      }
    } else {
      logger.error('Redis get authData failed');
      return -1;
    }

    return -1;
  } catch (error) {
    logger.error(error);
    return -1;
  }
}

function generateRandomAlphaNum(len) {
  var rdmString = ''
  // toSting接受的参数表示进制，默认为10进制。36进制为0-9 a-z
  for (; rdmString.length < len;) {
    rdmString += Math.random().toString(16).substr(2)
  }
  return rdmString.substr(0, len)
}

function aesEncryptModeCFB(msg, pwd, magicNo) {
  let key = CryptoJS.enc.Hex.parse(pwd)
  let iv = CryptoJS.enc.Hex.parse(magicNo)

  let identifyCode = CryptoJS.AES.encrypt(msg, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString()
  return identifyCode
}

exports.aesDecryptModeCFB = (msg, pwd, magicNo) => {
  let key = CryptoJS.enc.Hex.parse(pwd)
  let iv = CryptoJS.enc.Hex.parse(magicNo)

  let decrypted = CryptoJS.AES.decrypt(msg, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString(CryptoJS.enc.Utf8)
  return decrypted
}

exports.user2token = (type, user, identifyCode, magicNo) => {
  try {
    let expires = ''
    if (type === 'MOBILE' || type === 'WEIXIN') {
      expires = Date.now() + config.MOBILE_TOKEN_AGE;
    } else {
      expires = Date.now() + config.TOKEN_AGE;
    }

    let s = [type, user.user_id, identifyCode, expires.toString(), config.SECRET_KEY].join('-');
    let L = [type, user.user_id, magicNo, expires.toString(), CryptoJS.SHA1(s).toString()]
    return L.join('-')
  } catch (error) {
    logger.error(error);
    return null;
  }
}
