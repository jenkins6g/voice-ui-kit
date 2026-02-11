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
    <template #default="{ client, error, handleConnect, handleDisconnect, transportState }">
      <section :class="['vuk-console-template', className]">
        <header :class="['vuk-console-header', classNames?.header]">
          <span class="vuk-console-logo">{{ noLogo ? '' : logoLabel }}</span>
          <strong class="vuk-console-title">{{ resolvedTitle }}</strong>
          <div class="vuk-console-actions">
            <button
              v-if="!noThemeSwitch"
              class="vuk-console-theme-button"
              type="button"
              @click="toggleTheme"
            >
              Theme
            </button>
            <button
              v-if="!noInfoPanel"
              class="vuk-console-panel-button"
              type="button"
              @click="toggleInfoPanel"
            >
              {{ isInfoPanelCollapsed ? 'Show Info' : 'Hide Info' }}
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

        <div
          v-else
          ref="desktopRootRef"
          :class="['vuk-console-main', classNames?.main]"
          data-testid="console-main"
        >
          <section class="vuk-console-desktop" data-testid="desktop-layout">
            <div class="vuk-console-desktop-main" :style="desktopMainStyle">
              <div
                v-if="hasMediaPanel"
                class="vuk-console-desktop-panel"
                :style="panelStyle('media')"
                data-testid="desktop-media-panel"
              >
                <section class="vuk-console-block">
                  <h3>Bot</h3>
                  <div v-if="!noBotAudio" class="vuk-console-visualizer-wrap">
                    <VoiceVisualizer participant-type="bot" :class="classNames?.visualizer" />
                  </div>
                  <div v-if="!noBotVideo" class="vuk-console-video-wrap">
                    <video
                      ref="desktopBotVideoRef"
                      autoplay
                      muted
                      playsinline
                      class="vuk-console-video"
                      data-testid="bot-video-desktop"
                    />
                    <p v-if="!hasBotVideoTrack" class="vuk-console-muted">Waiting for bot video…</p>
                  </div>
                </section>
              </div>

              <button
                v-if="showDesktopHandle('media', 'conversation')"
                class="vuk-console-handle vuk-console-handle-vertical"
                type="button"
                aria-label="Resize media and conversation"
                data-testid="desktop-handle-media-conversation"
                @pointerdown="startHorizontalDrag($event, 'media', 'conversation')"
              />

              <div
                v-if="hasConversationPanel"
                class="vuk-console-desktop-panel"
                :style="panelStyle('conversation')"
                data-testid="desktop-conversation-panel"
              >
                <section class="vuk-console-block vuk-console-conversation-block">
                  <header class="vuk-console-block-tabs">
                    <button
                      v-if="!noConversation"
                      :class="['vuk-console-tab', { 'is-active': conversationTab === 'conversation' }]"
                      type="button"
                      data-testid="conversation-tab-conversation"
                      @click="conversationTab = 'conversation'"
                    >
                      Conversation
                    </button>
                    <button
                      v-if="!noMetrics"
                      :class="['vuk-console-tab', { 'is-active': conversationTab === 'metrics' }]"
                      type="button"
                      data-testid="conversation-tab-metrics"
                      @click="conversationTab = 'metrics'"
                    >
                      Metrics
                    </button>
                  </header>

                  <div
                    v-if="conversationTab === 'conversation' && !noConversation"
                    class="vuk-console-panel-content"
                    data-testid="conversation-panel"
                  >
                    <ul class="vuk-console-conversation-list">
                      <li
                        v-for="message in conversationMessages"
                        :key="message.id"
                        class="vuk-console-conversation-item"
                      >
                        <strong>{{ roleLabel(message.role) }}</strong>
                        <span>{{ renderedMessageText(message) }}</span>
                        <span
                          v-if="props.conversationElementProps?.showTimestamps"
                          class="vuk-console-msg-time"
                        >
                          {{ shortTime(message.createdAt) }}
                        </span>
                      </li>
                      <li v-if="!conversationMessages.length" class="vuk-console-muted">
                        No messages yet.
                      </li>
                    </ul>
                    <div v-if="!resolvedNoTextInput" class="vuk-console-input-row">
                      <input
                        v-model="pendingMessage"
                        class="vuk-console-input"
                        :disabled="!canSendForState(transportState) || isSendingText"
                        placeholder="Type a message"
                        type="text"
                        data-testid="conversation-input"
                        @keydown.enter.prevent="handleSendText(client, transportState)"
                      />
                      <button
                        class="vuk-console-send-button"
                        type="button"
                        :disabled="!canSendForState(transportState) || !pendingMessage.trim() || isSendingText"
                        data-testid="conversation-send"
                        @click="handleSendText(client, transportState)"
                      >
                        Send
                      </button>
                    </div>
                  </div>

                  <div
                    v-if="conversationTab === 'metrics' && !noMetrics"
                    class="vuk-console-panel-content"
                    data-testid="metrics-panel"
                  >
                    <div class="vuk-console-metrics-summary" data-testid="metrics-summary">
                      <div class="vuk-console-metric-chip">
                        <span>Prompt</span>
                        <strong>{{ tokenMetrics.prompt_tokens }}</strong>
                      </div>
                      <div class="vuk-console-metric-chip">
                        <span>Completion</span>
                        <strong>{{ tokenMetrics.completion_tokens }}</strong>
                      </div>
                      <div class="vuk-console-metric-chip">
                        <span>Total</span>
                        <strong>{{ tokenMetrics.total_tokens }}</strong>
                      </div>
                    </div>
                    <p
                      v-if="!metricsEntries.length && !canSendForState(transportState)"
                      class="vuk-console-muted"
                    >
                      Connect to an agent to view metrics in real-time.
                    </p>
                    <p
                      v-else-if="!metricsEntries.length"
                      class="vuk-console-muted"
                    >
                      Waiting for metrics data...
                    </p>
                    <ul class="vuk-console-event-list" data-testid="metrics-list">
                      <li v-for="metric in metricsEntries" :key="metric.id" class="vuk-console-event-item">
                        <span class="vuk-console-event-time">{{ metric.time }}</span>
                        <span class="vuk-console-event-name">metrics</span>
                        <span class="vuk-console-event-message">{{ metric.message }}</span>
                      </li>
                    </ul>
                  </div>
                </section>
              </div>

              <button
                v-if="showDesktopHandle('conversation', 'info')"
                class="vuk-console-handle vuk-console-handle-vertical"
                type="button"
                aria-label="Resize conversation and info"
                data-testid="desktop-handle-conversation-info"
                @pointerdown="startHorizontalDrag($event, 'conversation', 'info')"
              />

              <div
                v-if="!noInfoPanel"
                class="vuk-console-desktop-panel"
                :style="panelStyle('info')"
                :data-collapsed="isInfoPanelCollapsed ? 'true' : 'false'"
                data-testid="desktop-info-panel"
              >
                <section class="vuk-console-block">
                  <h3>Info</h3>
                  <div v-if="isInfoPanelCollapsed">
                    <div class="vuk-console-collapsed-actions">
                      <button
                        v-if="!noStatusInfo"
                        :class="['vuk-console-mini-tab', { 'is-active': collapsedInfoView === 'status' }]"
                        type="button"
                        @click="collapsedInfoView = 'status'"
                      >
                        Status
                      </button>
                      <button
                        v-if="!noDevices"
                        :class="['vuk-console-mini-tab', { 'is-active': collapsedInfoView === 'devices' }]"
                        type="button"
                        @click="collapsedInfoView = 'devices'"
                      >
                        Devices
                      </button>
                      <button
                        v-if="!noSessionInfo"
                        :class="['vuk-console-mini-tab', { 'is-active': collapsedInfoView === 'session' }]"
                        type="button"
                        @click="collapsedInfoView = 'session'"
                      >
                        Session
                      </button>
                    </div>
                    <ClientStatus
                      v-if="collapsedInfoView === 'status' && !noStatusInfo"
                      :class-names="{ container: classNames?.status }"
                    />
                    <div
                      v-if="collapsedInfoView === 'devices' && !noDevices"
                      class="vuk-console-controls-grid"
                    >
                      <UserAudioControl v-if="!noUserAudio" />
                      <UserVideoControl v-if="!noUserVideo" :no-video="true" no-device-picker />
                      <UserScreenControl v-if="!noScreenControl" />
                    </div>
                    <dl v-if="collapsedInfoView === 'session' && !noSessionInfo" class="vuk-console-session">
                      <dt>Participant ID</dt>
                      <dd>{{ participantId || '-' }}</dd>
                      <dt>Session ID</dt>
                      <dd>{{ sessionId || '-' }}</dd>
                      <dt>RTVI</dt>
                      <dd>{{ noRTVI ? 'disabled' : serverRTVIVersion || 'unknown' }}</dd>
                    </dl>
                  </div>
                  <template v-else>
                    <ClientStatus
                      v-if="!noStatusInfo"
                      :class-names="{ container: classNames?.status }"
                    />
                    <div v-if="!noDevices" class="vuk-console-controls-grid">
                      <UserAudioControl v-if="!noUserAudio" />
                      <UserVideoControl v-if="!noUserVideo" :no-video="true" no-device-picker />
                      <UserScreenControl v-if="!noScreenControl" />
                    </div>
                    <dl v-if="!noSessionInfo" class="vuk-console-session">
                      <dt>Participant ID</dt>
                      <dd>{{ participantId || '-' }}</dd>
                      <dt>Session ID</dt>
                      <dd>{{ sessionId || '-' }}</dd>
                      <dt>RTVI</dt>
                      <dd>{{ noRTVI ? 'disabled' : serverRTVIVersion || 'unknown' }}</dd>
                    </dl>
                  </template>
                </section>
              </div>
            </div>

            <button
              class="vuk-console-handle vuk-console-handle-horizontal"
              type="button"
              aria-label="Resize main and events"
              data-testid="desktop-handle-main-events"
              @pointerdown="startVerticalDrag"
            />

            <section
              class="vuk-console-block vuk-console-events-panel"
              :style="desktopEventsStyle"
              data-testid="events-panel"
            >
              <header class="vuk-console-events-header">
                <h3>Events</h3>
                <input
                  v-model="eventFilter"
                  class="vuk-console-events-filter"
                  placeholder="Filter"
                  type="text"
                  data-testid="events-filter"
                />
              </header>
              <ul ref="eventsScrollRef" class="vuk-console-event-list">
                <li v-for="eventItem in filteredEvents" :key="eventItem.id" class="vuk-console-event-item">
                  <span class="vuk-console-event-time">{{ eventItem.time }}</span>
                  <span class="vuk-console-event-name">{{ eventItem.event }}</span>
                  <span class="vuk-console-event-message">{{ eventItem.message }}</span>
                </li>
                <li v-if="!filteredEvents.length" class="vuk-console-muted">No events yet.</li>
              </ul>
            </section>
          </section>

          <section class="vuk-console-mobile" data-testid="mobile-layout">
            <div class="vuk-console-mobile-content">
              <section
                v-if="mobileTab === 'bot' && hasMediaPanel"
                class="vuk-console-block"
                data-testid="mobile-tab-bot"
              >
                <h3>Bot</h3>
                <div v-if="!noBotAudio" class="vuk-console-visualizer-wrap">
                  <VoiceVisualizer participant-type="bot" />
                </div>
                <div v-if="!noBotVideo" class="vuk-console-video-wrap">
                  <video
                    ref="mobileBotVideoRef"
                    autoplay
                    muted
                    playsinline
                    class="vuk-console-video"
                    data-testid="bot-video-mobile"
                  />
                  <p v-if="!hasBotVideoTrack" class="vuk-console-muted">Waiting for bot video…</p>
                </div>
              </section>

              <section
                v-if="mobileTab === 'conversation' && hasConversationPanel"
                class="vuk-console-block"
                data-testid="mobile-tab-conversation"
              >
                <h3>Conversation</h3>
                <ul class="vuk-console-conversation-list">
                  <li
                    v-for="message in conversationMessages"
                    :key="message.id"
                    class="vuk-console-conversation-item"
                  >
                    <strong>{{ roleLabel(message.role) }}</strong>
                    <span>{{ renderedMessageText(message) }}</span>
                    <span
                      v-if="props.conversationElementProps?.showTimestamps"
                      class="vuk-console-msg-time"
                    >
                      {{ shortTime(message.createdAt) }}
                    </span>
                  </li>
                  <li v-if="!conversationMessages.length" class="vuk-console-muted">
                    No messages yet.
                  </li>
                </ul>
                <div v-if="!resolvedNoTextInput" class="vuk-console-input-row">
                  <input
                    v-model="pendingMessage"
                    class="vuk-console-input"
                    :disabled="!canSendForState(transportState) || isSendingText"
                    placeholder="Type a message"
                    type="text"
                    data-testid="mobile-conversation-input"
                    @keydown.enter.prevent="handleSendText(client, transportState)"
                  />
                  <button
                    class="vuk-console-send-button"
                    type="button"
                    :disabled="!canSendForState(transportState) || !pendingMessage.trim() || isSendingText"
                    data-testid="mobile-conversation-send"
                    @click="handleSendText(client, transportState)"
                  >
                    Send
                  </button>
                </div>
              </section>

              <section
                v-if="mobileTab === 'info' && !noInfoPanel"
                class="vuk-console-block"
                data-testid="mobile-tab-info"
              >
                <h3>Info</h3>
                <ClientStatus v-if="!noStatusInfo" />
                <div v-if="!noDevices" class="vuk-console-controls-grid">
                  <UserAudioControl v-if="!noUserAudio" />
                  <UserVideoControl v-if="!noUserVideo" :no-video="true" no-device-picker />
                  <UserScreenControl v-if="!noScreenControl" />
                </div>
                <dl v-if="!noSessionInfo" class="vuk-console-session">
                  <dt>Participant ID</dt>
                  <dd>{{ participantId || '-' }}</dd>
                  <dt>Session ID</dt>
                  <dd>{{ sessionId || '-' }}</dd>
                </dl>
              </section>

              <section
                v-if="mobileTab === 'events'"
                class="vuk-console-block"
                data-testid="mobile-tab-events"
              >
                <h3>Events</h3>
                <ul class="vuk-console-event-list">
                  <li v-for="eventItem in filteredEvents" :key="eventItem.id" class="vuk-console-event-item">
                    <span class="vuk-console-event-time">{{ eventItem.time }}</span>
                    <span class="vuk-console-event-name">{{ eventItem.event }}</span>
                    <span class="vuk-console-event-message">{{ eventItem.message }}</span>
                  </li>
                  <li v-if="!filteredEvents.length" class="vuk-console-muted">No events yet.</li>
                </ul>
              </section>
            </div>

            <nav class="vuk-console-mobile-tabs">
              <button
                v-if="hasMediaPanel"
                :class="['vuk-console-mobile-tab', { 'is-active': mobileTab === 'bot' }]"
                type="button"
                data-testid="mobile-trigger-bot"
                @click="mobileTab = 'bot'"
              >
                Bot
              </button>
              <button
                v-if="hasConversationPanel"
                :class="['vuk-console-mobile-tab', { 'is-active': mobileTab === 'conversation' }]"
                type="button"
                data-testid="mobile-trigger-conversation"
                @click="mobileTab = 'conversation'"
              >
                Conversation
              </button>
              <button
                v-if="!noInfoPanel"
                :class="['vuk-console-mobile-tab', { 'is-active': mobileTab === 'info' }]"
                type="button"
                data-testid="mobile-trigger-info"
                @click="mobileTab = 'info'"
              >
                Info
              </button>
              <button
                :class="['vuk-console-mobile-tab', { 'is-active': mobileTab === 'events' }]"
                type="button"
                data-testid="mobile-trigger-events"
                @click="mobileTab = 'events'"
              >
                Events
              </button>
            </nav>
          </section>
        </div>
      </section>
    </template>
  </PipecatAppBase>
