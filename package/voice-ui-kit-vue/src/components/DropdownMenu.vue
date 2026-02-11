<template>
  <details class="vuk-dropdown">
    <summary class="vuk-dropdown-trigger">{{ label }}</summary>
    <div class="vuk-dropdown-content">
      <button v-for="item in items" :key="item" class="vuk-dropdown-item" type="button">
        {{ item }}
      </button>
      <slot />
    </div>
  </details>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string;
    items?: string[];
  }>(),
  {
    label: "Open menu",
    items: () => ["Item 1", "Item 2", "Item 3"],
  },
);
</script>

<style scoped>
.vuk-dropdown { position: relative; width: fit-content; }
.vuk-dropdown-trigger {
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 0.45rem;
  cursor: pointer;
  list-style: none;
  padding: 0.4rem 0.65rem;
}
.vuk-dropdown-trigger::-webkit-details-marker { display: none; }
.vuk-dropdown-content {
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 0.45rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-top: 0.25rem;
  min-width: 10rem;
  padding: 0.4rem;
  position: absolute;
  z-index: 10;
}
.vuk-dropdown-item {
  background: transparent;
  border: 0;
  border-radius: 0.35rem;
  cursor: pointer;
  padding: 0.35rem 0.45rem;
  text-align: left;
}
.vuk-dropdown-item:hover { background: #f3f4f6; }
</style>
