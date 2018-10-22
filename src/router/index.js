import Vue from 'vue'
import Router from 'vue-router'
import Signin from '@/components/Signin'
import Article from '@/components/Article'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/article',
      name: 'Article',
      component: Article
    }
  ]
})
