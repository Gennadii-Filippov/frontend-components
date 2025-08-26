import { ref } from 'vue';
import { dynamicScriptLoader } from './dynamicScriptLoader';

export default async function useRecaptcha(locale: string) {
  const recaptchaSettings = ref<RecaptchaSettings | null>(null);
  const recaptchaClientId = ref<Record<string, number>>({});

  async function getSettings() {
    if (recaptchaSettings.value) {
      return;
    }

    const resp = await fetch('/api/get-recaptcha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale }),
    });
    const data = (await resp.json()) as { result?: RecaptchaSettings };

    if (!data || !data.result) {
      console.log('Recaptcha settings not found');
      return;
    }
    recaptchaSettings.value = data.result;
  }

  async function init(callback?: () => void) {
    if (window.grecaptcha) {
      return;
    }

    await getSettings();

    if (!recaptchaSettings.value?.siteKey || !recaptchaSettings.value?.enabled) {
      console.log('recaptcha disabled or site key not found');
      return;
    }

    dynamicScriptLoader(
      {
        scriptUrls: ['https://www.google.com/recaptcha/api.js?render=explicit'],
      },
      () => {
        callback?.();
      }
    );
  }

  function renderBadge(container: HTMLElement | string, action: string) {
    if (!recaptchaSettings.value?.siteKey) {
      console.log('recaptcha site key not found');
      return;
    }

    window.grecaptcha?.ready(() => {
      const id = window.grecaptcha?.render?.(container, {
        sitekey: recaptchaSettings.value?.siteKey,
        badge: 'inline',
        size: 'invisible',
      });

      recaptchaClientId.value[action] = id as number;
    });
  }

  async function executeRecaptcha(action: string) {
    try {
      if (!window.grecaptcha || typeof recaptchaClientId.value[action] === 'undefined') {
        return;
      }
      const token = await window.grecaptcha.execute(recaptchaClientId.value[action] as number, { action });

      if (!token) {
        console.log(`Error with execute recaptcha action ${action}`);
        return '';
      }

      return token;
    } catch (e) {
      console.log(e);
      return '';
    }
  }

  return { init, renderBadge, executeRecaptcha };
}

type RecaptchaSettings = {
  siteKey: string;
  enabled: boolean;
};

declare global {
  interface Window {
    grecaptcha?: {
      ready(cb: () => void): void;
      render(container: HTMLElement | string, params: any): number;
      execute(id: number, opts: { action: string }): Promise<string>;
    };
  }
}
