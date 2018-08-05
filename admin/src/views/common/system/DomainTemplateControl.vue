<template>
<div>
  <section class="content-header">
    <ol class="breadcrumb">
      <li><a href="#"><i class="fa fa-dashboard"></i> 系统管理</a></li>
      <li class="active">机构模板维护</li>
    </ol>
  </section>
  <section class="content">
    <div class="row">
      <div class="col-xs-12">
        <div class="box box-info">
          <div class="box-body">
            <div class="margin form-inline">
              <div class="form-group">
                <div class="form-group">
                  <button class="btn btn-primary btn-info" v-on:click="addT">
                      <i class="glyphicon glyphicon-plus"></i> 增加模板
                  </button>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <table class="table" id="templateTable"></table>
            </div>
            <div class="col-md-9">
              <div class="col-md-5" style="overflow:hidden">
                <h5>系统功能</h5>
                <ul id="systemtree" class="ztree"></ul>
              </div>
              <div class="col-md-7">
                <div class="col-md-1 modal-height vertical-container">
                  <div class="btn-group-vertical">
                    <button type="button" class="btn btn-primary btn-icon" @click="addMenu"><i class="glyphicon glyphicon-chevron-right"></i></button>
                  </div>
                </div>
                <div class="col-md-11">
                  <h5>模板功能</h5>
                  <div class="btn-group">
                    <a class="btn btn-block btn-default btn-sm" @click="addF"><span>增加目录</span></a>
                  </div>
                  <div>
                    <ul id="templatetree" class="ztree"></ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <div class="modal fade" id="TModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
          <h4 class="modal-title">模板</h4>
        </div>
        <form class="form-horizontal" @submit.prevent="submitT" id="formT">
          <div class="modal-body">
            <div class="form-group">
              <label class="col-md-3 control-label">模板名称</label>
              <div class="col-md-9">
                <input class="form-control" v-model="workRow.domaintemplate_name" data-parsley-required="true" maxlength="50" data-parsley-maxlength="50">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-info">
                <i class="fa fa-fw fa-plus"></i>提交
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div class="modal fade" id="FModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
          <h4 class="modal-title">目录</h4>
        </div>
        <form class="form-horizontal" @submit.prevent="submitF" id="formF">
          <div class="modal-body">
            <div class="form-group">
              <label class="col-md-3 control-label">目录名称</label>
              <div class="col-md-9">
                <input class="form-control" v-model="workRow.templatemenu_name" data-parsley-required="true" maxlength="50" data-parsley-maxlength="50">
              </div>
            </div>
            <div class="form-group">
              <label class="col-md-3 control-label">图标</label>
              <div class="col-md-9">
                <div class="input-group">
                  <input class="form-control" id="iconName" data-parsley-required="true">
                  <span class="input-group-btn">
                    <button type="button" class="btn btn-info" data-toggle="modal" data-target="#modalTable" @click="showIcon">
                        <i class="fa fa-fw fa-search"></i>选择
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-info">
                <i class="fa fa-fw fa-plus"></i>提交
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div class="modal fade" id="modalTable">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
          <h4 class="modal-title">图标选择</h4>
        </div>
        <div class="modal-body">
          <table id="iconTable" data-height="299" data-toggle="table">
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" data-dismiss="modal"><i class="fa fa-fw fa-close"></i>关闭</button>
        </div>
      </div>
      <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
  </div>
  <!-- /.modal -->
</div>
</template>
<script>
const common = require('@/lib/common')
const apiUrl = '/api/common/system/DomainTemplateControl?method='

