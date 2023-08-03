import { createStore } from 'vuex'
import getters from './getters'
import app from "@/store/modules/app";
import aboM from "@/store/modules/abisMethods";

export default createStore({
  state: {
    baseUrl:"https://lending.bbbing.co"
  },
  getters,
  mutations: {
  },
  actions: {},

  modules: {
    app,
    ...aboM
  }
})
