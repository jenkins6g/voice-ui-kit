<template>
  <div :class="groupClass">
    <button
      :class="mainButtonClass"
      :disabled="isButtonDisabled"
      type="button"
      @click="toggleMic"
    >
      <template v-if="isNoAudioMode">
        <span v-if="!buttonLoading">
          <span v-if="!props.noIcon">Mic Off</span>
          <span v-if="props.noAudioText" class="vuk-grow">{{ props.noAudioText }}</span>
          <slot />
        </span>
      </template>

      <template v-else>
        <span v-if="!props.noIcon">{{ isMicEnabled ? "Mic" : "Mic Off" }}</span>
        <span
          v-if="resolvedButtonState === 'inactive' && props.inactiveText"
          :class="['vuk-grow', props.classNames?.inactiveText]"
        >
          {{ props.inactiveText }}
        </span>
        <span
          v-else-if="resolvedButtonState !== 'inactive' && props.activeText"
          :class="['vuk-grow', props.classNames?.activeText]"
        >
          {{ props.activeText }}
        </span>
        <slot />
        <VoiceVisualizer
          v-if="!props.noVisualizer"
          :class="['vuk-inline-visualizer', props.visualizerProps?.className]"
        />
      </template>
    </button>

    <details v-if="!noDropdown" class="vuk-dropdown">
      <summary :class="dropdownTriggerClass">▼</summary>
      <div :class="dropdownContentClass">
        <p v-if="props.dropdownMenuLabel" class="vuk-menu-label">{{ props.dropdownMenuLabel }}</p>

        <template v-if="hasMicrophones">
          <p class="vuk-menu-label">{{ props.microphoneLabel }}</p>
          <button
            v-for="device in availableMics"
            :key="`mic-${device.deviceId}`"
            :class="dropdownItemClass"
            type="button"
            @click="updateMic(device.deviceId)"
          >
            <span>{{ selectedMic?.deviceId === device.deviceId ? "[x]" : "[ ]" }}</span>
            <span>{{ device.label || `Microphone ${device.deviceId.slice(0, 5)}` }}</span>
          </button>
        </template>

        <template v-if="hasSpeakers">
          <p class="vuk-menu-label">{{ props.speakerLabel }}</p>
          <button
            v-for="device in availableSpeakers"
            :key="`speaker-${device.deviceId}`"
            :class="dropdownItemClass"
            type="button"
            @click="updateSpeaker(device.deviceId)"
          >
            <span>{{ selectedSpeaker?.deviceId === device.deviceId ? "[x]" : "[ ]" }}</span>
            <span>{{ device.label || `Speaker ${device.deviceId.slice(0, 5)}` }}</span>
          </button>
        </template>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import { TransportStateEnum } from "@pipecat-ai/client-js";
import { computed, ref, watch } from "vue";

import { usePipecatApp } from "../composables/pipecatApp";
import VoiceVisualizer from "./VoiceVisualizer.vue";
import type {
  UserAudioControlProps,
  UserAudioControlSize,
  UserAudioControlState,
  UserAudioControlVariant,
} from "../types/userAudioControl";

const props = withDefaults(defineProps<UserAudioControlProps>(), {
  variant: "secondary",
  size: "md",
  noDevicePicker: false,
  dropdownMenuLabel: "Audio Devices",
  noMicrophones: false,
  noSpeakers: false,
  microphoneLabel: "Microphones",
  speakerLabel: "Speakers",
  noVisualizer: false,
  noAudio: false,
  noAudioText: "Audio disabled",
  noIcon: false,
});

const context = usePipecatApp();

const availableMics = ref<MediaDeviceInfo[]>([]);
const selectedMic = ref<MediaDeviceInfo | undefined>(undefined);
const availableSpeakers = ref<MediaDeviceInfo[]>([]);
const selectedSpeaker = ref<MediaDeviceInfo | undefined>(undefined);

const buttonLoading = computed(
  () =>
    props.buttonProps?.isLoading ||
    context.transportState.value === TransportStateEnum.DISCONNECTED ||
    context.transportState.value === TransportStateEnum.INITIALIZING,
);

const isNoAudioMode = computed(() => props.noAudio || buttonLoading.value);
const isMicEnabled = computed(() => !context.isMuted.value);

const resolvedButtonState = computed<UserAudioControlState>(() => {
  if (props.state) {
    return props.state;
  }

  return isMicEnabled.value ? "default" : "inactive";
});

const hasMicrophones = computed(
  () => !props.noMicrophones && availableMics.value.length > 0,
);

const hasSpeakers = computed(
  () => !props.noSpeakers && availableSpeakers.value.length > 0,
);

const noDropdown = computed(
  () => props.noDevicePicker || (props.noMicrophones && props.noSpeakers),
);

const isButtonDisabled = computed(
  () => !!props.buttonProps?.disabled || isNoAudioMode.value || !context.client.value,
);

const sizeClassMap: Record<UserAudioControlSize, string> = {
  sm: "vuk-audio--sm",
  md: "vuk-audio--md",
  lg: "vuk-audio--lg",
  xl: "vuk-audio--xl",
};

