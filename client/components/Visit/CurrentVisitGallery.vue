<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <h1>Works Collected In Your Current Visit</h1>
    <Gallery
      :works="$store.state.visitWorks"
      :showRemoveWork="true"
      visitDate="Current Visit"
    />
  </main>
</template>

<script>
import Gallery from "@/components/Visit/Gallery.vue";

export default {
  name: "CurrentVisitGallery",
  components: {
    Gallery,
  },
};
</script>

<style scoped>
h1 {
  width: fit-content;
  padding: 10px;
  text-align: center;
  margin: 24px auto;
}
</style>
