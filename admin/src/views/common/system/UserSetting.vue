<template>
<!-- Content Wrapper. Contains page content -->
<div>
  <section class="content-header">
    <ol class="breadcrumb">
      <li><a href="#"><i class="fa fa-dashboard"></i> 系统管理</a></li>
      <li class="active">用户设置</li>
    </ol>
  </section>
  <section class="content">
    <!-- end breadcrumb -->
    <div class="row">
      <div class="col-md-3">

        <!-- Profile Image -->
        <div class="box box-primary">
          <div class="box-body box-profile">
            <img class="profile-user-img img-responsive img-circle" :src="userinfo.avatar" alt="User profile picture">
            <h3 class="profile-username text-center">{{ userinfo.name }}</h3>
          </div>
          <!-- /.box-body -->
        </div>
        <!-- /.box -->

        <!-- About Me Box -->
        <div class="box box-primary">
          <div class="box-header with-border">
            <h3 class="box-title">About Me</h3>
          </div>
          <!-- /.box-header -->
          <div class="box-body">
          </div>
          <!-- /.box-body -->
        </div>
        <!-- /.box -->
      </div>
      <!-- /.col -->
      <div class="col-md-9">
        <div class="nav-tabs-custom">
          <ul class="nav nav-tabs">
            <li class="active"><a href="#settings" data-toggle="tab">设置</a></li>
            <li><a href="#passset" data-toggle="tab">修改密码</a></li>
          </ul>
          <div class="tab-content">
            <div class="tab-pane active" id="settings">
              <div class="form-horizontal">
                <div class="form-group">
                  <label class="col-sm-2 control-label">头像</label>
                  <div class="col-sm-10">
                    <div class="container" id="crop-avatar" style="padding-left: 0;">
                      <!-- Current avatar -->
                      <div class="avatar-view" title="" data-original-title="Change the avatar">
                        <img :src="userinfo.avatar" alt="Avatar">
                      </div>

                      <!-- Cropping modal -->
                      <div class="modal fade" id="avatar-modal" aria-hidden="true" aria-labelledby="avatar-modal-label" role="dialog" tabindex="-1" style="display: none;">
                        <div class="modal-dialog modal-lg">
                          <div class="modal-content">
                            <form class="avatar-form" enctype="multipart/form-data" method="post">
                              <div class="modal-header">
                                <button class="close" data-dismiss="modal" type="button">×</button>
                                <h4 class="modal-title" id="avatar-modal-label">更换头像</h4>
                              </div>
                              <div class="modal-body">
                                <div class="avatar-body">
                                  <!-- Upload image and data -->
                                  <div class="avatar-upload">
                                    <input class="avatar-src" name="avatar_src" type="hidden">
                                    <input class="avatar-data" name="avatar_data" type="hidden" value="">
                                    <label for="avatarInput">头像上传</label>
                                    <input class="avatar-input" id="avatarInput" name="avatar_file" type="file">
                                  </div>

                                  <!-- Crop and preview -->
                                  <div class="row">
                                    <div class="col-md-9">
                                      <div class="avatar-wrapper"></div>
                                    </div>
                                    <div class="col-md-3">
                                      <div class="avatar-preview preview-lg" style="width: 184px; height: 184px;"></div>
                                      <div class="avatar-preview preview-md" style="width: 100px; height: 100px;"></div>
                                      <div class="avatar-preview preview-sm" style="width: 50px; height: 50px;"></div>
                                    </div>
                                  </div>

                                  <div class="row avatar-btns">
                                    <div class="col-md-9">
                                      <!--
                                        <div class="btn-group">
                                          <button class="btn btn-primary" data-method="rotate" data-option="-90" type="button" title="Rotate -90 degrees">左转</button>
                                          <button class="btn btn-primary" data-method="rotate" data-option="-15" type="button">-15度</button>
                                          <button class="btn btn-primary" data-method="rotate" data-option="-30" type="button">-30度</button>
                                          <button class="btn btn-primary" data-method="rotate" data-option="-45" type="button">-45度</button>
                                        </div>
                                        <div class="btn-group">
                                          <button class="btn btn-primary" data-method="rotate" data-option="90" type="button" title="Rotate 90 degrees">右转</button>
                                          <button class="btn btn-primary" data-method="rotate" data-option="15" type="button">15度</button>
                                          <button class="btn btn-primary" data-method="rotate" data-option="30" type="button">30度</button>
                                          <button class="btn btn-primary" data-method="rotate" data-option="45" type="button">45度</button>
                                        </div>
                                      -->
                                    </div>
                                    <div class="col-md-3">
                                      <button class="btn btn-info avatar-save" type="submit">完成</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                      <!-- /.modal -->

                      <!-- Loading state -->
                      <div class="loading" aria-label="Loading" role="img" tabindex="-1"></div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-sm-2 control-label">用户名</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="userinfo.username" placeholder="用户名" disabled>
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-sm-2 control-label">姓名</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="userinfo.name" placeholder="姓名">
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-sm-2 control-label">手机</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="userinfo.phone" placeholder="手机">
                  </div>
                </div>
                <div class="form-group">
                  <div class="col-sm-offset-2 col-sm-10">
                    <button class="btn btn-info" v-on:click="changeInfo">提交</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="tab-pane" id="passset">
              <div class="form-horizontal">
                <div class="form-group">
                  <label for="oldPassword" class="col-sm-2 control-label">原密码</label>
                  <div class="col-sm-5">
                    <input type="password" class="form-control" v-model="oldPassword" placeholder="原密码">
                  </div>
                </div>
                <div class="form-group">
                  <label for="password" class="col-sm-2 control-label">新密码</label>
                  <div class="col-sm-5">
                    <input type="password" class="form-control" v-model="password" placeholder="新密码">
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-sm-2 control-label">再次输入</label>
                  <div class="col-sm-5">
                    <input type="password" class="form-control" v-model="repassword" placeholder="再次输入">
                  </div>
                </div>
                <div class="form-group">
                  <div class="col-sm-offset-2 col-sm-10">
                    <button class="btn btn-info" v-on:click="changePwd">提交</button>
                  </div>
                </div>
              </div>
            </div>
            <!-- /.tab-pane -->
          </div>
          <!-- /.tab-content -->
        </div>
      </div>
      <!-- /.col -->
    </div>
  </section>
