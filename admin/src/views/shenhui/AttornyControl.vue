<template>
<div>
  <section class="content-header">
    <ol class="breadcrumb">
      <li><a href="#"><i class="fa fa-dashboard"></i> 系统管理</a></li>
      <li class="active">律师简介</li>
    </ol>
  </section>
  <section class="content">
    <div class="col-lg-12">
      <div class="box box-info">
        <div class="box-body">
          <div class="margin form-inline">
            <div class="form-group">
              <button id="addM" class="btn btn-info" v-on:click="addM">
                  <i class="glyphicon glyphicon-plus"></i> 新增记录
              </button>
            </div>
          </div>
          <table id="table"></table>
        </div>
      </div>
    </div>
  </section>
  <div class="modal fade" id="AddModal">
    <div class="modal-dialog modal-dialog-width">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
          <h4 class="modal-title">新增记录</h4>
        </div>
        <form @submit.prevent="addOp" id="formA">
          <div class="modal-body">
            <div class="form-group">
              <label><span class="table-required">*</span>标题</label>
              <input class="form-control" v-model="rowData.article_title" data-parsley-required="true" maxlength="50" data-parsley-maxlength="50">
            </div>
            <div class="form-group">
              <label><span class="table-required">*</span>编号</label>
              <input class="form-control" v-model="rowData.article_index" data-parsley-required="true" maxlength="50" data-parsley-maxlength="50">
            </div>
            <div class="form-group">
              <label><span class="table-required">*</span>作者</label>
              <input class="form-control" v-model="rowData.article_author" data-parsley-required="true" maxlength="50" data-parsley-maxlength="50">
            </div>
            <div class="form-group">
              <label><span class="table-required">*</span>头像</label>
              <div class="container" id="crop-avatar" style="padding-left: 0;">
                <span class="form-group fileupload-button">
                  <div class="avatar-view">
                    <img src="/static/images/base/head.jpg" alt="Avatar">
                    <input class="imageupload" type="file" name="file">
                  </div>
                </span>
              </div>
              {{imgurl}}
            </div>
            <div class="form-group">
              <label>内容</label>
              <mavon-editor ref=md v-model="rowData.article_body" @imgAdd="$imgAdd" @imgDel="$imgDel"/>
            </div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary btn-info"><i class="fa fa-fw fa-plus"></i>确认</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
</template>
<script>
const common = require('@/lib/common')
const apiUrl = '/api/shenhui/shenhuiControl?method='

export default {
  data: function () {
    return {
      imgurl: '',
      rowData: {},
      articleImgs: []
    }
  },
  name: 'AttornyControl',
  mounted: function () {
    let _self = this
    let $table = $('#table')

    function initTable() {
      window.tableEvents = {
        'click .tableDelete': function (e, value, row, index) {
          common.rowDeleteWithApi(_self, '删除文章', apiUrl + 'deleteArticle', $table, row, 'article_id', function () { })
        }
      }

      function queryParams(params) {
        return JSON.stringify(params)
      }
      $table.bootstrapTable({
        method: 'POST',
        url: apiUrl + 'searchAttorny',
        queryParams: queryParams,
        sidePagination: 'server',
        ajaxOptions: common.bootstrapTableAjaxOtions,
        responseHandler: function (res) {
          return res.info
        },
        height: common.getTableHeight(),
        columns: [
          common.BTRowFormatEditable('article_title', '标题'),
          common.BTRowFormatEditable('article_img', '头像'),
          common.BTRowFormatEditable('article_index', '编号'),
          common.BTRowFormatEditable('article_author', '作者'),
          common.BTRowFormatEditable('article_body', '内容'),
          common.actFormatter('act', common.operateFormatter, tableEvents)
        ],
        idField: 'article_id',
        uniqueId: 'article_id',
        striped: true,
        clickToSelect: true,
        pagination: true,
        pageSize: 10,
        pageList: [10, 15, 25, 50, 100],
        locale: 'zh-CN',
        onEditableShown: function (field, row, $el, editable) {
          _self.oldRow = $.extend(true, {}, row)
        },
        onEditableSave: function (field, row, oldValue, $el) {
          common.rowModifyWithT(_self, apiUrl + 'modifyArticle', row, 'article_id', $table)
        },
        onPostBody: function () {
          $('[data-name="article_img"]').each(function () {
            $(this).editable({
              type: 'imageEdit',
              placement: 'auto',
              emptytext: '无'
            })
          })
          $('[data-name="article_body"]').each(function () {
            $(this).editable({
              type: 'mavonEdit',
              placement: 'auto',
              emptytext: '无'
            })
          })
        }
      })
      common.changeTableClass($table)
    }

    initTable()

    $('.imageupload').change(function () {
      let maxsize = 2 * 1024 * 1024 // 2M
      let files = this.files
      let fileTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp']
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          let filename = files[i].name
          let nameSplit = filename.split('.')
          let postfix = nameSplit[nameSplit.length - 1]
          let fileTypeFlag = '0'
          for (let idx = 0; idx < fileTypes.length; idx++) {
            if (fileTypes[idx] === postfix) {
              fileTypeFlag = '1'
            }
          }
          if (fileTypeFlag === '0') {
            alert('图片文件必须是jpg、jpeg、png、gif、bmp')
            return
          }
          if (files[i].size > maxsize) {
            alert('最大只允许上传2M的文件')
            return
          }
          let formData = new FormData()
          formData.append('file', files[i])

          _self.$http.post(apiUrl + 'mdupload', formData).then((response) => {
            _self.rowData.article_img = response.data.info.uploadurl
            _self.imgurl = response.data.info.uploadurl
          }, (response) => {
            // error callback
            exports.dealErrorCommon(obj, response)
          })
        }
      }
    })
    // initPage()
  },
  methods: {
    addM: function (event) {
      let _self = this
      _self.rowData = {}
      _self.articleImgs = []
      $('#AddModal').modal('show')
    },
    addOp: function (event) {
      let _self = this
      if ($('#formA').parsley().isValid()) {
        _self.rowData.article_type = 3
        _self.$http.post(apiUrl + 'addArticle', _self.rowData).then((response) => {
          let retData = response.data.info
          $('#table').bootstrapTable('insertRow', {
            index: 0,
            row: retData
          })
          $('#table').bootstrapTable('resetView')
          _self.rowData = {}
          $('#formA').parsley().reset()
          common.dealSuccessCommon('增加成功')
        }, (response) => {
          common.dealErrorCommon(_self, response)
        })
      }
    },
    // 绑定@imgAdd event
    $imgAdd(pos, $file) {
      let _self = this
      // 第一步.将图片上传到服务器.
      let formdata = new FormData()
      formdata.append('file', $file)
      _self.$http.post(apiUrl + 'mdupload', formdata).then((response) => {
        // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
        // $vm.$img2Url 详情见本页末尾
        _self.$refs.md.$img2Url(pos, response.data.info.uploadurl)
        _self.articleImgs.push(response.data.info.uploadurl)
      })
    },
    $imgDel(pos) {
    }
  }
}
</script>
<style scoped>
.modal-dialog-width {
  width: 850px;
}

.avatar-view {
  display: block;
  height: 50px;
  width: 50px;
  border: 3px solid #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  overflow: hidden;
}

.avatar-view img {
  width: 100%;
}
</style>
