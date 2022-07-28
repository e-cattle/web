<template>
    <v-list style="background-color: rgba(255, 255, 255, 0.1);">
      <v-list-item v-if="user && user.authenticated">
        <div v-if="this.$session.get('farmSelected') !== undefined">
          <v-chip :color="'orange'" label>#{{ this.$session.get('farmSelected').code }}</v-chip>
        </div>
        <v-divider vertical insert class="mx-2"></v-divider>
        <v-list-item-avatar>
          <v-img :src="user.picture" :alt="user.name" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ user.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-icon>
          <v-btn icon @click="$emit('clicked')">
            <v-icon>power_settings_new</v-icon>
          </v-btn>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
</template>

<script>
export default {
  data () {
    return {
      user: null
    }
  },
  mounted () {
    this.user = this.$localStorage.get('user')
  }
}
</script>
