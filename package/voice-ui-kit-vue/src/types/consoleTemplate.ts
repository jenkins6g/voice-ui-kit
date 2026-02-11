import type { PipecatBaseProps } from "./pipecat";
import type { SendTextOptions } from "@pipecat-ai/client-js";

type ConsoleMessagePart = {
  text: string;
  final: boolean;
  createdAt: string;
};

type ConsoleMessage = {
  role: "user" | "assistant" | "system";
  parts: ConsoleMessagePart[];
};

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
  conversationElementProps?: {
    noTextInput?: boolean;
    assistantLabel?: string;
    clientLabel?: string;
    systemLabel?: string;
    sendTextOptions?: SendTextOptions;
  };
  onInjectMessage?: (injectMessage: (message: ConsoleMessage) => void) => void;
  onServerMessage?: (data: unknown) => void;
  /** @deprecated Use titleText instead */
  title?: string;
  className?: string;
  classNames?: {
    header?: string;
    main?: string;
    controlBar?: string;
    visualizer?: string;
    status?: string;
  };
};
