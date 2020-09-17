<template>
  <v-app light>
    <v-container>
      <v-sheet color="red" class="text-center" v-if="this.farmSelected === undefined">
        <v-list-item-icon left >
          <v-icon large> warning </v-icon>
        </v-list-item-icon>
        <v-list-item-title>Não foi possível buscar informações sobre a propriedade, por favor tente mais tarde.</v-list-item-title>
      </v-sheet>
      <v-card class="mx-auto" v-if="this.farmSelected !== undefined">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="font-weight-light display-1">{{ this.farmSelected.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-card-text>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="font-weight">
                Código da Propriedade:
                <v-chip dark label>
                  <strong>
                    {{ this.farmSelected.code }}
                  </strong>
                </v-chip>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="font-weight">
                Propriedade Ativa:
                <v-chip :color="this.farmSelected.active ? 'green' : 'red'" dark label>
                  <strong>
                    {{ this.farmSelected.active ? 'Sim' : 'Não' }}
                  </strong>
                </v-chip>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="font-weight">
                Proprietário: <strong>{{ this.farmSelected.author }}</strong>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="font-weight">
                Endereço: <strong>{{ this.farmSelected.city || 'N/A' }} - {{ this.farmSelected.state || 'N/A' }}</strong>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
      </v-card>
      <v-layout id="wrapper" justify-center row wrap>

      <v-flex class="pa-2" xs6>
        <v-card>
          <v-card-text>
            <disk-usage />
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex class="px-2 py-2" md6 xs12>
        <v-card>
          <v-card-text>
            <bar-example />
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex class="px-2 py-2" md6 xs12>
        <v-card>
          <v-card-text>
            <radar-example />
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex class="px-2 py-2" md6 xs12>
        <v-card>
          <v-card-text>
            <custom-example />
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios'

import BarExample from '../components/charts/BarExample'
import DiskUsage from '../components/charts/DiskUsage'
import RadarExample from '../components/charts/RadarExample'
import CustomExample from '../components/charts/CustomExample'

export default {
  components: { BarExample, DiskUsage, RadarExample, CustomExample },
  data () {
    return {
      drawer: false,
      farmSelected: null
    }
  },
  created () {
    this.farmSelected = this.$session.get('farmSelected')
    this.loadFarmContext()
  },
  methods: {
    loadFarmContext () {
      const user = this.$session.get('user')
      axios.get(process.env.VUE_APP_CLOUD + '/manager/farm/' + this.$route.params.code, { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
        this.farmSelected = response.data
        this.$session.set('farmSelected', response.data)
      }).catch(function (error) {
        console.log(error)
      })
    },
    logoff () {
      this.$session.clear()
      this.$router.push({ path: '/' })
    },
    go (path) {
      if (this.$router.currentRoute.path === path) return
      this.$router.push({ path: path })
    }
  }
}
</script>
