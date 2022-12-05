<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <section>
    <router-link :to="`/work/view/${work.harvardId}`" class="action">
      <section class="image">
        <img :src="work.imageUrl" :alt="work.title" />
      </section>
    </router-link>
    <footer 
      class="workInfo"
      
    > 
      <h1>{{ work.title }}</h1>
      <b-icon 
        icon="trash"
        aria-hidden="true"
        v-if="showRemoveWork"
        @click="() => removeWork(work.harvardId)"
      />
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
    },
    showRemoveWork: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      alerts: {}
    };
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
        this.$store.commit("refreshUserVisits");
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
h1 {
  margin: 0px;
  font-size: 18px;
}
footer {
  width: 300px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
}
.b-icon {
  cursor: pointer;
  width: 32px;
}
</style>
