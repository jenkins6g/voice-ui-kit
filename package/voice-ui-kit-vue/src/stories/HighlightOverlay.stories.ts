import type { Meta, StoryObj } from "@storybook/vue3";
import { PlaceholderStory } from "./storybookPlaceholders";

const meta = {
  title: "Components/Highlight overlay",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { PlaceholderStory },
    template:
      '<PlaceholderStory title="Highlight overlay" details="React has this component; Vue implementation is pending." />',
  }),
};

export const CustomStyling: Story = {
  name: "Custom styling",
  render: Default.render,
};

export const NoAutoClear: Story = {
  name: "No auto clear",
  render: Default.render,
};
