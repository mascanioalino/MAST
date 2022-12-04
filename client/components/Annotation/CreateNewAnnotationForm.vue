<template>
  <form @submit.prevent="submit">
    <article
      v-if="fields.length"
    >
      <div
        v-for="field in fields"
        :key="field.id"
      >
        <input
          :type="'text'"
          :placeholder="'enter annotation text'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        >
      </div>
    </article>
    <article v-else>
      <p>{{ content }}</p>
    </article>
    <button v-if="pointSelected == null" 
      type="button"
      disabled
    >
      select point for annotation
    </button>

    <button v-else-if="pointSelected !== null && fields[0].value !== ''" 
      type="submit"
    >
      Submit
    </button>

    <button v-else
      type="button"
      disabled
    >
      add annotation text
    </button>
  </form>
</template>

<script>

export default {
  name: 'CreateNewAnnotationForm',
  props: {
    pointSelected: {
      type: Object,
      required: true
    },
    annotationEntered: {
      type: String,
      default: null
    }  
  },
  methods: {
    async submit() {
      const params = {
        method: 'POST',
        message: 'Successfully added annotation.',
        body: JSON.stringify({content: this.value, isPublic: true, pointId: null}), // LOOK HERE NEED POINT ID
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * sends request to profile endpoint 
       */
        const options = {
          method: params.method, headers: {'Content-Type': 'application/json'}
        };
        if (params.body) {
          options.body = params.body;
        }
        try {
          const r = await fetch(`/api/annotations`, options);
          if (!r.ok) {
            const res = await r.json();
            throw new Error(res.error);
          }
  
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000)
        }
    }
  },
  data() {
    return {
      fields: [
        {id: 'content', label: 'Content', value: ''}
      ],
    }
}
}
</script>

<style>

button {
  background: green
}

button:disabled {
  background: grey
}
</style>