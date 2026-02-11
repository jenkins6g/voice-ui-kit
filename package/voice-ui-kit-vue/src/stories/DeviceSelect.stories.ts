import type { Meta, StoryObj } from "@storybook/vue3";
import DeviceSelect from "../components/DeviceSelect.vue";
import { MockPipecatProvider, createMockClient } from "./mockPipecat";

const mock = createMockClient();

const meta = {
  title: "Components/DeviceSelect",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const renderConnected = () => ({
  components: { DeviceSelect, MockPipecatProvider },
  setup() {
    return { client: mock.client };
  },
  template: `
    <MockPipecatProvider :client="client">
      <div style="width: 20rem">
        <DeviceSelect guide="Mic" placeholder="Select microphone" />
      </div>
    </MockPipecatProvider>
  `,
});

export const Connected: Story = {
  render: renderConnected,
};

export const DeviceSelectStory: Story = {
  name: "Device select",
  render: () => ({
    components: { DeviceSelect, MockPipecatProvider },
    template: `
      <MockPipecatProvider :with-client="false">
        <div style="width: 20rem">
          <DeviceSelect guide="Mic" placeholder="Select microphone" />
        </div>
      </MockPipecatProvider>
    `,
  }),
};
