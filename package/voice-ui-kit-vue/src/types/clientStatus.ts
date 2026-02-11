import type { TransportState } from "@pipecat-ai/client-js";

export type ClientStatusClassNames = {
  root?: string;
  row?: string;
  label?: string;
  value?: string;
  agentValue?: string;
  clientValue?: string;
};

export type ClientStatusProps = {
  classNames?: ClientStatusClassNames;
  noAgentState?: boolean;
  noClientState?: boolean;
};

export type ClientStatusComponentProps = {
  className?: string;
  transportState?: TransportState | "connecting" | "connected" | "ready" | "disconnected" | null;
};
