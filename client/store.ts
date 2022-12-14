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
    async refreshUserVisits(state) {
      /**
       * Update the stored visitId to the specified one.
       */
      if(state.curatorId) {
        fetch(`/api/visits?curatorId=${state.curatorId}`, {
          credentials: "same-origin"
        })
          .then((res) => res.json())
          .then((res) => {
            state.userVisits = res;
            console.log(res);
          });
      } else {
        state.userVisits = [];
      }
    },
    async refreshCurrentVisit(state) {
      if(state.curatorId) {
        const url = '/api/visits/current/session';
        const res = await fetch(url).then(async r => r.json());
        if(res !== null) {
          state.visitId = res._id;
          state.visitWorks = res.works;
        } else {
          state.visitId = null;
          state.visitWorks = [];
        }
      } else {
        state.visitId = null;
        state.visitWorks = [];
      }
    },
  },
  plugins: [createPersistedState()],
});

export default store;
