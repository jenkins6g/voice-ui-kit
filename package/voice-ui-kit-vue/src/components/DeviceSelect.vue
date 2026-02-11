<template>
  <div class="vuk-device-select">
    <label v-if="guide" class="vuk-device-select-guide">{{ guide }}</label>
    <select
      :class="['vuk-device-select-trigger', classNames?.selectTrigger, className]"
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
    <p v-if="!availableDevices.length" :class="['vuk-device-select-empty', classNames?.selectContent]">
      {{ noDevicesText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

import { usePipecatApp } from "../composables/pipecatApp";
import type { DeviceSelectProps } from "../types/deviceSelect";

const props = withDefaults(defineProps<DeviceSelectProps>(), {
  placeholder: "Device select",
  noDevicesText: "No devices available",
});

const emit = defineEmits<{
  "update:deviceId": [deviceId: string];
}>();

const context = usePipecatApp();
const availableDevices = ref<MediaDeviceInfo[]>([]);
const selectedValue = ref("");

const refreshDevices = async () => {
  const client = context.client.value;
  if (!client) {
    availableDevices.value = [];
    selectedValue.value = "";
    return;
  }

  availableDevices.value = await client.getAllMics();
  selectedValue.value = "deviceId" in client.selectedMic ? client.selectedMic.deviceId : "";
};

const onChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;
  const client = context.client.value;
  if (!client || !value) {
    return;
  }

  client.updateMic(value);
  selectedValue.value = value;
  emit("update:deviceId", value);
};

watch(
  () => context.client.value,
  () => {
    void refreshDevices();
  },
  { immediate: true },
);
</script>

<style scoped>
.vuk-device-select {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.vuk-device-select-guide,
.vuk-device-select-empty {
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
</style>
