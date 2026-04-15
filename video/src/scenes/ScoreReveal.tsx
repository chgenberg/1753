import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT } from "../styles";
import { ScoreRing } from "../components/ScoreRing";
import { AnimatedText } from "../components/AnimatedText";
import type { VideoTexts } from "../i18n";

const MetricBar: React.FC<{ label: string; value: number; delay: number }> = ({ label, value, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 20 } });
  const barWidth = interpolate(progress, [0, 1], [0, value]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div style={{ opacity, marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontFamily: FONT.family, fontWeight: FONT.weight.medium, color: COLORS.dark, marginBottom: 6 }}>
        <span>{label}</span>
        <span style={{ color: COLORS.green }}>{Math.round(barWidth)}%</span>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: COLORS.gray, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${barWidth}%`, borderRadius: 4, background: `linear-gradient(90deg, ${COLORS.green}, #14a890)` }} />
      </div>
    </div>
  );
};

export const ScoreReveal: React.FC<{ texts: VideoTexts }> = ({ texts }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ageEnter = spring({ frame: frame - 35, fps, config: { damping: 15 } });

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 120, background: COLORS.bg, padding: "0 100px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <AnimatedText text={texts.yourScore} fontSize={16} fontWeight={FONT.weight.semibold} color={COLORS.brown} delay={5} style={{ letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 24 }} />
        <ScoreRing score={74} size={280} delay={10} scoreLabel={texts.ofHundred} />

        <div style={{ marginTop: 32, opacity: interpolate(ageEnter, [0, 1], [0, 1]), transform: `scale(${interpolate(ageEnter, [0, 1], [0.8, 1])})`, background: COLORS.white, borderRadius: 20, padding: "16px 32px", textAlign: "center", boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 13, fontFamily: FONT.family, color: COLORS.brown }}>{texts.skinAge}</div>
          <div style={{ fontSize: 36, fontWeight: FONT.weight.heavy, fontFamily: FONT.family, color: COLORS.dark, marginTop: 4 }}>{texts.ageYears}</div>
        </div>
      </div>

      <div style={{ flex: 1, maxWidth: 500 }}>
        <AnimatedText text={texts.yourMetrics} fontSize={32} delay={20} style={{ marginBottom: 32 }} />
        <MetricBar label={texts.hydration} value={68} delay={30} />
        <MetricBar label={texts.elasticity} value={82} delay={35} />
        <MetricBar label={texts.poreStructure} value={55} delay={40} />
        <MetricBar label={texts.texture} value={71} delay={45} />
        <MetricBar label={texts.evenness} value={64} delay={50} />
        <MetricBar label={texts.sensitivity} value={40} delay={55} />
      </div>
    </div>
  );
};
