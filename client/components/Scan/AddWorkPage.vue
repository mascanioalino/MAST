<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main class="mainPage">
    <section class="image">
      <img 
        :src="work.imageUrl"
        :alt="work.title"
      >
    </section>
    <footer class="workInfo">
      <h1>{{ work.title }}</h1>
      <button @click="() => addWork(work.harvardId)">
        Collect Work
      </button>
    </footer>
  </main>
</template>

<script>
export default {
  name: 'AddWorkPage',
  beforeRouteUpdate (to, from, next) {
    this.getWork(to.params.harvardId)
    next();
  },
  data() {
    return {
      work: {},
      alerts: {}
    };
  },
  mounted() {
    this.getWork(this.$route.params.harvardId);
  },
  methods: {
    async getWork(harvardId) {
      const url = `/api/works/${harvardId}`;
      const res = await fetch(url).then(async r => r.json());
      if(res.error) {
        this.$router.push({name: "Not Found"});
      }
      this.work = res.work;
    },
    async addWork(harvardId) {
      const options = {
        method: 'PUT', headers: {'Content-Type': 'application/json'}, credentials: 'same-origin'
      };

      try {
        const r = await fetch(`/api/visits/${harvardId}`, options);
        console.log(r);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$set(this.alerts, 'Successfully added work to visit!', 'success');
        setTimeout(() => this.$delete(this.alerts, 'Successfully added work to visit!'), 3000);
        this.$store.commit('refreshVisitWorks');
        this.$router.push({ name: 'Visit' });
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  }
};
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
img {
  box-sizing: border-box;
  max-width: 600px;
  border: 16px solid #222222;
  padding: 32px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
footer {
  max-width: 600px;
}
h1{
  text-align: center;
}
</style>