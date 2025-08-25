<template>
  <div class="app-loader">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.0" :width="size" :height="size" viewBox="0 0 128 128">
      <g>
        <circle cx="16" cy="64" r="16" fill="#3591FD" />
        <circle cx="16" cy="64" r="14.344" fill="#3591FD" transform="rotate(45 64 64)" />
        <circle cx="16" cy="64" r="12.531" fill="#3591FD" transform="rotate(90 64 64)" />
        <circle cx="16" cy="64" r="10.75" fill="#3591FD" transform="rotate(135 64 64)" />
        <circle cx="16" cy="64" r="10.063" fill="#3591FD" transform="rotate(180 64 64)" />
        <circle cx="16" cy="64" r="8.063" fill="#3591FD" transform="rotate(225 64 64)" />
        <circle cx="16" cy="64" r="6.438" fill="#3591FD" transform="rotate(270 64 64)" />
        <circle cx="16" cy="64" r="5.375" fill="#3591FD" transform="rotate(315 64 64)" />
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 64 64;315 64 64;270 64 64;225 64 64;180 64 64;135 64 64;90 64 64;45 64 64"
          calcMode="discrete"
          dur="880ms"
          repeatCount="indefinite"
        />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: string;
  }>(),
  {
    size: '16',
  }
);
</script>

<style lang="scss" scoped>
.app-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
