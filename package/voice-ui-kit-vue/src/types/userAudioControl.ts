import type { VoiceVisualizerProps } from "./voiceVisualizer";

export type UserAudioControlVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "destructive";

export type UserAudioControlSize = "sm" | "md" | "lg" | "xl";

export type UserAudioControlState = "default" | "inactive";

export type UserAudioControlButtonProps = {
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
};

export type UserAudioControlClassNames = {
  button?: string;
  buttongroup?: string;
  dropdownMenuTrigger?: string;
  dropdownMenuContent?: string;
  dropdownMenuCheckboxItem?: string;
  activeText?: string;
  inactiveText?: string;
};

export type UserAudioControlProps = {
  variant?: UserAudioControlVariant;
  size?: UserAudioControlSize;
  state?: UserAudioControlState;
  buttonProps?: UserAudioControlButtonProps;
  classNames?: UserAudioControlClassNames;
  dropdownButtonProps?: UserAudioControlButtonProps;
  noDevicePicker?: boolean;
  dropdownMenuLabel?: string | null;
  noMicrophones?: boolean;
  noSpeakers?: boolean;
  microphoneLabel?: string;
  speakerLabel?: string;
  noVisualizer?: boolean;
  visualizerProps?: Partial<Omit<VoiceVisualizerProps, "participantType">>;
  noAudio?: boolean;
  noAudioText?: string | null;
  noIcon?: boolean;
  activeText?: string;
  inactiveText?: string;
};
