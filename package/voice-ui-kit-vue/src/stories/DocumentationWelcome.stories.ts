import type { Meta, StoryObj } from "@storybook/vue3";

const meta = {
  title: "Documentation",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Welcome: Story = {
  render: () => ({
    template: `
      <section style="max-width: 42rem; line-height: 1.5;">
        <h2 style="margin: 0 0 0.5rem;">Welcome to Vue Voice UI Kit Storybook</h2>
        <p style="margin: 0;">
          This mirrors the React Storybook structure while Vue implementation parity is in progress.
        </p>
      </section>
    `,
  }),
};
