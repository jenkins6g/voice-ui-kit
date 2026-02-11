<template>
  <DeviceSelectComponent
    :available-devices="availableMics"
    :class-name="className"
    :class-names="classNames"
    :content-props="contentProps"
    :guide="guide"
    :placeholder="placeholder"
    :select-props="selectProps"
    :selected-device="selectedMic"
    :update-device="updateMic"
    @update:device-id="(deviceId) => emit('update:deviceId', deviceId)"
  >
    <template v-if="$slots.content" #content>
      <slot name="content" />
    </template>
  </DeviceSelectComponent>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

import { usePipecatApp } from "../composables/pipecatApp";
import DeviceSelectComponent from "./DeviceSelectComponent.vue";
import type { DeviceSelectProps } from "../types/deviceSelect";

const props = withDefaults(defineProps<DeviceSelectProps>(), {
  placeholder: "Device select",
});

const emit = defineEmits<{
  "update:deviceId": [deviceId: string];
}>();

const context = usePipecatApp();
const availableMics = ref<MediaDeviceInfo[]>([]);
const selectedMic = ref<MediaDeviceInfo | Record<string, never>>({});

const refreshDevices = async () => {
  const client = context.client.value;
  if (!client) {
    availableMics.value = [];
    selectedMic.value = {};
    return;
  }

  availableMics.value = await client.getAllMics();
  selectedMic.value = client.selectedMic;
};

const updateMic = (deviceId: string) => {
  const client = context.client.value;
  if (!client) {
    return;
  }

  client.updateMic(deviceId);
  selectedMic.value = client.selectedMic;
};

watch(
  () => context.client.value,
  () => {
    void refreshDevices();
  },
  { immediate: true },
);

const { className, classNames, contentProps, guide, placeholder, selectProps } = props;
</script>
