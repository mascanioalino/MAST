<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <button @click="$router.push({name: 'Visit', params: { visitId: this.visit._id }})">Visit at: {{ this.visit.dateOfVisit }}</button>
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
  margin: 10px 0px;
  border: 1px solid black;
  padding: 20px;
  background-color: white;
  border-radius: 0px;
  color: black;
}
</style>
