<template>
  <main
    style="
      padding: 24px;
      font-family:
        system-ui,
        -apple-system,
        Segoe UI,
        Roboto,
        Ubuntu,
        Cantarell,
        Noto Sans,
        Helvetica,
        Arial,
        Apple Color Emoji,
        Segoe UI Emoji,
        Segoe UI Symbol;
    "
  >
    <AuthPopup />
    <h1>Frontend Components Demo</h1>
    {{ modalsList }}
    <p>Below are a few components rendered from the library.</p>

    <section style="display: grid; gap: 16px; max-width: 420px; margin-top: 16px">
      <BaseButton :buttonType="ButtonType.Blue" height="40" width="100%" @click="open">Primary Button</BaseButton>
      <BaseCheckbox id="demo-check" v-model="checked" :labelHtml="'Accept terms'" />
      <BaseInput id="demo-input" v-model="text" label="Your text" placeholder="Type something" />
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { BaseButton, BaseCheckbox, BaseInput, ButtonType } from '@/index';
import AuthPopup from '@/components/auth/AuthPopup.vue';
import useModal from '@/composables/useModal';
const { open, modalsList } = useModal({ name: 'auth' });
const checked = ref(false);
const text = ref('');
onMounted(() => {
  window.siteLocale = 'ru';
});
</script>

<style scoped>
:root {
  color-scheme: light dark;
}
</style>
