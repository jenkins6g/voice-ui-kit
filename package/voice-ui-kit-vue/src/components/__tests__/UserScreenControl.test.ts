import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { h, nextTick } from "vue";
import { TransportStateEnum } from "@pipecat-ai/client-js";

import UserScreenControl from "../UserScreenControl.vue";
import { providePipecatApp } from "../../composables/pipecatApp";
import { createTestContext } from "../../test-utils/createTestContext";

describe("UserScreenControl", () => {
  it("toggles screen sharing when clicked", async () => {
    const enableScreenShare = vi.fn();

    const client = {
      isSharingScreen: false,
      enableScreenShare,
      on: vi.fn(),
      off: vi.fn(),
    };

    const wrapper = mount({
      setup() {
        providePipecatApp(
          createTestContext({
            client: client as never,
            transportState: TransportStateEnum.READY,
          }),
        );
        return () => h(UserScreenControl);
      },
    });

    await nextTick();
    await wrapper.find("button").trigger("click");

    expect(enableScreenShare).toHaveBeenCalledWith(true);
  });
});
