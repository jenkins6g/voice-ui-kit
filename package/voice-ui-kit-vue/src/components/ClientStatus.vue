<template>
  <dl
    v-if="!(noAgentState && noClientState)"
    :class="['vuk-data-list', classNames?.container]"
  >
    <template v-if="!noClientState">
      <dt :class="['vuk-data-list-key', classNames?.key]">Client</dt>
      <dd :class="['vuk-data-list-value', classNames?.value]">
        <ClientStatusComponent
          :class-name="classNames?.clientValue"
          :transport-state="transportState"
        />
      </dd>
    </template>

    <template v-if="!noAgentState">
      <dt :class="['vuk-data-list-key', classNames?.key]">Agent</dt>
      <dd :class="['vuk-data-list-value', classNames?.value]">
        <ClientStatusComponent
          :class-name="classNames?.agentValue"
          :transport-state="botStatus"
        />
      </dd>
    </template>
  </dl>
</template>

<script setup lang="ts">
import { RTVIEvent, type TransportState } from "@pipecat-ai/client-js";
import { computed, onUnmounted, ref, watch } from "vue";

import { usePipecatApp } from "../composables/pipecatApp";
import ClientStatusComponent from "./ClientStatusComponent.vue";
import type { ClientStatusProps } from "../types/clientStatus";

const props = withDefaults(defineProps<ClientStatusProps>(), {
  noAgentState: false,
  noClientState: false,
});

const context = usePipecatApp();
const botStatus = ref<"disconnected" | "connecting" | "connected" | "ready" | null>(
  null,
);
const transportState = computed(() => context.transportState.value);

const unsubs: Array<() => void> = [];

const attachClientListeners = () => {
  const client = context.client.value;
  if (!client || props.noAgentState) {
    return;
  }

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
.vuk-data-list {
  align-items: center;
  display: grid;
  gap: 0.45rem;
  grid-template-columns: 1fr 2fr;
}

.vuk-data-list-key {
  color: #6b7280;
  font-size: 0.82rem;
}

.vuk-data-list-value {
  font-size: 0.75rem;
  min-width: 0;
  text-align: right;
}
</style>
