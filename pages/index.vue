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
                    上海市申汇律师事务所建于1982年1月1日，是上海市徐汇区第一家律师事务所（原名上海市徐汇区法律顾问处），<br />
                    也是1979年中国恢复律师制度时最早建立的律师事务所之一...<br/>
                    <p class="read-btn-container">
                        <nuxt-link to="/about">更多<i class="fa fa-angle-double-right"></i></nuxt-link>
                    </p>
                </div>
                
                <!-- begin row -->
                <div class="row">
                    <!-- begin col-4 -->
                    <div class="col-md-4 col-sm-6">
                        <!-- begin about -->
                        <div class="about">
                            <h3>业务范围</h3>
                            <p>
                                1、担任国家机关、国内外企事业单位和公民的常年法律顾问；<br/>
                                2、参与涉外投资项目和国内合资、联营等项目的谈判，起草有关合同、章程等，出具法律意见书；<br/>
                                3、办理土地使用权出让、转让法律手续，参与房地产开发、工程建设等项目洽谈、签约，代办境内外售房法律手续，办理银行按揭以及有关的担保、抵押、回购的法律手续，办理商业用户、住宅、写字楼等的出租法律手续；<br/>
                                4、办理公司的设立，企业公司的资产重组，产权的转让、拍卖，股权的转让，公司的合并与分立，公司的收购与兼并、公司的解散或破产及清算等的有关法律事务：<br/>
                                5、办理股票发行与上市，公司的增配股等有关法律手续，出具相关的法律文件。提供证券交易有关的法律服务；<br/>
                            </p>
                            <p class="read-btn-container">
                                <nuxt-link to="/scope">更多<i class="fa fa-angle-double-right"></i></nuxt-link>
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
                              <li>
                                  <div class="info">
                                      <h4 class="title"><a href="#">Lorem ipsum dolor sit amet.</a></h4>
                                      <div class="date">23 December 2015</div>
                                  </div>
                              </li>
                              <li>
                                  <div class="info">
                                      <h4 class="title"><a href="#">Vestibulum a cursus arcu.</a></h4>
                                      <div class="date">16 December 2015</div>
                                  </div>
                              </li>
                              <li>
                                  <div class="info">
                                      <h4 class="title"><a href="#">Nullam vel condimentum lectus. </a></h4>
                                      <div class="date">7 December 2015</div>
                                  </div>
                              </li>
                              <li>
                                  <div class="info">
                                      <h4 class="title"><a href="#">Proin in dui egestas libero posuere ullamcorper. </a></h4>
                                      <div class="date">20 November 2015</div>
                                  </div>
                              </li>
                              <li>
                                  <div class="info">
                                      <h4 class="title"><a href="#">Interdum et malesuada fames ac ante.</a></h4>
                                      <div class="date">5 November 2015</div>
                                  </div>
                              </li>
                          </ul>
                          <p class="read-btn-container">
                              <a href="post_detail.html">更多 <i class="fa fa-angle-double-right"></i></a>
                          </p>
                        </div>
                    </div>
                    <!-- end col-4 -->
                    <!-- begin col-4 -->
                    <div class="col-md-4 col-sm-12">
                        <h3>经典案例</h3>
                        <ul class="sidebar-list">
                            <li><a href="#">Sports (20)</a></li>
                            <li><a href="#">Outdoor Sports (45)</a></li>
                            <li><a href="#">Indoor Sports (1,292)</a></li>
                            <li><a href="#">Video Shooting (12)</a></li>
                            <li><a href="#">Drone (229)</a></li>
                            <li><a href="#">Uncategorized (1,482)</a></li>
                        </ul>
                        <p class="read-btn-container">
                            <a href="post_detail.html">更多 <i class="fa fa-angle-double-right"></i></a>
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
import PageHeader from '~/components/PageHeader.vue'
import PageFooter from '~/components/PageFooter.vue'

export default {
  components: {
    PageHeader,
    PageFooter
  },
  mounted() {
  },
}
</script>
<style scoped>
.read-btn-container {
  text-align: right;
  font-size: 12px;
}
.sidebar-list {
  list-style-type: none;
  margin: 0;
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

