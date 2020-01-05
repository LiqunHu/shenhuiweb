<template>
  <div>
    <section class="content-header">
      <ol class="breadcrumb">
        <li>
          <a href="#">
            <i class="fa fa-dashboard"></i> 系统管理
          </a>
        </li>
        <li class="active">网站维护</li>
      </ol>
    </section>
    <section class="content">
      <div class="col-lg-12">
        <div class="box box-info">
          <div class="box-header">
            <h3 class="box-title">
              网站内容
              <small>网站内容</small>
            </h3>
            <div class="pull-right box-tools">
              <button type="button" class="btn btn-info btn-sm" v-on:click="saveWeb">保存</button>
            </div>
          </div>

          <div class="box-body">
            <div class="row">
              <div class="col-md-6">
                <h5>首页律所简介</h5>
                <mavon-editor v-model="home.abstract" :subfield="false" :toolbars="edittools" />
              </div>
              <div class="col-md-6">
                <h5>首页范围</h5>
                <mavon-editor v-model="home.scope" :subfield="false" :toolbars="edittools" />
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <h5>律所简介</h5>
                <mavon-editor v-model="home.fullabstract" :subfield="false" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
const common = require("@/lib/common");
const apiUrl = "/api/shenhui/shenhuiControl?method=";

export default {
  data: function() {
    return {
      edittools: {
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true // 清空
      },
      home: {
        abstract: "",
        scope: "",
        fullabstract: ""
      }
    };
  },
  name: "WebControl",
  mounted: async function() {
    let _self = this;
    let response = await _self.$http.post(apiUrl + "searchHome", {});
    _self.home = JSON.parse(JSON.stringify(response.data.info));
  },
  methods: {
    saveWeb: async function() {
      let _self = this;
      await _self.$http.post(apiUrl + "modifyHome", _self.home);
    }
  }
};
</script>
<style scoped>
</style>
