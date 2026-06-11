import Link from "next/link";
import { Reveal, Marquee } from "@/components/demo/motion";
import { MediaFrame, Pill } from "@/components/demo/frames";

/**
 * Designdemo – claudetype.com:s layout, formspråk och scroll-motion
 * översatt till 1753 SKINCARE. Berör inte befintlig startsida.
 *
 * Bildvalen är gjorda av GPT Vision (scripts/demo-redesign/image-map.json).
 */

const serif = "font-[family-name:var(--font-fraunces)]";

function ShowcaseSection({
  kicker,
  title,
  sub,
  href,
  bg,
  light,
  heroImg,
  detailImg,
  detailShape,
  reverse = false,
}: {
  kicker: string;
  title: React.ReactNode;
  sub: string;
  href: string;
  bg: string;
  light: boolean;
  heroImg: string;
  detailImg: string;
  detailShape: "arch" | "circle" | "rounded";
  reverse?: boolean;
}) {
  return (
    <section className="relative">
      {/* Färgkort med stor typografi – à la typsnittskorten */}
      <Reveal>
        <Link
          href={href}
          className={`block ${bg} rounded-[32px] px-6 py-24 text-center transition-transform duration-700 hover:scale-[1.005] md:py-36`}
        >
          <Pill dark={light}>{kicker}</Pill>
          <h2
            className={`${serif} mx-auto mt-8 max-w-4xl text-5xl leading-[1.05] tracking-[-0.01em] md:text-7xl ${
              light ? "text-white" : "text-[#1d1d1f]"
            }`}
          >
            {title}
          </h2>
          <div className={`mx-auto mt-8 h-px w-12 ${light ? "bg-white/40" : "bg-[#1d1d1f]/30"}`} />
          <p
            className={`mt-7 text-[13px] font-semibold uppercase tracking-[0.22em] ${
              light ? "text-white/75" : "text-[#766a62]"
            }`}
          >
            {sub}
          </p>
        </Link>
      </Reveal>

      {/* Media-rad: stor ram + detaljram med parallax */}
      <div
        className={`mt-5 grid grid-cols-1 gap-5 md:grid-cols-3 ${reverse ? "md:[direction:rtl]" : ""}`}
      >
        <Reveal className="md:col-span-2 md:[direction:ltr]" delay={80}>
          <MediaFrame
            src={heroImg}
            alt={kicker}
            shape="wide"
            depth={60}
            sizes="(max-width: 768px) 100vw, 66vw"
            className="aspect-[4/3] md:aspect-[16/10]"
          />
        </Reveal>
        <Reveal className="md:[direction:ltr]" delay={200}>
          <MediaFrame
            src={detailImg}
            alt={`${kicker} – detalj`}
            shape={detailShape}
            depth={40}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="h-full min-h-[320px]"
          />
        </Reveal>
      </div>
    </section>
  );
}

