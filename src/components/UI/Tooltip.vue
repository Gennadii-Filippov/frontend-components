<template>
  <component
    :is="tagName"
    ref="myTooltipContainer"
    :class="[
      'tooltip-container',
      buttonClass,
      { 'tooltip-visible': showTooltip },
      { 'tooltip-visible-hover': showTooltipHover },
    ]"
  >
    <div @click="handleClick" @mouseover="handleHover">
      <slot name="buttonContent" />
    </div>
    <template v-if="teleportTo && elementExists">
      <teleport :to="teleportTo">
        <div
          ref="myTooltip"
          :class="[
            'tooltip',
            tooltipClass,
            {
              [`tooltip--${positionTooltipClass}`]: positionTooltipClass,
              'tooltip--teleported': teleportTo && elementExists,
              'tooltip--visible': showTooltip && teleportTo && elementExists,
            },
          ]"
          :style="paramsTooltipStyles"
        >
          <i v-if="showCloseBtn" class="icon icon-cross" @click="closeBtnClick" />
          <div
            :class="[
              'tooltip__triangle',
              triangleClass,
              {
                [`tooltip__triangle--${positionTriangleClass}`]: positionTriangleClass,
              },
            ]"
            :style="mergedTooltipStyles"
          />
          <slot name="textTooltip" />
        </div>
      </teleport>
    </template>
    <template v-else>
      <div
        ref="myTooltip"
        :class="[
          'tooltip',
          tooltipClass,
          {
            [`tooltip--${positionTooltipClass}`]: positionTooltipClass,
            'tooltip--teleported': teleportTo && elementExists,
            'tooltip--visible': showTooltip && teleportTo && elementExists,
          },
        ]"
        :style="mergedTooltipStyles"
      >
        <i v-if="showCloseBtn" class="icon icon-cross" @click="closeBtnClick" />
        <div
          v-if="!hideTriangle"
          :class="[
            'tooltip__triangle',
            triangleClass,
            {
              [`tooltip__triangle--${positionTriangleClass}`]: positionTriangleClass,
            },
          ]"
          :style="mergedTriangleStyles"
        />
        <slot name="textTooltip" />
      </div>
    </template>
  </component>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, toRefs } from 'vue';
import { useClickOutside } from '@/composables/useClickOutside';

export enum TooltipType {
  OverLeft = 'over-left',
  OverMid = 'over-mid',
  OverRight = 'over-right',
  UnderLeft = 'under-left',
  UnderMid = 'under-mid',
  UnderRight = 'under-right',
}
export enum TooltipTriangleType {
  OverLeft = 'over-left',
  OverMid = 'over-mid',
  OverRight = 'over-right',
  UnderLeft = 'under-left',
  UnderMid = 'under-mid',
  UnderRight = 'under-right',
}

const showTooltipHover = ref(false);
let hoverTimer: ReturnType<typeof setTimeout> | null = null;
let clickTimer: ReturnType<typeof setTimeout> | null = null;

