<template>
  <section class="vuk-panel">
    <header class="vuk-panel-header">
      <strong>{{ title }}</strong>
      <small v-if="subtitle">{{ subtitle }}</small>
    </header>
    <div class="vuk-panel-content">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
  }>(),
  {
    title: "Panel",
    subtitle: "",
  },
);
</script>

<style scoped>
.vuk-panel { border: 1px solid #d1d5db; border-radius: 0.5rem; overflow: hidden; }
.vuk-panel-header {
  background: #f8fafc;
  border-bottom: 1px solid #d1d5db;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  padding: 0.55rem 0.7rem;
}
.vuk-panel-header small { color: #6b7280; }
.vuk-panel-content { padding: 0.7rem; }
</style>
