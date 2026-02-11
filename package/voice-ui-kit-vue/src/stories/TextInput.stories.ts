import type { Meta, StoryObj } from "@storybook/vue3";
import { PlaceholderStory } from "./storybookPlaceholders";

const meta = {
  title: "Components/Text input",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const renderPlaceholder = () => ({
  components: { PlaceholderStory },
  template:
    '<PlaceholderStory title="Text input" details="React text input primitives are not ported to Vue yet." />',
});

export const Component: Story = { render: renderPlaceholder };
export const Multiline: Story = { render: renderPlaceholder };
export const Pipecat: Story = { render: renderPlaceholder };
export const WithButtonLabel: Story = {
  name: "With button label",
  render: renderPlaceholder,
};
