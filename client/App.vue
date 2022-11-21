<template>
  <div id="app">
    <header>
      <NavBar />
    </header>
    <router-view />
  </div>
</template>

<script>
import NavBar from '@/components/common/NavBar.vue';

export default {
  name: 'App',
  components: {NavBar},
  beforeCreate() {
    // Sync stored username to current session
    fetch('/api/curators/session', {
      credentials: 'same-origin' // Sends express-session credentials with request
    }).then(res => res.json()).then(res => {
      const curator = res.curator;
      this.$store.commit('setUsername', curator ? curator.username : null);
      this.$store.commit('setDateJoined', curator ? curator.dateJoined : null);
    });

    // Clear alerts on page refresh
    this.$store.state.alerts = {};

    
  }
};
</script>
