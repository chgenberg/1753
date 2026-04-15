import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";
import { COLORS, FONT } from "../styles";
import { AnimatedText } from "../components/AnimatedText";
import type { VideoTexts } from "../i18n";

export const Opener: React.FC<{ texts: VideoTexts }> = ({ texts }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 15, mass: 0.5 } });
  const logoOpacity = interpolate(logoScale, [0, 1], [0, 1]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: COLORS.bg,
      }}
    >
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: 28,
          background: COLORS.white,
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          marginBottom: 40,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile("logo/1753.webp")}
          style={{ width: 100, height: 100, borderRadius: 20 }}
        />
      </div>

      <AnimatedText
        text="1753 SKINCARE"
        fontSize={28}
        fontWeight={FONT.weight.semibold}
        color={COLORS.brown}
        delay={10}
        style={{ letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}
      />

      <AnimatedText text={texts.freeAnalysis} fontSize={64} fontWeight={FONT.weight.heavy} color={COLORS.dark} delay={18} />

      <AnimatedText
        text={texts.openerSub}
        fontSize={24}
        fontWeight={FONT.weight.normal}
        color={COLORS.darkLight}
        delay={28}
        style={{ marginTop: 20, maxWidth: 700, textAlign: "center", lineHeight: 1.5 }}
      />
    </div>
  );
};
