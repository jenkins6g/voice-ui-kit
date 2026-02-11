<template>
  <div v-if="noThemeProvider">
    <slot
      :client="client"
      :error="error"
      :handleConnect="handleConnect"
      :handleDisconnect="handleDisconnect"
      :isConnected="isConnected"
      :isConnecting="isConnecting"
      :rawStartBotResponse="rawStartBotResponse"
      :transformedStartBotResponse="transformedStartBotResponse"
      :transportState="transportState"
    />
  </div>

  <ThemeProvider
    v-else
    :class-name="themeProps?.className"
    :default-theme="themeProps?.defaultTheme"
  >
    <slot
      :client="client"
      :error="error"
      :handleConnect="handleConnect"
      :handleDisconnect="handleDisconnect"
      :isConnected="isConnected"
      :isConnecting="isConnecting"
      :rawStartBotResponse="rawStartBotResponse"
      :transformedStartBotResponse="transformedStartBotResponse"
      :transportState="transportState"
    />
  </ThemeProvider>

  <audio
    v-if="!noAudioOutput"
    ref="remoteAudioRef"
    autoplay
    playsinline
    style="display: none"
  />
</template>

<script setup lang="ts">
import {
  PipecatClient,
  RTVIEvent,
  TransportStateEnum,
  type Participant,
  type TransportConnectionParams,
  type TransportState,
} from "@pipecat-ai/client-js";
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from "vue";

import {
  createTransport,
  type DailyTransportOptions,
  type SmallWebRTCTransportOptions,
  type TransportType,
} from "../lib/transports";
import { providePipecatApp } from "../composables/pipecatApp";
import ThemeProvider from "./ThemeProvider.vue";
import type { PipecatBaseProps } from "../types/pipecat";

const props = withDefaults(defineProps<PipecatBaseProps>(), {
  connectOnMount: false,
  initDevicesOnMount: false,
  noAudioOutput: false,
  noThemeProvider: false,
  transportType: "smallwebrtc",
  startBotResponseTransformer: (
    response: TransportConnectionParams,
  ): TransportConnectionParams => response,
});

const emit = defineEmits<{
  connect: [];
  disconnect: [];
  error: [message: string];
  initialized: [client: PipecatClient];
  transportStateChanged: [state: TransportState];
}>();

const client = shallowRef<PipecatClient | null>(null);
const error = ref<string | null>(null);
const isMuted = ref(false);
const rawStartBotResponse = ref<TransportConnectionParams | unknown>(null);
const transformedStartBotResponse = ref<TransportConnectionParams | unknown>(
  null,
);
const transportState = ref<TransportState>(TransportStateEnum.DISCONNECTED);

const remoteAudioRef = ref<HTMLAudioElement | null>(null);
const remoteAudioStream = new MediaStream();

const isConnected = computed(
  () =>
    transportState.value === TransportStateEnum.CONNECTED ||
    transportState.value === TransportStateEnum.READY,
);

const isConnecting = computed(
  () =>
    transportState.value === TransportStateEnum.INITIALIZING ||
    transportState.value === TransportStateEnum.AUTHENTICATING ||
    transportState.value === TransportStateEnum.CONNECTING,
);

const applyMuteToClient = () => {
  if (!client.value) {
    return;
  }

  client.value.enableMic(!isMuted.value);
};

const toggleMute = () => {
  isMuted.value = !isMuted.value;
  applyMuteToClient();
};

const setError = (message: string) => {
  error.value = message;
  emit("error", message);
};

const applyIceConfigIfPresent = (response: unknown) => {
  if (props.transportType !== "smallwebrtc") {
    return;
  }

  if (typeof response !== "object" || response === null) {
    return;
  }

  if (!("iceConfig" in response)) {
    return;
  }

  const iceConfig = (response as { iceConfig?: { iceServers?: RTCIceServer[] } })
    .iceConfig;

  if (!iceConfig?.iceServers || !client.value) {
    return;
  }

  const transport = client.value.transport as { iceServers?: RTCIceServer[] };
  transport.iceServers = iceConfig.iceServers;
};

const startAndConnect = async (pcClient: PipecatClient) => {
  try {
    if (props.startBotParams) {
      const response = await pcClient.startBot({
        requestData: {},
        ...props.startBotParams,
      });

      rawStartBotResponse.value = response;
      applyIceConfigIfPresent(response);

      const transformed = await props.startBotResponseTransformer(
        response as TransportConnectionParams,
      );
      transformedStartBotResponse.value = transformed;
      await pcClient.connect(transformed);
      emit("connect");
      return;
    }

    await pcClient.connect(props.connectParams ?? {});
    emit("connect");
  } catch (err) {
    const message =
      err instanceof Error
        ? `Failed to start session: ${err.message}`
        : `Failed to start session: ${String(err)}`;
    setError(message);
  }
};

