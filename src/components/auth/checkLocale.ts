import { Locale } from '@/types/Locale';
export const localeNotIn = (locales: Locale[]): boolean => {
  return !localeIn(locales);
};

export const localeIn = (locales: Locale[]): boolean => {
  return locales.some((loc) => window?.siteLocale === loc);
};
