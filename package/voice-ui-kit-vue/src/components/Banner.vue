<template>
  <section :class="bannerClass" role="status">
    <strong>{{ title }}</strong>
    <p v-if="description">{{ description }}</p>
    <slot />
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    variant?: "info" | "success" | "warning" | "error";
  }>(),
  {
    title: "Banner",
    description: "",
    variant: "info",
  },
);

const bannerClass = computed(() => ["vuk-banner", `vuk-banner--${props.variant}`]);
</script>

<style scoped>
.vuk-banner { border: 1px solid; border-radius: 0.5rem; padding: 0.7rem 0.8rem; }
.vuk-banner p { margin: 0.25rem 0 0; font-size: 0.84rem; }
.vuk-banner--info { background: #eff6ff; border-color: #bfdbfe; color: #1e3a8a; }
.vuk-banner--success { background: #ecfdf5; border-color: #86efac; color: #166534; }
.vuk-banner--warning { background: #fffbeb; border-color: #fde68a; color: #92400e; }
.vuk-banner--error { background: #fef2f2; border-color: #fca5a5; color: #991b1b; }
</style>
