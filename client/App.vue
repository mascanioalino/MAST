<template>
  <div id="app">
    <header>
      <VisitProgress />
      <NavBar />
      <NewVisitButton v-if="this.$store.state.username !== null" />
    </header>
    <router-view />
  </div>
</template>

<script>
import NavBar from "@/components/common/NavBar.vue";
import NewVisitButton from "@/components/common/NewVisitButton.vue";

export default {
  name: "App",
  components: { NavBar, NewVisitButton },
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

    // Sync visit in progress
    fetch("/api/visits/session", {
      credentials: "same-origin", // Sends express-session credentials with request
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("res from session", res);
        if (res !== null) {
          const visit = res._id;
          this.$store.commit("setVisitId", visit);
        }
      });

    // Clear alerts on page refresh
    this.$store.state.alerts = {};
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
</style>
