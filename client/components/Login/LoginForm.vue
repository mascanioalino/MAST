<!-- Form for signing in (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'LoginForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/curators/session',
      method: 'POST',
      hasBody: true,
      setUsername: true,
      setFirstName: true,
      setLastName: true,
      setBio: true,
      setEmail: true,
      setDateJoined: true,
      refreshAroundMe: true,
      refreshCircles: true,
      fields: [
        {id: 'username', label: 'Username', value: ''},
        {id: 'password', label: 'Password', value: ''}
      ],
      title: 'Sign in',
      callback: () => {
        this.$router.push({name: 'Around Me'});
        this.$store.commit('alert', {
          message: 'You are now signed in!', status: 'success'
        });
      }
    };
  }
};
</script>
