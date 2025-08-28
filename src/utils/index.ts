import { ScreenSize } from '@/types/ScreenSize';
import { PopupView } from '@/types/Popup';

export function calcPopupViewType() {
  return window?.innerWidth <= ScreenSize.MD ? PopupView.Fullscreen : PopupView.Auto;
}

export function throttle<T extends (...args: any[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timerId: ReturnType<typeof setTimeout> | null = null;
  return function (this: unknown, ...args: Parameters<T>): void {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      if (timerId) clearTimeout(timerId);
      fn.apply(this, args);
    } else {
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(
        () => {
          lastCall = Date.now();
          fn.apply(this, args);
        },
        delay - (now - lastCall)
      );
    }
  };
}
