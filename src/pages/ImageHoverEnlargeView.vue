<script setup lang="ts">
import { ref } from 'vue'
import ImageHoverEnlarge from '@/components/ImageHoverEnlarge.vue';
import googlelogo from '@/assets/googlelogo.png';

</script>

<template>
  <div class="images">
    <ImageHoverEnlarge tag="googlelogo" :src="googlelogo" alt="logo">
      Put your cursor over the image to enlarge it.
    </ImageHoverEnlarge>
  </div>
</template>

<style scoped>
.images {
  center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
}
</style>
