<template>
  <Modal :width="heightWindow" class="base-popup__video-popup" :use-perfect-scrollbar="false">
    <template #content>
      <div class="base-popup__close-btn__container" @click="() => close()">
        <i class="base-popup__close-btn__button icon icon-cross" />
      </div>
      <div class="video-wrapper" :style="wrapperStyles" :class="[{ 'video-wrapper--mobile': isMobile }]">
        <iframe
          class="base-popup__video-popup-iframe"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
          frameborder="0"
          allowfullscreen
          :src="src"
        ></iframe>
      </div>
    </template>
  </Modal>
</template>
<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { VideoTypeEnum } from '@/types/Video';
import { WebEvent } from '@/types/WebEvent';
import Modal from '@/components/UI/modal/index.vue';
import useModal from '@/composables/useModal';
import { useDevice } from '@/composables/useDevice';
const { close, currentModal } = useModal({ name: 'Video' });
const params = currentModal?.value?.options || {};
const height = ref(0);
const defaultVideoHeight = 432;
const heightWindow = ref(defaultVideoHeight);
const { isMobile } = useDevice();
function heightCalc() {
  height.value = document.querySelector('.base-popup__video-popup-iframe')?.getBoundingClientRect().height ?? 0;
  const innerHeightWindow = window.innerHeight;
  heightWindow.value = innerHeightWindow < defaultVideoHeight ? (innerHeightWindow / 9) * 16 : 768;
}
onMounted(() => {
  heightCalc();
  window.addEventListener(WebEvent.Resize, heightCalc);
});
onUnmounted(() => {
  window.removeEventListener(WebEvent.Resize, heightCalc);
});

const wrapperStyles = computed(() => ({
  '--height': `${height.value}px`,
}));
const src = computed(() => {
  if (/https?:\/\//gi.test(params.id?.trim())) {
    return params.id;
  }
  switch (params.type) {
    case VideoTypeEnum.VK:
      const VKParams = params.id?.split('_');
      return (
        'https://vk.com/video_ext.php?oid=' + VKParams[0] + '&id=' + (VKParams[1] ?? VKParams[0]) + '&hd=2&autoplay=1'
      );
    case VideoTypeEnum.Vimeo:
      return 'https://player.vimeo.com/video/' + params.id;
    case VideoTypeEnum.Youtube:
    default:
      return 'https://www.youtube.com/embed/' + params.id;
  }
});
</script>
<style lang="scss">
@use '@assets/sass/settings' as *;
.base-popup__video-popup {
  &-iframe {
    border: none;
    max-height: 100vh;
  }
  .base-popup__inner {
    overflow: hidden;
  }
  .base-popup__header {
    display: none;
  }
  .base-popup__content {
    padding: 0;
    background-color: color(dark-video);
  }
  .video-wrapper--mobile {
    top: calc((100vh - var(--height)) / 2);
  }
  .video-wrapper {
    width: auto;
  }
  .base-popup__close-btn {
    &__container {
      position: absolute;
      right: 0;
      height: 56px;
      width: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 9999;
    }
    &__button {
      color: color(white);
      opacity: 0.6;
      height: rem(24px);
      width: rem(24px);
      &:before {
        font-size: rem(24px);
        line-height: rem(24px);
        height: rem(24px);
        width: rem(24px);
      }
    }
  }
}
</style>
