<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <div
      v-if="visitInSession && $store.state.username !== null"
      class="progress-container"
      @click="$router.push({name: 'Current Visit'})"
    >
      <div>Visit in Progress</div>
    </div>
    <div class="menu-container">
      <section class="main">
        <router-link to="/" class="action">Curator Central</router-link>
      </section>
      <section class="actions">
        <router-link to="/profile" class="action" v-if="$store.state.username"
          >Profile</router-link
        >
        <router-link to="/login" class="action" v-else>Login</router-link>
      </section>
    </div>

    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
  computed: {
    visitInSession() {
      // `this` points to the component instance
      return this.$store.state.visitId !== null;
    },
  },
};
</script>

<style>
nav {
  position: fixed;
  top: 0px;
  left: 0px;
}
.menu-container {
  background-color: white;
  height: 64px;
  width: 100vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.progress-container {
  background-color: grey;
  font-style: italic;
  color: white;
  height: 38px;
  width: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: space-around;
  cursor: pointer;
}
.main {
  background-color: white;
  padding: 0px 16px;
}

.actions {
  background-color: white;
  padding: 0px 16px;
}

a {
  color: black;
  text-decoration: none;
}

.action {
  margin: 8px;
}
</style>
