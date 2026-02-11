import type { Meta, StoryObj } from "@storybook/vue3";
import UserScreenControl from "../components/UserScreenControl.vue";
import { MockPipecatProvider, createMockClient } from "./mockPipecat";

const mock = createMockClient();

const meta = {
  title: "Components/UserScreenControl",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { MockPipecatProvider, UserScreenControl },
    setup() {
      return { client: mock.client };
    },
    template: `
      <MockPipecatProvider :client="client">
        <div style="width: 26rem">
          <UserScreenControl active-text="Sharing screen" inactive-text="Share screen" />
        </div>
      </MockPipecatProvider>
    `,
  }),
};
