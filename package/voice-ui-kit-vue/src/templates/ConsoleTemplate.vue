<template>
  <PipecatAppBase
    :client-options="clientOptions"
    :connect-params="connectParams"
    :init-devices-on-mount="!noAutoInitDevices"
    :no-audio-output="noAudioOutput"
    :start-bot-params="startBotParams"
    :start-bot-response-transformer="startBotResponseTransformer"
    :theme-props="{ defaultTheme: currentTheme }"
    :transport-options="transportOptions"
    :transport-type="transportType"
    @initialized="onInitialized"
  >
    <template #default="{ client, error, handleConnect, handleDisconnect }">
      <section :class="['vuk-console-template', className]">
        <header :class="['vuk-console-header', classNames?.header]">
          <span class="vuk-console-logo">{{ noLogo ? '' : logoLabel }}</span>
          <strong class="vuk-console-title">{{ titleText }}</strong>
          <div class="vuk-console-actions">
            <button
              v-if="!noThemeSwitch"
              class="vuk-console-theme-button"
              type="button"
              @click="toggleTheme"
            >
              Theme
            </button>
            <ConnectButton
              :on-connect="handleConnect"
              :on-disconnect="handleDisconnect"
            />
          </div>
        </header>

        <ErrorCard v-if="error">{{ error }}</ErrorCard>

        <div
          v-else-if="!client"
          class="vuk-console-loading"
        >
          Initializing client...
        </div>

        <div v-else :class="['vuk-console-main', classNames?.main]">
          <div v-if="!noBotAudio" class="vuk-console-visualizer-wrap">
            <VoiceVisualizer participant-type="bot" :class="classNames?.visualizer" />
          </div>

          <ControlBar :class-name="classNames?.controlBar">
            <UserAudioControl v-if="!noUserAudio" />
            <UserVideoControl v-if="!noUserVideo" :no-video="true" no-device-picker />
            <ControlBarDivider />
            <ConnectButton
              :on-connect="handleConnect"
              :on-disconnect="handleDisconnect"
            />
          </ControlBar>

          <section v-if="!noStatusInfo" class="vuk-console-block">
            <h3>Status</h3>
            <ClientStatus :class-names="{ container: classNames?.status }" />
          </section>

          <section v-if="!noSessionInfo" class="vuk-console-block">
            <h3>Session</h3>
            <dl class="vuk-console-session">
              <dt>Participant ID</dt>
              <dd>{{ participantId || '-' }}</dd>
              <dt>Session ID</dt>
              <dd>{{ sessionId || '-' }}</dd>
              <dt>RTVI</dt>
              <dd>{{ noRTVI ? 'disabled' : serverRTVIVersion || 'unknown' }}</dd>
            </dl>
          </section>

          <section v-if="!noConversation" class="vuk-console-block">
            <h3>Conversation</h3>
            <p class="vuk-console-muted">
              Labels: assistant={{ assistantLabelText || 'assistant' }},
              user={{ userLabelText || 'user' }},
              system={{ systemLabelText || 'system' }}
            </p>
            <input
              v-if="!noTextInput"
              class="vuk-console-input"
              placeholder="Type a message"
              type="text"
            />
          </section>

          <section v-if="!noMetrics" class="vuk-console-block">
            <h3>Metrics</h3>
            <p class="vuk-console-muted">Metrics panel parity scaffold.</p>
          </section>

          <section v-if="!noBotVideo" class="vuk-console-block">
            <h3>Bot Video</h3>
            <p class="vuk-console-muted">Bot video parity scaffold.</p>
          </section>
        </div>
      </section>
    </template>
  </PipecatAppBase>
</template>

<script setup lang="ts">
import {
  RTVIEvent,
  type PipecatClient,
  type PipecatClientOptions,
} from "@pipecat-ai/client-js";
import { computed, onUnmounted, ref, watch } from "vue";

import ClientStatus from "../components/ClientStatus.vue";
import ConnectButton from "../components/ConnectButton.vue";
import ControlBar from "../components/ControlBar.vue";
import ControlBarDivider from "../components/ControlBarDivider.vue";
import ErrorCard from "../components/ErrorCard.vue";
import PipecatAppBase from "../components/PipecatAppBase.vue";
import UserAudioControl from "../components/UserAudioControl.vue";
import UserVideoControl from "../components/UserVideoControl.vue";
import VoiceVisualizer from "../components/VoiceVisualizer.vue";
import type { ConsoleTemplateProps } from "../types/consoleTemplate";

const props = withDefaults(defineProps<ConsoleTemplateProps>(), {
  transportType: "smallwebrtc",
  noAudioOutput: false,
  noAutoInitDevices: false,
  noRTVI: false,
  noUserAudio: false,
  noUserVideo: false,
  noScreenControl: false,
  noTextInput: false,
  noBotAudio: false,
  noBotVideo: true,
  noThemeSwitch: false,
  noLogo: false,
  noSessionInfo: false,
  noStatusInfo: false,
  noConversation: false,
  noMetrics: false,
  titleText: "Pipecat Playground",
  theme: "system",
  className: "",
});

