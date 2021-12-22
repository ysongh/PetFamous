<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4">
    <div class="container">
      <li class="navbar-brand" data-toggle="collapse" data-target=".navbar-collapse.show">
        <router-link class="nav-link" to="/">
          <img src="../assets/logo.png" alt="Logo">
        </router-link>
      </li>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
            <router-link class="nav-link" to="/create-pet">Create Pet</router-link>
          </li>
        </ul>
        <ul class="navbar-nav">
          <li v-if="!this.userID" class="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
            <span class="btn btn-primary" @click="this.handleMySkyLogin()">Login</span>
          </li>
          <li v-else class="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
            <span class="btn btn-danger" @click="this.handleMySkyLogout()">Logout</span>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Navbar',
  computed: mapGetters(['userID', 'mySky']),
  methods: mapActions(['initMySky', 'handleMySkyLogin', 'handleMySkyLogout']),
  async created() {
    await this.initMySky();
    console.log(this.userID, "userID");
  }
}
</script>
