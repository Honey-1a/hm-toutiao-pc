import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import router from '@/router'

import axios from '@/api'
// import MyBread from '@/components/my_bread'
// Vue.component('my-bread', MyBread)

// 引入注册全局组件
import plugin from '@/components'
Vue.use(plugin)

Vue.use(ElementUI)
Vue.prototype.$http = axios

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
