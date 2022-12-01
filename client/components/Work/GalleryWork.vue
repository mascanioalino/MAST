<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <section>
    <section class="image">
      <img 
        :src="work.imageUrl"
        :alt="work.title"
      >
    </section>
    <footer class="workInfo">
      <h1>{{ work.title }}</h1>
      <button
      @click="() => removeWork(work.harvardId)"
      >
        Remove Work
      </button>
    </footer>
  </section>
</template>

<script>


export default {
  name: "GalleryWork",
  props: {
    work: {
      type: Object,
      required: true
    }
  },
  methods: {
    async removeWork(harvardId) {
      const options = {
        method: 'DELETE', headers: {'Content-Type': 'application/json'}, credentials: 'same-origin'
      };

      try {
        const r = await fetch(`/api/visits/${this.$store.state.visitId}/works/${this.work.harvardId}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$set(this.alerts, 'Successfully removed work from visit!', 'success');
        setTimeout(() => this.$delete(this.alerts, 'Successfully removed work from visit!'), 3000);
        this.$store.commit('refreshVisitWorks');
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  }
};
</script>
<style scoped>
img {
  box-sizing: border-box;
  width: 300px;
  border: 8px solid #222222;
  padding: 16px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
footer {
  width: 300px;
}
</style>
