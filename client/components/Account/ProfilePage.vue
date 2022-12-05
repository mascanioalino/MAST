<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <header>
      <h1>Profile for @{{ $store.state.username }}</h1>
      <div>
        <router-link to="/account" class="action" v-if="$store.state.username"
          >Settings</router-link
        >
      </div>
    </header>
    <div class="visit-list">
      <Visit v-for="visit in $store.state.userVisits" :key="visit._id" :visit="visit" />
    </div>
  </main>
</template>

<script>
import ChangeUsernameForm from "@/components/Account/ChangeUsernameForm.vue";
import ChangePasswordForm from "@/components/Account/ChangePasswordForm.vue";
import DeleteAccountForm from "@/components/Account/DeleteAccountForm.vue";
import LogoutForm from "@/components/Account/LogoutForm.vue";
import Visit from "@/components/Visit/Visit.vue";

export default {
  name: "ProfilePage",
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    DeleteAccountForm,
    LogoutForm,
    Visit,
  }
};
</script>
<style scoped>
header {
  margin: auto;
  width: 600px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.visit-list {
  display: block;
  width: 600px;
  margin: auto;
}
</style>
