<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <Gallery :works="this.works" :showRemoveWork="false" />
  </main>
</template>

<script>
import Gallery from "@/components/Visit/Gallery.vue";

export default {
  name: 'VisitPage',
  components: {Gallery},
  beforeRouteUpdate (to, from, next) {
    this.getVisit(to.params.visitId)
    next();
  },
  data() {
    return {
      works: [],
    };
  },
  mounted() {
    this.getVisit(this.$route.params.visitId);

  },
  methods: {
    async getVisit(visitId) {
      const url = `/api/visits/${visitId}`;
      const res = await fetch(url).then(async r => r.json());
      if(res.error) {
        this.$router.push({name: "Not Found"});
      }
      this.works = res.works;
    }
  }
};
</script>
