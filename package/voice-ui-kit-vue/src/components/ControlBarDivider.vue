<template>
  <div :class="['vuk-control-bar-divider', className]" />
</template>

<script setup lang="ts">
defineProps<{
  className?: string;
}>();
</script>

<style scoped>
.vuk-control-bar-divider {
  align-self: stretch;
  background: #d1d5db;
  margin: 0 0.5rem;
  width: 1px;
}
</style>
