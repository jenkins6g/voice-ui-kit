import type { TransportState } from "@pipecat-ai/client-js";

export type DataListClassNames = {
  container?: string;
  key?: string;
  value?: string;
};

export type ClientStatusClassNames = DataListClassNames & {
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
