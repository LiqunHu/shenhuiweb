<template>
  <!-- begin #page-container -->
  <div>
    <page-header></page-header>
    <!-- begin #about -->
    <div class="content">
      <!-- begin container -->
      <div class="container">
        <h2 class="content-title">律所简介</h2>
        <div class="content-desc">
          <div class="markdown-body" v-html="data.abstract"></div>
          <p class="read-btn-container">
            <nuxt-link to="/about">
              更多
              <i class="fa fa-angle-double-right"></i>
            </nuxt-link>
          </p>
        </div>

        <!-- begin row -->
        <div class="row">
          <!-- begin col-4 -->
          <div class="col-md-4 col-sm-6">
            <!-- begin about -->
            <div class="about">
              <h3>业务范围</h3>
              <div class="markdown-body" v-html="data.scope"></div>
              <p class="read-btn-container">
                <nuxt-link to="/scope">
                  更多
                  <i class="fa fa-angle-double-right"></i>
                </nuxt-link>
              </p>
            </div>
            <!-- end about -->
          </div>
          <!-- end col-4 -->
          <!-- begin col-4 -->
          <div class="col-md-4 col-sm-6">
            <h3>律所动态</h3>
            <div class="case-quote">
              <ul class="sidebar-recent-post">
                <li v-for="d in data.dynamic" :key="d.article_id">
                  <div class="info">
                    <h4 class="title">
                      <nuxt-link :to="'/dynamicdetail/'+d.article_id">{{d.article_title}}</nuxt-link>
                    </h4>
                    <div class="date">{{d.created_at}}</div>
                  </div>
                </li>
              </ul>
              <p class="read-btn-container">
                <nuxt-link to="/dynamic">
                  更多
                  <i class="fa fa-angle-double-right"></i>
                </nuxt-link>
              </p>
            </div>
          </div>
          <!-- end col-4 -->
          <!-- begin col-4 -->
          <div class="col-md-4 col-sm-12">
            <h3>经典案例</h3>
            <ul class="sidebar-list">
              <li v-for="c in data.cases" :key="c.article_id">
                <nuxt-link :to="'/casedetail/'+c.article_id">{{c.article_title}}</nuxt-link>
              </li>
            </ul>
            <p class="read-btn-container">
              <nuxt-link to="/cases">
                更多
                <i class="fa fa-angle-double-right"></i>
              </nuxt-link>
            </p>
          </div>
          <!-- end col-4 -->
        </div>
        <!-- end row -->
      </div>
      <!-- end container -->
    </div>
    <!-- end #about -->
    <page-footer></page-footer>
  </div>
  <!-- end #page-container -->
</template>
<script>
import request from "~/plugins/request";
import PageHeader from "~/components/PageHeader.vue";
import PageFooter from "~/components/PageFooter.vue";

const apiUrl = "/api/shenhui/shenhuiControl?method=";

export default {
  async asyncData({ params }) {
    let { data } = await request.post(apiUrl + "getHome", {});
    return { data: data.info.data };
  },
  head() {
    return {
      title: "上海市申汇律师事务所"
    };
  },
  components: {
    PageHeader,
    PageFooter
  },
  mounted() {}
};
</script>
<style scoped>
.read-btn-container {
  text-align: right;
  font-size: 12px;
}
.sidebar-list {
  list-style-type: none;
  padding: 0;
  font-size: 12px;
}
.sidebar-list > li > a {
  line-height: 20px;
  color: #333;
  border-bottom: 1px solid #ddd;
  display: block;
  padding: 10px 0;
}
.sidebar-recent-post {
  list-style-type: none;
  padding: 0;
}
.sidebar-recent-post > li {
  padding: 2px 0;
  border-bottom: 1px solid #ddd;
}
.sidebar-recent-post > li .title {
  margin: 0;
  font-size: 13px;
  text-transform: initial;
  letter-spacing: 0;
  line-height: 20px;
}
.sidebar-recent-post > li .date {
  font-size: 11px;
  color: #999;
}
.case-quote {
  position: relative;
  padding: 30px 20px;
  border-radius: 12px;
  margin-bottom: 15px;
  background: #f0f3f4 !important;
}
</style>

