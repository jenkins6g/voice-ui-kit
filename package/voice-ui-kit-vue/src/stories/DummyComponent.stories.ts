import type { Meta, StoryObj } from "@storybook/vue3";
import DummyComponent from "../components/DummyComponent.vue";

const meta = {
  title: "Components/Dummy component",
  component: DummyComponent,
} satisfies Meta<typeof DummyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
