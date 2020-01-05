<template>
  <!-- begin #page-container -->
  <div>
    <common-header></common-header>
    <div class="container">
      <article class="page">
        <header class="border-left entry-header">
          <h1 class="entry-title">上海市申汇律师事务所简介</h1>
          <div class="blog-meta metabox">
            <span class="entry-elem">
              <i class="fa fa-calendar"></i>
              2007-03-15
            </span>
            <span class="separator">|</span>
            <span class="entry-elem">
              <i class="fa fa-comment"></i>
              上海市申汇律师事务所
            </span>
          </div>
        </header>
        <!-- .entry-header -->

        <div class="entry-content">
          <div class="markdown-body" style="font-size: 17.5px;color: #775f5e;" v-html="data.about"></div>
        </div>
        <!-- .entry-content -->

        <footer class="entry-footer"></footer>
        <!-- .entry-footer -->
      </article>
    </div>
    <page-footer></page-footer>
  </div>
  <!-- end #page-container -->
</template>

<script>
import request from "~/plugins/request";
import CommonHeader from "~/components/CommonHeader.vue";
import PageFooter from "~/components/PageFooter.vue";
const apiUrl = "/api/shenhui/shenhuiControl?method=";

export default {
  async asyncData({ params }) {
    let { data } = await request.post(apiUrl + "getAbout", {});
    return { data: data.info.data };
  },
  components: {
    CommonHeader,
    PageFooter
  },
  head() {
    return {
      title: "关于上海市申汇律师事务所"
    };
  },
  mounted() {}
};
</script>
<style scoped>
.page {
  font-family: "Open Sans", sans-serif;
  line-height: 25px;
  -ms-word-wrap: break-word;
  word-wrap: break-word;
  color: #775f5e;
}
.hentry {
  margin: 0 0 1.5em;
}
.border-left {
  padding-left: 24px;
  -webkit-box-shadow: inset 4px 0 0 0 rgba(50, 50, 50, 0.1);
  box-shadow: inset 4px 0 0 0 rgba(50, 50, 50, 0.1);
}
.entry-header h1,
.entry-header h2 {
  margin-top: 0;
  margin-bottom: 15px;
}

.page-content,
.entry-content,
.entry-summary {
  margin: 1.5em 0 0;
}

blockquote,
q {
  quotes: "" "";
}
blockquote {
  margin: 0 1.5em;
}
blockquote {
  padding: 10px 20px;
  margin: 0 0 20px;
  font-size: 17.5px;
  border-left: 5px solid #eee;
}
p {
  font-size: 17px;
}

.blog-meta {
  background: none !important;
}

.metabox {
  color: #000;
  clear: both;
  background-color: rgb(221, 223, 225);
  padding: 10px 0px 10px 0px;
  font-size: 15px;
  font-family: "Poppins";
}

.metabox i {
  color: #14cab4;
  padding: 4px;
}

.metabox .separator {
  color: #14cab4;
}

.metabox .entry-elem {
  padding: 0 0 0 20px;
  margin: 0 13px 0 0;
}
.blog-meta .entry-elem {
  padding-left: 0px !important;
}
</style>