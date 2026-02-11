import type {
  APIRequest,
  PipecatClient,
  PipecatClientOptions,
  TransportConnectionParams,
  TransportState,
} from "@pipecat-ai/client-js";

import type { TransportType } from "../lib/transports";

export interface PipecatBaseProps {
  /** Optional parameters for connect(). Only used when no startBotParams are provided. */
  connectParams?: TransportConnectionParams;
  /** Optional parameters for startBot. */
  startBotParams?: APIRequest;
  /** Callback function to transform the startBot response before connecting. */
  startBotResponseTransformer?: (
    response: TransportConnectionParams,
  ) => TransportConnectionParams | Promise<TransportConnectionParams>;
  /** Type of transport to use for the connection. */
  transportType?: TransportType;
  /** Options for configuring the transport. */
  transportOptions?: Record<string, unknown>;
  /** Optional configuration options for the Pipecat client. */
  clientOptions?: Partial<PipecatClientOptions>;
  /** Whether to disable theme wrapping. Included for API parity. */
  noThemeProvider?: boolean;
  /** Whether to automatically connect to the session on mount. */
  connectOnMount?: boolean;
  /** Whether to automatically initialize devices on mount. */
  initDevicesOnMount?: boolean;
  /** Whether to disable bot audio output. Included for API parity. */
  noAudioOutput?: boolean;
  /** Reserved for future theme parity. */
  themeProps?: Record<string, unknown>;
}

export interface PipecatBaseChildProps {
  client: PipecatClient | null;
  handleConnect?: () => void | Promise<void>;
  handleDisconnect?: () => void | Promise<void>;
  error?: string | null;
  rawStartBotResponse?: TransportConnectionParams | unknown;
  transformedStartBotResponse?: TransportConnectionParams | unknown;
  transportState?: TransportState;
}
