import Image from "next/image";
import { Parallax } from "./motion";

/**
 * Designprimitiver för det nya formspråket (claudetype-inspirerat,
 * översatt till 1753:s färger och typografi).
 *
 * Signaturformen är valvbågen: helrundad topp + varierande bottenhörn,
 * med parallax-media bakom overflow-hidden.
 */

export type FrameShape = "arch" | "arch-bl" | "arch-br" | "rounded" | "circle" | "wide";

const SHAPE_RADIUS: Record<FrameShape, string> = {
  arch: "rounded-t-[999px] rounded-b-[28px]",
  "arch-bl": "rounded-t-[999px] rounded-br-[28px] rounded-bl-[160px]",
  "arch-br": "rounded-t-[999px] rounded-bl-[28px] rounded-br-[160px]",
  rounded: "rounded-[28px]",
  circle: "rounded-full",
  wide: "rounded-[32px]",
};

export function MediaFrame({
  src,
  alt,
  shape = "rounded",
  depth = 50,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 33vw",
  className = "",
}: {
  src: string;
  alt: string;
  shape?: FrameShape;
  depth?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <div className={`relative bg-[#766a62]/10 ${SHAPE_RADIUS[shape]} ${className}`} style={{ overflow: "hidden" }}>
      <Parallax depth={depth} className="h-full w-full">
        <div className="relative h-full w-full">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover"
          />
        </div>
      </Parallax>
    </div>
  );
}

/** Liten kicker-pill ovanför rubriker. */
export function Pill({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-block rounded-full border px-4 pt-[5px] pb-[3px] text-[11px] font-semibold uppercase tracking-[0.22em] ${
        dark
          ? "border-white/25 text-white/85"
          : "border-[#1d1d1f]/15 text-[#766a62]"
      }`}
    >
      {children}
    </span>
  );
}
