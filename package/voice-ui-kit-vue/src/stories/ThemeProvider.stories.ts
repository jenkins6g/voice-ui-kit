import type { Meta, StoryObj } from "@storybook/vue3";
import ThemeProvider from "../components/ThemeProvider.vue";

const meta = {
  title: "Documentation/Theme",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  render: () => ({
    components: { ThemeProvider },
    template: `
      <ThemeProvider default-theme="light" class-name="theme-preview">
        <div style="padding: 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem;">
          Light theme wrapper
        </div>
      </ThemeProvider>
    `,
  }),
};

export const Dark: Story = {
  render: () => ({
    components: { ThemeProvider },
    template: `
      <ThemeProvider default-theme="dark" class-name="theme-preview">
        <div style="padding: 1rem; border: 1px solid #374151; border-radius: 0.5rem; background: #111827; color: #f9fafb;">
          Dark theme wrapper
        </div>
      </ThemeProvider>
    `,
  }),
};
