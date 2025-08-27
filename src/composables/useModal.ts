import { ref, onBeforeUnmount, computed } from 'vue';
import type { Ref } from 'vue';

type ModalOptions = Record<string, any>;
type ModalStyles = Record<string, any>;
type ModalState = {
  open: boolean;
  stretch: boolean;
  styles?: ModalStyles;
  isMobile?: MediaQueryList | null;
  options?: ModalOptions;
  order?: number;
};

const modalsList: Ref<Record<string | number, ModalState | null>> = ref({});

interface UseModalParams {
  name?: string | number;
  closeOnDestroy?: boolean;
  stretch?: boolean;
  style?: ModalStyles;
  overflow?: boolean;
  options?: ModalOptions;
}

const useModal = ({ name, closeOnDestroy = true, stretch = false, style = {}, overflow = true }: UseModalParams) => {
  const key = name as string | number;

  const bodyOverflowHidden = ref(false);

  const open = (
    arg?: { name?: string | number | null; options?: ModalOptions } | string | number | null,
    maybeOptions?: ModalOptions
  ) => {
    const isMobile = window?.matchMedia('(max-width: 450px)');
    const len = Object.keys(modalsList.value).length;
    try {
      let targetName: string | number | null | undefined;
      let options: ModalOptions = {};

      if (typeof arg === 'string' || typeof arg === 'number' || arg === null) {
        targetName = arg as string | number | null;
        options = maybeOptions ?? {};
      } else {
        targetName = arg?.name;
        options = arg?.options ?? {};
      }

      const k = (targetName ?? key) as string | number;

      modalsList.value[k] = {
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

  const toggle = (
    arg?: { name?: string | number | null; options?: ModalOptions } | string | number | null,
    maybeOptions?: ModalOptions
  ) => {
    try {
      let targetName: string | number | null | undefined;
      let options: ModalOptions = {};

      if (typeof arg === 'string' || typeof arg === 'number' || arg === null) {
        targetName = arg as string | number | null;
        options = maybeOptions ?? {};
      } else {
        targetName = arg?.name;
        options = arg?.options ?? {};
      }

      const k = (targetName ?? key) as string | number;

      modalsList.value[k] = modalsList.value[k]?.open
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

  onBeforeUnmount(() => {
    try {
      if (closeOnDestroy && key) {
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

  const setOptions = (options: ModalOptions) => {
    try {
      const existing = modalsList.value[key] ?? undefined;
      const isMobile = window?.matchMedia('(max-width: 450px)');
      const len = Object.keys(modalsList.value).length;

      modalsList.value[key] = {
        open: existing?.open ?? false,
        stretch: existing?.stretch ?? stretch,
        styles: existing?.styles ?? { zIndex: len ? len * 100 : 100, ...style },
        isMobile: existing?.isMobile ?? isMobile,
        order: existing?.order,
        options: { ...(existing?.options ?? {}), ...(options ?? {}) },
      };
    } catch (error) {
      console.error(error);
    }
  };

  const closeAll = () => {
    try {
      modalsList.value = {};
    } catch (error) {
      console.error(error);
    }
  };

  return {
    styles,
    modalsList,
    isOpen: isOpen,
    currentModal,
    closeAll,
    close,
    open,
    toggle,
    overflowToggle,
    setOptions,
  };
};

export default useModal;
