import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: require('@/components/Home')
    },
    {
      path: '/detail',
      name: 'Detail',
      component: require('@/components/Detail')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})