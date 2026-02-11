export { default as DummyComponent } from "./components/DummyComponent.vue";

export { default as PipecatAppBase } from "./components/PipecatAppBase.vue";
export { default as ConnectButton } from "./components/ConnectButton.vue";
export { default as ControlBar } from "./components/ControlBar.vue";
export { default as ControlBarDivider } from "./components/ControlBarDivider.vue";
export { default as UserAudioControl } from "./components/UserAudioControl.vue";
export { default as VoiceVisualizer } from "./components/VoiceVisualizer.vue";
export { default as ErrorCard } from "./components/ErrorCard.vue";
export { default as DeviceSelect } from "./components/DeviceSelect.vue";
export { default as UserVideoControl } from "./components/UserVideoControl.vue";
export { default as ClientStatus } from "./components/ClientStatus.vue";

export {
  providePipecatApp,
  tryUsePipecatApp,
  usePipecatApp,
  type PipecatAppContext,
} from "./composables/pipecatApp";

export {
  createTransport,
  loadTransport,
  type DailyTransportOptions,
  type SmallWebRTCTransportOptions,
  type TransportType,
} from "./lib/transports";

export type {
  ClientStatusClassNames,
  ClientStatusComponentProps,
  ClientStatusProps,
} from "./types/clientStatus";

export type {
  ConnectButtonProps,
  ConnectButtonSize,
  ConnectButtonStateContent,
  ConnectButtonVariant,
} from "./types/connectButton";

export type {
  ControlBarProps,
  ControlBarShadow,
  ControlBarSize,
} from "./types/controlBar";

export type {
  DeviceSelectClassNames,
  DeviceSelectProps,
} from "./types/deviceSelect";

export type {
  ErrorCardClassNames,
  ErrorCardProps,
  ErrorCardShadow,
  ErrorCardSize,
} from "./types/errorCard";

export type {
  UserAudioControlButtonProps,
  UserAudioControlClassNames,
  UserAudioControlProps,
  UserAudioControlSize,
  UserAudioControlState,
  UserAudioControlVariant,
} from "./types/userAudioControl";

export type {
  UserVideoControlProps,
  UserVideoControlSize,
  UserVideoControlState,
  UserVideoControlVariant,
} from "./types/userVideoControl";

export type {
  VoiceVisualizerBarLineCap,
  VoiceVisualizerBarOrigin,
  VoiceVisualizerParticipantType,
  VoiceVisualizerProps,
} from "./types/voiceVisualizer";

export type { PipecatBaseChildProps, PipecatBaseProps } from "./types/pipecat";
