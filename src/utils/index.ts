import { ScreenSize } from '@/types/ScreenSize';
import { PopupView } from '@/types/Popup';

export function calcPopupViewType() {
  return window.innerWidth <= ScreenSize.MD ? PopupView.Fullscreen : PopupView.Auto;
}
