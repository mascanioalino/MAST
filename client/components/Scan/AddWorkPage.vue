<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main class="mainPage">
    <section class="image">
      <img :src="work.imageUrl" :alt="work.title" />
    </section>
    <footer class="workInfo">
      <h1>{{ work.title }}</h1>
      <button
        v-if="
          !$store.state.visitWorks
            .map((work) => work.harvardId)
            .includes(work.harvardId)
        "
        @click="() => addWork(work.harvardId)"
      >
        Collect Work
      </button>
      <button v-else disabled>Work is Already Collected</button>
      <button class="cancel" @click="$router.push({ name: 'Current Visit' })">
        Cancel
      </button>
    </footer>
  </main>
</template>

<script>
export default {
  name: "AddWorkPage",
  beforeRouteUpdate(to, from, next) {
    this.getWork(to.params.harvardId);
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
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
      };

      try {
        const r = await fetch(
          `/api/visits/current/works/${harvardId}`,
          options
        );
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$set(this.alerts, "Successfully added work to visit!", "success");
        setTimeout(
          () => this.$delete(this.alerts, "Successfully added work to visit!"),
          3000
        );
        this.$store.commit("refreshCurrentVisit");
        this.$router.push({ name: "Current Visit" });
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style scoped>
img {
  display: block;
  box-sizing: border-box;
  width: 600px;
  max-width: 90%;
  border: 16px solid #222222;
  padding: 32px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  margin: auto;
}
footer {
  display: block;
  margin: auto;
  max-width: 600px;
}
h1 {
  text-align: center;
}
button:disabled,
button[disabled] {
  cursor: auto;
  background-color: #b5b5b5;
}
button {
  margin-top: 20px;
  outline: none;
  border: 0px solid black;
}
.cancel {
  background-color: gray;
}
</style>
