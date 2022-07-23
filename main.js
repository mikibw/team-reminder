import Vue from 'vue'
import App from './App'

import store from './store'
Vue.prototype.$store = store

import './common/Extensions.js'
import './common/Global.scss'

Vue.config.productionTip = false

App.mpType = 'app'
const app = new Vue({
	store,
	...App
})
app.$mount()
