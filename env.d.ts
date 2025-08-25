/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Global window interface
declare global {
  interface Window {
    siteLocale: import('./src/types/Locale').Locale;
    isReCapthcaEnabled: boolean;
  }

  namespace JSX {
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}
