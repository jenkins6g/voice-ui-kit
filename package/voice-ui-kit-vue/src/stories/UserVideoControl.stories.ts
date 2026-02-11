import type { Meta, StoryObj } from "@storybook/vue3";
import UserVideoControl from "../components/UserVideoControl.vue";
import { MockPipecatProvider, createMockClient } from "./mockPipecat";

const mock = createMockClient();

const meta = {
  title: "Components/UserVideoControl",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Connected: Story = {
  render: () => ({
    components: { MockPipecatProvider, UserVideoControl },
    setup() {
      return { client: mock.client };
    },
    template: `
      <MockPipecatProvider :client="client">
        <div style="width: 26rem">
          <UserVideoControl active-text="Camera on" inactive-text="Camera off" />
        </div>
      </MockPipecatProvider>
    `,
  }),
};

export const Default: Story = {
  render: () => ({
    components: { MockPipecatProvider, UserVideoControl },
    setup() {
      return { client: mock.client };
    },
    template: `
      <MockPipecatProvider :client="client">
        <div style="width: 26rem">
          <UserVideoControl active-text="Camera on" inactive-text="Camera off" />
        </div>
      </MockPipecatProvider>
    `,
  }),
};
