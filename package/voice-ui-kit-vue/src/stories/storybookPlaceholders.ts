import { defineComponent } from "vue";

export const PlaceholderStory = defineComponent({
  name: "PlaceholderStory",
  props: {
    title: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      default: "This component is not implemented yet in the Vue package.",
    },
  },
  template: `
    <section
      style="
        border: 1px solid #d1d5db;
        border-radius: 10px;
        padding: 12px 14px;
        width: min(32rem, 100%);
        background: #f8fafc;
      "
    >
      <h3 style="margin: 0 0 8px; font-size: 0.95rem;">{{ title }}</h3>
      <p style="margin: 0; color: #475569; font-size: 0.86rem;">{{ details }}</p>
    </section>
  `,
});
