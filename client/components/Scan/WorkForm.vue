<!-- Form for signing in (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'WorkForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/works',
      method: 'POST',
      hasBody: true,
      setUsername: true,
      setDateJoined: true,
      fields: [
        {id: 'harvardId', label: 'Harvard ID', value: ''},
      ],
      title: 'Add Work',
      callback: () => {
        this.$store.commit('alert', {
          message: 'Work Added!', status: 'success'
        });
      }
    };
  }
};
</script>
