<template>
  <form @submit.prevent="submit">
    <article v-if="fields.length">
      <div v-for="field in fields" :key="field.id">
        <input
          :type="'text'"
          :placeholder="'enter annotation text'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        />
      </div>
    </article>
    <article v-else>
      <p>{{ content }}</p>
    </article>
    <button v-if="pointSelected == null" type="button" disabled>
      select point for annotation
    </button>

    <button
      v-else-if="pointSelected !== null && fields[0].value !== ''"
      type="submit"
    >
      Submit
    </button>

    <button v-else type="button" disabled>add annotation text</button>
  </form>
</template>

<script>
export default {
  name: "CreateNewAnnotationForm",
  props: {
    pointSelected: {
      type: Object | Map,
      required: true,
    },
    annotationEntered: {
      type: String,
      default: null,
    },
    work: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      fields: [{ id: "content", label: "Content", value: "" }],
    };
  },
  methods: {
    reload: function() {
            this.$root.$refs.ViewWorkPage.loadAnnotations();
    },
    async addAnnotation() {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          pointId: this.pointSelected._id,
          content: this.fields[0].value,
          isPublic: true, // TODO: Need to change isPublic
        }),
      };
      try {
        const url = `/api/annotations`;
        const r = await fetch(url, options);

        if (!r.ok) {
          const res = await r.json;
          throw new Error(res.error);
        }
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
      this.fields[0].value = ''
      this.$root.$refs.ViewWorkPage.loadAnnotations();

    },
    async createPoint() {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          xLocation: this.pointSelected.xLocation,
          yLocation: this.pointSelected.yLocation,
          workId: this.work._id,
          content: this.fields[0].value, // work on this.annotationEntered
          isPublic: true, // TODO: Need to change isPublic
        }),
      };

      try {
        const url = `/api/points`;
        const r = await fetch(url, options);
        if (!r.ok) {
          const res = await r.json;
          throw new Error(res.error);
        }
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
      this.fields[0].value = ''
      this.$root.$refs.ViewWorkPage.loadAnnotations();
    },
    async submit() {
      if (this.pointSelected && this.fields[0].value !== "") {
        // this is kind of hack instead of doing this.annotationEntered
        if (this.pointSelected._id) {
          this.addAnnotation();
        } else {
          this.createPoint();
        }
      }
    },
  },
};
</script>

<style scoped>
input {
  border-color: transparent;
}
button {
  background: green;
  margin-top: 0;
}

button:disabled {
  background: grey;
}
</style>
