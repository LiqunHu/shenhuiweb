<template>
<div>
    <!-- begin breadcrumb -->
    <ol class="breadcrumb pull-right">
        <li><a href="javascript:;">example</a></li>
        <li class="active">example</li>
    </ol>
    <!-- end breadcrumb -->
    <div class="row">
        <div class="col-md-12">
            <div class="panel panel-inverse">
                <div class="panel-heading">
                    <div class="panel-heading-btn">
                        <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default" data-click="panel-expand"><i class="fa fa-expand"></i></a>
                    </div>
                    <h4 class="panel-title">example</h4>
                </div>
                <div class="panel-body" style="display:none;">
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
const common = require('@/lib/common')
const apiUrl = '....'

export default {
    data: function () {
        return {
            pagePara: '',
        }
    },
    name: 'exampletemplate',
    mounted: function () {
        let _self = this

        function initPage() {
            let websocket = common.createWebSocket();
            websocket.onopen = function (evt) {
                console.log('open');
            };
            websocket.onclose = function (evt) {
                console.log('close');
            };
            websocket.onmessage = function (evt) {
                console.log(evt.data);
            };
            websocket.onerror = function (evt) {
                console.log('error');
            };
            common.reSizeCall()
        }

        initPage()
    },
    methods: {
        example: function (event) { }
    }
}
</script>
<style scoped>
</style>
