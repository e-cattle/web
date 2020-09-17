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
        <!--v-icon
          @click="deleteItem(item)"
        >
          delete
        </v-icon-->
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="loadGateways">Recarregar</v-btn>
      </template>
      <template v-slot:no-results>
        <v-alert :value="true" color="error" icon="warning">
          Sua busca por <strong>"{{ search }}"</strong> não encontrou resultados.
        </v-alert>
      </template>
      <template v-slot:footer>
      <v-text-field
      v-model="search"
      append-icon="search"
      label="Buscar">
      </v-text-field>
    </template>
  </v-data-table>
  <div class="pt-2 text-right">
    <v-btn color="primary" @click="newItem()">Cadastrar Gateway</v-btn>
  </div>
  <v-dialog v-model="dialogEditGateway" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline"> {{ editedGateway.created? "Editar Gateway de Código " : "Cadastrar Gateway" }}  {{ editedGateway.mac }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md6>
                <v-text-field v-model="editedGateway.description" label="Descrição do Gateway"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field v-model="editedGateway.mac" label="MAC"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field v-model="editedGateway.farm" label="Propriedade" disabled></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-select
                  :items="this.users"
                  item-text="name"
                  item-value="_id"
                  v-model="editedGateway.author"
                  label="Proprietário"
                  solo
                ></v-select>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-btn
                  :color="editedGateway.active ? 'red' : 'green'"
                  :disabled="enabling"
                  @click="editedGateway.active = !editedGateway.active"
                  text>
                  <v-icon left>{{ editedGateway.active ? 'cancel' : 'check' }}</v-icon>
                  {{ editedGateway.active ? 'Desativar' : 'Ativar' }}
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" class="white--text" @click="close">Cancelar</v-btn>
          <v-btn color="blue darken-1" class="white--text" @click="save">Salvar</v-btn>
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
        { text: 'Proprietário', value: 'authorName' },
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
      const user = this.$session.get('user')
      const farmSelected = this.$session.get('farmSelected')
      var self = this
      axios.get(process.env.VUE_APP_CLOUD + '/manager/gateways/' + farmSelected.code, { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
        self.gateways = response.data
        self.gateways.forEach(item => {
          var index = this.users.findIndex(i => i._id === item.author)
          if (index !== -1) {
            item.authorName = this.users[index].name
          } else {
            item.authorName = ''
          }
        })
      }).catch(function (error) {
        console.log(error)
      })
    },
    loadUsers () {
      const user = this.$session.get('user')
      this.users = []
      axios.get(process.env.VUE_APP_CLOUD + '/manager/users', { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
        this.users = response.data
      }).catch(function (error) {
        console.log(error)
      })
    },
    editItem (item) {
      this.editedGateway = Object.assign({}, item)
      this.dialogEditGateway = true
    },
    newItem () {
      this.editedGateway = Object.assign({})
      this.dialogEditGateway = true
    },
    deleteItem (item) {
      console.log('delete')
    },
    close () {
      this.loadGateways()
      this.dialogEditGateway = false
      this.editedGateway = {}
    },
    save () {
      const user = this.$session.get('user')
      const gateway = this.editedGateway
      gateway.farm = this.$session.get('farmSelected')
      if (gateway.mac !== undefined) {
        axios.put(process.env.VUE_APP_CLOUD + '/manager/gateway/' + gateway.mac, gateway, { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
          this.dialogEditGateway = false
        }).finally(() => {
          this.enabling = false
        })
      } else {
        axios.post(process.env.VUE_APP_CLOUD + '/manager/gateway', gateway, { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
          this.dialogEditGateway = false
        })
      }
      this.editedGateway = {}
      this.loadGateways()
    }/*,
    enable (gateway) {
      this.enabling = true
      const user = this.$session.get('user')
      axios.put(process.env.VUE_APP_CLOUD + '/manager/gateway/' + gateway.mac, { active: true }, { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
        gateway.active = true
      }).finally(() => {
        this.enabling = false
      })
    },
    disable (gateway) {
      this.enabling = true
      const user = this.$session.get('user')
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
