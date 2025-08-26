import { RequestType } from '@/types/RequestType';
import useModal from '@/composables/useModal';
import { RouteName } from '@/types/RouteName';

// Simple route function - replace with actual routing implementation
const route = (name: RouteName, params?: Record<string, any>): string => {
  // This is a placeholder implementation
  // In a real application, this would generate URLs based on the route name and parameters
  const routes: Record<RouteName, string> = {
    [RouteName.FosUserSecurityCheck]: '/login_check',
    [RouteName.FosUserSecurityRegister]: '/register',
    // Add other routes as needed
  } as Record<RouteName, string>;

  return routes[name] || `/${name}`;
};
import { JsonObject } from '@/types/JsonValue';
import type { UseFormWithValidation } from '../../composables/formValidation/types';
import { Ref } from 'vue';
import {
  AllowedLocales,
  CookiePolicyLocales,
  CookiePolicyLocalesSecond,
  IdPath,
  LocaleCategory,
  LoginPopupNoteTypeEnum,
  RuLocales,
} from './types';
import { localeIn } from './checkLocale';
import { Locale as Locales } from '@/types/Locale';
import { Lang } from '@/types/Lang';
import { ResponseStatus } from '@/types/ResponseStatus';
import { ScreenSize } from '@/types/ScreenSize';
import { PopupView, PopupType } from '@/types/Popup';
const localeCategoryMap: Record<LocaleCategory, Locales[]> = {
  [LocaleCategory.Ru]: [Locales.RU, Locales.KZ, Locales.BY, Locales.TJ, Locales.UZ],
  [LocaleCategory.CookiePolicy]: [
    Locales.IE,
    Locales.UG,
    Locales.KE,
    Locales.GH,
    Locales.NG,
    Locales.US,
    Locales.AU,
    Locales.GB,
    Locales.PT,
    Locales.PL,
    Locales.RS,
  ],
  [LocaleCategory.CookiePolicySecond]: [Locales.BR, Locales.DK, Locales.SE],
  [LocaleCategory.Base]: [],
};

export const sendRegisterForm = async <T extends Record<string, any>>(
  sendForm: UseFormWithValidation<T>['sendForm'],
  form: UseFormWithValidation<T>['form'],
  loggingIn: Ref<boolean>
) => {
  await sendForm({
    beforeSend: async (formData: FormData) => {
      loggingIn.value = true;
      //TODO
      // const captchaInput = $.findFirst({
      //   selector: '[name="captcha_token"]',
      //   parent: $.findFirst('#register-form'),
      // }) as HTMLInputElement;
      // if (captchaInput && window.grecaptcha) {
      //   // const recaptchaAction = $.data(captchaInput, 'recaptcha-action') ?? '';
      //   try {
      //     // const token = await window.grecaptcha.execute(
      //     //   window.recaptchaClientIds[recaptchaAction],
      //     //   {
      //     action: recaptchaAction,
      //   }
      // );
      // captchaInput.value = token;
      // formData.set('captcha_token', token);
      // formData.set('g-recaptcha-response', token);
      // } catch (err) {
      //   console.error('reCAPTCHA error', err);
      // }
      // } else {
      //   return;
      // }
      const setBinaryField = (key: string, value: string | boolean) => {
        formData.set(key, value && typeof value == 'boolean' ? '1' : '0');
      };

      setBinaryField('notice_bonus', form.values.notice_bonus);
      setBinaryField('visible-first', form.values['visible-first']);
      setBinaryField('agelimitname', form.values['agelimitname']);
      form.values.rules ? formData.set('rules', '1') : formData.delete('rules');
    },
    send: async (formData: FormData): Promise<JsonObject | null> => {
      try {
        const response = await fetch(route(RouteName.FosUserSecurityRegister), {
          method: RequestType.Post,
          body: formData,
        });

        const json = (await response.json()) as JsonObject;

        if (json?.status == ResponseStatus.Success) {
          if (json.html && typeof json.html === 'string') {
            const modal = useModal({ name: PopupType.RegisterSuccess });
            modal.open({
              name: PopupType.RegisterSuccess,
              options: {
                username: form.values['fos_user_registration_form[username]'] as string,
                email: form.values['fos_user_registration_form[email]'] as string,
              },
            });
          } else {
            const modal = useModal({ name: 'auth' });
            modal.close('auth');
          }
        }

        return json;
      } catch (error) {
        throw error;
      } finally {
        loggingIn.value = false;
      }
    },
  });
};
export function getLocaleCategory(): LocaleCategory {
  for (const [category, locales] of Object.entries(localeCategoryMap)) {
    if (localeIn(locales as Locales[])) {
      return category as LocaleCategory;
    }
  }
  return LocaleCategory.Base;
}

