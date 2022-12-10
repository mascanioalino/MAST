<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <header>
      <h1 v-if="$store.state.username">
        Welcome to Curator Central, @{{ $store.state.username }}!
      </h1>
      <h1 v-else>Welcome to Curator Central</h1>
    </header>
    <Gallery :works="allWorks" :showRemoveWork="false" />
  </main>
</template>

<script>
import Gallery from "@/components/Visit/Gallery.vue";

export default {
  name: "HomePage",
  components: {
    Gallery,
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
  width: 600px;
  margin: auto;
  text-align: center;
}
div {
  width: 400px;
  margin: 80px auto;
  text-align: center;
}
</style>
