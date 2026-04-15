import React from "react";
import { Series, AbsoluteFill } from "remotion";
import { FONT } from "./styles";
import { getTexts, type VideoLocale } from "./i18n";

import { Opener } from "./scenes/Opener";
import { IntroScreen } from "./scenes/IntroScreen";
import { ScanScene } from "./scenes/ScanScene";
import { QuizMontage } from "./scenes/QuizMontage";
import { AnalyzingScene } from "./scenes/AnalyzingScene";
import { ScoreReveal } from "./scenes/ScoreReveal";
import { ProductsScene } from "./scenes/ProductsScene";
import { OutroCTA } from "./scenes/OutroCTA";

export const HudanalysDemo: React.FC<{ locale?: VideoLocale }> = ({ locale = "sv" }) => {
  const texts = getTexts(locale);

  return (
    <AbsoluteFill style={{ fontFamily: FONT.family }}>
      <Series>
        <Series.Sequence durationInFrames={120}><Opener texts={texts} /></Series.Sequence>
        <Series.Sequence durationInFrames={180}><IntroScreen texts={texts} /></Series.Sequence>
        <Series.Sequence durationInFrames={210}><ScanScene texts={texts} /></Series.Sequence>
        <Series.Sequence durationInFrames={210}><QuizMontage texts={texts} /></Series.Sequence>
        <Series.Sequence durationInFrames={150}><AnalyzingScene texts={texts} /></Series.Sequence>
        <Series.Sequence durationInFrames={180}><ScoreReveal texts={texts} /></Series.Sequence>
        <Series.Sequence durationInFrames={150}><ProductsScene texts={texts} /></Series.Sequence>
        <Series.Sequence durationInFrames={150}><OutroCTA texts={texts} /></Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
