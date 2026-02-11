<template>
  <span :class="ledClass" />
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    state?: "on" | "off";
    color?: "green" | "red" | "yellow";
    pulse?: boolean;
    size?: "sm" | "md" | "lg";
  }>(),
  {
    state: "on",
    color: "green",
    pulse: false,
    size: "md",
  },
);

const ledClass = computed(() => [
  "vuk-led",
  `vuk-led--${props.color}`,
  `vuk-led--${props.size}`,
  props.state === "off" ? "vuk-led--off" : "",
  props.pulse ? "vuk-led--pulse" : "",
]);
</script>

<style scoped>
.vuk-led { border-radius: 999px; display: inline-block; }
.vuk-led--sm { height: 0.5rem; width: 0.5rem; }
.vuk-led--md { height: 0.65rem; width: 0.65rem; }
.vuk-led--lg { height: 0.8rem; width: 0.8rem; }
.vuk-led--green { background: #22c55e; box-shadow: 0 0 0.4rem #22c55e80; }
.vuk-led--red { background: #ef4444; box-shadow: 0 0 0.4rem #ef444480; }
.vuk-led--yellow { background: #eab308; box-shadow: 0 0 0.4rem #eab30880; }
.vuk-led--off { opacity: 0.35; }
.vuk-led--pulse { animation: vuk-led-pulse 1.2s infinite; }
@keyframes vuk-led-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
</style>
