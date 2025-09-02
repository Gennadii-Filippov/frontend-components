<script setup lang="ts">
import { Lang } from '@/types/Lang';
import { InputType } from '@/components/UI/inputs/types';
import BaseButton from '@/components/UI/button/Button.vue';
import BaseInput from '@/components/UI/inputs/Input.vue';
import BaseCheckbox from '@/components/UI/checkbox/Checkbox.vue';
import { ValidationRules } from '@/composables/formValidation/types';
import { PopupType } from '@/types/Popup';
import { inject } from 'vue';
import { TRANSLATION_KEY } from '@/types/injection-keys';
import { useFormWithValidation } from '@/composables/formValidation/useFormWithValidation';
import { ref, onMounted } from 'vue';
import { ButtonType } from '@/components/UI/button/ButtonTypes';
import useModal from '@/composables/useModal';
import useRecaptcha from '@/composables/useRecaptcha';
import { useConfig } from '@/composables/useConfig';

const { open, currentModal } = useModal({
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
      />
      <BaseCheckbox
        id="remember_me"
        v-model="form.values._remember_me"
        class="auth-popup__checkbox auth-popup__checkbox--big-font 123"
        :label-html="_(Lang.RememberMe)"
        boxHeight="0.75rem"
        box-width="0.75rem"
      />
      <BaseButton
        type="submit"
        height="48px"
        width="100%"
        :disabled="isLoading"
        class="auth-popup__submit-btn"
        :button-type="ButtonType.Blue"
      >
        {{ _(Lang.LogIn) }}
        <!--        Это заготовка для нового дизайна-->
        <!--        <span class="auth-popup__submit-btn__points" v-if="loggingIn">{{ points }}</span>-->
      </BaseButton>
    </form>
    <div class="forgot-password link" @click="() => open({ name: PopupType.RecoverPassword })">
      {{ _(Lang.ForgotPassword) }}
    </div>
  </div>
</template>
<style lang="scss">
.auth-popup__checkbox {
  .checkbox-container {
    gap: rem(12px);
  }
  margin-bottom: rem(40px);
  .input-checkbox {
    padding: 0;
    min-height: rem(12px);
  }
  .checkbox-label {
    font-size: rem(14px) !important;
    line-height: rem(14px) !important;
  }
}
.auth-popup__submit-btn {
  margin-bottom: rem(24px);
  font-weight: 600;
  font-size: rem(16px);
  line-height: rem(18px);
  &__points {
    position: absolute;
    padding-left: rem(4px);
  }
}
.forgot-password {
  font-weight: 600;
  font-size: rem(14px);
  line-height: rem(16px);
  width: 100%;
  text-align: center;
}
.auth-block {
  margin-bottom: rem(24px);
  &--green {
    color: color(green);
  }
}
.input-box__input {
  width: 100%;
}
</style>
