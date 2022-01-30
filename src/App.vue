<template>
  <v-app light>
    <v-app-bar color="teal darken-3" dark v-if="this.$router.currentRoute.path !== '/'">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="this.$session.get('farmSelected') !== undefined"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ this.$route.meta.title }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <user-wrapper @clicked="logoff" style="margin-right: -16px;"></user-wrapper>
    </v-app-bar>
    <template>
      <v-navigation-drawer v-model="drawer" color="teal darken-1" v-if="this.$session.get('farmSelected') !== undefined" absolute clipped temporary dark overflow>
        <p class="text-xs-center my-6">
          <v-img src="./assets/icon.png" width="250" height="120" contain alt="Logo do e-Cattle" />
        </p>
        <div>
          <v-card light shaped class="text-center">
                <v-card-title
                  class="subtitle-1 d-block"
                  v-text="this.$session.get('farmSelected').name">
                </v-card-title>

                <v-card-subtitle v-text="this.$session.get('farmSelected').city + ' - ' + this.$session.get('farmSelected').state"></v-card-subtitle>
          </v-card>
        </div>
        <v-divider></v-divider>
        <v-list>
          <v-list-item-group active-class="deep-purple--text text--accent-4">
            <v-list-item @click="go('/farm')">
              <v-list-item-icon>
                <v-icon>dashboard</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Farm</v-list-item-title>
            </v-list-item>
            <v-list-item @click="go('/gateways')" :disabled="role === 'viewer'">
              <v-list-item-icon>
                <v-icon>mdi-chip</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Gateways</v-list-item-title>
            </v-list-item>
            <v-list-item @click="go('/about')">
              <v-list-item-icon>
                <v-icon>info</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Sobre</v-list-item-title>
            </v-list-item>
            <v-list-item @click="go('/farms')">
              <v-list-item-icon>
                <v-icon>mdi-exit-to-app</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Trocar Fazenda</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-divider></v-divider>
        <p class="text-xs-center" style="position: absolute; bottom: 70px;">
          <v-img src="./assets/embrapa-white.png" width="250" height="70" contain alt="Logo da Embrapa" position-x="center" />
        </p>
      </v-navigation-drawer>
    </template>
    <router-view></router-view>
  </v-app>
</template>

<script>
import UserWrapper from './components/User.vue'

export default {
  components: {
    UserWrapper
  },
  data () {
    return {
      drawer: false,
      role: 'owner'// CONFORME O ROLE HABILITAR O BOTÃO GATEWAYS
    }
  },
  beforeCreate () {
    if (this.$route.path.includes('farms')) this.$session.remove('farmSelected')
  },
  methods: {
    verifyGatewayButton (role) {
      this.role = role
    },
    logoff () {
      this.farms = []
      this.$session.clear()
      this.$router.push({ path: '/' })
    },
    go (path) {
      if (this.$router.currentRoute.path === path) return
      if (path.includes('farms')) this.$session.remove('farmSelected')
      else path = `${path}/${this.$session.get('farmSelected').code}`
      this.drawer = false
      this.$router.push({ path: path })
    }
  }
}
</script>
