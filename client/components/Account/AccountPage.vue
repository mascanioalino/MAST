<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <header>
      <h1>
        @{{ $store.state.username }}
      </h1>
    </header>
    <article class="accountSettings">
      <p><b>Date Joined:</b> {{ $store.state.dateJoined }}</p>
      <ChangeUsernameForm />
      <ChangePasswordForm />
      <h2>Account management</h2>
      <LogoutForm />
      <DeleteAccountForm />
    </article>
  </main>
</template>

<script>
import ChangeUsernameForm from '@/components/Account/ChangeUsernameForm.vue';
import ChangePasswordForm from '@/components/Account/ChangePasswordForm.vue';
import DeleteAccountForm from '@/components/Account/DeleteAccountForm.vue';
import LogoutForm from '@/components/Account/LogoutForm.vue';

export default {
  name: 'AccountPage',
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    DeleteAccountForm,
    LogoutForm,
  }
};
</script>
