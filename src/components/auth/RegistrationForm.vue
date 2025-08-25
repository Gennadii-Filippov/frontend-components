<template>
  <form id="register-form" @submit.prevent="send">
    <div :class="['auth-block', messageClass]" v-if="socialErrorText">
      {{ socialErrorText }}
    </div>
    <input
      type="hidden"
      data-controller="csrf-protection"
      id="fos_user_registration_form__token"
      v-model="form.values['fos_user_registration_form[_token]']"
      name="fos_user_registration_form[_token]"
    />
    <BaseInput
      id="fos_user_registration_form_email"
      v-model="form.values['fos_user_registration_form[email]'] as string"
      :label="_(Lang.Email)"
      :type="InputType.Text"
      class="auth-popup__input"
      :errors-form-with-validation="errorsToShow('fos_user_registration_form[email]')"
      @focus="setInFocusValue('fos_user_registration_form[email]', true)"
      @blur="
        setInFocusValue('fos_user_registration_form[email]', false);
        validateField('fos_user_registration_form[email]');
      "
    />
    <BaseInput
      id="fos_user_registration_form_username"
      v-model="form.values['fos_user_registration_form[username]'] as string"
      :label="_(Lang.Username)"
      :type="InputType.Text"
      :autocomplete="'off'"
      class="auth-popup__input"
      :errors-form-with-validation="errorsToShow('fos_user_registration_form[username]')"
      @focus="setInFocusValue('fos_user_registration_form[username]', true)"
      @blur="
        setInFocusValue('fos_user_registration_form[username]', false);
        validateField('fos_user_registration_form[username]');
      "
    />
    <BaseInput
      id="fos_user_registration_form_plainPassword_first"
      v-model="form.values['fos_user_registration_form[plainPassword][first]'] as string"
      :label="_(Lang.Password)"
      :type="InputType.Password"
      :autocomplete="'new-password'"
      class="auth-popup__input"
      :errors-form-with-validation="errorsToShow('fos_user_registration_form[plainPassword][first]')"
      @blur="
        setInFocusValue('fos_user_registration_form[plainPassword][first]', false);
        validateField('fos_user_registration_form[plainPassword][first]');
      "
      @focus="setInFocusValue('fos_user_registration_form[plainPassword][first]', true)"
    />
    <BaseInput
      id="fos_user_registration_form_plainPassword_second"
      v-model="form.values['fos_user_registration_form[plainPassword][second]'] as string"
      :label="_(Lang.RepeatThePassword)"
      :type="InputType.Password"
      :autocomplete="'new-password'"
      class="auth-popup__input"
      :errors-form-with-validation="errorsToShow('fos_user_registration_form[plainPassword][second]')"
      @blur="
        setInFocusValue('fos_user_registration_form[plainPassword][second]', false);
        validateField('fos_user_registration_form[plainPassword][second]');
      "
      @focus="setInFocusValue('fos_user_registration_form[plainPassword][second]', true)"
    />
    <BaseCheckbox
      id="notice_bonus"
      v-model="form.values.notice_bonus"
      class="auth-popup__remember-me"
      :label-html="_(Lang.GetMostInterestingFromSiteOnEmail)"
      :errors="errorsToShow('notice_bonus')"
      box-height="0.75rem"
      box-width="0.75rem"
    />
    <BaseCheckbox
      v-if="localeIn([Locales.ES, Locales.GB, Locales.CZ, Locales.RS])"
      id="age-limit"
      box-height="0.75rem"
      box-width="0.75rem"
      v-model="form.values.agelimitname"
      class="auth-popup__checkbox auth-popup__confirm-age"
      :label-html="_(Lang.ConfirmAge)"
      :errors="errorsToShow('agelimitname')"
    />

    <BaseCheckbox
      v-if="localeIn(allowedLocales) && locale in idPath"
      id="terms_gdpr"
      box-height="0.75rem"
      box-width="0.75rem"
      v-model="form.values.rules"
      class="gdpr-label"
      :label-html="labelPolicy"
      :errors="errorsToShow('rules')"
    />
    <!--    <div class="agree-error" v-if="localeIn(allowedLocales) && idPath[locale] && errorsToShow('rules').length">-->
    <!--      <base-icon-->
    <!--        class="agree-error__icon"-->
    <!--        :icon-name="IconNames.CircleE"-->
    <!--        size="20px"-->
    <!--        font-size="20px"-->
    <!--        text-color="rgba(246, 71, 71, 1)"-->
    <!--      />-->
    <!--      <span class="agree-error__text"> {{ _(Lang.YouMustAgreeToTheTerms) }}</span>-->
    <!--    </div>-->
    <input type="hidden" :value="isLogin" name="visible-first" />
    <BaseButton
      data-goal-click="registration-button"
      type="submit"
      height="48px"
      width="100%"
      :button-type="ButtonType.Blue"
      :class="['auth-popup__submit-btn', { 'mt-0 mb-3': isLogin }]"
      :disabled="loggingIn"
    >
      {{ _(Lang.Register) }}
    </BaseButton>
    <div class="register-form__grecaptcha" v-if="reCaptchaComponent">
      <component :is="reCaptchaComponent" action="homepage" />
    </div>
  </form>
</template>
<script setup lang="ts">
//src/Intell/UserBundle/Resources/views/Registration/register.html.twig
import { Lang } from '@/types/Lang';
import { InputType } from '@/components/UI/inputs/types';
import BaseInput from '@/components/UI/inputs/BaseInput.vue';
import { Locale as Locales } from '@/types/Locale';
import BaseButton from '@/components/UI/button/BaseButton.vue';
import { localeIn } from './checkLocale';
import { computed, defineComponent, onMounted, ref, shallowRef } from 'vue';
import BaseCheckbox from '@/components/UI/checkbox/BaseCheckbox.vue';
import { inject } from 'vue';
import { TRANSLATION_KEY } from '@/types/injection-keys';
import { useFormWithValidation } from '@/composables/formValidation/useFormWithValidation';
import { allowedLocales, getLabelPolicy, idPath } from './helper';
import { AgeLimitRules, RulesRules } from './registerRules';

