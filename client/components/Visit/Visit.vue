<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>Visit at: {{ this.visit.dateOfVisit }}</main>
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
main {
  display: block;
  margin: 10px 0px;
  border: 1px solid black;
  padding: 20px;
}
</style>
