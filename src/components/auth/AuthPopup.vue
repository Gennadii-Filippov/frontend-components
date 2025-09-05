<template>
  <Modal
    name="auth"
    className="auth-popup-inner"
    :width="375"
    :headerBorderBottom="false"
    :viewType="PopupView.DinamicHeight"
    paddingHeader="16px"
    :paddingsContent="{
      top: '24px',
      bottom: '24px',
      right: '16px',
      left: '16px',
    }"
  >
    <template #title>
      <div class="reg-auth-popup__header">
        <div
          :class="['reg-auth-popup__title', { 'reg-auth-popup__title--active': activeTab === Tabs.Auth }]"
          @click="setTab(Tabs.Auth)"
        >
          {{ _(Lang.Login) }}
        </div>
        <div
          :class="[
            'reg-auth-popup__title',
            {
              'reg-auth-popup__title--active': activeTab === Tabs.Registration,
            },
          ]"
          @click="setTab(Tabs.Registration)"
        >
          {{ _(Lang.Registration) }}
        </div>
      </div>
    </template>
    <template #content>
      <div class="auth-popup__content">
        <AuthRegistrationContent
          :noteType="params?.noteType"
          :removeErrorText="removeErrorText"
          :addErrorText="addErrorText"
          :note="note"
        />
        <AuthForm v-show="activeTab == Tabs.Auth" :messageClass="messageClass" :socialErrorText="socialErrorText" />
        <RegistrationForm
          v-show="activeTab == Tabs.Registration"
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
import AuthRegistrationContent from './AuthRegistrationContent.vue';
import AuthForm from './AuthForm.vue';
import RegistrationForm from './RegistrationForm.vue';
import { Tabs } from './types';
import { Lang } from '@/types/Lang';
import { ref } from 'vue';
import { PopupParams, PopupType } from '@/types/Popup';
import { inject } from 'vue';
import { TRANSLATION_KEY } from '@/types/injection-keys';
import { useModal, Modal } from '@/index';
import { PopupView } from '@/types/Popup';

const { currentModal } = useModal({ name: 'auth' });

const _ = inject(TRANSLATION_KEY, (key: string) => key);

const params = currentModal?.value?.options as PopupParams[PopupType.Auth];
const activeTab = ref<Tabs>(!params ? Tabs.Auth : params?.isLogin ? Tabs.Auth : Tabs.Registration);
const messageClass = ref('');
const socialErrorText = ref('');
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
</script>

<style lang="scss">
@use './styles.scss' as *;
</style>
