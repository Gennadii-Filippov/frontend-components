import { ref } from 'vue';
import { Locale as Locales } from '@/types/Locale';

const store = ref<ConfigStore>({
  locale: Locales.RU,
  apiToken: '',
  baseUrl: '',
  translates: {},
  checkLocaleCache: new Map<string, boolean>(),
  userCountry: '',
  geo: null,
});

export function useConfig() {
  function get<K extends keyof ConfigStore>(key: K) {
    return store.value[key];
  }

  function set<K extends keyof ConfigStore>(key: K, value: ConfigStore[K]) {
    store.value[key] = value;
  }

  return { get, set };
}

export interface ConfigStore {
  locale: Locales;
  apiToken: string;
  baseUrl: string;
  translates: Record<string, string>;
  checkLocaleCache: Map<string, boolean>;
  userCountry: string;
  geo: {
    range: number[];
    country: string;
    region: string;
    eu: string;
    timezone: string;
    city: string;
    ll: number[];
    metro: number;
    area: number;
  } | null;
}
