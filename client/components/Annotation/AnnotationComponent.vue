<template>
  <article class="annotation">
    <header>
      <h4 class="author">written by @{{ annotation.curator }}</h4>
    </header>
    <p class="content">
      {{ annotation.content }}
    </p>
    <footer>
      <button
        v-if="annotation.curator === this.$store.state.username"
        @click="deleteAnnotation"
      >
        <b-icon icon="trash" aria-hidden="true" />
      </button>
    </footer>
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
  methods: {
    deleteAnnotation() {
      const params = {
        method: "DELETE",
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully deleted freet!",
            status: "success",
          });
        },
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method,
        headers: { "Content-Type": "application/json" },
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(
          `/api/annotations/${this.annotation._id}`,
          options
        );
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
      this.$root.$refs.ViewWorkPage.loadAnnotations();
      this.$emit("deletion");
    },
  },
};
</script>

<style scoped>
.annotation {
  margin-bottom: 8px;
  background-color: white;
  border-radius: 10px;
  padding: 8px;
  color: black;
}
.author {
  margin: 0px;
}

button {
  background-color: transparent;
  width: 2%;
  height: 2%;
  border: 0;
  color: black;
}

.b-icon {
  float: right;
  width: 20px;
  height: 20px;
}
/* button:hover {
  background-color: #78c6fd;

} */
</style>
