<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <h1>Welcome to Curator Central</h1>

    <div class="description">
      Museums are in need of our help. Many people feel that museums are
      antiquated and aren’t geared towards younger generations. Museums are
      looking to change this by enhancing visitors’ experiences, and many have
      moved to a
      <a href="https://www.participatorymuseum.org/">“participatory model,”</a>
      centered around the visitor experience. Often serving as a cultural
      center, museums empower visitors to connect to their broader communities.
      Museums need tools to facilitate conversations around exhibits and promote
      distribution of visitor input.
      <br />
      <br />
      Curator Central is the community platform to connect more deeply with
      museum works. Curator Central uses the
      <a href="https://harvardartmuseums.org/collections/api"
        >Harvard Art API</a
      >
      to enhance artworks in Harvard Art Museum’s galleries.
    </div>

    <div class="video-container">
      <vueVimeoPlayer :video-id="780726140" />
    </div>

    <div class="footer">
      Curator Central was developed by
      <a href="https://61040-fa22.github.io/portfolio-trudypainter/"
        >Trudy Painter</a
      >,
      <a href="https://61040-fa22.github.io/portfolio-Apstoddard/"
        >Andrew Stoddard</a
      >,
      <a href="https://61040-fa22.github.io/portfolio-mascanioalino/">
        Maria Ascanio </a
      >, and
      <a href="https://61040-fa22.github.io/portfolio-spkhowe/"
        >Stephanie Howe</a
      >
      for
      <a href="https://61040-fa22.github.io/"
        >MIT's Software Studio Class, 6.1040</a
      >.
      <br />
      <br />
      Please email 61040mast@mit.edu with any comments or questions.
    </div>
  </main>
</template>

<script>
import { vueVimeoPlayer } from "vue-vimeo-player";
export default {
  name: "Welcome",
  components: {
    vueVimeoPlayer,
  },
};
</script>

<style scoped>
h1 {
  width: fit-content;
  margin: auto;
}
.video-container {
  width: 100vw;
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
.description {
  width: 90%;
  max-width: 600px;
  margin: auto;
  margin-top: 80px;
  line-height: 1.2rem;
  color: #4a4a4a;
}

a {
  color: inherit;
  text-decoration: underline;
}
hr {
  margin: 24px 0px;
}

a:hover {
  cursor: pointer;
}

.footer {
  font-style: italic;
  width: 500px;
  margin: auto;
  margin-top: 30px;
  text-align: center;
  font-size: 0.8rem;
  color: gray;
}
</style>
