import type { Meta, StoryObj } from "@storybook/vue3";
import {
  TransportStateEnum,
  type TransportState,
} from "@pipecat-ai/client-js";
import ConnectButton from "../components/ConnectButton.vue";
import { MockPipecatProvider } from "./mockPipecat";

type ConnectStoryArgs = {
  transportState: TransportState;
  size: "sm" | "md" | "lg";
};

const meta = {
  title: "Components/ConnectButton",
  args: {
    transportState: TransportStateEnum.DISCONNECTED,
    size: "md",
  },
  argTypes: {
    transportState: {
      control: { type: "select" },
      options: Object.values(TransportStateEnum),
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<ConnectStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
  components: { ConnectButton, MockPipecatProvider },
  setup() {
    return { args };
  },
  template: `
    <MockPipecatProvider :transport-state="args.transportState">
      <ConnectButton :size="args.size" />
    </MockPipecatProvider>
  `,
  }),
};
