import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import {
  Message
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/common.less';
import '@/assets/css/variable.less';
import '@/assets/css/theme/459f75/index.css';
// import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import echarts from 'echarts';
require('./mock');

Vue.config.productionTip = false;
Vue.use(ElementUI, {
  size: 'medium'
});
axios.defaults.headers.common['token'] = localStorage.getItem("token");

Vue.prototype.$echarts = echarts;
Vue.use(ElementUI);

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token'); // 替换为你的实际 Token
    config.headers.common['token'] = token;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use((response) => {
  // 在收到响应后，检查 token 的合法性

  // 请根据实际情况修改判断 token 合法性的逻辑
  const isValidToken = response.data.isValidToken;
  if (response.data.msg == "token非法" || response.data.msg == "token不能为空") {
    Message.warning('请重新登录!');
    localStorage.removeItem('token')
    router.push('/login')
  }

  return response;
}, (error) => {
  return Promise.reject(error);
});

Vue.prototype.$axios = axios; // axios不能使用use

// 使用router.beforeEach注册一个全局前置守卫，对路由进行权限跳转
router.beforeEach((to, from, next) => {
  // 未匹配到路由时 跳转到error页面
  if (0 === to.matched.length) {

    next('/error');
    return false;
  }

  if (to.path == '/login') {
    next()
    return false;
  }
  const role = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  if (!token) {
    Message.warning('请重新登录!');

    next('/login');
    return false;
  }
  // const data = {"token": token}
  // const response = axios.post('http://127.0.0.1:8080/verifyToken', data).then(response => {
  //   if (response.data.code !== 200) {
  //     Message.warning('请先登录!');

  //     next('/login');
  //   }
  // });

  if (!role && to.path != '/login') {

    Message.warning('请重新登录!');

    next('/login');
    return false;
  } else if (to.meta.permission) {

    // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
    role == 'admin' ? next() : next('/error');
  } else {

    // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
    if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {

      Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
        confirmButtonText: '确定'
      });
    } else {

      next();
    }
  }
});
// router.afterEach((to, from, next) => {

// })

new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
});
