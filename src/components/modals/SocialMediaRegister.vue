<template>
  <PopupLoader v-if="loading" />
  <Modal
    v-else-if="!loading"
    ref="basePopupRef"
    :width="375"
    withoutHeader
    :viewType="PopupView.DinamicHeight"
    disableClickOutside
    :name="PopupType.SocialMediaRegister"
  >
    <template #content>
      <form @submit.prevent="send">
        <div class="social-register-popup">
          <div class="social-register-popup__title">
            <span class="heading">
              {{ _(Lang.RegistrationCompletion) }}
            </span>
            <div class="close-popup" @click="goBack">
              <i class="icon icon-cross"></i>
            </div>
          </div>
          <div class="social-register-popup__form-container">
            <div class="input-box">
              <BaseInput
                id="username"
                :label="_(Lang.UserName) + '*'"
                :name="'username'"
                @blur="validateField('username')"
                @focus="setInFocusValue('username', false)"
                v-model="form.values.username"
                :errorsFormWithValidation="errorsToShow('username')"
              />
              <BaseInput
                :type="InputType.Email"
                id="email"
                :label="_(Lang.Email) + '*'"
                :name="'email'"
                @blur="validateField('email')"
                @focus="setInFocusValue('email', false)"
                v-model="form.values.email"
                :errorsFormWithValidation="errorsToShow('email')"
                :disabled="!!params.data.email"
              />
            </div>
            <div class="social-register-popup__checkbox-container">
              <div class="social-register-popup__notice-bonus">
                <BaseCheckbox
                  id="notice_bonus"
                  v-model="form.values.noticeBonus"
                  :labelHtml="_(Lang.GetMostInterestingFromSiteOnEmail)"
                  @change="setInFocusValue('notice_bonus', false)"
                />
              </div>
              <div v-if="ageLocales.includes(locale)" class="social-register-popup__age-limit">
                <BaseCheckbox
                  id="age_limit"
                  v-model="form.values.ageLimit"
                  :labelHtml="_(Lang.ConfirmAge)"
                  :errors="errorsToShow('ageLimit')"
                  @change="setInFocusValue('ageLimit', false)"
                />
              </div>
              <div v-if="idPath[locale]" class="social-register-popup__rules">
                <div :class="checkboxConfig.class">
                  <BaseCheckbox
                    id="rules"
                    v-model="form.values.personalDataPolicy"
                    :labelHtml="checkboxConfig.text"
                    :errors="errorsToShow('personalDataPolicy')"
                    @change="setInFocusValue('personalDataPolicy', false)"
                  />
                </div>
              </div>
              <div v-if="error" class="social-register-popup__error">
                <div class="icon icon-circle-e c-red"></div>
                <span>{{ error }}</span>
              </div>
            </div>
          </div>
          <div class="social-register-popup__button-container">
            <input class="button blue" type="submit" :value="_(Lang.Register)" />
          </div>
        </div>
      </form>
    </template>
  </Modal>
</template>
<!--TODO: проверить на вывод ошибок в модалке! В чекбоксах есть проверка isChecked, но нет текста ошибки. Видимо просто красным выделить чекбокс без текста ошибки-->
<script setup lang="ts">
import { idPath } from '@/components/auth/helper';
import { ref, computed } from 'vue';
import { Modal } from '@/index';
import { PopupParams, PopupType } from '@/types/Popup';
import BaseInput from '../common/inputs/BaseInput.vue';
import { Lang } from '@/types/Lang';
import PopupLoader from '../common/popups/PopupLoader.vue';
import { JsonObject } from '@/types/JsonValue';
import { InputType } from '@/components/UI/inputs/types';
import { useFormWithValidation, useConfig, BaseCheckbox, useModal } from '@/index';
import { FieldConfig, ValidationRules } from '@/composables/formValidation/types';
import { localeIn } from '@/components/auth/checkLocale';
import { Locale } from '@/types/Locale';
import { PopupView } from '@/types/Popup';
import { inject } from 'vue';
import { TRANSLATION_KEY } from '@/types/injection-keys';

