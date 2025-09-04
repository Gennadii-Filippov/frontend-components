<script setup lang="ts">
import { Lang } from '@/types/Lang';
import { InputType } from '@/components/UI/inputs/types';
import { ValidationRules } from '@/composables/formValidation/types';
import { PopupType } from '@/types/Popup';
import { TRANSLATION_KEY } from '@/types/injection-keys';
import { ref, onMounted, inject } from 'vue';
import { ButtonType } from '@/components/UI/button/ButtonTypes';
import { useModal, useConfig, useRecaptcha, useFormWithValidation, BaseCheckbox, BaseInput, BaseButton } from '@/index';
import Loader from '../UI/Loader.vue';

const { open, currentModal, close } = useModal({
  name: 'auth',
  closeOnDestroy: false,
});

const { init, renderBadge, executeRecaptcha } = await useRecaptcha(useConfig().get('locale'));

const isSuccessLogIn = ref(false);
const recaptchaBadge = ref<HTMLElement | null>(null);
const isLoading = ref(false);
const _ = inject(TRANSLATION_KEY, (key: string) => key);
withDefaults(
  defineProps<{
    messageClass: string;
    socialErrorText: string;
  }>(),
  {
    messageClass: '',
    socialErrorText: '',
  }
);

const { form, validateField, setInFocusValue, errorsToShow, sendForm } = useFormWithValidation([
  {
    name: '_csrf_token',
    value: '',
    rules: [],
  },
  {
    name: '_target_path',
    value: '',
    rules: [],
  },
  {
    name: '_username',
    value: '',
    rules: [
      {
        type: ValidationRules.Required,
        message: _(Lang.EnterYourLogin),
      },
    ],
  },
  {
    name: '_password',
    value: '',
    rules: [
      {
        type: ValidationRules.Required,
        message: _(Lang.EnterThePassword),
      },
    ],
  },
  {
    name: '_remember_me',
    value: false,
    rules: [],
  },
]);

const send = async () => {
  await sendForm({
    beforeSend: async (formData) => {
      isLoading.value = true;
      const token = await executeRecaptcha('login_check');
      if (!token) {
        return;
      }
      // вместо true должна быть 1, а вместо false вовсе не должно быть, если как на проде делать
      form.values._remember_me ? formData.append('_remember_me', '1') : null;
      formData.append('captcha_token', token);
    },
    send: currentModal?.value?.options?.sendAuthForm,
    afterSend: async (response) => {
      //TODO получать данные о пользователе и обновлять интерфейс
      console.log('response: ', response);
      isLoading.value = false;
      if (response.status === 'success') {
        isSuccessLogIn.value = true;
        // TODO: авторизация
      }
    },
  });
};

onMounted(async () => {
  if (recaptchaBadge.value) {
    await init(() => renderBadge(recaptchaBadge.value as HTMLElement, 'login_check'));
  }
});

const openRecoveryPassword = () => {
  open({ name: PopupType.RecoverPassword });
  setTimeout(() => {
    close();
  }, 100);
};
</script>
<template>
  <div>
    <div v-if="isSuccessLogIn" class="pb-6 c-green error-text">
      {{ _(Lang.LoggingIn) }}
    </div>

    <form id="login-form" @submit.prevent="send">
      <div :class="['auth-block', messageClass]" v-if="socialErrorText">
        {{ socialErrorText }}
      </div>
      <BaseInput
        id="username"
        :autocomplete="'username'"
        v-model="form.values._username"
        :label="_(Lang.Username)"
        :type="InputType.Text"
        :class="['auth-popup__input', { 'input-box__container--error': form.errorForm }]"
        :errorsFormWithValidation="errorsToShow('_username')"
        @blur="validateField('_username')"
        @focus="setInFocusValue('_username', false)"
        :disabled="isLoading"
      />
      <BaseInput
        id="password"
        autocomplete="current-password"
        v-model="form.values._password"
        :label="_(Lang.Password)"
        :type="InputType.Password"
        :class="['auth-popup__input', { 'input-box__container--error': form.errorForm }]"
        :errorsFormWithValidation="errorsToShow('_password')"
        @blur="validateField('_password')"
        @focus="setInFocusValue('_password', false)"
        :disabled="isLoading"
      />
      <BaseCheckbox
        id="remember_me"
        v-model="form.values._remember_me"
        class="auth-popup__checkbox auth-popup__checkbox--big-font 123"
        :label-html="_(Lang.RememberMe)"
        boxHeight="0.75rem"
        boxWidth="0.75rem"
      />
      <BaseButton
        type="submit"
        height="48px"
        width="100%"
        :disabled="isLoading"
        class="auth-popup__submit-btn"
        :buttonType="ButtonType.Blue"
      >
        {{ _(Lang.LogIn) }} <Loader v-if="isLoading" name="AuthForm" />
      </BaseButton>
    </form>
    <div
      class="forgot-password link"
      @click="
        () => {
          open({ name: PopupType.RecoverPassword, forceCloseAll: true });
        }
      "
    >
      {{ _(Lang.ForgotPassword) }}
    </div>
  </div>
</template>
