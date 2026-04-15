"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

interface HeroVideoProps {
  label: string;
  posterAlt: string;
  locale?: string;
}

export function HeroVideo({ label, posterAlt, locale = "sv" }: HeroVideoProps) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoSrc = `/Landing_page_skinanalys/hudanalys-demo-${locale}.mp4`;
  const posterSrc = `/Landing_page_skinanalys/video-poster-${locale}.jpg`;

  function handlePlay() {
    setPlaying(true);
    requestAnimationFrame(() => {
      videoRef.current?.play();
    });
  }

  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl shadow-black/10 md:aspect-[16/9]">
      {!playing && (
        <>
          <Image
            src={posterSrc}
            alt={posterAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />

          <button
            onClick={handlePlay}
            aria-label={label}
            className="group absolute inset-0 flex flex-col items-center justify-center gap-3"
          >
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-white/20 bg-white/20 backdrop-blur-xl transition-all duration-300 group-hover:scale-105 group-hover:bg-white/30 group-hover:shadow-xl group-hover:shadow-black/20">
              <Play className="h-7 w-7 fill-white text-white ml-1" />
            </div>
            <span className="rounded-full bg-black/30 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
              {label}
            </span>
          </button>
        </>
      )}

      {playing && (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          controls
          playsInline
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}
