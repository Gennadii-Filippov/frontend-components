<script setup lang="ts">
import { ref, inject } from 'vue';
import { PopupType } from '@/types/Popup';
import { TRANSLATION_KEY } from '@/types/injection-keys';
import BaseInput from '@/components/UI/inputs/Input.vue';
import { Lang } from '@/types/Lang';
import PopupLoader from '@/components/UI/modal/PopupLoader.vue';
import { Modal, useFormWithValidation } from '@/index';
import useModal from '@/composables/useModal';
import useGlobal from '@/composables/useGlobal';
import { ValidationRules } from '@/composables/formValidation/types';

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

const { close } = useModal({ name: 'RecoveryPassport' });

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
    <Modal
      :name="PopupType.RecoverPassword"
      v-else-if="!loading && popupType == PopupState.Request"
      :width="375"
      className="reset-passport--popup"
    >
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
              <div class="input-box">
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
            </div>
            <div class="reset-password-popup__button-container">
              <BaseButton class="button blue" type="submit" :value="_(Lang.ResetPassport)" />
              <BaseButton class="link" @click="close" :value="_(Lang.Cancel)" />
            </div>
          </div>
        </form>
      </template>
    </Modal>
    <Modal
      v-else-if="!loading && popupType == PopupState.Success"
      :width="560"
      :headerBorderBottom="false"
      className="reset-passport--popup"
    >
      <template #content>
        <div class="reset-password-popup">
          <div class="block-section block-section-center desctop-no-padding-y block-section-send">
            <i class="icon icon-check"></i>
            <p class="resetting__subtitle">
              {{ _(Lang.ResetPassportEmailSended) }}
            </p>
            <div>
              <p class="block-section__txt block-section__txt--desctop">
                <span v-html="message"></span>
              </p>
            </div>
          </div>
          <div class="block-section footer">
            <BaseButton class="button blue" @click="close">
              {{ _(Lang.Continue) }}
            </BaseButton>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>
<style scoped lang="scss">
@use '@assets/sass/settings' as *;
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
    gap: 16px;
    padding-top: 16px;
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
    font-size: rem(14px);
    line-height: rem(20px);
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
</style>
<style lang="scss">
@use '@assets/sass/settings' as *;
.reset-passport--popup {
  height: fit-content !important;
}
@media #{$md_max} {
  .reset-passport--popup {
    height: 100% !important;
  }
}
</style>
