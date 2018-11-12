import Vue from 'vue'
import Router from 'vue-router'
import Signin from '@/components/Signin'
import Home from '@/components/Home'
import ArticleList from '@/components/ArticleList'
import NewArticle from '@/components/NewArticle'
import EditArticle from '@/components/EditArticle'
import Picture from '@/components/Picture'

Vue.use(Router)

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
				{ path: '/article/edit/:aid', component: EditArticle },
				{ path: '/picture', component: Picture }
			]
		},
		{
			path: '/',
			name: 'Signin',
			component: Signin
		},
	]
})
