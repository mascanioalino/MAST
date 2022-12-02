<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <section class="gallery-list">
    <masonry
      :cols="{default: 4, 1320: 3, 980: 2, 640: 1}"
      :gutter="{default: '40px'}"
    >
      <GalleryWork 
        v-for="work in this.works" 
        :key="work.harvardId"
        :work="work" 
        :showRemoveWork="showRemoveWork"
      />
    </masonry>
  </section>
</template>

<script>
import GalleryWork from "@/components/Work/GalleryWork.vue";

export default {
  name: "Gallery",
  components: {
    GalleryWork
  }, 
  props: {
    works: {
      type: Array,
    },
    showRemoveWork: {
      type: Boolean,
      required: true
    }
  },
};
</script>

<style scoped>
.gallery-list {
    width: 1320px;
    margin-left: calc(50% - 660px);
  }
@media screen and (max-width: 1320px) {
  .gallery-list {
    width: 980px;
    margin-left: calc(50% - 490px);
  }
}

@media screen and (max-width: 980px) {
  .gallery-list {
    width: 640px;
    margin-left: calc(50% - 320px);
  }
}

@media screen and (max-width: 640px) {
  .gallery-list {
    width: 300px;
    margin-left: calc(50% - 150px);
  }
}



  
</style>
