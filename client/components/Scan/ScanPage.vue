<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <header>
      <h1>
        @{{ $store.state.username }}
      </h1>
    </header>
    <qrcode-stream @decode="onDecode" />
  </main>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'

export default {
  name: 'AccountPage',
  components: {
    QrcodeStream,
  },
  methods: {
    onDecode (decodedString) {
      const harvardId = decodedString.split("/").pop();
      this.$router.push({name: 'Add Work', params: { harvardId }})
    }
  }
}
</script>
