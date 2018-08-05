import Vue from 'vue'
import Vuex from 'vuex'
import error from './modules/error'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    error
  },
  getters
})

export default store
