<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h1>@{{ $store.state.username }}</h1>
        <p><b>Date Joined:</b> {{ $store.state.dateJoined }}</p>
      </header>
      <article class="accountSettings">
        <h2>Update Account</h2>
        <section>
          <div>
            <ChangeUsernameForm />
          </div>
          <div>
            <ChangePasswordForm />
          </div>
        </section>

        <h2>Manage Account</h2>
        <section>
          <div>
            <LogoutForm />
          </div>
          <div>
            <DeleteAccountForm />
          </div>
        </section>
      </article>
    </section>
  </main>
</template>

<script>
import ChangeUsernameForm from "@/components/Account/ChangeUsernameForm.vue";
import ChangePasswordForm from "@/components/Account/ChangePasswordForm.vue";
import DeleteAccountForm from "@/components/Account/DeleteAccountForm.vue";
import LogoutForm from "@/components/Account/LogoutForm.vue";

export default {
  name: "AccountPage",
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    DeleteAccountForm,
    LogoutForm,
  },
};
</script>
<style scoped>
section {
  display: block;
  width: 800px;
  margin: auto;
}

h2 {
  margin-bottom: 6px;
  margin-top: 48px;
}
.accountSettings section {
  width: 100%;
  display: flex;
}

.accountSettings section div {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