export default function DemoPage() {
  return (
    <main className="relative">
      {/* ── HERO – tre valvbågsramar ── */}
      <section className="radius-demo relative z-[2] overflow-hidden rounded-b-[48px] bg-[#f5f5f7] pb-10 shadow-[0_30px_60px_rgba(0,0,0,0.06)]">
        <div className="flex min-h-screen flex-col gap-10 pt-28">
          <Reveal className="flex flex-col items-center gap-4 px-6 text-center">
            <Pill>Svensk hudvård · Sedan 2020</Pill>
            <h1 className="text-[15px] font-medium tracking-[0.04em] text-[#1d1d1f]">
              Hudvård i samklang med hudens eget ekosystem
            </h1>
          </Reveal>

          <div className="grid flex-1 grid-cols-1 gap-4 px-4 md:grid-cols-3">
            <Reveal delay={100} className="max-md:hidden">
              <MediaFrame
                src="/New_Products/DUOwoman.jpg"
                alt="Kvinna med DUO-kitets ansiktsoljor"
                shape="arch-bl"
                depth={70}
                priority
                className="h-[72vh] min-h-[480px]"
              />
            </Reveal>
            <Reveal delay={220}>
              <MediaFrame
                src="/Landing_page_skinanalys/3.webp"
                alt="Kvinna i morgonsol – naturlig hudvård"
                shape="arch"
                depth={70}
                priority
                sizes="(max-width: 768px) 100vw, 33vw"
                className="h-[72vh] min-h-[480px] max-md:h-[68vh]"
              />
            </Reveal>
            <Reveal delay={340} className="max-md:hidden">
              <MediaFrame
                src="/New_Products/TheONE.jpg"
                alt="The ONE ansiktsolja"
                shape="arch-br"
                depth={70}
                priority
                className="h-[72vh] min-h-[480px]"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Resten glider upp under heron – sektionsöverlappet */}
      <div className="relative z-[1] -mt-12 flex flex-col gap-24 pt-12 md:gap-36">
        {/* ── STATEMENT ── */}
        <section className="flex flex-col items-center gap-7 px-6 py-28 text-center md:py-44">
          <Reveal>
            <Pill>1753 Skincare</Pill>
          </Reveal>
          <Reveal delay={120}>
            <h2 className={`${serif} mx-auto max-w-3xl text-4xl leading-[1.15] tracking-[-0.01em] text-[#1d1d1f] md:text-6xl`}>
              Funktionella oljor med <em className="text-[#108474] not-italic [font-style:italic]">CBD och CBG</em> – framtagna för hudens mikrobiom
            </h2>
          </Reveal>
        </section>

        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-24 px-4 md:gap-36">
          {/* ── SHOWCASE: DUO-KIT ── */}
          <ShowcaseSection
            kicker="Ansiktsoljor · Bästsäljare"
            title={<>The ONE <em className="[font-style:italic]">+</em> I LOVE</>}
            sub="DUO-kit – Utforska"
            href="/sv/produkter/duo-kit"
            bg="bg-[#108474]"
            light
            heroImg="/New_Products/DUO+TA-DAWoman.jpg"
            detailImg="/New_Products/DUO.jpg"
            detailShape="arch"
          />

          {/* ── SHOWCASE: TA-DA SERUM ── */}
          <ShowcaseSection
            kicker="Serum"
            title={<>TA-DA <em className="[font-style:italic]">Serum</em></>}
            sub="CBD & CBG – Utforska"
            href="/sv/produkter/ta-da-serum"
            bg="bg-[#766a62]"
            light
            heroImg="/New_Products/TA-DAWoman.jpg"
            detailImg="/New_Products/TA-DA.jpg"
            detailShape="circle"
            reverse
          />

          {/* ── MARQUEE ── */}
          <Marquee
            items={["CBD", "CBG", "MCT-olja", "Jojoba", "Svensk design", "Mikrobiomvänlig", "Vegansk"]}
            className={`${serif} py-2 text-3xl text-[#766a62]/60 [font-style:italic] md:text-5xl`}
          />

          {/* ── SHOWCASE: FUNGTASTIC ── */}
          <ShowcaseSection
            kicker="Kosttillskott"
            title={<>Fungtastic <em className="[font-style:italic]">Mushroom</em></>}
            sub="Chaga · Lion's Mane · Cordyceps – Utforska"
            href="/sv/produkter/fungtastic-mushroom-extract"
            bg="bg-[#1d1d1f]"
            light
            heroImg="/New_Products/Fungtasticwoman.jpg"
            detailImg="/New_Products/Fungtastic.jpg"
            detailShape="rounded"
          />

          {/* ── CIRKELRAM ── */}
          <section className="flex flex-col items-center gap-8 py-10">
            <Reveal className="w-full max-w-[760px]">
              <MediaFrame
                src="/stock5.jpg"
                alt="Lugn morgon – hudvård som livsstil"
                shape="circle"
                depth={60}
                sizes="(max-width: 768px) 100vw, 760px"
                className="aspect-square w-full"
              />
            </Reveal>
            <Reveal delay={150}>
              <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#766a62]">
                Hudvård är en livsstil – inte en produkt
              </p>
            </Reveal>
          </section>

          {/* ── CTA: GRATIS HUDANALYS ── */}
          <section className="flex justify-center">
            <Reveal className="w-full max-w-[640px]">
              <div className="flex gap-8 overflow-hidden rounded-[32px] bg-[#108474] p-7 max-md:flex-col">
                <div className="flex flex-1 flex-col items-start justify-between gap-6">
                  <div className="flex flex-col gap-2">
                    <Pill dark>Gratis</Pill>
                    <p className="mt-3 text-[17px] font-semibold text-white">AI-hudanalys</p>
                    <p className="text-[15px] text-white/60">2 minuter · 15 hudmetriker · PDF</p>
                  </div>
                  <Link
                    href="/sv/gratis-hudanalys"
                    className="group flex h-12 items-center gap-3 rounded-full bg-white px-6 text-[14px] font-semibold text-[#1d1d1f] transition-transform duration-300 hover:scale-[1.04]"
                  >
                    Starta analysen
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </Link>
                </div>
                <div className="flex-1">
                  <MediaFrame
                    src="/Landing_page_skinanalys/5.webp"
                    alt="Hudanalys med AI"
                    shape="rounded"
                    depth={30}
                    sizes="(max-width: 768px) 100vw, 280px"
                    className="aspect-square h-full w-full"
                  />
                </div>
              </div>
            </Reveal>
          </section>
        </div>

        {/* ── ABOUT-STRIP + FOOTER ── */}
        <footer className="relative overflow-hidden bg-white pt-5">
          <div className="mx-auto max-w-[1400px] px-4">
            <Reveal>
              <MediaFrame
                src="/stock3.jpg"
                alt="1753 – ett svenskt hudvårdsmärke"
                shape="wide"
                depth={50}
                sizes="100vw"
                className="aspect-[21/9] w-full"
              />
            </Reveal>

            <div className="flex flex-wrap items-start justify-between gap-10 py-16">
              <p className="max-w-xs text-[14px] leading-relaxed text-[#515151]">
                Funktionell hudvård med CBD och CBG, utvecklad i Sverige för hudens eget ekosystem.
              </p>
              <nav className="flex gap-14 text-[13px]" aria-label="Demo-footernavigation">
                <ul className="flex flex-col gap-2.5">
                  <li className="font-semibold uppercase tracking-[0.18em] text-[#766a62] text-[11px]">Handla</li>
                  <li><Link className="text-[#1d1d1f] hover:text-[#108474]" href="/sv/produkter">Produkter</Link></li>
                  <li><Link className="text-[#1d1d1f] hover:text-[#108474]" href="/sv/produkter/duo-kit">DUO-kit</Link></li>
                  <li><Link className="text-[#1d1d1f] hover:text-[#108474]" href="/sv/lojalitetsprogram">Förmåner</Link></li>
                </ul>
                <ul className="flex flex-col gap-2.5">
                  <li className="font-semibold uppercase tracking-[0.18em] text-[#766a62] text-[11px]">Upptäck</li>
                  <li><Link className="text-[#1d1d1f] hover:text-[#108474]" href="/sv/gratis-hudanalys">Hudanalys</Link></li>
                  <li><Link className="text-[#1d1d1f] hover:text-[#108474]" href="/sv/guide">Guider</Link></li>
                  <li><Link className="text-[#1d1d1f] hover:text-[#108474]" href="/sv/om-oss">Om oss</Link></li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Jättelik ordbild – som claudetype:s footer */}
          <Reveal y={40}>
            <div className={`${serif} select-none whitespace-nowrap text-center leading-[0.8] tracking-[0.02em] text-[#1d1d1f]`} style={{ fontSize: "clamp(120px, 22vw, 420px)" }} aria-hidden>
              1753
            </div>
          </Reveal>
          <p className="pb-6 pt-4 text-center text-[11px] text-[#766a62]">
            © 2026 1753 SKINCARE · Designdemo – <Link href="/sv" className="underline hover:text-[#108474]">till riktiga startsidan</Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
