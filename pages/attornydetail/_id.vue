<template>
  <!-- begin #page-container -->
    <div>
        <common-header></common-header>
        <div class="container">
          <div class="vertical-box color-salve">
            <div class="vertical-box-column width-250 color-gray show-pannel">
              <p><b>律师文章</b></p>
              <ul class="sidebar-list">
                <li v-for="c in data.rel_articles" :key="c.article_id"><nuxt-link :to="'/casedetail/'+c.article_id">{{c.article_title}}</nuxt-link></li>
              </ul>
            </div>
            <div class="vertical-box-column">
              <article class="page">
                <header class="border-left entry-header">
                  <div class="atornyimg">
                    <div class="imgcontainer">
                      <img :src="data.article_img">
                    </div>
                  </div>
                  <h3 class="entry-title">个人描述</h3>
                </header>

                <div class="entry-content">
                  <div class="article-body markdown-body" v-html="data.article_markdown">
                  </div>
                </div><!-- .entry-content -->

                <footer class="entry-footer"></footer><!-- .entry-footer -->
              </article>
            </div>
           </div>
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
    let { data } = await request.post(apiUrl + "getArticle", {
      article_id: params.id
    });
    return { data: data.info };
  },
  components: {
    CommonHeader,
    PageFooter
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

.atornyimg {
  display: -webkit-flex;
  -webkit-justify-content: center;
  -webkit-align-items: center;
}

.imgcontainer {
  width: 200px;
  height: 240px;
}

.imgcontainer img {
  width: 100%;
}

.article-body {
  padding: 10px 20px;
  margin: 0 0 20px;
}

.vertical-box {
  display: table;
  table-layout: fixed;
  border-spacing: 0;
  height: 100%;
  width: 100%;
}
.vertical-box-column {
  display: table-cell;
  vertical-align: top;
  height: 100%;
}
.width-250 {
  width: 250px !important;
}
.color-salve {
  background: #f0f3f4 !important;
}
.color-gray {
  background: #d9e0e7;
}
.show-pannel {
  border-radius: 3px;
  min-height: 400px;
  padding: 15px !important;
}
.show-pannel p {
  font-size: 17px;
}
</style>