<template>
  <div :class="['vuk-screen-group', props.classNames?.buttongroup, props.className]">
    <div class="vuk-screen-preview" v-if="isScreenEnabled">
      <video ref="screenVideoRef" autoplay muted playsinline class="vuk-screen-video" />
    </div>
    <button
      :class="[
        'vuk-screen-button',
        sizeClassMap[props.size],
        variantClassMap[props.variant],
        resolvedState === 'inactive' ? 'vuk-screen--inactive' : '',
        props.classNames?.button,
        props.buttonProps?.className,
      ]"
      :disabled="isDisabled"
      type="button"
      @click="toggleScreenShare"
    >
      <span v-if="!props.noIcon">{{ isScreenEnabled ? "Screen" : "Screen Off" }}</span>
      <span
        v-if="resolvedState !== 'inactive' && props.activeText"
        :class="['vuk-grow', props.classNames?.activeText]"
      >
        {{ props.activeText }}
      </span>
      <span
        v-else-if="resolvedState === 'inactive' && props.inactiveText"
        :class="['vuk-grow', props.classNames?.inactiveText]"
      >
        {{ props.inactiveText }}
      </span>
      <span v-else-if="resolvedState === 'inactive' && props.noScreenText" class="vuk-grow">
        {{ props.noScreenText }}
      </span>
      <slot />
    </button>
  </div>
</template>

<script setup lang="ts">
import { RTVIEvent, TransportStateEnum } from "@pipecat-ai/client-js";
import { computed, onUnmounted, ref, watch } from "vue";

import { usePipecatApp } from "../composables/pipecatApp";
import type {
  UserScreenControlProps,
  UserScreenControlSize,
  UserScreenControlState,
  UserScreenControlVariant,
} from "../types/userScreenControl";

const props = withDefaults(defineProps<UserScreenControlProps>(), {
  variant: "secondary",
  size: "md",
  noIcon: false,
  noScreenText: "Screen sharing disabled",
  className: "",
});

const context = usePipecatApp();
const isScreenEnabled = ref(false);
const screenVideoRef = ref<HTMLVideoElement | null>(null);
const createSafeMediaStream = () => {
  if (typeof MediaStream !== "undefined") {
    return new MediaStream();
  }

  const tracks: MediaStreamTrack[] = [];
  return {
    addTrack(track: MediaStreamTrack) {
      tracks.push(track);
    },
    removeTrack(track: MediaStreamTrack) {
      const index = tracks.findIndex((item) => item.id === track.id);
      if (index >= 0) {
        tracks.splice(index, 1);
      }
    },
    getTracks() {
      return [...tracks];
    },
  } as unknown as MediaStream;
};
const screenStream = createSafeMediaStream();

const loading = computed(
  () =>
    props.buttonProps?.isLoading ||
    context.transportState.value === TransportStateEnum.DISCONNECTED ||
    context.transportState.value === TransportStateEnum.INITIALIZING,
);

const resolvedState = computed<UserScreenControlState>(() => {
  if (props.state) {
    return props.state;
  }

  return isScreenEnabled.value ? "default" : "inactive";
});

const isDisabled = computed(
  () => loading.value || !!props.buttonProps?.disabled || !context.client.value,
);

const sizeClassMap: Record<UserScreenControlSize, string> = {
  sm: "vuk-screen--sm",
  md: "vuk-screen--md",
  lg: "vuk-screen--lg",
  xl: "vuk-screen--xl",
};

const variantClassMap: Record<UserScreenControlVariant, string> = {
  primary: "vuk-screen--primary",
  secondary: "vuk-screen--secondary",
  outline: "vuk-screen--outline",
  destructive: "vuk-screen--destructive",
};

const refreshScreenState = () => {
  const client = context.client.value;
  if (!client) {
    isScreenEnabled.value = false;
    return;
  }

  isScreenEnabled.value = client.isSharingScreen;
};

const attachScreenPreview = () => {
  const video = screenVideoRef.value;
  if (!video) {
    return;
  }

  video.srcObject = screenStream;
};

const setScreenTrack = (track: MediaStreamTrack | null) => {
  screenStream.getTracks().forEach((existingTrack) => {
    screenStream.removeTrack(existingTrack);
  });

  if (track) {
    screenStream.addTrack(track);
  }

  attachScreenPreview();
};

const toggleScreenShare = () => {
  const client = context.client.value;
  if (!client || isDisabled.value) {
    return;
  }

  client.enableScreenShare(!isScreenEnabled.value);
  isScreenEnabled.value = client.isSharingScreen;
  if (!isScreenEnabled.value) {
    setScreenTrack(null);
  }
};

let cleanupEvents = () => {};

const bindClientEvents = () => {
  const client = context.client.value;
  if (!client) {
    cleanupEvents = () => {};
    return;
  }

  const onScreenTrackStarted = (track: MediaStreamTrack, participant?: { local?: boolean }) => {
    if (participant?.local !== false) {
      isScreenEnabled.value = true;
      setScreenTrack(track);
    }
  };
  const onScreenTrackStopped = (_track: MediaStreamTrack, participant?: { local?: boolean }) => {
    if (participant?.local !== false) {
      isScreenEnabled.value = false;
      setScreenTrack(null);
    }
  };

  const onDisconnected = () => {
    isScreenEnabled.value = false;
    setScreenTrack(null);
  };

  const onScreenShareError = () => {
    isScreenEnabled.value = false;
    setScreenTrack(null);
  };

  client.on(RTVIEvent.ScreenTrackStarted, onScreenTrackStarted as never);
  client.on(RTVIEvent.ScreenTrackStopped, onScreenTrackStopped as never);
  client.on(RTVIEvent.Disconnected, onDisconnected as never);
  client.on(RTVIEvent.ScreenShareError, onScreenShareError as never);

  cleanupEvents = () => {
    client.off(RTVIEvent.ScreenTrackStarted, onScreenTrackStarted as never);
    client.off(RTVIEvent.ScreenTrackStopped, onScreenTrackStopped as never);
    client.off(RTVIEvent.Disconnected, onDisconnected as never);
    client.off(RTVIEvent.ScreenShareError, onScreenShareError as never);
  };
};

watch(
  () => context.client.value,
  () => {
    cleanupEvents();
    bindClientEvents();
    refreshScreenState();
  },
  { immediate: true },
);

onUnmounted(() => {
  cleanupEvents();
  setScreenTrack(null);
});

watch(screenVideoRef, () => {
  attachScreenPreview();
});
</script>

<style scoped>
.vuk-screen-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.vuk-screen-button {
  border: 1px solid #d1d5db;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 500;
  padding: 0.5rem 0.8rem;
}

.vuk-screen-preview {
  background: #111827;
  border-radius: 0.5rem;
  min-height: 7rem;
  overflow: hidden;
}

.vuk-screen-video {
  aspect-ratio: 16 / 9;
  display: block;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.vuk-screen--sm {
  font-size: 0.75rem;
}

.vuk-screen--md {
  font-size: 0.875rem;
}

.vuk-screen--lg {
  font-size: 1rem;
}

.vuk-screen--xl {
  font-size: 1.05rem;
}

.vuk-screen--primary {
  background: #1f2937;
  color: #fff;
}

.vuk-screen--secondary {
  background: #f3f4f6;
}

.vuk-screen--outline {
  background: transparent;
}

.vuk-screen--destructive {
  background: #fee2e2;
  color: #991b1b;
}

.vuk-screen--inactive {
  opacity: 0.75;
}
</style>
