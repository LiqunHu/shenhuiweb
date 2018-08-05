const fs = require('fs');
const path = require('path');
const format = require('util').format;
const mongodb = require('mongodb');
const gm = require('gm').subClass({
    imageMagick: true
});

const common = require('../util/CommonUtil.js');
const logger = require('./Logger').createLogger('AuthSRV.js');
const config = require('../config');
const GLBConfig = require('../util/GLBConfig');

exports.FileResource = async (req, res) => {
    try {
        let connectStr = ''
        if (config.mongo.auth) {
            connectStr = format(config.mongo.connect,
                config.mongo.auth.username, config.mongo.auth.password);
        } else {
            connectStr = config.mongo.connect
        }
        mongodb.MongoClient.connect(connectStr, async function(err, db) {
            if (err) {
                logger.error('An error occurred!', err);
                return res.status(404).send('File Not Exists!');
            }
            try {
                let fileName = req.params.filetag
                // Our file ID
                // let fileId = path.basename(fileName, path.extname(fileName));
                let gridStore = new mongodb.GridStore(db, fileName, 'r')
                let gs = await gridStore.open()
                let stream = gs.stream();
                let ext = path.extname(fileName)
                res.type(req.params.filetag);
                if (ext === '.jpg') {
                    let params = req.query
                    if (params.width && params.height && params.quality) {
                        gm(stream, 'img.jpg')
                            .quality(params.quality)
                            .resize(params.width, params.height, "^")
                            .gravity("Center")
                            .crop(params.width, params.height)
                            .stream(function(err, stdout, stderr) {
                                stdout.on("end", async function() {
                                    await gs.close()
                                    db.close()
                                });
                                stdout.pipe(res)
                            });
                    } else if (params.width && params.quality) {
                        gm(stream, 'img.jpg')
                            .quality(params.quality)
                            .resize(params.width)
                            .stream(function(err, stdout, stderr) {
                                stdout.on("end", async function() {
                                    await gs.close()
                                    db.close()
                                });
                                stdout.pipe(res)
                            });
                    } else if (params.height && params.quality) {
                        gm(stream, 'img.jpg')
                            .quality(params.quality)
                            .resize(null, params.height)
                            .stream(function(err, stdout, stderr) {
                                stdout.on("end", async function() {
                                    await gs.close()
                                    db.close()
                                });
                                stdout.pipe(res)
                            });
                    } else if (params.quality) {
                        gm(stream, 'img.jpg')
                            .quality(params.quality)
                            .stream(function(err, stdout, stderr) {
                                stdout.on("end", async function() {
                                    await gs.close()
                                    db.close()
                                });
                                stdout.pipe(res)
                            });
                    } else {
                        stream.on("end", async function() {
                            await gs.close()
                            db.close()
                        });
                        stream.pipe(res)
                    }
                } else {
                    stream.on("end", async function() {
                        await gs.close()
                        db.close()
                    });
                    stream.pipe(res)
                }
                // res.end(stream, 'binary')
            } catch (error) {
                db.close()
                logger.error('An error occurred!', error);
                return res.status(404).send('File Not Exists!');
            }
        });
    } catch (error) {
        common.sendFault(res, error);
    }
};
