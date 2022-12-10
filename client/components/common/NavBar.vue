<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <div
      v-if="visitInSession && $store.state.username !== null"
      class="progress-container"
      @click="$router.push({ name: 'Current Visit' })"
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
  beforeCreate() {
    console.log(
      "nav before create",
      this.$store.state.visitId,
      this.$store.state.username
    );
  },
};
</script>

<style>
nav {
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 1;
}

.success {
  background-color: rgb(167, 247, 167, 0.5);
  width: 300px;
  padding: 2px;
  border-radius: 10px;
  text-align: center;

  position: absolute;
  top: 10px;
  left: calc(50vw - 150px);
}

.error {
  background-color: rgba(246, 98, 90, 0.5);
  width: 300px;
  padding: 8px;
  border: 30px;
  text-align: center;

  position: absolute;
  top: 0px;
  left: calc(50vw - 150px);
}

.main a {
  background-color: #ffdf29;
  padding: 10px 14px;
  border-radius: 90px;
  border: 1px solid black;
}

.menu-container {
  background-color: transparent;
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
  padding: 4px;
}

.actions {
  /* background-color: white; */
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
