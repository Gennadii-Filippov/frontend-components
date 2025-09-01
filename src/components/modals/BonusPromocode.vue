<template>
  <Modal headerBorderBottom isMobileType :viewType="PopupView.Auto" :className="'bg-dark-gray-1 bonus-promocode-popup'">
    <template #title>
      <span class="promocode-title-popup">
        {{ _(Lang.Bonus) }}
      </span>
    </template>
    <template #content>
      <div class="promocode-container-popup">
        <a :href="viewLink" class="link-inherit promocode-container-popup__header">
          <div class="promocode-container-popup__name">
            <div class="promocode-container-popup__logo bg-white">
              <img v-if="iconSvg" loading="lazy" :src="asset(iconSvg)" :alt="bookName" />

              <img v-else-if="bonus?.img_icon_big" loading="lazy" :src="bonus?.img_icon_big" :alt="bookName" />
              <img v-else loading="lazy" :src="bonus?.img_icon" :alt="bookName" />
            </div>
          </div>

          <div v-if="bonus?.amount || bonus?.amount_text" class="bonus-card__cost">
            {{ amountText }}
          </div>
        </a>
        <div class="promocode-container-popup__bonus-name">
          {{ bonus?.name }}
        </div>
      </div>
    </template>
    <template #footer>
      <div class="promocode-footer-popup">
        <div class="promocode-footer-popup__buttons">
          <!-- <BonusPromocode
            goal="kartocka-bonusov-copy-promo-mob"
            v-if="bonus?.promocode"
            :promo-code="bonus?.promocode"
          />
          <BonusButton
            :object-seo-name="objectSeoName"
            :bonus="bonus"
            :not-partner-popup-trigger="notPartnerPopupTrigger"
            :reflink-url="reflinkUrl"
          /> 
          -->
        </div>
      </div>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { Lang } from '@/types/Lang';
import { asset } from '@/components/menu/utils';
import Modal from '@/components/UI/modal/index.vue';
import { PopupView } from '@/types/Popup';
// import BonusPromocode from '@/components/bonuses/components/BonusPromocode.vue';
// import BonusButton from '@/components/cards/components/BonusButton.vue';
import { inject } from 'vue';
import useModal from '@/composables/useModal';
import { TRANSLATION_KEY } from '@/types/injection-keys';
const _ = inject(TRANSLATION_KEY, (key: string) => key);
const route = inject<(name: string, params?: Record<string, any>) => string>('route', (key: string) => key);

const { currentModal } = useModal({ name: 'BonusPromocode' });

const { bonus, bookName, amountText, iconSvg, viewLink, notPartnerPopupTrigger, reflinkUrl, objectSeoName } =
  currentModal?.value?.options || {};
</script>

<style lang="scss">
@use '@assets/sass/settings' as *;

.bonus-promocode-popup.base-popup__inner {
  .base-popup__header.border-bottom-active {
    border-bottom: rem(1px) solid color(white-10);
  }

  .icon {
    color: color(white-60);
    &:before {
      color: color(white-60);
    }
  }
}

.promocode-title-popup {
  font-size: rem(20px);
  font-style: normal;
  font-weight: 700;
  line-height: rem(24px);
  color: color(white);
}

.promocode-container-popup {
  display: flex;
  flex-direction: column;
  gap: rem(16px);
  color: color(white);

  &__header {
    display: flex;
    gap: rem(8px);
    align-items: center;
  }

  &__logo {
    display: flex;
    align-items: center;
    min-width: rem(24px);
    width: rem(32px);
    height: rem(32px);
    border-radius: $elem-br;
    border: rem(2px) solid color(white);
    background-color: transparent;
    overflow: hidden;
    margin-right: 0;

    img {
      width: rem(32px);
      height: rem(32px);
    }
  }

  &__bonus-name {
    font-size: rem(16px);
    font-style: normal;
    font-weight: 400;
    line-height: rem(18px);
  }
}

.promocode-footer-popup {
  color: color(white);
  border-top: rem(1px) solid color(white-10);
  padding: rem(16px) rem(16px) rem(24px) rem(16px);

  &__buttons {
    display: flex;
    flex-direction: column;
    gap: rem(12px);
    position: relative;

    .button--promocode {
      font-size: rem(16px);
      font-weight: 600;
      line-height: rem(18px);
      padding: rem(10px) rem(12px);
      align-items: center;
      justify-content: center;
      border-radius: rem(8px);
    }

    .bonus-button {
      padding: rem(12px) rem(16px);
      border-radius: rem(8px);
      background: color(blue);
      color: color(white);
      font-size: rem(14px);
      font-weight: 600;
      line-height: rem(16px);
      &:active {
        background: color(blue-lighter);
      }
    }

    [data-tippy-root] {
      width: max-content !important;
      padding: rem(2px) rem(6px) rem(4px) !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      bottom: 77px !important;
    }

    .tippy-arrow {
      display: none;
    }
  }
}
</style>
