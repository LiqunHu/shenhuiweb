<template>
  <!-- begin #page-container -->
    <div id="page-container">
        <page-header></page-header>
        <!-- begin #about -->
        <div id="about" class="content" data-scrollview="true">
            <!-- begin container -->
            <div class="container" data-animation="true" data-animation-type="fadeInDown">
                <h2 class="content-title">About Us</h2>
                <p class="content-desc">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum consectetur eros dolor,<br />
                    sed bibendum turpis luctus eget
                </p>
                <!-- begin row -->
                <div class="row">
                    <!-- begin col-4 -->
                    <div class="col-md-4 col-sm-6">
                        <!-- begin about -->
                        <div class="about">
                            <h3>Our Story</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                                Vestibulum posuere augue eget ante porttitor fringilla. 
                                Aliquam laoreet, sem eu dapibus congue, velit justo ullamcorper urna, 
                                non rutrum dolor risus non sapien. Vivamus vel tincidunt quam. 
                                Donec ultrices nisl ipsum, sed elementum ex dictum nec. 
                            </p>
                            <p>
                                In non libero at orci rutrum viverra at ac felis. 
                                Curabitur a efficitur libero, eu finibus quam. 
                                Pellentesque pretium ante vitae est molestie, ut faucibus tortor commodo. 
                                Donec gravida, eros ac pretium cursus, est erat dapibus quam, 
                                sit amet dapibus nisl magna sit amet orci. 
                            </p>
                        </div>
                        <!-- end about -->
                    </div>
                    <!-- end col-4 -->
                    <!-- begin col-4 -->
                    <div class="col-md-4 col-sm-6">
                        <h3>Our Philosophy</h3>
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
                        <h3>Our Experience</h3>
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
  }
}
</script>
<style>
</style>

