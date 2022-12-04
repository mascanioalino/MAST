<template>
  <article
    class="annotation"
  >
    <header>
      <h4>
          written by @{{ annotation.curator }}
      </h4> 
    </header>
    <p
      class="content"
    >
      {{annotation.content}}
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
      required: true
    }
  },
}
</script>