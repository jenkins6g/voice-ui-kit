import type { Meta, StoryObj } from "@storybook/vue3";
import { RTVIEvent } from "@pipecat-ai/client-js";
import VoiceVisualizer from "../components/VoiceVisualizer.vue";
import { MockPipecatProvider, createMockClient } from "./mockPipecat";

const mock = createMockClient();

const meta = {
  title: "Components/VoiceVisualizer",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const LocalParticipant: Story = {
  render: () => ({
    components: { MockPipecatProvider, VoiceVisualizer },
    setup() {
      const pushLevel = () => {
        mock.emit(RTVIEvent.LocalAudioLevel, Math.random());
      };

      return {
        client: mock.client,
        pushLevel,
      };
    },
    template: `
      <MockPipecatProvider :client="client">
        <div style="display: inline-flex; flex-direction: column; gap: 0.75rem; background: #111827; padding: 1rem; border-radius: 0.5rem;">
          <VoiceVisualizer participant-type="local" bar-color="#22c55e" :bar-count="12" :bar-width="6" :bar-gap="4" :bar-max-height="44" />
          <button type="button" @click="pushLevel">Simulate audio level</button>
        </div>
      </MockPipecatProvider>
    `,
  }),
};
