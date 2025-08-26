<template>
  <ModalLoader v-if="loading && activeTab == Tabs.Registration" name="auth-loader" />
  <Modal
    name="auth"
    className="auth-popup-inner"
    :width="375"
    :headerBorderBottom="false"
    :viewType="popupViewType"
    paddingHeader="16px"
    :paddingsContent="{
      top: '24px',
      bottom: '24px',
      right: '16px',
      left: '16px',
    }"
  >
    <template #title>
      <AuthRegisterHeader :activeTab="activeTab" @setTab="setTab" />
    </template>
    <template #content>
      <div class="auth-popup__content">
        <AuthRegistrationContent
          :noteType="params?.noteType"
          :removeErrorText="removeErrorText"
          :addErrorText="addErrorText"
          :note="note"
        />
        <AuthForm v-if="activeTab == Tabs.Auth" :messageClass="messageClass" :socialErrorText="socialErrorText" />
        <RegistrationForm
          v-else
          :isLogin="params?.isLogin"
          :messageClass="messageClass"
          :socialErrorText="socialErrorText"
          :token="regToken"
        />
      </div>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import Modal from '../UI/modal/index.vue';
import AuthRegistrationContent from './AuthRegistrationContent.vue';
import AuthForm from './AuthForm.vue';
import AuthRegisterHeader from './AuthRegisterHeader.vue';
import RegistrationForm from './RegistrationForm.vue';
import { Tabs } from './types';
import { onMounted, ref } from 'vue';
import { PopupParams, PopupType } from '@/types/Popup';
import ModalLoader from '@/components/UI/modal/PopupLoader.vue';
import { WebEvent } from '@/types/WebEvent';
import { calcPopupViewType } from '@/utils';
import { inject } from 'vue';
import { TRANSLATION_KEY } from '@/types/injection-keys';
import useModal from '@/composables/useModal';

const { currentModal } = useModal({ name: 'auth' });

const _ = inject(TRANSLATION_KEY, (key: string) => key);
const route = inject('route', (key: string) => key);
const loading = ref(false);

const params = currentModal?.value?.options as PopupParams[PopupType.Auth];
const activeTab = ref<Tabs>(!params ? Tabs.Auth : params?.isLogin ? Tabs.Auth : Tabs.Registration);
const messageClass = ref('');
const socialErrorText = ref('');
const popupViewType = ref(calcPopupViewType());
const regToken = ref('');
const note = ref('');

function removeErrorText() {
  messageClass.value = '';
  socialErrorText.value = '';
}
function addErrorText(message: string, text: string) {
  messageClass.value = message;
  socialErrorText.value = text;
}
function setTab(tab: Tabs) {
  removeErrorText();
  activeTab.value = tab;
}

onMounted(() => {
  window.addEventListener(WebEvent.Resize, () => {
    popupViewType.value = calcPopupViewType();
  });
});
</script>

<style lang="scss">
// @use '@assets/sass/settings' as *;
.auth-popup__checkbox-description {
  cursor: pointer;
}

.auth-popup__submit-btn {
  margin-bottom: rem(24px);
}
.forgot-password {
  font-weight: 600;
  font-size: rem(14px);
  line-height: rem(16px);
  width: 100%;
  text-align: center;
}
.auth-popup__content {
  padding-top: rem(8px);
  @media #{$md} {
    padding-top: 0;
  }
}
</style>
