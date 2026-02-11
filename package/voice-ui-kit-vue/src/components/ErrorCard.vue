<template>
  <section class="vuk-error" role="alert">
    <slot>{{ message }}</slot>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string;
  }>(),
  {
    message: "Something went wrong.",
  },
);
</script>

<style scoped>
.vuk-error {
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.75rem;
  color: #991b1b;
  font-size: 0.875rem;
  padding: 0.75rem 1rem;
}
</style>