</template>

<script setup lang="ts">
import {
  type BotOutputData,
  type PipecatMetricsData,
  RTVIEvent,
  type SendTextOptions,
  TransportStateEnum,
  type PipecatClient,
  type PipecatClientOptions,
  type TransportState,
} from "@pipecat-ai/client-js";
import {
  computed,
  nextTick,
  onUnmounted,
  ref,
  watch,
} from "vue";

import ClientStatus from "../components/ClientStatus.vue";
import ConnectButton from "../components/ConnectButton.vue";
import ErrorCard from "../components/ErrorCard.vue";
import PipecatAppBase from "../components/PipecatAppBase.vue";
import UserAudioControl from "../components/UserAudioControl.vue";
import UserScreenControl from "../components/UserScreenControl.vue";
import UserVideoControl from "../components/UserVideoControl.vue";
import VoiceVisualizer from "../components/VoiceVisualizer.vue";
import { loadTransport } from "../lib/transports";
import type { ConsoleTemplateProps } from "../types/consoleTemplate";

type PanelKey = "media" | "conversation" | "info";
type MobileTab = "bot" | "conversation" | "info" | "events";
type CollapsedInfoView = "status" | "devices" | "session";

type ConversationMessage = {
  id: string;
  role: "assistant" | "user" | "system";
  parts: Array<{
    text: string;
    final: boolean;
    createdAt: string;
  }>;
  final: boolean;
  createdAt: string;
};

