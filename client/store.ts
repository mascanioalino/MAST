import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    username: null,
    curatorId: null,
    dateJoined: null,
    userVisits: [],
    visitId: null, // id of a visit currently ongoing (null if none)
    visitWorks: [],
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
    setCuratorId(state, curatorId) {
      /**
       * Update the stored username to the specified one.
       * @param curatorId - new username to set
       */
      state.curatorId = curatorId;
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
    },
    setUserVisits(state, userVisits) {
      /**
       * Update the stored visitId to the specified one.
       * @param visitId - new bio to set
       */
      state.userVisits = userVisits;
      console.log("user VISITs  SET", userVisits);
    },
    async refreshVisitWorks(state) {
      const url = '/api/visits/current/session';
      const res = await fetch(url).then(async r => r.json());
      if(res !== null) {
        state.visitWorks = res.works;
      } else {
        state.visitWorks = []
      }
    },
  },
  plugins: [createPersistedState()],
});

export default store;
