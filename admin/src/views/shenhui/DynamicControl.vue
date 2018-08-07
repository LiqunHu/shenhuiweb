<template>
<div>
  <section class="content-header">
    <ol class="breadcrumb">
      <li><a href="#"><i class="fa fa-dashboard"></i> 系统管理</a></li>
      <li class="active">律所动态</li>
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
              <input class="form-control" v-model="rowData.user_username" data-parsley-required="true" maxlength="50" data-parsley-maxlength="50">
            </div>
            <div class="form-group">
              <label><span class="table-required">*</span>作者</label>
              <input class="form-control" v-model="rowData.user_name" data-parsley-required="true" maxlength="50" data-parsley-maxlength="50">
            </div>
            <div class="form-group">
              <label>内容</label>
              <mavon-editor ref=md v-model="mdValue" @imgAdd="$imgAdd" @imgDel="$imgDel"/>
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
      pagePara: {},
      rowData: {},
      oldRow: {},
      mdValue: ''
    }
  },
  name: 'OperatorControl',
  mounted: function () {
    let _self = this
    let $table = $('#table')

    function initTable() {
      window.tableEvents = {
        'click .tableDelete': function (e, value, row, index) {
          common.rowDeleteWithApi(_self, '删除文章', apiUrl + 'delete', $table, row, 'article_id', function () { })
        }
      }

      function queryParams(params) {
        return JSON.stringify(params)
      }
      $table.bootstrapTable({
        method: 'POST',
        url: apiUrl + 'searchDynamic',
        queryParams: queryParams,
        sidePagination: 'server',
        ajaxOptions: common.bootstrapTableAjaxOtions,
        responseHandler: function (res) {
          return res.info
        },
        height: common.getTableHeight(),
        columns: [
          common.BTRowFormatEditable('article_title', '标题'),
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
          common.rowModifyWithT(_self, apiUrl + 'modify', row, 'article_id', $table)
        }
      })
      common.changeTableClass($table)
    }

    initTable()
    // initPage()
  },
  methods: {
    search: function (event) {
      $('#table').bootstrapTable('refresh')
    },
    addM: function (event) {
      let _self = this
      _self.rowData = {}
      $('#usergroup_id').val(null).trigger('change')
      $('#AddModal').modal('show')
    },
    addOp: function (event) {
      let _self = this
      if ($('#formA').parsley().isValid()) {
        _self.rowData.usergroup_id = common.getSelect2Val('usergroup_id')
        _self.$http.post(apiUrl + 'add', _self.rowData).then((response) => {
          let retData = response.data.info
          $('#table').bootstrapTable('insertRow', {
            index: 0,
            row: retData
          })
          $('#table').bootstrapTable('resetView')
          _self.rowData = {}
          $('#usergroup_id').val(null).trigger('change')
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
        console.log(response)
        _self.$refs.md.$img2Url(pos, response.data.info.uploadurl)
        _self.$refs.md.$refs.toolbar_left.$imgUpdateByFilename(pos, response.data.info.uploadurl)
      })
    },
    $imgDel(pos) {
      let _self = this
      console.log(pos)
    }
  }
}
</script>
<style scoped>
.modal-dialog-width {
  width: 790px;
}
</style>
