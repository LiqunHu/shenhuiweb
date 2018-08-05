<template>
<!-- Left side column. contains the logo and sidebar -->
<aside class="main-sidebar">
  <!-- sidebar: style can be found in sidebar.less -->
  <section class="sidebar">
    <!-- Sidebar user panel -->
    <div class="user-panel">
      <div class="pull-left image">
        <img :src="userinfo.avatar" class="img-circle" alt="User Image">
      </div>
      <div class="pull-left info">
        <p>{{ userinfo.description }}</p>
        <a href="#"><i class="fa fa-circle text-success"></i> {{ userinfo.name }}</a>
      </div>
    </div>
    <!-- sidebar menu: : style can be found in sidebar.less -->
    <ul class="sidebar-menu" data-widget="tree">
      <li class="header">主菜单</li>
      <template v-for="item in userinfo.menulist">
          <li class="treeview">
            <template v-if="item.menu_type === '01'">
              <router-link :to="item.menu_path">
                <i v-bind:class="'fa ' + item.menu_icon "></i>
                <span>{{ item.menu_name }}</span>
                <span class="pull-right-container">
                  <i class="fa fa-angle-left pull-right"></i>
                </span>
              </router-link>
            </template>
            <template v-if="item.menu_type === '00'">
              <a>
                <i :class="'fa ' + item.menu_icon"></i>
                <span> {{ item.menu_name }}</span>
                <span class="pull-right-container">
                  <i class="fa fa-angle-left pull-right"></i>
                </span>
              </a>
              <ul class="treeview-menu">
                <template v-for="sItem in item.sub_menu" v-if="sItem.show_flag === '1'">
                  <template v-if="sItem.menu_type === '01' && sItem.show_flag === '1'">
                    <li>
                      <router-link :to="sItem.menu_path">
                        <i class="fa fa-circle-o">
                        </i> {{ sItem.menu_name }}
                      </router-link>
                    </li>
                  </template>
                  <template v-if="sItem.menu_type === '00'">
                    <li class="treeview">
                      <a href="#"><i :class="'fa '+ sItem.menu_icon"></i> {{ sItem.menu_name }}
                        <span class="pull-right-container">
                          <i class="fa fa-angle-left pull-right"></i>
                        </span>
                      </a>
                      <ul class="treeview-menu">
                        <template v-for="ssItem in sItem.sub_menu">
                          <li><router-link :to="ssItem.menu_path"><i class="fa fa-circle-o"></i> {{ ssItem.menu_name }}</router-link></li>
                        </template>
                      </ul>
                    </li>
                  </template>
                </template>
              </ul>
            </template>
          </li>
        </template>
    </ul>
  </section>
  <!-- /.sidebar -->
</aside>
</template>
<script>
const common = require('@/lib/common')
export default {
  name: 'mainMenu',
  data: function() {
    return {
      userinfo: common.getStoreData('userinfo')
    }
  },
  mounted: function() {}
}
</script>
<style scoped>
</style>
