<template>
  <div ref="tabsContainer" v-if="tabs.length" :class="['line-tabs', $attrs.class]">
    <div class="line-tabs__start-mask"></div>
    <component
      v-for="(tab, index) in tabs"
      :key="index + tab.title"
      :class="['line-tabs__item', allTabsClasses ?? '', tab.classes ?? '', { active: tab.active }]"
      :is="tabTag"
      ref="tabRefs"
      :href="tab.href || undefined"
      v-bind="{
        ...(tab.attrs || {}),
      }"
      @click="setActive(tab, index)"
    >
      <span class="line-tabs__wrapper">
        <span v-if="tab.icon" class="line-tabs__item-icon icon" :class="'icon-' + tab.icon" />
        {{ tab.title || '' }}
      </span>

      <span v-if="tab.count !== undefined && tab.count >= 0" class="line-tabs__item-count">
        {{ tab.count }}
      </span>
    </component>
    <div class="line-tabs__end-mask"></div>
  </div>
</template>

<script lang="ts" setup>
import type { Tab } from './types';
import { onMounted, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    tabs: Tab[];
    classes?: string;
    tabTag?: string;
    allTabsClasses?: string;
  }>(),
  {
    classes: '',
    tabTag: 'a',
  }
);

const emits = defineEmits<{
  (e: 'change', tab: Tab): void;
}>();

const tabsContainer = ref<HTMLElement | null>(null);
const tabRefs = ref<(HTMLElement | null)[]>([]);

watch(
  () => props.tabs,
  () => {
    const activeTabIndex = props.tabs.findIndex((t) => t.active);
    if (activeTabIndex !== -1) {
      scrollToTab(activeTabIndex);
    }
  },
  { deep: true }
);

function setActive(tab: Tab, tabIndex: number) {
  props.tabs.forEach((t) => (t.active = false));
  tab.active = true;
  emits('change', tab);
  scrollToTab(tabIndex);
}

function scrollToTab(tabIndex: number) {
  const tabEl = tabRefs.value[tabIndex];
  if (!tabEl) return;
  tabEl.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center',
  });
}

onMounted(() => {
  if (!tabsContainer.value) return;
  tabsContainer.value.style.setProperty('--end-mask-position', `${tabsContainer.value.scrollWidth - 12}px`);
});
</script>

<style lang="scss" scoped>
// @use '@assets/sass/settings' as *;

.line-tabs {
  position: relative;
  display: flex;
  gap: rem(16px);
  box-shadow: inset 0 -1px 0 0 color(black-10);
  cursor: pointer;
  overflow-x: auto;
  scrollbar-width: none;
  margin: 0 rem(-12px);
  padding: 0 rem(12px);
  @media #{$md} {
    margin: 0;
    padding: 0;
    scrollbar-width: auto;
  }

  &__start-mask,
  &__end-mask {
    content: '';
    position: absolute;
    top: 0;
    width: rem(12px);
    height: 100%;
    border-bottom: 1px solid rgb(240, 241, 242);
    @media #{$md} {
      display: none;
    }
  }

  &__end-mask {
    left: var(--end-mask-position);
  }

  &__start-mask {
    left: 0;
  }

  .line-tabs__wrapper {
    padding: rem(16px) 0;
    display: flex;
    align-items: center;
    column-gap: rem(4px);
    @media #{$md} {
      padding: rem(24px) 0;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    column-gap: rem(4px);

    .icon {
      padding-left: rem(16px);
    }
  }

  &__item-count {
    color: color(black-40);
  }

  &__item.active {
    color: color(black-80);
    font-weight: 600;

    .line-tabs__wrapper {
      border-bottom: 1px solid color(black-80);
    }
  }
}
</style>
