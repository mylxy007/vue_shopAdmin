// 引入axios
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1';
// 通过axios请求拦截器添加token，保证拥有获取数据的权限
axios.interceptors.request.use(config => {
  //为请求头对象，添加 token 验证的 Authorization 字段
  config.headers.Authorization = sessionStorage.getItem('token')
  //最后必须 return config
  return config
})
//把axios挂载到$http
Vue.prototype.$http = axios;
// 按需引入element-ui
import './assets/js/element.js'
//引入vue-table-with-tree-grid树形表格组件
import TreeTable from 'vue-table-with-tree-grid'
//使用TreeTable
Vue.component('tree-table', TreeTable);
//引入全局样式
import './assets/css/global.css'
import Vue from 'vue'
import App from './App.vue'

//引入vue-router
import VueRouter from 'vue-router'
//引入router
import router from './router'

//使用vue-router
Vue.use(VueRouter)

// 关闭生产提示
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')