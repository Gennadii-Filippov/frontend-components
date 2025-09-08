<script setup lang="ts">
import { ref, inject } from 'vue';
import { PopupType } from '@/types/Popup';
import { TRANSLATION_KEY } from '@/types/injection-keys';
import { Lang } from '@/types/Lang';
import PopupLoader from '@/components/UI/modal/PopupLoader.vue';
import { Modal, useFormWithValidation, useModal, BaseButton, useGlobal, BaseInput } from '@/index';
import { ButtonType } from '@/components/UI/button/ButtonTypes';
import { ValidationRules } from '@/composables/formValidation/types';
import { PopupView } from '@/types/Popup';

const loading = ref(false);
const _ = inject(TRANSLATION_KEY, (key: string) => key);

enum PopupState {
  Success = 'success',
  Request = 'request',
}
const popupType = ref(PopupState.Request);

const message = ref('');

const { form, sendForm, errorsToShow, validateField, setInFocusValue } = useFormWithValidation([
  {
    name: '_email',
    value: '',
    rules: [
      {
        type: ValidationRules.Required,
        message: _(Lang.EnterYourLogin),
      },
      {
        type: ValidationRules.isEmail,
        message: _(Lang.EnterAValidEmailAddress),
      },
    ],
  },
]);

const { close, open } = useModal({ name: 'RecoveryPassport' });

const send = async () => {
  await sendForm({
    beforeSend: async () => {},
    send: useGlobal()?.get(PopupType.RecoverPassword)?.send,
    afterSend: async (response) => {
      if (response.status === 'success') {
        loading.value = false;
        message.value = `${_(Lang.ResetPassportSuccessMessage)} <span class='block-section__span'>${
          form?.values?._email ?? ''
        }</span><br> <br>`;
        popupType.value = PopupState.Success;
      }
    },
  });
};
</script>
<template>
  <div>
    <PopupLoader v-if="loading" name="RecoveryPassport" />
    <Modal :name="PopupType.RecoverPassword" v-else-if="!loading && popupType == PopupState.Request" :width="375">
      <template #title>
        <div class="reset-password-popup__title">
          {{ _(Lang.ResetPassword) }}
        </div>
      </template>
      <template #content>
        <form class="validator" method="post" id="reset-form" @submit.prevent="send">
          <div class="reset-password-popup">
            <div class="reset-password-popup__form-container">
              <div class="password-note no-padding-y border-none">
                <div class="password-note__wrap">
                  <i class="icon icon-circle-e"></i>
                  <p class="password-note__txt" v-html="_(Lang.ResetPassportLink)"></p>
                </div>
              </div>
              <BaseInput
                id="email"
                v-model="form.values._email"
                :label="_(Lang.Email)"
                name="username"
                :errors-form-with-validation="errorsToShow('_email')"
                @blur="validateField('_email')"
                @focus="setInFocusValue('_email', false)"
              />
            </div>
            <div class="reset-password-popup__button-container">
              <BaseButton class="button blue" type="submit" :buttonType="ButtonType.Blue">
                {{ _(Lang.ResetPassport) }}
              </BaseButton>
              <BaseButton
                class="button-close"
                @click="() => open({ name: 'auth', forceCloseAll: true })"
                :buttonType="ButtonType.Close"
              >
                {{ _(Lang.Cancel) }}
              </BaseButton>
            </div>
          </div>
        </form>
      </template>
    </Modal>
    <Modal
      v-else-if="!loading && popupType == PopupState.Success"
      :width="560"
      :headerBorderBottom="false"
      :viewType="PopupView.DinamicHeight"
      name="RecoveryPassportSuccess"
    >
      <template #content>
        <div class="reset-password-popup reset-password-popup--email-sended">
          <div class="block-section block-section-center desctop-no-padding-y block-section-send">
            <i class="icon icon-check"></i>
            <p class="resetting__subtitle">
              {{ _(Lang.ResetPassportEmailSended) }}
            </p>
            <div>
              <p class="block-section__txt">
                <span v-html="message"></span>
              </p>
            </div>
          </div>
          <div class="block-section footer">
            <BaseButton class="button blue" @click="() => close()" :buttonType="ButtonType.Blue">
              {{ _(Lang.Continue) }}
            </BaseButton>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>
<style scoped lang="scss">
.base-popup__content {
  padding: rem(24px) rem(16px);
}
.input-box {
  padding-top: rem(24px);
}

