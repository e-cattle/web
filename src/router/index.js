import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Farm from '../views/Farm.vue'
import Farms from '../views/Farms.vue'
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
    path: '/farms',
    name: 'farms',
    component: Farms,
    meta: {
      title: 'Propriedades'
    }
  },
  {
    path: '/farm/:code',
    name: 'farm',
    component: Farm
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
