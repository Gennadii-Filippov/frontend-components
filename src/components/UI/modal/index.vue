<script setup lang="ts">
import { useModal, useDevice } from '@/index';
import { computed, onBeforeUnmount, onMounted, ref, Transition, toRefs, watch } from 'vue';
import PerfectScrollbar from 'perfect-scrollbar';
import { WebEvent } from '@/types/WebEvent';
import { calcPopupViewType } from '@/utils';
import { PopupView } from '@/types/Popup';
const { isMobile } = useDevice();
const props = withDefaults(
  defineProps<{
    height?: string | number;
    width?: string | number;
    headerBorderBottom?: boolean;
    isMobileType?: boolean; //Тип модалки
    usePerfectScrollbar?: boolean;
    shadow?: boolean;
    className?: string;
    name: string;
    viewType?: PopupView;
    ariaLabelledby?: string;
    ariaDescribedby?: string;
    offsetSelector?: string; // CSS selector to measure offset element height
    offsetPx?: number; // Explicit offset in px (takes precedence)
  }>(),
  {
    width: 'auto',
    headerBorderBottom: true,
    viewType: PopupView.FullHeightWithoutHeader,
    usePerfectScrollbar: true,
    shadow: true,
  }
);
// expose selected props and computed wrappers for template binding
const { shadow, ariaLabelledby, ariaDescribedby } = toRefs(props);
const hasShadow = computed(() => !!shadow.value);
const ariaLabelledbyId = computed(() => ariaLabelledby.value);
const ariaDescribedbyId = computed(() => ariaDescribedby.value);
const viewType = ref(props.viewType);

const { isOpen, close } = useModal({
  ...props,
});

const popupInnerStyles = computed(() => ({
  '--width': typeof props.width === 'number' ? `${props.width}px` : props.width,
}));

const popupWrapper = ref<HTMLElement | null>(null);
const popupHeader = ref<HTMLElement | null>(null);
const popupFooter = ref<HTMLElement | null>(null);
const popupContent = ref<HTMLElement | null>(null);
const popupInner = ref<HTMLElement | null>(null);
// PS instance to prevent multiple initializations
const psInstance = ref<PerfectScrollbar | null>(null);
//Нужна для предотвращения скролла боди
let scrollDistance = 0;

let resizeRaf = 0;
const onResize = () => {
  if (resizeRaf) cancelAnimationFrame(resizeRaf);
  resizeRaf = requestAnimationFrame(() => {
    viewType.value = calcPopupViewType();
    setPopupInnerHeight();
    setUpPopupElements();
  });
};

onMounted(() => {
  scrollDistance = window.scrollY;
  setPopupInnerHeight();
  window.addEventListener(WebEvent.Resize, onResize);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', onResize);
  }
  if (props.isMobileType && isMobile.value) {
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.top = `-${scrollDistance}px`;
    document.body.classList.add('base-popup-in');
    document.body.style.paddingRight = `${window?.innerWidth - document.documentElement.clientWidth}px`;
  }

  setUpPopupElements();
});

onBeforeUnmount(() => {
  if (props.isMobileType && isMobile.value) {
    document.body.classList.remove('base-popup-in');
    document.body.style.top = '';
    document.body.style.paddingRight = '0px';
    document.documentElement.style.scrollBehavior = '';
    scrollTo({ top: scrollDistance });
  }
  window.removeEventListener(WebEvent.Resize, onResize);
  if (window.visualViewport) {
    window.visualViewport.removeEventListener('resize', onResize);
  }
  if (psInstance.value) {
    psInstance.value.destroy();
    psInstance.value = null;
  }
});

function waitForElementReady(element: HTMLElement, timeout = 1000): Promise<HTMLElement> {
  return new Promise((resolve) => {
    if (element.offsetHeight > 0 || element.offsetWidth > 0) {
      resolve(element);
      return;
    }

    const startTime = Date.now();
    const checkElement = () => {
      if (element.offsetHeight > 0 || element.offsetWidth > 0) {
        resolve(element);
      } else if (Date.now() - startTime < timeout) {
        requestAnimationFrame(checkElement);
      } else {
        console.warn('Element ready timeout, proceeding anyway');
        resolve(element);
      }
    };

    requestAnimationFrame(checkElement);
  });
}

function setPopupInnerHeight() {
  const vv = window.visualViewport;
  const kbOverlap = vv ? Math.max(0, window.innerHeight - vv.height - (vv.offsetTop || 0)) : 0;
  popupContent.value?.style.setProperty('--kb-overlap', `${kbOverlap}px`);

  switch (viewType.value) {
    case PopupView.Fullscreen:
      popupInner.value?.style.setProperty('--height', '100dvh');
      break;
    case PopupView.FullHeightWithoutHeader:
      let offset = 0;
      if (typeof props.offsetPx === 'number') {
        offset = props.offsetPx;
      } else if (props.offsetSelector) {
        const el = document.querySelector(props.offsetSelector) as HTMLElement | null;
        offset = el?.scrollHeight ?? 0;
      }
      popupInner.value?.style.setProperty('--height', `calc(100dvh - ${offset}px)`);
      break;
    case PopupView.Auto:
      popupInner.value?.style.setProperty('--height', 'auto');
      break;
    case PopupView.CustomHeight:
      popupInner.value?.style.setProperty('--height', props.height ? `${props.height}px` : 'auto');
      break;
  }
}

