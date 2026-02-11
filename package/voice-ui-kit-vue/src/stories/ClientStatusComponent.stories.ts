import type { Meta, StoryObj } from "@storybook/vue3";
import ClientStatusComponent from "../components/ClientStatusComponent.vue";

const meta = {
  title: "Components/ClientStatusComponent",
  component: ClientStatusComponent,
  args: {
    transportState: "disconnected",
  },
  argTypes: {
    transportState: {
      control: { type: "select" },
      options: [
        "disconnected",
        "initializing",
        "authenticating",
        "authenticated",
        "connecting",
        "connected",
        "ready",
        "error",
      ],
    },
  },
} satisfies Meta<typeof ClientStatusComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
