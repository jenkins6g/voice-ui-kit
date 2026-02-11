import type { Meta, StoryObj } from "@storybook/vue3";
import UserVideoComponent from "../components/UserVideoComponent.vue";

const cams = [
  { deviceId: "cam-1", groupId: "default", kind: "videoinput", label: "FaceTime HD Camera" },
  { deviceId: "cam-2", groupId: "default", kind: "videoinput", label: "USB Camera" },
] as unknown as MediaDeviceInfo[];

const meta = {
  title: "Components/UserVideoComponent",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
  components: { UserVideoComponent },
  setup() {
    return { cams };
  },
  template: `
    <div style="width: 26rem">
      <UserVideoComponent
        active-text="Camera on"
        :available-cams="cams"
        :is-cam-enabled="true"
        :selected-cam="cams[0]"
      />
    </div>
  `,
  }),
};
