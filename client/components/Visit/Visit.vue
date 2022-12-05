<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <section class="visit"
    :class="{ active: visit._id === this.$store.state.visitId }"
  >
    <span 
      @click="visit._id === $store.state.visitId ? $router.push({name: 'Current Visit'}) : $router.push({name: 'Visit', params: { visitId: visit._id }})"
    >
      {{this.visit.works.length}} work{{(this.visit.works.length !== 1 ? 's':'')}} collected on {{ this.visit.dateOfVisit }}
    </span>
    <b-icon 
      icon="trash"
      aria-hidden="true"
      v-if="(visit._id !== $store.state.visitId)"
      @click="() => deleteVisit(visit._id)"
    />
</section>
</template>

<script>
export default {
  name: "Visit",
  props: {
    visit: {
      type: Object,
    },
  },
  data() {
    return {
      alerts: {},
    };
  },
  methods: {
    async deleteVisit(visitId) {
      const options = {
        method: 'DELETE', headers: {'Content-Type': 'application/json'}, credentials: 'same-origin'
      };

      try {
        const r = await fetch(`/api/visits/${visitId}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$set(this.alerts, 'Successfully deleted visit!', 'success');
        setTimeout(() => this.$delete(this.alerts, 'Successfully deleted visit!'), 3000);
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
.visit {
  display: flex;
  width: calc(100% - 16px);
  height: 64px;
  outline: none;
  box-sizing: border-box;
  padding: 8px 16px;
  margin: 8px;
  border: 1px solid black;
  background-color: white;
  border-radius: 0px;
  color: black;
  align-items: center;
  justify-content: space-between;
}

span {
  cursor: pointer;
}

.active {
  background-color: #7cb179;
}

.b-icon {
  cursor: pointer;
}
</style>
