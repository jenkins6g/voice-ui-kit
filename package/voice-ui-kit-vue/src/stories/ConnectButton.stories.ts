import type { Meta, StoryObj } from "@storybook/vue3";
import {
  TransportStateEnum,
  type TransportState,
} from "@pipecat-ai/client-js";
import { computed, defineComponent, h, ref, shallowRef, watch } from "vue";
import ConnectButton from "../components/ConnectButton.vue";
import { providePipecatApp } from "../composables/pipecatApp";

type ConnectStoryArgs = {
  transportState: TransportState;
  size: "sm" | "md" | "lg";
};

const MockPipecatProvider = defineComponent({
  name: "MockPipecatProvider",
  props: {
    transportState: {
      type: String as () => TransportState,
      default: TransportStateEnum.DISCONNECTED,
    },
  },
  setup(props, { slots }) {
    const transportState = ref<TransportState>(props.transportState);

    watch(
      () => props.transportState,
      (next) => {
        transportState.value = next;
      },
      { immediate: true },
    );

    providePipecatApp({
      client: shallowRef(null),
      error: ref(null),
      isMuted: ref(false),
      rawStartBotResponse: ref(null),
      transformedStartBotResponse: ref(null),
      transportState,
      isConnected: computed(
        () => transportState.value === "connected" || transportState.value === "ready",
      ),
      isConnecting: computed(
        () =>
          transportState.value === "initializing" ||
          transportState.value === "authenticating" ||
          transportState.value === "authenticated" ||
          transportState.value === "connecting",
      ),
      handleConnect: async () => {
        transportState.value = TransportStateEnum.READY;
      },
      handleDisconnect: async () => {
        transportState.value = TransportStateEnum.DISCONNECTED;
      },
      toggleMute: () => {},
    });

    return () =>
      h(
        "div",
        {
          style: "display: inline-flex; align-items: center; gap: 0.5rem;",
        },
        slots.default?.(),
      );
  },
});

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
