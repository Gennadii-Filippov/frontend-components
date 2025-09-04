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
