<template>
  <PopupLoader v-if="loading" name="Subscriptions" />
  <Modal
    v-if="users"
    :name="PopupType.Subscriptions"
    :width="768"
    :viewType="popupType"
    :height="465"
    isMobileType
    headerBorderBottom
  >
    <template #title>
      <div class="subscriptions-popup__title">
        {{ popupData?.type === SubscriptionPopupType.Followers ? _(Lang.Followers) : _(Lang.Subscriptions) }}
      </div>
    </template>
    <template #content>
      <div class="subscriptions-popup__content">
        <UserBox
          v-for="user in users"
          :id="user?.id ?? 0"
          :username="user?.username ?? ''"
          :avatar="user?.avatar ?? ''"
          :key="user?.id"
        />
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import Modal from '@/components/UI/modal/index.vue';
import { Lang } from '@/types/Lang';
import UserBox from '@/components/UI/UserBox.vue';
import { PopupParams, PopupType, SubscriptionPopupType } from '@/types/Popup';
import { User } from '@/types/User';
import PopupLoader from '@/components/UI/modal/PopupLoader.vue';
import { PopupView } from '@/types/Popup';
import { ScreenSize } from '@/types/ScreenSize';
import useModal from '@/composables/useModal';
import { TRANSLATION_KEY } from '@/types/injection-keys';

const { currentModal } = useModal({ name: 'Subscriptions' });
const _ = inject(TRANSLATION_KEY, (key: string) => key);

// Params passed when opening the modal
const popupData = (currentModal?.value?.options as { params?: PopupParams[PopupType.Subscriptions] })?.params;

// Users list may be provided via params (non-typed extension) or fetched elsewhere.
// Default to an empty array to satisfy template typing.
const users = ref<Array<User>>(((popupData as any)?.users as User[] | undefined) ?? []);

const loading = ref(false);

const popupType = window.innerWidth <= ScreenSize.MD ? PopupView.FullHeightWithoutHeader : PopupView.CustomHeight;
</script>

<style lang="scss" scoped>
@use '@assets/sass/settings' as *;

.subscriptions-popup {
  &__content {
    display: flex;
    flex-direction: column;
    gap: rem(16px);
    @media #{$md} {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      column-gap: rem(60px);
      row-gap: rem(24px);
    }
  }
}
</style>
