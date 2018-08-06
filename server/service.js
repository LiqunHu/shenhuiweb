const fs = require('fs');
const path = require('path');

const common = require('./util/CommonUtil.js');
const logger = require('./util/Logger').createLogger('service.js');

let files = []

function readDirSync(path) {
    let pa = fs.readdirSync(__dirname + path);
    pa.forEach(function(ele, index) {
        var info = fs.statSync(__dirname + path + "/" + ele)
        if (info.isDirectory()) {
            readDirSync(path + "/" + ele);
        } else {
            if (ele.endsWith('.js')) {
                files.push(path + "/" + ele)
            }
        }
    })
}

readDirSync('/services');

module.exports = {};

for (let f of files) {
    // logger.debug(`import service from file ${f}...`);
    let name = path.basename(f, path.extname(f));
    module.exports[name] = require(__dirname + f);
}
