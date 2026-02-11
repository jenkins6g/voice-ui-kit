import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { h, nextTick } from "vue";
import { TransportStateEnum } from "@pipecat-ai/client-js";

import UserAudioControl from "../UserAudioControl.vue";
import { providePipecatApp } from "../../composables/pipecatApp";
import { createTestContext } from "../../test-utils/createTestContext";

const createFakeClient = () => {
  return {
    getAllMics: async () => [],
    getAllSpeakers: async () => [],
    selectedMic: {},
    selectedSpeaker: {},
    updateMic: () => {},
    updateSpeaker: () => {},
  };
};

describe("UserAudioControl", () => {
  it("toggles mute state through context", async () => {
    const wrapper = mount({
      setup() {
        providePipecatApp(
          createTestContext({
            client: createFakeClient() as never,
            isMuted: false,
            transportState: TransportStateEnum.READY,
          }),
        );
        return () => h(UserAudioControl, { noVisualizer: true });
      },
    });

    await nextTick();
    await wrapper.find(".vuk-audio-main").trigger("click");

    expect(wrapper.text().toLowerCase()).toContain("mic off");
  });
});
