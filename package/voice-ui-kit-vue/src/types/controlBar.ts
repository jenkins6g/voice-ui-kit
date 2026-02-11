export type ControlBarSize = "sm" | "md" | "lg" | "xl";
export type ControlBarShadow = "none" | "short" | "long" | "xlong";

export type ControlBarProps = {
  className?: string;
  noAnimateIn?: boolean;
  withGradientBorder?: boolean;
  shadow?: ControlBarShadow;
  size?: ControlBarSize;
};
