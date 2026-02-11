<template>
  <article class="vuk-card">
    <header v-if="title || subtitle" class="vuk-card-header">
      <h4 v-if="title">{{ title }}</h4>
      <p v-if="subtitle">{{ subtitle }}</p>
    </header>
    <section class="vuk-card-content">
      <slot />
    </section>
  </article>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
  }>(),
  {
    title: "",
    subtitle: "",
  },
);
</script>

<style scoped>
.vuk-card { background: #fff; border: 1px solid #d1d5db; border-radius: 0.6rem; padding: 0.8rem; }
.vuk-card-header h4 { font-size: 0.92rem; margin: 0; }
.vuk-card-header p { color: #6b7280; font-size: 0.8rem; margin: 0.2rem 0 0; }
.vuk-card-content { margin-top: 0.55rem; }
</style>
