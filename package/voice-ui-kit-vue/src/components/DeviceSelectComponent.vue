<template>
  <div class="vuk-device-select">
    <label v-if="guide" class="vuk-device-select-guide">{{ guide }}</label>
    <select
      :class="[
        'vuk-device-select-trigger',
        classNames?.selectTrigger,
        className,
        selectProps?.disabled ? 'vuk-device-select-trigger--disabled' : '',
      ]"
      :disabled="selectProps?.disabled"
      :name="selectProps?.name"
      :required="selectProps?.required"
      :value="selectedValue"
      @change="onChange"
    >
      <option disabled value="">{{ placeholder }}</option>
      <option
        v-for="device in availableDevices"
        :key="device.deviceId"
        :class="classNames?.selectItem"
        :value="device.deviceId"
      >
        {{ device.label || `Device ${device.deviceId.slice(0, 5)}` }}
      </option>
    </select>

    <div :class="['vuk-device-select-content', classNames?.selectContent, contentProps?.className]">
      <slot name="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type { DeviceSelectComponentProps } from "../types/deviceSelect";

const props = withDefaults(defineProps<DeviceSelectComponentProps>(), {
  placeholder: "Device select",
  availableDevices: () => [],
});

const emit = defineEmits<{
  "update:deviceId": [deviceId: string];
}>();

const selectedValue = computed(() => {
  const selected = props.selectedDevice;
  if (selected && "deviceId" in selected && typeof selected.deviceId === "string") {
    return selected.deviceId;
  }

  return "";
});

const onChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;
  if (!value) {
    return;
  }

  props.updateDevice?.(value);
  emit("update:deviceId", value);
};

const { availableDevices, className, classNames, contentProps, guide, placeholder, selectProps } = props;
</script>

<style scoped>
.vuk-device-select {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.vuk-device-select-guide {
  color: #6b7280;
  font-size: 0.75rem;
  margin: 0;
}

.vuk-device-select-trigger {
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  color: #111827;
  padding: 0.5rem 0.625rem;
}

.vuk-device-select-trigger--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.vuk-device-select-content {
  min-height: 0;
}
</style>
