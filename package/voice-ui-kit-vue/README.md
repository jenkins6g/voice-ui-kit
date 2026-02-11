# @pipecat-ai/voice-ui-kit-vue

Vue port of the core `@pipecat-ai/voice-ui-kit` primitives.

## Usage

```vue
<template>
  <PipecatAppBase :connect-params="{ webrtcUrl: '/api/offer' }" transport-type="smallwebrtc">
    <template #default="{ error, handleConnect, handleDisconnect }">
      <ConsoleTemplate :error="error" />
      <ConnectButton :on-connect="handleConnect" :on-disconnect="handleDisconnect" />
    </template>
  </PipecatAppBase>
</template>
```

## Parity Status

| Area | Status | Notes |
| --- | --- | --- |
| `PipecatAppBase` | Partial | Client lifecycle parity done; theme/audio output support implemented; conversation/theme internals still differ from React wrappers. |
| `ConnectButton` | Near parity | State labels/disabled/loading/callback flow aligned. |
| `UserAudioControl` | Partial | Core behavior aligned; visual/stories edge cases still in progress. |
| `VoiceVisualizer` | Partial | Event-driven canvas parity scaffold done; exact spectrum algorithm differs from React implementation. |
| `ControlBar` + `ErrorCard` | Near parity | API shape aligned; styling is approximate. |
| `DeviceSelect` | Partial | `DeviceSelectComponent` + connected wrapper exported; advanced select UI differences remain. |
| `UserVideoControl` | Partial | Headless + connected variants exported; advanced preview/dropdown behavior still simplified. |
| `UserScreenControl` | Partial | Connected screen-share toggle + local preview are implemented; advanced state/UI parity still differs. |
| `ClientStatus` | Partial | Client/agent status and event wiring present; exact UI micro-states differ. |
| `ConsoleTemplate` | Partial parity | Functional desktop/mobile layout, conversation/events/metrics panels, and parity toggles are implemented; advanced renderer/store internals still differ from React. |

## Known Gaps

- Strict internal parity for React conversation store/renderers (`injectMessage` behavior, rich part renderers).
- Theme behavior parity beyond base `data-theme` wrapper.
- Pixel-perfect visual parity across all primitives.
- Advanced media panel behavior (including full bot video surface) and story-level edge-case parity.

## Validation Commands

- `pnpm --filter @pipecat-ai/voice-ui-kit-vue test`
- `pnpm --filter @pipecat-ai/voice-ui-kit-vue build`
- `pnpm -r build`
