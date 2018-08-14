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
                2007-03-15							</span>
                <span class="separator">|</span>
                <span class="entry-elem"> 
                  <i class="fa fa-comment"></i>
                上海市申汇律师事务所 							</span>
              </div>
            </header><!-- .entry-header -->

            <div class="entry-content">
              <blockquote>上海市申汇律师事务所建于1982年1月1日，是上海市徐汇区第一家律师事务所（原名上海市徐汇区法律顾问处），也是1979年中国恢复律师制度时最早建立的律师事务所之一，目前为合伙制的律师事务所。现有经国家批准注册执业律师15名。</blockquote>
              <blockquote>上海市申汇律师事务所建所以来，共办理刑事、民事、经济、房地产、行政等各类案件2.3万余件，曾先后担任过1000余家国家机关、公司、企业法人，事业单位及其他组织和个人的法律顾问，并拥有司法部、中国证券监督管理委员会颁发的《律师事务所从事证券法律业务资格证书》</blockquote>
              <blockquote>上海市申汇律师事务所宗旨：“诚实信用、优质高效”</blockquote>
              <blockquote>上海市申汇律师事务所口号：“质量就是生命”</blockquote>
              <blockquote>上海市申汇律师事务所在上海律师界享有一定声誉。历史上，曾获得一系列荣誉称号：</blockquote>
              <blockquote>1989年被上海市司法局授予“先进集体”称号；</blockquote>
              <blockquote>1990年被司法部授予“从业清廉先进单位”称号；</blockquote>
              <blockquote>1995年被上海市律师协会授予“上海市先进律师事务所”称号；</blockquote>
              <blockquote>1999年被上海市司法局授予“文明律师事务所”称号；</blockquote>
              <blockquote>2000年被上海市法律援助中心授予“法律援助先进单位”称号；</blockquote>
              <blockquote>2003年-2005年被上海市徐汇区司法局授予上海市徐汇区“先进党组织”称号；</blockquote>
              <blockquote>2005年-2009年被上海市徐汇区司法局授予“司法行政系统先进集体”称号；</blockquote>
              <blockquote>2009年荣获上海市徐汇区“十佳律师事务所”称号。</blockquote>
              <blockquote>事务所主任武延年高级律师</blockquote>
              <blockquote>事务所副主任李家麟高级律师</blockquote>
             </div><!-- .entry-content -->

            <footer class="entry-footer"></footer><!-- .entry-footer -->
          </article>
        </div>
        <page-footer></page-footer>
    </div>
    <!-- end #page-container -->
</template>

<script>
import CommonHeader from '~/components/CommonHeader.vue'
import PageFooter from '~/components/PageFooter.vue'

export default {
  components: {
    CommonHeader,
    PageFooter
  },
  head () {
    return {
      title: '关于上海市申汇律师事务所',
    }
  },
  mounted() {
  },
}
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
.entry-header h1, .entry-header h2 {
    margin-top: 0;
    margin-bottom: 15px;
}

.page-content, .entry-content, .entry-summary {
    margin: 1.5em 0 0;
}

blockquote, q {
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
    font-family: 'Poppins';
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