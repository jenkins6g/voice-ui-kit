import type { Meta, StoryObj } from "@storybook/vue3";
import { PlaceholderStory } from "./storybookPlaceholders";

const meta = {
  title: "Templates/Widget",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { PlaceholderStory },
    template:
      '<PlaceholderStory title="Widget template" details="React Widget template has no Vue equivalent yet; this slot is reserved for parity." />',
  }),
};
