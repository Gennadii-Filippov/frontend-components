export type User = null | {
  id: number;
  username: string;
  bookPickerShow: boolean;
  avatar: string;
  isAdmin?: boolean;
  isPasswordRequired?: boolean;
  verifyUrl?: string;
};

export type Bonus = {
  id: number;
  user_id: number;
  name: string;
  anons: string;
  book_id: number | null;
  anons_img: string;
  amount: number | null;
  min_deposit: number;
  views: number;
  comments_count: number;
  vote_sum: number;
  locale: number;
  seo_name: string;
  seo_keywords: string | null;
  seo_description: string;
  seo_title: string;
  published: number;
  edit_dt: string;
  publish_dt: string;
  actual_dt: string | null;
  exclusive: number;
  for_new_players: number;
  text: string;
  img_main: string;
  is_old: number;
  weight: number;
  is_sent: number;
  no_deposit: number;
  reflink_text: string;
  reflink_id: number;
  card_filter_params: unknown[];
  header: string | null;
  mailing_high_priority: number;
  in_rating: number;
  point_type: number;
  point_sum: number;
  point_time: number;
  point_difficulty: number;
  point_exclusive: number;
  amount_text: string | null;
  casino_id: number | null;
  type_custom_name: string | null;
  promocode: string | null;
  min_cf: number | null;
  max_cf: number | null;
  wagering_hours: number | null;
  is_wagered: number;
  wagering: number | null;
  is_wagering_required: number;
  likes_count: number;
  current_user_liked: boolean;
  condition_text: string | null;
  condition_links: string | null;
  book_name: string;
  bg_color: string;
  book_seo_name: string;
  book_affcode: string;
  img_icon_big: string;
  img_icon: string;
  book_website: string;
  img_svg: string;
  img_svg_white: string;
  img_svg_icon: string;
  casino_name: string | null;
  casino_bg_color: string | null;
  casino_svg_icon: string | null;
  casino_reflink_id: number | null;
  casino_seo_name: string | null;
  has_reflink: number;
  expire_sort: number | null;
  main_type: BonusType;
  token_card: string;
  token_page: string;
  time_to_completion: TimeToCompilation;
  is_hot: boolean;
  is_new: boolean;
  currency_symbol: string;
  currency_name: string;
  wagering_cf_caption: string;
  wagering_time: unknown[];
  filter: FilterBonus;
  hashtags: Hashtag[] | null;
};
export enum BonusType {
  Casino = 'casino',
  Book = 'book',
}
export type BonusFirstCardType = {
  id: number;
  header: string | null;
  text: string | null;
  viewLink: string | null;
  reflinkUrl: string | null;
  token: string | null;
  book_website: string | null;
  book_seo_name: string | null;
  coin_img_mobile: string | null;
  coin_img_desktop: string | null;
};

export type Hashtag = {
  text: string;
  url: {
    filter_params: string;
    id: number;
    locale: number;
    name: string;
    name_canonical: string;
    published: 1;
    seo_name: string;
    url: string;
  };
};

type TimeToCompilation = {
  d: unknown | null;
  h: unknown | null;
  m: unknown | null;
};
type FilterBonus = {
  condition: Record<number, Condition>;
  type: Record<number, unknown> | null;
  'no-deposit': { caption: unknown }[];
  sport: unknown[];
};
type Condition = {
  caption: string;
  compilation_seo_name: string;
  compilation_url: string;
  count: number;
  filter_name: string;
  group_caption: unknown;
  group_hint: unknown;
  group_id: unknown;
  group_input_type: unknown;
  group_show: unknown;
  group_show_caption: unknown;
  group_sort: unknown;
  icon: string;
  icon_2x: string;
  id: string;
  is_check: boolean;
  name_canonical: string;
  show_right: boolean;
  sort: string;
};

export type Bonuses = {
  bonuses: Bonus[];
  archive: Bonus[];
  label: string | null;
  col_lg_class: string;
  bonus_count: number;
  bonus_archive_count: number;
  print_count: boolean;
  imagesAlwaysLazy: boolean;
  adFox: boolean;
  compilation_url: string;
  cardTemplate: string;
  schema: Record<string, unknown>;
};

export type Post = {
  id: number;
  avatar: string;
  sort_date: string;
  publish_dt: string;
  view_dt: string;
  // user_category_id: ProfileCategory;
  user_id: number;
  // user_meta: Expert;
  header: string;
  anons: string;
  read_only: number;
  anons_header: string;
  anons_img: string | null;
  index_img: string;
  seo_name: string;
  views: number;
  vote_sum: number;
  blog_id: number;
  index_page: number;
  published: number;
  read_only_dt: string | null;
  fix: number;
  create_dt: string;
  comments_count: number;
  event_dt: string | null;
  not_limited: number;
  // type_id: BlogType;
  blog_seo_name: string;
  username: string;
  user_site_role_name: string;
};

export type NewsPost = {
  id: number;
  sort_date: string;
  publish_dt: string;
  view_dt: string;
  user_id: number;
  header: string;
  anons: string;
  read_only: number;
  anons_header: string;
  anons_img: string | null;
  index_img: string;
  seo_name: string;
  views: number;
  vote_sum: number;
  blog_id: number;
  index_page: number;
  published: number;
  read_only_dt: string | null;
  fix: number;
  create_dt: string;
  comments_count: number;
  event_dt: string | null;
  not_limited: number;
  // type_id: BlogType;
  exclusive: number;
  sport_id: number;
  sport_name: string;
};

export type Complaint = {
  amount: number;
  book_id: number;
  book_name: string;
  change_status_dt: string | null;
  close_dt: string | null;
  closed: number;
  currency_symbol: string;
  comments_count: number;
  comment_dt: string | null;
  comment_id: number | null;
  comment_text: string | null;
  comment_text_raw: string | null;
  comment_user_id: number | null;
  create_dt: string;
  delete_dt: string | null;
  delete_reason: number;
  delete_user_id: number | null;
  deleted: number;
  feedback_id: number | null;
  header: string;
  id: number;
  img_icon: string;
  img_svg: string;
  img_svg_icon: string;
  img_svg_white: string;
  img_white: string;
  in_sitemap: number;
  ip: string;
  locale: number;
  photo: {
    height: number;
    path: string;
    ratio: number;
    width: number;
  }[];
  seo_name: string;
  similar_source_id: number | null;
  source_id: number | null;
  status: ComplaintType;
  // status_color: (typeof ComplaintStatusColor)[keyof typeof ComplaintStatusColor];
  // status_text: (typeof ComplaintStatus)[keyof typeof ComplaintStatus];
  support_date: string;
  text: string;
  user_id: number;
};
enum ComplaintType {
  StatusSolved = 1,
  StatusUnsolved = 2,
  StatusUnreasonable = 3,
  StatusInProgress = 4,
  StatusOutOfCompetence = 5,
  StatusWithoutConsideration = 6,
  StatusUnderConsideration = 7,
}
