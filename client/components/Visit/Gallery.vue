<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <section class="gallery-list">
    <div v-if="this.$store.state.curatorId !== null">
      <header v-if="visitCurator && visitDate">
        <h1 v-if="visitDate !== 'Current Visit'">
          Visit on <span>{{ visitDate }}</span>
        </h1>
        <h1 v-else>{{ this.visitDate }}</h1>
        <div>
          by @<span>{{ visitCurator }}</span>
        </div>
      </header>
      <div v-if="works.length > 0">
        <header v-if="!visitDate" class="all-works-info">
          Below are all of your collected works
        </header>
        <masonry
          :cols="{ default: 4, 1320: 3, 980: 2, 640: 1 }"
          :gutter="{ default: '40px' }"
        >
          <GalleryWork
            v-for="work in works"
            :key="work.harvardId"
            :work="work"
            :showRemoveWork="showRemoveWork"
          />
        </masonry>
      </div>
      <section class="no-works" v-else>
        <h1>No Works Collected Yet</h1>
        <div>
          Start a new Visit and Scan Works to see them on your Home Page!
        </div>
      </section>
    </div>
    <div class="no-works" v-else>
      <div>Sign in or create an account to start exploring works.</div>
    </div>
  </section>
</template>

<script>
import GalleryWork from "@/components/Work/GalleryWork.vue";

export default {
  name: "Gallery",
  components: {
    GalleryWork,
  },

  props: {
    works: {
      type: Array,
      required: true,
    },
    showRemoveWork: {
      type: Boolean,
      required: true,
    },
    visitDate: {
      type: String,
    },
    visitCurator: {
      type: String,
    },
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
  color: black;
}

header {
  margin: auto;
  width: 100%;
  display: block;
  align-items: center;
  justify-content: space-between;
  color: rgb(100, 100, 100);
  margin-bottom: 32px;
}

header div {
  width: fit-content;
  margin: auto;
  margin-top: 10px;
  margin-bottom: 30px;
  font-size: 1.1em;
}

span {
  color: black;
}

.no-works {
  margin: 60px auto;
}
.no-works div {
  padding: 10px;
  width: 440px;
  text-align: center;
  margin: auto;
}

.all-works-info {
  width: fit-content;
  margin: auto;
  margin-bottom: 30px;
  font-style: italic;
}
</style>