type SocialMediaRegisterFields = {
  username: string;
  email: string;
  noticeBonus: boolean;
  personalDataPolicy: boolean;
  ageLimit?: boolean;
};

const props = defineProps<{
  back: (data: { uid: string; hash: string }) => void;
  sendSocialRegisterRequest: (data: any) => void;
}>();

const route = inject('route', (key: string) => key);
const _ = inject(TRANSLATION_KEY, (key: string) => key);
// TODO: переписать под общий вид - сначала будет в nuxt (assets/vue/components/popups/auth/helper.ts уже есть вариант реализации)
const ageLocales = [Locale.ES, Locale.GB, Locale.CZ, Locale.RS];
const sngLocales = ['ru', 'kk', 'by', 'tj'];
const cookieLocales = ['ie', 'ug', 'ke', 'gh', 'ng', 'us', 'au', 'gb', 'pt', 'pl', 'rs'];
const cookieAgeLocales = ['br', 'dk', 'se'];

const params = useModal({ name: PopupType.SocialMediaRegister }).currentModal.value
  ?.options as PopupParams[PopupType.SocialMediaRegister];

const fields: FieldConfig<SocialMediaRegisterFields>[] = [
  {
    name: 'username',
    value: params.data?.username ?? '',
    rules: [
      {
        type: ValidationRules.Required,
        message: _(Lang.EnterYourLogin),
      },
      {
        type: ValidationRules.MaxLength,
        value: 30,
        message: _(Lang.FromToCharacters),
      },
      {
        type: ValidationRules.MinLength,
        value: 6,
        message: _(Lang.FromToCharacters),
      },
      {
        type: ValidationRules.isLatinDigitsDot,
        message: _(Lang.OnlyLettersNumbersPeriods),
      },
    ],
  },
  {
    name: 'email',
    value: params.data?.email ?? '',
    rules: [
      {
        type: ValidationRules.Required,
        message: _(Lang.IncorrectEmailAddress),
      },
      {
        type: ValidationRules.MaxLength,
        value: 72,
        message: _(Lang.EmailMustBeNoMore),
      },
      {
        type: ValidationRules.isEmailHard,
        message: _(Lang.IncorrectEmailAddress),
      },
    ],
  },
  {
    name: 'noticeBonus',
    value: false,
    rules: [],
  },
  {
    name: 'personalDataPolicy',
    value: false,
    rules: [
      {
        type: ValidationRules.Required,
        message: '',
      },
    ],
  },
];
if (localeIn(ageLocales)) {
  fields.push({
    name: 'ageLimit',
    value: false,
    rules: [
      {
        type: ValidationRules.Required,
        message: '',
      },
    ],
  });
}
const { form, validateField, setInFocusValue, errorsToShow, sendForm, loading } = useFormWithValidation(fields);

const locale = useConfig().get('locale') as Locale;

const error = ref<string | null>(null);

