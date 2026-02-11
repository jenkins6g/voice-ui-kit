import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";

import DeviceSelectComponent from "../DeviceSelectComponent.vue";

describe("DeviceSelect", () => {
  it("renders devices and calls updateDevice", async () => {
    const updateMic = vi.fn();
    const devices = [
      {
        deviceId: "mic-1",
        kind: "audioinput",
        groupId: "group-1",
        label: "Primary Mic",
        toJSON() {
          return this;
        },
      } as MediaDeviceInfo,
    ];

    const wrapper = mount(DeviceSelectComponent, {
      props: {
        availableDevices: devices,
        selectedDevice: devices[0],
        updateDevice: updateMic,
      },
    });

    const select = wrapper.find("select");
    expect(select.exists()).toBe(true);
    expect(wrapper.findAll("option")[1].text()).toContain("Primary Mic");

    await select.setValue("mic-1");
    expect(updateMic).toHaveBeenCalledWith("mic-1");
  });
});
