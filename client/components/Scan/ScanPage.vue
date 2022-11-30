<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <qrcode-stream 
      class="camera" 
      @decode="onDecode"
    />
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

<style>
  .camera {
    z-index: -1 !important;
    position: fixed !important;
    left: 0px;
    top: 0px;
  }
</style>


