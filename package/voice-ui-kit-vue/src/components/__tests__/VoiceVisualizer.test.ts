import { beforeAll, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { h } from "vue";
import { RTVIEvent } from "@pipecat-ai/client-js";

import VoiceVisualizer from "../VoiceVisualizer.vue";
import { providePipecatApp } from "../../composables/pipecatApp";
import { createTestContext } from "../../test-utils/createTestContext";

beforeAll(() => {
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    configurable: true,
    value: vi.fn(() => ({
      setTransform: () => {},
      scale: () => {},
      clearRect: () => {},
      fillRect: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      stroke: () => {},
      closePath: () => {},
      arc: () => {},
      fill: () => {},
      lineCap: "round",
      lineWidth: 0,
      strokeStyle: "#000",
      fillStyle: "#000",
      globalAlpha: 1,
    })),
  });

  vi.stubGlobal("requestAnimationFrame", () => 1);
  vi.stubGlobal("cancelAnimationFrame", () => {});
});

describe("VoiceVisualizer", () => {
  it("subscribes to audio level events on mount", () => {
    const on = vi.fn();
    const off = vi.fn();

    const wrapper = mount({
      setup() {
        providePipecatApp(
          createTestContext({
            client: {
              on,
              off,
            } as never,
          }),
        );

        return () => h(VoiceVisualizer, { participantType: "local" });
      },
    });

    expect(on).toHaveBeenCalledWith(RTVIEvent.LocalAudioLevel, expect.any(Function));
    expect(on).toHaveBeenCalledWith(RTVIEvent.RemoteAudioLevel, expect.any(Function));

    wrapper.unmount();
    expect(off).toHaveBeenCalled();
  });
});
