<template>
  <button class="vuk-audio" type="button" @click="onToggleMute">
    {{ isMuted ? mutedLabel : unmutedLabel }}
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { usePipecatApp } from "../composables/pipecatApp";

const props = withDefaults(
  defineProps<{
    mutedLabel?: string;
    unmutedLabel?: string;
  }>(),
  {
    mutedLabel: "Unmute",
    unmutedLabel: "Mute",
  },
);

const emit = defineEmits<{
  "update:muted": [muted: boolean];
}>();

const context = usePipecatApp();

const isMuted = computed(() => context.isMuted.value);

const onToggleMute = () => {
  context.toggleMute();
  emit("update:muted", context.isMuted.value);
};
</script>

<style scoped>
.vuk-audio {
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  color: #111827;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 0.875rem;
}
</style>
