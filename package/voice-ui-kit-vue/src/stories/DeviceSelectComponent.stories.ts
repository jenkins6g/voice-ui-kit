import type { Meta, StoryObj } from "@storybook/vue3";
import DeviceSelectComponent from "../components/DeviceSelectComponent.vue";

const devices = [
  { deviceId: "mic-1", groupId: "default", kind: "audioinput", label: "Studio Mic" },
  { deviceId: "mic-2", groupId: "default", kind: "audioinput", label: "Laptop Mic" },
] as unknown as MediaDeviceInfo[];

const meta = {
  title: "Components/DeviceSelectComponent",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
  components: { DeviceSelectComponent },
  setup() {
    return { devices };
  },
  template: `
    <div style="width: 20rem">
      <DeviceSelectComponent
        guide="Input device"
        :available-devices="devices"
        :selected-device="devices[0]"
      />
    </div>
  `,
  }),
};
