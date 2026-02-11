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
- [x] `DeviceSelect` and `DeviceSelectComponent` props parity surface
- [x] `UserVideoControl` and `UserVideoComponent` props parity surface
- [x] `ClientStatus` and `ClientStatusComponent` props parity surface
- [ ] Pixel-perfect styling parity for second-wave primitives
- [ ] Full UI behavior parity edge-cases from all React stories

## Templates

### ConsoleTemplate
- [x] Initial Vue console template composition (`VoiceVisualizer`, `UserAudioControl`, `ConnectButton`, `ControlBar`, `ErrorCard`)
- [ ] Full React console template feature parity
