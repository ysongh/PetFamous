<template>
  <div class="">
    <h1>Upload Image</h1>
    <input type="file" @change="getFile">
    <label>{{fileName}}</label>
    <button @click="uploadFile">Upload</button>
    <img :src="imageURL" alt="Photo">
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'CreatePet',
  data: () => ({
    file: null,
    fileName: '',
    imageURL: ''
  }),
  computed: mapState(['skynetClient']),
  methods: {
    getFile(event) {
      const file = event.target.files[0];
      this.file = file;
      this.fileName = file.name;
    },
    async uploadFile() {
      // Upload user's file and get backs descriptor for our Skyfile
      const { skylink } = await this.skynetClient.uploadFile(this.file);

      // skylinks start with `sia://` and don't specify a portal URL
      // generate URLs for our current portal though.
      const skylinkUrl = await this.skynetClient.getSkylinkUrl(skylink);
      this.imageURL = skylinkUrl;
    }
  }
}
</script>