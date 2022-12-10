<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit">
    <article v-if="fields.length">
      <div v-for="field in fields" :key="field.id">
        <textarea
          v-if="field.id === 'content' || field.id === 'bio'"
          :placeholder="field.label"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        />
        <input
          v-else
          :type="field.id === 'password' ? 'password' : 'text'"
          :placeholder="field.label"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        />
      </div>
    </article>
    <article v-else>
      <p>{{ content }}</p>
    </article>
    <button type="submit">
      {{ title }}
    </button>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </form>
</template>

<script>
export default {
  name: "BlockForm",
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      url: "", // Url to submit form to
      method: "GET", // Form request method
      hasBody: false, // Whether or not form request has a body
      setCuratorDetails: false, // Whether or not stored username should be updated after form submission
      setCurrentVisitDetails: false,
      alerts: {}, // Displays success/error messages encountered during form submission
      callback: null, // Function to run after successful form submission
    };
  },
  methods: {
    async submit() {
      /**
       * Submits a form with the specified options from data().
       */
      const options = {
        method: this.method,
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // Sends express-session credentials with request
      };
      if (this.hasBody) {
        options.body = JSON.stringify(
          Object.fromEntries(
            this.fields.map((field) => {
              const { id, value } = field;
              field.value = "";
              return [id, value];
            })
          )
        );
      }

      try {
        const r = await fetch(this.url, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        const text = await r.text();
        const res = text ? JSON.parse(text) : { user: null };

        console.log(res);

        if (this.setCuratorDetails) {
          this.$store.commit(
            "setUsername",
            res.curator ? res.curator.username : null
          );
          this.$store.commit(
            "setDateJoined",
            res.curator ? res.curator.dateJoined : null
          );
          this.$store.commit(
            "setCuratorId",
            res.curator ? res.curator._id : null
          );
          this.$store.commit("refreshUserVisits");
        }

        if (this.setCurrentVisitDetails) {
          this.$store.commit("refreshCurrentVisit");
        }

        if (this.callback) {
          this.callback();
        }
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style>
input {
  width: calc(100% - 16px);
  height: 64px;
  border: 4px solid #bbbbbb;
  outline: none;
  background-color: white;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 8px 16px;
  margin: 10px 0px;
}

input::placeholder {
  text-align: center;
}

button {
  width: calc(100% - 16px);
  height: 64px;
  outline: none;
  background-color: black;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 8px 16px;
  margin: 0px;
  color: white;
  cursor: pointer;
}

p {
  margin: 10px 0px;
}
</style>
