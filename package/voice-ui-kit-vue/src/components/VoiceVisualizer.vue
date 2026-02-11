<template>
  <div class="vuk-visualizer" role="img" aria-label="Voice visualizer placeholder">
    <span v-for="bar in 8" :key="bar" class="vuk-bar" :style="{ animationDelay: `${bar * 80}ms` }" />
  </div>
</template>

<style scoped>
.vuk-visualizer {
  align-items: flex-end;
  background: linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 0.75rem;
  display: flex;
  gap: 0.25rem;
  height: 4rem;
  justify-content: center;
  padding: 0.5rem;
}

.vuk-bar {
  animation: vuk-pulse 1s ease-in-out infinite;
  background: #2563eb;
  border-radius: 999px;
  height: 0.75rem;
  width: 0.35rem;
}

@keyframes vuk-pulse {
  0%,
  100% {
    height: 0.75rem;
  }

  50% {
    height: 2.75rem;
  }
}
</style>