//TODO: Скорее всего нужно будет позиционировать относительно других элементов
const props = withDefaults(
  defineProps<{
    showTooltipInit?: boolean; // стартовой значние - показывать тултип сразу при загрузке страницы или нет
    tooltipIndentVertical?: string | number; //отступ тултипа по вертикали
    tooltipIndentHorizontal?: string | number; //отступ тултипа по горизонтали
    triangleIndentVertical?: string | number;
    triangleIndentHorizontal?: string | number;
    positionTooltipClass?: TooltipType; //позиция тултипа
    positionTriangleClass?: TooltipTriangleType; //позиция треугольника
    showClickTimer?: number; //через сколько закрыть тултип, если открыт после клика
    showHoverTimer?: number; //через сколько закрыть тултип, если открыт после наведения
    clickEvent?: boolean; //показывать тултип после клика
    hoverEvent?: boolean; //показывать тултип после наведения
    showCloseBtn?: boolean; //показать крестик на тултипе - скорее всего нужен будет дополнительный стиль,
    // чтобы текст не залезал на крести (ждем макеты)
    triangleStyle?: string; //стили для треугольника - скорее всего не понадобятся
    tooltipStyles?: string; //стили для тултипа - если унифицируем, то скорее всего удалим
    tooltipClass?: string; //класс для тултипа - возможно будет не нужен
    triangleClass?: string; //класс для треугольника - возможно будет не нужен
    buttonClass?: string; //класс для контейнера тултипа - можно настроить в родительской компоненте
    tagName?: string; //тег контейнера тултипа
    closeAfterClickOutside?: boolean; //закрыть тултип после клика вне тултипа
    // (если большой showHoverTimer или showClickTimer, либо showClickTimer равен 0)
    teleportTo?: string; //Можно телепортировать тултип к другому элементу. Желательно передавать id,
    // чтобы быть уверенным в уникальности
    hideTriangle?: boolean; // скрыть треугольник
    toggleTooltipOnClick?: boolean; // показывать/скрывать тултип при клике
  }>(),
  {
    showTooltipInit: false,
    tooltipIndentVertical: '0',
    tooltipIndentHorizontal: '0',
    triangleIndentVertical: '0',
    triangleIndentHorizontal: '0',
    positionTooltipClass: TooltipType.UnderMid,
    positionTriangleClass: TooltipTriangleType.OverMid,
    showClickTimer: 0,
    showHoverTimer: 0,
    clickEvent: false,
    hoverEvent: false,
    showCloseBtn: false,
    triangleStyle: '',
    tooltipStyles: '',
    tooltipClass: '',
    triangleClass: '',
    buttonClass: '',
    tagName: 'div',
    closeAfterClickOutside: true,
    teleportTo: '',
    hideTriangle: false,
    toggleTooltipOnClick: false,
  }
);
const showTooltip = ref(props.showTooltipInit);
// Expose specific props to template to satisfy TS template checking
const { showCloseBtn, hideTriangle } = toRefs(props);

const myTooltipContainer = ref<HTMLElement | null>(null);
const myTooltip = ref<HTMLElement | null>(null);

const emit = defineEmits<{
  (event: 'closeBtnClickEvent'): void;
}>();
function getStyles(styles: string) {
  return styles.split(';').reduce((acc: Record<string, string>, style) => {
    const [key, value] = style.split(':');
    if (key && value) {
      acc[key.trim()] = value.trim();
    }
    return acc;
  }, {});
}
function closeBtnClick() {
  // Нажатие на крестик тултипа - закрытие тултипа и всплытие события нажатия на крестик
  hideTooltip();
  emit('closeBtnClickEvent');
}
function hideTooltip() {
  //Прячем тултип и уничтожаем таймеры, удаляем тултип из листенера клика вне тултипа
  showTooltip.value = false;
  clearTimer(hoverTimer);
  clearTimer(clickTimer);
}

function handleHover() {
  //показать тултип при наведении
  if (!props.hoverEvent) {
    return;
  }
  if (props.showHoverTimer) {
    //можем закрыть тултип через время
    clearTimer(hoverTimer);
    showTooltip.value = true;
    hoverTimer = setTimeout(hideTooltip, props.showHoverTimer);
  } else {
    showTooltipHover.value = true; //просто добавляем :hover эффект
  }
}
function handleClick() {
  //показать тултип после клика на элемент, к которому привязан тултип
  if (!props.clickEvent) {
    //Проверка, нужно ли показать тултип после клика
    return;
  }
  handleClickObserver();
}
function handleClickObserver() {
  //Если передан таймер, то показываем тултип и закрываем тултип спустя это время, либо не закрываем
  if (props.showClickTimer) {
    //Уничтожаем прошлый таймер, который отслеживал клик
    clearTimer(clickTimer);
    //Показываем тултип
    showTooltip.value = true;
    //Создаем новый таймер
    clickTimer = setTimeout(hideTooltip, props.showClickTimer);
  } else {
    props.toggleTooltipOnClick ? (showTooltip.value = !showTooltip.value) : (showTooltip.value = true);
  }
}
function clearTimer(timer: ReturnType<typeof setTimeout> | null) {
  if (timer) {
    clearTimeout(timer);
  }
}

if (props.closeAfterClickOutside) {
  useClickOutside(
    myTooltipContainer,
    () => {
      hideTooltip();
    },
    myTooltip
  );
}
onMounted(() => {
  if (showTooltip.value) {
    //Если при создании компоненты решили сразу отобразить тултип, то вешаем событие прослушивания клика вне тултипа
    handleClickObserver();
  }
});
onBeforeUnmount(() => {
  clearTimer(hoverTimer);
  clearTimer(clickTimer);
});

