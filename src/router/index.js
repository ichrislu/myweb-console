import Vue from 'vue'
import Router from 'vue-router'
import Signin from '@/components/Signin'
import Home from '@/components/Home'
import ArticleList from '@/components/ArticleList'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HOME',
      component: Home,
      children: [
        { path: '/article/list', component: ArticleList },
        { path: '/article/new', component: ArticleList }
      ]
    },
    // {
    //   path: '/',
    //   name: 'Signin',
    //   component: Signin
    // },
    // {
    //   path: '/article/list',
    //   name: 'ArticleList',
    //   component: ArticleList
    // },
    // {
    //   path: '/article/new',
    //   name: 'NewArticle',
    //   component: ArticleList
    // }
  ]
})
