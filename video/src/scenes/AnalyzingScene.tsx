import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { COLORS, FONT } from "../styles";
import type { VideoTexts } from "../i18n";

export const AnalyzingScene: React.FC<{ texts: VideoTexts }> = ({ texts }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const progress = interpolate(frame, [0, durationInFrames - 15], [0, 100], { extrapolateRight: "clamp" });
  const textIdx = Math.min(
    Math.floor(interpolate(frame, [0, durationInFrames - 10], [0, texts.statusTexts.length], { extrapolateRight: "clamp" })),
    texts.statusTexts.length - 1
  );
  const enter = spring({ frame, fps, config: { damping: 20 } });

  const circleSize = 260;
  const strokeWidth = 8;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (progress / 100) * circumference;
  const pulse = 1 + Math.sin(frame * 0.1) * 0.015;

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: COLORS.bg, opacity: interpolate(enter, [0, 1], [0, 1]) }}>
      <div style={{ position: "relative", marginBottom: 48, transform: `scale(${pulse})` }}>
        <svg width={circleSize} height={circleSize}>
          <circle cx={circleSize / 2} cy={circleSize / 2} r={radius} fill="none" stroke={COLORS.gray} strokeWidth={strokeWidth} />
          <circle cx={circleSize / 2} cy={circleSize / 2} r={radius} fill="none" stroke={COLORS.green} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round" transform={`rotate(-90 ${circleSize / 2} ${circleSize / 2})`} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, fontWeight: FONT.weight.heavy, fontFamily: FONT.family, color: COLORS.dark }}>
          {Math.round(progress)}%
        </div>
      </div>
      <div style={{ fontSize: 20, fontFamily: FONT.family, fontWeight: FONT.weight.medium, color: COLORS.darkLight, height: 30 }}>
        {texts.statusTexts[textIdx]}
      </div>
      <div style={{ marginTop: 16, fontSize: 14, fontFamily: FONT.family, color: COLORS.brown }}>
        {texts.aiBuilding}
      </div>
    </div>
  );
};
