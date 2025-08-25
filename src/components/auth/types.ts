import { IconNames } from '@/components/UI/icon/iconNames';
import { Locale as Locales } from '@/types/Locale';
import { RouteName } from '@/types/RouteName';

export enum Tabs {
  Auth = 'Auth',
  Registration = 'Registration',
}
export type SocialIcon = {
  id: number;
  icon: IconNames;
  provider: string;
  textColor: string;
};

export type AllowedLocales =
  | Locales.RU
  | Locales.RO
  | Locales.ES
  | Locales.KZ
  | Locales.GR
  | Locales.CY
  | Locales.BY
  | Locales.GB
  | Locales.TJ
  | Locales.UZ
  | Locales.IE
  | Locales.UG
  | Locales.KE
  | Locales.GH
  | Locales.NG
  | Locales.US
  | Locales.AU
  | Locales.PT
  | Locales.PL
  | Locales.MX
  | Locales.CO
  | Locales.CZ
  | Locales.RS
  | Locales.BR
  | Locales.DK
  | Locales.SE;

export type BasePath = {
  gdpr: RouteName;
  privacy_policy: RouteName;
};

export type ExtendedPath = BasePath & {
  personal_data_policy: RouteName;
};

export type CookiePolicyPath = BasePath & {
  cookie_policy: RouteName;
};

export type IdPath = {
  [key in Locales.RU | Locales.KZ | Locales.BY | Locales.TJ | Locales.UZ]: ExtendedPath;
} & {
  [key in
    | Locales.GB
    | Locales.IE
    | Locales.UG
    | Locales.KE
    | Locales.GH
    | Locales.NG
    | Locales.US
    | Locales.AU
    | Locales.PT
    | Locales.PL
    | Locales.CZ
    | Locales.RS
    | Locales.BR
    | Locales.DK
    | Locales.SE]: CookiePolicyPath;
} & {
  [key in Locales.RO | Locales.ES | Locales.CO | Locales.MX | Locales.GR | Locales.CY]: BasePath;
};

export type RuLocales = Locales.RU | Locales.KZ | Locales.BY | Locales.TJ | Locales.UZ;
export type CookiePolicyLocales =
  | Locales.IE
  | Locales.UG
  | Locales.KE
  | Locales.GH
  | Locales.NG
  | Locales.US
  | Locales.AU
  | Locales.GB
  | Locales.PT
  | Locales.PL
  | Locales.RS;
export type CookiePolicyLocalesSecond = Locales.BR | Locales.DK | Locales.SE;

export enum LocaleCategory {
  Ru = 'ru',
  CookiePolicy = 'cookiePolicy',
  CookiePolicySecond = 'cookiePolicySecond',
  Base = 'base',
}

export enum LoginPopupNoteTypeEnum {
  AddForecast = 'showAddForecast',
  VoteAction = 'voteAction',
}
