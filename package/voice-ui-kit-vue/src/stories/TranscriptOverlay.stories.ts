import type { Meta, StoryObj } from "@storybook/vue3";
import { PlaceholderStory } from "./storybookPlaceholders";

const meta = {
  title: "Components/Transcript overlay",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const renderPlaceholder = () => ({
  components: { PlaceholderStory },
  template:
    '<PlaceholderStory title="Transcript overlay" details="Transcript overlay stories from React are not yet implemented in Vue." />',
});

export const BasicTranscript: Story = { render: renderPlaceholder };
export const CustomAnimations: Story = { name: "Custom animations", render: renderPlaceholder };
export const LongTranscript: Story = { name: "Long transcript", render: renderPlaceholder };
export const MultilineBackground: Story = {
  name: "Multiline background",
  render: renderPlaceholder,
};
export const SimulatedSpeech: Story = { name: "Simulated speech", render: renderPlaceholder };
export const SingleWord: Story = { name: "Single word", render: renderPlaceholder };
export const WithTurnEnd: Story = { name: "With turn end", render: renderPlaceholder };
export const WordAnimation: Story = { name: "Word animation", render: renderPlaceholder };
