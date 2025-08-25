export type Tab = {
  href?: string;
  tab?: string;
  title: string;
  icon?: string;
  count?: number;
  classes?: string;
  attrs?: Record<string, string>;
  active?: boolean;
  id?: string;
};
