import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Context from '../views/Context.vue'
import Farm from '../views/Farm.vue'
import Gateway from '../views/Gateway.vue'
import About from '../views/About.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/farm',
    name: 'farm',
    component: Farm,
    meta: {
      title: 'Propriedades'
    }
  },
  {
    path: '/context/:code',
    name: 'context',
    component: Context
  },
  {
    path: '/gateways/:code',
    name: 'gateways',
    component: Gateway,
    meta: {
      title: 'Gateways'
    }
  },
  {
    path: '/about/:code',
    name: 'about',
    component: About,
    meta: {
      title: 'Sobre'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
