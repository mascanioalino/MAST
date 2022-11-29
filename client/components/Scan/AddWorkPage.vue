<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main class="mainPage">
    <section class="userPage">
      <header class="userInfo">
        <section class="userDetails">
          <h1>@{{ work.title }}</h1>
        </section>
        <article class="userBio">
          <img 
            :src="work.imageUrl"
            :alt="work.title"
          >
        </article>
      </header>
    </section>
  </main>
</template>

<script>
export default {
  name: 'AddWorkPage',
  beforeRouteUpdate (to, from, next) {
    this.getWork(to.params.harvardId)
    next();
  },
  data() {
    return {
      work: {},
      alerts: {}
    };
  },
  mounted() {
    this.getWork(this.$route.params.harvardId);
  },
  methods: {
    async getWork(harvardId) {
      const url = `/api/works/${harvardId}`;
      const res = await fetch(url).then(async r => r.json());
      if(res.error) {
        this.$router.push({name: "Not Found"});
      }
      this.work = res.work;
    },
    /*addWork() {
      const params = {
        method: 'POST',
        message: 'Successfully followed user!',
        body: JSON.stringify({user: this.user.username}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.followRequest(params);
    },
    async followRequest(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       *
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}, credentials: 'same-origin'
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/follows`, options);
        console.log(r);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('refreshFollowing');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },*/
  }
};
</script>