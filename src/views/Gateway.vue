<template>
  <v-app light>
    <v-data-table v-if="gateways !== undefined"
    :headers="headers"
    :items="gateways"
    :search="search"
    sort-by="created"
    :sort-desc="true"
    class="elevation-1">
      <template v-slot:item.description="{ item }">
        {{ item.description }}
      </template>
      <template v-slot:item.farm="{ item }">
        <v-chip color="gray" dark label class="plain" small>{{ item.farm.code }}</v-chip>
        {{ item.farm.name }}
      </template>
      <template v-slot:item.active="{ item }">
        <v-chip :color="item.active ? 'green' : 'red'" dark label>{{ item.active ? 'Sim' : 'Não' }}</v-chip>
      </template>
      <template v-slot:item.created="{ item }">
        {{ item.created | formatDate }}
      </template>
      <template v-slot:item.author="{ item }">
        {{ item.author }}
      </template>
      <template v-slot:item.mac="{ item }">
        <v-chip color="gray" dark label class="plain" small>{{ item.mac }}</v-chip>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon
          class="mr-2"
          @click="editItem(item)"
        >
          edit
        </v-icon>
        <v-icon
          @click="deleteItem(item)"
        >
          delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="loadGateways">Recarregar</v-btn>
      </template>
      <template v-slot:no-results>
        <v-alert :value="true" color="error" icon="warning">
          Sua busca por <strong>"{{ search }}"</strong> não encontrou resultados.
        </v-alert>
      </template>
      <v-row wrap>
        <template v-slot:footer>
          <v-text-field
          v-model="search"
          append-icon="search"
          label="Buscar" cols="10"
            sm="4">
          </v-text-field>
        </template>
      </v-row>
  </v-data-table>
  <!--div class="pt-2 text-right">
    <v-btn color="primary" @click="newItem()">Cadastrar Gateway</v-btn>
  </div-->
  <v-dialog v-model="dialogEditGateway" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline"> {{ "Editar Gateway " }} <!--v-chip color="gray" dark label class="plain" small>{{ editedGateway.mac }}</v-chip--></span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm12 md12>
                <v-text-field
                  v-model="editedGateway.description"
                  label="Descrição do Gateway"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-btn
                  :color="editedGateway.active ? 'red' : 'green'"
                  :disabled="enabling"
                  @click="editedGateway.active = !editedGateway.active"
                  text>
                  <v-icon left>{{ editedGateway.active ? 'cancel' : 'check' }}</v-icon>
                  {{ editedGateway.active ? 'Desativar Gateway' : 'Ativar Gateway' }}
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" class="white--text" @click="close">Cancelar</v-btn>
          <v-btn color="blue darken-1" class="white--text" @click="enableDisable">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  data () {
    return {
      headers: [
        {
          text: 'Descrição',
          align: 'left',
          value: 'description'
        },
        { text: 'MAC', value: 'mac' },
        { text: 'Registro', value: 'created' },
        { text: 'Última alteração', value: 'author.name' },
        { text: 'Ativo', value: 'active' },
        { text: 'Ações', value: 'action', sortable: false }
      ],
      search: '',
      gateways: [],
      dialogEditGateway: false,
      editedGateway: {},
      enabling: false,
      users: [],
      farm: null
    }
  },
  filters: {
    formatDate (value) {
      return (value) ? moment(String(value)).format('DD/MM/YYYY hh:mm a') : ''
    }
  },
  updated () {
    this.farm = this.$session.get('farmSelected')
  },
  mounted () {
    this.loadUsers()
    this.loadGateways()
  },
  methods: {
    loadGateways () {
      const user = this.$localStorage.get('user')
      const farmSelected = this.$session.get('farmSelected')
      var self = this
      axios.get(process.env.VUE_APP_CLOUD + '/web/gateways/' + farmSelected.code, { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
        self.gateways = response.data
      }).catch(function (error) {
        console.log(error)
      })
    },
    loadUsers () {
      const user = this.$localStorage.get('user')
      this.users = []
      axios.get(process.env.VUE_APP_CLOUD + '/web/users', { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
        this.users = response.data
      }).catch(function (error) {
        console.log(error)
      })
    },
    editItem (item) {
      this.editedGateway = Object.assign({}, item)
      this.dialogEditGateway = true
    },
    deleteItem (item) {
      this.enabling = true
      this.editedGateway = Object.assign({}, item)
      const user = this.$localStorage.get('user')
      axios.delete(process.env.VUE_APP_CLOUD + '/web/gateway/' + this.editedGateway.mac, { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
        this.editedGateway = {}
        this.loadGateways()
      }).finally(() => {
        this.enabling = false
      })
    },
    close () {
      this.loadGateways()
      this.dialogEditGateway = false
      this.editedGateway = {}
    },
    enableDisable () {
      const user = this.$localStorage.get('user')
      var updaterUser = this.users.find(item => item.name === user.name)
      this.editedGateway.author = updaterUser
      this.editedGateway.approver = updaterUser
      this.editedGateway.approve = true
      delete this.editedGateway.changed
      delete this.editedGateway.registered
      const gateway = this.editedGateway
      if (gateway.mac !== undefined) {
        axios.put(process.env.VUE_APP_CLOUD + '/web/gateway/' + gateway.mac, gateway, { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
          this.dialogEditGateway = false
        }).finally(() => {
          this.enabling = false
        })
      }
      this.editedGateway = {}
      this.loadGateways()
    }/*,
    enable (gateway) {
      this.enabling = true
      const user = this.$localStorage.get('user')
      axios.put(process.env.VUE_APP_CLOUD + '/manager/gateway/' + gateway.mac, { active: true }, { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
        gateway.active = true
      }).finally(() => {
        this.enabling = false
      })
    },
    disable (gateway) {
      this.enabling = true
      const user = this.$localStorage.get('user')
      axios.put(process.env.VUE_APP_CLOUD + '/manager/gateway/' + gateway.mac, { active: false }, { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
        gateway.active = false
      }).finally(() => {
        this.enabling = false
      })
    } */
  }
}
</script>

<style scoped>
.plain {
  font-family: 'Courier New', Courier, monospace;
  font-weight: bolder;
}
</style>
