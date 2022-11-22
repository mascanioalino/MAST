<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <main>
    <section class="options">
      <LoginForm class="form" />
      <RegisterForm class="form" />
    </section>
  </main>
</template>

<script>
import RegisterForm from '@/components/Login/RegisterForm.vue';
import LoginForm from '@/components/Login/LoginForm.vue';

export default {
  name: 'LoginPage',
  components: {
    RegisterForm,
    LoginForm
  }
};
</script>

<style>
main {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
}

.options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 64px;
  width: 100%;
}

.form {
  width: 384px;
}

</style>