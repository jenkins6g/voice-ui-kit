export type ErrorCardClassNames = {
  header?: string;
  title?: string;
  content?: string;
};

export type ErrorCardSize = "sm" | "md" | "lg" | "xl";
export type ErrorCardShadow = "none" | "short" | "long" | "xlong";

export type ErrorCardProps = {
  title?: string;
  noHeader?: boolean;
  classNames?: ErrorCardClassNames;
  icon?: string;
  className?: string;
  size?: ErrorCardSize;
  shadow?: ErrorCardShadow;
};
