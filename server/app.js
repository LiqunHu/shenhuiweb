const log4js = require('log4js');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');

const config = require('./config');
const common = require('./util/CommonUtil.js');
const logger = require('./util/Logger').createLogger('app.js');

let app = express();
let cors = require('cors')
let ejs = require('ejs');

let authority = require('./util/Authority')
let AuthSRV = require('./util/AuthSRV')
let FileSRV = require('./util/FileSRV')
let services = require('./service')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/temp', express.static(path.join(__dirname, '../public/temp')))
if (config.mongoFlag == false) {
    app.use('/files', express.static(path.join(__dirname, 'public/files')))
}
app.use(log4js.connectLogger(log4js.getLogger("http"), {
    level: 'auto',
    nolog: '\\.gif|\\.jpg$'
}));
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.text({
    type: 'text/*'
}));
app.use(bodyParser.raw());
app.use(cookieParser());
app.use('/api', authority.AuthMiddleware);

//处理webpack服务请求
app.get('/__webpack_hmr', function (req, res) {
    res.send('')
})

app.get('/', (req, res) => {
    res.redirect('index.html');
});

app.get('/files/:filetag', FileSRV.FileResource);

app.post('/api/auth', AuthSRV.AuthResource);
app.post('/api/signout', AuthSRV.SignOutResource);

// system

//common
//commonQuery
app.post('/api/common/components/userSelectDialogControl', services.UserSelectDialogSRV.UserSelectDialogResource);
app.post('/api/common/components/DomainSelectDialogControl', services.DomainSelectDialogSRV.DomainSelectDialogResource);

// baseconfig
app.post('/api/common/baseconfig/FollowerControl', services.FollowerControlSRV.FollowerControlResource);

// system
app.post('/api/common/system/SystemApiControl', services.SystemApiControlSRV.SystemApiControlResource);
app.post('/api/common/system/DomainTemplateControl', services.DomainTemplateControlSRV.DomainTemplateControlResource);
app.post('/api/common/system/DomainControl', services.DomainControlSRV.DomainControlResource);
app.post('/api/common/system/DomainGroupControl', services.DomainGroupControlSRV.DomainGroupControlResource);
app.post('/api/common/system/DomainGroupApiControl', services.DomainGroupApiControlSRV.DomainGroupApiControlResource);
app.post('/api/common/system/OperatorControl', services.OperatorControlSRV.OperatorControlResource);
app.post('/api/common/system/UserSetting', services.UserSettingSRV.UserSettingResource);
app.post('/api/common/system/ResetPassword', services.UserResetPasswordSRV.UserResetPasswordResource);

// farmerbuy
app.post('/api/shenhui/shenhuiControl', services.ShenhuiSRV.ShenhuiResource);
module.exports = app;
