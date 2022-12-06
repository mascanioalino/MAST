<template>
  <div id="app">
    <header>
      <NavBar />
      <NewVisitButton v-if="$store.state.username !== null" />
    </header>
    <router-view
      :class="{
        visitInProgress: visitInSession && $store.state.username !== null,
        view: !visitInSession || $store.state.username === null,
      }"
    />
  </div>
</template>

<script>
import NavBar from "@/components/common/NavBar.vue";
import NewVisitButton from "@/components/common/NewVisitButton.vue";

export default {
  name: "App",
  components: { NavBar, NewVisitButton },
  computed: {
    visitInSession() {
      return this.$store.state.visitId !== null;
    },
  },
  beforeCreate() {
    // Sync stored username to current session
    fetch("/api/curators/session", {
      credentials: "same-origin", // Sends express-session credentials with request
    })
      .then((res) => res.json())
      .then((res) => {
        const curator = res.curator;
        this.$store.commit("setUsername", curator ? curator.username : null);
        this.$store.commit("setCuratorId", curator ? curator._id : null);
        this.$store.commit(
          "setDateJoined",
          curator ? curator.dateJoined : null
        );
      });
    // Clear alerts on page refresh
    this.$store.state.alerts = {};
    this.$store.commit("refreshCurrentVisit");
    this.$store.commit("refreshUserVisits");
  },
};
</script>
<style>
html {
  font-family: Helvetica, sans-serif;
  font-size: 1.1em;
}
body {
  margin: 0px;
}
.view {
  margin-top: 96px;
  align-items: center;
  margin-bottom: 64px;
}
.visitInProgress {
  margin-top: 134px;
  align-items: center;
  margin-bottom: 64px;
}
.status {
  background-color: green;
}
</style>
