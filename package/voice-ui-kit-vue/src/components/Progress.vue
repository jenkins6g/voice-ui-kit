<template>
  <div class="vuk-progress">
    <div class="vuk-progress-bar" :style="{ width: `${safeValue}%` }" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    value?: number;
  }>(),
  {
    value: 45,
  },
);

const safeValue = computed(() => Math.min(100, Math.max(0, props.value)));
</script>

<style scoped>
.vuk-progress {
  background: #e5e7eb;
  border-radius: 999px;
  height: 0.55rem;
  overflow: hidden;
  width: 100%;
}
.vuk-progress-bar {
  background: #111827;
  border-radius: 999px;
  height: 100%;
  transition: width 0.2s ease;
}
</style>
