<template>
  <button :disabled="disabled || isConnecting" class="vuk-button" type="button" @click="onClick">
    {{ buttonLabel }}
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { usePipecatApp } from "../composables/pipecatApp";

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    labelConnect?: string;
    labelConnecting?: string;
    labelDisconnect?: string;
  }>(),
  {
    disabled: false,
    labelConnect: "Connect",
    labelConnecting: "Connecting...",
    labelDisconnect: "Disconnect",
  },
);

const context = usePipecatApp();

const isConnecting = computed(() => context.isConnecting.value);
const isConnected = computed(() => context.isConnected.value);

const buttonLabel = computed(() => {
  if (isConnecting.value) {
    return props.labelConnecting;
  }

  return isConnected.value ? props.labelDisconnect : props.labelConnect;
});

const onClick = async () => {
  if (isConnected.value) {
    await context.handleDisconnect();
    return;
  }

  await context.handleConnect();
};
</script>

<style scoped>
.vuk-button {
  background: #111827;
  border: 0;
  border-radius: 999px;
  color: #fff;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.625rem 1rem;
}

.vuk-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
