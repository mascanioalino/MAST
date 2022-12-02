<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <Gallery :works="$store.state.visitWorks" />
  </main>
</template>

<script>
import Gallery from "@/components/Visit/Gallery.vue";

export default {
  name: "CurrentVisitGallery",
  components: {
    Gallery
  }
};
</script>