</div>
</template>
<script>
const common = require('@/lib/common')
const CryptoJS = require('crypto-js')
const apiUrl = '/api/common/system/UserSetting?method='

export default {
  data: function () {
    return {
      userinfo: common.getStoreData('userinfo'),
      inputMobile: '',
      avatar: '',
      oldPassword: '',
      password: '',
      repassword: ''
    }
  },
  name: 'UserSettingControl',
  route: {
    canReuse: false
  },
  mounted: function () {
    let _self = this

    function CropAvatar($element) {
      this.$container = $element

      this.$avatarView = this.$container.find('.avatar-view')
      this.$avatar = this.$avatarView.find('img')
      this.$avatarModal = this.$container.find('#avatar-modal')
      this.$loading = this.$container.find('.loading')

      this.$avatarForm = this.$avatarModal.find('.avatar-form')
      this.$avatarUpload = this.$avatarForm.find('.avatar-upload')
      this.$avatarSrc = this.$avatarForm.find('.avatar-src')
      this.$avatarData = this.$avatarForm.find('.avatar-data')
      this.$avatarInput = this.$avatarForm.find('.avatar-input')
      this.$avatarSave = this.$avatarForm.find('.avatar-save')
      this.$avatarBtns = this.$avatarForm.find('.avatar-btns')

      this.$avatarWrapper = this.$avatarModal.find('.avatar-wrapper')
      this.$avatarPreview = this.$avatarModal.find('.avatar-preview')

      this.init()
    }

    CropAvatar.prototype = {
      constructor: CropAvatar,

      support: {
        fileList: !!$('<input type="file">').prop('files'),
        blobURLs: !!window.URL && URL.createObjectURL,
        formData: !!window.FormData
      },
      init: function () {
        this.support.datauri = this.support.fileList && this.support.blobURLs

        if (!this.support.formData) {
          this.initIframe()
        }

        this.initTooltip()
        this.initModal()
        this.addListener()
      },
      addListener: function () {
        this.$avatarView.on('click', $.proxy(this.click, this))
        this.$avatarInput.on('change', $.proxy(this.change, this))
        this.$avatarForm.on('submit', $.proxy(this.submit, this))
        this.$avatarBtns.on('click', $.proxy(this.rotate, this))
      },
      initTooltip: function () {
        this.$avatarView.tooltip({
          placement: 'bottom'
        })
      },
      initModal: function () {
        this.$avatarModal.modal({
          show: false
        })
      },

      initPreview: function () {
        let url = this.$avatar.attr('src')

        this.$avatarPreview.empty().html('<img src="' + url + '">')
      },

      initIframe: function () {
        let target = 'upload-iframe-' + (new Date()).getTime()
        let $iframe = $('<iframe>').attr({
          name: target,
          src: ''
        })
        let _this = this

        // Ready ifrmae
        $iframe.one('load', function () {
          // respond response
          $iframe.on('load', function () {
            let data

            try {
              data = $(this).contents().find('body').text()
            } catch (e) {
              console.log(e.message)
            }

            if (data) {
              try {
                data = $.parseJSON(data)
              } catch (e) {
                console.log(e.message)
              }

              _this.submitDone(data)
            } else {
              _this.submitFail('Image upload failed!')
            }

            _this.submitEnd()
          })
        })

        this.$iframe = $iframe
        this.$avatarForm.attr('target', target).after($iframe.hide())
      },

      click: function () {
        this.$avatarModal.modal('show')
        this.initPreview()
      },

      change: function () {
        let files,
          file

        if (this.support.datauri) {
          files = this.$avatarInput.prop('files')

          if (files.length > 0) {
            file = files[0]

            if (this.isImageFile(file)) {
              if (this.url) {
                URL.revokeObjectURL(this.url) // Revoke the old one
              }

              this.url = URL.createObjectURL(file)
              this.startCropper()
            }
          }
        } else {
          file = this.$avatarInput.val()

          if (this.isImageFile(file)) {
            this.syncUpload()
          }
        }
      },

      submit: function () {
        if (!this.$avatarSrc.val() && !this.$avatarInput.val()) {
          return false
        }

        if (this.support.formData) {
          this.ajaxUpload()
          return false
        }
      },

      rotate: function (e) {
        let data

        if (this.active) {
          data = $(e.target).data()

          if (data.method) {
            this.$img.cropper(data.method, data.option)
          }
        }
      },

      isImageFile: function (file) {
        if (file.type) {
          return /^image\/\w+$/.test(file.type)
        } else {
          return /\.(jpg|jpeg|png|gif)$/.test(file)
        }
      },

      startCropper: function () {
        let _this = this

        if (this.active) {
          this.$img.cropper('replace', this.url)
        } else {
          this.$img = $('<img src="' + this.url + '">')
          this.$avatarWrapper.empty().html(this.$img)
          this.$img.cropper({
            aspectRatio: 1,
            preview: this.$avatarPreview.selector,
            strict: false,
            crop: function (data) {
              let json = [
                '{"x":' + data.x,
                '"y":' + data.y,
                '"height":' + data.height,
                '"width":' + data.width,
                '"rotate":' + data.rotate + '}'
              ].join()

              _this.$avatarData.val(json)
            }
          })

          this.active = true
        }
      },

      stopCropper: function () {
        if (this.active) {
          this.$img.cropper('destroy')
          this.$img.remove()
          this.active = false
        }
      },

      ajaxUpload: function () {
        let data = new FormData(this.$avatarForm[0])
        let _this = this

        $.ajax(apiUrl + 'upload', {
          type: 'post',
          data: data,
          dataType: 'json',
          headers: {
            'authorization': common.getStoreData('token')
          },
          processData: false,
          contentType: false,

          beforeSend: function () {
            _this.submitStart()
          },

          success: function (data) {
            _this.submitDone(data)
          },

          error: function (XMLHttpRequest, textStatus, errorThrown) {
            _this.submitFail(textStatus || errorThrown)
          },

          complete: function () {
            _this.submitEnd()
          }
        })
      },

      syncUpload: function () {
        this.$avatarSave.click()
      },

      submitStart: function () {
        this.$loading.fadeIn()
      },

      submitDone: function (data) {
        if ($.isPlainObject(data) && data.errno === 0) {
          if (data.info) {
            this.url = data.info.uploadurl
            _self.avatar = data.info.uploadurl

            if (this.support.datauri || this.uploaded) {
              this.uploaded = false
              this.cropDone()
            } else {
              this.uploaded = true
              this.$avatarSrc.val(this.url)
              this.startCropper()
            }

            this.$avatarInput.val('')
          } else if (data.message) {
            this.alert(data.message)
          }
        } else {
          this.alert('Failed to response')
        }
      },

      submitFail: function (msg) {
        this.alert(msg)
      },

      submitEnd: function () {
        this.$loading.fadeOut()
      },

      cropDone: function () {
        this.$avatarForm.get(0).reset()
        this.$avatar.attr('src', this.url)
        this.stopCropper()
        this.$avatarModal.modal('hide')
      },

      alert: function (msg) {
        let $alert = [
          '<div class="alert alert-danger avater-alert">',
          '<button type="button" class="close" data-dismiss="alert">&times;</button>',
          msg,
          '</div>'
        ].join('')

        this.$avatarUpload.after($alert)
      }
    }

    return new CropAvatar($('#crop-avatar'))
  },
  methods: {
    changeInfo: function (event) {
      // `this` inside methods points to the Vue instance
      let _self = this
      _self.$http.post(apiUrl + 'modify', {
        name: _self.userinfo.name,
        phone: _self.userinfo.phone,
        avatar: _self.avatar
      }).then((response) => {
        common.dealSuccessCommon('信息修改成功, 请重新登录')
        common.clearStoreData()
        _self.$router.push({
          path: '/'
        })
        console.log('add success')
      }, (response) => {
        common.dealErrorCommon(_self, response)
      })
    },
    changePwd: function (event) {
      let _self = this
      if (!_self.oldPassword) {
        return common.dealWarningCommon('请输入原密码')
      }
      if (!_self.password) {
        return common.dealWarningCommon('请输入密码')
      }
      if (_self.repassword !== _self.password) {
        return common.dealWarningCommon('两次密码不一致')
      }
      _self.$http.post(apiUrl + 'setpwd', {
        oldPwd: CryptoJS.MD5(_self.oldPassword).toString(),
        pwd: _self.password
      }).then((response) => {
        common.dealSuccessCommon('修改密码成功, 请重新登录')
        common.clearStoreData()
        _self.$router.push({
          path: '/login'
        })
        console.log('add success')
      }, (response) => {
        common.dealErrorCommon(_self, response)
      })
    }
  }
}
</script>
<style scoped>
.avatar-view {
  display: block;
  height: 178px;
  width: 178px;
  border: 3px solid #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  overflow: hidden;
}

