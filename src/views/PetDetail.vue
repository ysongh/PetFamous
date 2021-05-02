<template>
  <div class="container">
    <div v-show="error" class="alert alert-danger" data-dismiss="alert" role="alert">
      {{error}}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <h1>Pet Detail</h1>
    <img class="img-fluid" v-show="this.pet.imageURL" :src="this.pet.imageURL" alt="Pet">
    <p>{{this.pet.type}}</p>
    <p>Owner {{this.pet.ownerName}}</p>
    <button class="btn btn-info" @click="likeAPetToSkyDB">{{numberOfLikes}} Likes</button>
    <div class="my-2"></div>
    <button v-if="!account" class="btn btn-primary" @click="loadWeb3">
      Connect to Wallet to mint NFT
    </button>
    <button v-else class="btn btn-primary" @click="mintPetNFT">Mint this Pet NFT</button>
    <p class="mt-3">{{transactionHash}}</p>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Web3 from 'web3';

import { dataKey } from '../config';
import PetFamousBlockchain from '../abis/PetFamous.json';

export default {
  name: 'PetDetail',
  data: () => ({
    pet: {},
    account: '',
    petFamousBlockchain: null,
    transactionHash: '',
    error: ''
  }),
  computed: {
    ...mapState(['skynetClient', 'publicKey', 'privateKey', 'userID']),
    numberOfLikes(){
      return this.pet.likes.length;
    }
  },
  methods: {
    async loadWeb3(){
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);

        await window.ethereum.enable();
      }
      else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      }
      else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }

      const web3 = window.web3;

      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      const networkId = await web3.eth.net.getId();
      const networkData = PetFamousBlockchain.networks[networkId];

      if(networkData){
        const abi = PetFamousBlockchain.abi;
        const address = PetFamousBlockchain.networks[networkId].address;

        const petFamousBlockchain = new web3.eth.Contract(abi, address);
        this.petFamousBlockchain = petFamousBlockchain;
      }else{
        window.alert('Contract is not deployed to detected network')
      }
    },
    async mintPetNFT(){
      const event = await this.petFamousBlockchain.methods
        .mintPetNFT(this.pet.imageURL)
        .send({ from: this.account });
      console.log(event);
      this.transactionHash = event.transactionHash;
    },
    async likeAPetToSkyDB() {
      try {
        let { data, skylink } = await this.skynetClient.db.getJSON(this.publicKey, dataKey);
        console.log(data, skylink);

        const alreadyLiked = data.pets[this.$route.params.id].likes.includes(this.userID);
        console.log(alreadyLiked, this.userID);

        if(alreadyLiked) {
          this.error = "You alreay like this pet";
          return;
        }
        data.pets[this.$route.params.id].likes.push(this.userID);

        const json = {
          pets: data.pets,
          petCount: data.petCount
        };

        const res = await this.skynetClient.db.setJSON(this.privateKey, dataKey, json);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  },
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