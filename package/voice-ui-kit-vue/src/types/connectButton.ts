import type { TransportState } from "@pipecat-ai/client-js";

export type ConnectButtonSize = "sm" | "md" | "lg";

export type ConnectButtonVariant =
  | "default"
  | "active"
  | "secondary"
  | "destructive";

export type ConnectButtonStateContent = Partial<
  Record<
    TransportState,
    {
      children: string;
      variant: ConnectButtonVariant;
      className?: string;
    }
  >
>;

export type ConnectButtonProps = {
  className?: string;
  onConnect?: () => void | Promise<void>;
  onClick?: () => void | Promise<void>;
  onDisconnect?: () => void | Promise<void>;
  size?: ConnectButtonSize;
  defaultVariant?: ConnectButtonVariant;
  stateContent?: ConnectButtonStateContent;
};
