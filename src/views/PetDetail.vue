<template>
  <div class="container">
    <h1>Pet Detail</h1>
		<img class="img-fluid" v-show="this.pet.imageURL" :src="this.pet.imageURL" alt="Pet">
		<p>{{this.pet.ownerName}}</p>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import { dataKey } from '../config';

export default {
  name: 'PetDetail',
  data: () => ({
    pet: {}
  }),
  computed: mapState(['skynetClient', 'publicKey']),
  async created() {
    try {
      const { data, skylink } = await this.skynetClient.db.getJSON(this.publicKey, dataKey);
      console.log(data, skylink);
      this.pet = data.pets[this.$route.params.id];
    } catch (error) {
      console.log(error);
    }
  }
}
</script>