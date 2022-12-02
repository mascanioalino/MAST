<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main class="mainPage">
    <section class="work">
      <section class="image">
        <p class="add" v-on:click="this.toggleAnnotating">
          {{ this.annotating ? "[back]" : "[+]" }}
        </p>
        <WorkCanvas
          :annotating="this.annotating"
          v-on:pointSelected="(f) => (this.pointSelected = f)"
        />
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
      annotating: false,
      annotationEntered: null,
      pointSelected: null,
    };
  },
  mounted() {
    this.getWork(this.$route.params.harvardId);
  },
  methods: {
    toggleAnnotating() {
      this.annotating = !this.annotating;
      if (!this.annotating) {
        this.pointSelected = null;
        this.annotationEntered = null;
      }
    },
    async getWork(harvardId) {
      const url = `/api/works/${harvardId}`;
      const res = await fetch(url).then(async (r) => r.json());
      if (res.error) {
        this.$router.push({ name: "Not Found" });
      }
      this.work = res.work;
    },
    async addPoint(xPercent, yPercent) {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          xLocation: xPercent,
          yLocation: yPercent,
          workId: this.work._id,
        }),
      };

      try {
        const url = `/api/points`;
        const r = await fetch(url, options);

        if (!r.ok) {
          const res = await r.json;
          throw new Error(res.error);
        }
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
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
.add {
  align-self: flex-end;
  cursor: pointer;
}
</style>
