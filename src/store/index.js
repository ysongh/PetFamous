import { createStore } from 'vuex';
import { SkynetClient, genKeyPairFromSeed } from "skynet-js";
import { seedphase } from '../config';

const portal = 'https://siasky.net/';
const client = new SkynetClient(portal);
const { privateKey, publicKey } = genKeyPairFromSeed(seedphase);

export default createStore({
  state: {
    skynetClient: client,
    publicKey: publicKey,
    privateKey: privateKey
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
