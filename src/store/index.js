import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    showLog: 1
  },
  mutations: {
    setLogStatus (state, newValue) {
	//   state.showLog = !state.showLog - 0
		state.showLog = newValue;
    }
  }
})
export default store;