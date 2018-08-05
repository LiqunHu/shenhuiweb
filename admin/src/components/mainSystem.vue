<template>
<div>
  <!-- begin #page-container -->
  <div class="wrapper">
    <main-header></main-header>
    <main-sidebar></main-sidebar>

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <router-view/>
    </div>
  </div>
  <!-- end page container -->
</div>
</template>
<script>
// const common = require('@/lib/common')
import mainHeader from './common/main/mainHeader'
import mainSidebar from './common/main/mainSidebar'
export default {
  name: 'mainSystem',
  components: {
    mainHeader,
    mainSidebar
  },
  mounted: function() {
    $('body').removeClass()
    $('body').addClass('hold-transition')
    $('body').addClass('skin-blue')
    $('body').addClass('sidebar-mini')
    $(window).resize()
    $('.sidebar-menu').tree()
  }
}
</script>
<style scoped>
</style>