const mergedTooltipStyles = computed(() => {
  return { ...getStyles(props.tooltipStyles), ...paramsTooltipStyles.value };
});
const paramsTooltipStyles = computed(() => ({
  '--tooltip-indent-vertical':
    typeof props.tooltipIndentVertical === 'number' ? `${props.tooltipIndentVertical}px` : props.tooltipIndentVertical,
  '--tooltip-indent-horizontal':
    typeof props.tooltipIndentHorizontal === 'number'
      ? `${props.tooltipIndentHorizontal}px`
      : props.tooltipIndentHorizontal,
}));

const mergedTriangleStyles = computed(() => {
  return { ...getStyles(props.triangleStyle), ...paramsTriangleStyles.value };
});
const paramsTriangleStyles = computed(() => ({
  '--triangle-indent-vertical':
    typeof props.triangleIndentVertical === 'number'
      ? `${props.triangleIndentVertical}px`
      : props.triangleIndentVertical,
  '--triangle-indent-horizontal':
    typeof props.triangleIndentHorizontal === 'number'
      ? `${props.triangleIndentHorizontal}px`
      : props.triangleIndentHorizontal,
}));

const elementExists = computed(() => {
  //проверку существования teleportTo
  try {
    return !!document.querySelector(props.teleportTo);
  } catch (error) {
    console.error('Ошибка при проверке существования элемента:', error);
    return false;
  }
});
</script>

<style scoped lang="scss">
@use '@assets/sass/settings' as *;
//TODO: Доработать стили, как будут унифицированы тултипы
.tooltip {
  display: none;
  position: absolute;
  border-radius: $elem-br;
  background: color(white);
  box-shadow: 0 rem(1px) rem(6px) 0 color(light-grey);
  z-index: 9999;
  //width: 300px;
  &--over-left {
    bottom: calc(100% + var(--tooltip-indent-vertical));
    left: var(--tooltip-indent-horizontal);
  }
  &--over-mid {
    bottom: calc(100% + var(--tooltip-indent-vertical));
    left: 50%;
    transform: translateX(-50%);
  }
  &--over-right {
    bottom: calc(100% + var(--tooltip-indent-vertical));
    right: var(--tooltip-indent-horizontal);
  }
  &--under-left {
    top: calc(100% + var(--tooltip-indent-vertical));
    left: var(--tooltip-indent-horizontal);
  }
  &--under-mid {
    top: calc(100% + var(--tooltip-indent-vertical));
    left: 50%;
    transform: translateX(-50%);
  }
  &--under-right {
    top: calc(100% + var(--tooltip-indent-vertical));
    right: var(--tooltip-indent-horizontal);
  }
  .icon-cross {
    position: absolute;
    right: rem(8px);
    top: rem(8px);
    height: rem(16px);
    width: rem(16px);
    font-size: rem(16px);
    color: color(black-40);
    cursor: pointer;
    pointer-events: auto;
  }
  &__triangle {
    display: none;
    position: absolute;
    width: rem(7px);
    height: rem(7px);
    border: none;
    border-radius: 1px 0 0 0;
    bottom: auto;
    transform: translate(50%, 50%) rotate(135deg);
    background: color(white);
    &--over-left {
      top: rem(-7px);
      left: calc(5px + var(--triangle-indent-horizontal));
    }
    &--over-mid {
      top: rem(-7px);
      left: calc(50% - 5px);
    }
    &--over-right {
      top: rem(-7px);
      right: calc(12px + var(--triangle-indent-horizontal));
    }
    &--under-left {
      bottom: 0;
      left: calc(5px + var(--triangle-indent-horizontal));
    }
    &--under-mid {
      bottom: 0;
      left: calc(50% - 5px);
    }
    &--under-right {
      bottom: 0;
      right: calc(12px + var(--triangle-indent-horizontal));
    }
  }
}

.icon.icon-circle-q.visible {
  @media #{$xl_max} {
    .tooltip,
    .tooltip__triangle {
      display: block;
    }
  }
}

.icon.icon-circle-q:hover,
.rating__hint:hover {
  @media #{$xl} {
    .tooltip,
    .tooltip__triangle {
      display: block;
    }
  }
}

.tooltip-visible {
  display: block;
  .tooltip,
  .tooltip__triangle {
    display: block;
  }
  &-hover:hover {
    .tooltip,
    .tooltip__triangle {
      display: block;
    }
  }
}
.tooltip-container {
  position: relative;
  //width: rem(400px);
}
.tooltip--teleported {
  &.tooltip--visible {
    display: block;
    .tooltip__triangle {
      display: block;
    }
  }
}
</style>
