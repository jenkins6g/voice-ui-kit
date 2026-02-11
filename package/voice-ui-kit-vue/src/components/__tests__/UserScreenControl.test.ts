import { RTVIEvent, TransportStateEnum } from "@pipecat-ai/client-js";
import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { h, nextTick } from "vue";

import UserScreenControl from "../UserScreenControl.vue";
import { providePipecatApp } from "../../composables/pipecatApp";
import { createTestContext } from "../../test-utils/createTestContext";

describe("UserScreenControl", () => {
  it("toggles screen sharing when clicked", async () => {
    const enableScreenShare = vi.fn();
    const handlers = new Map<string, Function>();

    const client = {
      isSharingScreen: false,
      enableScreenShare,
      on(event: string, handler: Function) {
        handlers.set(event, handler);
      },
      off(event: string) {
        handlers.delete(event);
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
        return () => h(UserScreenControl);
      },
    });

    await nextTick();
    await wrapper.find("button").trigger("click");

    expect(enableScreenShare).toHaveBeenCalledWith(true);
    expect(handlers.get(RTVIEvent.ScreenTrackStarted)).toBeTypeOf("function");
  });

  it("reacts to local screen lifecycle events", async () => {
    const handlers = new Map<string, Function>();
    const client = {
      isSharingScreen: false,
      enableScreenShare: vi.fn(),
      on(event: string, handler: Function) {
        handlers.set(event, handler);
      },
      off(event: string) {
        handlers.delete(event);
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
        return () => h(UserScreenControl);
      },
    });

    await nextTick();
    const started = handlers.get(RTVIEvent.ScreenTrackStarted);
    started?.({ kind: "video", id: "screen-1" }, { local: true });
    await nextTick();

    expect(wrapper.find(".vuk-screen-preview").exists()).toBe(true);

    const stopped = handlers.get(RTVIEvent.ScreenTrackStopped);
    stopped?.({ kind: "video", id: "screen-1" }, { local: true });
    await nextTick();

    expect(wrapper.find(".vuk-screen-preview").exists()).toBe(false);
  });
});
