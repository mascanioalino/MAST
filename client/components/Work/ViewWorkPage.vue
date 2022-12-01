<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main class="mainPage">
    <section class="work">
      <section class="image">
        <div class="outsideWrapper">
          <div class="insideWrapper">
            <img class="img" :src="work.imageUrl" :alt="work.title" />
            <canvas class="coveringCanvas"></canvas>
          </div>
        </div>
        <footer class="workInfo">
          <h1>{{ work.title }}</h1>
          <button @click="() => addWork(work.harvardId)">Collect Work</button>
        </footer>
      </section>
      <!-- TODO ANNOTATIONS -->
    </section>
  </main>
</template>

<script>
export default {
  name: "ViewWorkPage",
  beforeRouteUpdate(to, from, next) {
    this.getWork(to.params.harvardId);
    this.getPoints()
    next();
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
    async addWork(harvardId) {
      const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
      };

      try {
        const r = await fetch(`/api/visits/${harvardId}`, options);
        console.log(r);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$set(this.alerts, "Successfully added work to visit!", "success");
        setTimeout(
          () => this.$delete(this.alerts, "Successfully added work to visit!"),
          3000
        );
        this.$store.commit("refreshVisitWorks");
        this.$router.push({ name: "Visit" });
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
.outsideWrapper {
  box-sizing: border-box;
  max-width: 600px;
  padding: 32px;
  /* border: 1px solid blue; */
  border: 16px solid #222222;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.insideWrapper {
  width: 100%;
  height: 100%;
  position: relative;
}
.coveredImage {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
}
.coveringCanvas {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: rgba(255, 0, 0, 0.3);
}
</style>
