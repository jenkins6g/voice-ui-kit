import type {
  APIRequest,
  PipecatClient,
  PipecatClientOptions,
  TransportConnectionParams,
  TransportState,
} from "@pipecat-ai/client-js";

import type { TransportType } from "../lib/transports";

export type PipecatThemeProps = {
  defaultTheme?: string;
  className?: string;
};

export interface PipecatBaseProps {
  connectParams?: TransportConnectionParams;
  startBotParams?: APIRequest;
  startBotResponseTransformer?: (
    response: TransportConnectionParams,
  ) => TransportConnectionParams | Promise<TransportConnectionParams>;
  transportType?: TransportType;
  transportOptions?: Record<string, unknown>;
  clientOptions?: Partial<PipecatClientOptions>;
  noThemeProvider?: boolean;
  connectOnMount?: boolean;
  initDevicesOnMount?: boolean;
  noAudioOutput?: boolean;
  themeProps?: PipecatThemeProps;
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