type EventEntry = {
  id: string;
  event: string;
  message: string;
  time: string;
};

type MetricsEntry = {
  id: string;
  time: string;
  message: string;
};

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
  theme: "system",
  className: "",
  audioCodec: "default",
  videoCodec: "default",
  collapseInfoPanel: false,
  collapseMediaPanel: false,
});

const currentTheme = ref(props.theme);
const participantId = ref("");
const sessionId = ref("");

const conversationMessages = ref<ConversationMessage[]>([]);
const pendingMessage = ref("");
const isSendingText = ref(false);
const metricsEntries = ref<MetricsEntry[]>([]);
const tokenMetrics = ref({
  prompt_tokens: 0,
  completion_tokens: 0,
  total_tokens: 0,
});
const events = ref<EventEntry[]>([]);
const eventFilter = ref("");
const shouldAutoScrollEvents = ref(true);

const desktopRootRef = ref<HTMLElement | null>(null);
const eventsScrollRef = ref<HTMLElement | null>(null);
const desktopBotVideoRef = ref<HTMLVideoElement | null>(null);
const mobileBotVideoRef = ref<HTMLVideoElement | null>(null);
const initializedClient = ref<PipecatClient | null>(null);
const botVideoTrackId = ref<string | null>(null);

const panelSizes = ref<Record<PanelKey, number>>({
  media: props.collapseMediaPanel ? 8 : 26,
  conversation: props.collapseInfoPanel ? 70 : 47,
  info: props.collapseInfoPanel ? 4 : 27,
});
const verticalSizes = ref({
  main: 70,
  events: 30,
});
const isInfoPanelCollapsed = ref(props.collapseInfoPanel);
const isBotAreaCollapsed = ref(props.collapseMediaPanel);
const collapsedInfoView = ref<CollapsedInfoView>("status");

