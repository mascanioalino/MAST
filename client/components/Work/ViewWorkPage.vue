<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main class="mainPage">
    <section class="work">
      <section class="image">
        <WorkCanvas />
        <footer class="workInfo">
          <h1>{{ work.title }}</h1>
        </footer>
      </section>
      <!-- TODO ANNOTATIONS -->
    </section>
  </main>
</template>

<script>
import WorkCanvas from "@/components/Work/WorkCanvas.vue";

export default {
  name: "ViewWorkPage",
  beforeRouteUpdate(to, from, next) {
    this.getWork(to.params.harvardId);
    next();
  },
  components: {
    WorkCanvas,
  },
  data() {
    return {
      work: {},
      alerts: {},
    };
  },
  mounted() {
    this.getWork(this.$route.params.harvardId);
  },
  methods: {
    async getWork(harvardId) {
      const url = `/api/works/${harvardId}`;
      const res = await fetch(url).then(async (r) => r.json());
      if (res.error) {
        this.$router.push({ name: "Not Found" });
      }
      this.work = res.work;
    },
  },
};
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
img {
  width: 100%;
  height: 100%;
  position: relative;
  top: 0px;
  left: 0px;
}
footer {
  max-width: 600px;
}
h1 {
  text-align: center;
}
body {
  text-align: center;
  background: #f2f6f8;
}

.work {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.image {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