const variantClassMap: Record<UserAudioControlVariant, string> = {
  primary: "vuk-audio--primary",
  secondary: "vuk-audio--secondary",
  outline: "vuk-audio--outline",
  destructive: "vuk-audio--destructive",
};

const groupClass = computed(() => ["vuk-audio-group", props.classNames?.buttongroup]);
const mainButtonClass = computed(() => [
  "vuk-audio-main",
  sizeClassMap[props.size],
  variantClassMap[props.variant],
  resolvedButtonState.value === "inactive" ? "vuk-audio--inactive" : "",
  !noDropdown.value ? "vuk-audio-main--split" : "",
  props.classNames?.button,
  props.buttonProps?.className,
]);

const dropdownTriggerClass = computed(() => [
  "vuk-audio-dropdown-trigger",
  sizeClassMap[props.size],
  variantClassMap[props.variant],
  props.classNames?.dropdownMenuTrigger,
  props.dropdownButtonProps?.className,
]);

const dropdownContentClass = computed(() => [
  "vuk-audio-dropdown-content",
  props.classNames?.dropdownMenuContent,
]);

const dropdownItemClass = computed(() => [
  "vuk-audio-dropdown-item",
  props.classNames?.dropdownMenuCheckboxItem,
]);

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

const refreshDevices = async () => {
  const client = context.client.value;
  if (!client) {
    availableMics.value = [];
    availableSpeakers.value = [];
    selectedMic.value = undefined;
    selectedSpeaker.value = undefined;
    return;
  }

  try {
    availableMics.value = props.noMicrophones ? [] : await client.getAllMics();
    availableSpeakers.value = props.noSpeakers ? [] : await client.getAllSpeakers();
    selectedMic.value = normalizeOptionalDevice(client.selectedMic);
    selectedSpeaker.value = normalizeOptionalDevice(client.selectedSpeaker);
  } catch {
    availableMics.value = [];
    availableSpeakers.value = [];
  }
};

const updateMic = async (deviceId: string) => {
  const client = context.client.value;
  if (!client) {
    return;
  }

  client.updateMic(deviceId);
  selectedMic.value = normalizeOptionalDevice(client.selectedMic);
};

const updateSpeaker = async (deviceId: string) => {
  const client = context.client.value;
  if (!client) {
    return;
  }

  client.updateSpeaker(deviceId);
  selectedSpeaker.value = normalizeOptionalDevice(client.selectedSpeaker);
};

const toggleMic = () => {
  context.toggleMute();
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
.vuk-audio-group {
  display: inline-flex;
  gap: 1px;
}

.vuk-audio-main,
.vuk-audio-dropdown-trigger,
.vuk-audio-dropdown-item {
  border: 1px solid #d1d5db;
  color: #111827;
  cursor: pointer;
  font-weight: 500;
}

.vuk-audio-main {
  align-items: center;
  display: inline-flex;
  gap: 0.5rem;
}

.vuk-grow {
  flex: 1;
}

.vuk-audio-main--split {
  border-radius: 999px 0 0 999px;
}

.vuk-audio-dropdown-trigger {
  border-left: 0;
  border-radius: 0 999px 999px 0;
  list-style: none;
  padding: 0.5rem 0.7rem;
  user-select: none;
}

.vuk-audio-dropdown-trigger::-webkit-details-marker {
  display: none;
}

.vuk-audio-dropdown {
  position: relative;
}

.vuk-audio-dropdown-content {
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 14rem;
  padding: 0.5rem;
  position: absolute;
  right: 0;
  top: calc(100% + 0.25rem);
  z-index: 10;
}

.vuk-menu-label {
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 600;
  margin: 0.25rem 0;
}

.vuk-audio-dropdown-item {
  align-items: center;
  background: #fff;
  border-radius: 0.375rem;
  display: flex;
  gap: 0.5rem;
  padding: 0.4rem 0.5rem;
  text-align: left;
}

.vuk-inline-visualizer {
  height: 1.25rem;
  min-width: 4rem;
}

.vuk-audio-main:disabled,
.vuk-audio-dropdown-trigger:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.vuk-audio--sm {
  font-size: 0.75rem;
  padding: 0.35rem 0.6rem;
}

.vuk-audio--md {
  font-size: 0.875rem;
  padding: 0.5rem 0.875rem;
}

.vuk-audio--lg {
  font-size: 1rem;
  padding: 0.625rem 1rem;
}

.vuk-audio--xl {
  font-size: 1.05rem;
  padding: 0.75rem 1.1rem;
}

.vuk-audio--primary {
  background: #1f2937;
  color: #fff;
}

.vuk-audio--secondary {
  background: #f3f4f6;
}

.vuk-audio--outline {
  background: #fff;
}

.vuk-audio--destructive {
  background: #7f1d1d;
  color: #fff;
}

.vuk-audio--inactive {
  opacity: 0.7;
}
</style>
