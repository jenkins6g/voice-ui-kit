<template>
  <div :class="['vuk-video-control', classNames?.container, className]">
    <div
      v-if="!noVideo"
      :class="['vuk-video-frame', classNames?.video]"
    >
      <div v-if="isCamEnabled" class="vuk-video-on">
        <slot name="video">Camera preview active</slot>
      </div>
      <div v-else :class="['vuk-video-off', classNames?.videoOffContainer]">
        <span :class="classNames?.videoOffText">{{ noVideoText }}</span>
      </div>

      <div v-if="buttonProps?.isLoading" class="vuk-video-loader">Loading...</div>
    </div>

    <div :class="['vuk-video-controls', classNames?.buttongroupWrapper, classNames?.buttongroup]">
      <button
        :class="[
          'vuk-video-button',
          classNames?.button,
          buttonProps?.className,
          sizeClass,
          variantClass,
          buttonStateClass,
          noVideo && !noDevicePicker ? 'vuk-video-button--split' : '',
        ]"
        :disabled="buttonProps?.isLoading || buttonProps?.disabled"
        type="button"
        @click="onClick"
      >
        <span v-if="!noIcon">{{ isCamEnabled ? 'Video' : 'Video Off' }}</span>
        <span v-if="resolvedButtonState === 'inactive' && inactiveText" :class="classNames?.inactiveText">{{ inactiveText }}</span>
        <span v-if="resolvedButtonState !== 'inactive' && activeText" :class="classNames?.activeText">{{ activeText }}</span>
        <slot />
      </button>

      <details
        v-if="!noDevicePicker"
        :class="['vuk-video-dropdown', classNames?.dropdownMenuContent]"
      >
        <summary
          :class="[
            'vuk-video-dropdown-trigger',
            classNames?.dropdownMenuTrigger,
            dropdownButtonProps?.className,
          ]"
        >
          ▼
        </summary>
        <div class="vuk-video-dropdown-content">
          <p v-if="!deviceDropDownProps?.noMenuLabel" class="vuk-video-dropdown-label">
            {{ deviceDropDownProps?.menuLabel || 'Camera device' }}
          </p>
          <hr v-if="!deviceDropDownProps?.noMenuSeparator" class="vuk-video-dropdown-separator" />
          <button
            v-for="device in availableCams"
            :key="device.deviceId"
            :class="['vuk-video-dropdown-item', classNames?.dropdownMenuCheckboxItem]"
            type="button"
            @click="updateCam?.(device.deviceId)"
          >
            <span>{{ selectedCamDeviceId === device.deviceId ? '[x]' : '[ ]' }}</span>
            <span>{{ device.label || `Camera ${device.deviceId.slice(0, 5)}` }}</span>
          </button>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type {
  UserVideoComponentProps,
  UserVideoControlSize,
  UserVideoControlState,
  UserVideoControlVariant,
} from "../types/userVideoControl";

const props = withDefaults(defineProps<UserVideoComponentProps>(), {
  variant: "secondary",
  size: "md",
  noDevicePicker: false,
  noVideo: false,
  noVideoText: "Video disabled",
  noIcon: false,
  isCamEnabled: false,
  availableCams: () => [],
  className: "",
});

const resolvedButtonState = computed<UserVideoControlState>(() => {
  if (props.state) {
    return props.state;
  }

  return props.isCamEnabled ? "active" : "inactive";
});

const selectedCamDeviceId = computed(() => {
  const selected = props.selectedCam;
  if (selected && "deviceId" in selected && typeof selected.deviceId === "string") {
    return selected.deviceId;
  }

  return "";
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
  resolvedButtonState.value === "inactive" ? "vuk-video--inactive" : "",
);

const {
  activeText,
  availableCams,
  buttonProps,
  className,
  classNames,
  deviceDropDownProps,
  dropdownButtonProps,
  inactiveText,
  isCamEnabled,
  noDevicePicker,
  noIcon,
  noVideo,
  noVideoText,
  onClick,
  selectedCam,
  updateCam,
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
  aspect-ratio: 16 / 9;
  background: #111827;
  border-radius: 0.5rem;
  color: #fff;
  display: flex;
  justify-content: center;
  min-height: 9rem;
  position: relative;
}

.vuk-video-loader {
  align-items: center;
  background: rgba(0, 0, 0, 0.45);
  border-radius: 0.5rem;
  display: flex;
  font-size: 0.8rem;
  inset: 0;
  justify-content: center;
  position: absolute;
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

.vuk-video-button--split {
  border-radius: 999px 0 0 999px;
}

.vuk-video-dropdown {
  position: relative;
}

.vuk-video-dropdown-trigger {
  border-radius: 0 999px 999px 0;
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

.vuk-video-dropdown-label {
  color: #6b7280;
  font-size: 0.75rem;
  margin: 0;
}

.vuk-video-dropdown-separator {
  border: 0;
  border-top: 1px solid #e5e7eb;
  margin: 0.1rem 0 0.25rem;
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
