<template>
  <canvas ref="canvasRef" :class="className" class="vuk-voice-visualizer" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { RTVIEvent, type Participant } from "@pipecat-ai/client-js";

import { usePipecatApp } from "../composables/pipecatApp";
import type { VoiceVisualizerProps } from "../types/voiceVisualizer";

const props = withDefaults(defineProps<VoiceVisualizerProps>(), {
  backgroundColor: "transparent",
  barColor: "black",
  noPeaks: true,
  peakLineColor: "red",
  peakLineSpeed: 0.2,
  peakLineThickness: 2,
  peakOffset: 0,
  peakFadeSpeed: 0.02,
  barCount: 5,
  barGap: 12,
  barLineCap: "round",
  barMaxHeight: 120,
  barOrigin: "center",
  barWidth: 30,
});

const context = usePipecatApp();
const canvasRef = ref<HTMLCanvasElement | null>(null);

type BandState = {
  value: number;
  peak: number;
  peakOpacity: number;
};

const bands = ref<BandState[]>([]);
let animationFrameId: number | null = null;
let targetLevel = 0;
let localLevelHandler: ((level: number) => void) | null = null;
let remoteLevelHandler:
  | ((level: number, participant: Participant) => void)
  | null = null;

const resetBands = () => {
  bands.value = Array.from({ length: props.barCount }, () => ({
    value: 0,
    peak: 0,
    peakOpacity: 0,
  }));
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

const toNormalizedLevel = (rawLevel: number) => {
  // SDK transports can emit 0..1 or 0..255 depending on source.
  if (rawLevel <= 1) {
    return clamp(rawLevel, 0, 1);
  }

  return clamp(rawLevel / 255, 0, 1);
};

const resolveColor = (color: string, canvas: HTMLCanvasElement) => {
  if (!color) {
    return "black";
  }

  if (color === "currentColor") {
    return getComputedStyle(canvas).color || "black";
  }

  if (color.startsWith("--")) {
    return (
      getComputedStyle(document.documentElement).getPropertyValue(color).trim() ||
      "black"
    );
  }

  return color;
};

const computeBarCoordinates = (
  normalizedHeight: number,
  canvasHeight: number,
  circleRadius: number,
) => {
  if (props.barOrigin === "top") {
    const yTop = circleRadius;
    const yBottom = clamp(
      circleRadius + normalizedHeight,
      circleRadius,
      canvasHeight - circleRadius,
    );
    return { yTop, yBottom };
  }

  if (props.barOrigin === "bottom") {
    const yBottom = canvasHeight - circleRadius;
    const yTop = clamp(
      yBottom - normalizedHeight,
      circleRadius,
      canvasHeight - circleRadius,
    );
    return { yTop, yBottom };
  }

  const center = canvasHeight / 2;
  return {
    yTop: clamp(center - normalizedHeight / 2, circleRadius, canvasHeight - circleRadius),
    yBottom: clamp(
      center + normalizedHeight / 2,
      circleRadius,
      canvasHeight - circleRadius,
    ),
  };
};

const drawInactiveMarker = (
  ctx: CanvasRenderingContext2D,
  xCenter: number,
  y: number,
  radius: number,
  color: string,
) => {
  if (props.barLineCap === "square") {
    ctx.fillStyle = color;
    ctx.fillRect(xCenter - radius, y - radius, radius * 2, radius * 2);
    return;
  }

  ctx.beginPath();
  ctx.arc(xCenter, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
};

const render = () => {
  const canvas = canvasRef.value;
  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const scaleFactor = 2;
  const canvasWidth = props.barCount * props.barWidth + (props.barCount - 1) * props.barGap;
  const canvasHeight = props.barMaxHeight;

  canvas.width = canvasWidth * scaleFactor;
  canvas.height = canvasHeight * scaleFactor;
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(scaleFactor, scaleFactor);

  const resolvedBarColor = resolveColor(props.barColor, canvas);
  const resolvedPeakColor = resolveColor(props.peakLineColor, canvas);

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = props.backgroundColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const radius = props.barWidth / 2;
  const totalBarsWidth =
    bands.value.length * props.barWidth + (bands.value.length - 1) * props.barGap;
  const startX = (canvasWidth - totalBarsWidth) / 2;

  const breathing = 0.06;

  bands.value.forEach((band, index) => {
    const randomizedScale = 0.7 + Math.random() * 0.5;
    const nextTarget = targetLevel * randomizedScale;

    if (nextTarget < 0.03) {
      band.value = Math.max(0, band.value - 0.08);
    } else {
      band.value += (nextTarget - band.value) * 0.22;
    }

    band.value = clamp(band.value + (Math.random() - 0.5) * breathing, 0, 1);

    if (!props.noPeaks) {
      if (band.value > band.peak) {
        band.peak = band.value;
        band.peakOpacity = 1;
      } else {
        band.peak = Math.max(band.value, band.peak - props.peakLineSpeed * 0.02);
        if (band.value < 0.05) {
          band.peakOpacity = Math.max(0, band.peakOpacity - props.peakFadeSpeed);
        }
      }
    }

    const x = startX + index * (props.barWidth + props.barGap);
    const xCenter = x + props.barWidth / 2;
    const barHeight = band.value * props.barMaxHeight;
    const { yTop, yBottom } = computeBarCoordinates(barHeight, canvasHeight, radius);

    if (band.value > 0.01) {
      ctx.beginPath();
      ctx.moveTo(xCenter, yTop);
      ctx.lineTo(xCenter, yBottom);
      ctx.lineCap = props.barLineCap;
      ctx.lineWidth = props.barWidth;
      ctx.strokeStyle = resolvedBarColor;
      ctx.stroke();
    } else {
      const inactiveY =
        props.barOrigin === "top"
          ? radius
          : props.barOrigin === "bottom"
            ? canvasHeight - radius
            : canvasHeight / 2;

      drawInactiveMarker(ctx, xCenter, inactiveY, radius, resolvedBarColor);
    }

    if (!props.noPeaks && band.peak > 0.01 && band.peakOpacity > 0) {
      const peakHeight = band.peak * props.barMaxHeight;
      let peakY =
        props.barOrigin === "top"
          ? radius + peakHeight
          : props.barOrigin === "bottom"
            ? canvasHeight - radius - peakHeight
            : canvasHeight / 2 - peakHeight / 2;

      peakY += props.barOrigin === "top" ? props.peakOffset : -props.peakOffset;

      const previousAlpha = ctx.globalAlpha;
      const previousCap = ctx.lineCap;
      ctx.globalAlpha = band.peakOpacity;
      ctx.lineCap = "butt";
      ctx.beginPath();
      ctx.moveTo(x, peakY);
      ctx.lineTo(x + props.barWidth, peakY);
      ctx.lineWidth = props.peakLineThickness;
      ctx.strokeStyle = resolvedPeakColor;
      ctx.stroke();
      ctx.globalAlpha = previousAlpha;
      ctx.lineCap = previousCap;
    }
  });

  animationFrameId = window.requestAnimationFrame(render);
};

const detachAudioListeners = () => {
  const client = context.client.value;
  if (!client) {
    return;
  }

  if (localLevelHandler) {
    client.off(RTVIEvent.LocalAudioLevel, localLevelHandler);
  }

  if (remoteLevelHandler) {
    client.off(RTVIEvent.RemoteAudioLevel, remoteLevelHandler);
  }

  localLevelHandler = null;
  remoteLevelHandler = null;
};

const attachAudioListeners = () => {
  detachAudioListeners();

  const client = context.client.value;
  if (!client) {
    targetLevel = 0;
    return;
  }

  localLevelHandler = (level: number) => {
    if (props.participantType === "local") {
      targetLevel = toNormalizedLevel(level);
    }
  };

  remoteLevelHandler = (level: number, participant: Participant) => {
    if (props.participantType === "local") {
      return;
    }

    if (props.participantType === "bot") {
      if (!participant.local) {
        targetLevel = toNormalizedLevel(level);
      }
      return;
    }

    targetLevel = toNormalizedLevel(level);
  };

  client.on(RTVIEvent.LocalAudioLevel, localLevelHandler);
  client.on(RTVIEvent.RemoteAudioLevel, remoteLevelHandler);
};

watch(
  () => context.client.value,
  () => {
    attachAudioListeners();
  },
  { immediate: true },
);

watch(
  () => [
    props.barCount,
    props.barGap,
    props.barWidth,
    props.barMaxHeight,
    props.barOrigin,
    props.barLineCap,
    props.backgroundColor,
    props.barColor,
    props.noPeaks,
    props.peakLineColor,
    props.peakLineSpeed,
    props.peakLineThickness,
    props.peakOffset,
    props.peakFadeSpeed,
  ],
  () => {
    resetBands();
  },
  { deep: true },
);

onMounted(() => {
  resetBands();
  render();
});

onUnmounted(() => {
  detachAudioListeners();

  if (animationFrameId !== null) {
    window.cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped>
.vuk-voice-visualizer {
  display: block;
  height: 100%;
  width: 100%;
}
</style>
