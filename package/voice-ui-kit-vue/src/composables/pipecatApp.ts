import { inject, provide, ref, type InjectionKey, type Ref } from "vue";

export type PipecatAppContext = {
  isConnected: Ref<boolean>;
  isConnecting: Ref<boolean>;
  isMuted: Ref<boolean>;
  error: Ref<string | null>;
  handleConnect: () => Promise<void>;
  handleDisconnect: () => Promise<void>;
  toggleMute: () => void;
};

const pipecatAppKey: InjectionKey<PipecatAppContext> = Symbol("pipecat-app");

export const createPipecatAppContext = (): PipecatAppContext => {
  const isConnected = ref(false);
  const isConnecting = ref(false);
  const isMuted = ref(false);
  const error = ref<string | null>(null);

  const handleConnect = async () => {
    isConnecting.value = true;
    error.value = null;

    try {
      isConnected.value = true;
    } catch {
      error.value = "Unable to connect.";
    } finally {
      isConnecting.value = false;
    }
  };

  const handleDisconnect = async () => {
    isConnected.value = false;
  };

  const toggleMute = () => {
    isMuted.value = !isMuted.value;
  };

  return {
    isConnected,
    isConnecting,
    isMuted,
    error,
    handleConnect,
    handleDisconnect,
    toggleMute,
  };
};

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
