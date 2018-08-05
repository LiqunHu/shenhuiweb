const log4js = require('log4js');
const config = require('../config');

exports.createLogger = (name) => {
    log4js.configure(config.loggerConfig.config);
    let logger = log4js.getLogger(name);
    return logger;
}
