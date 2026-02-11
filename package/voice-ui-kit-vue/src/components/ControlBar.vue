<template>
  <section :class="containerClass">
    <div class="vuk-control-bar-content">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ControlBarProps, ControlBarShadow, ControlBarSize } from "../types/controlBar";

const props = withDefaults(defineProps<ControlBarProps>(), {
  className: "",
  noAnimateIn: false,
  withGradientBorder: true,
  shadow: "xlong",
  size: "lg",
});

const sizeClassMap: Record<ControlBarSize, string> = {
  sm: "vuk-control-bar--sm",
  md: "vuk-control-bar--md",
  lg: "vuk-control-bar--lg",
  xl: "vuk-control-bar--xl",
};

const shadowClassMap: Record<ControlBarShadow, string> = {
  none: "",
  short: "vuk-control-bar--shadow-short",
  long: "vuk-control-bar--shadow-long",
  xlong: "vuk-control-bar--shadow-xlong",
};

const containerClass = computed(() => [
  "vuk-control-bar",
  sizeClassMap[props.size],
  shadowClassMap[props.shadow],
  props.withGradientBorder ? "vuk-control-bar--gradient" : "",
  !props.noAnimateIn ? "vuk-control-bar--animate" : "",
  props.className,
]);
</script>

<style scoped>
.vuk-control-bar {
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 1rem;
  display: inline-flex;
}

.vuk-control-bar--gradient {
  border-color: transparent;
  box-shadow: inset 0 0 0 1px rgba(17, 24, 39, 0.12),
    0 0 0 1px rgba(59, 130, 246, 0.14),
    0 0 24px rgba(59, 130, 246, 0.16);
}

.vuk-control-bar--animate {
  animation: vuk-control-bar-in 0.5s ease both;
}

@keyframes vuk-control-bar-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.vuk-control-bar-content {
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.vuk-control-bar--sm .vuk-control-bar-content {
  padding: 0.5rem 0.625rem;
}

.vuk-control-bar--md .vuk-control-bar-content {
  padding: 0.625rem 0.875rem;
}

.vuk-control-bar--lg .vuk-control-bar-content {
  padding: 0.75rem 1rem;
}

.vuk-control-bar--xl .vuk-control-bar-content {
  padding: 0.875rem 1.2rem;
}

.vuk-control-bar--shadow-short {
  box-shadow: 0 8px 20px rgba(17, 24, 39, 0.12);
}

.vuk-control-bar--shadow-long {
  box-shadow: 0 14px 34px rgba(17, 24, 39, 0.14);
}

.vuk-control-bar--shadow-xlong {
  box-shadow: 0 22px 56px rgba(17, 24, 39, 0.18);
}
</style>
