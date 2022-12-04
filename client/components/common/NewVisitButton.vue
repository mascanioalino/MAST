<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <div @click="submit" v-if="visitNotInSession" class="new-visit">
    <div>New Visit</div>
  </div>
  <div v-else>
    <div @click="endVisit" class="end-visit">End Visit</div>
    <div v-if="notOnScanPage" @click="$router.push({name: 'Scan'})" class="new-visit">Scan Code</div>
    <div v-else @click="$router.go(-1)" class="new-visit">Back</div>
  </div>
</template>

<script>
export default {
  name: "NewVisitButton",
  computed: {
    visitNotInSession() {
      // `this` points to the component instance
      return this.$store.state.visitId === null;
    },
    notOnScanPage() {
      return this.$route.name !== "Scan";
    }
  },
  methods: {
    async submit() {
      /**
       * Submits a new visit POST
       */

      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // Sends express-session credentials with request
      };

      try {
        const r = await fetch("/api/visits", options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        const text = await r.text();
        const res = text ? JSON.parse(text) : { curator: null };

        this.$store.commit("setVisitId", res.visit ? res.visit._id : null);
        this.$router.push({name: "Current Visit"});
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async endVisit() {
      /**
       * Submits an end visit PUT
       */

      const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // Sends express-session credentials with request
      };

      try {
        const r = await fetch("/api/visits/current", options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        const text = await r.text();
        const res = text ? JSON.parse(text) : { curator: null };
        this.$store.commit("setVisitId", null);
        this.$store.commit('refreshVisitWorks');
        this.$router.push({name: 'Home'});

        this.$set(this.alerts, "Ended Visit", "success");
        setTimeout(() => this.$delete(this.alerts, "Ended Visit"), 3000);
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style>
.new-visit {
  position: fixed;
  bottom: 16px;
  right: 16px;
  background-color: black;
  color: white;
  height: 100px;
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 80px;
  padding: 10px;
}
.new-visit:hover {
  cursor: pointer;
}

.end-visit {
  position: fixed;
  bottom: 16px;
  left: 16px;
  background-color: grey;
  color: white;
  height: 100px;
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 80px;
  padding: 10px;
}
.end-visit:hover {
  cursor: pointer;
}
</style>
