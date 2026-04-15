import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";
import { COLORS, FONT } from "../styles";
import { AnimatedText } from "../components/AnimatedText";
import type { VideoTexts } from "../i18n";

const ProductCard: React.FC<{ name: string; subtitle: string; price: string; img: string; delay: number }> = ({ name, subtitle, price, img, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 14, mass: 0.6 } });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const translateY = interpolate(enter, [0, 1], [50, 0]);
  const hover = 1 + Math.sin((frame - delay) * 0.04) * 0.008;

  return (
    <div style={{ opacity, transform: `translateY(${translateY}px) scale(${enter > 0.5 ? hover : 1})`, background: COLORS.white, borderRadius: 28, padding: "36px 32px 32px", width: 340, boxShadow: "0 16px 50px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ width: 220, height: 260, borderRadius: 22, background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: 12 }}>
        <Img src={staticFile(img)} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
      </div>
      <div style={{ fontSize: 19, fontWeight: FONT.weight.bold, fontFamily: FONT.family, color: COLORS.dark, textAlign: "center", lineHeight: 1.2 }}>{name}</div>
      <div style={{ fontSize: 13, fontWeight: FONT.weight.medium, fontFamily: FONT.family, color: COLORS.brown, letterSpacing: "0.03em" }}>{subtitle}</div>
      <div style={{ fontSize: 22, fontWeight: FONT.weight.heavy, fontFamily: FONT.family, color: COLORS.green }}>{price}</div>
    </div>
  );
};

export const ProductsScene: React.FC<{ texts: VideoTexts }> = ({ texts }) => {
  const products = [
    { name: "DUO-kit", subtitle: "The ONE + I LOVE Facial Oil", price: "1 099 kr", img: "products/DUO-kit.webp" },
    { name: "TA-DA Serum", subtitle: "3% CBG Booster", price: "699 kr", img: "products/TA-DA.webp" },
    { name: "Au Naturel Makeup Remover", subtitle: texts.productCleansing, price: "399 kr", img: "products/Aunaturel.webp" },
  ];

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: COLORS.bg, gap: 48 }}>
      <div style={{ textAlign: "center" }}>
        <AnimatedText text={texts.recommendedProducts} fontSize={14} fontWeight={FONT.weight.semibold} color={COLORS.brown} delay={5} style={{ letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }} />
        <AnimatedText text={texts.basedOnAnalysis} fontSize={48} delay={10} />
      </div>
      <div style={{ display: "flex", gap: 36 }}>
        {products.map((p, i) => (
          <ProductCard key={p.name} name={p.name} subtitle={p.subtitle} price={p.price} img={p.img} delay={20 + i * 12} />
        ))}
      </div>
    </div>
  );
};
