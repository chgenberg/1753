import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT } from "../styles";
import { AnimatedText } from "../components/AnimatedText";
import type { VideoTexts } from "../i18n";

export const ScanScene: React.FC<{ texts: VideoTexts }> = ({ texts }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ovalProgress = spring({ frame: frame - 20, fps, config: { damping: 25 } });
  const scanLine = interpolate(frame % 90, [0, 90], [0, 1]);
  const pulseScale = 1 + Math.sin(frame * 0.08) * 0.02;

  const zones = [
    { name: texts.zoneForehead, x: 0, y: -120, delay: 50 },
    { name: texts.zoneLeftCheek, x: -90, y: 0, delay: 65 },
    { name: texts.zoneRightCheek, x: 90, y: 0, delay: 80 },
    { name: texts.zoneNose, x: 0, y: 0, delay: 95 },
    { name: texts.zoneChin, x: 0, y: 110, delay: 110 },
    { name: texts.zoneTZone, x: 0, y: -50, delay: 125 },
  ];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 100, background: `linear-gradient(135deg, ${COLORS.dark} 0%, #2a2a2e 100%)`, padding: "0 80px" }}>
      <div style={{ position: "relative" }}>
        <div style={{ width: 300, height: 400, borderRadius: "50%", border: `3px solid ${COLORS.green}`, opacity: interpolate(ovalProgress, [0, 1], [0, 0.8]), transform: `scale(${pulseScale})`, position: "relative" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: `${scanLine * 100}%`, height: 2, background: `linear-gradient(90deg, transparent, ${COLORS.green}, transparent)`, opacity: 0.6 }} />
          {zones.map((zone) => {
            const zoneEnter = spring({ frame: frame - zone.delay, fps, config: { damping: 12 } });
            return (
              <div key={zone.name} style={{ position: "absolute", left: `calc(50% + ${zone.x}px)`, top: `calc(50% + ${zone.y}px)`, transform: `translate(-50%, -50%) scale(${zoneEnter})`, opacity: interpolate(zoneEnter, [0, 1], [0, 1]) }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: COLORS.green, boxShadow: `0 0 20px ${COLORS.green}80` }} />
                <div style={{ position: "absolute", left: 20, top: -6, whiteSpace: "nowrap", fontSize: 13, fontFamily: FONT.family, fontWeight: FONT.weight.medium, color: COLORS.white, background: "rgba(0,0,0,0.5)", padding: "3px 10px", borderRadius: 6 }}>
                  {zone.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, maxWidth: 500 }}>
        <AnimatedText text={texts.step2} fontSize={18} fontWeight={FONT.weight.semibold} color={COLORS.green} delay={5} style={{ letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }} />
        <AnimatedText text={texts.faceScan} fontSize={52} color={COLORS.white} delay={10} />
        <AnimatedText text={texts.scanBody} fontSize={22} fontWeight={FONT.weight.normal} color="rgba(255,255,255,0.7)" delay={20} style={{ marginTop: 24, lineHeight: 1.6 }} />
        <AnimatedText text={texts.scanLocal} fontSize={18} fontWeight={FONT.weight.medium} color={COLORS.green} delay={35} style={{ marginTop: 20 }} />
      </div>
    </div>
  );
};
