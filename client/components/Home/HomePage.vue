<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <header v-if="$store.state.username">
      <h1>Welcome to Curator Central, @{{ $store.state.username }}!</h1>
    </header>
    <Welcome v-else />
    <Gallery
      v-if="$store.state.username"
      :works="allWorks"
      :showRemoveWork="false"
    />
  </main>
</template>

<script>
import Gallery from "@/components/Visit/Gallery.vue";
import Welcome from "@/components/Home/Welcome.vue";

export default {
  name: "HomePage",
  components: {
    Gallery,
    Welcome,
  },
  computed: {
    allWorks() {
      const works = this.$store.state.userVisits.flatMap(
        (visit) => visit.works
      );
      // remove duplicates: https://stackoverflow.com/a/56757215
      return works.filter(
        (v, i, a) => a.findIndex((v2) => v2._id === v._id) === i
      );
    },
  },
};
</script>
<style scoped>
header {
  max-width: 600px;
  margin: auto;
  text-align: center;
}
div {
  width: 400px;
  margin: 80px auto;
  text-align: center;
}
</style>
