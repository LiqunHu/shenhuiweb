<template>
<div>
  <section class="content-header">
    <ol class="breadcrumb">
      <li><a href="#"><i class="fa fa-dashboard"></i> 系统管理</a></li>
      <li class="active">系统组维护</li>
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
                  <button class="btn btn-primary btn-info" @click="addDep"><i class="glyphicon glyphicon-plus"></i> 增加权限组 </button>
                  <button class="btn btn-primary btn-info" @click="addPos"> <i class="glyphicon glyphicon-plus"></i> 增加角色 </button>
                  <button class="btn btn-primary btn-info" @click="editNode"> <i class="glyphicon glyphicon-plus"></i> 编辑 </button>
                </div>
              </div>
            </div>
            <ul id="tree" class="ztree"></ul>
          </div>
        </div>
      </div>
    </div>
  </section>
  <div class="modal fade" id="DepModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
          <h4 class="modal-title">组</h4>
        </div>
        <form @submit.prevent="submitDep" id="formDep">
          <div class="modal-body">
            <div class="form-group">
              <label>组名称</label>
              <input class="form-control" v-model="nameA" data-parsley-required="true" maxlength="50" data-parsley-maxlength="50">
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
  <div class="modal fade" id="PosModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
          <h4 class="modal-title">角色</h4>
        </div>
        <form @submit.prevent="submitPos" id="formPos">
          <div class="modal-body">
            <div class="form-group">
              <label>角色名称</label>
              <input class="form-control" v-model="nameA" data-parsley-required="true" maxlength="50" data-parsley-maxlength="50">
            </div>
            <div v-show="tableData.length > 0" class="form-group">
              <label>权限</label>
              <ul id="domaintree" class="ztree"></ul>
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
</div>
</template>
<script>
const common = require('@/lib/common')
const apiUrl = '/api/common/system/DomainGroupControl?method='

