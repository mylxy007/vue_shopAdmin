// 引入axios
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1';
//把axios挂载到$http
Vue.prototype.$http = axios;
//引入全局样式
import './assets/css/global.css'
import Vue from 'vue'
import App from './App.vue'

//引入vue-router
import VueRouter from 'vue-router'
//引入router
import router from './router'
// 按需引入element-ui
import {
  Button,
  Form,
  FormItem,
  Input,
  Message
} from 'element-ui'
//使用vue-router
Vue.use(VueRouter)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
//弹窗组件挂载到Vue原型上
Vue.prototype.$message = Message
// 关闭生产提示
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')