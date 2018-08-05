<template>
<div>
  <section class="content-header">
    <ol class="breadcrumb">
      <li><a href="#"><i class="fa fa-dashboard"></i> 系统管理</a></li>
      <li class="active">机构维护</li>
    </ol>
  </section>
  <section class="content">
    <div class="col-lg-12">
      <div class="box box-info">
        <div class="box-body">
          <div class="margin form-inline">
            <div class="form-group">
              <input class="form-control" id="search_text" placeholder="搜索编号、名称、地址等" style="width: 200px;">
            </div>
            <div class="form-group">
              <button class="btn btn-info" v-on:click="search"><i class="fa fa-search"></i></button>
            </div>
            <div class="form-group  pull-right">
              <button id="addM" class="btn btn-info" v-on:click="addM">
                <i class="glyphicon glyphicon-plus"></i> 增加
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
          <h4 class="modal-title">增加机构</h4>
        </div>
        <form @submit.prevent="addDm" id="formA">
          <div class="modal-body row">
            <div class="form-group col-sm-12">
              <label class="col-sm-2 control-label" style="width: 102px;">组织机构代码</label>
              <div class="col-sm-9">
                <input class="form-control" v-model="workRow.domain" data-parsley-required="true" maxlength="50" data-parsley-maxlength="50" style="width: 440px;margin-left: -5px;">
              </div>
            </div>
            <div class="form-group col-sm-12">
              <label class="col-sm-2 control-label">机构名称</label>
              <div class="col-sm-10">
                <input class="form-control" v-model="workRow.domain_name" data-parsley-required="true" maxlength="50" data-parsley-maxlength="50">
              </div>
            </div>
            <div class="form-group col-sm-12 m_b">
              <div data-toggle="distpicker" id="distpicker">
                <div class="col-sm-4 p_r">
                  <span class="col-sm-6 control-label font-style">所在区域</span>
                  <div class="col-sm-9 m_left">
                    <select class="form-control picker-width" id="domain_province" data-parsley-required="true"></select>
                  </div>
                </div>
                <div class="col-sm-4 p_r">
                  <!--<span class="col-sm-5 control-label font-style">市/县</span>-->
                  <div class="col-sm-9 m_l">
                    <select class="form-control picker-width" id="domain_city" data-parsley-required="true"></select>
                  </div>
                </div>
                <div class="col-sm-4 p_r">
                  <!--<span class="col-sm-3 control-label font-style">区</span>-->
                  <div class="col-sm-9 m_l2">
                    <select class="form-control picker-width" id="domain_district" data-parsley-required="true"></select>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group col-sm-12">
              <label class="col-sm-2 control-label">注册地址</label>
              <div class="col-sm-10">
                <input class="form-control" v-model="workRow.domain_address" data-parsley-required="true" maxlength="100" data-parsley-maxlength="100">
              </div>
            </div>
            <div class="form-group col-sm-6">
              <label class="col-sm-4 control-label ">联系人</label>
              <div class="col-sm-8">
                <input class="form-control " v-model="workRow.domain_contact" data-parsley-required="true" maxlength="50" data-parsley-maxlength="50">
              </div>
            </div>
            <div class="form-group col-sm-6">
              <label class="col-sm-4 control-label">联系方式</label>
              <div class="col-sm-8">
                <input class="form-control" v-model="workRow.domain_phone" data-parsley-required="true">
              </div>
            </div>
            <div class="form-group col-sm-6">
              <label class="col-sm-4 control-label">固定电话</label>
              <div class="col-sm-8">
                <input class="form-control" v-model="workRow.domain_fax">
              </div>
            </div>
            <div class="form-group col-sm-12">
              <label class="col-sm-2 control-label">备注</label>
              <div class="col-sm-10 left-padding">
                <input class="form-control" v-model="workRow.domain_description" maxlength="100" data-parsley-maxlength="100">
              </div>
            </div>
            <div class="form-group col-sm-12">
              <label class="col-sm-2 control-label">公司模板</label>
              <div class="col-sm-10">
                <select class="form-control select2" multiple id="domaintemplate_id" data-parsley-required="true"></select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-info"><i class="fa fa-fw fa-plus"></i>增加</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="modal fade" id="DomainMenuModel">
    <div class="modal-dialog" style="width:900px;">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
          <h4 class="modal-title">机构权限</h4>
        </div>
        <div class="modal-body row">
          <div class="col-md-5" style="overflow:hidden">
            <h5>系统功能</h5>
            <ul id="systemtree" class="ztree"></ul>
          </div>
          <div class="col-md-7">
            <div class="col-md-1 modal-height vertical-container">
              <div class="btn-group-vertical">
                <button type="button" class="btn btn-primary btn-icon" @click="addMenu"><i class="icon-arrow-right"></i></button>
              </div>
            </div>
            <div class="col-md-11">
              <h5>机构功能</h5>
              <div class="btn-group">
                <a class="btn btn-default buttons-copy buttons-html5 btn-xs" @click="addF"><span>增加目录</span></a>
              </div>
              <div>
                <ul id="domaintree" class="ztree"></ul>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
        </div>
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
                <input class="form-control" v-model="workRow.domainmenu_name" data-parsley-required="true" maxlength="50" data-parsley-maxlength="50">
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
const apiUrl = '/api/common/system/domainControl?method='

