import { inject, provide, type InjectionKey, type Ref, type ShallowRef } from "vue";
import type {
  PipecatClient,
  TransportConnectionParams,
  TransportState,
} from "@pipecat-ai/client-js";

export type PipecatAppContext = {
  client: ShallowRef<PipecatClient | null>;
  error: Ref<string | null>;
  isMuted: Ref<boolean>;
  rawStartBotResponse: Ref<TransportConnectionParams | unknown>;
  transformedStartBotResponse: Ref<TransportConnectionParams | unknown>;
  transportState: Ref<TransportState>;
  isConnected: Ref<boolean>;
  isConnecting: Ref<boolean>;
  handleConnect: () => Promise<void>;
  handleDisconnect: () => Promise<void>;
  toggleMute: () => void;
};

const pipecatAppKey: InjectionKey<PipecatAppContext> = Symbol("pipecat-app");

export const providePipecatApp = (context: PipecatAppContext) => {
  provide(pipecatAppKey, context);
};

export const usePipecatApp = (): PipecatAppContext => {
  const context = inject(pipecatAppKey);

  if (!context) {
    throw new Error("usePipecatApp must be used inside PipecatAppBase.");
  }

  return context;
};

export const tryUsePipecatApp = (): PipecatAppContext | null => {
  return inject(pipecatAppKey, null);
};
