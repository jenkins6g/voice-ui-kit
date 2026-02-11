<template>
  <button
    :aria-busy="isLoading"
    :class="buttonClass"
    :disabled="isDisabledByState"
    type="button"
    @click="handleClick"
  >
    {{ buttonLabel }}
  </button>
</template>

<script setup lang="ts">
import { TransportStateEnum, type TransportState } from "@pipecat-ai/client-js";
import { computed } from "vue";
import { usePipecatApp } from "../composables/pipecatApp";
import type {
  ConnectButtonProps,
  ConnectButtonSize,
  ConnectButtonVariant,
} from "../types/connectButton";

const props = withDefaults(defineProps<ConnectButtonProps>(), {
  className: "",
  size: "md",
  defaultVariant: "active",
});

const emit = defineEmits<{
  click: [];
  connect: [];
  disconnect: [];
}>();

const context = usePipecatApp();

const currentState = computed<TransportState>(() => context.transportState.value);

type StateConfig = {
  children: string;
  variant: ConnectButtonVariant;
  className?: string;
};

const getDefaultStateConfig = (transportState: TransportState) => {
  switch (transportState) {
    case TransportStateEnum.DISCONNECTED:
    case TransportStateEnum.INITIALIZED:
      return { children: "Connect", variant: "active" as ConnectButtonVariant };
    case TransportStateEnum.INITIALIZING:
      return {
        children: "Initializing...",
        variant: "secondary" as ConnectButtonVariant,
      };
    case TransportStateEnum.READY:
      return {
        children: "Disconnect",
        variant: "destructive" as ConnectButtonVariant,
      };
    case TransportStateEnum.DISCONNECTING:
      return {
        children: "Disconnecting...",
        variant: "secondary" as ConnectButtonVariant,
      };
    case TransportStateEnum.ERROR:
      return { children: "Error", variant: "destructive" as ConnectButtonVariant };
    default:
      return {
        children: "Connecting...",
        variant: "secondary" as ConnectButtonVariant,
      };
  }
};

const resolvedStateConfig = computed<StateConfig>(() => {
  return props.stateContent?.[currentState.value] ?? getDefaultStateConfig(currentState.value);
});

const buttonLabel = computed(() => resolvedStateConfig.value.children);

const isDisabledByState = computed(() => {
  const enabledStates: TransportState[] = ["disconnected", "ready", "initialized"];
  return !enabledStates.includes(currentState.value);
});

const isLoading = computed(() => {
  const nonLoadingStates: TransportState[] = [
    "disconnected",
    "ready",
    "error",
    "initialized",
  ];
  return !nonLoadingStates.includes(currentState.value);
});

const sizeClassMap: Record<ConnectButtonSize, string> = {
  sm: "vuk-button--sm",
  md: "vuk-button--md",
  lg: "vuk-button--lg",
};

const variantClassMap: Record<ConnectButtonVariant, string> = {
  default: "vuk-button--default",
  active: "vuk-button--active",
  secondary: "vuk-button--secondary",
  destructive: "vuk-button--destructive",
};

const buttonClass = computed(() => {
  const customClass = resolvedStateConfig.value.className ?? "";

  return [
    "vuk-button",
    sizeClassMap[props.size],
    variantClassMap[resolvedStateConfig.value.variant ?? props.defaultVariant],
    isLoading.value ? "vuk-button--loading" : "",
    customClass,
    props.className,
  ];
});

const handleClick = async () => {
  emit("click");
  await props.onClick?.();

  const connectedStates: TransportState[] = ["ready", "connected"];
  const isConnected = connectedStates.includes(currentState.value);

  if (isConnected) {
    emit("disconnect");
    if (props.onDisconnect) {
      await props.onDisconnect();
      return;
    }

    await context.handleDisconnect();
    return;
  }

  emit("connect");
  if (props.onConnect) {
    await props.onConnect();
    return;
  }

  await context.handleConnect();
};
</script>

<style scoped>
.vuk-button {
  border: 0;
  border-radius: 999px;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s ease;
}

.vuk-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.vuk-button--sm {
  font-size: 0.75rem;
  padding: 0.4rem 0.75rem;
}

.vuk-button--md {
  font-size: 0.875rem;
  padding: 0.625rem 1rem;
}

.vuk-button--lg {
  font-size: 1rem;
  padding: 0.75rem 1.2rem;
}

.vuk-button--default,
.vuk-button--active {
  background: #111827;
}

.vuk-button--secondary {
  background: #4b5563;
}

.vuk-button--destructive {
  background: #991b1b;
}

.vuk-button--loading {
  opacity: 0.75;
}
</style>