export default {
  data: function () {
    return {
      pagePara: '',
      workRow: {},
      actDomain: {},
      oldRow: '',
      actNode: {},
      act: '' // 1新增 2修改
    }
  },
  name: 'domainControl',
  mounted: async function () {
    let _self = this
    let $table = $('#table')

    function queryParams(params) {
      params.search_text = $('#search_text').val()
      return JSON.stringify(params)
    }

    function operateFormatter(value, row, index) {
      return [
        '<a class="btn btn-primary btn-xs m-r-5 domain_menu">设置机构权限</a>'
      ].join('')
    }

    function iconDisplayFormatter(value, row) {
      return '<i class="fa fa-fw ' + row.iconSource + '"></i>'
    }

    function initTable() {
      window.tableEvents = {
        'click .domain_menu': function (e, value, row, index) {
          _self.actDomain = JSON.parse(JSON.stringify(row))
          _self.getDoaminMenu(row.domain_id)
          $('#DomainMenuModel').modal('show')
        }
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
          common.BTRowFormat('domain', '组织机构代码'),
          common.BTRowFormatEditable('domain_name', '机构名称'),
          common.BTRowFormat('domain_province', '省'),
          common.BTRowFormat('domain_city', '市/县'),
          common.BTRowFormat('domain_district', '区'),
          common.BTRowFormatEditable('domain_address', '注册地址'),
          common.BTRowFormatEditable('domain_contact', '联系人'),
          common.BTRowFormatEditable('domain_phone', '联系方式'),
          common.BTRowFormatEditablePop('domain_description', '备注'),
          common.actFormatter('act', operateFormatter, tableEvents)
        ],
        idField: 'domain_id',
        uniqueId: 'domain_id',
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
          common.rowModifyWithT(_self, apiUrl + 'modify', row, 'domain_id', $table)
        }
      })
      common.changeTableClass($table)

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

    try {
      let response = await _self.$http.post(apiUrl + 'init', {})
      let retData = response.data.info
      _self.pagePara = JSON.parse(JSON.stringify(retData))
      common.initSelect2($('#domaintemplate_id'), retData.templateInfo)
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

      $('#distpicker').distpicker({
        placeholder: true
      })

      initTable()
      $('#formA').parsley()
      $('#formF').parsley()
      console.log('init success')
    } catch (error) {
      common.dealErrorCommon(_self, error)
    }
  },
  methods: {
    search: function (event) {
      $('#table').bootstrapTable('refresh')
    },
    addM: function (event) {
      let _self = this
      _self.workRow = {}
      $('#domaintemplate_id').val(null).trigger('change')
      $('#distpicker').distpicker('reset', true)
      $('#formA').parsley().reset()
      $('#AddModal').modal('show')
    },
    addDm: async function (event) {
      let _self = this
      try {
        if ($('#formA').parsley().isValid()) {
          _self.workRow.domaintemplate_id = common.getSelect2Val('domaintemplate_id')
          _self.workRow.domain_province = $('#domain_province').val()
          _self.workRow.domain_city = $('#domain_city').val()
          _self.workRow.domain_district = $('#domain_district').val()
          let response = await _self.$http.post(apiUrl + 'add', _self.workRow)
          let retData = response.data.info
          $('#table').bootstrapTable('insertRow', {
            index: 0,
            row: retData
          })
          common.dealSuccessCommon('增加成功')
          $('#AddModal').modal('hide')
          console.log('add success')
        }
      } catch (error) {
        common.dealErrorCommon(_self, error)
      }
    },
    showIcon: function (event) {
      let data = require('../../../components/data/icon.json')
      $('#modalTable').on('shown.bs.modal', function () {
        $('#iconTable').bootstrapTable('load', {
          data: data
        })
      })
    },
    getDoaminMenu: async function (domainId, event) {
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
        _self.workRow.domainmenu_id = treeNode.domainmenu_id
        _self.workRow.domainmenu_name = treeNode.domainmenu_name
        $('#iconName').val(treeNode.domainmenu_icon)
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
        let response = await _self.$http.post(apiUrl + 'searchDomainMenu', {
          domain_id: domainId
        })
        let retData = response.data.info

        $.fn.zTree.destroy('domaintree')
        let treeObj = $.fn.zTree.init($('#domaintree'), {
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
    addF: function (event) {
      let _self = this
      _self.workRow = {}
      _self.workRow.domainmenu_name = ''
      $('#iconName').val('')
      let nodeObj = $.fn.zTree.getZTreeObj('domaintree').getSelectedNodes()
      if (nodeObj && nodeObj.length > 0) {
        if (nodeObj[0].getPath().length > 2) return common.dealWarningCommon('系统最多只支持2级菜单')
        if (nodeObj[0].node_type === '01') return common.dealWarningCommon('菜单下不允许新增')
        _self.actNode = JSON.parse(JSON.stringify(nodeObj[0]))
      } else return common.dealWarningCommon('请选择一个节点')
      $('#formF').parsley().reset()
      _self.act = '1'
      $('#FModal').modal('show')
    },
    submitF: async function (event) {
      let _self = this
      try {
        if ($('#formF').parsley().isValid()) {
          _self.workRow.parent_id = _self.actNode.domainmenu_id
          _self.workRow.domain_id = _self.actDomain.domain_id
          _self.workRow.domainmenu_icon = $('#iconName').val()

          if (_self.act === '1') {
            await _self.$http.post(apiUrl + 'addFolder', _self.workRow)
          } else {
            await _self.$http.post(apiUrl + 'modifyFolder', _self.workRow)
          }
          $('#FModal').modal('hide')
          _self.getDoaminMenu(_self.actDomain.domain_id)
        }
      } catch (error) {
        common.dealErrorCommon(_self, error)
      }
    },
    addMenu: async function (event) {
      let _self = this
      try {
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

        let nodeObj = $.fn.zTree.getZTreeObj('domaintree').getSelectedNodes()
        if (nodeObj && nodeObj.length > 0) {
          if (nodeObj[0].node_type === '01') return common.dealWarningCommon('菜单下不允许新增')
          _self.actNode = JSON.parse(JSON.stringify(nodeObj[0]))
        } else return common.dealWarningCommon('请在机构功能中选择需要增加功能的目录')

        await _self.$http.post(apiUrl + 'addMenus', {
          domain_id: _self.actDomain.domain_id,
          parent_id: _self.actNode.domainmenu_id,
          menus: menus
        })

        systemtreeObj.checkAllNodes(false)
        _self.getDoaminMenu(_self.actDomain.domain_id)
      } catch (error) {
        common.dealErrorCommon(_self, error)
      }
    },
    deleteSelect: async function (treeNode, event) {
      let _self = this
      try {
        await _self.$http.post(apiUrl + 'deleteSelect', {
          domainmenu_id: treeNode.domainmenu_id
        })
        _self.getDoaminMenu(_self.actDomain.domain_id)
      } catch (error) {
        common.dealErrorCommon(_self, error)
      }
    }
  }
}
</script>
<style scoped>
.font-style {
  font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 12px;
  color: #242a30;
  font-weight: 600;
  display: inline-block;
  max-width: 100%;
}

.m_l {
  position: absolute;
  margin-left: 62px;
}

.p_r {
  position: relative;
}

.margin_left {
  margin-left: -23px;
}

.m_left {
  position: absolute;
  margin-left: 81px;
}

.m_l2 {
  position: absolute;
  margin-left: 32px;
}

.m_b {
  margin-bottom: 22px;
}
</style>
