<template>
  <span :class="badgeClass">
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    label?: string;
    color?:
      | "primary"
      | "secondary"
      | "destructive"
      | "warning"
      | "active"
      | "inactive"
      | "agent"
      | "client";
    variant?: "default" | "outline" | "filled";
    size?: "sm" | "md" | "lg";
    rounded?: "size" | "none" | "sm" | "md" | "lg" | "full";
    fullWidth?: boolean;
    uppercase?: boolean;
  }>(),
  {
    label: "Badge",
    color: "primary",
    variant: "default",
    size: "md",
    rounded: "size",
    fullWidth: false,
    uppercase: false,
  },
);

const resolvedRounded = computed(() => {
  if (props.rounded !== "size") {
    return props.rounded;
  }

  if (props.size === "sm") {
    return "sm";
  }
  if (props.size === "lg") {
    return "lg";
  }

  return "md";
});

const badgeClass = computed(() => [
  "vuk-badge",
  `vuk-badge--${props.color}`,
  `vuk-badge--variant-${props.variant}`,
  `vuk-badge--${props.size}`,
  `vuk-badge--rounded-${resolvedRounded.value}`,
  props.fullWidth ? "vuk-badge--full" : "",
  props.uppercase ? "vuk-badge--uppercase" : "",
]);
</script>

<style scoped>
.vuk-badge {
  align-items: center;
  border: 1px solid;
  display: inline-flex;
  gap: 0.35rem;
  font-weight: 600;
  justify-content: center;
  white-space: nowrap;
}
.vuk-badge--sm { font-size: 0.7rem; padding: 0.16rem 0.45rem; }
.vuk-badge--md { font-size: 0.77rem; padding: 0.2rem 0.55rem; }
.vuk-badge--lg { font-size: 0.85rem; padding: 0.25rem 0.7rem; }
.vuk-badge--rounded-none { border-radius: 0; }
.vuk-badge--rounded-sm { border-radius: 0.2rem; }
.vuk-badge--rounded-md { border-radius: 0.35rem; }
.vuk-badge--rounded-lg { border-radius: 0.5rem; }
.vuk-badge--rounded-full { border-radius: 999px; }
.vuk-badge--full { display: flex; width: 100%; }
.vuk-badge--uppercase { text-transform: uppercase; }
.vuk-badge--primary { border-color: #111827; color: #111827; }
.vuk-badge--secondary { border-color: #9ca3af; color: #6b7280; }
.vuk-badge--destructive { border-color: #ef4444; color: #ef4444; }
.vuk-badge--warning { border-color: #eab308; color: #ca8a04; }
.vuk-badge--active { border-color: #22c55e; color: #22c55e; }
.vuk-badge--inactive { border-color: #f87171; color: #f87171; }
.vuk-badge--agent { border-color: #6366f1; color: #6366f1; }
.vuk-badge--client { border-color: #14b8a6; color: #14b8a6; }

.vuk-badge--variant-default { background: transparent; }
.vuk-badge--variant-outline { background: #fff; }
.vuk-badge--variant-filled.vuk-badge--primary { background: #111827; color: #fff; }
.vuk-badge--variant-filled.vuk-badge--secondary { background: #e5e7eb; border-color: #e5e7eb; color: #111827; }
.vuk-badge--variant-filled.vuk-badge--destructive { background: #ef4444; color: #fff; }
.vuk-badge--variant-filled.vuk-badge--warning { background: #facc15; color: #111827; }
.vuk-badge--variant-filled.vuk-badge--active { background: #22c55e; color: #fff; }
.vuk-badge--variant-filled.vuk-badge--inactive { background: #f87171; color: #fff; }
.vuk-badge--variant-filled.vuk-badge--agent { background: #6366f1; color: #fff; }
.vuk-badge--variant-filled.vuk-badge--client { background: #14b8a6; color: #fff; }
</style>
