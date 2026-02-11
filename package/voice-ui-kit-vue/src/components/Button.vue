<template>
  <button :class="buttonClass" :disabled="disabled || isLoading" type="button">
    <span v-if="isLoading && loader === 'icon'" class="vuk-primitive-button-spinner" aria-hidden="true" />
    <slot>{{ isLoading ? "Loading..." : label }}</slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    label?: string;
    variant?:
      | "primary"
      | "secondary"
      | "outline"
      | "destructive"
      | "ghost"
      | "link"
      | "active"
      | "inactive";
    size?: "sm" | "md" | "lg" | "xl";
    rounded?: "size" | "none" | "sm" | "md" | "lg" | "xl" | "full";
    state?: "default" | "active" | "inactive";
    isIcon?: boolean;
    isFullWidth?: boolean;
    uppercase?: boolean;
    loader?: "icon" | "stripes";
    disabled?: boolean;
    isLoading?: boolean;
  }>(),
  {
    label: "Button",
    variant: "primary",
    size: "md",
    rounded: "size",
    state: "default",
    isIcon: false,
    isFullWidth: false,
    uppercase: false,
    loader: "icon",
    disabled: false,
    isLoading: false,
  },
);

const resolvedRounded = computed(() => {
  if (props.rounded !== "size") {
    return props.rounded;
  }
  if (props.size === "sm") return "sm";
  if (props.size === "lg") return "lg";
  if (props.size === "xl") return "xl";
  return "md";
});

const resolvedVariant = computed(() => {
  if (props.state === "active") {
    return "active";
  }
  if (props.state === "inactive") {
    return "inactive";
  }
  return props.variant;
});

const buttonClass = computed(() => [
  "vuk-primitive-button",
  `vuk-primitive-button--${resolvedVariant.value}`,
  `vuk-primitive-button--${props.size}`,
  `vuk-primitive-button--rounded-${resolvedRounded.value}`,
  props.isIcon ? "vuk-primitive-button--icon" : "",
  props.isFullWidth ? "vuk-primitive-button--full" : "",
  props.uppercase ? "vuk-primitive-button--uppercase" : "",
  props.isLoading && props.loader === "stripes" ? "vuk-primitive-button--loading-stripes" : "",
]);
</script>

<style scoped>
.vuk-primitive-button {
  border: 1px solid transparent;
  border-radius: 0.45rem;
  cursor: pointer;
  display: inline-flex;
  gap: 0.35rem;
  font-weight: 600;
  justify-content: center;
  line-height: 1;
}
.vuk-primitive-button:disabled { cursor: not-allowed; opacity: 0.65; }
.vuk-primitive-button--sm { font-size: 0.75rem; padding: 0.3rem 0.6rem; }
.vuk-primitive-button--md { font-size: 0.85rem; padding: 0.45rem 0.8rem; }
.vuk-primitive-button--lg { font-size: 0.95rem; padding: 0.55rem 1rem; }
.vuk-primitive-button--xl { font-size: 1.05rem; padding: 0.65rem 1.15rem; }
.vuk-primitive-button--primary { background: #111827; color: #fff; }
.vuk-primitive-button--secondary { background: #e5e7eb; color: #111827; }
.vuk-primitive-button--outline { background: #fff; border-color: #d1d5db; color: #111827; }
.vuk-primitive-button--destructive { background: #dc2626; color: #fff; }
.vuk-primitive-button--ghost { background: transparent; border-color: transparent; color: #111827; }
.vuk-primitive-button--link {
  background: transparent;
  border-color: transparent;
  color: #1d4ed8;
  padding-left: 0.1rem;
  padding-right: 0.1rem;
  text-decoration: underline;
  text-underline-offset: 0.2rem;
}
.vuk-primitive-button--active { background: #22c55e; border-color: #22c55e; color: #fff; }
.vuk-primitive-button--inactive { background: #ef4444; border-color: #ef4444; color: #fff; }
.vuk-primitive-button--rounded-none { border-radius: 0; }
.vuk-primitive-button--rounded-sm { border-radius: 0.2rem; }
.vuk-primitive-button--rounded-md { border-radius: 0.35rem; }
.vuk-primitive-button--rounded-lg { border-radius: 0.5rem; }
.vuk-primitive-button--rounded-xl { border-radius: 0.7rem; }
.vuk-primitive-button--rounded-full { border-radius: 999px; }
.vuk-primitive-button--icon.vuk-primitive-button--sm { height: 1.65rem; padding: 0; width: 1.65rem; }
.vuk-primitive-button--icon.vuk-primitive-button--md { height: 2rem; padding: 0; width: 2rem; }
.vuk-primitive-button--icon.vuk-primitive-button--lg { height: 2.25rem; padding: 0; width: 2.25rem; }
.vuk-primitive-button--icon.vuk-primitive-button--xl { height: 2.6rem; padding: 0; width: 2.6rem; }
.vuk-primitive-button--full { width: 100%; }
.vuk-primitive-button--uppercase { letter-spacing: 0.04em; text-transform: uppercase; }
.vuk-primitive-button-spinner {
  animation: vuk-primitive-button-spin 0.9s linear infinite;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 999px;
  height: 0.75rem;
  width: 0.75rem;
}
.vuk-primitive-button--loading-stripes {
  background-image: repeating-linear-gradient(
    -45deg,
    rgba(255, 255, 255, 0.15),
    rgba(255, 255, 255, 0.15) 10px,
    rgba(255, 255, 255, 0.25) 10px,
    rgba(255, 255, 255, 0.25) 20px
  );
  background-size: 180% 180%;
}
@keyframes vuk-primitive-button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
