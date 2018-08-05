const config = require('../config');
const elasticsearch = require('elasticsearch');
let client = undefined
if (config.elasticsearchFlag) {
    if (!client) {
        client = new elasticsearch.Client({
            host: config.elasticsearch.host,
            log: config.elasticsearch.log
        });
    }
}

module.exports = client