export default {
  data: function () {
    return {
      pagePara: {},
      workRow: {},
      actTemplate: null,
      actNode: {},
      act: '' // 1新增 2修改
    }
  },
  name: 'DomainTemplateControl',
  mounted: function () {
    let _self = this
    let $templateTable = $('#templateTable')
    window.tableEvents = {
      'click .tableDelete': function (e, value, row, index) {
        common.rowDeleteWithApi(_self, '删除模板', apiUrl + 'deleteTemplate', $templateTable, row, 'domaintemplate_id', function () { })
      },
      'click .templatechoose': async function (e, value, row, index) {
        _self.actTemplate = JSON.parse(JSON.stringify(row))
        _self.getTemplateMenu(row.domaintemplate_id)
      }
    }

    function rowStyle(row, index) {
      return {
        classes: 'info'
      }
    }

    function templateNameFormatter(value, row) {
      return `<button type="button" class="btn btn-primary btn-sm m-r-5 m-b-5 templatechoose">` + value + `</button>`
    }

    function iconDisplayFormatter(value, row) {
      return '<i class="fa fa-fw ' + row.iconSource + '"></i>'
    }

    function initTable() {
      $templateTable.bootstrapTable({
        classes: 'table-no-bordered',
        columns: [
          common.BTRowFormatWithFE('domaintemplate_name', '模板名称', templateNameFormatter, tableEvents),
          common.actFormatter('act', common.operateFormatter, tableEvents)
        ],
        idField: 'domaintemplate_id',
        uniqueId: 'domaintemplate_id',
        rowStyle: rowStyle,
        formatLoadingMessage: function () {
          return '请稍等，正在加载中...'
        },
        formatNoMatches: function () {
          return ''
        }
      })
      common.changeTableClass($templateTable)

      $('#iconTable').bootstrapTable({
        columns: [{
          field: 'id',
          align: 'center',
          title: '序号'
        },
        common.BTRowFormatWithFormatter('iconDisplay', '图标', iconDisplayFormatter),
        common.BTRowFormat('iconSource', '图标代码')
        ],
        onClickRow: function (row, $element) {
          $('#iconName').val(row.iconSource)

          $('#modalTable').modal('hide')
        },
        formatLoadingMessage: function () {
          return '请稍等，正在加载中...'
        },
        formatNoMatches: function () {
          return '无符合条件的记录'
        }
      })
      common.changeTableClass($('#iconTable'))
    }

    async function initPage() {
      try {
        let response = await _self.$http.post(apiUrl + 'init', {})
        let retData = response.data.info
        _self.pagePara = JSON.parse(JSON.stringify(retData))
        let treeObj = $.fn.zTree.init($('#systemtree'), {
          check: {
            enable: true,
            chkboxType: {
              'Y': 'ps',
              'N': 'ps'
            }
          }
        }, retData.sysmenus)
        treeObj.expandAll(true)

        initTable()
        _self.getTemplateData()
        $('#formT').parsley()
        $('#formF').parsley()
        console.log('init success')
      } catch (error) {
        common.dealErrorCommon(_self, error)
      }
    }

    initPage()
  },
  methods: {
    showIcon: function (event) {
      let data = require('../../../components/data/icon.json')
      $('#modalTable').on('shown.bs.modal', function () {
        $('#iconTable').bootstrapTable('load', {
          data: data
        })
      })
    },
    getTemplateData: async function (event) {
      let _self = this
      try {
        let response = await _self.$http.post(apiUrl + 'searchTemplate', {})
        let retData = response.data.info
        $('#templateTable').bootstrapTable('load', {
          data: retData
        })
      } catch (error) {
        common.dealErrorCommon(_self, error)
      }
    },
    getTemplateMenu: async function (domaintemplateId) {
      let _self = this

      function zTreeBeforeEditName(treeId, treeNode) {
        if (treeNode.getPath().length === 1) {
          common.dealWarningCommon('根节点不能改名')
          return false
        }
        if (treeNode.node_type === '01') {
          common.dealWarningCommon('菜单不能改名')
          return false
        }
        _self.act = '2'
        _self.workRow = {}
        _self.workRow.templatemenu_id = treeNode.templatemenu_id
        _self.workRow.templatemenu_name = treeNode.templatemenu_name
        $('#iconName').val(treeNode.templatemenu_icon)
        $('#formF').parsley().reset()
        $('#FModal').modal('show')
        return false
      }

      function zTreeBeforeRemove(treeId, treeNode) {
        if (treeNode.getPath().length === 1) {
          common.dealWarningCommon('根节点不能删除')
          return false
        }
        common.dealConfrimCommon('确认要删除?', function () {
          _self.deleteSelect(treeNode)
        })
        return false
      }

      try {
        let response = await _self.$http.post(apiUrl + 'searchTemplateMenu', {
          domaintemplate_id: domaintemplateId
        })
        let retData = response.data.info

        $.fn.zTree.destroy('templatetree')
        let treeObj = $.fn.zTree.init($('#templatetree'), {
          edit: {
            enable: true
          },
          callback: {
            beforeRemove: zTreeBeforeRemove,
            beforeEditName: zTreeBeforeEditName
          }
        }, retData)
        treeObj.expandAll(true)
      } catch (error) {
        common.dealErrorCommon(_self, error)
      }
    },
    addT: function (event) {
      let _self = this
      _self.workRow = {}
      _self.workRow.domaintemplate_name = ''
      $('#formT').parsley().reset()
      $('#TModal').modal('show')
    },
    submitT: async function (event) {
      let _self = this
      try {
        if ($('#formT').parsley().isValid()) {
          await _self.$http.post(apiUrl + 'addTemplate', _self.workRow)
          $('#TModal').modal('hide')
          _self.getTemplateData()
        }
      } catch (error) {
        common.dealErrorCommon(_self, error)
      }
    },
    addF: function (event) {
      let _self = this
      _self.workRow = {}
      _self.workRow.templatemenu_name = ''
      $('#iconName').val('')
      let nodeObj = $.fn.zTree.getZTreeObj('templatetree').getSelectedNodes()
      if (nodeObj && nodeObj.length > 0) {
        if (nodeObj[0].getPath().length > 2) {
          return common.dealWarningCommon('系统最多只支持2级菜单')
        }
        if (nodeObj[0].node_type === '01') {
          return common.dealWarningCommon('菜单下不允许新增')
        }
        _self.actNode = JSON.parse(JSON.stringify(nodeObj[0]))
      } else {
        return common.dealWarningCommon('请选择一个节点')
      }
      $('#formF').parsley().reset()
      _self.act = '1'
      $('#FModal').modal('show')
    },
    submitF: async function (event) {
      let _self = this
      try {
        if ($('#formF').parsley().isValid()) {
          _self.workRow.parent_id = _self.actNode.templatemenu_id
          _self.workRow.domaintemplate_id = _self.actTemplate.domaintemplate_id
          _self.workRow.templatemenu_icon = $('#iconName').val()

          if (_self.act === '1') {
            await _self.$http.post(apiUrl + 'addFolder', _self.workRow)
          } else {
            await _self.$http.post(apiUrl + 'modifyFolder', _self.workRow)
          }
          $('#FModal').modal('hide')
          _self.getTemplateMenu(_self.actTemplate.domaintemplate_id)
        }
      } catch (error) {
        common.dealErrorCommon(_self, error)
      }
    },
    addMenu: async function (event) {
      let _self = this
      try {
        if (!_self.actTemplate) {
          return common.dealWarningCommon('请选择要操作的模板')
        }
        let systemtreeObj = $.fn.zTree.getZTreeObj('systemtree')
        let nodes = systemtreeObj.getCheckedNodes(true)
        let menus = []
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].node_type === '01') {
            menus.push(nodes[i])
          }
        }
        if (menus.length < 1) {
          return common.dealWarningCommon('请在系统功能中选择要增加的菜单')
        }

        let nodeObj = $.fn.zTree.getZTreeObj('templatetree').getSelectedNodes()
        if (nodeObj && nodeObj.length > 0) {
          if (nodeObj[0].node_type === '01') return common.dealWarningCommon('菜单下不允许新增')
          _self.actNode = JSON.parse(JSON.stringify(nodeObj[0]))
        } else {
          return common.dealWarningCommon('请在模板功能中选择需要增加功能的目录')
        }

        await _self.$http.post(apiUrl + 'addMenus', {
          domaintemplate_id: _self.actTemplate.domaintemplate_id,
          parent_id: _self.actNode.templatemenu_id,
          menus: menus
        })

        systemtreeObj.checkAllNodes(false)
        _self.getTemplateMenu(_self.actTemplate.domaintemplate_id)
      } catch (error) {
        common.dealErrorCommon(_self, error)
      }
    },
    deleteSelect: async function (treeNode, event) {
      let _self = this
      try {
        await _self.$http.post(apiUrl + 'deleteSelect', {
          templatemenu_id: treeNode.templatemenu_id
        })
        _self.getTemplateMenu(_self.actTemplate.domaintemplate_id)
      } catch (error) {
        common.dealErrorCommon(_self, error)
      }
    }
  }
}
</script>
<style scoped>
.vertical-container {
  height: 300px;
  display: -webkit-flex;
  display: flex;
  -webkit-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  justify-content: center;
}
</style>
