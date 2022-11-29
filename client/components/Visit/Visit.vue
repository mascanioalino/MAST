<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>Visit at: {{ this.visit.dateOfVisit }}</main>
</template>

<script>
import ChangeUsernameForm from "@/components/Account/ChangeUsernameForm.vue";
import ChangePasswordForm from "@/components/Account/ChangePasswordForm.vue";
import DeleteAccountForm from "@/components/Account/DeleteAccountForm.vue";
import LogoutForm from "@/components/Account/LogoutForm.vue";

export default {
  name: "Visit",
  props: {
    visit: {
      type: Object,
    },
  },
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    DeleteAccountForm,
    LogoutForm,
  },
};
</script>
<style scoped>
main {
  display: block;
  margin: 10px 0px;
  border: 1px solid black;
  padding: 20px;
}
</style>
