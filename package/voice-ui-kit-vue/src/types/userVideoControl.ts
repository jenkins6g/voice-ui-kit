export type UserVideoControlVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "destructive";

export type UserVideoControlSize = "sm" | "md" | "lg" | "xl";

export type UserVideoControlState = "default" | "inactive" | "active";

export type UserVideoControlProps = {
  variant?: UserVideoControlVariant;
  size?: UserVideoControlSize;
  state?: UserVideoControlState;
  noDevicePicker?: boolean;
  noVideo?: boolean;
  noVideoText?: string | null;
  noIcon?: boolean;
  activeText?: string;
  inactiveText?: string;
  className?: string;
  classNames?: {
    container?: string;
    video?: string;
    buttongroup?: string;
    button?: string;
    dropdownMenuTrigger?: string;
    dropdownMenuContent?: string;
    dropdownMenuCheckboxItem?: string;
    videoOffContainer?: string;
    videoOffText?: string;
    activeText?: string;
    inactiveText?: string;
    buttongroupWrapper?: string;
  };
};
