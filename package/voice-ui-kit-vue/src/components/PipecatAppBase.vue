<template>
  <div>
    <slot
      :error="context.error"
      :handle-connect="context.handleConnect"
      :handle-disconnect="context.handleDisconnect"
      :is-connected="context.isConnected"
      :is-connecting="context.isConnecting"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import {
  createPipecatAppContext,
  providePipecatApp,
  type PipecatAppContext,
} from "../composables/pipecatApp";

defineProps<{
  connectParams?: Record<string, unknown>;
  initDevicesOnMount?: boolean;
  transportType?: "smallwebrtc" | "daily" | string;
  noThemeProvider?: boolean;
}>();

const emit = defineEmits<{
  connect: [];
  disconnect: [];
  error: [message: string];
}>();

const context: PipecatAppContext = createPipecatAppContext();

const originalConnect = context.handleConnect;
context.handleConnect = async () => {
  await originalConnect();
  if (context.error.value) {
    emit("error", context.error.value);
    return;
  }
  emit("connect");
};

const originalDisconnect = context.handleDisconnect;
context.handleDisconnect = async () => {
  await originalDisconnect();
  emit("disconnect");
};

providePipecatApp(context);

onMounted(() => {
  // Placeholder for device bootstrap and transport initialization.
});
</script>
