export type VoiceVisualizerParticipantType = "local" | "bot" | "remote";

export type VoiceVisualizerBarOrigin = "top" | "bottom" | "center";

export type VoiceVisualizerBarLineCap = "round" | "square";

export type VoiceVisualizerProps = {
  backgroundColor?: string;
  barColor?: string;
  noPeaks?: boolean;
  peakLineColor?: string;
  peakLineSpeed?: number;
  peakLineThickness?: number;
  peakOffset?: number;
  peakFadeSpeed?: number;
  barCount?: number;
  barGap?: number;
  barLineCap?: VoiceVisualizerBarLineCap;
  barMaxHeight?: number;
  barOrigin?: VoiceVisualizerBarOrigin;
  barWidth?: number;
  participantType: VoiceVisualizerParticipantType;
  className?: string;
};
