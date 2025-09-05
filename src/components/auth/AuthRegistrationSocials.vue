<template>
  <div class="sign-in-social">
    <BaseIcon
      v-for="link in socialLinks"
      :key="link.id"
      :data-goal-click="'login-social-' + link.provider"
      :data-goal-param-label="'login-social-' + link.provider"
      :iconName="link.icon"
      :textColor="link.textColor"
      :fontSize="'36px'"
      :size="36"
      :dataProvider="link.provider"
      tagName="a"
      class="social-auth-link"
      @click="socialAuth(link)"
    />
  </div>
</template>
<script setup lang="ts">
// TODO: SocialAuth.ts (data-url), (data-provider, data-goal-click - для nuxt)
import { Locale as Locales } from '@/types/Locale';
import BaseIcon from '@/components/UI/icon/Icon.vue';
import { IconNames } from '@/components/UI/icon/iconNames';
import { localeIn, localeNotIn } from './checkLocale';
import { ref, computed, onMounted } from 'vue';
import { SocialIcon } from './types';
import { PopupType } from '@/types/Popup';
import useModal from '@/composables/useModal';
const { open, close, closeAll } = useModal({
  name: 'auth',
});

import { WebEvent } from '@/types/WebEvent';

const icons = ref<SocialIcon[]>([
  {
    id: 0,
    icon: IconNames.LogoFacebook,
    provider: 'facebook',
    textColor: '#3b5998',
  },
  {
    id: 1,
    icon: IconNames.LogoGoogle,
    provider: 'google',
    textColor: '#33a952',
  },
  { id: 2, icon: IconNames.LogoVk, provider: 'vk', textColor: '#4d76a1' },
  { id: 3, icon: IconNames.LogoMail, provider: 'mailru', textColor: '#fdb75b' },
  {
    id: 4,
    icon: IconNames.LogoTwitter,
    provider: 'twitter',
    textColor: 'rgba(0,0,0,0.8)',
  },
  { id: 5, icon: IconNames.LogoOk, provider: 'ok', textColor: '#ec8124' },
  {
    id: 6,
    icon: IconNames.LogoYandexColor,
    provider: 'yandex',
    textColor: '#FC3F1D',
  },
]);

const socialLinks = computed(() => {
  const links = [];
  if (localeIn([Locales.KZ, Locales.RU])) {
    if (localeNotIn([Locales.RU])) {
      links.push(icons.value[0], icons.value[1]);
    }
    links.push(icons.value[2]);
    if (localeNotIn([Locales.KZ])) {
      links.push(icons.value[6]);
    }
    links.push(icons.value[3]);
    if (localeNotIn([Locales.RU])) {
      links.push(icons.value[4]);
    }
    links.push(icons.value[5]);
  } else if (localeIn([Locales.ES, Locales.GB, Locales.CZ, Locales.RS])) {
    links.push(icons.value[0]);
    if (localeNotIn([Locales.RS])) {
      links.push(icons.value[4]);
    }
    links.push(icons.value[1]);
  }
  return links;
});
let windowAuth: Window | null = null;
const acceptOrigin = ['https://sso.legalbet.com'];
function socialAuth(link: SocialIcon) {
  let url =
    'http://sso.legalbet.com/get-url/?provider=' +
    link.provider +
    '&redirect=' +
    window.location.origin.replace(/\/$/, '');
  url += (url.indexOf('?') >= 0 ? '&' : '?') + 'referer=' + window.location.toString().replace(/#.+?$/gi, '');
  const h = 425,
    w = 600,
    left = (screen.width - w) / 2 + 'px',
    top = (screen.height - h) / 2 + 'px';

  windowAuth = window.open(
    url,
    '_blank ',
    'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' +
      w +
      'px, height=' +
      h +
      'px, top=' +
      top +
      ', left=' +
      left
  );
}

const props = defineProps<{
  removeErrorText: () => void;
  addErrorText: (messageClass: string, text: string) => void;
}>();

onMounted(() => {
  window.addEventListener(WebEvent.Message, (event) => {
    if (
      (event.origin != location.origin && acceptOrigin.length && acceptOrigin.indexOf(event.origin) < 0) ||
      !windowAuth
    ) {
      return;
    }

    if (event.data && !event.data.from_auth) {
      close('auth');
      return;
    }

    if (event.data) {
      // closeAll();
      event.data.popupType = PopupType.SocialMediaRegister;
      open({ name: PopupType.SocialMediaRegister, options: event.data });
    }

    if (event.data && typeof event.data.status != 'undefined' && typeof event.data.text != 'undefined') {
      props.removeErrorText();
      const isSuccess = event.data.status == 'success',
        messageClass = isSuccess ? 'c-green' : 'c-red';
      props.addErrorText(messageClass, event.data.text);

      if (isSuccess && (typeof event.data.no_reload == 'undefined' || !event.data.no_reload)) {
        setTimeout(() => {
          location.reload();
        }, 2000);
      }
    }
  });
});
</script>
<style scoped lang="scss">
.social-auth-link {
  display: block;
  cursor: pointer;
}
.sign-in-social {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: rem(12px);
  margin-bottom: rem(24px);
}
.icon.icon-logo-google {
  background-image: url('~@img/icons/logo-google-color.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  &:before {
    display: none;
  }
}
</style>
