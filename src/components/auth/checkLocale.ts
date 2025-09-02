import { Locale } from '@/types/Locale';
import { useConfig } from '@/composables/useConfig';
export const localeNotIn = (locales: Locale[]): boolean => {
  return !localeIn(locales);
};

export const localeIn = (locales: Locale[]): boolean => {
  return locales.some((loc) => useConfig().get('locale') === loc);
};
