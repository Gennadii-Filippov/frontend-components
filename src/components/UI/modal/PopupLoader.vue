<template>
  <div class="popup-loader" @click="() => close()">
    <Loader size="25" />
  </div>
</template>

<script setup lang="ts">
import Loader from '../Loader.vue';
import useModal from '@/composables/useModal';
const props = defineProps<{ name: string }>();

const { close } = useModal({
  name: props?.name,
});
</script>

<style lang="scss" scoped>
// @use '@assets/sass/settings' as *;
.popup-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(12px);
  background-color: color(black-60);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999999;
}
</style>
