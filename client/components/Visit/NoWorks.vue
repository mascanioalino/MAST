<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <section class="no-works">
    <h1>No Works Collected Yet</h1>
    <div
      v-if="
        this.$store.state.visitId !== null && $store.state.username !== null
      "
    >
      <div class="instructions">
        Scan works to add them to the Current Visit. <br />
        Below are some examples!
      </div>

      <div class="container">
        <iframe
          src="https://docs.google.com/presentation/d/e/2PACX-1vShxpqKfVcX_fUilqo3eRr2UFMdQLGZ--p6WL7n4Le-KJfrtxD_3Z9VnGT5DBBjaMMEBdrG312pZQ5e/embed?start=false&loop=false&delayms=3000"
          frameborder="0"
          class="responsive-iframe"
          allowfullscreen="true"
          mozallowfullscreen="true"
          webkitallowfullscreen="true"
        ></iframe>
      </div>
      <div class="instructions-link">
        <a
          href="https://docs.google.com/presentation/d/1Xd0ILeJ8QK0hAZZTS6C4ytmnPn0dzaOKs5NVY---eZo/edit?usp=sharing"
          >View art examples</a
        >
      </div>
    </div>
    <div v-else>
      <div class="instructions">
        Start a New Visit to start Collecting Works!
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "NoWorks",
};
</script>

<style scoped>
.no-works {
  margin: 60px auto;
  text-align: center;
}

.instructions {
  font-style: italic;
  color: #4a4a4a;
  margin-bottom: 30px;
}

.instructions-link {
  color: gray;
  font-style: italic;
  text-decoration: underline;
  font-size: 0.8em;
  padding-top: 24px;
}

.instructions-link a {
  color: inherit;
}

.container {
  position: relative;
  width: 600px;
  height: 400px;
  margin: auto;
  max-width: 90%;
}

.responsive-iframe {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
}
</style>
