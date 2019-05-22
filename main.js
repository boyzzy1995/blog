import Vue from 'vue'
import App from './App'

import pageHead from './components/page-head.vue'
import http from './config/http.js'

import store from './store'

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$http = http

Vue.component('page-head', pageHead)

App.mpType = 'app'

const app = new Vue({
    store,
    ...App
})
app.$mount()
