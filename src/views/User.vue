<template>
  <v-app light>
    <v-data-table v-if="users !== undefined"
    :headers="headers"
    :items="users"
    :search="search"
    sort-by="created"
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
  <v-dialog v-model="dialogEditUser" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline"> {{ editedUser.created? "Editar Gateway de Código " : "Cadastrar Gateway" }}  {{ editedUser.mac }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md6>
                <v-text-field v-model="editedUser.description" label="Descrição do Gateway"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field v-model="editedUser.mac" label="MAC"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field v-model="editedUser.farm" label="Propriedade" disabled></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-select
                  :items="this.users"
                  item-text="name"
                  item-value="_id"
                  v-model="editedUser.author"
                  label="Proprietário"
                  solo
                ></v-select>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-btn
                  :color="editedUser.active ? 'red' : 'green'"
                  :disabled="enabling"
                  @click="editedUser.active = !editedUser.active"
                  text>
                  <v-icon left>{{ editedUser.active ? 'cancel' : 'check' }}</v-icon>
                  {{ editedUser.active ? 'Desativar' : 'Ativar' }}
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
        { text: 'Propriedade', value: 'farm' },
        { text: 'MAC', value: 'mac' },
        { text: 'Registro', value: 'created' },
        { text: 'Proprietário', value: 'authorName' },
        { text: 'Ativo', value: 'active' },
        { text: 'Ações', value: 'action', sortable: false }
      ],
      search: '',
      users: [],
      dialogEditUser: false,
      editedUser: {},
      enabling: false,
      farm: null
    }
  },
  filters: {
    formatDate (value) {
      return (value) ? moment(String(value)).format('DD/MM/YYYY hh:mm a') : ''
    }
  },
  mounted () {
    this.loadUsers()
  },
  methods: {
    loadUsers () {
      const user = this.$localStorage.get('user')
      this.users = []
      axios.get(process.env.VUE_APP_CLOUD + '/web/users', { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
        this.users = response.data
      }).catch(function () {
        this.$alert('Erro ao carregar dados dos usuários, por favor contacte o suporte.', 'Aviso', 'warning')
      })
    },
    editItem (item) {
      this.editedUser = Object.assign({}, item)
      this.dialogEditUser = true
    },
    newItem () {
      this.editedUser = Object.assign({})
      this.dialogEditUser = true
    },
    deleteItem (item) {
      this.$alert('Erro ao deletar usuário, por favor contacte o suporte.', 'Aviso', 'warning')
    },
    close () {
      this.loadGateways()
      this.dialogEditUser = false
      this.editedUser = {}
    },
    save () {
      const user = this.$localStorage.get('user')
      // const farm = this.$session.get('farmSelected')
      if (user._id !== undefined) {
        axios.put(process.env.VUE_APP_CLOUD + '/manager/user/' + user._id, user, { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
          this.dialogEditUser = false
        }).finally(() => {
          this.enabling = false
        })
      } else {
        axios.post(process.env.VUE_APP_CLOUD + '/manager/user', user, { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
          this.$alert('Usuário cadastrado.', 'Aviso', 'success')
          this.dialogEditUser = false
        })
      }
      this.editedUser = {}
      this.loadGateways()
    }/*,
    enable (user) {
      this.enabling = true
      const user = this.$localStorage.get('user')
      axios.put(process.env.VUE_APP_CLOUD + '/manager/user/' + user.mac, { active: true }, { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
        user.active = true
      }).finally(() => {
        this.enabling = false
      })
    },
    disable (user) {
      this.enabling = true
      const user = this.$localStorage.get('user')
      axios.put(process.env.VUE_APP_CLOUD + '/manager/user/' + user.mac, { active: false }, { headers: { Authorization: 'Bearer ' + user.token } }).then((response) => {
        user.active = false
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
