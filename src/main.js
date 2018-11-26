// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import { BackTop } from 'iview';
// import 'iview/dist/styles/iview.css';
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import VueClipboards from 'vue-clipboards';
import myaxios from '@/myaxios.js'

import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(mavonEditor)
const moment = require('moment')
Vue.use(require('vue-moment'), {
	moment
})
Vue.use(VueClipboards);
Vue.use(myaxios)

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	components: {
		App
	},
	template: '<App/>'
})

router.beforeEach((to, from, next) => {
	if (sessionStorage.getItem("key") == null && to.fullPath != "/") {
		next({
			path: '/',
			query: { redirect: to.fullPath }
		})
	} else {
		next()
	}
})
