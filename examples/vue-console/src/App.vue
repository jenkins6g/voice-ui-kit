<template>
  <main class="app-shell">
    <h1>Vue Console (Migration Starter)</h1>

    <PipecatAppBase :connect-params="{ webrtcUrl: '/api/offer' }" init-devices-on-mount>
      <template #default="{ error, handleConnect, handleDisconnect }">
        <section class="panel">
          <VoiceVisualizer participant-type="bot" />
          <ControlBar>
            <UserAudioControl />
            <ConnectButton :on-connect="handleConnect" :on-disconnect="handleDisconnect" />
          </ControlBar>
          <ErrorCard v-if="error">{{ error }}</ErrorCard>
          <DummyComponent text="Initial Vue surface is wired." />
        </section>
      </template>
    </PipecatAppBase>
  </main>
</template>

<script setup lang="ts">
import {
  ConnectButton,
  ControlBar,
  DummyComponent,
  ErrorCard,
  PipecatAppBase,
  UserAudioControl,
  VoiceVisualizer,
} from "@pipecat-ai/voice-ui-kit-vue";
</script>

<style scoped>
.app-shell {
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(17, 24, 39, 0.12);
  max-width: 30rem;
  padding: 1.25rem;
  width: 100%;
}

h1 {
  font-size: 1.25rem;
  margin: 0 0 1rem;
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}
</style>
