import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT } from "../styles";

interface ScoreRingProps {
  score: number;
  size?: number;
  delay?: number;
  scoreLabel?: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 220,
  delay = 0,
  scoreLabel = "av 100",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ frame: frame - delay, fps, config: { damping: 30, mass: 1.2 } });
  const currentScore = Math.round(interpolate(progress, [0, 1], [0, score]));

  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress * score / 100) * circumference;

  const opacity = interpolate(progress, [0, 0.1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        opacity,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={COLORS.gray}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={COLORS.green}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: size * 0.35,
            fontWeight: FONT.weight.heavy,
            fontFamily: FONT.family,
            color: COLORS.dark,
            lineHeight: 1,
          }}
        >
          {currentScore}
        </span>
        <span
          style={{
            fontSize: size * 0.1,
            fontWeight: FONT.weight.medium,
            fontFamily: FONT.family,
            color: COLORS.brown,
            marginTop: 4,
          }}
          >
            {scoreLabel}
          </span>
      </div>
    </div>
  );
};
