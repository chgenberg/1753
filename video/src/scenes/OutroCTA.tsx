import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";
import { COLORS, FONT } from "../styles";
import { AnimatedText } from "../components/AnimatedText";
import type { VideoTexts } from "../i18n";

export const OutroCTA: React.FC<{ texts: VideoTexts }> = ({ texts }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const btnEnter = spring({ frame: frame - 30, fps, config: { damping: 12, mass: 0.5 } });
  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${COLORS.dark} 0%, #2a2a2e 100%)`, opacity: fadeOut }}>
      <div style={{ width: 80, height: 80, borderRadius: 20, overflow: "hidden", marginBottom: 32, opacity: interpolate(spring({ frame, fps, config: { damping: 18 } }), [0, 1], [0, 1]) }}>
        <Img src={staticFile("logo/1753.webp")} style={{ width: 80, height: 80 }} />
      </div>

      <AnimatedText text={texts.tryFreeToday} fontSize={60} fontWeight={FONT.weight.heavy} color={COLORS.white} delay={8} />
      <AnimatedText text={texts.ctaSub} fontSize={24} fontWeight={FONT.weight.normal} color="rgba(255,255,255,0.65)" delay={18} style={{ marginTop: 20 }} />

      <div style={{ marginTop: 48, opacity: interpolate(btnEnter, [0, 1], [0, 1]), transform: `translateY(${interpolate(btnEnter, [0, 1], [20, 0])}px)` }}>
        <div style={{ background: COLORS.green, color: COLORS.white, borderRadius: 980, padding: "18px 56px", fontSize: 20, fontWeight: FONT.weight.semibold, fontFamily: FONT.family, boxShadow: `0 12px 40px ${COLORS.green}60` }}>
          {texts.ctaUrl}
        </div>
      </div>

      <div style={{ marginTop: 40, fontSize: 14, fontFamily: FONT.family, fontWeight: FONT.weight.medium, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>
        {texts.slogan}
      </div>
    </div>
  );
};
