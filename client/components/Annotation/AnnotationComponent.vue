<template>
  <article class="annotation">
    <header>
      <h4 class="author">written by @{{ annotation.curator }}</h4>
    </header>
    <p class="content">
      {{ annotation.content }}
    </p>
  </article>
</template>

<script>
export default {
  name: "AnnotationComponent",
  props: {
    // Data from the stored freet
    annotation: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.annotation {
  margin-bottom: 8px;
  background-color: #0d99ff;
  border-radius: 10px;
  padding: 8px;
  color: rgb(255, 255, 255);
}
.author {
  margin: 0px;
  /* color: rgb(0, 0, 0) */
}

</style>
