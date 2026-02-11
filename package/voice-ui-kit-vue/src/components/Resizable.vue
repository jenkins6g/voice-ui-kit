<template>
  <div class="vuk-resizable" :style="{ resize: direction }">
    <slot>Drag bottom-right corner to resize</slot>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    direction?: "both" | "horizontal" | "vertical";
  }>(),
  {
    direction: "both",
  },
);
</script>

<style scoped>
.vuk-resizable {
  border: 1px dashed #9ca3af;
  border-radius: 0.45rem;
  min-height: 4rem;
  min-width: 10rem;
  overflow: auto;
  padding: 0.6rem;
}
</style>
