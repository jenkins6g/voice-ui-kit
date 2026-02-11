export { default as DummyComponent } from "./components/DummyComponent.vue";

export { default as PipecatAppBase } from "./components/PipecatAppBase.vue";
export { default as ConnectButton } from "./components/ConnectButton.vue";
export { default as ControlBar } from "./components/ControlBar.vue";
export { default as UserAudioControl } from "./components/UserAudioControl.vue";
export { default as VoiceVisualizer } from "./components/VoiceVisualizer.vue";
export { default as ErrorCard } from "./components/ErrorCard.vue";

export {
  createPipecatAppContext,
  providePipecatApp,
  tryUsePipecatApp,
  usePipecatApp,
  type PipecatAppContext,
} from "./composables/pipecatApp";