async function setUpPopupElements() {
  if (!popupHeader.value || !popupContent.value || !popupWrapper.value) {
    // console.log('Popup elements are not defined');
    return;
  }

  try {
    // Ждем готовности элементов
    await waitForElementReady(popupHeader.value);
    const headerHeight = popupHeader.value.offsetHeight || 0;
    let footerHeight = 0;
    if (popupFooter.value) {
      await waitForElementReady(popupFooter.value);
      footerHeight = popupFooter.value.offsetHeight || 0;
    }

    popupContent.value.style.setProperty('--content-height', `calc(100% - ${headerHeight + footerHeight}px)`);

    if (props.usePerfectScrollbar && popupContent.value) {
      if (psInstance.value) {
        psInstance.value.update();
      } else {
        psInstance.value = new PerfectScrollbar(popupContent.value, {
          wheelPropagation: false,
          scrollXMarginOffset: 1,
          scrollYMarginOffset: 1,
        });
      }
    }
  } catch (error) {
    console.error('Error in setUpPopupElements:', error);
  }
}

defineExpose({
  close,
  setUpPopupElements,
  setPopupInnerHeight,
});

watch(isOpen, () => {
  onResize();
});
</script>
<template>
  <div v-if="isOpen" class="base-popup">
    <Teleport to="body">
      <Transition name="fade">
        <div
          ref="popupWrapper"
          :class="[
            'base-popup__wrap',
            { 'base-popup__wrap--mobile': isMobileType },
            { 'base-popup__wrap--shadow': hasShadow },
          ]"
          @mousedown.self="() => close()"
        >
          <div
            :class="[
              'base-popup__inner',
              {
                'base-popup__inner--mobile': isMobileType,
              },
              className,
            ]"
            ref="popupInner"
            :style="popupInnerStyles"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="ariaLabelledbyId"
            :aria-describedby="ariaDescribedbyId"
          >
            <slot name="header">
              <div ref="popupHeader" :class="['base-popup__header', { 'border-bottom-active': headerBorderBottom }]">
                <div class="base-popup__header-inner">
                  <slot name="title" />
                  <slot name="close" :close="() => close()">
                    <div class="base-popup__close-btn icon icon-cross" @click="() => close()"></div>
                  </slot>
                </div>
              </div>
            </slot>
            <div ref="popupContent" :class="['base-popup__content', { 'base-popup__content--mobile': isMobileType }]">
              <slot name="content" :close="() => close()" />
            </div>
            <div ref="popupFooter" class="base-popup__footer">
              <slot name="footer" :close="() => close()" />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.base-popup {
  &__wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100dvh;
    overscroll-behavior: contain; /* предотвращаем скролл боди при открытой клавиатуре */
    touch-action: none;
    backdrop-filter: blur(6px);
    background-color: color(black-60);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 110;
    &:not(&--shadow) {
      backdrop-filter: none;
      background-color: transparent;
    }
    &--mobile {
      bottom: 0;
      @media #{$md_max} {
        align-items: flex-end;
      }
    }
  }

  &__inner {
    height: var(--height);
    width: var(--width);
    border-radius: 8px;
    position: relative;
    background-color: color(white);
    @media #{$md_max} {
      width: 100vw;
      border-radius: 0;
      &--mobile {
        border-radius: var(--border-radius) var(--border-radius) 0 0;
        animation: feed-slide-up 0.3s ease-in-out forwards;
      }
      &--closed {
        animation: feed-slide-down 0.3s ease-in-out forwards;
      }
    }
    .icon {
      color: color(black-40);
      height: rem(24px);
      width: rem(24px);

      &:before {
        font-size: rem(24px);
        line-height: rem(24px);
        height: rem(24px);
        width: rem(24px);
      }
    }
  }

  &__close-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 16px;
    cursor: pointer;

    @media #{$md} {
      right: 24px;
    }
  }
  &__footer {
    height: auto;
  }

  &__header {
    position: relative;
    height: 56px; // mobile default
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: color(black-80);
    font-size: rem(20px);
    font-weight: 700;
    line-height: rem(24px);
    @media #{$md} {
      height: 64px;
    }
    &.border-bottom-active {
      border-bottom: 1px solid color(black-10);
    }
  }

  &__header-inner {
    padding: 16px;
    width: 100%;
    @media #{$md} {
      padding: 24px;
    }
  }

  &__content {
    position: relative;
    overflow: hidden;
    height: var(--content-height);
    //задаем нижний отстут равный высоте мобильной клавиатуры при ее открытии
    padding: 16px 16px calc(16px + max(env(safe-area-inset-bottom, 0px), var(--kb-overlap, 0px))) 16px;
    scroll-padding-bottom: calc(
        max(env(safe-area-inset-bottom, 0px), var(--kb-overlap, 0px)) + var(--scroll-padding-gap, 16px)
      )
      16px;
    @media #{$md} {
      padding: 24px 24px calc(24px + max(env(safe-area-inset-bottom, 0px), var(--kb-overlap, 0px))) 24px;
      scroll-padding-bottom: calc(
          max(env(safe-area-inset-bottom, 0px), var(--kb-overlap, 0px)) + var(--scroll-padding-gap, 16px)
        )
        24px;
    }
  }
}
.base-popup-in {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
@keyframes feed-slide-up {
  0% {
    bottom: -100%;
  }
  100% {
    bottom: 0;
  }
}
@keyframes feed-slide-down {
  0% {
    bottom: 0;
  }
  100% {
    bottom: -100%;
  }
}
</style>
