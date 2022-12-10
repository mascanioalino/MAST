<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <section
    class="visit"
    :class="{ active: visit._id === this.$store.state.visitId }"
    @click="
      visit._id === $store.state.visitId
        ? $router.push({ name: 'Current Visit' })
        : $router.push({ name: 'Visit', params: { visitId: visit._id } })
    "
  >
    <div>
      <div class="title">Visit on {{ this.visit.dateOfVisit }}</div>
      <div>
        {{ this.visit.works.length }} work{{
          this.visit.works.length !== 1 ? "s" : ""
        }}
        collected
      </div>
    </div>
    <b-icon
      icon="trash"
      aria-hidden="true"
      v-if="visit._id !== $store.state.visitId"
      @click="() => deleteVisit(visit._id)"
    />
  </section>
</template>

<script>
export default {
  name: "Visit",
  props: {
    visit: {
      type: Object,
    },
  },
  data() {
    return {
      alerts: {},
      formattedDate: "",
    };
  },

  methods: {
    async deleteVisit(visitId) {
      const options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
      };

      try {
        const r = await fetch(`/api/visits/${visitId}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$set(this.alerts, "Successfully deleted visit!", "success");
        setTimeout(
          () => this.$delete(this.alerts, "Successfully deleted visit!"),
          3000
        );
        this.$store.commit("refreshUserVisits");
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>
<style scoped>
.visit {
  display: flex;
  width: calc(100% - 16px);
  outline: none;
  box-sizing: border-box;
  margin: 8px;
  border: 1px solid black;
  background-color: white;
  border-radius: 0px;
  color: black;
  align-items: center;
  justify-content: space-between;

  padding: 20px;
}

.visit:hover {
  cursor: pointer;
  background-color: #f3f3f3;
}

span {
  cursor: pointer;
}

.title {
  margin: 10px 0px;
  font-weight: 600;
  font-size: 1.2em;
}

.b-icon {
  cursor: pointer;
}
</style>
