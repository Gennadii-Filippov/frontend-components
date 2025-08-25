<template>
  <nav v-if="props.type === TabsMenuType.Default" class="tabs-menu">
    <div class="container">
      <ul class="tabs-menu__wrapper hide-scrollbar">
        <li
          v-for="tab in tabs"
          class="tabs-menu__item tabs__item"
          :class="{ active: tab.title === activeTab.title && activeTab.active }"
          :data-goal-click="tab.goal"
          @click="changeTab(tab)"
        >
          <span v-if="tab.icon" :class="`tabs-menu__item-icon icon icon-${tab.icon}`"></span>
          <span v-if="tab.title" class="tabs-menu__item-title">{{ tab.title }}</span>
          <span v-if="tab.count && tab.count > -1" class="count">&nbsp;{{ tab.count }}</span>
        </li>
      </ul>
    </div>
  </nav>
  <!-- <nav v-else-if="props.type === TabsMenuType.Swiper" class="tabs-menu">
    <Swiper
      @init="activeSlideHandler"
      @click="activeSlideHandler"
      class="swiper container"
      :modules="[Navigation]"
      :centered-slides="false"
      :centered-slides-bounds="true"
      :slides-per-view="'auto'"
      :speed="600"
      :free-mode="false"
      :navigation="{
        nextEl: '#tabs__next',
        prevEl: '#tabs__prev',
      }"
    >
      <SwiperSlide
        v-for="(tab, index) in tabs"
        :key="`${tab.title}_${index}`"
        :virtualIndex="`${tab.title}_${index}`"
        @click="changeTab(tab)"
        :class="{ active: tab.title === activeTab.title && activeTab.active }"
        :data-goal-click="tab.goal"
        class="tabs-menu__item tabs__item swiper-slide"
      >
        <span
          v-if="tab.icon"
          :class="`tabs-menu__item-icon icon icon-${tab.icon}`"
        ></span>
        <span v-if="tab.title" class="tabs-menu__item-title">{{
          tab.title
        }}</span>
        <span v-if="tab.count && tab.count > -1" class="count"
          >&nbsp;{{ tab.count }}</span
        >
      </SwiperSlide>
      <div class="swiper-nav">
        <div id="tabs__prev" class="tabs-prevback swiper-button-disabled">
          <div class="swiper-button-prev icon icon-left"></div>
        </div>
        <div id="tabs__next" class="tabs-nextback">
          <div class="swiper-button-next icon icon-right"></div>
        </div>
      </div>
    </Swiper>
  </nav> -->
  <ul v-else-if="props.type === TabsMenuType.Set" class="tabs-menu tabs-menu--set">
    <li v-for="tab in tabs" class="tabs-menu__li">
      <a
        class="tabs-menu__item tabs-menu__item--in-set"
        :class="{
          active: tab.title === activeTab.title && activeTab.active,
          'tabs-menu__item--no-img': !tab.img,
        }"
        :href="tab.path"
        :data-goal-click="tab.goal"
        @click="changeTab(tab)"
      >
        <img
          v-if="tab.img"
          width="24"
          height="24"
          class="tabs-menu__item-img lb-lazy"
          :src="asset(tab.img)"
          :data-src="asset(tab.img)"
          :alt="tab.title"
        />
        <span class="tabs-menu__item-title" v-text="tab.title" />
      </a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { asset } from '@/components/menu/utils';
import { Swiper, SwiperSlide } from 'swiper/vue';
// import { Navigation } from 'swiper';

export enum TabsMenuType {
  Default = 'default',
  Swiper = 'swiper',
  Set = 'set',
}

export type Tab = {
  active: boolean;
  title: string;
  icon?: string;
  img?: string;
  goal?: string;
  path?: string;
  count?: number;
};

interface Props {
  tabs: Tab[];
  modelValue?: Tab;
  type?: TabsMenuType;
}

const props = withDefaults(defineProps<Props>(), {
  type: TabsMenuType.Default,
});

const emit = defineEmits<{
  (e: 'update:modelValue', tab: Tab): void;
  (e: 'change', tab: Tab): void;
}>();

const activeTab = ref<Tab>(props.modelValue ?? props.tabs.find((t) => t.active) ?? props.tabs[0]);

watchEffect(() => {
  if (props.modelValue) {
    activeTab.value = props.modelValue;
  }
});

function changeTab(tab: Tab) {
  activeTab.value = tab;
  activeTab.value.active = true;
  emit('update:modelValue', tab);
  emit('change', tab);
}

function activeSlideHandler(swiper: typeof Swiper | any) {
  setTimeout(() => {
    const active = swiper.slides.filter((slide: HTMLElement) => slide.classList.contains('active'))[0];
    const activeIndex = swiper.slides.indexOf(active);

    if (!active) {
      return;
    }

    swiper.slideTo(activeIndex, 0);
    active.scrollIntoView();
  }, 100);
}
</script>

<style scoped lang="scss">
@use '/assets/sass/settings' as *;

.swiper {
  padding: 0 0.75rem;
  @media #{$md} {
    padding: 0;
  }
}
.tabs-menu__item {
  .count {
    color: rgba(0, 0, 0, 0.2);
  }
  &.active {
    .count {
      color: rgba(255, 255, 255, 0.4);
    }
  }
  &.swiper-slide {
    height: auto;
  }
}
</style>
