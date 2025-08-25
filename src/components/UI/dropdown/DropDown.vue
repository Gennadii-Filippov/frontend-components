<template>
  <div ref="dropdown" class="dropdown">
    <div @click="toggleList" :class="['dropdown__select-now icon icon-down', { active: showList }]">
      {{ activeItem.label }}
    </div>
    <div @click="toggleList" ref="dropdownList" :class="['dropdown__list', { show: showList }]">
      <a
        @click.stop="onSelect(item)"
        :class="[{ active: item.label == activeItem.label }, 'dropdown__select']"
        v-for="(item, index) in data"
        :href="item.link ?? 'javascript:void(0)'"
        :key="item.label + index"
      >
        {{ item.label }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';

export type DropdownItem = {
  label: string;
  tourId?: number;
  active: boolean;
  link: string;
};

import { WebEvent } from '@/types/WebEvent';
import { usePerfectScrollbar } from '@/composables/usePerfectScrollbar';

const showList = ref(false);
const dropdown = ref<HTMLElement | null>(null);
const dropdownList = ref<HTMLElement | null>(null);

const props = defineProps<{
  data: DropdownItem[];
  addScroll?: boolean;
}>();

const emit = defineEmits<{
  (event: 'onSelect', index: DropdownItem): void;
}>();

const activeItem = ref(props.data.find((item) => item.active) || props.data[0]);
watch(
  () => props.data,
  (newData) => {
    activeItem.value = newData.find((item) => item.active) || newData[0];
  }
);
function toggleList() {
  showList.value = !showList.value;
}

function handleClickOutside(event: MouseEvent) {
  if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
    showList.value = false;
  }
}

function onSelect(item: DropdownItem) {
  emit('onSelect', item);
  toggleList();
  activeItem.value = item;
}

onMounted(() => {
  document.addEventListener(WebEvent.Click, handleClickOutside);

  if (props.addScroll && dropdownList.value) {
    usePerfectScrollbar(dropdownList, showList);
  }
});

onUnmounted(() => {
  document.removeEventListener(WebEvent.Click, handleClickOutside);
});
</script>

<style lang="scss">
// @use '@assets/sass/settings' as *;

.dropdown {
  min-width: rem(72px);
  margin-right: 0;
  height: rem(32px);
  z-index: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  font-weight: 400;
  cursor: pointer;
  top: auto;
  right: auto;
  $this: &;

  &__select-now {
    min-width: rem(118px);
    padding: rem(8px) rem(34px) rem(8px) rem(12px);
    background: color(light);
    border-radius: $elem-br;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    &::before {
      position: absolute;
      top: rem(8px);
      right: rem(8px);
      left: auto;
      color: color(black-40);
      transition: 0.5s;
    }
    &.active::before {
      transform: rotate(180deg);
    }
  }

  &__list {
    width: 100%;
    display: none;
    flex-direction: column;
    opacity: 0;
    position: absolute;
    background-color: color(white);
    box-shadow: 0 rem(9px) rem(14px) color(black-10);
    border-radius: $elem-br;
    padding-top: rem(4px);
    top: rem(32px);
    z-index: 1;
    &.show {
      opacity: 1;
      display: flex;
    }
    #{$this}__select {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      background-color: color(white);
      padding: rem(8px) rem(16px);
      cursor: pointer;
      transition: 0.5s;
      z-index: 1;
      &:first-child {
        margin-top: rem(4px);
      }
      &:last-child {
        margin-bottom: rem(4px);
      }
      &.active {
        background-color: color(light);
      }
      &:hover {
        background-color: color(brand-color);
        color: color(white);
      }
    }
  }

  &--gray-background {
    #{$this}__select-now {
      background: color(black-5);
    }
  }

  &--in-content {
    #{$this}__select-now {
      background: color(light);
    }
  }

  &--min-width {
    min-width: rem(230px);
    width: 100%;

    @media #{$md} {
      width: auto;
    }

    #{$this}__select-now {
      width: 100%;
    }
  }

  &--min-width-md-unset {
    @media #{$md_max} {
      min-width: unset;
    }
  }

  &--max-height {
    .ps__rail-y {
      z-index: 1000;
    }
    #{$this}__list {
      max-height: rem(328px);
      overflow: hidden;
    }
  }
}
</style>
