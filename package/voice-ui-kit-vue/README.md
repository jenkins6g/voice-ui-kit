# @pipecat-ai/voice-ui-kit-vue

Vue port of the core `@pipecat-ai/voice-ui-kit` primitives.

## Parity Checklist

### PipecatAppBase
- [x] Initializes `PipecatClient` with selected transport
- [x] Supports `connectParams` and `startBotParams`
- [x] Supports `startBotResponseTransformer`
- [x] Supports `connectOnMount` and `initDevicesOnMount`
- [x] Exposes slot props: `client`, `handleConnect`, `handleDisconnect`, `error`, `rawStartBotResponse`, `transformedStartBotResponse`
- [ ] Theme wrapping parity (`noThemeProvider`, `themeProps`) behavior parity
- [ ] Bot audio output parity (`noAudioOutput`) behavior parity

### ConnectButton
- [x] Transport-state aware labels
- [x] State-based disabled/loading behavior
- [x] Supports `onClick`, `onConnect`, `onDisconnect`
- [x] Supports `stateContent` overrides

### UserAudioControl
- [x] Mic toggle via client state
- [x] Loading behavior from transport state
- [x] Device picker for mics/speakers
- [x] Visualizer integration and prop passthrough

### VoiceVisualizer
- [x] Canvas renderer with configurable bars/colors/peaks
- [x] Supports `participantType` (`local`, `bot`, `remote`)
- [x] Listens to Pipecat audio level events

### ControlBar
- [x] Supports size/shadow/gradient-border/no-animate props
- [x] `ControlBarDivider` primitive exported

### ErrorCard
- [x] Supports `title`, `noHeader`, `classNames`, `icon`
- [x] Supports size/shadow/className props

### Second-wave primitives
- [x] `DeviceSelect` (initial Vue parity)
- [x] `UserVideoControl` (initial Vue parity)
- [x] `ClientStatus` (initial Vue parity)
- [ ] Pixel-perfect styling parity for second-wave primitives
- [ ] Full feature parity for second-wave primitives
