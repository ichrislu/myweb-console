import Vue from 'vue'
import Router from 'vue-router'
import Signin from '@/components/Signin'
import Home from '@/components/Home'
import ArticleList from '@/components/ArticleList'
import NewArticle from '@/components/NewArticle'
import EditArticle from '@/components/EditArticle'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

Vue.use(Router)
Vue.use(mavonEditor)

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/article',
			name: 'Home',
			component: Home,
			children: [
				{ path: '/article/list', component: ArticleList },
				{ path: '/article/new', component: NewArticle },
				{ path: '/article/edit/:aid', component: EditArticle }
			]
		},
		{
			path: '/',
			name: 'Signin',
			component: Signin
		},
	]
})
