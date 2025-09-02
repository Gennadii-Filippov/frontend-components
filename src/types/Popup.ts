// import { Feedback } from '@/types/Feedback';
// import { User } from '@/types/User';
// import { Complaint } from '@/types/Complaint';
// import { Bonus } from '@/types/Bonus';
// import { ParamsRefLink } from '@/types/ParamsRefLink';
// import { Lesson } from '@/types/Lesson';
// import { PromocodeType } from '@/types/PromocodeType';
// import { getPromoPopupEnum } from '@/types/getPromoPopupEnum';

export enum PopupView {
  Fullscreen = 'fullscreen',
  FullHeightWithoutHeader = 'FullHeightWithoutHeader',
  Auto = 'auto',
  CustomHeight = 'customHeight',
  DinamicHeight = 'dinamicHeight',
}

export enum BonusCardType {
  Default = 'default',
  Medium = 'medium',
  Short = 'short',
}

export interface PopupStore {
  activePopup: {
    popupId: PopupType | null;
    params?: PopupParams[PopupType] | null;
  };
  popupQueue: { popupId: PopupType; params?: PopupParams[PopupType] }[];
  isLoading: boolean;
}

export enum PopupType {
  AgeRestriction = 'ageRestrictionPopup',
  Auth = 'auth',
  RegisterSuccess = 'registerSuccess',
  RecoverPassword = 'recoverPassword',
  Subscriptions = 'subscriptions',
  SocialMediaRegister = 'SocialMediaRegister',
  Feedback = 'feedback',
  Complaint = 'complaint',
  Video = 'video',
  BonusPromocode = 'bonusPromocode',
  FeedbackCardPopup = 'feedbackCardPopup',
  ForecastTournamentFilter = 'forecastTournamentFilter',
  ForecastSportFilter = 'forecastSportFilter',
  GetFreeBetPopup = 'GetFreeBetPopup',
}

export type PopupParams = {
  [PopupType.AgeRestriction]: undefined;
  [PopupType.RegisterSuccess]: {
    data: Record<string, string>;
  };
  [PopupType.RecoverPassword]: undefined;
  [PopupType.FeedbackCardPopup]: {
    // feedback: Feedback;
    // user: User;
  };

  // [PopupType.NotPartners]: {
  //   partnerType: PartnerType;
  //   seoName: string; //data-seo-name
  //   type: string; //data-type
  //   mobileType?: string; // data-mobile-type
  // };
  [PopupType.Subscriptions]: {
    userIds: string[];
    type: SubscriptionPopupType;
  };
  [PopupType.SocialMediaRegister]: {
    data: SocialMediaRegisterDataType;
  };
  [PopupType.Feedback]: {
    type: string;
    books?: [Record<number, string>] | null;
    feedback_rating_types?: {
      [key: number]: [value: string];
    };
    user_data?: { image: string; username: string };
    book?: {
      name: string;
      id: number;
      images: {
        svgIcon: string;
        imgIcon: string;
        imgSvgIcon: string;
      };
    };
    tooltip_text?: string | null;
  };
  [PopupType.Complaint]: {
    // complaint: Complaint;
  };
  [PopupType.Auth]: {
    sendAuthForm: any;
    sendRegisterForm: any;
    basePopupLegal?: any;
    isLogin: boolean;
    noteType?: string;
  };
  [PopupType.Video]: {
    id: string;
    // type: VideoTypeEnum | null;
  };

  [PopupType.BonusPromocode]: {
    // bonus: Bonus;
    viewLink: string;
    iconSvg: string | null;
    bookName: string | null;
    amountText: string;
    notPartnerPopupTrigger: string;
    // reflinkUrl: ParamsRefLink;
    // cardType: BonusCardType;
    objectSeoName: string;
  };
  [PopupType.ForecastTournamentFilter]: {
    tournamentsData: TournamentsData;
  };
  [PopupType.ForecastSportFilter]: {
    sportsData: SportsData;
  };
  [PopupType.GetFreeBetPopup]: {
    // promoData: PromocodeType | null;
    // lesson: Lesson;
    // typePopup: getPromoPopupEnum;
  };
};

export enum SubscriptionPopupType {
  Followers = 'Followers',
  Subscriptions = 'Subscriptions',
}

export type SocialMediaRegisterDataType = {
  hash: string;
  email: string;
  username: string;
  uid: string;
  noticeBonus: boolean;
  ageLimit: boolean;
  personalDataPolicy: boolean;
};
export type TournamentsData = {
  selectedTournament?: {
    logo_small?: string;
    [key: string]: any;
  };
  activeTagId?: number;
  allTags: {
    [sportId: number]: {
      [key: string]: string;
    };
  };
  category: string;
  tournaments: {
    [sportId: number]: {
      id: number;
      logo_small?: string;
      tips?: number[];
      [key: string]: any;
    }[];
  };
  tipsCountBySport: {
    [sportId: number]: number;
  };
  title: string;
};

type SportLink = {
  icon: string;
  title: string;
  url?: string;
  route_name?: string;
  route_params?: Record<string, any> | any[];
  isActive: boolean;
};

export type SportsData = {
  links: SportLink[];
  title: string;
};

export type FeedbackPopupType = {
  type: string;
  books?: [Record<number, string>] | null;
  feedback_rating_types?: {
    [key: number]: [value: string];
  };
  user_data?: { image: string; username: string };
  book?: {
    name: string;
    id: number;
    images: {
      svgIcon: string;
      imgIcon: string;
      imgSvgIcon: string;
    };
  };
  tooltip_text?: string | null;
  listBooksForSelect?: { id: string; label: Record<number, string> }[] | null;
};

export type PromocodeType = {
  notice: string;
  promocode: string | null;
  status: string;
};
