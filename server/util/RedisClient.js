const common = require('../util/CommonUtil.js');
const logger = require('./Logger').createLogger('RedisClient.js');
const bluebird = require("bluebird");
const config = require('../config');
const redis = require("redis");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
let client = undefined
if (!client) {
  client = redis.createClient(config.redis.port, config.redis.host, config.redis.opts);
}

/**
 * 设置缓存
 * @param key 缓存key
 * @param value 缓存value
 * @param expired 缓存的有效时长，单位秒
 */
exports.setItem = async(key, value, expired) => {
    try {
        await client.setAsync(key, JSON.stringify(value));
        if (expired) {
            client.expireAsync(key, expired);
        }
        return null;
    } catch (error) {
        logger.error(error);
        return error;
    }
};

/**
 * 获取缓存
 * @param key 缓存key
 */
exports.getItem = async(key) => {
    try {
        let value = await client.getAsync(key);
        return JSON.parse(value);
    } catch (error) {
        logger.error(error);
        return null;
    }

};

/**
 * 获取缓存
 * @param key 缓存key
 */
exports.getLiveTime = (key) => {
    return new Promise(function(resolve, reject) {
        client.ttl(key, function (err, data){
            if (err) {
                reject(err);
            }
            resolve(data)
        });
    })
};

/**
 * 移除缓存
 * @param key 缓存key
 * @param callback 回调函数
 */
exports.removeItem = async(key) => {
    try {
        await client.delAsync(key);
    } catch (error) {
        logger.error(error);
        return error;
    }
};

exports.tokenExpired = parseInt(config.TOKEN_AGE / 1000);
exports.mobileTokenExpired = parseInt(config.MOBILE_TOKEN_AGE / 1000);
exports.SMSTokenExpired = 300;
