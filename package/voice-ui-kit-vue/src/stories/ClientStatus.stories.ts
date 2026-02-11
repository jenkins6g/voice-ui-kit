import type { Meta, StoryObj } from "@storybook/vue3";
import { RTVIEvent } from "@pipecat-ai/client-js";
import ClientStatus from "../components/ClientStatus.vue";
import { MockPipecatProvider, createMockClient } from "./mockPipecat";

const mock = createMockClient();

const meta = {
  title: "Components/ClientStatus",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { ClientStatus, MockPipecatProvider },
    setup() {
      const emitBotConnected = () => {
        mock.emit(RTVIEvent.BotConnected);
      };
      const emitBotReady = () => {
        mock.emit(RTVIEvent.BotReady);
      };
      const emitBotDisconnected = () => {
        mock.emit(RTVIEvent.BotDisconnected);
      };

      return {
        client: mock.client,
        emitBotConnected,
        emitBotReady,
        emitBotDisconnected,
      };
    },
    template: `
      <MockPipecatProvider :client="client" transport-state="connecting">
        <ClientStatus />
        <div style="display: inline-flex; gap: 0.5rem;">
          <button type="button" @click="emitBotConnected">Bot Connected</button>
          <button type="button" @click="emitBotReady">Bot Ready</button>
          <button type="button" @click="emitBotDisconnected">Bot Disconnected</button>
        </div>
      </MockPipecatProvider>
    `,
  }),
};
