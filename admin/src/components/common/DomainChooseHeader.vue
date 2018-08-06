<template>
<div class="panel-heading">
    <select class="select2" multiple id="domain_select"></select>
    <div class="panel-heading-btn">
        <button type="button" class="btn btn-success btn-xs p_t" @click="ShowDomainSelectDialog">Follow</button>
    </div>
    <div class="modal fade" id="DomainSelectDialog">
        <div class="modal-dialog" style="width:900px;">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h4 class="modal-title">选择机构</h4>
                </div>
                <div class="modal-body row" style="color: #707478">
                    <div class="col-md-6 modal-height">
                        <table id="DomainTable"></table>
                    </div>

                    <div class="col-md-6 modal-height">
                        <div class="col-md-1 modal-height vertical-container">
                            <div class="btn-group-vertical">
                                <button type="button" class="btn btn-primary btn-icon" @click="FollowDomain"><i class="icon-arrow-right"></i></button>
                            </div>
                        </div>
                        <div class="col-md-11 modal-height">
                            <fieldset>
                                <legend>关注列表</legend>
                                <div class="form-group">
                                    <table id="followTable"></table>
                                </div>
                            </fieldset>
                            <fieldset>
                                <legend>取消列表</legend>
                                <div class="form-group">
                                    <table id="defollowTable"></table>
                                </div>
                            </fieldset>

                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal">关闭</a>
                    <a @click="FollowDomainAct" class="btn btn-sm btn-primary">确定</a>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
const common = require('@/lib/common')
const apiUrl = '/api/common/components/DomainSelectDialogControl?method=';

export default {
    props: ['pagePara', 'apiName'],
    data: function() {
        return {
        }
    },
    name: 'DomainChooseHeader',
    mounted: function() {
        let _self = this;

        $('#DomainTable').bootstrapTable({
            height: 360,
            columns: [{
                    field: 'state',
                    checkbox: true
                },
                common.BTRowFormat('domain', '机构编码'),
                common.BTRowFormat('domain_name', '机构名称')
            ],
            idField: 'domain_id',
            uniqueId: 'domain_id',
            search: true,
            clickToSelect: true,
            formatNoMatches: function() {
                return
            }
        });
    },
    watch: {
        pagePara: function() {
            let _self = this
            let $followTable = $('#followTable')
            let $defollowTable = $('#defollowTable')

            window.domainSelectDialogEvents = {
                'click .domainSelectDelete': function(e, value, row, index) {
                    $followTable.bootstrapTable('removeByUniqueId', row.functiondomain_id)
                }
            }

            function actFormatter(value, row, index) {
                return [
                    '<a class="domainSelectDelete" title="取消关注">',
                    '<i class="glyphicon glyphicon-remove"></i>',
                    '</a>',
                ].join('')
            }

            $followTable.bootstrapTable({
                height: 200,
                columns: [
                    common.BTRowFormat('domain', '关注机构编码'),
                    common.BTRowFormat('domain_name', '机构名称'),
                    common.BTRowFormat('follow_state', '关注状态'),
                    common.BTRowFormatEdSelect2Disabled(_self, 'effect_state', '生效状态', 'statusInfo'),
                    common.actFormatter('act', actFormatter, domainSelectDialogEvents)
                ],
                idField: 'functiondomain_id',
                uniqueId: 'functiondomain_id',
                formatNoMatches: function() {
                    return
                }
            });

            $defollowTable.bootstrapTable({
                height: 100,
                columns: [
                    common.BTRowFormat('domain', '关注机构编码'),
                    common.BTRowFormat('domain_name', '机构名称'),
                    common.BTRowFormat('follow_state', '关注状态'),
                    common.BTRowFormatEdSelect2Disabled(_self, 'effect_state', '生效状态', 'statusInfo'),
                ],
                idField: 'functiondomain_id',
                uniqueId: 'functiondomain_id',
                formatNoMatches: function() {
                    return
                }
            });

            $('#domain_select').select2({
                theme: "header",
                placeholder: ' 请选择关注机构',
                maximumSelectionLength: 1,
                language: 'zh-CN',
                tags: false,
                width: '30%',
                data: _self.pagePara.domain_list,
                multiple: true
            })
        }
    },
    methods: {
        ShowDomainSelectDialog: async function(event) {
            let _self = this
            try {
                await _self.getTableData()

                $('#DomainSelectDialog').modal('show')
            } catch (error) {
                common.dealErrorCommon(_self, error);
            }
        },
        FollowDomain: function(event) {
            let _self = this,
                checkDomains = [],
                resultDomains = [],
                addDomains = [];
            let $DomainTable = $('#DomainTable')
            let $followTable = $('#followTable')
            checkDomains = $DomainTable.bootstrapTable('getAllSelections')
            resultDomains = $followTable.bootstrapTable('getData')
            for (let i = 0; i < checkDomains.length; i++) {
                let addFlag = true
                for (let j = 0; j < resultDomains.length; j++) {
                    if (checkDomains[i].domain_id === resultDomains[j].follow_domain_id) {
                        addFlag = false
                        break
                    }
                }
                if (addFlag) {
                    addDomains.push({
                        follow_domain_id: checkDomains[i].domain_id,
                        domain: checkDomains[i].domain,
                        domain_name: checkDomains[i].domain_name,
                        follow_state: '关注',
                        effect_state: '0'
                    })
                }

            }

            $followTable.bootstrapTable('append', addDomains);
        },
        FollowDomainAct: async function(event) {
            let _self = this;
            try {
                let resultDomains = $('#followTable').bootstrapTable('getData')
                let response = await _self.$http.post(apiUrl + 'modify', {
                    api_name: _self.apiName,
                    resultDomains: resultDomains
                });
                await _self.getTableData()
            } catch (error) {
                common.dealErrorCommon(_self, error);
            }
        },
        getTableData: async function(event) {
            let _self = this
            try {
                let response = await _self.$http.post(apiUrl + 'search', {
                    api_name: _self.apiName
                });
                let retData = response.data.info

                $('#DomainTable').bootstrapTable('load', {
                    data: retData.domains
                })

                $('#followTable').bootstrapTable('load', {
                    data: retData.follow_list
                })

                $('#defollowTable').bootstrapTable('load', {
                    data: retData.defollow_list
                })
            } catch (error) {
                common.dealErrorCommon(_self, error);
            }
        }
    }
}
</script>
<style scoped>
.modal-height {
    height: 460px;
    overflow: auto;
}
.p_t {
    margin-top:3px;
}
</style>
