import type { Meta, StoryObj } from "@storybook/vue3";
import ControlBar from "../components/ControlBar.vue";
import ControlBarDivider from "../components/ControlBarDivider.vue";

const meta = {
  title: "Components/Control bar divider",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { ControlBar, ControlBarDivider },
    template: `
      <ControlBar>
        <button>Audio</button>
        <ControlBarDivider />
        <button>Connect</button>
      </ControlBar>
    `,
  }),
};
