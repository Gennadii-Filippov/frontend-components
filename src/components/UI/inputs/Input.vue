<script setup lang="ts">
import { ref, computed } from 'vue';
import { InputType } from './types';
import BaseIcon from '@/components/UI/icon/Icon.vue';
import { IconNames } from '@/components/UI/icon/iconNames';

interface Props {
  autocomplete?: string;
  label?: string;
  placeholder?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  errors?: Record<string, { text: string }>;
  errorsFormWithValidation?: string[];
  type?: InputType;
  id?: string;
  name?: string;
  disabled?: boolean;
  modelValue?: string | boolean | undefined | null;
  className?: string;
  dataValidator?: string;
  dataValidate?: string;
  dataValidatorErrorMessage?: string;
  showRequiredStar?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  autocomplete: '',
  label: '',
  placeholder: '',
  onBlur: () => null,
  onFocus: () => null,
  errors: () => ({}),
  errorsFormWithValidation: () => [],
  type: InputType.Text,
  id: '',
  name: '',
  disabled: false,
  className: '',
  dataValidator: '',
  dataValidate: '',
  dataValidatorErrorMessage: '',
  showRequiredStar: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const showPassword = ref(false);

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}

const validationErrorAttributes = computed(() => {
  const attributes: Record<string, string> = {};

  if (props.errors && Object.keys(props.errors).length) {
    Object.keys(props.errors).forEach((key) => {
      attributes[`data-error-${key}`] = 'true';
    });
  }

  if (props.errorsFormWithValidation && props.errorsFormWithValidation.length) {
    attributes['data-error-form-validation'] = 'true';
  }

  return attributes;
});
</script>

<template>
  <div
    :class="[
      'input-box__container',
      {
        'input-box__container--error':
          Object.keys(props.errors || {}).length || (props.errorsFormWithValidation || []).length,
      },
    ]"
  >
    <input
      :id="props.id"
      v-bind="validationErrorAttributes"
      :class="['input-box__input input-box__input-js', props.className]"
      :placeholder="props.placeholder"
      :type="props.type == InputType.Password && showPassword ? InputType.Text : props.type"
      :name="props.name"
      :value="props.modelValue"
      :disabled="props.disabled"
      :data-validator-error-message="props.dataValidatorErrorMessage"
      :data-validator="props.dataValidator"
      :data-validate="props.dataValidate"
      @input="handleChange"
      @blur="props.onBlur"
      @focus="props.onFocus"
      :autocomplete="props.autocomplete"
    />
    <label class="input-box__label" :for="props.id">
      {{ props.label }}
      <span v-if="props.showRequiredStar" class="input-box__star-wrapper">
        <span class="input-box__star">*</span>
      </span>
    </label>
    <div v-if="props.type === InputType.Password" class="icon-eye__wrapper" @click="showPassword = !showPassword">
      <BaseIcon
        :tag-name="'i'"
        :icon-name="showPassword ? IconNames.Eye : IconNames.Eyeinvisible"
        :text-color="'black'"
        :font-size="'16px'"
        :size="'16'"
      />
    </div>
    <div v-for="(error, key) in props.errors || {}" :key="key">
      <span :class="`text-error text-error-none text-error-${key}`">{{ error.text }}</span>
    </div>
    <div v-if="(props.errorsFormWithValidation || []).length" class="errors">
      <span v-for="error in props.errorsFormWithValidation || []" :key="error" class="text-error">
        {{ error }}
      </span>
    </div>
  </div>
</template>
<style scoped lang="scss">
.input-box__container {
  padding-top: rem(8px);
  padding-bottom: rem(8px);
  margin-bottom: rem(16px);
  position: relative;
  .input-box__input {
    background-color: color(white);
  }
  .input-box__input:disabled {
    background-color: rgba(0, 0, 0, 0.05);
    color: color(black-40);
  }
  .input-box__input:disabled + .input-box__label {
    color: color(black-40);
    background: linear-gradient(to bottom, transparent 50%, #f2f2f2 50%);
  }
  .text-error-none {
    display: none;
  }
  .validator-error-message {
    display: block;
    padding-left: rem(16px);
  }
  .input-box__input:not(:placeholder-shown) + .input-box__label,
  .input-box__input:focus + .input-box__label,
  .input-box__input:is(:-webkit-autofill, :autofill) + .input-box__label {
    top: rem(2px);
    left: rem(10px);
    background-color: color(white);
    padding: 0 rem(5px);

    font-size: rem(10px);
    font-weight: 400;
    line-height: rem(12px);
    text-align: left;
    color: color(black-40);
    .input-box__star-wrapper {
      width: 0;
      height: rem(9px);
      .input-box__star {
        left: rem(-2px);
      }
    }
  }
  .input-box__input:focus + .input-box__label {
    color: color(blue);
  }
  .input-box__input:not([type='submit']):focus {
    padding: 0 0.75rem;
    border: 0.0625rem solid color(blue);
    border-radius: 0.5rem;
    box-shadow: none !important;
  }
  .input-box__input.validator-error-input + .input-box__label,
  .input-box__input.input-error + .input-box__label {
    color: color(red);
  }

  .input-box__label {
    display: block;
    position: absolute;
    left: rem(16px);
    top: rem(24px);

    font-size: rem(16px);
    font-weight: 400;
    line-height: rem(18px);
    text-align: left;
    color: color(black-40);

    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    pointer-events: none;
    border-radius: $elem-br;

    white-space: nowrap;
    overflow: hidden;
    max-width: calc(100% - 30px);
  }
  .input-box__star-wrapper {
    position: relative;
    width: rem(10px);
    display: inline-block;
    height: rem(14px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    .input-box__star {
      position: absolute;
      left: rem(-4px);
      top: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      color: color(red);
    }
  }
  .icon-eye__wrapper {
    cursor: pointer;
    position: absolute;
    top: rem(24px);
    right: rem(12px);
    display: flex;
    justify-content: center;
    align-items: center;
    .icon {
      display: block;
    }
  }
  input:not([type='submit']) {
    height: rem(48px);
    padding: 0 rem(12px);
    border: rem(1px) solid color(black-10);
    border-radius: $block-br;
    font-size: rem(16px);
    box-shadow: none !important;
    &.input-error {
      border: rem(1px) solid color(red);
    }
  }
  .text-error {
    color: color(red);
    font-size: rem(10px);
    line-height: rem(12px);
    margin-bottom: 0;
    background: none;
    width: 100%;
    overflow: hidden;
    &-field-js {
      display: block;
      padding-left: 1rem;
    }
  }
  //Если из запроса пришла ошибка, то она выводится в .text-error.text-error-field-js
  &:has(.text-error-field-js) {
    .text-error:not(.text-error-field-js) {
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  &:has(.validator-error-message) {
    .text-error-field-js {
      display: none;
    }
  }

  &--error {
    .input-box__label,
    .input-box__input:not(:placeholder-shown) + .input-box__label,
    .input-box__input:focus + .input-box__label,
    .input-box__input:is(:-webkit-autofill, :autofill) + .input-box__label {
      color: color(red);
    }
    .input-box__input {
      border: rem(1px) solid color(scarlet) !important;
    }
    .errors {
      .text-error {
        display: none;
        padding-left: 1rem;
        &:first-of-type {
          display: block;
        }
      }
    }
  }
}
</style>
