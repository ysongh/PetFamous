<template>
  <div class="">
    <h1>Create Pet</h1>
    <input
      type="text"
      placeholder="Owner Name"
      v-model="ownerName">
    <input type="file" @change="getFile">
    <label>{{fileName}}</label>
    <button @click="addPetToSkyDB">Create</button>
    <img :src="imageURL" alt="Photo">
  </div>
</template>

<script>
import { mapState } from 'vuex';

import { dataKey } from '../config';

export default {
  name: 'CreatePet',
  data: () => ({
    ownerName: '',
    file: null,
    fileName: '',
    imageURL: ''
  }),
  computed: mapState(['skynetClient', 'privateKey', 'publicKey']),
  methods: {
    async getFile(event) {
      const file = event.target.files[0];
      this.fileName = file.name;

      // Upload user's file and get backs descriptor for our Skyfile
      const { skylink } = await this.skynetClient.uploadFile(file);

      // skylinks start with `sia://` and don't specify a portal URL
      // generate URLs for our current portal though.
      const skylinkUrl = await this.skynetClient.getSkylinkUrl(skylink);
      this.imageURL = skylinkUrl;
    },
    async addPetToSkyDB() {
      try {
        let { data, skylink } = await this.skynetClient.db.getJSON(this.publicKey, dataKey);
        console.log(data, skylink);

        const petData = {
          id: data?.petCount || 0,
          ownerName: this.ownerName,
          imageURL: this.imageURL,
          likes: [],
        }

        let json;
        
        if(data === null) {
          json = {
            pets: [petData],
            petCount: 0
          };
        }
        else {
          data.pets.push(petData);

          json = {
            pets: data.pets,
            petCount: data.petCount + 1
          };
        }

        const res = await this.skynetClient.db.setJSON(this.privateKey, dataKey, json);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>