export const idPath: IdPath = {
  [Locales.RU]: {
    gdpr: RouteName.TermsGdpr,
    privacy_policy: RouteName.TermsPrivacyPolicy,
    personal_data_policy: RouteName.TermsPersonalDataPolicy,
  },
  [Locales.TJ]: {
    gdpr: RouteName.TermsGdpr,
    privacy_policy: RouteName.TermsPrivacyPolicy,
    personal_data_policy: RouteName.TermsPersonalDataPolicy,
  },
  [Locales.KZ]: {
    gdpr: RouteName.TermsGdpr,
    privacy_policy: RouteName.TermsPrivacyPolicy,
    personal_data_policy: RouteName.TermsPersonalDataPolicy,
  },
  [Locales.BY]: {
    gdpr: RouteName.TermsGdpr,
    privacy_policy: RouteName.TermsPrivacyPolicy,
    personal_data_policy: RouteName.TermsPersonalDataPolicy,
  },
  [Locales.UZ]: {
    gdpr: RouteName.TermsGdpr,
    privacy_policy: RouteName.TermsPrivacyPolicy,
    personal_data_policy: RouteName.TermsPersonalDataPolicy,
  },
  [Locales.RO]: {
    gdpr: RouteName.Terms,
    privacy_policy: RouteName.TermsGdpr,
  },
  [Locales.ES]: {
    gdpr: RouteName.Terms,
    privacy_policy: RouteName.TermsGdpr,
  },
  [Locales.CO]: {
    gdpr: RouteName.Terms,
    privacy_policy: RouteName.TermsPrivacyPolicy,
  },
  [Locales.MX]: {
    gdpr: RouteName.Terms,
    privacy_policy: RouteName.TermsPrivacyPolicy,
  },
  [Locales.GR]: {
    gdpr: RouteName.Terms,
    privacy_policy: RouteName.TermsGdpr,
  },
  [Locales.CY]: {
    gdpr: RouteName.Terms,
    privacy_policy: RouteName.TermsGdpr,
  },
  [Locales.GB]: {
    gdpr: RouteName.Terms,
    privacy_policy: RouteName.TermsPrivacyPolicy,
    cookie_policy: RouteName.TermsCookiesPolicy,
  },
  [Locales.IE]: {
    gdpr: RouteName.Terms,
    privacy_policy: RouteName.TermsPrivacyPolicy,
    cookie_policy: RouteName.TermsCookiesPolicy,
  },
  [Locales.UG]: {
    gdpr: RouteName.Terms,
    privacy_policy: RouteName.TermsPrivacyPolicy,
    cookie_policy: RouteName.TermsCookiesPolicy,
  },
  [Locales.KE]: {
    gdpr: RouteName.Terms,
    privacy_policy: RouteName.TermsPrivacyPolicy,
    cookie_policy: RouteName.TermsCookiesPolicy,
  },
  [Locales.GH]: {
    gdpr: RouteName.Terms,
    privacy_policy: RouteName.TermsPrivacyPolicy,
    cookie_policy: RouteName.TermsCookiesPolicy,
  },
  [Locales.NG]: {
    gdpr: RouteName.Terms,
    privacy_policy: RouteName.TermsPrivacyPolicy,
    cookie_policy: RouteName.TermsCookiesPolicy,
  },
  [Locales.US]: {
    gdpr: RouteName.Terms,
    privacy_policy: RouteName.TermsPrivacyPolicy,
    cookie_policy: RouteName.TermsCookiesPolicy,
  },
  [Locales.AU]: {
    gdpr: RouteName.Terms,
    privacy_policy: RouteName.TermsPrivacyPolicy,
    cookie_policy: RouteName.TermsCookiesPolicy,
  },
  [Locales.PT]: {
    gdpr: RouteName.Terms,
    privacy_policy: RouteName.TermsPrivacyPolicy,
    cookie_policy: RouteName.TermsCookiesPolicy,
  },
  [Locales.PL]: {
    gdpr: RouteName.Terms,
    privacy_policy: RouteName.TermsPrivacyPolicy,
    cookie_policy: RouteName.TermsCookiesPolicy,
  },
  [Locales.CZ]: {
    gdpr: RouteName.Terms,
    privacy_policy: RouteName.TermsPrivacyPolicy,
    cookie_policy: RouteName.TermsCookiesPolicy,
  },
  [Locales.RS]: {
    gdpr: RouteName.Terms,
    privacy_policy: RouteName.TermsPrivacyPolicy,
    cookie_policy: RouteName.TermsCookiesPolicy,
  },
  [Locales.BR]: {
    gdpr: RouteName.Terms,
    privacy_policy: RouteName.TermsPrivacyPolicy,
    cookie_policy: RouteName.TermsCookiesPolicy,
  },
  [Locales.DK]: {
    gdpr: RouteName.Terms,
    privacy_policy: RouteName.TermsPrivacyPolicy,
    cookie_policy: RouteName.TermsCookiesPolicy,
  },
  [Locales.SE]: {
    gdpr: RouteName.Terms,
    privacy_policy: RouteName.TermsPrivacyPolicy,
    cookie_policy: RouteName.TermsCookiesPolicy,
  },
};
export function getLabelPolicy(locale: Locales): string {
  const category = getLocaleCategory();

  const wrapLinks = (paths: string[]) =>
    paths.flatMap((link) => [
      `<a class="link" target="_blank" href="">`, //${route(link as RouteName)}
      '</a>',
    ]);

  switch (category) {
    case LocaleCategory.Ru: {
      const { gdpr, privacy_policy, personal_data_policy } = idPath[locale as RuLocales];
      return Lang.ConfirmDataForSNG; //, wrapLinks([gdpr, privacy_policy, personal_data_policy])
    }

    case LocaleCategory.CookiePolicy: {
      const { gdpr, privacy_policy, cookie_policy } = idPath[locale as CookiePolicyLocales];
      return Lang.IAcceptTheTermsAndConditions; //, wrapLinks([gdpr, privacy_policy, cookie_policy])
    }

    case LocaleCategory.CookiePolicySecond: {
      const { gdpr, privacy_policy, cookie_policy } = idPath[locale as CookiePolicyLocalesSecond];
      return Lang.ConfirmAgeCookie; //, wrapLinks([gdpr, privacy_policy, cookie_policy])
    }

    case LocaleCategory.Base: {
      const { gdpr, privacy_policy } =
        idPath[locale as Exclude<AllowedLocales, RuLocales | CookiePolicyLocales | CookiePolicyLocalesSecond>];
      return Lang.ByRegisteringOnOurWebsite; //, wrapLinks([gdpr, privacy_policy]);
    }
  }
}
export const allowedLocales: AllowedLocales[] = [
  Locales.RU,
  Locales.RO,
  Locales.ES,
  Locales.KZ,
  Locales.GR,
  Locales.CY,
  Locales.BY,
  Locales.GB,
  Locales.TJ,
  Locales.UZ,
  Locales.IE,
  Locales.UG,
  Locales.KE,
  Locales.GH,
  Locales.NG,
  Locales.US,
  Locales.AU,
  Locales.PT,
  Locales.PL,
  Locales.MX,
  Locales.CO,
  Locales.CZ,
  Locales.RS,
  Locales.BR,
  Locales.DK,
  Locales.SE,
];

//TODO пока оставил на бэке
export const noteTypeContent: Record<LoginPopupNoteTypeEnum, Lang> = {
  [LoginPopupNoteTypeEnum.AddForecast]: Lang.ToParticipateInTheUserPredictionContest,
  [LoginPopupNoteTypeEnum.VoteAction]: Lang.OnlyAuthorisedUsersAreAllowedToVote,
};

export function calcPopupViewType() {
  return window?.innerWidth <= ScreenSize.MD ? PopupView.Fullscreen : PopupView.Auto;
}
