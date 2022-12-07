<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <section class="gallery-list">
    <header v-if="(visitDate && visitCurator)">
      <h1 v-if="visitDate !== 'Current Visit'">Visit on <span>{{ visitDate }}</span> by <span>{{visitCurator}}</span></h1>
      <h1 v-else>{{ this.visitDate }}</h1>
    </header>
    <masonry
      v-if="(works.length > 0)"
      :cols="{default: 4, 1320: 3, 980: 2, 640: 1}"
      :gutter="{default: '40px'}"
    >
      <GalleryWork 
        v-for="work in works" 
        :key="work.harvardId"
        :work="work" 
        :showRemoveWork="showRemoveWork"
      />
    </masonry>
    <section v-else>
      <h1>No Works</h1>
      </section>
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
      required: true
    },
    showRemoveWork: {
      type: Boolean,
      required: true
    },
    visitDate: {
      type: String,
    },
    visitCurator: {
      type: String,
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

h1 {
  margin: auto;
  text-align: center;
}

header {
  margin: auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgb(100, 100, 100);
  margin-bottom: 32px;
}

span {
  color: black;
}
  
</style>
