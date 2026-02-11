import type { Meta, StoryObj } from "@storybook/vue3";
import { MockPipecatProvider, createMockClient } from "./mockPipecat";
import VoiceVisualizer from "../components/VoiceVisualizer.vue";

const mock = createMockClient();

const meta = {
  title: "Panels",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const BotAudioPanel: Story = {
  name: "Bot audio panel",
  render: () => ({
    components: { MockPipecatProvider, VoiceVisualizer },
    setup() {
      return { client: mock.client };
    },
    template: `
      <MockPipecatProvider :client="client">
        <section
          style="
            width: 22rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            background: #f8fafc;
          "
        >
          <header
            style="
              border-bottom: 1px solid #d1d5db;
              padding: 0.5rem 0.75rem;
              font-size: 0.75rem;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: #334155;
            "
          >
            Bot audio
          </header>
          <div style="display: flex; align-items: center; justify-content: center; min-height: 5.5rem; padding: 0.75rem;">
            <VoiceVisualizer participant-type="bot" :bar-width="4" :bar-gap="4" :bar-count="14" :bar-max-height="28" />
          </div>
        </section>
      </MockPipecatProvider>
    `,
  }),
};
