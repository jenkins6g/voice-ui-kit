<template>
  <textarea
    :value="modelValue"
    :placeholder="placeholder"
    :rows="rows"
    class="vuk-textarea"
    @input="onInput"
  />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    rows?: number;
  }>(),
  {
    modelValue: "",
    placeholder: "Type a longer message...",
    rows: 4,
  },
);

const emit = defineEmits<{ "update:modelValue": [value: string] }>();

const onInput = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLTextAreaElement).value);
};

const { modelValue, placeholder, rows } = props;
</script>

<style scoped>
.vuk-textarea {
  border: 1px solid #d1d5db;
  border-radius: 0.45rem;
  font-size: 0.85rem;
  padding: 0.5rem 0.65rem;
  resize: vertical;
  width: 100%;
}
</style>
