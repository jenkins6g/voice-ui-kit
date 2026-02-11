<template>
  <div v-if="!(noAgentState && noClientState)" :class="['vuk-client-status', classNames?.root]">
    <div v-if="!noClientState" :class="['vuk-status-row', classNames?.row]">
      <span :class="['vuk-status-label', classNames?.label]">Client</span>
      <ClientStatusValue
        :class-name="classNames?.clientValue || classNames?.value"
        :transport-state="transportState"
      />
    </div>

    <div v-if="!noAgentState" :class="['vuk-status-row', classNames?.row]">
      <span :class="['vuk-status-label', classNames?.label]">Agent</span>
      <ClientStatusValue
        :class-name="classNames?.agentValue || classNames?.value"
        :transport-state="botStatus"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RTVIEvent, type TransportState } from "@pipecat-ai/client-js";
import { computed, defineComponent, h, onUnmounted, ref, watch } from "vue";

import { usePipecatApp } from "../composables/pipecatApp";
import type {
  ClientStatusComponentProps,
  ClientStatusProps,
} from "../types/clientStatus";

const ClientStatusValue = defineComponent<ClientStatusComponentProps>({
  name: "ClientStatusValue",
  props: {
    className: {
      type: String,
      default: "",
    },
    transportState: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    return () =>
      h(
        "span",
        {
          class: [
            "vuk-status-value",
            props.transportState === "connected" || props.transportState === "ready"
              ? "vuk-status-value--active"
              : "",
            props.transportState === "error" ? "vuk-status-value--error" : "",
            ["initializing", "authenticating", "authenticated", "connecting"].includes(
              props.transportState || "",
            )
              ? "vuk-status-value--pulse"
              : "",
            props.className,
          ],
        },
        props.transportState || "-",
      );
  },
});

const props = withDefaults(defineProps<ClientStatusProps>(), {
  noAgentState: false,
  noClientState: false,
});

const context = usePipecatApp();
const botStatus = ref<"disconnected" | "connecting" | "connected" | "ready" | null>(null);
const transportState = computed(() => context.transportState.value);

const unsubs: Array<() => void> = [];

const attachClientListeners = () => {
  const client = context.client.value;
  if (!client) {
    return;
  }

  if (!props.noAgentState) {
    const onBotReady = () => {
      botStatus.value = "ready";
    };
    const onBotConnected = () => {
      botStatus.value = "connected";
    };
    const onDisconnected = () => {
      botStatus.value = "disconnected";
    };
    const onBotDisconnected = () => {
      botStatus.value = "disconnected";
    };

    client.on(RTVIEvent.BotReady, onBotReady);
    client.on(RTVIEvent.BotConnected, onBotConnected);
    client.on(RTVIEvent.Disconnected, onDisconnected);
    client.on(RTVIEvent.BotDisconnected, onBotDisconnected);

    unsubs.push(() => client.off(RTVIEvent.BotReady, onBotReady));
    unsubs.push(() => client.off(RTVIEvent.BotConnected, onBotConnected));
    unsubs.push(() => client.off(RTVIEvent.Disconnected, onDisconnected));
    unsubs.push(() => client.off(RTVIEvent.BotDisconnected, onBotDisconnected));
  }
};

watch(
  () => context.transportState.value,
  (state: TransportState) => {
    if (!props.noAgentState && state === "connecting") {
      botStatus.value = "connecting";
    }
  },
  { immediate: true },
);

watch(
  () => context.client.value,
  () => {
    while (unsubs.length) {
      unsubs.pop()?.();
    }

    attachClientListeners();
  },
  { immediate: true },
);

onUnmounted(() => {
  while (unsubs.length) {
    unsubs.pop()?.();
  }
});

const { classNames, noAgentState, noClientState } = props;
</script>

<style scoped>
.vuk-client-status {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.vuk-status-row {
  align-items: center;
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
}

.vuk-status-label {
  color: #6b7280;
  font-size: 0.8rem;
  font-weight: 600;
}

.vuk-status-value {
  color: #6b7280;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.vuk-status-value--active {
  color: #166534;
}

.vuk-status-value--error {
  color: #991b1b;
}

.vuk-status-value--pulse {
  animation: vuk-status-pulse 1.2s ease-in-out infinite;
}

@keyframes vuk-status-pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.45;
  }
}
</style>
