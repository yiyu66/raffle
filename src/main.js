import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import './global.css'
Vue.config.productionTip = false
axios.defaults.baseURL = 'http://localhost:3000/' // 配置请求的根目录
new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
