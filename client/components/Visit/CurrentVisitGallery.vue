<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section class="gallery-list">
      <masonry
        :cols="4"
        :gutter="40"
        class
      >
        <GalleryWork 
          v-for="work in $store.state.visitWorks" 
          :key="work.harvardId"
          :work="work" 
        />
      </masonry>

    </section>
  </main>
</template>

<script>
import GalleryWork from "@/components/Work/GalleryWork.vue";

export default {
  name: "CurrentVisitGallery",
  components: {
    GalleryWork
  }
};
</script>

<style scoped>
  .gallery-list {
    margin-top: 100px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>
