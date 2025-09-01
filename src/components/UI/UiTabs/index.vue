<script setup lang="ts">
import { ref, watch, computed, withDefaults } from 'vue';

// --- Типы ---

/**
 * Определяет структуру объекта таба.
 */
export interface TabItem {
  /** Заголовок таба */
  title: string;
  /** Значение для значка (badge) */
  badge?: string | number;
  /** Имя слота для контента таба */
  slotName?: string;
  /** Любые другие кастомные поля */
  [key: string]: any;
}

/**
 * Определяет пропсы компонента.
 */
interface Props {
  /**
   * Текущее активное значение таба.
   * Используется для v-model.
   */
  modelValue?: string | number;
  /** Массив с данными для генерации табов */
  tabs: TabItem[];
  /** Вариант стилизации (для CSS-классов) */
  variant?: string;
  /**
   * По какому полю в объекте таба отслеживать активность.
   * 'index' - по индексу в массиве, иначе - по значению поля.
   */
  by?: string;
  /** Начальный активный таб */
  initialActive?: string | number | null;
  /** Функция обратного вызова при смене таба */
  callback?: (item: TabItem, value: string | number) => void;
}

// --- Пропсы и Эмиты ---

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  variant: 'tabs',
  by: 'index',
  initialActive: null,
  callback: undefined,
});

const emit = defineEmits<{ (e: 'update:modelValue', value: string | number, item: TabItem): void }>();

// --- Реактивные переменные ---

/** Текущий активный индекс таба */
const active = ref<number>(0);

// --- Логика ---

/**
 * Генерирует CSS-классы для элементов компонента.
 */
const classes = computed(() => ({
  tabs_wrapper: `${props.variant}__wrapper`,
  header_wrapper: `${props.variant}__header-wrapper`,
  tabs_heater__item: `${props.variant}__heater-item`,
  badge: `${props.variant}__badge`,
  content_wrapper: `${props.variant}__content-wrapper`,
}));

/**
 * Устанавливает активный таб по индексу.
 * @param index - Индекс таба в массиве `tabs`.
 * @param item - Объект таба.
 */
const setActive = (index: number, item: TabItem) => {
  const value = props.by === 'index' ? index : item[props.by];
  active.value = index;
  emit('update:modelValue', value, item);
  props.callback?.(item, value);
};

// --- Наблюдатели ---

/**
 * Следит за изменением `modelValue` извне и обновляет активный таб.
 */
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue === undefined) return;

    let newIndex = -1;
    if (props.by === 'index' && typeof newValue === 'number') {
      newIndex = newValue;
    } else {
      newIndex = props.tabs.findIndex((tab) => tab[props.by] === newValue);
    }

    active.value = newIndex !== -1 ? newIndex : 0;
  },
  { immediate: true }
);

/**
 * Устанавливает начальный активный таб при инициализации компонента.
 */
watch(
  () => props.initialActive,
  (initialValue) => {
    if (initialValue !== null) {
      let initialIndex = -1;
      if (props.by === 'index' && typeof initialValue === 'number') {
        initialIndex = initialValue;
      } else {
        initialIndex = props.tabs.findIndex((tab) => tab[props.by] === initialValue);
      }

      if (initialIndex !== -1) {
        const initialItem = props.tabs[initialIndex];
        setActive(initialIndex, initialItem);
      }
    }
  },
  { immediate: true }
);

/**
 * Вычисляет имя слота для активного контента таба.
 */
const activeSlotName = computed(() => {
  const activeTab = props.tabs[active.value];
  if (!activeTab) return null;

  if (props.by !== 'index') {
    return `ITEM_${activeTab[props.by]}` || activeTab.slotName;
  }
  return activeTab.slotName || `ITEM_${active.value}`;
});
</script>

<template>
  <div :class="classes.tabs_wrapper">
    <div :class="classes.header_wrapper">
      <slot name="before" :active="active" />
      <template v-for="(item, index) in tabs" :key="index">
        <slot
          name="HEADER_ITEM"
          :item="item"
          :active="active"
          :set-active="() => setActive(index, item)"
          :index="index"
          :is-active="index === active"
        >
          <slot
            :name="`HEADER_ITEM_${index}`"
            :item="item"
            :active="active"
            :set-active="() => setActive(index, item)"
            :index="index"
            :is-active="index === active"
          >
            <div :class="[classes.tabs_heater__item, { active: index === active }]" @click="setActive(index, item)">
              {{ item?.title }}
              <slot v-if="item.badge" name="badge" :item="item">
                <span :class="classes.badge">{{ item?.badge }}</span>
              </slot>
            </div>
          </slot>
        </slot>
      </template>
      <slot name="after" :active="active" />
    </div>
    <div :class="classes.content_wrapper">
      <slot :active="active" />
      <slot
        :name="activeSlotName"
        :item="tabs[active]"
        :active="active"
        :set-active="() => setActive(active, tabs[active])"
        :index="active"
        :is-active="true"
      />
    </div>
    <slot name="footer" :active="active" />
  </div>
</template>
