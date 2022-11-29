import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    username: null,
    dateJoined: null,
    visitId: null, // id of a visit currently ongoing (null if none)
    alerts: {},
  },
  mutations: {
    alert(state, payload) {
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    setDateJoined(state, dateJoined) {
      /**
       * Update the stored username to the specified one.
       * @param bio - new bio to set
       */
      state.dateJoined = dateJoined;
    },
    setVisitId(state, visitId) {
      /**
       * Update the stored visitId to the specified one.
       * @param visitId - new bio to set
       */
      state.visitId = visitId;
      console.log("VISIT ID SET", visitId);
    },
  },
  plugins: [createPersistedState()],
});

export default store;
