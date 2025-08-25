//Буки дающие ссылку на матч как параметр реф ссылки
import { Locale } from '@/types/Locale';

enum BooksId {
  RU_BOOK_CHEATER = 2281,
  RU_1X_BET = 251, // 1xСтавка
  RU_WINLINE = 261,
  RU_LIGA = 256,
  RU_LEON = 266,
  RU_PARIMATCH = 291,
  RU_OLIMP = 276,
  RU_PINUP = 581,
  RU_BETBOOM = 301,
  RU_FONBET = 271,
  RU_BETTERY = 1341,
  RU_MELBET = 241,
  RU_BALTBET = 281,
  RU_888 = 246,
  RU_MARATHON = 296,
  RU_TENNISI = 306,
  RU_ZENIT = 311,
  RU_BWIN = 316,
  RU_MOSTBET = 321,
  RU_POOLBET = 1121,
  KK_OLIMPBET = 31883, // OLIMPBET KZ
  KK_1X_BET = 30323, // 1xBet
  BY_PARIMATCH = 130493, // Париматч
  TJ_1X_BET = 132221, // 1xBet Таджикистан
  RO_NETBET = 10003, // Netbet
  RO_FAVBET = 10107, // Favbet
  RO_BETANO = 10016, // Betano
  GR_STOIXIMAN = 40389, // Stoiximan
  ES_CODERE = 20067, // Codere
  CO_WPLAY = 50070, // Wplay
  MX_1X_BET = 60188, // 1xBet
  US_888 = 71006, // 888
  AU_PLAY_UP = 101171, // PlayUP
  GB_BET_VICTOR = 111192, // BetVictor
  NG_1X_BET = 121374, // 1xBet
  PL_STS = 81229, // STS
  PT_ESC = 91130, // ESC
  RU_GGBET = 336, // GGBET
  RU_BET365 = 27, // RU bet365
  RU_BET_CITY = 286,
  ES_LEOVEGAS = 20152, // ES Leovegas
  US_BET365 = 71066, // US bet365
  GB_BET365 = 111132, // GB bet365
  RU_ASTRA_BET = 132061,
  GB_UNIBET = 111412, // Unibet
  SE_UNIBET = 1007921,
  DK_UNIBET = 1007081,
}
export const CFS_BOOKS_ALLOW: Partial<Record<Locale, BooksId[]>> = {
  [Locale.RU]: [
    BooksId.RU_GGBET,
    BooksId.RU_BET_CITY,
    BooksId.RU_1X_BET,
    BooksId.RU_PARIMATCH,
    BooksId.RU_TENNISI,
    BooksId.RU_OLIMP,
    BooksId.RU_LIGA,
    BooksId.RU_WINLINE,
    BooksId.RU_MARATHON,
    BooksId.RU_ASTRA_BET,
    BooksId.RU_BETBOOM,
  ],
};
export const BooksWithReflinkBlank: { [key: string]: number[] } = {
  [Locale.RU]: [BooksId.RU_1X_BET, 291, BooksId.RU_FONBET, BooksId.RU_BET_CITY],
  [Locale.ES]: [
    20002,
    20004,
    20005,
    20013,
    20014,
    20032,
    20087,
    20102,
    20152,
    20007,
    20162,
    BooksId.ES_LEOVEGAS,
    20262,
    20342,
    20242,
    1005441,
    20015,
    1005981,
  ],
  [Locale.RO]: [10001, 10002, 10006, 10007, 10031, 10016, 10010, 10056, 1008604, 1008614, 1005501],
  [Locale.KZ]: [30313, 30388, 30323],
  [Locale.BY]: [130493],
  [Locale.CO]: [50075, 50115, 50085, 50105, 50185],
  [Locale.PT]: [BooksId.PT_ESC, 91210, 91110, 91090, 91070],
  [Locale.PL]: [81189, 81089],
  [Locale.NG]: [121374, 121314, 121494, 121254, BooksId.NG_1X_BET],
  [Locale.MX]: [60138, 60078, BooksId.MX_1X_BET],
  [Locale.GB]: [
    111212, 111412, 111732, 111352, 111492, 111672, 111772, 111912, 111952, 111552, 1005061, 1005101, 111572, 1004921,
    111072, 132281, 999781, 1006061, 1004981, 111892, 1004941, 1005081, 1008628,
  ],
  [Locale.AU]: [101431],
  [Locale.US]: [71086, 71056, 71226, 71046, BooksId.US_BET365, 71046],
  [Locale.GR]: [40389],
  [Locale.IE]: [2221, 2181, 5741, 5921, 4201, 2141, 5561],
  [Locale.CY]: [81361],
  [Locale.TJ]: [132221],
};
export const CasinosWithAdblockProblems: { [key: string]: number[] } = {
  [Locale.ES]: [
    41, 181, 321, 501, 541, 381, 281, 481, 121, 1181, 1141, 1301, 1901, 2021, 2061, 2241, 361, 241, 3501, 81,
  ],
  [Locale.RO]: [921, 801, 741],
  [Locale.BY]: [1201],
};
export type LinkParams = Record<string, number | string | Record<string, string>>;
export type ParamsRefLink = {
  seoName: string;
  label?: string;
  linkParams?: LinkParams;
  isCasino?: boolean;
  hrefUrl?: string;
  //вместо reflinkBlank()
  blank?: {
    id: number;
  };
  //макрос urlWithOrdParam
  urlWithOrdParam?: {
    token: string;
    paramName?: string;
  };
};
