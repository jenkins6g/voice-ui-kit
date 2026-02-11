import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { h, provide } from "vue";
import { TransportStateEnum } from "@pipecat-ai/client-js";

import ConnectButton from "../ConnectButton.vue";
import { providePipecatApp } from "../../composables/pipecatApp";
import { createTestContext } from "../../test-utils/createTestContext";

const mountWithContext = (contextOverrides = {}) => {
  return mount({
    setup() {
      providePipecatApp(createTestContext(contextOverrides));
      return () => h(ConnectButton);
    },
  });
};

describe("ConnectButton", () => {
  it("shows connect label when disconnected", () => {
    const wrapper = mountWithContext({
      transportState: TransportStateEnum.DISCONNECTED,
    });

    expect(wrapper.text()).toContain("Connect");
  });

  it("calls connect handler when disconnected", async () => {
    const onConnect = vi.fn(async () => {});
    const wrapper = mountWithContext({
      transportState: TransportStateEnum.DISCONNECTED,
      onConnect,
    });

    await wrapper.find("button").trigger("click");

    expect(onConnect).toHaveBeenCalledTimes(1);
  });

  it("calls disconnect handler when ready", async () => {
    const onDisconnect = vi.fn(async () => {});
    const wrapper = mountWithContext({
      transportState: TransportStateEnum.READY,
      onDisconnect,
    });

    await wrapper.find("button").trigger("click");

    expect(onDisconnect).toHaveBeenCalledTimes(1);
  });
});
