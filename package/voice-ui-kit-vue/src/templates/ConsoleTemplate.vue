<template>
  <section :class="['vuk-console-template', className]">
    <ErrorCard v-if="error">{{ error }}</ErrorCard>

    <template v-else>
      <VoiceVisualizer participant-type="bot" :class="classNames?.visualizer" />
      <ControlBar :class-name="classNames?.controlBar">
        <UserAudioControl :class-names="{ button: classNames?.audioButton }" />
        <ControlBarDivider />
        <ConnectButton />
      </ControlBar>
    </template>
  </section>
</template>

<script setup lang="ts">
import ConnectButton from "../components/ConnectButton.vue";
import ControlBar from "../components/ControlBar.vue";
import ControlBarDivider from "../components/ControlBarDivider.vue";
import ErrorCard from "../components/ErrorCard.vue";
import UserAudioControl from "../components/UserAudioControl.vue";
import VoiceVisualizer from "../components/VoiceVisualizer.vue";

defineProps<{
  error?: string | null;
  className?: string;
  classNames?: {
    visualizer?: string;
    controlBar?: string;
    audioButton?: string;
  };
}>();
</script>

<style scoped>
.vuk-console-template {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
</style>
