export { default as DummyComponent } from "./components/DummyComponent.vue";

export { default as PipecatAppBase } from "./components/PipecatAppBase.vue";
export { default as ConnectButton } from "./components/ConnectButton.vue";
export { default as ControlBar } from "./components/ControlBar.vue";
export { default as UserAudioControl } from "./components/UserAudioControl.vue";
export { default as VoiceVisualizer } from "./components/VoiceVisualizer.vue";
export { default as ErrorCard } from "./components/ErrorCard.vue";

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
  ConnectButtonProps,
  ConnectButtonSize,
  ConnectButtonStateContent,
  ConnectButtonVariant,
} from "./types/connectButton";

export type {
  UserAudioControlButtonProps,
  UserAudioControlClassNames,
  UserAudioControlProps,
  UserAudioControlSize,
  UserAudioControlState,
  UserAudioControlVariant,
} from "./types/userAudioControl";

export type {
  VoiceVisualizerBarLineCap,
  VoiceVisualizerBarOrigin,
  VoiceVisualizerParticipantType,
  VoiceVisualizerProps,
} from "./types/voiceVisualizer";

export type { PipecatBaseChildProps, PipecatBaseProps } from "./types/pipecat";
