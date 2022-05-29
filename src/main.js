import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import toast from "./components/commom/toast/index.js";

import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
  laodingL: require('./assets/img/common/placeholder.png'),
})

import FastClick from "fastclick";

Vue.config.productionTip = false

Vue.use(toast)

// 解决移动端300ms延迟
FastClick.attach(document.body)

Vue.prototype.$bus = new Vue()

new Vue({
  router,
  store,
  toast,
  render: h => h(App)
}).$mount('#app')
