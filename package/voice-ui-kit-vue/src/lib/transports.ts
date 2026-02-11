import type { Transport } from "@pipecat-ai/client-js";

export type TransportType = "daily" | "smallwebrtc";

export type DailyTransportOptions = ConstructorParameters<
  typeof import("@pipecat-ai/daily-transport").DailyTransport
>[0];

export type SmallWebRTCTransportOptions = ConstructorParameters<
  typeof import("@pipecat-ai/small-webrtc-transport").SmallWebRTCTransport
>[0];

export async function loadTransport(
  transportType: "daily",
): Promise<{
  DailyTransport: typeof import("@pipecat-ai/daily-transport").DailyTransport;
}>;

export async function loadTransport(
  transportType: "smallwebrtc",
): Promise<{
  SmallWebRTCTransport: typeof import("@pipecat-ai/small-webrtc-transport").SmallWebRTCTransport;
}>;

export async function loadTransport(transportType: TransportType) {
  try {
    if (transportType === "daily") {
      const { DailyTransport } = await import("@pipecat-ai/daily-transport");
      return { DailyTransport };
    }

    const { SmallWebRTCTransport } = await import(
      "@pipecat-ai/small-webrtc-transport"
    );
    return { SmallWebRTCTransport };
  } catch (loadError) {
    const errorMessage =
      loadError instanceof Error ? loadError.message : String(loadError);

    throw new Error(
      `Failed to load transport "${transportType}". Install ${
        transportType === "daily"
          ? "@pipecat-ai/daily-transport"
          : "@pipecat-ai/small-webrtc-transport"
      }. Original error: ${errorMessage}`,
    );
  }
}

export async function createTransport(
  transportType: "daily",
  options?: DailyTransportOptions,
): Promise<Transport>;

export async function createTransport(
  transportType: "smallwebrtc",
  options?: SmallWebRTCTransportOptions,
): Promise<Transport>;

export async function createTransport(
  transportType: TransportType,
  options?: DailyTransportOptions | SmallWebRTCTransportOptions,
): Promise<Transport>;

export async function createTransport(
  transportType: TransportType,
  options?: DailyTransportOptions | SmallWebRTCTransportOptions,
): Promise<Transport> {
  if (transportType === "daily") {
    const transportModule = await loadTransport(transportType);
    return new transportModule.DailyTransport(options as DailyTransportOptions);
  }

  const transportModule = await loadTransport(transportType);
  return new transportModule.SmallWebRTCTransport(
    options as SmallWebRTCTransportOptions,
  );
}
