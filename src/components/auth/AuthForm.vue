<template>
  <div>
    <div v-if="isSuccessLogIn" class="pb-6 c-green error-text">
      {{ _(Lang.LoggingIn) }}
    </div>
    <form id="login-form" @submit.prevent="send">
      <div :class="['auth-block', messageClass]" v-if="socialErrorText">
        {{ socialErrorText }}
      </div>
      <!--      <div v-if="loggingIn" class="auth-block auth-block&#45;&#45;green">{{ t(Lang.LoggingIn) }}</div>-->
      <!--        TODO: актуально ли app.session.flashBag.get ?-->
      <!--        {% for flash_message in app.session.flashBag.get('registration_confirmed') %}-->
      <!--        <div class="error-text c-green block-section">{{ flash_message }}</div>-->
      <!--        {% endfor %}-->
      <!--        {% for flash_message in app.session.flashBag.get('registration_error') %}-->
      <!--        <div class="error-text c-red block-section">{{ flash_message }}</div>-->
      <!--        {% endfor %}-->
      <!--    TODO: токены предположительно нерабочие-->
      <!--      <input type="hidden" name="_csrf_token" value="{{ csrf_token('authenticate')  }}" />-->
      <!--      {% if app.request.get('_route') != app.request.headers.get('referer') %}-->
      <!--      {# <input type="hidden" name="_target_path" value="{{ app.request.headers.get('referer') }}" не работает на тесте /> #}-->
      <!--      <input type="hidden" name="_csrf_token" value="{{ csrf_token }}" />-->
      <!--      {% endif %}-->
      <!--        TODO: path("fos_user_security_check") - предварительно сделано-->
      <BaseInput
        id="username"
        :autocomplete="'username'"
        v-model="form.values._username"
        :label="_(Lang.Username)"
        :type="InputType.Text"
        :class="['auth-popup__input', { 'input-box__container--error': form.errorForm }]"
        :errors-form-with-validation="errorsToShow('_username')"
        @blur="validateField('_username')"
        @focus="setInFocusValue('_username', false)"
      />
      <BaseInput
        id="password"
        :autocomplete="'current-password'"
        v-model="form.values._password"
        :label="_(Lang.Password)"
        :type="InputType.Password"
        :class="['auth-popup__input', { 'input-box__container--error': form.errorForm }]"
        :errors-form-with-validation="errorsToShow('_password')"
        @blur="validateField('_password')"
        @focus="setInFocusValue('_password', false)"
      />
      <BaseCheckbox
        id="remember_me"
        v-model="form.values._remember_me"
        class="auth-popup__checkbox auth-popup__checkbox--big-font 123"
        :label-html="_(Lang.RememberMe)"
        box-height="0.75rem"
        box-width="0.75rem"
      />
      <base-button
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
      </base-button>
    </form>

    <div class="forgot-password link" @click="open({ name: PopupType.RecoverPassword })">
      {{ _(Lang.ForgotPassword) }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { Lang } from '@/types/Lang';
import { InputType } from '@/components/UI/inputs/types';
import BaseButton from '@/components/UI/button/BaseButton.vue';
import BaseInput from '@/components/UI/inputs/BaseInput.vue';
import BaseCheckbox from '@/components/UI/checkbox/BaseCheckbox.vue';
import { ValidationRules } from '@/composables/formValidation/types';
import { PopupParams, PopupType } from '@/types/Popup';
import { inject } from 'vue';
import { TRANSLATION_KEY } from '@/types/injection-keys';
import { useFormWithValidation } from '@/composables/formValidation/useFormWithValidation';
import { ref } from 'vue';
import { ButtonType } from '@/components/UI/button/ButtonTypes';
import useModal from '@/composables/useModal';
const { open, currentModal } = useModal({ name: 'auth' });

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
    defaultServerError: true,
  },
  {
    name: '_remember_me',
    value: true,
    rules: [],
  },
]);
const isSuccessLogIn = ref(false);
const isLoading = ref(false);
const send = async () => {
  const params = currentModal?.value?.options as PopupParams[PopupType.Auth];
  await params.sendAuthForm(sendForm, form, isLoading, isSuccessLogIn);
};
</script>

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
</style>
