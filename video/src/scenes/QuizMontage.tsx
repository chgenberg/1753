import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import { COLORS, FONT } from "../styles";
import type { VideoTexts } from "../i18n";

const QuizCard: React.FC<{
  stepLabel: string;
  title: string;
  subtitle: string;
  options: string[];
  selectedIdx: number;
}> = ({ stepLabel, title, subtitle, options, selectedIdx }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 15, mass: 0.6 } });
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: COLORS.bg, opacity, padding: "0 200px" }}>
      <div style={{ fontSize: 14, fontWeight: FONT.weight.semibold, fontFamily: FONT.family, color: COLORS.brown, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>
        {stepLabel}
      </div>
      <div style={{ fontSize: 44, fontWeight: FONT.weight.bold, fontFamily: FONT.family, color: COLORS.dark, textAlign: "center", marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ fontSize: 18, fontFamily: FONT.family, color: COLORS.darkLight, marginBottom: 48 }}>
        {subtitle}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", maxWidth: 800 }}>
        {options.map((opt, i) => {
          const isSelected = i === selectedIdx;
          const chipEnter = spring({ frame: frame - 8 - i * 3, fps, config: { damping: 12 } });
          const selectPop = isSelected ? spring({ frame: frame - 25, fps, config: { damping: 10, mass: 0.4 } }) : 0;
          return (
            <div key={opt} style={{ padding: "14px 28px", borderRadius: 980, fontSize: 16, fontWeight: FONT.weight.semibold, fontFamily: FONT.family, border: `2px solid ${isSelected ? COLORS.green : COLORS.gray}`, background: isSelected ? COLORS.greenLight : COLORS.white, color: isSelected ? COLORS.green : COLORS.dark, opacity: interpolate(chipEnter, [0, 1], [0, 1]), transform: `scale(${interpolate(chipEnter, [0, 1], [0.8, 1]) + selectPop * 0.05})` }}>
              {opt}{isSelected && <span style={{ marginLeft: 8 }}>✓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const QuizMontage: React.FC<{ texts: VideoTexts }> = ({ texts }) => (
  <>
    <Sequence from={0} durationInFrames={70}>
      <QuizCard stepLabel={texts.step3of4} title={texts.quizSkinType} subtitle={texts.quizSkinTypeSub} options={[texts.skinDry, texts.skinNormal, texts.skinCombi, texts.skinOily, texts.skinSensitive]} selectedIdx={2} />
    </Sequence>
    <Sequence from={70} durationInFrames={70}>
      <QuizCard stepLabel={texts.step3of4} title={texts.quizImprove} subtitle={texts.quizImproveSub} options={[texts.acne, texts.dryness, texts.redness, texts.aging, texts.largePores, texts.dullSkin]} selectedIdx={1} />
    </Sequence>
    <Sequence from={140} durationInFrames={70}>
      <QuizCard stepLabel={texts.step3of4} title={texts.quizGoals} subtitle={texts.quizGoalsSub} options={[texts.moreGlow, texts.calmRedness, texts.clearerSkin, texts.preventAging, texts.deepHydration, texts.simplerRoutine]} selectedIdx={4} />
    </Sequence>
  </>
);
