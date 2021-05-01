<template>
  <div class="container">
    <h1>Pet Famous</h1>

    <div class="card-columns">
      <div class="card" :key="pet.id" v-for="pet in this.pets">
        <img class="card-img-top" :src="pet.imageURL" alt="Pet">
        <div class="card-body">
          <h5 class="card-title">{{pet.ownerName}} ({{pet.type}})</h5>
          <router-link class="btn btn-primary" :to="{ path: '/pet/'+ pet.id}">
            View
          </router-link>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from 'vuex';

import { dataKey } from '../config';

export default {
  name: 'Home',
  data: () => ({
    pets: []
  }),
  computed: mapState(['skynetClient', 'privateKey', 'publicKey']),
  async created() {
    try {
      const { data, skylink } = await this.skynetClient.db.getJSON(this.publicKey, dataKey);
      console.log(data, skylink);
      this.pets = data.pets;
    } catch (error) {
      console.log(error);
    }
  }
}
</script>
