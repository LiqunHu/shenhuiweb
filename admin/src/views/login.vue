<template>
<div class="login-box">
  <div class="login-logo">
    <a href="/"><b>Test</b> Co.</a>
  </div>
  <!-- /.login-logo -->
  <div class="login-box-body">
    <p class="login-box-msg">登录进入工作台</p>

    <div>
      <div class="alert alert-danger" v-bind:class="{ 'hidden': isA }">{{ errorMessage }}</div>
      <div class="form-group has-feedback">
        <input v-model="username" type="text" class="form-control" placeholder="用户名">
        <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
      </div>
      <div class="form-group has-feedback">
        <input v-model="password" type="password" class="form-control" placeholder="密码">
        <span class="glyphicon glyphicon-lock form-control-feedback"></span>
      </div>
      <div class="row">
        <div class="col-xs-4">
          <button v-on:click="login" class="btn btn-primary btn-block btn-flat">登录</button>
        </div>
        <!-- /.col -->
      </div>
    </div>

    <div class="social-auth-links text-center">
      <p></p>
    </div>
    <!-- /.social-auth-links -->

    <a href="#">忘记密码</a><br>
    <a href="register.html" class="text-center">注册新账户</a>

  </div>
  <!-- /.login-box-body -->
</div>
<!-- /.login-box -->
</template>
<script>
const common = require('@/lib/common')

export default {
  name: 'login',
  data: function () {
    return {
      username: '',
      password: '',
      errorMessage: '',
      isA: true
    }
  },
  mounted: function () {
    $('body').removeClass()
    $('body').addClass('hold-transition')
    $('body').addClass('login-page')
  },
  methods: {
    login: function (event) {
      let _self = this
      let encInfo = common.aesEncryptModeCFB(this.username, this.password)
      _self.$http.post('/api/auth', {
        username: this.username,
        identifyCode: encInfo[1],
        magicNo: encInfo[0],
        loginType: 'WEB'
      }).then(function (response) {
        let token = response.headers.authorization
        if (token) {
          let userinfo = response.data.info
          if (!userinfo.avatar) userinfo.avatar = '/static/images/base/head.jpg'
          common.clearStoreData()
          common.setStoreData('token', token)
          common.setStoreData('userinfo', userinfo)
          _self.$router.push({
            path: '/common/system/home'
          })
        } else {
          _self.errorMessage = '系统错误'
          _self.isA = false
          common.clearStoreData()
        }
      }).catch(function (error) {
        _self.errorMessage = '用户名或者密码错误'
        _self.isA = false
        common.clearStoreData()
      })
    }
  }
}
</script>
<style>
</style>
