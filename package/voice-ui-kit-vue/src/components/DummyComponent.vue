<template>
  <div class="vuk-dummy">{{ text }}</div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    text?: string;
  }>(),
  {
    text: "Voice UI Kit Vue is ready.",
  },
);
</script>

<style scoped>
.vuk-dummy {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  color: #111827;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
  padding: 0.75rem 1rem;
}
</style>
