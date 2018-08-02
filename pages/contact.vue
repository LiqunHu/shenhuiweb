<template>
  <!-- begin #page-container -->
    <div>
        <common-header></common-header>
        <div id="contact" class="content bg-silver-lighter" data-scrollview="true">
            <!-- begin container -->
            <div class="container">
                <h2 class="content-title">联系我们</h2>
                <p class="content-desc">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum consectetur eros dolor,<br>
                    sed bibendum turpis luctus eget
                </p>
                <!-- begin row -->
                <div class="row">
                    <!-- begin col-6 -->
                    <div class="col-md-6 fadeInLeft contentAnimated finishAnimated" data-animation="true" data-animation-type="fadeInLeft">
                        <h3>If you have a project you would like to discuss, get in touch with us.</h3>
                        <p>
                            Morbi interdum mollis sapien. Sed ac risus. Phasellus lacinia, magna a ullamcorper laoreet, lectus arcu pulvinar risus, vitae facilisis libero dolor a purus.
                        </p>
                        <p>
                            <strong>SeanTheme Studio, Inc</strong><br>
                            795 Folsom Ave, Suite 600<br>
                            San Francisco, CA 94107<br>
                            P: (123) 456-7890<br>
                        </p>
                        <p>
                            <span class="phone">+11 (0) 123 456 78</span><br>
                            <a href="mailto:hello@emailaddress.com">seanthemes@support.com</a>
                        </p>
                    </div>
                    <!-- end col-6 -->
                    <!-- begin col-6 -->
                    <div class="col-md-6 form-col fadeInRight contentAnimated finishAnimated" data-animation="true" data-animation-type="fadeInRight">
                        <form class="form-horizontal">
                            <div class="form-group">
                                <label class="control-label col-md-3">Name <span class="text-theme">*</span></label>
                                <div class="col-md-9">
                                    <input type="text" class="form-control">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label col-md-3">Email <span class="text-theme">*</span></label>
                                <div class="col-md-9">
                                    <input type="text" class="form-control">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label col-md-3">Message <span class="text-theme">*</span></label>
                                <div class="col-md-9">
                                    <textarea class="form-control" rows="10"></textarea>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label col-md-3"></label>
                                <div class="col-md-9 text-left">
                                    <button type="submit" class="btn btn-theme btn-block">Send Message</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <!-- end col-6 -->
                </div>
                <!-- end row -->
            </div>
            <!-- end container -->
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
</style>