export default {
  data: function () {
    return {
      pagePara: {},
      tableData: [],
      actNode: {},
      nameA: '',
      act: '' // 1新增 2修改
    }
  },
  name: 'groupControl',
  mounted: function () {
    let _self = this

    async function initPage() {
      try {
        let response = await _self.$http.post(apiUrl + 'init', {})
        let retData = response.data.info
        _self.pagePara = JSON.parse(JSON.stringify(retData))
        _self.tableData = JSON.parse(JSON.stringify(retData.menuInfo))
        let treeObj = $.fn.zTree.init($('#domaintree'), {
          check: {
            enable: true,
            chkboxType: {
              'Y': 'ps',
              'N': 'ps'
            }
          }
        }, retData.menuInfo)
        treeObj.expandAll(true)
        _self.getData()
        $('#formDep').parsley()
        $('#formPos').parsley()
        console.log('init success')
      } catch (error) {
        common.dealErrorCommon(_self, error)
      }
    }

    initPage()
  },
  methods: {
    getData: async function (event) {
      let _self = this
      try {
        let response = await _self.$http.post(apiUrl + 'search', {})
        let zNodes = response.data.info
        let treeObj = $.fn.zTree.init($('#tree'), {}, zNodes)
        treeObj.expandAll(true)
      } catch (error) {
        common.dealErrorCommon(_self, error)
      }
    },
    addDep: function (event) {
      let _self = this
      let nodeObj = $.fn.zTree.getZTreeObj('tree').getSelectedNodes()
      if (nodeObj && nodeObj.length > 0) {
        if (nodeObj[0].node_type === '01') return common.dealWarningCommon('职位下不允许新增')
        _self.actNode = JSON.parse(JSON.stringify(nodeObj[0]))
      } else {
        return common.dealWarningCommon('请选择一个节点')
      }
      _self.nameA = ''
      _self.act = '1'
      $('#formDep').parsley().reset()
      $('#DepModal').modal('show')
    },
    submitDep: async function (event) {
      let _self = this
      try {
        if ($('#formDep').parsley().isValid()) {
          if (_self.act === '1') {
            let workRow = {
              'usergroup_name': _self.nameA,
              'parent_id': _self.actNode.usergroup_id,
              'node_type': '00'
            }
            await _self.$http.post(apiUrl + 'add', workRow)
          } else if (_self.act === '2') {
            let workRow = {
              'usergroup_id': _self.actNode.usergroup_id,
              'usergroup_name': _self.nameA
            }
            await _self.$http.post(apiUrl + 'modify', workRow)
            $('#DepModal').modal('hide')
            common.dealSuccessCommon('修改成功')
          }
          _self.getData()
        }
      } catch (error) {
        common.dealErrorCommon(_self, error)
      }
    },
    addPos: function (event) {
      let _self = this
      let nodeObj = $.fn.zTree.getZTreeObj('tree').getSelectedNodes()
      if (nodeObj && nodeObj.length > 0) {
        if (nodeObj[0].node_type === '01') {
          return common.dealWarningCommon('职位下不允许新增')
        }
        _self.actNode = JSON.parse(JSON.stringify(nodeObj[0]))
      } else {
        return common.dealWarningCommon('请选择一个节点')
      }

      let domaintreeObj = $.fn.zTree.getZTreeObj('domaintree')
      domaintreeObj.checkAllNodes(false)
      _self.nameA = ''
      _self.act = '1'
      $('#formPos').parsley().reset()
      $('#PosModal').modal('show')
    },
    submitPos: async function (event) {
      let _self = this
      try {
        if ($('#formPos').parsley().isValid()) {
          let domaintreeObj = $.fn.zTree.getZTreeObj('domaintree')
          let nodes = domaintreeObj.getCheckedNodes(true)
          if (_self.act === '1') {
            let workRow = {
              'usergroup_name': _self.nameA,
              'parent_id': _self.actNode.usergroup_id,
              'node_type': '01',
              'menus': nodes
            }
            await _self.$http.post(apiUrl + 'add', workRow)
          } else if (_self.act === '2') {
            let workRow = {
              'usergroup_id': _self.actNode.usergroup_id,
              'usergroup_name': _self.nameA,
              'menus': nodes
            }
            await _self.$http.post(apiUrl + 'modify', workRow)
            common.dealSuccessCommon('修改成功')
          }
          $('#PosModal').modal('hide')
          _self.getData()
        }
      } catch (error) {
        common.dealErrorCommon(_self, error)
      }
    },
    editNode: async function (event) {
      let _self = this
      async function getCheckData(nodeObj) {
        let response = await _self.$http.post(apiUrl + 'getcheck', {
          usergroup_id: nodeObj[0].usergroup_id
        })

        let retData = response.data.info
        let domaintreeObj = $.fn.zTree.getZTreeObj('domaintree')
        domaintreeObj.setting.check.chkboxType = {
          'Y': 'p',
          'N': 'ps'
        }
        domaintreeObj.checkAllNodes(false)
        let nodes = domaintreeObj.getCheckedNodes(false)

        for (let i = 0; i < nodes.length; i++) {
          for (let j = 0; j < retData.groupMenu.length; j++) {
            if (nodes[i].domainmenu_id === retData.groupMenu[j]) {
              domaintreeObj.checkNode(nodes[i], true, true, false)
              break
            }
          }
        }
        domaintreeObj.setting.check.chkboxType = {
          'Y': 'ps',
          'N': 'ps'
        }
      }
      try {
        let nodeObj = $.fn.zTree.getZTreeObj('tree').getSelectedNodes()
        if (nodeObj && nodeObj.length > 0) {
          _self.actNode = JSON.parse(JSON.stringify(nodeObj[0]))
        } else {
          return common.dealWarningCommon('请选择一个节点')
        }
        this.nameA = nodeObj[0].name
        _self.act = '2'
        if (nodeObj[0].node_type === '00') {
          $('#formDep').parsley().reset()
          $('#DepModal').modal('show')
        } else if (nodeObj[0].node_type === '01') {
          await getCheckData(nodeObj)
          $('#formPos').parsley().reset()
          $('#PosModal').modal('show')
        }
      } catch (error) {
        common.dealErrorCommon(_self, error)
      }
    }
  }
}
</script>
<style scoped>
</style>
