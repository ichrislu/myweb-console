// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import { BackTop } from 'iview';
import 'iview/dist/styles/iview.css';
import VueShowdown from 'vue-showdown';
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import VueClipboards from 'vue-clipboards';
import axios from 'axios';
import { get, post } from '@/axios.js'
import xhr from '@/axios.js'

import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.prototype.get = get
Vue.prototype.post = post

Vue.use(ElementUI)
Vue.use(mavonEditor)
Vue.use(VueShowdown, {
	emoji: true,
	tables: true,
	strikethrough: true,
	tasklists: true,
	openLinksInNewWindow: true,
	headerLevelStart: 2
})
const moment = require('moment')
Vue.use(require('vue-moment'), {
	moment
})
Vue.use(VueClipboards);

Vue.use(xhr)

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
