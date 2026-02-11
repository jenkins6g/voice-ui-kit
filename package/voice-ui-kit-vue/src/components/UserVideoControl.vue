<template>
  <UserVideoComponent
    :active-text="activeText"
    :available-cams="availableCams"
    :button-props="mergedButtonProps"
    :class-name="className"
    :class-names="classNames"
    :device-drop-down-props="deviceDropDownProps"
    :dropdown-button-props="dropdownButtonProps"
    :inactive-text="inactiveText"
    :is-cam-enabled="isCamEnabled"
    :no-device-picker="noDevicePicker"
    :no-icon="noIcon"
    :no-video="noVideo"
    :no-video-text="noVideoText"
    :selected-cam="selectedCam"
    :size="size"
    :state="resolvedState"
    :on-click="toggleCam"
    :update-cam="updateCam"
    :variant="variant"
  >
    <slot />
  </UserVideoComponent>
</template>

<script setup lang="ts">
import { TransportStateEnum } from "@pipecat-ai/client-js";
import { computed, ref, watch } from "vue";

import { usePipecatApp } from "../composables/pipecatApp";
import UserVideoComponent from "./UserVideoComponent.vue";
import type {
  UserVideoControlProps,
  UserVideoControlState,
} from "../types/userVideoControl";

const props = withDefaults(defineProps<UserVideoControlProps>(), {
  variant: "secondary",
  size: "md",
  noDevicePicker: false,
  noVideo: false,
  noVideoText: "Video disabled",
  noIcon: false,
  className: "",
});

const context = usePipecatApp();

const availableCams = ref<MediaDeviceInfo[]>([]);
const selectedCam = ref<MediaDeviceInfo | Record<string, never>>({});
const isCamEnabled = ref(false);

const loading = computed(
  () =>
    context.transportState.value === TransportStateEnum.DISCONNECTED ||
    context.transportState.value === TransportStateEnum.INITIALIZING,
);

const refreshCamState = async () => {
  const client = context.client.value;
  if (!client) {
    availableCams.value = [];
    selectedCam.value = {};
    isCamEnabled.value = false;
    return;
  }

  availableCams.value = await client.getAllCams();
  selectedCam.value = client.selectedCam;
  isCamEnabled.value = client.isCamEnabled;
};

const updateCam = (deviceId: string) => {
  const client = context.client.value;
  if (!client) {
    return;
  }

  client.updateCam(deviceId);
  selectedCam.value = client.selectedCam;
};

const toggleCam = () => {
  const client = context.client.value;
  if (!client || loading.value) {
    return;
  }

  client.enableCam(!isCamEnabled.value);
  isCamEnabled.value = client.isCamEnabled;
};

watch(
  () => context.client.value,
  () => {
    void refreshCamState();
  },
  { immediate: true },
);

const resolvedState = computed<UserVideoControlState>(() => {
  if (props.state) {
    return props.state;
  }

  return loading.value ? "default" : isCamEnabled.value ? "default" : "inactive";
});

const mergedButtonProps = computed(() => ({
  isLoading: loading.value,
  ...(props.buttonProps || {}),
}));

const {
  activeText,
  className,
  classNames,
  deviceDropDownProps,
  dropdownButtonProps,
  inactiveText,
  noDevicePicker,
  noIcon,
  noVideo,
  noVideoText,
  size,
  state,
  variant,
} = props;
</script>
