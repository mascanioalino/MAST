<template>
  <article class="annotation">
    <header>
      <h4 class="author">written by @{{ annotation.curator }}</h4>
    </header>
    <p class="content">
      {{ annotation.content }}
    </p>
    <footer>
    <button @click="deleteAnnotation">
      <b-icon 
        icon="trash"
        aria-hidden="true"
      />
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
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
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
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/annotations/${this.annotation._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        // this.editing = false;
        // this.$store.commit('refreshFreets');

        // params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
      this.$root.$refs.ViewWorkPage.loadAnnotations();
    },
  }
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

button {
  background-color: #0d99ff;
  width: 2%;
  height:2%;
  border: 0
  /* float: right; */
}

.b-icon {
  float: right;
  width: 20px;
  height: 20px
}
/* button:hover {
  background-color: #78c6fd;

} */

</style>
