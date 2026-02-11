<template>
  <select class="vuk-select" :value="modelValue" @change="onChange">
    <option value="" disabled>{{ placeholder }}</option>
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    options?: Array<{ label: string; value: string }>;
  }>(),
  {
    modelValue: "",
    placeholder: "Select",
    options: () => [
      { label: "Option A", value: "a" },
      { label: "Option B", value: "b" },
    ],
  },
);

const emit = defineEmits<{ "update:modelValue": [value: string] }>();

const onChange = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLSelectElement).value);
};

const { modelValue, options, placeholder } = props;
</script>

<style scoped>
.vuk-select {
  border: 1px solid #d1d5db;
  border-radius: 0.45rem;
  font-size: 0.85rem;
  padding: 0.45rem 0.6rem;
}
</style>