const mobileTab = ref<MobileTab>("events");
const conversationTab = ref(props.noConversation ? "metrics" : "conversation");
const hasSetInitialMobileTab = ref(false);

const clientOptions = computed<Partial<PipecatClientOptions>>(() => {
  return props.clientOptions || {
    enableCam: false,
    enableMic: true,
  };
});

const logoLabel = computed(() => props.logoComponent || "Pipecat");
const resolvedTitle = computed(() => props.titleText ?? props.title ?? "Pipecat Playground");
const resolvedNoTextInput = computed(
  () => props.noTextInput || props.conversationElementProps?.noTextInput === true,
);

const noDevices = computed(
  () => props.noUserAudio && props.noUserVideo && props.noScreenControl,
);
const noInfoPanel = computed(
  () => props.noStatusInfo && noDevices.value && props.noSessionInfo,
);
const hasMediaPanel = computed(() => !(props.noBotAudio && props.noBotVideo));
const hasConversationPanel = computed(() => !(props.noConversation && props.noMetrics));
const hasBotVideoTrack = computed(() => botVideoTrackId.value !== null);

const filteredEvents = computed(() => {
  const filter = eventFilter.value.trim().toLowerCase();
  if (!filter) {
    return events.value;
  }

  return events.value.filter((item) => {
    return (
      item.event.toLowerCase().includes(filter) ||
      item.message.toLowerCase().includes(filter)
    );
  });
});

const visibleDesktopPanels = computed<PanelKey[]>(() => {
  const result: PanelKey[] = [];
  if (hasMediaPanel.value) {
    result.push("media");
  }
  if (hasConversationPanel.value) {
    result.push("conversation");
  }
  if (!noInfoPanel.value) {
    result.push("info");
  }
  return result;
});

const desktopMainStyle = computed(() => {
  return {
    height: `${verticalSizes.value.main}%`,
  };
});

const desktopEventsStyle = computed(() => {
  return {
    height: `${verticalSizes.value.events}%`,
  };
});

const panelStyle = (panel: PanelKey) => {
  const visible = visibleDesktopPanels.value;
  if (!visible.length) {
    return { width: "100%" };
  }

  if (!visible.includes(panel)) {
    return { display: "none" };
  }

  const sum = visible.reduce((acc, key) => acc + panelSizes.value[key], 0);
  const width = sum === 0 ? 100 / visible.length : (panelSizes.value[panel] / sum) * 100;

  return {
    width: `${Math.max(width, 0)}%`,
  };
};

const minPanelSize = (panel: PanelKey) => {
  if (panel === "media") {
    return isBotAreaCollapsed.value ? 8 : 10;
  }
  if (panel === "conversation") {
    return 30;
  }
  return isInfoPanelCollapsed.value ? 4 : 15;
};

const defaultMobileTab = (): MobileTab => {
  if (hasMediaPanel.value) {
    return "bot";
  }
  if (hasConversationPanel.value) {
    return "conversation";
  }
  if (!noInfoPanel.value) {
    return "info";
  }
  return "events";
};

const showDesktopHandle = (left: PanelKey, right: PanelKey) => {
  return visibleDesktopPanels.value.includes(left) && visibleDesktopPanels.value.includes(right);
};

const toggleTheme = () => {
  currentTheme.value = currentTheme.value === "dark" ? "light" : "dark";
};

const toggleInfoPanel = () => {
  isInfoPanelCollapsed.value = !isInfoPanelCollapsed.value;
  panelSizes.value.info = isInfoPanelCollapsed.value ? 4 : 27;
};

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const createSafeMediaStream = () => {
  if (typeof MediaStream !== "undefined") {
    return new MediaStream();
  }

  const tracks: MediaStreamTrack[] = [];
  return {
    addTrack(track: MediaStreamTrack) {
      tracks.push(track);
    },
    removeTrack(track: MediaStreamTrack) {
      const index = tracks.findIndex((item) => item.id === track.id);
      if (index >= 0) {
        tracks.splice(index, 1);
      }
    },
    getTracks() {
      return [...tracks];
    },
  } as unknown as MediaStream;
};
const botVideoStream = createSafeMediaStream();

const formatNow = () => new Date().toLocaleTimeString();

const roleLabel = (role: ConversationMessage["role"]) => {
  if (role === "assistant") {
    return (
      props.conversationElementProps?.assistantLabel ||
      props.assistantLabelText ||
      "assistant"
    );
  }
  if (role === "user") {
    return props.conversationElementProps?.clientLabel || props.userLabelText || "user";
  }
  return props.conversationElementProps?.systemLabel || props.systemLabelText || "system";
};

const messageText = (message: ConversationMessage) => {
  return message.parts.map((part) => part.text).join("");
};

const shortTime = (isoDate: string) => {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }
  return parsed.toLocaleTimeString();
};

