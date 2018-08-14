<template>
  <!-- begin #page-container -->
    <div>
        <common-header></common-header>
        <div id="contact" class="content bg-silver-lighter" data-scrollview="true">
            <!-- begin container -->
            <div class="container">
                <h2 class="content-title">联系我们</h2>
                <!-- begin row -->
                <div class="row">
                    <!-- begin col-6 -->
                    <div class="col-md-6 fadeInLeft contentAnimated finishAnimated" data-animation="true" data-animation-type="fadeInLeft">
                        <h3>联系方式</h3>
                        <p>
                            <strong>上海市申汇律师事务所, Inc</strong><br>
                            上海市徐汇区<br>
                            衡山路327号<br>
                        </p>
                        <p>
                            <span class="phone">+86 (021) 64745671</span><br>
                            <a href="mailto:sh327327@126.com">sh327327@126.com</a>
                        </p>
                    </div>
                    <!-- end col-6 -->
                    <!-- begin col-6 -->
                    <div class="col-md-6 form-col fadeInRight contentAnimated finishAnimated" data-animation="true" data-animation-type="fadeInRight">
                        <form class="form-horizontal">
                            <div class="form-group">
                                <label class="control-label col-md-3">姓名 <span class="text-theme">*</span></label>
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
                                <label class="control-label col-md-3">信息 <span class="text-theme">*</span></label>
                                <div class="col-md-9">
                                    <textarea class="form-control" rows="10"></textarea>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label col-md-3"></label>
                                <div class="col-md-9 text-left">
                                    <button type="submit" class="btn btn-theme btn-block">发送信息</button>
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
  head () {
    return {
      title: '上海市申汇律师事务所联系方式',
    }
  },
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