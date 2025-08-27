<template>
  <div class="reg-auth-popup__header">
    <div
      :class="['reg-auth-popup__title', { 'reg-auth-popup__title--active': activeTab === Tabs.Auth }]"
      @click="emit('setTab', Tabs.Auth)"
    >
      {{ _(Lang.Login) }}
    </div>
    <div
      :class="['reg-auth-popup__title', { 'reg-auth-popup__title--active': activeTab === Tabs.Registration }]"
      @click="emit('setTab', Tabs.Registration)"
    >
      {{ _(Lang.Registration) }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { Tabs } from '@/types/Tabs';
import { Lang } from '@/types/Lang';
import { inject } from 'vue';
import { TRANSLATION_KEY } from '@/types/injection-keys';

const _ = inject(TRANSLATION_KEY, (key: string) => key);

const emit = defineEmits<{
  (e: 'setTab', value: Tabs): void;
}>();

defineProps<{
  activeTab: Tabs;
}>();
</script>

<style scoped lang="scss">
// @use '@assets/sass/settings' as *;
.reg-auth-popup__header {
  display: flex;
  gap: rem(12px);
  height: 100%;
}
.reg-auth-popup__title {
  cursor: pointer;
  height: 100%;
  font-weight: 600;
  font-size: rem(14px);
  display: flex;
  align-items: center;
  color: color(black-80);
  user-select: none;

  &--active {
    color: color(blue);
    position: relative;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      height: rem(1px);
      background-color: color(blue);
      bottom: -15px;
    }
  }
}
</style>
