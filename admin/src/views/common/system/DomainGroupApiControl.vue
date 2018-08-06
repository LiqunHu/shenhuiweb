<template>
<div>
  <section class="content-header">
    <ol class="breadcrumb">
      <li><a href="#"><i class="fa fa-dashboard"></i> 系统管理</a></li>
      <li class="active">系统组菜单维护</li>
    </ol>
  </section>
  <section class="content">
    <div class="col-lg-12">
      <div class="box box-info">
        <div class="box-body">
          <div class="margin form-inline">
            <div class="form-group" style="width:200px">
              <select class="form-control select2" multiple id="userGroupID"> </select>
            </div>
            <div class="form-group">
              <button id="modify" class="btn btn-success btn-info" v-on:click="modify" disabled>
                  <i class="glyphicon glyphicon-ok"></i> 提交
              </button>
            </div>
          </div>
          <ul id="domaintree" class="ztree"></ul>
        </div>
      </div>
    </div>
  </section>
</div>
</template>
<script>
const common = require('@/lib/common')
const apiUrl = '/api/common/system/DomainGroupApiControl?method='

export default {
  data: function () {
    return {
      pagePara: {}
    }
  },
  name: 'domainGroupMenuControl',
  mounted: function () {
    let _self = this

    function initPage() {
      _self.$http.post(apiUrl + 'init', {}).then((response) => {
        let retData = response.data.info
        let groupSelector = $('#userGroupID')
        _self.pagePara = JSON.parse(JSON.stringify(retData))

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

        common.initSelect2(groupSelector, retData['groupInfo'])
        groupSelector.on('select2:select', function (evt) {
          getCheckData()
          $('#modify').prop('disabled', false)
        })

        console.log('init success')
      }, (response) => {
        common.dealErrorCommon(_self, response)
      })
    }

    function getCheckData() {
      let userGroupID = $('#userGroupID').val()
      _self.$http.post(apiUrl + 'search', {
        usergroup_id: userGroupID[0]
      }).then((response) => {
        let retData = response.data.info
        let domaintreeObj = $.fn.zTree.getZTreeObj('domaintree')
        domaintreeObj.checkAllNodes(false)
        let nodes = domaintreeObj.getCheckedNodes(false)
        domaintreeObj.setting.check.chkboxType = {
          'Y': 'p',
          'N': 'ps'
        }

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
      }, (response) => {
        // error callback
        common.dealErrorCommon(_self, response)
      })
    }

    initPage()
  },
  methods: {
    modify: function (event) {
      let _self = this
      let userGroupID = $('#userGroupID').val()
      if (!userGroupID) {
        common.dealPromptCommon('未选定用户组，不能分配菜单')
      } else {
        let domaintreeObj = $.fn.zTree.getZTreeObj('domaintree')
        let nodes = domaintreeObj.getCheckedNodes(true)
        this.$http.post(apiUrl + 'modify', {
          'usergroup_id': userGroupID[0],
          'menus': nodes
        }).then((response) => {
          common.dealPromptCommon('选定用户组的菜单已分配，请重新登录查看')
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
