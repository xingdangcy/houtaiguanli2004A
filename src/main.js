import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入全局样式表
import './assets/css/global.css'

// 配置vant
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts=echarts

// 图片懒加载
import { Lazyload } from 'vant';
Vue.use(Lazyload);

// 引入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 配置axios信息
import axios from "axios"
// 配置请求的跟路径
axios.defaults.baseURL='https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios;

// 路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取token
  const token = window.sessionStorage.getItem("token")
  if (to.path == '/login') {
  if (token !== null) {
  next('/home')
  }
  } else {
  if (token == null) {
  return next('/login')
  }
  }
  next()
  })



Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
