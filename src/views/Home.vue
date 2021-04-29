<template>
  <div class="home">
    <h1>Pet Famous</h1>
    <button @click="setJSONFromSkyDB()">Set Data</button>
  </div>
</template>

<script>
// @ is an alias to /src
import { SkynetClient, genKeyPairFromSeed } from "skynet-js";
import { seedphase } from '../config';

const portal = 'https://siasky.net/';
const client = new SkynetClient(portal);
const { privateKey, publicKey } = genKeyPairFromSeed(seedphase);
const dataKey = "localhost";

export default {
  name: 'Home',
  methods: {
    async setJSONFromSkyDB(){
      try {
        const json = {
          message: "It works"
        };
        const { data, skylink } = await client.db.setJSON(privateKey, dataKey, json);
        console.log(data, skylink);
      } catch (error) {
        console.log(error);
      }
    }
  },
  async created() {
    try {
      const { data, skylink } = await client.db.getJSON(publicKey, dataKey);
      console.log(data, skylink);
    } catch (error) {
      console.log(error);
    }
  }
}
</script>
