import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({y: 0}),
  routes: [
    { path: '*', component: resolve => require(['@/components/err404'], resolve) },
    { path: '/', component: resolve => require(['@/views/login'], resolve) },
    { path: '/error404', component: resolve => require(['@/components/err404'], resolve) },
    { path: '/error', component: resolve => require(['@/components/errpage'], resolve) },
    { path: '/common/system',
      component: resolve => require(['@/components/mainSystem'], resolve),
      children: [
        { path: 'home', component: resolve => require(['@/views/home'], resolve) },
        { path: 'error401', component: resolve => require(['@/components/err401'], resolve) },
        { path: 'SystemApiControl', component: resolve => require(['@/views/common/system/SystemApiControl'], resolve) },
        { path: 'DomainTemplateControl', component: resolve => require(['@/views/common/system/DomainTemplateControl'], resolve) },
        { path: 'DomainControl', component: resolve => require(['@/views/common/system/DomainControl'], resolve) },
        { path: 'DomainGroupControl', component: resolve => require(['@/views/common/system/DomainGroupControl'], resolve) },
        { path: 'DomainGroupApiControl', component: resolve => require(['@/views/common/system/DomainGroupApiControl'], resolve) },
        { path: 'OperatorControl', component: resolve => require(['@/views/common/system/OperatorControl'], resolve) },
        { path: 'UserSetting', component: resolve => require(['@/views/common/system/UserSetting'], resolve) }
        // { path: 'ResetPassword', component: resolve => require(['@/views/common/system/ResetPassword'], resolve) }
      ]}
  ]
})
