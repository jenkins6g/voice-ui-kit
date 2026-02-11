import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { h, nextTick } from "vue";
import { RTVIEvent } from "@pipecat-ai/client-js";

import ClientStatus from "../ClientStatus.vue";
import { providePipecatApp } from "../../composables/pipecatApp";
import { createTestContext } from "../../test-utils/createTestContext";

describe("ClientStatus", () => {
  it("registers bot status event listeners and renders client state", async () => {
    const handlers = new Map<string, Function>();

    const client = {
      on(event: string, handler: Function) {
        handlers.set(event, handler);
      },
      off(event: string) {
        handlers.delete(event);
      },
    };

    const context = createTestContext({
      client: client as never,
    });

    const wrapper = mount({
      setup() {
        providePipecatApp(context);
        return () => h(ClientStatus);
      },
    });
    await nextTick();

    expect(wrapper.text()).toContain("Client");
    expect(wrapper.text()).toContain("disconnected");

    await nextTick();
    expect(handlers.get(RTVIEvent.BotConnected)).toBeTypeOf("function");
    expect(handlers.get(RTVIEvent.BotReady)).toBeTypeOf("function");
  });
});
