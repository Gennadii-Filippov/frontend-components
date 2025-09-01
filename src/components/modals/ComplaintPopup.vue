<template>
  <Modal :width="768" :is-mobile-type="true">
    <template #title>
      <div class="complaint__title">
        <div class="complaint__info">
          <a :href="route(RouteName.Bookmakers)">
            <div class="avatar-wrapper">
              <img v-if="complaint.img_svg_icon" :src="asset(complaint.img_svg_icon)" alt="bookmaker" class="avatar" />
            </div>
          </a>
          <div class="info">
            <span class="name">{{ complaint.book_name }}</span>
            <span class="date">{{
              // DateWorker.humanizeDate(complaint.create_dt, 'blog')
            }}</span>
          </div>
        </div>
        <div class="complaint__additionally">
          <div class="complaint-sum d-none d-md-block" v-if="complaint.amount">
            {{ _(Lang.Amount) }}:
            <span class="complaint-sum__amount">{{ complaint.amount }} {{ complaint.currency_symbol }}</span>
          </div>
          <a class="complaint-comments" :href="route(RouteName.IntellComplaintShow, { id: complaint.id })">
            <div class="complaint-comments__icon icon icon-comments">
              <span class="complaint-comments__count"> {{ complaint.comments_count }}</span>
            </div>
          </a>
        </div>
      </div>
    </template>
    <template #content>
      <div class="complaint-description">
        <div :class="['label']">
          <div :class="['label-text', 'bg-' + complaint.status_color]">
            {{ complaint.status_text ?? '' }}
          </div>
        </div>
        <h2 class="complaint-title">
          <div class="complaint-title__link">
            {{ complaint.header ?? '' }}
          </div>
        </h2>
        <div class="complaint-sum d-inline-block d-md-none mb-3" v-if="complaint.amount">
          {{ _(Lang.Amount) }}:
          <span class="complaint-sum__amount">{{ complaint.amount }} {{ complaint.currency_symbol }}</span>
        </div>
        <div class="complaint-description__link">
          <p class="complaint-description__text" ref="cardText">
            {{ complaint.text }}
          </p>
          <div class="complaint-images" v-if="complaint.photo.length">
            <template v-for="(photo, index) in complaint.photo" :key="photo.path">
              <img
                class="complaint-image"
                :src="asset(photo.path)"
                alt="complaint image"
                v-if="index < 3 && photo.path && asset(photo.path)?.includes('https')"
              />
            </template>
          </div>
        </div>
        <div
          v-if="isSliderCard && textIsFull"
          class="complaint-show__more"
          @click="open({ name: PopupType.Complaint, options: { complaint } })"
        >
          {{ _(Lang.TheEntireText) }}
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { asset } from '@/components/menu/utils';
import Modal from '@/components/UI/modal/index.vue';
import { PopupParams, PopupType } from '@/types/Popup';
import { inject } from 'vue';
import { RouteName } from '@/types/RouteName';
import { Lang } from '@/types/Lang';
import useModal from '@/composables/useModal';
import { TRANSLATION_KEY } from '@/types/injection-keys';
const _ = inject(TRANSLATION_KEY, (key: string) => key);
const route = inject<(name: string, params?: Record<string, any>) => string>('route', (key: string) => key);

const { currentModal, open } = useModal({ name: 'ComplaintPopup' });

const complaint = currentModal?.value?.options?.params?.complaint;

// Controls for the "show more" link
const isSliderCard = true;
const textIsFull = !!complaint?.text && complaint.text.length > 0;
</script>

<style lang="scss" scoped>
@use '@assets/sass/settings' as *;
.complaint {
  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: rem(48px);
    margin-bottom: 0;
  }
  &__info {
    display: flex;
    gap: rem(12px);
    flex-direction: row;
    padding: 0;
    .avatar-wrapper {
      width: rem(32px);
      height: rem(32px);
      border-radius: 100%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .info {
      display: flex;
      flex-direction: column;
      gap: rem(4px);
      .name {
        font-size: rem(14px);
        line-height: rem(14px);
        font-weight: 600;
      }
      .date {
        color: color(black-40);
        font-weight: 400;
        font-size: rem(12px);
        line-height: rem(14px);
      }
    }
  }
  &__additionally {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: rem(24px);
    .complaint-comments {
      color: color(black-40);
      &__icon {
        font-size: rem(24px);
        display: flex;
        align-items: center;
        &:before {
          color: color(black-40);
          font-size: rem(24px);
          top: rem(-4px);
        }
      }
      &__count {
        font-weight: 400;
        font-size: rem(14px);
        line-height: rem(16px);
        margin-left: rem(4px);
      }
      &:hover {
        color: color(red-hover);
        .icon {
          &:before {
            color: color(red-hover);
          }
        }
      }
    }
  }
  &-description {
    max-height: rem(500px);
    &__link {
      font-weight: 400;
      font-size: rem(14px);
      line-height: rem(20px);
    }
    .label {
      margin-bottom: rem(8px);
      height: rem(20px);
      &-text {
        padding: rem(3px) rem(4px);
        color: color(white);
        font-weight: 400;
        font-size: rem(12px);
        line-height: rem(14px);
        text-transform: uppercase;
        border-radius: $elem-br;
        white-space: nowrap;
        display: inline-block;
      }
    }
  }
  &-images {
    margin-top: rem(16px);
    display: flex;
    flex-wrap: wrap;
    gap: rem(8px);
  }
  &-image {
    max-height: rem(280px);
    object-fit: contain;
  }
  &-title {
    margin-bottom: rem(12px);
    font-size: rem(16px);
    line-height: rem(18px);
    &__link {
      font-weight: 600;
      &:hover {
        color: inherit;
      }
    }
    @media #{$lg_max} {
      margin-bottom: rem(8px);
    }
  }
  &-sum {
    font-weight: 400;
    font-size: rem(14px);
    line-height: rem(16px);
    padding: rem(4px) rem(8px);
    background: color(light);
    border-radius: $elem-br;
    display: inline-block;
    .complaint-sum__amount {
      font-weight: 600;
      margin-left: rem(4px);
    }
  }
}
</style>
