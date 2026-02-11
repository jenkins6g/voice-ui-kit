<template>
  <section :class="containerClass" role="alert">
    <header v-if="!noHeader" :class="['vuk-error-header', classNames?.header]">
      <h3 :class="['vuk-error-title', classNames?.title]">
        <slot name="icon">
          <span class="vuk-error-icon">{{ icon }}</span>
        </slot>
        <span>{{ title }}</span>
      </h3>
    </header>

    <div v-if="$slots.default" :class="['vuk-error-content', classNames?.content]">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ErrorCardProps, ErrorCardShadow, ErrorCardSize } from "../types/errorCard";

const props = withDefaults(defineProps<ErrorCardProps>(), {
  title: "An Error Occurred",
  noHeader: false,
  icon: "i",
  className: "",
  size: "lg",
  shadow: "none",
});

const sizeClassMap: Record<ErrorCardSize, string> = {
  sm: "vuk-error--sm",
  md: "vuk-error--md",
  lg: "vuk-error--lg",
  xl: "vuk-error--xl",
};

const shadowClassMap: Record<ErrorCardShadow, string> = {
  none: "",
  short: "vuk-error--shadow-short",
  long: "vuk-error--shadow-long",
  xlong: "vuk-error--shadow-xlong",
};

const containerClass = computed(() => [
  "vuk-error",
  sizeClassMap[props.size],
  shadowClassMap[props.shadow],
  props.className,
]);

const { classNames, icon, noHeader, title } = props;
</script>

<style scoped>
.vuk-error {
  background: #fee2e2;
  border: 1px solid #fca5a5;
  border-radius: 0.75rem;
  color: #7f1d1d;
  min-width: 20rem;
}

.vuk-error-header {
  padding: 0.75rem 1rem 0.4rem;
}

.vuk-error-title {
  align-items: center;
  display: flex;
  font-weight: 600;
  gap: 0.5rem;
  margin: 0;
}

.vuk-error-icon {
  align-items: center;
  border: 1px solid #fca5a5;
  border-radius: 999px;
  display: inline-flex;
  font-size: 0.75rem;
  font-weight: 700;
  height: 1.3rem;
  justify-content: center;
  width: 1.3rem;
}

.vuk-error-content {
  font-size: 0.9rem;
  line-height: 1.4;
  padding: 0.1rem 1rem 0.85rem;
}

.vuk-error--sm {
  font-size: 0.8rem;
}

.vuk-error--md {
  font-size: 0.875rem;
}

.vuk-error--lg {
  font-size: 0.95rem;
}

.vuk-error--xl {
  font-size: 1.05rem;
}

.vuk-error--shadow-short {
  box-shadow: 0 8px 16px rgba(127, 29, 29, 0.12);
}

.vuk-error--shadow-long {
  box-shadow: 0 14px 28px rgba(127, 29, 29, 0.16);
}

.vuk-error--shadow-xlong {
  box-shadow: 0 20px 44px rgba(127, 29, 29, 0.2);
}
</style>
