const http = require('http');
const querystring = require('querystring');
const sendsms = require('send-sms');
const common = require('../util/CommonUtil.js');
const GLBConfig = require('../util/GLBConfig');
const RedisClient = require('../util/RedisClient');
const logger = require('./Logger').createLogger('SMSUtil.js');

const model = require('../model');
// table
const tb_user = model.common_user;;

exports.sedCodeMsg = async(phone, smsType) => {
    let code = common.generateRandomAlphaNum(6)
    let msg = '';
    let templateId;

    if (smsType == 'login') {
        templateId = 189686
        msg = code
    } else if (smsType == GLBConfig.SMSTYPE[0].value) {
        templateId = 189686
        msg = code
    } else if (smsType == GLBConfig.SMSTYPE[1].value) {
        templateId = 189686
        msg = code
    } else {
        logger.error('smsType error');
        return false
    }

    try {
        let key = GLBConfig.REDISKEY.SMS + smsType + phone

        let liveTime = await RedisClient.getLiveTime(key)

        if (liveTime > 0) {
            if ((RedisClient.SMSTokenExpired - liveTime) < 50) {
                logger.error('too frequent');
                return false
            }
        }

        let error = await RedisClient.setItem(key, {
            code: code
        }, RedisClient.SMSTokenExpired)

        if (error) {
            logger.error(error);
            return false
        }

        logger.info(msg);

        // await sedNXMsg(phone, msg)
        await sedRLYMsg(phone, templateId, msg)

        return true
    } catch (error) {
        logger.error(error);
        return false
    }
}

exports.sedDataMsg = async(phone, smsType, data) => {
    let templateId;

    if (smsType == 'quote') {
        templateId = 191251
    } else if (smsType == 'acceptance') {
        templateId = 205966
    } else if (smsType=='wms'){
        templateId= 227391
    }else {
        logger.error('smsType error');
        return false
    }

    try {
        // await sedNXMsg(phone, msg)
        await sedRLYMsg(phone, templateId, data)

        return true
    } catch (error) {
        logger.error(error);
        return false
    }
}

exports.certifySMSCode = async(phone, code, smsType) => {
    let key = GLBConfig.REDISKEY.SMS + smsType + phone
    let codeData = await RedisClient.getItem(key)
    if (codeData) {
        if (codeData.code === code) {
            return true
        }
        return false
    } else {
        logger.error('Redis get codeData failed');
        return false;
    }
}


function sedNXMsg(phone, msg) {
    return new Promise(function(resolve, reject) {
        if (phone) {
            if (phone.length != 11) {
                reject('phone error');
            }
        } else {
            reject('phone miss');
        }

        if (!msg) {
            reject('msg miss');
        }

        let data = {
            account: 'GC0515',
            password: 'GC0515',
            sender: 'GW0-UCS2',
            timing: '',
            time_zone: 8,
            msisdn: '86' + phone,
            message: msg
        };

        let content = querystring.stringify(data);

        let options = {
            hostname: 'sms.nxtele.com',
            port: 80,
            path: '/Api/index?' + content,
            method: 'GET'
        };

        let req = http.request(options, (res) => {
            // console.log(`STATUS: ${res.statusCode}`);
            // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                let resJson = JSON.parse(chunk)
                if (resJson.state === 0) {
                    reject(resJson.info);
                } else {
                    resolve()
                }
            });
            res.on('end', () => {
                // console.log('响应中已无数据。');
            });
        });

        req.on('error', function(e) {
            logger.error(e.message);
            reject(e.message);
        });

        req.end();
    })
}

function sedRLYMsg(phone, templateId, msg) {
    return new Promise(function(resolve, reject) {
        if (phone) {
            if (phone.length != 11) {
                reject('phone error');
            }
        } else {
            reject('phone miss');
        }

        if (!msg) {
            reject('msg miss');
        }

        let yurongyun = new sendsms.adapters.RonglianYun({
            sid: 'aaf98f894f4fbec2014f6c943d4d135b',
            token: '29ef088c9cc740908f96eec00ba2354c',
            appId: '8a216da85cf298b3015d11944c6d0d07'
        }, 'sandbox');

        let sms = new sendsms.SMS('ronglianyun', yurongyun)

        try {
            if (typeof(msg) === 'string') {
                sms.send(phone, {
                    templateId: templateId,
                    datas: [msg]
                });
            } else {
                sms.send(phone, {
                    templateId: templateId,
                    datas: msg
                });
            }
            resolve()
        } catch (err) {
            reject(err);
        }
    })
}
