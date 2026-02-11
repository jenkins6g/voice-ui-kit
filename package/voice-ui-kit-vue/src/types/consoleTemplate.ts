import type { PipecatBaseProps } from "./pipecat";

export type ConsoleTemplateProps = Omit<PipecatBaseProps, "children"> & {
  noRTVI?: boolean;
  serverRTVIVersion?: string | null;
  noUserAudio?: boolean;
  noUserVideo?: boolean;
  noScreenControl?: boolean;
  noTextInput?: boolean;
  noAudioOutput?: boolean;
  noBotAudio?: boolean;
  noBotVideo?: boolean;
  noAutoInitDevices?: boolean;
  theme?: string;
  noThemeSwitch?: boolean;
  noLogo?: boolean;
  noSessionInfo?: boolean;
  noStatusInfo?: boolean;
  titleText?: string;
  assistantLabelText?: string;
  userLabelText?: string;
  systemLabelText?: string;
  collapseInfoPanel?: boolean;
  collapseMediaPanel?: boolean;
  audioCodec?: string;
  videoCodec?: string;
  noConversation?: boolean;
  noMetrics?: boolean;
  logoComponent?: string;
  onServerMessage?: (data: unknown) => void;
  className?: string;
  classNames?: {
    header?: string;
    main?: string;
    controlBar?: string;
    visualizer?: string;
    status?: string;
  };
};
