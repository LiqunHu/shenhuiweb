<template>
  <!-- begin #page-container -->
    <div>
        <page-header></page-header>
        <!-- begin #about -->
        <div class="content">
            <!-- begin container -->
            <div class="container" data-animation="true" data-animation-type="fadeInDown">
                <h2 class="content-title">律所简介</h2>
                <div class="content-desc">
                    上海市申汇律师事务所建于1982年1月1日，是上海市徐汇区第一家律师事务所（原名上海市徐汇区法律顾问处），<br />
                    也是1979年中国恢复律师制度时最早建立的律师事务所之一...<br/>
                    <p class="read-btn-container">
                        <a href="post_detail.html">更多 <i class="fa fa-angle-double-right"></i></a>
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
                                <a href="post_detail.html">更多 <i class="fa fa-angle-double-right"></i></a>
                            </p>
                        </div>
                        <!-- end about -->
                    </div>
                    <!-- end col-4 -->
                    <!-- begin col-4 -->
                    <div class="col-md-4 col-sm-6">
                        <h3>律所动态</h3>
                        <!-- begin about-author -->
                        <div class="about-author">
                            <div class="quote bg-silver">
                                <i class="fa fa-quote-left"></i>
                                <h3>We work harder,<br /><span>to let our user keep simple</span></h3>
                                <i class="fa fa-quote-right"></i>
                            </div>
                            <div class="author">
                                <div class="image">
                                    <img src="assets/img/user-1.jpg" alt="Sean Ngu" />
                                </div>
                                <div class="info">
                                    Sean Ngu
                                    <small>Front End Developer</small>
                                </div>
                            </div>
                        </div>
                        <!-- end about-author -->
                    </div>
                    <!-- end col-4 -->
                    <!-- begin col-4 -->
                    <div class="col-md-4 col-sm-12">
                        <h3>经典案例</h3>
                        <!-- begin skills -->
                        <div class="skills">
                            <div class="skills-name">Front End</div>
                            <div class="progress progress-striped">
                                <div class="progress-bar progress-bar-success" style="width: 95%">
                                    <span class="progress-number">95%</span>
                                </div>
                            </div>
                            <div class="skills-name">Programming</div>
                            <div class="progress progress-striped">
                                <div class="progress-bar progress-bar-success" style="width: 90%">
                                    <span class="progress-number">90%</span>
                                </div>
                            </div>
                            <div class="skills-name">Database Design</div>
                            <div class="progress progress-striped">
                                <div class="progress-bar progress-bar-success" style="width: 85%">
                                    <span class="progress-number">85%</span>
                                </div>
                            </div>
                            <div class="skills-name">Wordpress</div>
                            <div class="progress progress-striped">
                                <div class="progress-bar progress-bar-success" style="width: 80%">
                                    <span class="progress-number">80%</span>
                                </div>
                            </div>
                        </div>
                        <!-- end skills -->
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
</style>

