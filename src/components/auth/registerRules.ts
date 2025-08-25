import { ValidationRule, ValidationRules } from '@/composables/formValidation/types';

export const AgeLimitRules: ValidationRule[] = [
  {
    type: ValidationRules.Required,
    message: '',
    // message: _(Lang.PleaseConfirmYourAge),
  },
];
export const RulesRules: ValidationRule[] = [
  {
    type: ValidationRules.Required,
    // message: _(Lang.PleaseConfirmYourAge),
    message: '',
  },
];
