import type { Meta, StoryObj } from "@storybook/vue3";
import { PlaceholderStory } from "./storybookPlaceholders";

const meta = {
  title: "Components/Message container",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { PlaceholderStory },
    template:
      '<PlaceholderStory title="Message container" details="Message container parity is pending in Vue." />',
  }),
};
