<template>
<div class="modal fade" id="userSelectDialog">
    <div class="modal-dialog" style="width:900px;">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title">选择用户</h4>
            </div>
            <div class="modal-body row">
                <div class="col-md-3 modal-height">
                    <ul id="selectTree" class="ztree"></ul>
                </div>
                <div class="col-md-9">
                    <div class="col-md-5 modal-height">
                        <table id="groupUserTable"></table>
                    </div>
                    <div class="col-md-1 modal-height vertical-container" v-show="mulityFlag2!=1">
                        <div class="btn-group-vertical">
                            <button type="button" class="btn btn-primary btn-icon" @click="addusers"><i class="icon-arrow-right"></i></button>
                        </div>
                    </div>
                    <div class="col-md-5 modal-height" v-show="mulityFlag2!=1">
                        <table id="resultUserTable"></table>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                <a @click="callBack" class="btn btn-sm btn-primary">确定</a>
            </div>
        </div>
    </div>
</div>
</template>
<script>
const common = require('@/lib/common');
const apiUrl = '/api/common/components/userSelectDialogControl?method=';

export default {
    props: {
        'usergroupId': String,
        'mulityFlag': String,
        'users': [Object, Array]
    },
    data: function() {
        return {
            mulityFlag2: '2'
        }
    },
    name: 'UserSelectDialog',
    created: function() {
        let _self = this
        _self.$parent.eventHub.$on('show-userselect-dialog', () => {
            _self.showDialog()
        })
    },
    mounted: function() {
        let _self = this;
        let $groupUserTable = $('#groupUserTable')
        let $resultUserTable = $('#resultUserTable')
        _self.mulityFlag2 = _self.mulityFlag

        window.userSelectDialogEvents = {
            'click .userSelectDelete': function(e, value, row, index) {
                $resultUserTable.bootstrapTable('remove', {
                    field: 'user_id',
                    values: [row.user_id]
                })
            }
        }

        let tf = false
        if(_self.mulityFlag2=='1'){
            tf = true
        } else {
            tf = false
        }

        $groupUserTable.bootstrapTable({
            height: 370,
            columns: [{
                    field: 'state',
                    checkbox: true
                },
                common.BTRowFormat('name', '姓名'),
                common.BTRowFormat('phone', '手机')
            ],
            idField: 'user_id',
            uniqueId: 'user_id',
            clickToSelect: true,
            singleSelect: tf,
            formatNoMatches: function() {
                return
            }
        });

        function removeFormatter(value, row, index) {
            return [
                '<a class="userSelectDelete" title="删除">',
                '<i class="glyphicon glyphicon-remove"></i>',
                '</a>',
            ].join('')
        }

        $resultUserTable.bootstrapTable({
            height: 370,
            columns: [
                common.BTRowFormat('name', '姓名'),
                common.BTRowFormat('phone', '手机'),
                common.BTRowFormat('position', '职位'),
                common.actFormatter('act', removeFormatter, userSelectDialogEvents)
            ],
            idField: 'user_id',
            uniqueId: 'user_id',
            clickToSelect: true,
            formatNoMatches: function() {
                return
            }
        });
    },
    methods: {
        showDialog: async function(event) {
            let _self = this;
            let $groupUserTable = $('#groupUserTable')
            let $resultUserTable = $('#resultUserTable')

            async function zTreeOnClick(event, treeId, treeNode) {
                if (treeNode.node_type === '01') {
                    try {
                        let response = await _self.$http.post(apiUrl + 'searchUser', {
                            usergroup_id: treeNode.usergroup_id
                        });
                        $groupUserTable.bootstrapTable('load', {
                            data: response.data.info
                        })

                    } catch (error) {
                        common.dealErrorCommon(_self, error);
                    }
                }
            };
            async function getTreeData() {
                try {
                    let response = await _self.$http.post(apiUrl + 'search', {});
                    let zNodes = response.data.info;
                    $.fn.zTree.destroy("selectTree");
                    let treeObj = $.fn.zTree.init($("#selectTree"), {
                        callback: {
                            onClick: zTreeOnClick
                        }
                    }, zNodes);
                    treeObj.expandAll(true);
                } catch (error) {
                    common.dealErrorCommon(_self, error);
                }
            }

            $resultUserTable.bootstrapTable('load', {
                data: _self.users
            })
            $groupUserTable.bootstrapTable('removeAll')
            await getTreeData()
            $('#userSelectDialog').modal('show')
        },
        addusers: function(event) {
            let _self = this,
                checkUsers = [],
                resultUsers = [],
                addUsers = [];
            let $groupUserTable = $('#groupUserTable')
            let $resultUserTable = $('#resultUserTable')
            checkUsers = $groupUserTable.bootstrapTable('getAllSelections')
            resultUsers = $resultUserTable.bootstrapTable('getData')
            for (let i = 0; i < checkUsers.length; i++) {
                let addFlag = true
                for (let j = 0; j < resultUsers.length; j++) {
                    if (checkUsers[i].user_id === resultUsers[j].user_id) {
                        addFlag = false
                        break
                    }
                }
                if (addFlag) {
                    addUsers.push(checkUsers[i])
                }

            }

            $resultUserTable.bootstrapTable('append', addUsers);
        },
        callBack: function(event) {
            let _self = this;
            if (_self.mulityFlag2=='1') {
                let _self = this,
                    checkUsers = [],
                    resultUsers = [],
                    addUsers = [];
                let $groupUserTable = $('#groupUserTable')
                let $resultUserTable = $('#resultUserTable')
                checkUsers = $groupUserTable.bootstrapTable('getAllSelections')
                resultUsers = $resultUserTable.bootstrapTable('getData')
                for (let i = 0; i < checkUsers.length; i++) {
                    let addFlag = true
                    for (let j = 0; j < resultUsers.length; j++) {
                        if (checkUsers[i].user_id === resultUsers[j].user_id) {
                            addFlag = false
                            break
                        }
                    }
                    if (addFlag) {
                        addUsers.push(checkUsers[i])
                    }

                }

                $resultUserTable.bootstrapTable('append', addUsers);
                $('#userSelectDialog').modal('hide')
                _self.$parent.userSelectCallback($('#resultUserTable').bootstrapTable('getData'))
            } else {
                $('#userSelectDialog').modal('hide')
                _self.$parent.userSelectCallback($('#resultUserTable').bootstrapTable('getData'))
            }

        },
    }
}
</script>
<style scoped>
.modal-height {
    height: 400px;
    overflow: auto;
}
</style>