function goBack(): void {
  props?.back({ uid: params.data.uid, hash: params.data.hash });
  // $.ajax({
  //   url: route(RouteName.RemoveUserAfterRegister),
  //   type: RequestType.Post,
  //   data: createFormData({ uid: params.data.uid, hash: params.data.hash }),
  //   success() {
  //     basePopupRef.value?.closePopupEvent();
  //     return true;
  //   },
  // });
}
function setTextForCheckbox(typeText: string) {
  switch (typeText) {
    case 'SNG':
      return __(Lang.ConfirmDataForSNG, [
        `<a class="link" target="_blank" href="${route(idPath[locale]['gdpr'])}">`,
        '</a>',
        `<a class="link" target="_blank" href="${route(idPath[locale]['privacy_policy'])}">`,
        '</a>',
        `<a class="link" target="_blank" href="${route(idPath[locale]['personal_data_policy'])}">`,
        '</a>',
      ]);
    case 'cookie':
      return __(Lang.IAcceptCookies, [
        `<a class="link" target="_blank" href="${route(idPath[locale]['gdpr'])}">`,
        '</a>',
        `<a class="link" target="_blank" href="${route(idPath[locale]['privacy_policy'])}">`,
        '</a>',
        `<a class="link" target="_blank" href="${route(idPath[locale]['cookie_policy'])}">`,
        '</a>',
      ]);
    case 'cookie and age':
      return __(Lang.ConfirmAgeCookie, [
        `<a class="link" target="_blank" href="${route(idPath[locale]['gdpr'])}">`,
        '</a>',
        `<a class="link" target="_blank" href="${route(idPath[locale]['privacy_policy'])}">`,
        '</a>',
        `<a class="link" target="_blank" href="${route(idPath[locale]['cookie_policy'])}">`,
        '</a>',
      ]);
    case 'another':
      return __(Lang.IAcceptAfterRegister, [
        `<a class="link" target="_blank" href="${route(idPath[locale]['gdpr'])}">`,
        '</a>',
        `<a class="link" target="_blank" href="${route(idPath[locale]['privacy_policy'])}">`,
        '</a>',
      ]);
  }
}
const send = async () => {
  await sendForm({
    beforeSend: async (formData: FormData) => {
      formData.set('hash', params.data.hash);
      formData.set('uid', params.data.uid);
      //на проде ageLimit и noticeBonus передаются всегда, если true. На всякий случай удаляю
      if (!form.values.noticeBonus) formData.delete('noticeBonus');
      if (!form.values.ageLimit) formData.delete('ageLimit');
    },
    send: async (formData: FormData): Promise<JsonObject | null> => {
      return props.sendSocialRegisterRequest(formData);
    },
  });
};
const checkboxConfig = computed(() => {
  if (sngLocales.includes(locale)) {
    return {
      class: 'social-register-popup__sng',
      text: setTextForCheckbox('SNG'),
    };
  }
  if (cookieLocales.includes(locale)) {
    return {
      class: 'social-register-popup__cookie-locales',
      text: setTextForCheckbox('cookie'),
    };
  }
  if (cookieAgeLocales.includes(locale)) {
    return {
      class: 'social-register-popup__cookie-age-locales',
      text: setTextForCheckbox('cookie and age'),
    };
  }
  return {
    class: 'social-register-popup__another',
    text: setTextForCheckbox('another'),
  };
});
</script>

<style scoped lang="scss">
@use '@assets/sass/settings' as *;

.social-register-popup__title {
  display: flex;

  .close-popup {
    margin-left: auto;
    height: rem(24px);
    width: rem(24px);
    cursor: pointer;
  }
}

.icon {
  color: color(black-40);
  height: rem(24px);
  width: rem(24px);
  cursor: pointer;

  &:before {
    font-size: rem(24px);
    line-height: rem(24px);
    height: rem(24px);
    width: rem(24px);
  }
}
.social-register-popup {
  display: flex;
  flex-direction: column;
  &__title {
    width: 100%;
    text-align: center;
    font-size: rem(20px);
    line-height: rem(24px);
    font-weight: 700;
  }
  &__form-container {
    display: flex;
    flex-direction: column;
    padding: rem(24px) 0;
    .input-box {
      display: flex;
      flex-direction: column;
    }
  }
  &__rules {
    display: flex;
    flex-direction: column;
    gap: rem(16px);
  }
  &__checkbox-container {
    display: flex;
    flex-direction: column;
    gap: rem(16px);
  }
  &__button-container {
    width: 100%;
    padding: rem(16px) 0;
    .button {
      width: 100%;
      height: rem(48px);
      border-radius: rem(8px);
    }
  }
  &__error {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: rem(8px) rem(12px) rem(8px) rem(8px);
    background-color: #feeded;
    border-radius: 8px;
    gap: rem(6px);
    font-size: rem(12px);
    color: color(black-80);
    .icon {
      cursor: default;
    }
  }
}
</style>
