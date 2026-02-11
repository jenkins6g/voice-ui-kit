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
| `ClientStatus` | Partial | Client/agent status and event wiring present; exact UI micro-states differ. |
| `ConsoleTemplate` | Initial parity | Core composition scaffold is present; full React console feature parity is pending. |

## Known Gaps

- Full React template parity for mobile tabs, resizable layouts, events panel, and metrics panel.
- Theme behavior parity beyond base `data-theme` wrapper.
- Pixel-perfect visual parity across all primitives.
- Advanced media panel behavior and full story-level edge-case parity.

## Validation Commands

- `pnpm --filter @pipecat-ai/voice-ui-kit-vue test`
- `pnpm --filter @pipecat-ai/voice-ui-kit-vue build`
- `pnpm -r build`
