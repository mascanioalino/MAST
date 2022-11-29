<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <header>
      <h1 v-if="$store.state.username">
        Welcome to Curator Central, @{{ $store.state.username }}!
      </h1>
      <h1 v-else>Welcome to Curator Central.</h1>
    </header>
    <div>
      We can add some GIF or mini video showing how to scan / collect / annotate
      works.
    </div>
  </main>
</template>

<script>
export default {
  name: "HomePage",
};
</script>
<style scoped>
header {
  width: 600px;
  margin: auto;
  text-align: center;
}
main {
  display: block;
}
div {
  width: 400px;
  margin: 80px auto;
  text-align: center;
}
</style>
