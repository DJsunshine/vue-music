// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import VueSwiper from 'vue-awesome-swiper'
import VueLazyLoad from 'vue-lazyload'

import logo from './assets/default.png'
Vue.config.productionTip = false

require('swiper/dist/css/swiper.css')
Vue.use(VueSwiper)
Vue.use(VueLazyLoad,{
	loading: logo
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
