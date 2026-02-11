import { ref, shallowRef } from "vue";
import { TransportStateEnum, type PipecatClient, type TransportState } from "@pipecat-ai/client-js";

import type { PipecatAppContext } from "../composables/pipecatApp";

export type PartialTestContext = {
  transportState?: TransportState;
  isMuted?: boolean;
  onConnect?: () => Promise<void>;
  onDisconnect?: () => Promise<void>;
  toggleMute?: () => void;
  client?: PipecatClient | null;
};

export const createTestContext = (
  overrides: PartialTestContext = {},
): PipecatAppContext => {
  const isMuted = ref(overrides.isMuted ?? false);

  return {
    client: shallowRef(overrides.client ?? null),
    error: ref(null),
    isMuted,
    rawStartBotResponse: ref(null),
    transformedStartBotResponse: ref(null),
    transportState: ref(overrides.transportState ?? TransportStateEnum.DISCONNECTED),
    isConnected: ref(false),
    isConnecting: ref(false),
    handleConnect: overrides.onConnect ?? (async () => {}),
    handleDisconnect: overrides.onDisconnect ?? (async () => {}),
    toggleMute:
      overrides.toggleMute ??
      (() => {
        isMuted.value = !isMuted.value;
      }),
  };
};
