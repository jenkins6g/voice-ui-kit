import { RTVIEvent, TransportStateEnum } from "@pipecat-ai/client-js";
import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick, onMounted } from "vue";
import { describe, expect, it, vi } from "vitest";

import ConsoleTemplate from "../ConsoleTemplate.vue";

type HandlerMap = Map<string, Function>;

class MockSmallWebRTCTransport {
  setAudioCodec = vi.fn();
  setVideoCodec = vi.fn();
}

vi.mock("../../lib/transports", () => ({
  loadTransport: vi.fn(async () => ({ SmallWebRTCTransport: MockSmallWebRTCTransport })),
}));

const createMockClient = () => {
  const handlers: HandlerMap = new Map();
  const sendText = vi.fn(async () => {});
  const transport = new MockSmallWebRTCTransport();

  const client = {
    version: "test-version",
    transport,
    on(event: string, handler: Function) {
      handlers.set(event, handler);
    },
    off(event: string) {
      handlers.delete(event);
    },
    sendText,
  };

  return { client, handlers, sendText, transport };
};

const mountTemplate = (
  props: Record<string, unknown> = {},
  options: { transportState?: TransportStateEnum } = {},
) => {
  const { client, handlers, sendText, transport } = createMockClient();

  const PipecatAppBaseStub = defineComponent({
    name: "PipecatAppBaseStub",
    emits: ["initialized"],
    setup(_stubProps, { emit, slots }) {
      onMounted(() => {
        emit("initialized", client);
      });
      return () =>
        h(
          "div",
          { "data-testid": "pipecat-app-base" },
          slots.default?.({
            client,
            error: null,
            handleConnect: async () => {},
            handleDisconnect: async () => {},
            transportState: options.transportState ?? TransportStateEnum.READY,
          }),
        );
    },
  });

  const wrapper = mount(ConsoleTemplate, {
    props,
    global: {
      stubs: {
        PipecatAppBase: PipecatAppBaseStub,
        ConnectButton: true,
        ClientStatus: true,
        UserAudioControl: true,
        UserVideoControl: true,
        UserScreenControl: true,
        VoiceVisualizer: true,
        ErrorCard: true,
      },
    },
  });

  return { wrapper, handlers, sendText, transport };
};

const dispatchPointer = (
  target: EventTarget,
  type: "pointerdown" | "pointermove" | "pointerup",
  coords: { x?: number; y?: number },
) => {
  const EventCtor = (window.PointerEvent || window.MouseEvent) as typeof MouseEvent;
  const event = new EventCtor(type, {
    bubbles: true,
    clientX: coords.x ?? 0,
    clientY: coords.y ?? 0,
  });
  target.dispatchEvent(event);
};

