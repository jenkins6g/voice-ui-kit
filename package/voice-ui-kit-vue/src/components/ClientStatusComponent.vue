<template>
  <span :class="valueClass">
    {{ transportState || '-' }}
    <span v-if="showSpinner" class="vuk-status-spinner">*</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type { ClientStatusComponentProps } from "../types/clientStatus";

const props = defineProps<ClientStatusComponentProps>();

const valueClass = computed(() => [
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
]);

const showSpinner = computed(() =>
  ["authenticating", "authenticated", "connecting"].includes(
    props.transportState || "",
  ),
);

const { transportState } = props;
</script>

<style scoped>
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

.vuk-status-spinner {
  display: inline-block;
  margin-left: 0.35rem;
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
