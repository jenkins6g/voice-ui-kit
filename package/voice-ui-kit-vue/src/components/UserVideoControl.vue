<template>
  <div :class="['vuk-video-control', classNames?.container, className]">
    <div v-if="!noVideo" :class="['vuk-video-frame', classNames?.video]">
      <div v-if="isCamEnabled" class="vuk-video-on">Camera preview active</div>
      <div v-else :class="['vuk-video-off', classNames?.videoOffContainer]">
        <span :class="classNames?.videoOffText">{{ noVideoText }}</span>
      </div>
    </div>

    <div :class="['vuk-video-controls', classNames?.buttongroupWrapper]">
      <button
        :class="['vuk-video-button', classNames?.button, sizeClass, variantClass, buttonStateClass]"
        :disabled="loading || !client"
        type="button"
        @click="toggleCam"
      >
        <span v-if="!noIcon">{{ isCamEnabled ? "Video" : "Video Off" }}</span>
        <span v-if="isCamEnabled && activeText" :class="classNames?.activeText">{{ activeText }}</span>
        <span v-if="!isCamEnabled && inactiveText" :class="classNames?.inactiveText">{{ inactiveText }}</span>
        <slot />
      </button>

      <details v-if="!noDevicePicker" :class="['vuk-video-dropdown', classNames?.dropdownMenuContent]">
        <summary :class="['vuk-video-dropdown-trigger', classNames?.dropdownMenuTrigger]">▼</summary>
        <div class="vuk-video-dropdown-content">
          <button
            v-for="device in availableCams"
            :key="device.deviceId"
            :class="['vuk-video-dropdown-item', classNames?.dropdownMenuCheckboxItem]"
            type="button"
            @click="updateCam(device.deviceId)"
          >
            <span>{{ selectedCam?.deviceId === device.deviceId ? "[x]" : "[ ]" }}</span>
            <span>{{ device.label || `Camera ${device.deviceId.slice(0, 5)}` }}</span>
          </button>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TransportStateEnum } from "@pipecat-ai/client-js";
import { computed, ref, watch } from "vue";

import { usePipecatApp } from "../composables/pipecatApp";
import type {
  UserVideoControlProps,
  UserVideoControlSize,
  UserVideoControlState,
  UserVideoControlVariant,
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
const selectedCam = ref<MediaDeviceInfo | undefined>(undefined);
const isCamEnabled = ref(false);

const client = computed(() => context.client.value);

const loading = computed(
  () =>
    context.transportState.value === TransportStateEnum.DISCONNECTED ||
    context.transportState.value === TransportStateEnum.INITIALIZING,
);

const normalizeOptionalDevice = (
  device: MediaDeviceInfo | Record<string, never>,
): MediaDeviceInfo | undefined => {
  if (
    typeof (device as MediaDeviceInfo).deviceId === "string" &&
    typeof (device as MediaDeviceInfo).kind === "string"
  ) {
    return device as MediaDeviceInfo;
  }

  return undefined;
};

const refreshCamState = async () => {
  if (!client.value) {
    availableCams.value = [];
    selectedCam.value = undefined;
    isCamEnabled.value = false;
    return;
  }

  availableCams.value = await client.value.getAllCams();
  selectedCam.value = normalizeOptionalDevice(client.value.selectedCam);
  isCamEnabled.value = client.value.isCamEnabled;
};

const updateCam = (deviceId: string) => {
  if (!client.value) {
    return;
  }

  client.value.updateCam(deviceId);
  selectedCam.value = normalizeOptionalDevice(client.value.selectedCam);
};

const toggleCam = () => {
  if (!client.value) {
    return;
  }

  client.value.enableCam(!isCamEnabled.value);
  isCamEnabled.value = client.value.isCamEnabled;
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

  return isCamEnabled.value ? "active" : "inactive";
});

const sizeClassMap: Record<UserVideoControlSize, string> = {
  sm: "vuk-video--sm",
  md: "vuk-video--md",
  lg: "vuk-video--lg",
  xl: "vuk-video--xl",
};

const variantClassMap: Record<UserVideoControlVariant, string> = {
  primary: "vuk-video--primary",
  secondary: "vuk-video--secondary",
  outline: "vuk-video--outline",
  destructive: "vuk-video--destructive",
};

const sizeClass = computed(() => sizeClassMap[props.size]);
const variantClass = computed(() => variantClassMap[props.variant]);
const buttonStateClass = computed(() =>
  resolvedState.value === "inactive" ? "vuk-video--inactive" : "",
);

const {
  activeText,
  className,
  classNames,
  inactiveText,
  noDevicePicker,
  noIcon,
  noVideo,
  noVideoText,
} = props;
</script>

<style scoped>
.vuk-video-control {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.vuk-video-frame {
  align-items: center;
  background: #111827;
  border-radius: 0.5rem;
  color: #fff;
  display: flex;
  justify-content: center;
  min-height: 9rem;
}

.vuk-video-controls {
  display: inline-flex;
  gap: 1px;
}

.vuk-video-button,
.vuk-video-dropdown-trigger,
.vuk-video-dropdown-item {
  border: 1px solid #d1d5db;
}

.vuk-video-button {
  border-radius: 999px;
  cursor: pointer;
  font-weight: 500;
  padding: 0.5rem 0.8rem;
}

.vuk-video-dropdown {
  position: relative;
}

.vuk-video-dropdown-trigger {
  border-radius: 999px;
  cursor: pointer;
  list-style: none;
  padding: 0.5rem 0.7rem;
}

.vuk-video-dropdown-trigger::-webkit-details-marker {
  display: none;
}

.vuk-video-dropdown-content {
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 13rem;
  padding: 0.5rem;
  position: absolute;
  right: 0;
  top: calc(100% + 0.25rem);
  z-index: 10;
}

.vuk-video-dropdown-item {
  background: #fff;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  gap: 0.45rem;
  padding: 0.4rem 0.5rem;
  text-align: left;
}

.vuk-video--sm {
  font-size: 0.75rem;
}

.vuk-video--md {
  font-size: 0.875rem;
}

.vuk-video--lg {
  font-size: 1rem;
}

.vuk-video--xl {
  font-size: 1.05rem;
}

.vuk-video--primary {
  background: #1f2937;
  color: #fff;
}

.vuk-video--secondary {
  background: #f3f4f6;
}

.vuk-video--outline {
  background: #fff;
}

.vuk-video--destructive {
  background: #7f1d1d;
  color: #fff;
}

.vuk-video--inactive {
  opacity: 0.7;
}
</style>
