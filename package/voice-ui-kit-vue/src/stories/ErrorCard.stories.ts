import type { Meta, StoryObj } from "@storybook/vue3";
import ErrorCard from "../components/ErrorCard.vue";

const meta = {
  title: "Components/ErrorCard",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
  components: { ErrorCard },
  template: `
    <ErrorCard title="Unable to connect" icon="!">
      Transport initialization failed. Verify your credentials and endpoint.
    </ErrorCard>
  `,
  }),
};
