<template>
<div>
  <section class="content-header">
    <ol class="breadcrumb">
      <li><a href="#"><i class="fa fa-dashboard"></i> 系统管理</a></li>
      <li class="active">员工维护</li>
    </ol>
  </section>
  <section class="content">
    <div class="col-lg-12">
      <div class="box box-info">
        <div class="box-body">
          <div class="margin form-inline">
            <div class="form-group">
              <input class="form-control" id="search_text" placeholder="搜索用户名、姓名、电话" style="width: 200px;">
            </div>
            <div class="form-group">
              <button class="btn btn-info" v-on:click="search"><i class="fa fa-search"></i></button>
            </div>
            <div class="form-group  pull-right">
              <button id="addM" class="btn btn-info" v-on:click="addM">
                  <i class="glyphicon glyphicon-plus"></i> 新增员工
              </button>
            </div>
          </div>
          <table id="table"></table>
        </div>
      </div>
    </div>
  </section>
  <div class="modal fade" id="AddModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
          <h4 class="modal-title">新增员工</h4>
        </div>
        <form @submit.prevent="addOp" id="formA">
          <div class="modal-body">
            <div class="form-group">
              <label><span class="table-required">*</span>用户名</label>
              <input class="form-control" v-model="rowData.user_username" data-parsley-required="true" maxlength="50" data-parsley-maxlength="50">
            </div>
            <div class="form-group">
              <label><span class="table-required">*</span>姓名</label>
              <input class="form-control" v-model="rowData.user_name" data-parsley-required="true" maxlength="50" data-parsley-maxlength="50">
            </div>
            <div class="form-group">
              <label>邮箱</label>
              <input type="emain" class="form-control" v-model="rowData.user_email" data-parsley-type="email">
            </div>
            <div class="form-group">
              <label>手机</label>
              <input class="form-control" v-model="rowData.user_phone" data-parsley-phone="true">
            </div>
            <div class="form-group">
              <label><span class="table-required">*</span>用户组</label>
              <select class="form-control select2" id="usergroup_id" data-parsley-required="true"></select>
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
          common.BTRowFormatEdSelect2('usergroup_id', '用户组', _self.pagePara.groupInfo),
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
      _self.$http.post(apiUrl + 'init', {}).then((response) => {
        let retData = response.data.info
        _self.pagePara = $.extend(true, {}, retData)
        common.initSelect2($('#usergroup_id'), retData.groupInfo)
        initTable()
        $('#formA').parsley()
        console.log('init success')
      }, (response) => {
        console.log('init error')
        common.dealErrorCommon(_self, response)
      })
    }

    $(function () {
      initPage()
    })
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
</style>
