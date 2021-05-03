<template>
  <div class="container">

    <div v-show="error" class="alert alert-danger" data-dismiss="alert" role="alert">
      {{error}}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>

    <div v-show="success" class="alert alert-success" data-dismiss="alert" role="alert">
      {{success}}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>

     <h1>Pet Detail</h1>

    <div class="row">
      <div class="col-sm-12 col-md-6">
        <img class="img-fluid" v-show="this.pet.imageURL" :src="this.pet.imageURL" alt="Pet">
        <p>{{this.pet.type}}</p>
        <p>Owner {{this.pet.ownerName}}</p>
        <button class="btn btn-info" @click="likeAPetToSkyDB">{{numberOfLikes}} Likes</button>
        <div class="my-2"></div>
        <button v-if="!account" class="btn btn-primary" @click="loadWeb3">
          Connect to Wallet to mint NFT
        </button>
        <button v-else class="btn btn-primary" @click="mintPetNFT">Mint this Pet NFT</button>
        <br />
        <a v-show="transactionHash" :href="'https://explorer-mumbai.maticvigil.com/tx/' + transactionHash" class="mt-3" target="_blank" rel="noopener noreferrer">
          See Transaction
        </a>
      </div>
       <div class="col-sm-12 col-md-6">
         <div class="form-group">
          <label class="font-weight-bold">Comment</label>
          <textarea
            class="form-control"
            type="text"
            name="comment"
            rows="2"
            v-model="comment"></textarea>    
        </div>
        <button class="btn btn-warning mb-4" @click="addCommentToSkyDB">Add comment</button>
        
        <div class="media" :key="comment.comment" v-for="comment in this.comments">
          <img src="../assets/defaultuser.png" class="mr-3" alt="User">
          <div class="media-body">
            <p class="mt-0 font-weight-bold">{{comment.userID.slice(0, 25)}}...</p>
            <p>{{comment.comment}}</p>
          </div>
        </div>
      </div>
    </div>
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
    comments: [],
    comment: '',
    error: '',
    success: '',
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
        this.success = "You liked this pet";
        this.pet.likes.push(this.userID);
      } catch (error) {
        console.log(error);
      }
    },
    async addCommentToSkyDB() {
      try {
        let { data, skylink } = await this.skynetClient.db.getJSON(this.publicKey, dataKey);
        console.log(data, skylink);

        const commentData = {
          petId: this.$route.params.id,
          comment: this.comment,
          date: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
          userID: this.userID
        };

        this.comments.push(commentData);

        if(data.comments) data.comments.push(commentData);
        else data.comments = [commentData];

        const json = {
          pets: data.pets,
          comments: data.comments
        };

        await this.skynetClient.db.setJSON(this.privateKey, dataKey, json);

        this.comment = '';
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
      this.comments = data.comments.filter(comment => comment.petId === this.$route.params.id);
    } catch (error) {
      console.log(error);
    }
  }
}
</script>