describe("ConsoleTemplate", () => {
  it("renders desktop and mobile layout shells", () => {
    const { wrapper } = mountTemplate();

    expect(wrapper.find('[data-testid="desktop-layout"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="mobile-layout"]').exists()).toBe(true);
  });

  it("hides media and conversation areas based on toggles", () => {
    const { wrapper } = mountTemplate({
      noBotAudio: true,
      noBotVideo: true,
      noConversation: true,
      noMetrics: true,
    });

    expect(wrapper.find('[data-testid="desktop-media-panel"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="desktop-conversation-panel"]').exists()).toBe(false);
  });

  it("uses info as mobile default when bot and conversation panels are disabled", () => {
    const { wrapper } = mountTemplate({
      noBotAudio: true,
      noBotVideo: true,
      noConversation: true,
      noMetrics: true,
    });

    expect(wrapper.find('[data-testid="mobile-tab-info"]').exists()).toBe(true);
  });

  it("wires server message callback", async () => {
    const onServerMessage = vi.fn();
    const { handlers } = mountTemplate({ onServerMessage });

    const handler = handlers.get(RTVIEvent.ServerMessage);
    expect(handler).toBeTypeOf("function");

    handler?.({ hello: "world" });
    await nextTick();

    expect(onServerMessage).toHaveBeenCalledWith({ hello: "world" });
  });

  it("sends text and appends local user message", async () => {
    const { wrapper, sendText } = mountTemplate();
    const input = wrapper.find('[data-testid="conversation-input"]');

    await input.setValue("Hello Vue console");
    await input.trigger("keydown.enter");
    await nextTick();

    expect(sendText).toHaveBeenCalledWith("Hello Vue console", undefined);
    expect(wrapper.text()).toContain("Hello Vue console");
  });

  it("hides text input when conversationElementProps.noTextInput is true", () => {
    const { wrapper } = mountTemplate({
      conversationElementProps: { noTextInput: true },
    });

    expect(wrapper.find('[data-testid="conversation-input"]').exists()).toBe(false);
  });

  it("hides info panel for no-status/no-devices/no-session edge mode", () => {
    const { wrapper } = mountTemplate({
      noStatusInfo: true,
      noSessionInfo: true,
      noUserAudio: true,
      noUserVideo: true,
      noScreenControl: true,
    });

    expect(wrapper.find('[data-testid="desktop-info-panel"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="mobile-trigger-info"]').exists()).toBe(false);
  });

  it("toggles info collapse and preserves collapsed state", async () => {
    const { wrapper } = mountTemplate();
    const toggle = wrapper.find(".vuk-console-panel-button");

    await toggle.trigger("click");
    await nextTick();

    const infoPanel = wrapper.find('[data-testid="desktop-info-panel"]');
    expect(infoPanel.attributes("data-collapsed")).toBe("true");
    expect(toggle.text()).toContain("Show Info");

    await wrapper.find('[data-testid="mobile-trigger-events"]').trigger("click");
    await nextTick();

    expect(wrapper.find('[data-testid="desktop-info-panel"]').attributes("data-collapsed")).toBe("true");
  });

  it("supports horizontal drag handle interaction", async () => {
    const { wrapper } = mountTemplate();
    const mediaPanel = wrapper.find('[data-testid="desktop-media-panel"]');
    const handle = wrapper.find('[data-testid="desktop-handle-media-conversation"]');

    dispatchPointer(handle.element, "pointerdown", { x: 100 });
    dispatchPointer(window, "pointermove", { x: 220 });
    dispatchPointer(window, "pointerup", { x: 220 });
    await nextTick();

    const after = wrapper.find('[data-testid="desktop-media-panel"]').attributes("style");
    expect(after).toContain("width:");
    expect(mediaPanel.exists()).toBe(true);
  });

  it("enforces panel minimum limits during drag", async () => {
    const { wrapper } = mountTemplate();
    const mediaPanel = wrapper.find('[data-testid="desktop-media-panel"]');
    const before = mediaPanel.attributes("style");
    const handle = wrapper.find('[data-testid="desktop-handle-media-conversation"]');

    dispatchPointer(handle.element, "pointerdown", { x: 220 });
    dispatchPointer(window, "pointermove", { x: -10000 });
    dispatchPointer(window, "pointerup", { x: -10000 });
    await nextTick();

    expect(wrapper.find('[data-testid="desktop-media-panel"]').attributes("style")).toBe(before);
  });

  it("supports deprecated title alias when titleText is not provided", () => {
    const { wrapper } = mountTemplate({
      title: "Legacy Title",
      titleText: undefined,
    });

    expect(wrapper.text()).toContain("Legacy Title");
  });

  it("aggregates bot output chunks and finalizes on stop speaking", async () => {
    const { wrapper, handlers } = mountTemplate();

    handlers.get(RTVIEvent.BotOutput)?.({
      text: "Hel",
      spoken: true,
      aggregated_by: "word",
    });
    handlers.get(RTVIEvent.BotOutput)?.({
      text: "lo",
      spoken: true,
      aggregated_by: "word",
    });
    await nextTick();

    expect(wrapper.text()).toContain("Hello");

    handlers.get(RTVIEvent.BotStoppedSpeaking)?.();
    await nextTick();
    expect(wrapper.text()).toContain("assistant");
  });

  it("applies smallwebrtc codecs to transport instance", async () => {
    const { transport } = mountTemplate({
      transportType: "smallwebrtc",
      audioCodec: "opus",
      videoCodec: "vp8",
    });
    await nextTick();
    await nextTick();

    expect(transport.setAudioCodec).toHaveBeenCalledWith("opus");
    expect(transport.setVideoCodec).toHaveBeenCalledWith("vp8");
  });

  it("does not send text when transport is disconnected", async () => {
    const { wrapper, sendText } = mountTemplate({}, { transportState: TransportStateEnum.DISCONNECTED });
    const input = wrapper.find('[data-testid="conversation-input"]');

    await input.setValue("Should not send");
    await input.trigger("keydown.enter");
    await nextTick();

    expect(sendText).not.toHaveBeenCalled();
  });
});
