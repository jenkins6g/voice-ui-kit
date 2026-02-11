import type { Meta, StoryObj } from "@storybook/vue3";
import UserAudioControl from "../components/UserAudioControl.vue";
import { MockPipecatProvider, createMockClient } from "./mockPipecat";

const mock = createMockClient();

const meta = {
  title: "Components/UserAudioControl",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const renderConnected = () => ({
  components: { MockPipecatProvider, UserAudioControl },
  setup() {
    return { client: mock.client };
  },
  template: `
    <MockPipecatProvider :client="client">
      <UserAudioControl active-text="Mic on" inactive-text="Mic off" />
    </MockPipecatProvider>
  `,
});

export const Connected: Story = {
  render: renderConnected,
};

export const NoAudio: Story = {
  name: "No audio",
  render: () => ({
    components: { MockPipecatProvider, UserAudioControl },
    setup() {
      return { client: mock.client };
    },
    template: `
      <MockPipecatProvider :client="client">
        <UserAudioControl :no-audio="true" no-audio-text="Audio disabled" />
      </MockPipecatProvider>
    `,
  }),
};

export const PureComponent: Story = {
  name: "Pure component",
  render: () => ({
    components: { UserAudioControl, MockPipecatProvider },
    template: `
      <MockPipecatProvider :with-client="false" transport-state="disconnected">
        <UserAudioControl :no-device-picker="true" :no-visualizer="true" />
      </MockPipecatProvider>
    `,
  }),
};

export const TextOnly: Story = {
  name: "Text only",
  render: () => ({
    components: { MockPipecatProvider, UserAudioControl },
    setup() {
      return { client: mock.client };
    },
    template: `
      <MockPipecatProvider :client="client">
        <UserAudioControl no-icon :no-visualizer="true" active-text="Microphone" inactive-text="Muted" />
      </MockPipecatProvider>
    `,
  }),
};

export const Default: Story = {
  render: () => ({
    components: { MockPipecatProvider, UserAudioControl },
    setup() {
      return { client: mock.client };
    },
    template: `
      <MockPipecatProvider :client="client">
        <UserAudioControl active-text="Mic on" inactive-text="Mic off" />
      </MockPipecatProvider>
    `,
  }),
};
