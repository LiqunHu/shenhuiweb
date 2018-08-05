const common = require('../util/CommonUtil.js');
const model = require('../model');

const sequelize = model.sequelize;

function generateNonceString(length) {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let maxPos = chars.length;
    let noceStr = "";
    for (let i = 0; i < (length || 32); i++) {
        noceStr += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return noceStr;
};

exports.test = () => {
  console.log(generateNonceString(32));
}
