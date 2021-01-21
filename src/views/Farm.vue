<template>
  <v-app light>
    <v-main>
      <v-row dense>
        <v-col
          v-for="(item, i) in farms"
          :key="i"
          cols="12"
          md="3">
          <v-card
            :color="colors[i % 2]"
            dark>
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title
                  class="headline"
                  v-text="item.name">
                </v-card-title>

                <v-card-subtitle v-text="item.code"></v-card-subtitle>
                <v-card-actions>
                  <v-btn
                    @click="go('/context', item)"
                    color="primary"
                    class="ma-2 white--text">
                      <v-icon v-if="item.users[0].role === 'owner'">mdi-account-cowboy-hat</v-icon>
                      <v-icon v-if="item.users[0].role === 'manager'">mdi-cog</v-icon>
                      <v-icon v-if="item.users[0].role === 'viewer'">mdi-eye</v-icon>
                      {{ item.users[0].role }}
                  </v-btn>
                </v-card-actions>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-main>
    <router-view></router-view>
  </v-app>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      drawer: false,
      farms: [],
      colors: ['#3498db', '#2980b9']
    }
  },
  mounted () {
    this.$session.remove('farmSelected')
    this.loadFarms()
  },
  methods: {
    logoff () {
      this.$session.clear()
      this.$router.push({ path: '/' })
    },
    go (path, item) {
      if (this.$router.currentRoute.path === path) return
      this.$session.set('farmSelected', item)
      // path = (item !== undefined) ? `${path}/${item.code}` : path
      this.$router.push({ path: `${path}/` + item.code })
    },
    loadFarms () {
      const user = this.$session.get('user')
      var self = this
      axios.get(process.env.VUE_APP_CLOUD + '/manager/farms/user/' + user.email, { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
        self.farms = response.data
      }).catch(function (error) {
        console.log(error)
      })
    }
  }
}
</script>
