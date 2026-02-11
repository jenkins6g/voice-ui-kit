<template>
  <div :class="groupClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    vertical?: boolean;
  }>(),
  { vertical: false },
);

const groupClass = computed(() => [
  "vuk-button-group",
  props.vertical ? "vuk-button-group--vertical" : "vuk-button-group--horizontal",
]);
</script>

<style scoped>
.vuk-button-group { display: inline-flex; gap: 0.4rem; }
.vuk-button-group--vertical { flex-direction: column; }
.vuk-button-group--horizontal { flex-direction: row; }
</style>
