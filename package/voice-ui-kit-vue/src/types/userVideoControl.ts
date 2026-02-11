export type UserVideoControlVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "destructive";

export type UserVideoControlSize = "sm" | "md" | "lg" | "xl";

export type UserVideoControlState = "default" | "inactive" | "active";

export type UserVideoControlBaseProps = {
  variant?: UserVideoControlVariant;
  size?: UserVideoControlSize;
  state?: UserVideoControlState;
  buttonProps?: {
    disabled?: boolean;
    isLoading?: boolean;
    className?: string;
  };
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
  dropdownButtonProps?: {
    className?: string;
    disabled?: boolean;
  };
  deviceDropDownProps?: {
    noMenuLabel?: boolean;
    noMenuSeparator?: boolean;
    menuLabel?: string;
  };
  noDevicePicker?: boolean;
  noVideo?: boolean;
  videoProps?: {
    className?: string;
  };
  noVideoText?: string | null;
  noIcon?: boolean;
  activeText?: string;
  inactiveText?: string;
  className?: string;
};

export type UserVideoComponentProps = UserVideoControlBaseProps & {
  onClick?: () => void;
  isCamEnabled?: boolean;
  availableCams?: MediaDeviceInfo[];
  selectedCam?: MediaDeviceInfo | Record<string, never>;
  updateCam?: (deviceId: string) => void;
};

export type UserVideoControlProps = UserVideoControlBaseProps;
