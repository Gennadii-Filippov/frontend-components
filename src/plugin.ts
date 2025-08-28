import type { App, Plugin } from 'vue';
import { CONFIG_KEY, type FrontendComponentsConfig } from '@/config';

export function createFrontendComponents(options: FrontendComponentsConfig = {}): Plugin {
  return {
    install(app: App) {
      app.provide(CONFIG_KEY, options);
    },
  };
}
