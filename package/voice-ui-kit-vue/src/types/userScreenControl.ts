export type UserScreenControlVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "destructive";

export type UserScreenControlSize = "sm" | "md" | "lg" | "xl";

export type UserScreenControlState = "default" | "inactive";

export type UserScreenControlButtonProps = {
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
};

export type UserScreenControlClassNames = {
  button?: string;
  buttongroup?: string;
  activeText?: string;
  inactiveText?: string;
};

export type UserScreenControlProps = {
  variant?: UserScreenControlVariant;
  size?: UserScreenControlSize;
  state?: UserScreenControlState;
  buttonProps?: UserScreenControlButtonProps;
  className?: string;
  classNames?: UserScreenControlClassNames;
  noIcon?: boolean;
  noScreenText?: string | null;
  activeText?: string;
  inactiveText?: string;
};
