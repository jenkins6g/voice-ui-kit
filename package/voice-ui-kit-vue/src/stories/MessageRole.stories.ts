import type { Meta, StoryObj } from "@storybook/vue3";
import { PlaceholderStory } from "./storybookPlaceholders";

const meta = {
  title: "Components/Message role",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { PlaceholderStory },
    template:
      '<PlaceholderStory title="Message role" details="Message role parity is pending in Vue." />',
  }),
};
