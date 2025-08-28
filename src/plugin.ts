import type { App, Plugin } from 'vue';
import { CONFIG_KEY, type FrontendComponentsConfig } from '@/config';

export function createFrontendComponents(options: FrontendComponentsConfig = {}): Plugin {
  return {
    install(app: App) {
      app.provide(CONFIG_KEY, options);
    },
  };
}
import { createFrontendComponents } from '@legalbet/frontend-components';

const app = createApp(App);

app.use(
  createFrontendComponents({
    deviceBreakpoints: {
      mobileMax: 767,
      tabletMin: 768,
      tabletMax: 1279,
      laptopMin: 1280,
    },
  })
);

app.mount('#app');
