import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT } from "../styles";
import { PhoneMockup } from "../components/PhoneMockup";
import { AnimatedText } from "../components/AnimatedText";
import type { VideoTexts } from "../i18n";

export const IntroScreen: React.FC<{ texts: VideoTexts }> = ({ texts }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeEnter = spring({ frame: frame - 30, fps, config: { damping: 15 } });
  const badgeOpacity = interpolate(badgeEnter, [0, 1], [0, 1]);
  const badgeX = interpolate(badgeEnter, [0, 1], [40, 0]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 100,
        background: COLORS.bg,
        padding: "0 80px",
      }}
    >
      <div style={{ flex: 1, maxWidth: 600 }}>
        <AnimatedText text={texts.step1} fontSize={18} fontWeight={FONT.weight.semibold} color={COLORS.green} delay={5} style={{ letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }} />
        <AnimatedText text={texts.startAnalysis} fontSize={52} delay={10} />
        <AnimatedText text={texts.introBody} fontSize={22} fontWeight={FONT.weight.normal} color={COLORS.darkLight} delay={20} style={{ marginTop: 24, lineHeight: 1.6 }} />

        <div style={{ marginTop: 40, opacity: badgeOpacity, transform: `translateX(${badgeX}px)`, display: "flex", gap: 16 }}>
          {[texts.badgeAI, texts.badgeFree, texts.badge2min].map((label) => (
            <div key={label} style={{ background: COLORS.white, borderRadius: 980, padding: "10px 24px", fontSize: 15, fontWeight: FONT.weight.semibold, fontFamily: FONT.family, color: COLORS.green, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
              {label}
            </div>
          ))}
        </div>
      </div>

      <PhoneMockup screenshot="screens/01-intro.png" delay={8} />
    </div>
  );
};