.avatar-view img {
  width: 100%;
}

.avatar-body {
  padding-right: 15px;
  padding-left: 15px;
}

.avatar-upload {
  overflow: hidden;
}

.avatar-upload label {
  display: block;
  float: left;
  clear: left;
  width: 100px;
}

.avatar-upload input {
  display: block;
  margin-left: 110px;
}

.avater-alert {
  margin-top: 10px;
  margin-bottom: 10px;
}

.avatar-wrapper {
  height: 364px;
  width: 100%;
  margin-top: 15px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.25);
  background-color: #fcfcfc;
  overflow: hidden;
}

.avatar-wrapper img {
  display: block;
  height: auto;
  max-width: 100%;
}

.avatar-preview {
  float: left;
  margin-top: 15px;
  margin-right: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #fff;
  overflow: hidden;
}

.avatar-preview:hover {
  border-color: #ccf;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
}

.avatar-preview img {
  width: 100%;
}

.preview-lg {
  height: 184px;
  width: 184px;
  margin-top: 15px;
}

.preview-md {
  height: 100px;
  width: 100px;
}

.preview-sm {
  height: 50px;
  width: 50px;
}

@media (min-width: 992px) {
  .avatar-preview {
    float: none;
  }
}

.avatar-btns {
  margin-top: 30px;
  margin-bottom: 15px;
}

.avatar-btns .btn-group {
  margin-right: 5px;
}

.loading {
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #fff url('/static/images/base/loading.gif') no-repeat center
    center;
  opacity: 0.75;
  filter: alpha(opacity=75);
  z-index: 20140628;
}
</style>
