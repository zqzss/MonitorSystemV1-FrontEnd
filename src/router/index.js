import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);


const router = new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      redirect: '/index',
      meta: {
        requiresAuth: true // 需要认证
      }
    },

    {
      path: '/',
      component: () => import('../components/common/Base.vue'),
      meta: {
        title: '公共部分',
        requiresAuth: true // 需要认证
      },
      children: [{
          path: '/index',
          component: () => import('../components/page/Home.vue'),
          meta: {
            title: '系统首页',
            requiresAuth: true // 需要认证
          }
        },
        {
          path: '/chart-simple',
          component: () => import('../components/page/EchartsSimple.vue'),
          meta: {
            title: '简单图表',
            requiresAuth: true // 需要认证
          }
        },
        {
          path: '/chart-complex',
          component: () => import('../components/page/EchartsComplex.vue'),
          meta: {
            title: '复杂图表',
            requiresAuth: true // 需要认证
          }
        },
        {
          path: '/tab',
          component: () => import('../components/page/Tab.vue'),
          meta: {
            title: 'tab选项卡',
            requiresAuth: true // 需要认证
          }
        },
        {
          path: '/table',
          component: () => import('../components/page/Table.vue'),
          meta: {
            title: '表格',
            requiresAuth: true // 需要认证
          }
        },
        {
          path: '/host',
          component: () => import('../components/page/Host.vue'),
          meta: {
            title: '主机', // 设置正确的 title 值
            requiresAuth: true // 需要认证
          }
        },
        {
          path: '/monitorItem',
          component: () => import('../components/page/monitorItem.vue'),
          meta: {
            title: '监控项', // 设置正确的 title 值
            requiresAuth: true // 需要认证
          }
        },
        {
          path: '/monitorAlarm',
          component: () => import('../components/page/monitorAlarm.vue'),
          meta: {
            title: '告警记录', // 设置正确的 title 值
            requiresAuth: true // 需要认证
          }
        },
        {
          path: '/monitorData',
          component: () => import('../components/page/monitorData.vue'),
          meta: {
            title: '告警数据', // 设置正确的 title 值
            requiresAuth: true // 需要认证
          }
        },
        {
          path: '/user',
          component: () => import('../components/page/user.vue'),
          meta: {
            title: '用户', // 设置正确的 title 值
            requiresAuth: true // 需要认证
          }
        },
        {
          path: '/noticeConfig',
          component: () => import('../components/page/noticeConfig.vue'),
          meta: {
            title: '通知配置', // 设置正确的 title 值
            requiresAuth: true // 需要认证
          }
        },
      ]
    },
    {
      path: '/login',
      component: () => import('../components/page/Login.vue')
    },
    {
      path: '/error',
      component: () => import('../components/page/Error.vue')
    },
    {
      path: '/404',
      component: () => import('../components/page/404.vue')
    },
    // {
    //   path: '/test',
    //   component: () => import('../components/page/test.vue')
    // },
  ]
})


export default router
