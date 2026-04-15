import React from "react";
import { Composition } from "remotion";
import { HudanalysDemo } from "./Video";
import { VIDEO } from "./styles";
import type { VideoLocale } from "./i18n";

const LOCALES: VideoLocale[] = ["sv", "en", "es", "de", "fr"];

export const RemotionRoot: React.FC = () => (
  <>
    {LOCALES.map((locale) => (
      <Composition
        key={locale}
        id={`HudanalysDemo-${locale}`}
        component={HudanalysDemo}
        defaultProps={{ locale }}
        durationInFrames={VIDEO.durationInFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
    ))}
  </>
);
