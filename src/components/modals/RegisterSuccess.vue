<template>
  <Modal ref="basePopupRef" :width="536" :headerBorderBottom="false" :viewType="PopupView.DinamicHeight" withoutHeader>
    <template #content>
      <div class="register-success">
        <div class="register-success__close-btn icon icon-cross" @click="() => close()"></div>
        <div class="block-section block-section-center">
          <i class="icon icon-check"></i>
          <p class="resetting__subtitle">{{ _(Lang.SuccessRegister) }}</p>
          <div>
            <p class="block-section__txt">
              <span v-html="_(Lang.ConfirmEmail)"></span>
              <span class="block-section__span">{{ currentModal?.options?.email }}</span>
            </p>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { TRANSLATION_KEY } from '@/types/injection-keys';
import { Lang } from '@/types/Lang';
import { ref } from 'vue';
import { Modal } from '@/index';
import { inject } from 'vue';
import useModal from '@/composables/useModal';
import { PopupView } from '@/types/Popup';

const { currentModal, close } = useModal({ name: 'RegisterSuccess' });
const _ = inject(TRANSLATION_KEY, (key: string) => key);
// TODO: дизайнер в отпуске до 4 сентября. Уточнить по поводу крестиков - модалка по сути без хедера, а отступы крестика от краёв модалки в макете больше обычного
interface BasePopupMethod {
  closePopupEvent: () => void;
}
const basePopupRef = ref<BasePopupMethod | null>(null);
</script>

<style scoped lang="scss">
.register-success {
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 100%;
  &__close-btn {
    right: rem(24px);
    position: absolute;
    top: rem(24px);
    color: color(black-40);
    height: rem(24px);
    width: rem(24px);
    cursor: pointer;
    z-index: 2;
    &::before {
      font-size: rem(24px);
      line-height: rem(24px);
      height: rem(24px);
      width: rem(24px);
    }
  }
  .block-section {
    padding: 0;
    &-center {
      display: flex;
      flex-direction: column;
      .block-section__txt {
        text-align: center;
        font-weight: 400;
        font-size: rem(14px);
        line-height: rem(20px);
        @media (min-width: 744px) {
          font-size: rem(18px);
          line-height: rem(24px);
        }
      }
      .block-section__span {
        font-weight: 700;
        &::before {
          content: ' ';
        }
      }
    }
    .resetting__subtitle {
      font-size: rem(18px);
      font-weight: 700;
      line-height: rem(24px);
      text-align: center;
      margin-bottom: rem(16px);
    }
    .icon-check {
      height: rem(72px);
      display: block;
      width: rem(72px);
      padding: 0;
      margin: 0 auto rem(8px);
      &::before {
        font-size: rem(72px);
        width: 100%;
        height: 100%;
        color: color(green);
      }
    }
  }
}
</style>
