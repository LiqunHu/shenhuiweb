<template>
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
        <li><a href="#">error</a></li>
        <li class="active">401 error</li>
      </ol>
    </section>

    <!-- Main content -->
    <section class="content">

      <div class="error-page">
        <h2 class="headline text-red">401</h2>

        <div class="error-content">
          <h3><i class="fa fa-warning text-red"></i>  Oops! Something went wrong.</h3>
Ó
          <p>
            由于用户匿名访问使用的账号(默认是IUSR_机器名)被禁用. <br /> 或者没有权限访问计算机，将造成用户无法访问. <a href="/">return to dashboard</a>
          </p>

          <form class="search-form">
            <div class="input-group">
              <input type="text" name="search" class="form-control" placeholder="Search">

              <div class="input-group-btn">
                <button type="submit" name="submit" class="btn btn-danger btn-flat"><i class="fa fa-search"></i>
                </button>
              </div>
            </div>
            <!-- /.input-group -->
          </form>
        </div>
      </div>
      <!-- /.error-page -->

    </section>
    <!-- /.content -->
  </div>
</template>
<script>
import {
  mapGetters
} from 'vuex'
const common = require('@/lib/common')
export default {
  name: 'err401',
  mounted: function() {
    common.reSizeCall()
  },
  computed: mapGetters({
    errCode: 'errCode',
    errMsg: 'errMsg'
  })
}
</script>
<style scoped>
</style>
