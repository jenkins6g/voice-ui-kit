import {
  TransportStateEnum,
  type PipecatClient,
  type TransportState,
} from "@pipecat-ai/client-js";
import {
  computed,
  defineComponent,
  h,
  ref,
  shallowRef,
  watch,
  type PropType,
} from "vue";

import { providePipecatApp } from "../composables/pipecatApp";

type EventHandler = (...args: unknown[]) => void;

const asMediaDevice = (
  deviceId: string,
  kind: MediaDeviceKind,
  label: string,
): MediaDeviceInfo => {
  return {
    deviceId,
    groupId: "storybook",
    kind,
    label,
    toJSON: () => ({ deviceId, groupId: "storybook", kind, label }),
  } as unknown as MediaDeviceInfo;
};

export const defaultMics = [
  asMediaDevice("mic-1", "audioinput", "Studio Mic"),
  asMediaDevice("mic-2", "audioinput", "Laptop Mic"),
];

export const defaultSpeakers = [
  asMediaDevice("spk-1", "audiooutput", "Studio Speakers"),
  asMediaDevice("spk-2", "audiooutput", "Laptop Speakers"),
];

export const defaultCams = [
  asMediaDevice("cam-1", "videoinput", "FaceTime HD Camera"),
  asMediaDevice("cam-2", "videoinput", "USB Camera"),
];

export type MockClientControls = {
  client: PipecatClient;
  emit: (event: string, ...args: unknown[]) => void;
};

export const createMockClient = (): MockClientControls => {
  const handlers = new Map<string, Set<EventHandler>>();

  let selectedMic: MediaDeviceInfo | Record<string, never> = defaultMics[0] ?? {};
  let selectedSpeaker: MediaDeviceInfo | Record<string, never> =
    defaultSpeakers[0] ?? {};
  let selectedCam: MediaDeviceInfo | Record<string, never> = defaultCams[0] ?? {};
  let isCamEnabled = true;
  let isSharingScreen = false;
  let isMicEnabled = true;

  const on = (event: string, handler: EventHandler) => {
    if (!handlers.has(event)) {
      handlers.set(event, new Set());
    }
    handlers.get(event)?.add(handler);
  };

  const off = (event: string, handler: EventHandler) => {
    handlers.get(event)?.delete(handler);
  };

  const emit = (event: string, ...args: unknown[]) => {
    handlers.get(event)?.forEach((handler) => handler(...args));
  };

  const client = {
    state: TransportStateEnum.READY,
    version: "1.5.0",
    transport: {},
    get selectedMic() {
      return selectedMic;
    },
    get selectedSpeaker() {
      return selectedSpeaker;
    },
    get selectedCam() {
      return selectedCam;
    },
    get isCamEnabled() {
      return isCamEnabled;
    },
    get isSharingScreen() {
      return isSharingScreen;
    },
    get isMicEnabled() {
      return isMicEnabled;
    },
    async getAllMics() {
      return defaultMics;
    },
    async getAllSpeakers() {
      return defaultSpeakers;
    },
    async getAllCams() {
      return defaultCams;
    },
    updateMic(deviceId: string) {
      selectedMic = defaultMics.find((device) => device.deviceId === deviceId) ?? selectedMic;
    },
    updateSpeaker(deviceId: string) {
      selectedSpeaker =
        defaultSpeakers.find((device) => device.deviceId === deviceId) ?? selectedSpeaker;
    },
    updateCam(deviceId: string) {
      selectedCam = defaultCams.find((device) => device.deviceId === deviceId) ?? selectedCam;
    },
    enableCam(enabled: boolean) {
      isCamEnabled = enabled;
    },
    enableMic(enabled: boolean) {
      isMicEnabled = enabled;
    },
    enableScreenShare(enabled: boolean) {
      isSharingScreen = enabled;
    },
    on,
    off,
  } as unknown as PipecatClient;

  return { client, emit };
};

export const MockPipecatProvider = defineComponent({
  name: "MockPipecatProvider",
  props: {
    client: {
      type: Object as PropType<PipecatClient | null>,
      default: null,
    },
    transportState: {
      type: String as PropType<TransportState>,
      default: TransportStateEnum.READY,
    },
    isMuted: {
      type: Boolean,
      default: false,
    },
    withClient: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { slots }) {
    const defaultClient = createMockClient().client;
    const transportState = ref<TransportState>(props.transportState);
    const isMuted = ref<boolean>(props.isMuted);
    const contextClient = shallowRef<PipecatClient | null>(
      props.withClient ? (props.client ?? defaultClient) : null,
    );

    watch(
      () => props.transportState,
      (next) => {
        transportState.value = next;
      },
      { immediate: true },
    );

    watch(
      () => props.isMuted,
      (next) => {
        isMuted.value = next;
      },
      { immediate: true },
    );

    watch(
      () => [props.client, props.withClient] as const,
      ([nextClient, withClient]) => {
        contextClient.value = withClient ? (nextClient ?? defaultClient) : null;
      },
      { immediate: true },
    );

    providePipecatApp({
      client: contextClient,
      error: ref(null),
      isMuted,
      rawStartBotResponse: ref(null),
      transformedStartBotResponse: ref(null),
      transportState,
      isConnected: computed(
        () => transportState.value === "connected" || transportState.value === "ready",
      ),
      isConnecting: computed(
        () =>
          transportState.value === "initializing" ||
          transportState.value === "authenticating" ||
          transportState.value === "authenticated" ||
          transportState.value === "connecting",
      ),
      handleConnect: async () => {
        transportState.value = TransportStateEnum.READY;
      },
      handleDisconnect: async () => {
        transportState.value = TransportStateEnum.DISCONNECTED;
      },
      toggleMute: () => {
        isMuted.value = !isMuted.value;
        contextClient.value?.enableMic(!isMuted.value);
      },
    });

    return () =>
      h(
        "div",
        {
          style: "display: inline-flex; flex-direction: column; gap: 0.75rem;",
        },
        slots.default?.(),
      );
  },
});