.reset-password-popup {
  width: 100% !important;
  &__button-container {
    display: flex;
    gap: rem(16px);
    padding-top: rem(16px);
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
.password-note {
  &__wrap {
    padding: rem(16px);
    display: flex;
    gap: rem(12px);
    border-radius: $block-br;
    border: 1px solid color(blue);
    .icon-circle-e {
      height: rem(24px);
      width: rem(24px);
      &::before {
        font-size: rem(24px);
        color: color(blue);
      }
    }
  }
  &__txt {
    font-weight: 400;
    font-size: rem(18px);
    line-height: rem(24px);
  }
}
.link {
  height: rem(48px);
  width: 100%;
  padding: rem(9px);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid color(blue-30);
  border-radius: $block-br !important;
  color: color(black-80);
}

.button,
.link {
  border-radius: $block-br !important;
  padding: rem(15px) rem(10px);
}
.block-section.footer {
  gap: 1rem;
}
.reset-password-popup,
.social-password-required {
  background: white;
  width: rem(375px);
  &:has(.icon-check) {
    width: rem(560px);
    @media (max-width: 743px) {
      height: 80vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
    }
  }
  @media (max-width: 743px) {
    width: 100%;
  }
  .header {
    font-weight: 600;
    height: rem(48px);
    @media (min-width: 744px) {
      height: rem(64px);
    }
  }
  &__title {
    font-weight: 700;
    color: color(black-80-hex);
    display: flex;
    height: 100%;
    align-items: center;
    font-size: rem(14px);
    line-height: rem(16px);
    @media ($md) {
      font-weight: 600;
      font-size: rem(16px);
      line-height: rem(18px);
    }
  }
  .light-background {
    line-height: 1.25rem;
  }
  .footer {
    display: flex;
    align-items: center;
  }
  .link {
    margin-left: auto;
  }
  .block-section__border-blue {
    padding: rem(16px);
    display: flex;
    gap: rem(12px);
    border-radius: rem(8px);
    border: 1px solid color(blue);
    .icon-circle-e {
      height: rem(24px);
      width: rem(24px);
      &::before {
        font-size: rem(24px);
        color: color(blue);
      }
    }
  }
  .block-section__txt {
    font-weight: 400;
    font-size: rem(14px);
    line-height: rem(20px);
    @media (min-width: 744px) {
      &.block-section__txt--desctop {
        font-size: rem(18px);
        line-height: rem(24px);
      }
    }
  }

  .block-section {
    padding: 1.5rem 1rem;
    border: none !important ;
    &--avatar {
      display: flex;
      padding-top: rem(16px);
      padding-bottom: rem(16px);
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: rem(24px);
      margin-bottom: rem(12px);
      .image {
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        background-image: linear-gradient(135deg, #3023ae, #c86dd7);
        text-align: center;
        color: color(white);
        font-size: 1.875rem;
        font-weight: 600;
        overflow: visible;
      }
    }
    &.header {
      padding: 1rem;
    }
    &.border-none {
      border: none !important;
    }
    &.no-padding-y {
      padding-bottom: 0;
      padding-top: 0;
    }
    &.block-section-send {
      padding-top: rem(71px);
      padding-bottom: rem(71px);
    }
    &.desctop-no-padding-y {
      @media screen and (min-width: 744px) {
        padding-bottom: 0;
        padding-top: 0;
      }
    }
    &-center {
      display: flex;
      flex-direction: column;

      .block-section__txt {
        font-size: rem(14px);
        line-height: rem(20px);
        text-align: center;

        @media (min-width: 744px) {
          font-size: rem(18px);
          line-height: rem(24px);
        }
      }
      .block-section__span {
        font-weight: 700;
      }
    }
    .resetting__subtitle {
      font-size: rem(18px);
      font-weight: 700;
      line-height: rem(24px);
      text-align: center;
      margin-bottom: rem(15px);
      @media (min-width: 744px) {
        margin-bottom: rem(16px);
      }
    }
    .icon-check {
      height: rem(72px);
      display: block;
      width: rem(72px);
      padding: 0;
      margin: 0 auto rem(15px);
      &::before {
        font-size: rem(72px);
        width: 100%;
        height: 100%;
        color: color(green);
      }
      @media (min-width: 744px) {
        margin: 0 auto rem(20px);
      }
    }
  }
  .footer {
    .button {
      height: rem(48px);
      font-size: rem(16px);
      line-height: rem(18px);
      width: 100%;
      border-radius: rem(8px);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: rem(15px) rem(10px);
      &.js-resetting-back-link {
        width: 100%;
      }
    }
    .link {
      height: rem(48px);
      width: 100%;
      padding: rem(9px);
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid color(blue-30);
      border-radius: $block-br;
      color: color(black-80);
    }
  }
}
</style>
<style lang="scss">
.reset-passport--popup {
  height: fit-content !important;
}
@media #{$md_max} {
  .reset-passport--popup {
    height: 100% !important;
  }
}
</style>
