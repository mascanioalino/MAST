<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <button 
    @click="visit._id === $store.state.visitId ? $router.push({name: 'Current Visit'}) : $router.push({name: 'Visit', params: { visitId: visit._id }})"
    :class="{ active: visit._id === this.$store.state.visitId }"
  >
    {{this.visit.works.length}} works collected on {{ this.visit.dateOfVisit }}
    <b-icon 
      icon="trash"
      aria-hidden="true"
    />
  </button>
</template>

<script>
export default {
  name: "Visit",
  props: {
    visit: {
      type: Object,
    },
  },
};
</script>
<style scoped>
button {
  display: block;
  border: 1px solid black;
  padding: 20px;
  background-color: white;
  border-radius: 0px;
  color: black;
}

.active {
  background-color: #7cb179;
}

.b-icon {
  float: right;
}
</style>