import { PopupParams, PopupType } from '@/types/Popup';
import { ButtonType } from '@/components/UI/button/ButtonTypes';
import useModal from '@/composables/useModal';
const { currentModal } = useModal({ name: 'auth' });
import { ValidationRule, ValidationRules } from '@/composables/formValidation/types';
const _ = inject(TRANSLATION_KEY, (key: string) => key);

const PasswordFieldRules: ValidationRule[] = [
  {
    type: ValidationRules.Required,
    message: _(Lang.EnterThePassword),
  },
  {
    type: ValidationRules.MinLength,
    value: 8,
    message: _(Lang.ThePasswordMustBeAtLeastEightCharacters),
  },
  {
    type: ValidationRules.MaxLength,
    value: 72,
    message: _(Lang.TheEmailMustBeNoMoreThanSevTwoCharacters),
  },
];

const UsernameFieldRules: ValidationRule[] = [
  {
    type: ValidationRules.Required,
    message: _(Lang.EnterYourLogin),
  },
  {
    type: ValidationRules.MinLength,
    value: 6,
    message: _(Lang.FromSixToThirtyCharacters),
  },
  {
    type: ValidationRules.MaxLength,
    value: 30,
    message: _(Lang.FromSixToThirtyCharacters),
  },
  {
    type: ValidationRules.isLatinDigitsDot,
    message: _(Lang.OnlyLettersNumbersPeriods),
  },
];

const EmailFieldRules: ValidationRule[] = [
  {
    type: ValidationRules.Required,
    message: _(Lang.EnterYourEmailAddress),
  },
  {
    type: ValidationRules.isEmail,
    message: _(Lang.EnterAValidEmailAddress),
  },
  {
    type: ValidationRules.MaxLength,
    value: 72,
    message: _(Lang.TheEmailMustBeNoMoreThanSevTwoCharacters),
  },
];
const reCaptchaComponent = shallowRef<ReturnType<typeof defineComponent> | null>(null);
const locale = computed(() => window.siteLocale as Locales);
const props = defineProps<{
  isLogin?: boolean;
  messageClass: string;
  socialErrorText: string;
  token: string;
}>();

const params = currentModal.value?.options as PopupParams[PopupType.Auth];

const fields = [
  {
    name: 'fos_user_registration_form[_token]',
    value: props.token,
    rules: [],
  },
  {
    name: 'fos_user_registration_form[email]',
    value: '',
    rules: EmailFieldRules,
  },
  {
    name: 'fos_user_registration_form[username]',
    value: '',
    rules: UsernameFieldRules,
  },
  {
    name: 'fos_user_registration_form[plainPassword][first]',
    value: '',
    rules: PasswordFieldRules,
  },
  {
    name: 'fos_user_registration_form[plainPassword][second]',
    value: '',
    rules: PasswordFieldRules,
    defaultServerError: true,
  },
  {
    name: 'notice_bonus',
    value: false,
    rules: [],
  },
  {
    name: 'rules',
    value: false,
    rules: RulesRules,
  },
  {
    name: 'visible-first',
    value: false,
    rules: [],
  },
  {
    name: 'captcha_token',
    value: '',
    rules: [],
  },
  {
    name: 'g-recaptcha-response',
    value: '',
    rules: [],
  },
];
if (localeIn([Locales.ES, Locales.GB, Locales.CZ, Locales.RS])) {
  fields.push({
    name: 'agelimitname',
    value: false,
    rules: AgeLimitRules,
  });
}
const { form, setInFocusValue, errorsToShow, sendForm, validateField } = useFormWithValidation(fields);
const loggingIn = ref(false);
const send = async () => {
  await params.sendRegisterForm(sendForm, form, loggingIn);
};
const labelPolicy = computed(() => {
  //ts-ignore
  return getLabelPolicy(locale.value);
});
onMounted(async () => {
  if (window.isReCapthcaEnabled) {
    // reCaptchaComponent.value = (
    //   await import('../../../../components/ReCaptcha.vue')
    // ).default;
  }
});
</script>

<style lang="scss">
// @use '@assets/sass/settings' as *;

.register-popup__content {
  padding: rem(24px) 0;
}
.auth-popup__checkbox,
.auth-popup__remember-me,
.gdpr-label {
  margin-bottom: rem(16px);
  .checkbox-container {
    gap: rem(12px);
  }
  .input-checkbox {
    padding: 0;
    min-height: rem(12px);
  }
  .checkbox-label {
    font-size: rem(12px) !important;
    line-height: rem(14px) !important;
  }

  &--big-font {
    .checkbox-label {
      font-size: rem(14px) !important;
    }
  }
}

.auth-popup__submit-btn {
  margin-bottom: rem(12px);
  font-weight: 600;
  font-size: rem(14px);
  margin-top: rem(48px);
}
.auth-block {
  margin-bottom: rem(24px);
}
.agree-error {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  background-color: color(red-light2);
  padding: 8px;
  border-radius: 8px;
  &__text {
    font-size: 12px;
    line-height: 14px;
  }
}

.register-form__grecaptcha {
  .grecaptcha-badge {
    visibility: initial;
    position: initial;
  }
}
</style>
<style lang="scss">
#terms_gdpr {
  font-weight: 500;
}
</style>
