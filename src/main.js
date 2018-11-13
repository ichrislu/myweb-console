// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import VueShowdown from 'vue-showdown';
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import ajax from '@/axios.js';

import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false
Vue.prototype.axios = axios

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
Vue.use(ajax)

const moment = require('moment')
Vue.use(require('vue-moment'), {
    moment
})

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	components: {
		App
	},
	template: '<App/>'
})