const currentTheme = ref(props.theme);
const participantId = ref("");
const sessionId = ref("");

const clientOptions = computed<Partial<PipecatClientOptions>>(() => {
  return props.clientOptions || {
    enableCam: false,
    enableMic: true,
  };
});

const logoLabel = computed(() => props.logoComponent || "Pipecat");

const toggleTheme = () => {
  currentTheme.value = currentTheme.value === "dark" ? "light" : "dark";
};

watch(
  () => props.theme,
  (value) => {
    currentTheme.value = value;
  },
);

const bindClientEvents = (client: PipecatClient | null) => {
  if (!client) {
    return () => {};
  }

  const onParticipantConnected = (p: { id?: string; local?: boolean }) => {
    if (p.local) {
      participantId.value = p.id || "";
    }
  };

  const onTrackStarted = (_track: unknown, p?: { id?: string; local?: boolean }) => {
    if (p?.local && p.id) {
      participantId.value = p.id;
    }
  };

  const onBotStarted = (data: { sessionId?: string }) => {
    if (data?.sessionId) {
      sessionId.value = data.sessionId;
    }
  };

  const onServerMessage = (data: unknown) => {
    props.onServerMessage?.(data);
  };

  client.on(RTVIEvent.ParticipantConnected, onParticipantConnected as never);
  client.on(RTVIEvent.TrackStarted, onTrackStarted as never);
  client.on(RTVIEvent.BotStarted, onBotStarted as never);
  client.on(RTVIEvent.ServerMessage, onServerMessage as never);

  return () => {
    client.off(RTVIEvent.ParticipantConnected, onParticipantConnected as never);
    client.off(RTVIEvent.TrackStarted, onTrackStarted as never);
    client.off(RTVIEvent.BotStarted, onBotStarted as never);
    client.off(RTVIEvent.ServerMessage, onServerMessage as never);
  };
};

let cleanupClientEvents = () => {};

watch(
  () => props,
  () => {
    // Keep reactive dependency in template props set; no-op.
  },
);

watch(
  () => participantId.value,
  () => {
    // no-op; avoids lint complaints for parity placeholders.
  },
);

watch(
  () => sessionId.value,
  () => {
    // no-op; avoids lint complaints for parity placeholders.
  },
);

watch(
  () => props.transportType,
  () => {
    // placeholder for codec settings parity (smallwebrtc).
  },
);

const onInitialized = (client: PipecatClient) => {
  cleanupClientEvents();
  cleanupClientEvents = bindClientEvents(client);
};

onUnmounted(() => {
  cleanupClientEvents();
});

watch(
  () => props.onServerMessage,
  () => {
    // ensure prop tracked
  },
);

defineExpose({ onInitialized });

const {
  assistantLabelText,
  className,
  classNames,
  connectParams,
  noAudioOutput,
  noAutoInitDevices,
  noBotAudio,
  noBotVideo,
  noConversation,
  noLogo,
  noMetrics,
  noRTVI,
  noSessionInfo,
  noStatusInfo,
  noTextInput,
  noThemeSwitch,
  noUserAudio,
  noUserVideo,
  serverRTVIVersion,
  startBotParams,
  startBotResponseTransformer,
  systemLabelText,
  theme,
  titleText,
  transportOptions,
  transportType,
  userLabelText,
} = props;
</script>

<style scoped>
.vuk-console-template {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.vuk-console-header {
  align-items: center;
  display: grid;
  gap: 0.5rem;
  grid-template-columns: 130px 1fr auto;
}

.vuk-console-logo {
  color: #374151;
  font-weight: 700;
}

.vuk-console-title {
  text-align: center;
}

.vuk-console-actions {
  align-items: center;
  display: inline-flex;
  gap: 0.45rem;
}

.vuk-console-theme-button {
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.75rem;
  padding: 0.4rem 0.7rem;
}

.vuk-console-loading {
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 8rem;
}

.vuk-console-main {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.vuk-console-visualizer-wrap {
  min-height: 3.5rem;
}

.vuk-console-block {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.7rem 0.9rem;
}

.vuk-console-block h3 {
  font-size: 0.9rem;
  margin: 0 0 0.45rem;
}

.vuk-console-muted {
  color: #6b7280;
  font-size: 0.8rem;
  margin: 0;
}

.vuk-console-session {
  display: grid;
  gap: 0.3rem;
  grid-template-columns: 1fr 1fr;
  margin: 0;
}

.vuk-console-session dt {
  color: #6b7280;
  font-size: 0.75rem;
}

.vuk-console-session dd {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.75rem;
  margin: 0;
  text-align: right;
}

.vuk-console-input {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.45rem 0.6rem;
  width: 100%;
}

@media (max-width: 720px) {
  .vuk-console-header {
    grid-template-columns: 1fr;
  }

  .vuk-console-title {
    text-align: left;
  }
}
</style>
