import { ref, getCurrentInstance, onUnmounted, onBeforeUnmount, computed } from 'vue';
import { PopupParams } from '@/types/Popup';
import type { Ref, ComputedRef } from 'vue';

type ModalOptions = Record<string, any>;
type ModalStyles = Record<string, any>;
type ModalState = {
  open: boolean;
  stretch: boolean;
  styles?: ModalStyles;
  isMobile?: MediaQueryList | null;
  options?: ModalOptions;
  order?: number;
  // params: PopupParams;
};

const modalsList: Ref<Record<string | number, ModalState | null>> = ref({});

interface UseModalParams {
  name?: string | number;
  closeOnDestroy?: boolean;
  stretch?: boolean;
  style?: ModalStyles;
  overflow?: boolean;
}

const useModal = ({ name, closeOnDestroy = true, stretch = false, style = {}, overflow = true }: UseModalParams) => {
  const instance = getCurrentInstance();
  const key = (name ?? instance?.uid ?? 'default') as string | number;

  const bodyOverflowHidden = ref(false);

  const open = ({ name, options = {} }: { name?: string | number; options?: ModalOptions } = {}) => {
    const isMobile = window?.matchMedia('(max-width: 450px)');
    const len = Object.keys(modalsList.value).length;
    try {
      modalsList.value[name ?? key] = {
        open: true,
        stretch,
        styles: { zIndex: len ? len * 100 : 100, ...style },
        isMobile: isMobile,
        options,
      };

      overflow ? overflowHidden() : null;
    } catch (error) {
      console.error(error);
    }
  };

  const overflowHidden = () => {
    try {
      if (document?.body) {
        Object.assign(document.body.style, {
          touchAction: 'none',
          overflow: 'hidden', // скрытие скроллбаров
        });
        bodyOverflowHidden.value = false;
        document.body.classList.add('modal-open');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const overflowAuto = () => {
    try {
      if (document?.body) {
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        Object.assign(document.body.style, {
          touchAction: 'auto',
        });
        bodyOverflowHidden.value = true;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const overflowToggle = () => {
    !!bodyOverflowHidden.value ? overflowAuto() : overflowHidden();
  };

  const close = (name?: string | number) => {
    try {
      modalsList.value[name ?? key] = null;
      overflowAuto();
    } catch (error) {
      console.error(error);
    }
  };

  const toggle = ({ name, options = {} }: { name?: string | number; options?: ModalOptions } = {}) => {
    try {
      modalsList.value[name ?? key] = modalsList.value[name ?? key]?.open
        ? null
        : {
            open: true,
            stretch,
            order: Object.keys(modalsList.value).length || 1,
            ...options,
          };
    } catch (error) {
      console.error(error);
    }
  };

  onUnmounted(() => {
    try {
      close();
    } catch (error) {
      console.error(error);
    }
  });

  onBeforeUnmount(() => {
    try {
      if (closeOnDestroy) {
        const pre: Record<string | number, ModalState | null> = {};
        Object.entries(modalsList.value).forEach(([k, value]) => {
          if (k !== String(key)) {
            pre[k] = value;
          }
        });
        modalsList.value = pre;
      }
    } catch (error) {
      console.error(error);
    }
  });

  const styles = computed(() => {
    try {
      return modalsList.value[key]?.open ? modalsList.value[key]?.styles : {};
    } catch (error) {
      console.error(error);
    }
  });

  const isOpen = computed(() => {
    try {
      return modalsList.value[key]?.open;
    } catch (error) {
      console.error(error);
    }
  });

  const currentModal = computed(() => {
    try {
      return modalsList.value[key];
    } catch (error) {
      console.error(error);
    }
  });

  const closeAll = () => {
    try {
      modalsList.value = {};
    } catch (error) {
      console.error(error);
    }
  };

  return {
    closeAll,
    styles,
    modalsList,
    isOpen: isOpen,
    close,
    open,
    toggle,
    overflowToggle,
    currentModal,
  };
};

export default useModal;
