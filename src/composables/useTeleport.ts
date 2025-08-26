import { onMounted, onUnmounted, ref } from 'vue';

export function useTeleport(
  target: import('vue').Ref<HTMLElement | null>,
  needTeleport: boolean
): { teleportTarget: import('vue').Ref<HTMLElement | null> } {
  const teleportTarget = ref<HTMLElement | null>(null);

  const isClient = typeof window !== 'undefined';

  onMounted(() => {
    if (isClient) {
      try {
        console.error('teleportTarget', needTeleport, target.value);
        if (needTeleport && target.value) {
          document.body.appendChild(target.value);
          teleportTarget.value = target.value;
        }
      } catch (error) {
        console.error(error);
      }
    }
  });

  onUnmounted(() => {
    if (isClient) {
      try {
        if (teleportTarget.value) {
          teleportTarget.value.remove();
        }
      } catch (error) {
        console.error(error);
      }
    }
  });

  return {
    teleportTarget,
  };
}