const renderedMessageText = (message: ConversationMessage) => {
  const text = messageText(message);
  if (!props.conversationElementProps?.messageFormatter) {
    return text;
  }

  return props.conversationElementProps.messageFormatter({
    role: message.role,
    text,
    createdAt: message.createdAt,
  });
};

const pushEvent = (event: string, message: string) => {
  const scrollEl = eventsScrollRef.value;
  if (scrollEl) {
    const distanceFromBottom = scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight;
    shouldAutoScrollEvents.value = distanceFromBottom <= 4;
  }

  events.value.push({
    id: makeId(),
    event,
    message,
    time: formatNow(),
  });

  if (events.value.length > 300) {
    events.value.splice(0, events.value.length - 300);
  }
};

const pushMetric = (message: string) => {
  metricsEntries.value.push({
    id: makeId(),
    time: formatNow(),
    message,
  });
};

const summarizeMetrics = (data: PipecatMetricsData) => {
  const ttfbCount = data.ttfb?.length || 0;
  const processingCount = data.processing?.length || 0;
  const charactersCount = data.characters?.length || 0;
  const processors = (data.ttfb || [])
    .map((item) => item.processor)
    .filter(Boolean)
    .slice(0, 3)
    .join(", ");

  const headline = [
    ttfbCount ? `ttfb:${ttfbCount}` : "",
    processingCount ? `processing:${processingCount}` : "",
    charactersCount ? `chars:${charactersCount}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return processors ? `${headline} [${processors}]` : headline || JSON.stringify(data);
};

const injectMessage = (message: {
  role: "assistant" | "user" | "system";
  parts: Array<{ text: string; final: boolean; createdAt: string }>;
}) => {
  const normalizedParts = message.parts
    .filter((part) => typeof part.text === "string")
    .map((part) => ({
      text: part.text,
      final: !!part.final,
      createdAt: part.createdAt || new Date().toISOString(),
    }));

  if (!normalizedParts.length) {
    return;
  }

  const isFinal = normalizedParts.every((part) => part.final);
  const createdAt = normalizedParts[0]?.createdAt || new Date().toISOString();
  const lastMessage = conversationMessages.value[conversationMessages.value.length - 1];

  if (lastMessage && lastMessage.role === message.role && !lastMessage.final) {
    lastMessage.parts.push(...normalizedParts);
    lastMessage.final = isFinal;
    if (props.conversationElementProps?.maxMessages && conversationMessages.value.length > props.conversationElementProps.maxMessages) {
      conversationMessages.value = conversationMessages.value.slice(
        conversationMessages.value.length - props.conversationElementProps.maxMessages,
      );
    }
    return;
  }

  conversationMessages.value.push({
    id: makeId(),
    role: message.role,
    parts: normalizedParts,
    final: isFinal,
    createdAt,
  });

  if (props.conversationElementProps?.maxMessages && conversationMessages.value.length > props.conversationElementProps.maxMessages) {
    conversationMessages.value = conversationMessages.value.slice(
      conversationMessages.value.length - props.conversationElementProps.maxMessages,
    );
  }
};

const sendMessage = async (client: PipecatClient, text: string) => {
  const sendText = (
    client as unknown as { sendText?: (message: string, options?: SendTextOptions) => Promise<void> }
  ).sendText;
  if (!sendText) {
    throw new Error("sendText is not available on client");
  }

  await sendText(text, props.conversationElementProps?.sendTextOptions);
};

const canSendForState = (transportState?: TransportState) => {
  return (
    transportState === TransportStateEnum.CONNECTED ||
    transportState === TransportStateEnum.READY
  );
};

const handleSendText = async (client: PipecatClient, transportState?: TransportState) => {
  if (!pendingMessage.value.trim() || isSendingText.value) {
    return;
  }

  if (!canSendForState(transportState)) {
    return;
  }

  const text = pendingMessage.value.trim();

  isSendingText.value = true;

  try {
    if (!props.conversationElementProps?.noInject) {
      injectMessage({
        role: "user",
        parts: [
          {
            text,
            final: true,
            createdAt: new Date().toISOString(),
          },
        ],
      });
    }

    await sendMessage(client, text);
    pendingMessage.value = "";
  } catch (error) {
    pushEvent("sendText", `Failed to send text: ${String(error)}`);
  } finally {
    isSendingText.value = false;
  }
};

const startHorizontalDrag = (event: PointerEvent, left: PanelKey, right: PanelKey) => {
  const container = desktopRootRef.value;
  if (!container) {
    return;
  }

  const width = container.getBoundingClientRect().width || 1000;

  const startX = event.clientX;
  const startLeft = panelSizes.value[left];
  const startRight = panelSizes.value[right];

  const onMove = (moveEvent: PointerEvent) => {
    const deltaPercent = ((moveEvent.clientX - startX) / width) * 100;
    const nextLeft = startLeft + deltaPercent;
    const nextRight = startRight - deltaPercent;
    const minLeft = minPanelSize(left);
    const minRight = minPanelSize(right);
    const maxLeft = left === "media" ? 30 : 90;
    const maxRight = right === "media" ? 30 : 90;

    if (
      nextLeft < minLeft ||
      nextRight < minRight ||
      nextLeft > maxLeft ||
      nextRight > maxRight
    ) {
      return;
    }

    panelSizes.value[left] = nextLeft;
    panelSizes.value[right] = nextRight;
  };

  const onUp = () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  };

  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
};

const startVerticalDrag = (event: PointerEvent) => {
  const container = desktopRootRef.value;
  if (!container) {
    return;
  }

  const height = container.getBoundingClientRect().height || 1000;

  const startY = event.clientY;
  const startMain = verticalSizes.value.main;
  const startEvents = verticalSizes.value.events;

  const onMove = (moveEvent: PointerEvent) => {
    const deltaPercent = ((moveEvent.clientY - startY) / height) * 100;
    const nextMain = startMain + deltaPercent;
    const nextEvents = startEvents - deltaPercent;

    if (nextMain < 50 || nextEvents < 7) {
      return;
    }

    verticalSizes.value.main = nextMain;
    verticalSizes.value.events = nextEvents;
  };

  const onUp = () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  };

  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
};

watch(
  () => props.theme,
  (value) => {
    currentTheme.value = value;
  },
);

watch(
  [hasMediaPanel, hasConversationPanel, noInfoPanel],
  () => {
    if (!hasSetInitialMobileTab.value) {
      mobileTab.value = defaultMobileTab();
      hasSetInitialMobileTab.value = true;
      return;
    }

    const current = mobileTab.value;
    const currentAllowed =
      (current === "bot" && hasMediaPanel.value) ||
      (current === "conversation" && hasConversationPanel.value) ||
      (current === "info" && !noInfoPanel.value) ||
      current === "events";

    if (!currentAllowed) {
      mobileTab.value = defaultMobileTab();
    }
  },
  { immediate: true },
);

watch(
  () => props.noConversation,
  (noConversation) => {
    if (noConversation && conversationTab.value === "conversation") {
      conversationTab.value = "metrics";
    }
  },
);

watch(
  [() => props.noStatusInfo, noDevices, () => props.noSessionInfo],
  () => {
    if (!props.noStatusInfo) {
      collapsedInfoView.value = "status";
      return;
    }
    if (!noDevices.value) {
      collapsedInfoView.value = "devices";
      return;
    }
    collapsedInfoView.value = "session";
  },
  { immediate: true },
);

watch(
  () => props.onInjectMessage,
  (onInjectMessage) => {
    onInjectMessage?.(injectMessage);
  },
  { immediate: true },
);

const attachBotVideo = () => {
  [desktopBotVideoRef.value, mobileBotVideoRef.value].forEach((el) => {
    if (!el) {
      return;
    }

    el.srcObject = botVideoStream;
  });
};

const setBotVideoTrack = (track: MediaStreamTrack | null) => {
  botVideoStream.getTracks().forEach((existingTrack) => {
    botVideoStream.removeTrack(existingTrack);
  });

  botVideoTrackId.value = track?.id ?? null;

  if (track) {
    botVideoStream.addTrack(track);
  }

  attachBotVideo();
};

watch(filteredEvents, () => {
  void nextTick(() => {
    const el = eventsScrollRef.value;
    if (!el) {
      return;
    }

    if (!shouldAutoScrollEvents.value) {
      return;
    }

    el.scrollTop = el.scrollHeight;
  });
});

const bindClientEvents = (client: PipecatClient | null) => {
  if (!client) {
    return () => {};
  }

  const onParticipantConnected = (participant: { id?: string; local?: boolean }) => {
    if (participant.local) {
      participantId.value = participant.id || "";
    }

    pushEvent(RTVIEvent.ParticipantConnected, `Participant connected: ${participant.id || 'unknown'}`);
  };

  const onTrackStarted = (
    track: MediaStreamTrack,
    participant?: { id?: string; local?: boolean },
  ) => {
    if (participant?.local && participant.id) {
      participantId.value = participant.id;
    }

    if (track.kind === "video" && participant?.local === false) {
      setBotVideoTrack(track);
    }

    pushEvent(
      RTVIEvent.TrackStarted,
      `Track started: ${track.kind || 'unknown'} for ${participant?.id || 'unknown'}`,
    );
  };

  const onTrackStopped = (track: MediaStreamTrack, participant?: { id?: string; local?: boolean }) => {
    if (track.kind === "video" && participant?.local === false && botVideoTrackId.value === track.id) {
      setBotVideoTrack(null);
    }

    pushEvent(
      RTVIEvent.TrackStopped,
      `Track stopped: ${track.kind || "unknown"} for ${participant?.id || "unknown"}`,
    );
  };

  const onBotStarted = (data: { sessionId?: string }) => {
    if (data?.sessionId) {
      sessionId.value = data.sessionId;
    }

    pushEvent(RTVIEvent.BotStarted, `Bot started: ${JSON.stringify(data)}`);
  };

  const onServerMessage = (data: unknown) => {
    props.onServerMessage?.(data);
    pushEvent(RTVIEvent.ServerMessage, `Server message: ${JSON.stringify(data)}`);
  };

  const onMetrics = (data: PipecatMetricsData) => {
    pushMetric(summarizeMetrics(data));
    const tokens = (data as { tokens?: Array<{ prompt_tokens?: number; completion_tokens?: number; total_tokens?: number }> }).tokens;
    if (Array.isArray(tokens) && tokens[0]) {
      tokenMetrics.value = {
        prompt_tokens: tokenMetrics.value.prompt_tokens + (tokens[0].prompt_tokens || 0),
        completion_tokens: tokenMetrics.value.completion_tokens + (tokens[0].completion_tokens || 0),
        total_tokens: tokenMetrics.value.total_tokens + (tokens[0].total_tokens || 0),
      };
    }
  };

  const onBotOutput = (data: BotOutputData) => {
    if (typeof data.text === "string" && data.text.trim()) {
      injectMessage({
        role: "assistant",
        parts: [
          {
            text: data.text,
            final: data.aggregated_by !== "word",
            createdAt: new Date().toISOString(),
          },
        ],
      });
    }

    if (data.aggregated_by !== "word") {
      pushEvent(RTVIEvent.BotOutput, `Bot output: ${JSON.stringify(data)}`);
    }
  };

  const onBotStoppedSpeaking = () => {
    const last = conversationMessages.value[conversationMessages.value.length - 1];
    if (last && last.role === "assistant") {
      last.final = true;
      last.parts = last.parts.map((part) => ({ ...part, final: true }));
    }
  };

  const onConnected = () => pushEvent(RTVIEvent.Connected, "Client connected");
  const onDisconnected = () => {
    pushEvent(RTVIEvent.Disconnected, "Client disconnected");
    tokenMetrics.value = {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    };
  };
  const onError = (data: unknown) => pushEvent(RTVIEvent.Error, `Error: ${JSON.stringify(data)}`);
  const onTransportStateChanged = (state: TransportState) =>
    pushEvent("transportState", `Transport state changed: ${state}`);
  const onBotConnected = (participant: { id?: string }) =>
    pushEvent(RTVIEvent.BotConnected, `Bot connected: ${participant.id || "unknown"}`);
  const onBotDisconnected = (participant: { id?: string }) =>
    pushEvent(RTVIEvent.BotDisconnected, `Bot disconnected: ${participant.id || "unknown"}`);
  const onBotReady = (data: { version?: string; about?: unknown }) =>
    pushEvent(RTVIEvent.BotReady, `Bot ready (v${data.version || "unknown"}): ${JSON.stringify(data.about || {})}`);
  const onParticipantLeft = (participant: { id?: string }) =>
    pushEvent(RTVIEvent.ParticipantLeft, `Participant left: ${participant.id || "unknown"}`);
  const onUserStartedSpeaking = () => pushEvent(RTVIEvent.UserStartedSpeaking, "User started speaking");
  const onUserStoppedSpeaking = () => pushEvent(RTVIEvent.UserStoppedSpeaking, "User stopped speaking");
  const onBotStartedSpeaking = () => pushEvent(RTVIEvent.BotStartedSpeaking, "Bot started speaking");
  const onScreenTrackStarted = (track: MediaStreamTrack, participant?: { id?: string }) =>
    pushEvent(
      RTVIEvent.ScreenTrackStarted,
      `Screen track started: ${track.kind || "unknown"} for ${participant?.id || "unknown"}`,
    );
  const onScreenTrackStopped = (track: MediaStreamTrack, participant?: { id?: string }) =>
    pushEvent(
      RTVIEvent.ScreenTrackStopped,
      `Screen track stopped: ${track.kind || "unknown"} for ${participant?.id || "unknown"}`,
    );
  const onUserTranscript = (data: { text?: string }) => {
    if (data?.text) {
      injectMessage({
        role: "user",
        parts: [{ text: data.text, final: true, createdAt: new Date().toISOString() }],
      });
    }
    pushEvent(RTVIEvent.UserTranscript, `User transcript: ${data?.text || ""}`);
  };
  const onBotTranscript = (data: { text?: string }) => {
    if (data?.text) {
      injectMessage({
        role: "assistant",
        parts: [{ text: data.text, final: true, createdAt: new Date().toISOString() }],
      });
    }
    pushEvent(RTVIEvent.BotTranscript, `Bot transcript: ${data?.text || ""}`);
  };

  client.on(RTVIEvent.ParticipantConnected, onParticipantConnected as never);
  client.on(RTVIEvent.ParticipantLeft, onParticipantLeft as never);
  client.on(RTVIEvent.BotConnected, onBotConnected as never);
  client.on(RTVIEvent.BotDisconnected, onBotDisconnected as never);
  client.on(RTVIEvent.BotReady, onBotReady as never);
  client.on(RTVIEvent.TrackStarted, onTrackStarted as never);
  client.on(RTVIEvent.TrackStopped, onTrackStopped as never);
  client.on(RTVIEvent.ScreenTrackStarted, onScreenTrackStarted as never);
  client.on(RTVIEvent.ScreenTrackStopped, onScreenTrackStopped as never);
  client.on(RTVIEvent.BotStarted, onBotStarted as never);
  client.on(RTVIEvent.ServerMessage, onServerMessage as never);
  client.on(RTVIEvent.Metrics, onMetrics as never);
  client.on(RTVIEvent.BotOutput, onBotOutput as never);
  client.on(RTVIEvent.UserTranscript, onUserTranscript as never);
  client.on(RTVIEvent.BotTranscript, onBotTranscript as never);
  client.on(RTVIEvent.BotStartedSpeaking, onBotStartedSpeaking as never);
  client.on(RTVIEvent.UserStartedSpeaking, onUserStartedSpeaking as never);
  client.on(RTVIEvent.UserStoppedSpeaking, onUserStoppedSpeaking as never);
  client.on(RTVIEvent.BotStoppedSpeaking, onBotStoppedSpeaking as never);
  client.on(RTVIEvent.TransportStateChanged, onTransportStateChanged as never);
  client.on(RTVIEvent.Connected, onConnected as never);
  client.on(RTVIEvent.Disconnected, onDisconnected as never);
  client.on(RTVIEvent.Error, onError as never);

  return () => {
    client.off(RTVIEvent.ParticipantConnected, onParticipantConnected as never);
    client.off(RTVIEvent.ParticipantLeft, onParticipantLeft as never);
    client.off(RTVIEvent.BotConnected, onBotConnected as never);
    client.off(RTVIEvent.BotDisconnected, onBotDisconnected as never);
    client.off(RTVIEvent.BotReady, onBotReady as never);
    client.off(RTVIEvent.TrackStarted, onTrackStarted as never);
    client.off(RTVIEvent.TrackStopped, onTrackStopped as never);
    client.off(RTVIEvent.ScreenTrackStarted, onScreenTrackStarted as never);
    client.off(RTVIEvent.ScreenTrackStopped, onScreenTrackStopped as never);
    client.off(RTVIEvent.BotStarted, onBotStarted as never);
    client.off(RTVIEvent.ServerMessage, onServerMessage as never);
    client.off(RTVIEvent.Metrics, onMetrics as never);
    client.off(RTVIEvent.BotOutput, onBotOutput as never);
    client.off(RTVIEvent.UserTranscript, onUserTranscript as never);
    client.off(RTVIEvent.BotTranscript, onBotTranscript as never);
    client.off(RTVIEvent.BotStartedSpeaking, onBotStartedSpeaking as never);
    client.off(RTVIEvent.UserStartedSpeaking, onUserStartedSpeaking as never);
    client.off(RTVIEvent.UserStoppedSpeaking, onUserStoppedSpeaking as never);
    client.off(RTVIEvent.BotStoppedSpeaking, onBotStoppedSpeaking as never);
    client.off(RTVIEvent.TransportStateChanged, onTransportStateChanged as never);
    client.off(RTVIEvent.Connected, onConnected as never);
    client.off(RTVIEvent.Disconnected, onDisconnected as never);
    client.off(RTVIEvent.Error, onError as never);
  };
};

let cleanupClientEvents = () => {};

const applySmallWebRTCCodecs = async () => {
  const client = initializedClient.value;
  if (!client || props.transportType !== "smallwebrtc") {
    return;
  }

  try {
    const { SmallWebRTCTransport } = await loadTransport("smallwebrtc");
    const transport = client.transport as unknown;
    if (!(transport instanceof SmallWebRTCTransport)) {
      return;
    }

    if (props.audioCodec) {
      transport.setAudioCodec(props.audioCodec);
    }

    if (props.videoCodec) {
      transport.setVideoCodec(props.videoCodec);
    }
  } catch (error) {
    pushEvent("codec", `Failed to apply codecs: ${String(error)}`);
  }
};

const onInitialized = (client: PipecatClient) => {
  cleanupClientEvents();
  cleanupClientEvents = bindClientEvents(client);
  initializedClient.value = client;

  void applySmallWebRTCCodecs();
  pushEvent("initialized", `RTVI Client initialized (version ${client.version})`);
};

onUnmounted(() => {
  cleanupClientEvents();
  setBotVideoTrack(null);
});

watch(
  [
    () => initializedClient.value,
    () => props.audioCodec,
    () => props.videoCodec,
    () => props.transportType,
  ],
  () => {
    void applySmallWebRTCCodecs();
  },
);

watch([desktopBotVideoRef, mobileBotVideoRef], () => {
  attachBotVideo();
});

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

void assistantLabelText;
void systemLabelText;
void theme;
void titleText;
void userLabelText;
</script>

<style scoped>
.vuk-console-template {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-height: 36rem;
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

.vuk-console-theme-button,
.vuk-console-panel-button,
.vuk-console-tab,
.vuk-console-mini-tab,
.vuk-console-mobile-tab,
.vuk-console-send-button {
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.75rem;
  padding: 0.4rem 0.7rem;
}

.vuk-console-tab.is-active,
.vuk-console-mini-tab.is-active,
.vuk-console-mobile-tab.is-active {
  background: #111827;
  border-color: #111827;
  color: #fff;
}

.vuk-console-send-button:disabled,
.vuk-console-theme-button:disabled,
.vuk-console-panel-button:disabled,
.vuk-console-mobile-tab:disabled {
  cursor: default;
  opacity: 0.5;
}

.vuk-console-loading {
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 8rem;
}

.vuk-console-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 32rem;
}

.vuk-console-desktop {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 24rem;
}

.vuk-console-desktop-main {
  display: flex;
  flex: 0 0 auto;
  gap: 0.5rem;
  min-height: 12rem;
}

.vuk-console-desktop-panel {
  min-width: 0;
}

.vuk-console-block {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 100%;
  padding: 0.7rem 0.9rem;
}

.vuk-console-block h3 {
  font-size: 0.9rem;
  margin: 0;
}

.vuk-console-block-tabs {
  display: inline-flex;
  gap: 0.35rem;
}

.vuk-console-conversation-block {
  overflow: hidden;
}

.vuk-console-panel-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.vuk-console-visualizer-wrap {
  min-height: 3.5rem;
}

.vuk-console-controls-grid {
  display: grid;
  gap: 0.5rem;
}

.vuk-console-collapsed-actions {
  display: inline-flex;
  gap: 0.35rem;
}

.vuk-console-mini-tab {
  padding: 0.3rem 0.55rem;
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

.vuk-console-conversation-list,
.vuk-console-event-list {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.35rem;
  list-style: none;
  margin: 0;
  min-height: 0;
  overflow: auto;
  padding: 0;
}

.vuk-console-conversation-item,
.vuk-console-event-item {
  align-items: baseline;
  display: grid;
  gap: 0.45rem;
}

.vuk-console-conversation-item {
  grid-template-columns: 5rem 1fr;
}

.vuk-console-msg-time {
  color: #6b7280;
  font-size: 0.7rem;
  grid-column: 2;
}

.vuk-console-event-item {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.72rem;
  grid-template-columns: minmax(3.5rem, auto) minmax(6rem, auto) 1fr;
}

.vuk-console-event-time {
  color: #6b7280;
}

.vuk-console-event-name {
  font-weight: 600;
}

.vuk-console-events-panel {
  min-height: 6rem;
}

.vuk-console-events-header {
  align-items: center;
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
}

.vuk-console-metrics-summary {
  display: grid;
  gap: 0.4rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.vuk-console-metric-chip {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.45rem;
  display: grid;
  gap: 0.15rem;
  padding: 0.35rem 0.45rem;
}

.vuk-console-metric-chip span {
  color: #6b7280;
  font-size: 0.68rem;
}

.vuk-console-metric-chip strong {
  font-size: 0.9rem;
}

.vuk-console-events-filter,
.vuk-console-input {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.45rem 0.6rem;
  width: 100%;
}

.vuk-console-video-wrap {
  align-items: center;
  background: #111827;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  min-height: 8rem;
  overflow: hidden;
  position: relative;
}

.vuk-console-video {
  aspect-ratio: 16 / 9;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.vuk-console-input-row {
  display: flex;
  gap: 0.4rem;
}

.vuk-console-handle {
  background: #e5e7eb;
  border: 0;
  border-radius: 999px;
  cursor: col-resize;
  flex: 0 0 auto;
}

.vuk-console-handle-vertical {
  width: 6px;
}

.vuk-console-handle-horizontal {
  cursor: row-resize;
  height: 6px;
  margin: 0.45rem 0;
  width: 100%;
}

.vuk-console-mobile {
  display: none;
  flex: 1;
  flex-direction: column;
  min-height: 22rem;
}

.vuk-console-mobile-content {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.vuk-console-mobile-tabs {
  display: grid;
  gap: 0.4rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

@media (max-width: 720px) {
  .vuk-console-header {
    grid-template-columns: 1fr;
  }

  .vuk-console-title {
    text-align: left;
  }

  .vuk-console-desktop {
    display: none;
  }

  .vuk-console-mobile {
    display: flex;
  }
}
</style>
