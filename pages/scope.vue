<template>
  <!-- begin #page-container -->
    <div>
        <common-header></common-header>
        <div class="container">
          <article class="page">
            <header class="border-left entry-header">
              <h1 class="entry-title">业务范围</h1>
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
              <blockquote>1、担任国家机关、国内外企事业单位和公民的常年法律顾问；</blockquote>
              <blockquote>2、参与涉外投资项目和国内合资、联营等项目的谈判，起草有关合同、章程等，出具法律意见书；</blockquote>
              <blockquote>3、办理土地使用权出让、转让法律手续，参与房地产开发、工程建设等项目洽谈、签约，代办境内外售房法律手续，办理银行按揭以及有关的担保、抵押、回购的法律手续，办理商业用户、住宅、写字楼等的出租法律手续；</blockquote>
              <blockquote>4、办理公司的设立，企业公司的资产重组，产权的转让、拍卖，股权的转让，公司的合并与分立，公司的收购与兼并、公司的解散或破产及清算等的有关法律事务：</blockquote>
              <blockquote>5、办理股票发行与上市，公司的增配股等有关法律手续，出具相关的法律文件。提供证券交易有关的法律服务；</blockquote>
              <blockquote>6、办理技术引进、技术转让、专利许可证贸易服务，商标注册与使用许可以及专利、商标、著作权侵权的法律事务；</blockquote>
              <blockquote>7、办理项目融资、商业贷款、融资租赁等法律事务；</blockquote>
              <blockquote>8、代办工商登记、保险等法律事务；</blockquote>
              <blockquote>9、担任经济、民事、行政案件的代理人，参加诉讼、仲裁和调解；</blockquote>
              <blockquote>10、担任刑事案件被告人的辩护人；</blockquote>
              <blockquote>11、代办各种法律手续，见证各类法律行为，出具相关的法律意见书。</blockquote>
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