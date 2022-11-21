<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <section class="main">
      <h1 class="title">
        Curator Central
      </h1>
    </section>
    <section class="actions">
      <button 
        @click.native="$router.push('/')"
      >
        Home
      </button>
      <button 
        v-if="$store.state.username"
        @click.native="$router.push('/account')"
      >
        Account
      </button>
      <button 
        v-else
        @click.native="$router.push('/login')"
      >
        Login
      </button>
    </section>
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
  name: 'NavBar'
};
</script>
