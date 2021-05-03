<template>
  <div class="container">
    <div class="card m-auto">
      <h2 class="card-header text-center py-4">Add photo of your pet</h2>
      
      <form class="card-body px-5" @submit="addPetToSkyDB">
        <img v-show="imageURL" class="img-fluid mb-3" :src="imageURL" alt="Photo">

        <div class="form-group">
          <label class="font-weight-bold">Image</label>
          <div class="input-group">
            <div class="custom-file">
              <input type="file" class="custom-file-input" @change="getFile">
              <label class="custom-file-label">{{fileName}}</label>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="font-weight-bold">Owner Name</label>
          <input
            class="form-control"
            type="text"
            name="Owner Name"
            v-model="ownerName">
        </div>

        <div class="form-group">
          <label class="font-weight-bold">Type</label>
          <select class="custom-select"  v-model="type" @change={type}>
              <option>None</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Bird">Bird</option>
              <option value="Fish">Fish</option>
              <option value="Other">Other</option>
          </select>
        </div>

        <input v-if="!loading" type="submit" value="Add" class="btn btn-primary primary-bg-color btn-block btn-lg">
        <center v-else>
          <div  class="spinner-border text-primary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </center>
        
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import { dataKey } from '../config';

export default {
  name: 'CreatePet',
  data: () => ({
    ownerName: '',
    type: '',
    file: null,
    fileName: '',
    imageURL: '',
    loading: false
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
    async addPetToSkyDB(e) {
      try {
        e.preventDefault();
        this.loading = true;
        
        let { data, skylink } = await this.skynetClient.db.getJSON(this.publicKey, dataKey);
        console.log(data, skylink);

        const petData = {
          id: data?.pets.length || 0,
          ownerName: this.ownerName,
          type: this.type,
          imageURL: this.imageURL,
          likes: [],
        }

        let json;
        
        if(data === null) {
          json = {
            pets: [petData],
            comments: [],
            petCount: 0
          };
        }
        else {
          data.pets.push(petData);

          json = {
            pets: data.pets,
            comments: data.comments,
            petCount: data.petCount + 1
          };
        }

        const res = await this.skynetClient.db.setJSON(this.privateKey, dataKey, json);
        console.log(res);
        this.loading = false;
        this.$router.push('/');
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
  .card{
    max-width: 500px !important;
    margin-top: 3rem !important;
  }
</style>