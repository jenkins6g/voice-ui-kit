<template>
  <div :class="dividerClass" />
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    orientation?: "horizontal" | "vertical";
  }>(),
  { orientation: "horizontal" },
);

const dividerClass = computed(() => ["vuk-divider", `vuk-divider--${props.orientation}`]);
</script>

<style scoped>
.vuk-divider { background: #d1d5db; }
.vuk-divider--horizontal { height: 1px; width: 100%; }
.vuk-divider--vertical { height: 1.2rem; width: 1px; }
</style>