const handleConnect = async () => {
  if (!client.value) {
    return;
  }

  const connectableStates: TransportState[] = [
    TransportStateEnum.INITIALIZED,
    TransportStateEnum.DISCONNECTED,
    TransportStateEnum.ERROR,
  ];

  if (!connectableStates.includes(client.value.state)) {
    return;
  }

  error.value = null;
  await startAndConnect(client.value);
};

const handleDisconnect = async () => {
  if (!client.value) {
    return;
  }

  await client.value.disconnect();
  emit("disconnect");
};

const attachRemoteAudio = () => {
  const el = remoteAudioRef.value;
  if (!el) {
    return;
  }

  el.srcObject = remoteAudioStream;
  el.muted = !!props.noAudioOutput;
};

const clearRemoteAudioTracks = () => {
  remoteAudioStream.getTracks().forEach((track) => {
    remoteAudioStream.removeTrack(track);
    track.stop();
  });
};

let removeTransportStateListener: (() => void) | null = null;
let removeDisconnectedListener: (() => void) | null = null;
let removeTrackStartedListener: (() => void) | null = null;
let removeTrackStoppedListener: (() => void) | null = null;

const initClient = async () => {
  try {
    const transport = await createTransport(
      props.transportType as TransportType,
      props.transportOptions as
        | DailyTransportOptions
        | SmallWebRTCTransportOptions
        | undefined,
    );

    const pcClient = new PipecatClient({
      enableCam: false,
      enableMic: true,
      transport,
      ...props.clientOptions,
    });

    client.value = pcClient;
    transportState.value = pcClient.state;
    isMuted.value = !pcClient.isMicEnabled;

    const onTransportStateChanged = (state: TransportState) => {
      transportState.value = state;
      emit("transportStateChanged", state);
    };

    const onDisconnected = () => {
      transportState.value = TransportStateEnum.DISCONNECTED;
      clearRemoteAudioTracks();
    };

    const onTrackStarted = (track: MediaStreamTrack, participant?: Participant) => {
      if (props.noAudioOutput || track.kind !== "audio") {
        return;
      }

      if (participant?.local) {
        return;
      }

      if (!remoteAudioStream.getTracks().some((t) => t.id === track.id)) {
        remoteAudioStream.addTrack(track);
        attachRemoteAudio();
      }
    };

    const onTrackStopped = (track: MediaStreamTrack) => {
      if (track.kind !== "audio") {
        return;
      }

      remoteAudioStream.getTracks().forEach((existingTrack) => {
        if (existingTrack.id === track.id) {
          remoteAudioStream.removeTrack(existingTrack);
        }
      });
    };

    pcClient.on(RTVIEvent.Disconnected, onDisconnected);
    pcClient.on(RTVIEvent.TransportStateChanged, onTransportStateChanged);
    pcClient.on(RTVIEvent.TrackStarted, onTrackStarted);
    pcClient.on(RTVIEvent.TrackStopped, onTrackStopped);

    removeTransportStateListener = () => {
      pcClient.off(RTVIEvent.TransportStateChanged, onTransportStateChanged);
    };
    removeDisconnectedListener = () => {
      pcClient.off(RTVIEvent.Disconnected, onDisconnected);
    };
    removeTrackStartedListener = () => {
      pcClient.off(RTVIEvent.TrackStarted, onTrackStarted);
    };
    removeTrackStoppedListener = () => {
      pcClient.off(RTVIEvent.TrackStopped, onTrackStopped);
    };

    emit("initialized", pcClient);

    if (props.initDevicesOnMount) {
      await pcClient.initDevices();
      isMuted.value = !pcClient.isMicEnabled;
    }

    if (props.connectOnMount) {
      await startAndConnect(pcClient);
    }
  } catch (err) {
    const message =
      err instanceof Error
        ? `Failed to initialize transport: ${err.message}`
        : `Failed to initialize transport: ${String(err)}`;
    setError(message);
  }
};

watch(
  () => props.noAudioOutput,
  () => {
    attachRemoteAudio();
    if (props.noAudioOutput) {
      clearRemoteAudioTracks();
    }
  },
);

onMounted(() => {
  attachRemoteAudio();
  void initClient();
});

onUnmounted(async () => {
  removeTransportStateListener?.();
  removeDisconnectedListener?.();
  removeTrackStartedListener?.();
  removeTrackStoppedListener?.();
  clearRemoteAudioTracks();

  if (client.value) {
    await client.value.disconnect();
  }

  client.value = null;
  error.value = null;
  transportState.value = TransportStateEnum.DISCONNECTED;
});

const { noAudioOutput, noThemeProvider, themeProps } = props;

providePipecatApp({
  client,
  error,
  isMuted,
  rawStartBotResponse,
  transformedStartBotResponse,
  transportState,
  isConnected,
  isConnecting,
  handleConnect,
  handleDisconnect,
  toggleMute,
});
</script>
