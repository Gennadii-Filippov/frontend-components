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
          @mousedown.self="closePopupEvent"
        >
          <div
            :class="[
              'base-popup__inner',
              {
                'base-popup__inner--mobile': isMobileType,
                'base-popup__inner--closed': isClosed,
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
              <div
                ref="popupHeader"
                :class="['base-popup__header', { 'border-bottom-active': headerBorderBottom }]"
                :style="popupHeaderStyles"
              >
                <div class="base-popup__header-inner">
                  <slot name="title" />
                  <slot name="close" :close="closePopupEvent">
                    <div class="base-popup__close-btn icon icon-cross" @click="closePopupEvent"></div>
                  </slot>
                </div>
              </div>
            </slot>
            <div
              ref="popupContent"
              :class="['base-popup__content', { 'base-popup__content--mobile': isMobileType }]"
              :style="popupContentStyles"
            >
              <slot name="content" :close="closePopupEvent" />
            </div>
            <div ref="popupFooter" class="base-popup__footer">
              <slot name="footer" :close="closePopupEvent" />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import useModal from '@/composables/useModal';
import { computed, onBeforeUnmount, onMounted, ref, Transition, toRefs } from 'vue';
import PerfectScrollbar from 'perfect-scrollbar';
import { ScreenSize } from '@/types/ScreenSize';
import { WebEvent } from '@/types/WebEvent';
import { calcPopupViewType } from '@/utils';
import { PopupView } from '@/types/Popup';
import { useDevice } from '@/composables/useDevice';
const { isMobile } = useDevice();
const props = withDefaults(
  defineProps<{
    height?: string | number; // Высота модалки
    width?: string | number; // Ширина модалки
    headerBorderBottom?: boolean; // Отображение нижней границы шапки
    borderRadius?: string | number; // Скругление углов модалки
    isMobileType?: boolean; //Тип модалки
    usePerfectScrollbar?: boolean;
    shadow?: boolean;
    className?: string;
    name?: string;
    viewType?: PopupView;
    paddingHeader?: string;
    paddingsContent?: {
      top: string;
      bottom: string;
      right: string;
      left: string;
    };
    heightHeader?: string;
    ariaLabelledby?: string;
    ariaDescribedby?: string;
    offsetSelector?: string; // CSS selector to measure offset element height
    offsetPx?: number; // Explicit offset in px (takes precedence)
  }>(),
  {
    width: 'auto',
    borderRadius: '8px',
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

const { isOpen, close, styles } = useModal({
  ...props,
});

//Базовые величины из дизайна
const CONSTANTS = {
  mobilePaddingValue: '16px',
  desktopPaddingValue: '24px',
  mobileHeaderHeight: '56px',
  desktopHeaderHeight: '64px',
};

const popupInnerStyles = computed(() => ({
  '--width': typeof props.width === 'number' ? `${props.width}px` : props.width,
  '--border-radius': typeof props.borderRadius === 'number' ? `${props.borderRadius}px` : props.borderRadius,
}));

const popupContentStyles = computed(() => ({
  '--padding-top-content':
    props.paddingsContent?.top ||
    (window?.innerWidth < ScreenSize.MD ? CONSTANTS.mobilePaddingValue : CONSTANTS.desktopPaddingValue),
  '--padding-bottom-content':
    props.paddingsContent?.bottom ||
    (window?.innerWidth < ScreenSize.MD ? CONSTANTS.mobilePaddingValue : CONSTANTS.desktopPaddingValue),
  '--padding-right-content':
    props.paddingsContent?.right ||
    (window?.innerWidth < ScreenSize.MD ? CONSTANTS.mobilePaddingValue : CONSTANTS.desktopPaddingValue),
  '--padding-left-content':
    props.paddingsContent?.left ||
    (window?.innerWidth < ScreenSize.MD ? CONSTANTS.mobilePaddingValue : CONSTANTS.desktopPaddingValue),
}));

const popupHeaderStyles = computed(() => ({
  '--padding-header':
    props.paddingHeader ||
    (window?.innerWidth < ScreenSize.MD ? CONSTANTS.mobilePaddingValue : CONSTANTS.desktopPaddingValue),
  '--height-header':
    props.heightHeader ||
    (window?.innerWidth < ScreenSize.MD ? CONSTANTS.mobileHeaderHeight : CONSTANTS.desktopHeaderHeight),
}));

const isClosed = ref(false);
const popupWrapper = ref<HTMLElement | null>(null);
const popupHeader = ref<HTMLElement | null>(null);
const popupFooter = ref<HTMLElement | null>(null);
const popupContent = ref<HTMLElement | null>(null);
const popupInner = ref<HTMLElement | null>(null);
// PS instance to prevent multiple initializations
const psInstance = ref<PerfectScrollbar | null>(null);
//Нужна для предотвращения скролла боди
let scrollDistance = 0;

// rAF debounced resize handler
let resizeRaf = 0;
const onResize = () => {
  if (resizeRaf) cancelAnimationFrame(resizeRaf);
  resizeRaf = requestAnimationFrame(() => {
    // Обновляем тип представления при необходимости
    viewType.value = calcPopupViewType();
    // Высота и внутренние элементы
    setPopupInnerHeight();
    setUpPopupElements();
  });
};

onMounted(() => {
  scrollDistance = window.scrollY;
  // Устанавливаем высоту модалки
  setPopupInnerHeight();
  // Подключаем дебаунс-обработчики ресайза
  window.addEventListener(WebEvent.Resize, onResize);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', onResize);
  }
  //Предотвращаем скролл body
  if (props.isMobileType && isMobile.value) {
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.top = `-${scrollDistance}px`;
    document.body.classList.add('base-popup-in');
    document.body.style.paddingRight = `${window?.innerWidth - document.documentElement.clientWidth}px`;
    // На мобильных также используем общий обработчик
  }

  setUpPopupElements();
});

onBeforeUnmount(() => {
  //Возвращаем скролл боди
  if (props.isMobileType && isMobile.value) {
    document.body.classList.remove('base-popup-in');
    document.body.style.top = '';
    document.body.style.paddingRight = '0px';
    document.documentElement.style.scrollBehavior = '';
    scrollTo({ top: scrollDistance });
  }
  // Снимаем обработчики ресайза
  window.removeEventListener(WebEvent.Resize, onResize);
  if (window.visualViewport) {
    window.visualViewport.removeEventListener('resize', onResize);
  }
  // Чистим PerfectScrollbar
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

function closePopupEvent() {
  if (props.isMobileType && window.innerWidth <= ScreenSize.MD) {
    isClosed.value = true;
    setTimeout(() => {
      close();
    }, 600);
  } else {
    close();
  }
}

function setPopupInnerHeight() {
  const vv = window.visualViewport;
  // перекрытие мобильной клавиатурой относительно layout viewport
  const kbOverlap = vv ? Math.max(0, window.innerHeight - vv.height - (vv.offsetTop || 0)) : 0;
  popupContent.value?.style.setProperty('--kb-overlap', `${kbOverlap}px`);

  switch (viewType.value) {
    case PopupView.Fullscreen:
      popupInner.value?.style.setProperty('--height', '100dvh');
      break;
    case PopupView.FullHeightWithoutHeader:
      // Вычисляем отступ на основе пропов
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
    console.log('Popup elements are not defined');
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
  closePopupEvent,
  setUpPopupElements,
  setPopupInnerHeight,
});
</script>

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
    z-index: 9999999;
    // Если тень отключена, убираем фон и блюр
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
    border-radius: var(--border-radius);
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
    height: var(--height-header);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: color(black-80);
    font-size: rem(20px);
    font-weight: 700;
    line-height: rem(24px);
    @media #{$md} {
      height: var(--height-header);
    }
    &.border-bottom-active {
      border-bottom: 1px solid color(black-10);
    }
  }

  &__header-inner {
    padding: var(--padding-header);
    width: 100%;
  }

  &__content {
    position: relative;
    overflow: hidden;
    height: var(--content-height);
    //задаем нижний отстут равный высоте мобильной клавиатуры при ее открытии
    padding: var(--padding-top-content) var(--padding-right-content)
      calc(var(--padding-bottom-content) + max(env(safe-area-inset-bottom, 0px), var(--kb-overlap, 0px)));
    scroll-padding-bottom: calc(
        max(env(safe-area-inset-bottom, 0px), var(--kb-overlap, 0px)) + var(--scroll-padding-gap, 16px)
      )
      var(--padding-left-content);
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
