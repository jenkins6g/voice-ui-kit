import type { Meta, StoryObj } from "@storybook/vue3";
import ConsoleTemplate from "../templates/ConsoleTemplate.vue";

const meta = {
  title: "Templates/Console",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { ConsoleTemplate },
    data() {
      return {
        injectMessage: null as
          | null
          | ((message: {
              role: "user" | "assistant" | "system";
              parts: Array<{ text: string; final: boolean; createdAt: string }>;
            }) => void),
      };
    },
    methods: {
      onInjectMessage(
        injectMessage: (message: {
          role: "user" | "assistant" | "system";
          parts: Array<{ text: string; final: boolean; createdAt: string }>;
        }) => void,
      ) {
        this.injectMessage = injectMessage;
      },
      injectUser() {
        if (!this.injectMessage) return;
        this.injectMessage({
          role: "user",
          parts: [
            {
              text: "How are you today?",
              final: true,
              createdAt: new Date().toISOString(),
            },
          ],
        });
      },
      injectAssistant() {
        if (!this.injectMessage) return;
        this.injectMessage({
          role: "assistant",
          parts: [
            {
              text: "I'm ready. Ask me anything about your voice pipeline.",
              final: true,
              createdAt: new Date().toISOString(),
            },
          ],
        });
      },
    },
    template: `
      <div
        style="
          width: min(100%, 1120px);
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          background: #ffffff;
          padding: 0.35rem;
          border-radius: 0.35rem;
        "
      >
        <div style="display:flex; gap:0.5rem; justify-content:center;">
          <button type="button" @click="injectUser" style="background:#3b82f6; color:#fff; border:0; border-radius:0.3rem; padding:0.45rem 0.65rem;">Inject User Message</button>
          <button type="button" @click="injectAssistant" style="background:#4caf50; color:#fff; border:0; border-radius:0.3rem; padding:0.45rem 0.65rem;">Inject Assistant Message</button>
        </div>
        <div style="height: 760px; background: #020617; border-radius: 0.25rem; overflow: hidden;">
          <ConsoleTemplate
            transport-type="smallwebrtc"
            :connect-params="{ webrtcUrl: '/api/offer' }"
            :no-auto-init-devices="true"
            :no-bot-video="false"
            theme="dark"
            title-text="Pipecat Playground"
            :on-inject-message="onInjectMessage"
          />
        </div>
      </div>
    `,
  }),
};
