<template>
  <input
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    class="vuk-input"
    type="text"
    @input="onInput"
  />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    disabled?: boolean;
  }>(),
  {
    modelValue: "",
    placeholder: "Type here",
    disabled: false,
  },
);

const emit = defineEmits<{ "update:modelValue": [value: string] }>();

const onInput = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
};

const { disabled, modelValue, placeholder } = props;
</script>

<style scoped>
.vuk-input {
  border: 1px solid #d1d5db;
  border-radius: 0.45rem;
  font-size: 0.85rem;
  padding: 0.45rem 0.6rem;
  width: 100%;
}
</style>
