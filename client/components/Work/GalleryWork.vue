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
