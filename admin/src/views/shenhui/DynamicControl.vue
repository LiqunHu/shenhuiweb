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
              <textarea class="form-control"  id="editor1" name="editor1" rows="20" cols="80">
                                            This is my textarea to be replaced with CKEditor.
              </textarea>
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
const apiUrl = '/api/common/system/OperatorControl?method='

export default {
  data: function () {
    return {
      pagePara: {},
      rowData: {},
      oldRow: {}
    }
  },
  name: 'OperatorControl',
  mounted: function () {
    let _self = this
    let $table = $('#table')

    function initTable() {
      window.tableEvents = {
        'click .tableDelete': function (e, value, row, index) {
          common.rowDeleteWithApi(_self, '用户删除', apiUrl + 'delete', $table, row, 'user_id', function () { })
        }
      }

      function queryParams(params) {
        params.search_text = $('#search_text').val()
        return JSON.stringify(params)
      }
      $table.bootstrapTable({
        method: 'POST',
        url: apiUrl + 'search',
        queryParams: queryParams,
        sidePagination: 'server',
        ajaxOptions: common.bootstrapTableAjaxOtions,
        responseHandler: function (res) {
          return res.info
        },
        height: common.getTableHeight(),
        columns: [
          common.BTRowFormat('user_username', '用户名'),
          common.BTRowFormatEditable('user_name', '姓名'),
          common.BTRowFormatEditable('user_phone', '电话'),
          common.BTRowFormatEditable('user_email', '邮箱'),
          common.BTRowFormatEdSelect2(_self, 'usergroup_id', '用户组', 'groupInfo'),
          common.actFormatter('act', common.operateFormatter, tableEvents)
        ],
        idField: 'user_id',
        uniqueId: 'user_id',
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
          common.rowModifyWithT(_self, apiUrl + 'modify', row, 'user_id', $table)
        }
      })
      common.changeTableClass($table)
    }

    function initPage() {
      CKEDITOR.replace('editor1')
      _self.$http.post(apiUrl + 'init', {}).then((response) => {
        let retData = response.data.info
        _self.pagePara = $.extend(true, {}, retData)
        initTable()
        $('#formA').parsley()
        console.log('init success')
      }, (response) => {
        console.log('init error')
        common.dealErrorCommon(_self, response)
      })
    }

    initPage()
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
    }
  }
}
</script>
<style scoped>
.modal-dialog-width {
  width: 790px;
}
</style>
