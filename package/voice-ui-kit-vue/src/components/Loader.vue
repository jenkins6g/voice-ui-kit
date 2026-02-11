<template>
  <span :class="loaderClass" />
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    size?: "sm" | "md" | "lg";
  }>(),
  {
    size: "md",
  },
);

const loaderClass = computed(() => ["vuk-loader", `vuk-loader--${props.size}`]);
</script>

<style scoped>
.vuk-loader {
  animation: vuk-loader-spin 0.8s linear infinite;
  border: 2px solid #d1d5db;
  border-top-color: #111827;
  border-radius: 999px;
  display: inline-block;
}
.vuk-loader--sm { height: 0.8rem; width: 0.8rem; }
.vuk-loader--md { height: 1rem; width: 1rem; }
.vuk-loader--lg { height: 1.25rem; width: 1.25rem; }
@keyframes vuk-loader-spin { to { transform: rotate(360deg); } }
</style>
