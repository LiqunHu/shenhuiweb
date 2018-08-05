const schedule = require('node-schedule');
const logger = require('./util/Logger').createLogger('schedule');
const exchange = require('./batch/exchange');

let scheduler = {
    scheduleJob: function() {
        let jobs = []
        // 测试例子
        // jobs.push(schedule.scheduleJob('*/1 * * * * *', exchange.test))
        return jobs;
    }
}

module.exports = scheduler;