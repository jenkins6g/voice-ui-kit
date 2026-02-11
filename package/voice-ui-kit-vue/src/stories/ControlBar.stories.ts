import type { Meta, StoryObj } from "@storybook/vue3";
import ControlBarComponent from "../components/ControlBar.vue";
import ControlBarDivider from "../components/ControlBarDivider.vue";

const meta = {
  title: "Components/ControlBar",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
  components: { ControlBarComponent, ControlBarDivider },
  template: `
    <ControlBarComponent size="lg">
      <button type="button">Mic</button>
      <ControlBarDivider />
      <button type="button">Connect</button>
      <ControlBarDivider />
      <button type="button">Video</button>
    </ControlBarComponent>
  `,
  }),
};
