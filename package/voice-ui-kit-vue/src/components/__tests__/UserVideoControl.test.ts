import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { h, nextTick } from "vue";
import { TransportStateEnum } from "@pipecat-ai/client-js";

import UserVideoControl from "../UserVideoControl.vue";
import { providePipecatApp } from "../../composables/pipecatApp";
import { createTestContext } from "../../test-utils/createTestContext";

describe("UserVideoControl", () => {
  it("toggles camera state through client", async () => {
    const client = {
      isCamEnabled: false,
      selectedCam: {},
      getAllCams: async () => [],
      updateCam: () => {},
      enableCam(enable: boolean) {
        this.isCamEnabled = enable;
      },
    };

    const wrapper = mount({
      setup() {
        providePipecatApp(
          createTestContext({
            client: client as never,
            transportState: TransportStateEnum.READY,
          }),
        );

        return () =>
          h(UserVideoControl, {
            noVideo: true,
            noDevicePicker: true,
            activeText: "Camera On",
            inactiveText: "Camera Off",
          });
      },
    });

    await nextTick();

    expect(wrapper.text()).toContain("Camera Off");

    await wrapper.find(".vuk-video-button").trigger("click");
    await nextTick();

    expect(client.isCamEnabled).toBe(true);
    expect(wrapper.text()).toContain("Camera On");
  });

  it("disables controls while loading", async () => {
    const client = {
      isCamEnabled: false,
      selectedCam: {},
      getAllCams: async () => [],
      updateCam: () => {},
      enableCam: () => {},
    };

    const wrapper = mount({
      setup() {
        providePipecatApp(
          createTestContext({
            client: client as never,
            transportState: TransportStateEnum.DISCONNECTED,
          }),
        );

        return () => h(UserVideoControl, { noVideo: true, noDevicePicker: true });
      },
    });

    await nextTick();
    expect(wrapper.find(".vuk-video-button").attributes("disabled")).toBeDefined();
  });
});
