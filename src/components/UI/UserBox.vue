<template>
  <a :href="route(RouteName.UserProfileShow, { userid: id })" class="user-box link">
    <img
      width="32"
      height="32"
      loading="lazy"
      class="user-box__avatar"
      :src="avatar ? asset(avatar) : img"
      alt="avatar"
    />
    <div class="user-box__name">
      {{ username }}
    </div>
  </a>
</template>

<script setup lang="ts">
import { asset } from '@/components/menu/utils';
import { RouteName } from '@/types/RouteName';
import img from '@assets/images/no-photo_little.png';
import { inject } from 'vue';
const route = inject<(name: string, params?: Record<string, any>) => string>('route', (key: string) => key);

defineProps<{
  id: number;
  username: string;
  avatar: string;
}>();
</script>

<style lang="scss" scoped>
@use '@assets/sass/settings' as *;

.user-box {
  display: flex;
  align-items: center;
  gap: rem(4px);
  font-size: rem(14px);
  flex-shrink: 0;
  word-break: break-all;

  &__avatar {
    border-radius: 100%;
    object-fit: cover;
  }
}
</style>
