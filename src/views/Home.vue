<template>
  <div class="home">
    <h1>Pet Famous</h1>
    <button @click="setJSONFromSkyDB()">Set Data</button>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from 'vuex';

import { dataKey } from '../config';

export default {
  name: 'Home',
  computed: mapState(['skynetClient', 'privateKey', 'publicKey']),
  methods: {
    async setJSONFromSkyDB(){
      try {
        const json = {
          message: "Hello"
        };
        const { data, skylink } = await this.skynetClient.db.setJSON(this.privateKey, dataKey, json);
        console.log(data, skylink);
      } catch (error) {
        console.log(error);
      }
    }
  },
  async created() {
    try {
      const { data, skylink } = await this.skynetClient.db.getJSON(this.publicKey, dataKey);
      console.log(data, skylink);
    } catch (error) {
      console.log(error);
    }
  }
}
</script>
