import { createStore } from 'vuex';
import { SkynetClient, genKeyPairFromSeed } from "skynet-js";
import { seedphase } from '../config';

const portal = 'https://siasky.net/';
const client = new SkynetClient(portal);
const { privateKey, publicKey } = genKeyPairFromSeed(seedphase);
//const dataDomain = window.location.hostname;
const hostApp = "host-app.hns";

export default createStore({
  state: {
    skynetClient: client,
    publicKey: publicKey,
    privateKey: privateKey,
    mySky: null,
    userID: null
  },
  mutations: {
    setMySky: (state, mySky) => (state.mySky = mySky),
    setUserID: (state, userID) => (state.userID = userID)
  },
  actions: {
    async initMySky({ commit }) {
      try {
        const mySky = await client.loadMySky(hostApp);
        const loggedIn = await mySky.checkLogin();

        commit('setMySky', mySky);
        if (loggedIn) {
          commit('setUserID', await mySky.userID());
        }
      } catch (e) {
        console.error(e);
      }
    },
    async handleMySkyLogin({ commit, state}) {
      console.log(state.mySky, "state.mySky")
      const status = await state.mySky.requestLoginAccess();
      console.log(status, "status")
      if (status) {
        commit('setUserID', await mySky.userID());
      }
    },
    async handleMySkyLogout({ commit }){
      await this.mySky.logout();
  
      commit('setUserID', '');
    }
  },
  modules: {
  }
})
