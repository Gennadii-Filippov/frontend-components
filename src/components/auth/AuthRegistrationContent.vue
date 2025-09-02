<template>
  <div v-if="localeIn([Locales.KZ, Locales.RU, Locales.ES, Locales.GB, Locales.CZ, Locales.RS])">
    <div v-if="note" class="auth-popup__note">
      <div class="password-note">
        <div class="password-note__wrap">
          <BaseIcon :iconName="IconNames.CircleE" size="24px" font-size="24px" text-color="rgba(52, 152, 219, 1)" />
          <div class="password-note__txt" v-html="note" />
        </div>
      </div>
    </div>
    <!--            у регистрации и авторизации по какой-то причине vk перемещается, в остальном одинаково-->
    <!--            поэтому одна компонента (можно передать флажок для computed и настроить)-->
    <AuthRegistrationSocials :removeErrorText="removeErrorText" :addErrorText="addErrorText" />
    <div class="auth-popup__or">
      <div class="sign-in__line" />
      <div class="sign-in__txt">{{ _(Lang.Or) }}</div>
      <div class="sign-in__line" />
    </div>
  </div>
</template>
<script setup lang="ts">
import AuthRegistrationSocials from './AuthRegistrationSocials.vue';
import BaseIcon from '@/components/UI/icon/Icon.vue';
import { IconNames } from '@/components/UI/icon/iconNames';
import { Locale as Locales } from '@/types/Locale';
import { localeIn } from './checkLocale';
import { inject } from 'vue';
import { TRANSLATION_KEY } from '@/types/injection-keys';
import { Lang } from '@/types/Lang';
const _ = inject(TRANSLATION_KEY, (key: string) => key);

defineProps<{
  removeErrorText: () => void;
  addErrorText: (messageClass: string, text: string) => void;
  note: string;
}>();
</script>
<style lang="scss" scoped>
// @use '@assets/sass/settings' as *;
.password-note {
  margin-bottom: rem(24px);
  &__wrap {
    padding: rem(16px);
    display: flex;
    gap: rem(12px);
    border-radius: rem(8px);
    border: rem(1px) solid color(blue);
  }
  &__txt {
    font-weight: 400;
    font-size: rem(14px);
    line-height: rem(20px);
  }
}

.auth-popup__or {
  text-transform: lowercase;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: rem(24px);
}
.sign-in__line {
  background-color: color(black-10);
  height: rem(1px);
  width: 100%;
}
.sign-in__txt {
  text-align: center;
  font-size: rem(12px);
  font-weight: 400;
  line-height: rem(14px);
  color: color(black-40);
  margin: 0 rem(12px);
}
</style>
