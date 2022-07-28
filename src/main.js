import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import session from 'vue-sessionstorage'
import storage from 'vue-localstorage'
// import './auth'

Vue.use(session)
Vue.use(storage, {
  name: 'localStorage',
  bind: true
})

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  storage,
  session,
  render: function (h) { return h(App) }
}).$mount('#app')
