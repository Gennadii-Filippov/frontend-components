<script setup lang="ts">
import { computed, withDefaults } from 'vue';

// --- Типы ---
interface Props {
  /** Состояние загрузки */
  loading?: boolean;
  /** Активен ли таб. Может быть булевым значением или строкой для сравнения с `name` */
  active?: boolean | string;
  /** Вариант стилизации (для CSS-классов) */
  variant?: string;
  /** Уникальное имя таба, используется для определения активности */
  name?: string;
}

// --- Пропсы ---
const props = withDefaults(defineProps<Props>(), {
  loading: false,
  active: false,
  variant: 'tabs',
  name: 'empty',
});

// --- Логика ---

/**
 * Определяет, должен ли таб быть видимым.
 * Если `active` - булево, используется его значение.
 * Если `active` - строка, сравнивается с `name`.
 */
const isVisible = computed(() => {
  if (typeof props.active === 'boolean') {
    return props.active;
  }
  return props.active === props.name;
});

/**
 * Генерирует CSS-классы для корневого элемента.
 */
const classes = computed(() => ({
  'tabs-item-wrapper': `${props.variant}__item-wrapper`,
}));
</script>

<template>
  <div v-if="isVisible" :class="classes['tabs-item-wrapper']">
    <slot :active="active" />
  </div>
</template>
