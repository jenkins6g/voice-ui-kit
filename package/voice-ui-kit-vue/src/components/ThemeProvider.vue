<template>
  <div :class="['vuk-theme-provider', className]" :data-theme="resolvedTheme">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    defaultTheme?: string;
    className?: string;
  }>(),
  {
    defaultTheme: "system",
    className: "",
  },
);

const resolvedTheme = computed(() => props.defaultTheme || "system");
const { className } = props;
</script>

<style scoped>
.vuk-theme-provider[data-theme="light"] {
  color-scheme: light;
}

.vuk-theme-provider[data-theme="dark"] {
  color-scheme: dark;
}
</style>
