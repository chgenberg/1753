"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Activity,
  Brain,
  FlaskConical,
  Heart,
  Layers,
  ScanFace,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/providers/locale-provider";

/* ------------------------------------------------------------------ */
/*  i18n helper                                                        */
/* ------------------------------------------------------------------ */

function tx(locale: string, sv: string, en: string, es?: string, de?: string, fr?: string): string {
  if (locale === "sv") return sv;
  if (locale === "es") return es || en;
  if (locale === "de") return de || en;
  if (locale === "fr") return fr || en;
  return en;
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type MethodTabId =
  | "overview"
  | "score"
  | "skinAge"
  | "metrics"
  | "lifestyle"
  | "ecs"
  | "sources";

interface MethodTab {
  id: MethodTabId;
  label: string;
  icon: LucideIcon;
}

function getTabs(locale: string): MethodTab[] {
  return [
    { id: "overview", label: tx(locale, "Översikt", "Overview", "Resumen", "Übersicht", "Aperçu"), icon: Layers },
    { id: "score", label: tx(locale, "Hudpoäng", "Skin score", "Puntuación", "Hautwert", "Score"), icon: Target },
    { id: "skinAge", label: tx(locale, "Hudålder", "Skin age", "Edad cutánea", "Hautalter", "Âge cutané"), icon: ScanFace },
    { id: "metrics", label: tx(locale, "Metriker", "Metrics", "Métricas", "Metriken", "Métriques"), icon: Activity },
    { id: "lifestyle", label: tx(locale, "Livsstil", "Lifestyle", "Estilo de vida", "Lebensstil", "Mode de vie"), icon: Heart },
    { id: "ecs", label: tx(locale, "ECS & Mikrobiom", "ECS & Microbiome", "ECS y Microbioma", "ECS & Mikrobiom", "SEC & Microbiome"), icon: FlaskConical },
    { id: "sources", label: tx(locale, "Källor", "Sources", "Fuentes", "Quellen", "Sources"), icon: Brain },
  ];
}

/* ------------------------------------------------------------------ */
/*  Shared UI primitives                                               */
/* ------------------------------------------------------------------ */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-1.5 mt-5 text-[13px] font-bold tracking-wide text-[#1d1d1f] first:mt-0">
      {children}
    </h4>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-[13px] leading-relaxed text-[#515151]">{children}</p>;
}

function Badge({ children, variant = "green" }: { children: React.ReactNode; variant?: "green" | "gold" | "muted" }) {
  const colors = {
    green: "bg-[#108474]/10 text-[#108474]",
    gold: "bg-[#fcb237]/15 text-[#a87b1a]",
    muted: "bg-[#f5f5f7] text-[#766a62]",
  };
  return (
    <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold", colors[variant])}>
      {children}
    </span>
  );
}

function WeightBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="mb-2.5">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[12px] font-medium text-[#1d1d1f]">{label}</span>
        <span className="text-[11px] font-semibold text-[#766a62]">{pct}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#f5f5f7]">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab content – Overview                                             */
/* ------------------------------------------------------------------ */

function OverviewTab({ locale }: { locale: string }) {
  return (
    <div>
      <SectionHeading>
        {tx(locale, "Tvåstegsanalys med AI", "Two-step AI analysis", "Análisis de IA en dos pasos", "Zweistufige KI-Analyse", "Analyse IA en deux étapes")}
      </SectionHeading>
      <P>
        {tx(locale,
          "Din hudanalys bygger på ett tvåstegs-AI-system som kombinerar lokal bildanalys med avancerad generativ AI. Resultatet är inte en generisk mall -- varje del beräknas individuellt baserat på just dina svar, din bild och din livsstil.",
          "Your skin analysis is powered by a two-step AI system combining local image analysis with advanced generative AI. The result is not a generic template -- every part is calculated individually based on your answers, your image and your lifestyle.",
          "Tu análisis de piel se basa en un sistema de IA de dos pasos que combina análisis local de imágenes con IA generativa avanzada. El resultado no es una plantilla genérica -- cada parte se calcula individualmente.",
          "Deine Hautanalyse basiert auf einem zweistufigen KI-System, das lokale Bildanalyse mit fortschrittlicher generativer KI kombiniert. Das Ergebnis ist keine generische Vorlage -- jeder Teil wird individuell berechnet.",
          "Votre analyse cutanée repose sur un système d'IA en deux étapes combinant analyse d'image locale et IA générative avancée. Le résultat n'est pas un modèle générique -- chaque partie est calculée individuellement."
        )}
      </P>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#e6e6e6]/60 bg-white p-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#108474]/10">
              <ScanFace className="h-4 w-4 text-[#108474]" />
            </div>
            <span className="text-[12px] font-bold text-[#1d1d1f]">
              {tx(locale, "Steg 1: Lokal AI-skanning", "Step 1: Local AI scan", "Paso 1: Escaneo local con IA", "Schritt 1: Lokaler KI-Scan", "Étape 1 : Scan IA local")}
            </span>
          </div>
          <p className="text-[12px] leading-relaxed text-[#515151]">
            {tx(locale,
              "En MobileNetV3-modell (tränad på 88 000+ dermatologiska bilder) körs direkt i din webbläsare via ONNX Runtime. Den klassificerar 9 hudtillstånd, graderar allvarlighetsgrad och beräknar 15 separata hudmetriker -- utan att din bild lämnar din enhet.",
              "A MobileNetV3 model (trained on 88,000+ dermatological images) runs directly in your browser via ONNX Runtime. It classifies 9 skin conditions, grades severity, and computes 15 separate skin metrics -- without your image ever leaving your device.",
              "Un modelo MobileNetV3 (entrenado con más de 88.000 imágenes dermatológicas) se ejecuta directamente en tu navegador mediante ONNX Runtime. Clasifica 9 condiciones cutáneas y calcula 15 métricas -- sin que tu imagen salga de tu dispositivo.",
              "Ein MobileNetV3-Modell (trainiert mit über 88.000 dermatologischen Bildern) läuft direkt in deinem Browser über ONNX Runtime. Es klassifiziert 9 Hautzustände und berechnet 15 separate Hautmetriken -- ohne dass dein Bild dein Gerät verlässt.",
              "Un modèle MobileNetV3 (entraîné sur plus de 88 000 images dermatologiques) s'exécute directement dans votre navigateur via ONNX Runtime. Il classifie 9 conditions cutanées et calcule 15 métriques -- sans que votre image ne quitte votre appareil."
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-[#e6e6e6]/60 bg-white p-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#108474]/10">
              <Brain className="h-4 w-4 text-[#108474]" />
            </div>
            <span className="text-[12px] font-bold text-[#1d1d1f]">
              {tx(locale, "Steg 2: GPT Vision-analys", "Step 2: GPT Vision analysis", "Paso 2: Análisis GPT Vision", "Schritt 2: GPT-Vision-Analyse", "Étape 2 : Analyse GPT Vision")}
            </span>
          </div>
          <p className="text-[12px] leading-relaxed text-[#515151]">
            {tx(locale,
              "OpenAI:s GPT-vision-modell gör en oberoende visuell bedömning av din bild och kombinerar den med dina quiz-svar, ONNX-resultaten och livsstilsfaktorer. Den genererar en unik, personlig analys med översikt, rekommendationer och rutin.",
              "OpenAI's GPT vision model performs an independent visual assessment of your image, combining it with your quiz answers, ONNX results, and lifestyle factors. It generates a unique, personalized analysis with overview, recommendations, and routine.",
              "El modelo GPT Vision de OpenAI realiza una evaluación visual independiente de tu imagen, combinándola con tus respuestas del cuestionario, los resultados ONNX y factores de estilo de vida.",
              "OpenAIs GPT-Vision-Modell führt eine unabhängige visuelle Bewertung deines Bildes durch und kombiniert sie mit deinen Quiz-Antworten, ONNX-Ergebnissen und Lebensstilfaktoren.",
              "Le modèle GPT Vision d'OpenAI effectue une évaluation visuelle indépendante de votre image, la combinant avec vos réponses au questionnaire, les résultats ONNX et les facteurs de mode de vie."
            )}
          </p>
        </div>
      </div>

      <SectionHeading>
        {tx(locale, "Vad ingår i resultatet?", "What's included in the results?", "¿Qué incluyen los resultados?", "Was beinhalten die Ergebnisse?", "Que contiennent les résultats ?")}
      </SectionHeading>
      <div className="space-y-2">
        {[
          { icon: Target, label: tx(locale, "Hudpoäng (0-100)", "Skin score (0-100)", "Puntuación (0-100)", "Hautwert (0-100)", "Score cutané (0-100)"), desc: tx(locale, "Viktat genomsnitt av visuell bedömning, livsstil, hudtyp och rutin", "Weighted average of visual assessment, lifestyle, skin type and routine", "Promedio ponderado de evaluación visual, estilo de vida, tipo de piel y rutina", "Gewichteter Durchschnitt aus visueller Bewertung, Lebensstil, Hauttyp und Routine", "Moyenne pondérée de l'évaluation visuelle, du mode de vie, du type de peau et de la routine") },
          { icon: ScanFace, label: tx(locale, "Biologisk hudålder", "Biological skin age", "Edad biológica de la piel", "Biologisches Hautalter", "Âge biologique cutané"), desc: tx(locale, "Uppskattas utifrån bild, metriker och livsstilsfaktorer", "Estimated from image, metrics and lifestyle factors", "Estimada a partir de la imagen, métricas y factores de estilo de vida", "Geschätzt aus Bild, Metriken und Lebensstilfaktoren", "Estimé à partir de l'image, des métriques et des facteurs de mode de vie") },
          { icon: Activity, label: tx(locale, "15 hudmetriker", "15 skin metrics", "15 métricas de la piel", "15 Hautmetriken", "15 métriques cutanées"), desc: tx(locale, "Rynkor, porer, pigmentering, rodnad, textur, fukt, fasthet m.fl.", "Wrinkles, pores, pigmentation, redness, texture, hydration, firmness, etc.", "Arrugas, poros, pigmentación, enrojecimiento, textura, hidratación, firmeza, etc.", "Falten, Poren, Pigmentierung, Rötung, Textur, Feuchtigkeit, Festigkeit usw.", "Rides, pores, pigmentation, rougeur, texture, hydratation, fermeté, etc.") },
          { icon: Sparkles, label: tx(locale, "Personlig analys", "Personal analysis", "Análisis personal", "Persönliche Analyse", "Analyse personnelle"), desc: tx(locale, "Styrkor, fokusområden, mikrobiom- och ECS-koppling", "Strengths, focus areas, microbiome & ECS connection", "Fortalezas, áreas de enfoque, conexión microbioma y SEC", "Stärken, Schwerpunkte, Mikrobiom- und ECS-Verbindung", "Points forts, domaines d'attention, lien microbiome et SEC") },
          { icon: Heart, label: tx(locale, "Livsstilsråd", "Lifestyle advice", "Consejos de estilo de vida", "Lebensstil-Tipps", "Conseils mode de vie"), desc: tx(locale, "Evidensbaserade tips om sömn, kost, stress, rörelse och vatten", "Evidence-based tips on sleep, diet, stress, exercise and hydration", "Consejos basados en evidencia sobre sueño, dieta, estrés, ejercicio e hidratación", "Evidenzbasierte Tipps zu Schlaf, Ernährung, Stress, Bewegung und Flüssigkeitsaufnahme", "Conseils fondés sur des preuves : sommeil, alimentation, stress, exercice et hydratation") },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="flex items-start gap-3 rounded-xl bg-[#f5f5f7]/60 px-3.5 py-2.5">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#108474]" />
            <div>
              <span className="text-[12px] font-semibold text-[#1d1d1f]">{label}</span>
              <span className="ml-1 text-[12px] text-[#766a62]">-- {desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab content – Score                                                */
/* ------------------------------------------------------------------ */

function ScoreTab({ locale }: { locale: string }) {
  return (
    <div>
      <SectionHeading>{tx(locale, "Så beräknas din hudpoäng", "How your skin score is calculated", "Cómo se calcula tu puntuación", "So wird dein Hautwert berechnet", "Comment votre score est calculé")}</SectionHeading>
      <P>
        {tx(locale,
          "Hudpoängen (0-100) är ett sammanvägt mått som reflekterar din huds nuvarande tillstånd och de faktorer som påverkar den. Poängen beräknas individuellt -- inga två analyser ger samma resultat för olika personer.",
          "The skin score (0-100) is a weighted measure reflecting your skin's current condition and the factors affecting it. The score is calculated individually -- no two analyses produce the same result for different people.",
          "La puntuación cutánea (0-100) es una medida ponderada que refleja el estado actual de tu piel y los factores que la afectan. Se calcula individualmente para cada persona.",
          "Der Hautwert (0-100) ist ein gewichtetes Maß, das den aktuellen Zustand deiner Haut und die Einflussfaktoren widerspiegelt. Er wird individuell berechnet.",
          "Le score cutané (0-100) est une mesure pondérée reflétant l'état actuel de votre peau et les facteurs qui l'influencent. Il est calculé individuellement."
        )}
      </P>

      <SectionHeading>{tx(locale, "Viktningsmodell", "Weighting model", "Modelo de ponderación", "Gewichtungsmodell", "Modèle de pondération")}</SectionHeading>
      <P>
        {tx(locale,
          "Fyra kategorier viktas samman. Den visuella bedömningen är den tyngsta faktorn när en bild finns tillgänglig, men livsstil väger nästan lika tungt -- ett medvetet val som speglar vår övertygelse att hudhälsa börjar inifrån.",
          "Four categories are weighted together. The visual assessment carries the most weight when an image is available, but lifestyle weighs almost as much -- a deliberate choice reflecting our belief that skin health starts from within.",
          "Cuatro categorías se ponderan juntas. La evaluación visual tiene el mayor peso cuando hay imagen, pero el estilo de vida pesa casi igual -- reflejando que la salud cutánea comienza desde dentro.",
          "Vier Kategorien werden zusammengewichtet. Die visuelle Bewertung hat das größte Gewicht, aber der Lebensstil wiegt fast ebenso schwer -- ein bewusstes Design.",
          "Quatre catégories sont pondérées. L'évaluation visuelle a le plus de poids, mais le mode de vie pèse presque autant -- un choix délibéré."
        )}
      </P>

      <WeightBar label={tx(locale, "Visuell AI-bedömning (bild)", "Visual AI assessment (image)", "Evaluación visual IA (imagen)", "Visuelle KI-Bewertung (Bild)", "Évaluation visuelle IA (image)")} pct={35} color="#108474" />
      <WeightBar label={tx(locale, "Livsstilsfaktorer", "Lifestyle factors", "Factores de estilo de vida", "Lebensstilfaktoren", "Facteurs mode de vie")} pct={30} color="#fcb237" />
      <WeightBar label={tx(locale, "Hudtyp & angivna besvär", "Skin type & reported concerns", "Tipo de piel y preocupaciones", "Hauttyp & angegebene Beschwerden", "Type de peau & problèmes signalés")} pct={20} color="#766a62" />
      <WeightBar label={tx(locale, "Nuvarande rutin", "Current routine", "Rutina actual", "Aktuelle Routine", "Routine actuelle")} pct={15} color="#e6e6e6" />

      <SectionHeading>{tx(locale, "Poängfördelning", "Score distribution", "Distribución de puntuación", "Punkteverteilung", "Distribution des scores")}</SectionHeading>
      <div className="mb-4 space-y-2">
        {[
          { range: "85-100", label: tx(locale, "Utmärkt", "Excellent", "Excelente", "Ausgezeichnet", "Excellent"), desc: tx(locale, "Frisk hud kombinerat med goda livsstilsvanor. De flesta med normal hud och hyfsad livsstil hamnar här.", "Healthy skin combined with good lifestyle habits. Most people with normal skin and reasonable lifestyle score here.", "Piel sana combinada con buenos hábitos. La mayoría con piel normal puntúan aquí.", "Gesunde Haut kombiniert mit guten Lebensgewohnheiten.", "Peau saine combinée à de bonnes habitudes de vie."), variant: "green" as const },
          { range: "70-84", label: tx(locale, "Bra grund", "Good foundation", "Buena base", "Gute Grundlage", "Bonne base"), desc: tx(locale, "Normal hud med utrymme för förbättring -- livsstilsfaktorer kan oftast optimeras.", "Normal skin with room for improvement -- lifestyle factors can usually be optimized.", "Piel normal con margen de mejora -- los factores de estilo de vida pueden optimizarse.", "Normale Haut mit Verbesserungspotenzial -- Lebensstilfaktoren können optimiert werden.", "Peau normale avec marge d'amélioration -- les facteurs mode de vie peuvent être optimisés."), variant: "gold" as const },
          { range: "55-69", label: tx(locale, "Förbättringspotential", "Room for improvement", "Potencial de mejora", "Verbesserungspotenzial", "Potentiel d'amélioration"), desc: tx(locale, "Tydliga besvär eller bristfällig livsstil som påverkar huden negativt.", "Clear concerns or inadequate lifestyle negatively affecting the skin.", "Problemas claros o estilo de vida inadecuado que afectan negativamente la piel.", "Deutliche Beschwerden oder unzureichender Lebensstil.", "Problèmes clairs ou mode de vie inadéquat affectant la peau."), variant: "muted" as const },
          { range: tx(locale, "Under 55", "Below 55", "Menos de 55", "Unter 55", "Moins de 55"), label: tx(locale, "Behöver uppmärksamhet", "Needs attention", "Necesita atención", "Braucht Aufmerksamkeit", "Nécessite attention"), desc: tx(locale, "Allvarligare hudproblem eller flera bristande livsstilsfaktorer.", "More serious skin problems or multiple lifestyle deficiencies.", "Problemas cutáneos serios o múltiples deficiencias en el estilo de vida.", "Ernstere Hautprobleme oder mehrere Lebensstildefizite.", "Problèmes cutanés plus sérieux ou multiples carences de mode de vie."), variant: "muted" as const },
        ].map(({ range, label, desc, variant }) => (
          <div key={range} className="flex items-start gap-3 rounded-xl bg-[#f5f5f7]/60 px-3.5 py-2.5">
            <Badge variant={variant}>{range}</Badge>
            <div>
              <span className="text-[12px] font-semibold text-[#1d1d1f]">{label}</span>
              <p className="mt-0.5 text-[11px] leading-relaxed text-[#766a62]">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <SectionHeading>{tx(locale, "Viktigt att veta", "Important to know", "Importante saber", "Wichtig zu wissen", "Important à savoir")}</SectionHeading>
      <P>
        {tx(locale,
          "Skanningsresultat (ONNX-modellens klassificeringar) påverkar aldrig poängen negativt på egen hand -- de fungerar som en bekräftelse av den visuella bedömningen. En person med synligt frisk hud och rimlig livsstil får alltid minst 75+, oavsett vad den automatiska skanningen rapporterar. Detta är ett medvetet designval för att undvika överdiagnostisering.",
          "Scan results (ONNX model classifications) never negatively affect the score on their own -- they serve as confirmation of the visual assessment. A person with visibly healthy skin and a reasonable lifestyle always scores at least 75+, regardless of what the automatic scan reports. This is a deliberate design choice to avoid over-diagnosis.",
          "Los resultados del escaneo nunca afectan negativamente la puntuación por sí solos -- sirven como confirmación de la evaluación visual. Una persona con piel visiblemente sana siempre obtiene al menos 75+.",
          "Scanergebnisse beeinflussen den Wert niemals negativ allein -- sie dienen als Bestätigung der visuellen Bewertung. Eine Person mit sichtbar gesunder Haut erhält immer mindestens 75+.",
          "Les résultats du scan n'affectent jamais négativement le score seuls -- ils servent de confirmation de l'évaluation visuelle. Une personne à la peau visiblement saine obtient toujours au moins 75+."
        )}
      </P>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab content – Skin Age                                             */
/* ------------------------------------------------------------------ */

function SkinAgeTab({ locale }: { locale: string }) {
  return (
    <div>
      <SectionHeading>{tx(locale, "Biologisk hudålder", "Biological skin age", "Edad biológica de la piel", "Biologisches Hautalter", "Âge biologique cutané")}</SectionHeading>
      <P>
        {tx(locale,
          "Den biologiska hudåldern är en uppskattning av hur gammal din hud \"ser ut\" jämfört med din kronologiska ålder. Den kan vara lägre (yngre) eller högre (äldre) än din faktiska ålder.",
          "The biological skin age is an estimate of how old your skin \"looks\" compared to your chronological age. It can be lower (younger) or higher (older) than your actual age.",
          "La edad biológica de la piel es una estimación de cuán vieja \"parece\" tu piel en comparación con tu edad cronológica.",
          "Das biologische Hautalter schätzt, wie alt deine Haut im Vergleich zu deinem chronologischen Alter \"aussieht\".",
          "L'âge biologique cutané estime à quel point votre peau \"paraît\" par rapport à votre âge chronologique."
        )}
      </P>

      <SectionHeading>{tx(locale, "Beräkningsgrunder", "Calculation basis", "Bases del cálculo", "Berechnungsgrundlagen", "Bases de calcul")}</SectionHeading>
      <div className="mb-4 space-y-2">
        {[
          { label: tx(locale, "Visuell bedömning", "Visual assessment", "Evaluación visual", "Visuelle Bewertung", "Évaluation visuelle"), desc: tx(locale, "Rynkor, fina linjer, elasticitet, pigmentering och hudtextur analyseras i din bild av GPT Vision.", "Wrinkles, fine lines, elasticity, pigmentation and skin texture are analyzed in your image by GPT Vision.", "Arrugas, líneas finas, elasticidad, pigmentación y textura se analizan en tu imagen.", "Falten, feine Linien, Elastizität, Pigmentierung und Hauttextur werden in deinem Bild analysiert.", "Rides, ridules, élasticité, pigmentation et texture sont analysées dans votre image.") },
          { label: tx(locale, "ONNX-metriker", "ONNX metrics", "Métricas ONNX", "ONNX-Metriken", "Métriques ONNX"), desc: tx(locale, "Speciellt hydration, elasticity, wrinkles och sun_damage är starkt kopplade till biologisk åldring.", "Especially hydration, elasticity, wrinkles and sun_damage are strongly linked to biological aging.", "Especialmente hidratación, elasticidad, arrugas y daño solar están fuertemente vinculados al envejecimiento biológico.", "Besonders Hydration, Elastizität, Falten und Sonnenschäden sind eng mit biologischer Alterung verknüpft.", "Hydratation, élasticité, rides et dommages solaires sont fortement liés au vieillissement biologique.") },
          { label: tx(locale, "Livsstilsfaktorer", "Lifestyle factors", "Factores de estilo de vida", "Lebensstilfaktoren", "Facteurs mode de vie"), desc: tx(locale, "Kronisk sömnbrist, hög stress, ohälsosam kost, solvanor och bristande träning accelererar hudens åldrande.", "Chronic sleep deprivation, high stress, unhealthy diet, sun habits and lack of exercise accelerate skin aging.", "La falta crónica de sueño, estrés, dieta poco saludable y falta de ejercicio aceleran el envejecimiento.", "Chronischer Schlafmangel, hoher Stress, ungesunde Ernährung und Bewegungsmangel beschleunigen die Hautalterung.", "Le manque chronique de sommeil, le stress, une alimentation malsaine et le manque d'exercice accélèrent le vieillissement.") },
          { label: tx(locale, "Hudtillstånd", "Skin conditions", "Condiciones cutáneas", "Hautzustände", "Conditions cutanées"), desc: tx(locale, "Allvarlighetsgraden av eventuella hudbesvär påverkar uppskattningen.", "The severity of any skin concerns affects the estimate.", "La gravedad de las condiciones cutáneas afecta la estimación.", "Der Schweregrad der Hautbeschwerden beeinflusst die Schätzung.", "La gravité des problèmes cutanés affecte l'estimation.") },
        ].map(({ label, desc }) => (
          <div key={label} className="rounded-xl bg-[#f5f5f7]/60 px-3.5 py-2.5">
            <span className="text-[12px] font-semibold text-[#1d1d1f]">{label}</span>
            <p className="mt-0.5 text-[11px] leading-relaxed text-[#766a62]">{desc}</p>
          </div>
        ))}
      </div>

      <SectionHeading>{tx(locale, "Vetenskaplig bakgrund", "Scientific background", "Fundamento científico", "Wissenschaftlicher Hintergrund", "Contexte scientifique")}</SectionHeading>
      <P>
        {tx(locale,
          "Begreppet biologisk åldring vs kronologisk åldring är väletablerat i dermatologisk forskning. Studier visar att upp till 80% av ansiktets synliga åldrande beror på extrinsiska faktorer -- framför allt UV-exponering (fotoåldring), men även kost, sömn och stress. Det innebär att en stor del av hudens åldrande går att bromsa eller till och med vända med rätt vanor.",
          "The concept of biological vs chronological aging is well established in dermatological research. Studies show that up to 80% of visible facial aging is caused by extrinsic factors -- primarily UV exposure (photoaging), but also diet, sleep and stress. This means a significant portion of skin aging can be slowed or even reversed with proper habits.",
          "El concepto de envejecimiento biológico vs cronológico está bien establecido. Los estudios muestran que hasta el 80% del envejecimiento facial visible se debe a factores extrínsecos, principalmente exposición UV.",
          "Das Konzept des biologischen vs. chronologischen Alterns ist in der dermatologischen Forschung gut etabliert. Studien zeigen, dass bis zu 80% der sichtbaren Gesichtsalterung auf extrinsische Faktoren zurückzuführen sind.",
          "Le concept de vieillissement biologique vs chronologique est bien établi. Les études montrent que jusqu'à 80% du vieillissement facial visible est dû à des facteurs extrinsèques."
        )}
      </P>
      <P>
        {tx(locale,
          "Fitzpatrick-skalan (typ I-VI) används för att klassificera hudens känslighetsnivå för UV-strålning. Den utvecklades av Thomas B. Fitzpatrick vid Harvard Medical School 1975 och är den mest använda dermatologiska klassificeringen internationellt. Vi använder den för att anpassa våra rekommendationer kring solskydd och pigmenteringsrisk.",
          "The Fitzpatrick scale (type I-VI) is used to classify skin sensitivity to UV radiation. It was developed by Thomas B. Fitzpatrick at Harvard Medical School in 1975 and is the most widely used dermatological classification internationally. We use it to tailor our sun protection and pigmentation risk recommendations.",
          "La escala de Fitzpatrick (tipo I-VI) clasifica la sensibilidad cutánea a la radiación UV. Fue desarrollada por Thomas B. Fitzpatrick en Harvard Medical School en 1975.",
          "Die Fitzpatrick-Skala (Typ I-VI) klassifiziert die Hautempfindlichkeit gegenüber UV-Strahlung. Sie wurde 1975 von Thomas B. Fitzpatrick an der Harvard Medical School entwickelt.",
          "L'échelle de Fitzpatrick (type I-VI) classifie la sensibilité cutanée aux UV. Elle a été développée par Thomas B. Fitzpatrick à Harvard Medical School en 1975."
        )}
      </P>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab content – Metrics                                              */
/* ------------------------------------------------------------------ */

function MetricsTab({ locale }: { locale: string }) {
  const metrics = [
    { name: tx(locale, "Rynkor", "Wrinkles", "Arrugas", "Falten", "Rides"), desc: tx(locale, "Finlinjers djup och utbredning. Påverkas av kollagenproduktion, UV-exponering och fuktbalans.", "Fine line depth and spread. Affected by collagen production, UV exposure and moisture balance.", "Profundidad y extensión de líneas finas. Afectadas por producción de colágeno y exposición UV.", "Feinlinien-Tiefe und -Ausbreitung. Beeinflusst durch Kollagenproduktion und UV-Exposition.", "Profondeur et étendue des ridules. Influencées par la production de collagène et l'exposition UV.") },
    { name: tx(locale, "Porer", "Pores", "Poros", "Poren", "Pores"), desc: tx(locale, "Synlighet och storlek. Påverkas av talgproduktion, ålder och genetik.", "Visibility and size. Affected by sebum production, age and genetics.", "Visibilidad y tamaño. Afectados por producción de sebo, edad y genética.", "Sichtbarkeit und Größe. Beeinflusst durch Talgproduktion, Alter und Genetik.", "Visibilité et taille. Influencés par la production de sébum, l'âge et la génétique.") },
    { name: tx(locale, "Pigmentering", "Pigmentation", "Pigmentación", "Pigmentierung", "Pigmentation"), desc: tx(locale, "Jämn hudton och frånvaro av hyperpigmentering. Kopplad till melaninaktivitet och solskador.", "Even skin tone and absence of hyperpigmentation. Linked to melanin activity and sun damage.", "Tono uniforme y ausencia de hiperpigmentación.", "Gleichmäßiger Hautton und Fehlen von Hyperpigmentierung.", "Teint uniforme et absence d'hyperpigmentation.") },
    { name: tx(locale, "Rodnad", "Redness", "Enrojecimiento", "Rötung", "Rougeur"), desc: tx(locale, "Inflammation och kapillärsynlighet. Kan indikera rosacea, känslighet eller barriärproblem.", "Inflammation and capillary visibility. May indicate rosacea, sensitivity or barrier issues.", "Inflamación y visibilidad capilar.", "Entzündung und Kapillar-Sichtbarkeit.", "Inflammation et visibilité capillaire.") },
    { name: tx(locale, "Textur", "Texture", "Textura", "Textur", "Texture"), desc: tx(locale, "Hudens ytstruktur -- jämn vs ojämn. Påverkas av cellförnyelsetakt och exfoliering.", "Skin surface structure -- even vs uneven. Affected by cell renewal rate and exfoliation.", "Estructura superficial -- uniforme vs irregular.", "Hautoberfläche -- glatt vs. ungleichmäßig.", "Structure de surface -- lisse vs irrégulière.") },
    { name: tx(locale, "Mörka ringar", "Dark circles", "Ojeras", "Augenringe", "Cernes"), desc: tx(locale, "Hyperpigmentering och tunnhet under ögonen. Kopplad till sömn, genetik och vaskulära faktorer.", "Hyperpigmentation and thinness under the eyes. Linked to sleep, genetics and vascular factors.", "Hiperpigmentación y delgadez debajo de los ojos.", "Hyperpigmentierung und Dünnheit unter den Augen.", "Hyperpigmentation et finesse sous les yeux.") },
    { name: tx(locale, "Fasthet", "Firmness", "Firmeza", "Festigkeit", "Fermeté"), desc: tx(locale, "Hudens spänst och motstånd mot gravitationell nedgång. Relaterat till kollagen- och elastinnivåer.", "Skin resilience and resistance to gravitational sagging. Related to collagen and elastin levels.", "Resistencia y firmeza cutánea.", "Hautspannkraft und Widerstand gegen Absacken.", "Résilience et résistance à l'affaissement.") },
    { name: tx(locale, "Fukt (hydrering)", "Hydration", "Hidratación", "Feuchtigkeit", "Hydratation"), desc: tx(locale, "Vatteninnehåll i stratum corneum. Avgörande för barriärfunktion och cellförnyelse.", "Water content in stratum corneum. Crucial for barrier function and cell renewal.", "Contenido de agua en el estrato córneo.", "Wassergehalt im Stratum corneum.", "Teneur en eau du stratum corneum.") },
    { name: tx(locale, "Hudton", "Skin tone", "Tono de piel", "Hautton", "Teint"), desc: tx(locale, "Övergripande jämnhet och lyster i hudton.", "Overall evenness and radiance of skin tone.", "Uniformidad general y luminosidad del tono.", "Gesamte Gleichmäßigkeit und Ausstrahlung.", "Uniformité générale et éclat du teint.") },
    { name: tx(locale, "Akne", "Acne", "Acné", "Akne", "Acné"), desc: tx(locale, "Frånvaro av komedoner, papler och pustler. Kopplad till talgproduktion och mikrobiombalans.", "Absence of comedones, papules and pustules. Linked to sebum production and microbiome balance.", "Ausencia de comedones, pápulas y pústulas.", "Fehlen von Komedonen, Papeln und Pusteln.", "Absence de comédons, papules et pustules.") },
    { name: tx(locale, "Känslighet", "Sensitivity", "Sensibilidad", "Empfindlichkeit", "Sensibilité"), desc: tx(locale, "Hudens reaktivitet och barriärfunktion. Hög poäng = låg känslighet (mer robust).", "Skin reactivity and barrier function. High score = low sensitivity (more robust).", "Reactividad cutánea. Puntuación alta = baja sensibilidad.", "Hautreaktivität. Hoher Wert = geringe Empfindlichkeit.", "Réactivité cutanée. Score élevé = faible sensibilité.") },
    { name: tx(locale, "Solskador", "Sun damage", "Daño solar", "Sonnenschäden", "Dommages solaires"), desc: tx(locale, "Kumulativa UV-skador i form av pigmentfläckar, aktinisk elastos och ojämn textur.", "Cumulative UV damage: pigment spots, actinic elastosis and uneven texture.", "Daño UV acumulativo: manchas, elastosis actínica y textura irregular.", "Kumulative UV-Schäden: Pigmentflecken und ungleichmäßige Textur.", "Dommages UV cumulatifs : taches, élastose actinique et texture irrégulière.") },
    { name: tx(locale, "Elasticitet", "Elasticity", "Elasticidad", "Elastizität", "Élasticité"), desc: tx(locale, "Hudens förmåga att återvända efter uttöjning. Minskar naturligt med ålder men kan stödjas.", "Skin's ability to bounce back after stretching. Decreases naturally with age but can be supported.", "Capacidad de recuperación tras estiramiento.", "Rückstellfähigkeit der Haut nach Dehnung.", "Capacité de la peau à reprendre sa forme.") },
    { name: tx(locale, "Lyster (radiance)", "Radiance", "Luminosidad", "Ausstrahlung", "Éclat"), desc: tx(locale, "Hudens naturliga sken och vitalitet. Påverkas av blodcirkulation, fukt och cellförnyelse.", "Skin's natural glow and vitality. Affected by blood circulation, moisture and cell renewal.", "Brillo natural y vitalidad de la piel.", "Natürliches Strahlen und Vitalität der Haut.", "Éclat naturel et vitalité de la peau.") },
    { name: tx(locale, "Barriärhälsa", "Barrier health", "Salud de la barrera", "Barriere-Gesundheit", "Santé de la barrière"), desc: tx(locale, "Intakthet hos stratum corneum och lipidbarriären. Avgörande för att hålla fukt inne och irritanter ute.", "Integrity of stratum corneum and lipid barrier. Crucial for retaining moisture and keeping irritants out.", "Integridad del estrato córneo y barrera lipídica.", "Intaktheit des Stratum corneum und der Lipidbarriere.", "Intégrité du stratum corneum et de la barrière lipidique.") },
  ];

  return (
    <div>
      <SectionHeading>{tx(locale, "15 hudmetriker", "15 skin metrics", "15 métricas cutáneas", "15 Hautmetriken", "15 métriques cutanées")}</SectionHeading>
      <P>
        {tx(locale,
          "ONNX-modellen (MobileNetV3, tränad på över 88 000 dermatologiska bilder) beräknar 15 individuella hudmetriker på en skala 0-100, där högre värde innebär friskare hud. Dessa metriker kan sedan justeras av GPT:s visuella bedömning om den avviker markant.",
          "The ONNX model (MobileNetV3, trained on over 88,000 dermatological images) calculates 15 individual skin metrics on a 0-100 scale, where a higher value means healthier skin. These metrics may be adjusted by GPT's visual assessment if it diverges significantly.",
          "El modelo ONNX (MobileNetV3, entrenado con más de 88.000 imágenes) calcula 15 métricas individuales en escala 0-100, donde un valor más alto significa piel más sana.",
          "Das ONNX-Modell (MobileNetV3, trainiert mit über 88.000 Bildern) berechnet 15 Hautmetriken auf einer Skala von 0-100.",
          "Le modèle ONNX (MobileNetV3, entraîné sur plus de 88 000 images) calcule 15 métriques cutanées sur une échelle 0-100."
        )}
      </P>

      <div className="mb-4 grid gap-2 sm:grid-cols-2">
        {metrics.map(({ name, desc }) => (
          <div key={name} className="rounded-xl border border-[#e6e6e6]/40 bg-white px-3 py-2.5">
            <span className="text-[12px] font-semibold text-[#108474]">{name}</span>
            <p className="mt-0.5 text-[11px] leading-relaxed text-[#766a62]">{desc}</p>
          </div>
        ))}
      </div>

      <SectionHeading>{tx(locale, "Samspel mellan modellerna", "Model interplay", "Interacción entre modelos", "Zusammenspiel der Modelle", "Interaction entre les modèles")}</SectionHeading>
      <P>
        {tx(locale,
          "När både ONNX-modellen och GPT Vision överensstämmer i sin bedömning presenteras resultatet med hög konfidens. Om de avviker väger GPT:s visuella bedömning tyngre, men ONNX-resultatet redovisas ändå. Konfidensvärden under 50% från ONNX behandlas försiktigt och påverkar inte den slutliga bedömningen.",
          "When both the ONNX model and GPT Vision agree, results are presented with high confidence. When they diverge, GPT's visual assessment carries more weight, but the ONNX result is still reported. Confidence values below 50% from ONNX are treated cautiously and do not affect the final assessment.",
          "Cuando ambos modelos coinciden, los resultados se presentan con alta confianza. Cuando difieren, la evaluación visual de GPT tiene más peso.",
          "Wenn beide Modelle übereinstimmen, werden Ergebnisse mit hoher Konfidenz präsentiert. Bei Abweichungen wiegt die visuelle GPT-Bewertung schwerer.",
          "Lorsque les deux modèles concordent, les résultats sont présentés avec une haute confiance. En cas de divergence, l'évaluation visuelle de GPT prévaut."
        )}
      </P>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab content – Lifestyle                                            */
/* ------------------------------------------------------------------ */

function LifestyleTabContent({ locale }: { locale: string }) {
  const areas = [
    { area: tx(locale, "Sömn", "Sleep", "Sueño", "Schlaf", "Sommeil"), detail: tx(locale, "Under djupsömn (fas 3-4) ökar tillväxthormon (HGH) som stimulerar kollagensyntes och cellreparation. Kronisk sömnbrist (<6 h/natt) är kopplad till 30% lägre barriäråterhämtning och snabbare transepidermal vattenförlust (TEWL). Studie: Oyetakin-White et al., Clinical and Experimental Dermatology (2015).", "During deep sleep (stages 3-4), growth hormone (HGH) increases, stimulating collagen synthesis and cell repair. Chronic sleep deprivation (<6 h/night) is linked to 30% lower barrier recovery and faster transepidermal water loss (TEWL). Study: Oyetakin-White et al., Clinical and Experimental Dermatology (2015).", "Durante el sueño profundo (fases 3-4), la hormona del crecimiento (HGH) aumenta, estimulando la síntesis de colágeno. La privación crónica de sueño está vinculada a una recuperación de barrera un 30% menor. Estudio: Oyetakin-White et al. (2015).", "Im Tiefschlaf (Phase 3-4) steigt das Wachstumshormon (HGH), das Kollagensynthese und Zellreparatur stimuliert. Chronischer Schlafmangel ist mit 30% geringerer Barriere-Erholung verbunden. Studie: Oyetakin-White et al. (2015).", "Pendant le sommeil profond (phases 3-4), l'hormone de croissance stimule la synthèse de collagène. Le manque chronique de sommeil est lié à une récupération de la barrière 30% plus faible. Étude : Oyetakin-White et al. (2015).") },
    { area: tx(locale, "Stress", "Stress", "Estrés", "Stress", "Stress"), detail: tx(locale, "Kronisk stress höjer kortisol som bryter ned kollagen, ökar talgproduktion och försvagar hudbarriären. Stressreducering genom meditation har visats förbättra psoriasis med 50% snabbare. Studie: Kabat-Zinn et al., Psychosomatic Medicine (1998).", "Chronic stress raises cortisol, which breaks down collagen, increases sebum production and weakens the skin barrier. Stress reduction through meditation has been shown to improve psoriasis 50% faster. Study: Kabat-Zinn et al., Psychosomatic Medicine (1998).", "El estrés crónico eleva el cortisol, degradando el colágeno y debilitando la barrera cutánea. Estudio: Kabat-Zinn et al. (1998).", "Chronischer Stress erhöht Cortisol, das Kollagen abbaut und die Hautbarriere schwächt. Studie: Kabat-Zinn et al. (1998).", "Le stress chronique élève le cortisol, dégradant le collagène et affaiblissant la barrière cutanée. Étude : Kabat-Zinn et al. (1998).") },
    { area: tx(locale, "Kost", "Diet", "Dieta", "Ernährung", "Alimentation"), detail: tx(locale, "Antiinflammatorisk kost (omega-3, antioxidanter, låga GI-livsmedel) är kopplad till lägre förekomst av akne och långsammare hudåldrande. Högt sockerintag ökar AGE-bildning (Advanced Glycation End-products) som skadar kollagen. Studie: Danby, Clinics in Dermatology (2010).", "Anti-inflammatory diet (omega-3, antioxidants, low-GI foods) is linked to lower acne prevalence and slower skin aging. High sugar intake increases AGE formation (Advanced Glycation End-products) that damages collagen. Study: Danby, Clinics in Dermatology (2010).", "La dieta antiinflamatoria está vinculada a menor acné y envejecimiento más lento. Estudio: Danby (2010).", "Entzündungshemmende Ernährung ist mit weniger Akne und langsamerer Hautalterung verbunden. Studie: Danby (2010).", "Un régime anti-inflammatoire est lié à moins d'acné et un vieillissement cutané plus lent. Étude : Danby (2010).") },
    { area: tx(locale, "Vatten", "Water", "Agua", "Wasser", "Eau"), detail: tx(locale, "Adekvat vattenintag (ca 2-3 liter/dag) stödjer stratum corneums hydrering. Studier visar att en ökning från 1 till 2.5 liter/dag förbättrar hudens fuktighet, särskilt hos personer med lågt basintag. Studie: Palma et al., Clinical, Cosmetic and Investigational Dermatology (2015).", "Adequate water intake (approx. 2-3 liters/day) supports stratum corneum hydration. Studies show that increasing from 1 to 2.5 liters/day improves skin moisture, especially in people with low baseline intake. Study: Palma et al. (2015).", "La ingesta adecuada de agua (2-3 litros/día) apoya la hidratación del estrato córneo. Estudio: Palma et al. (2015).", "Ausreichende Wasseraufnahme (ca. 2-3 Liter/Tag) unterstützt die Stratum-corneum-Hydratation. Studie: Palma et al. (2015).", "Un apport hydrique adéquat (2-3 litres/jour) soutient l'hydratation du stratum corneum. Étude : Palma et al. (2015).") },
    { area: tx(locale, "Rörelse", "Exercise", "Ejercicio", "Bewegung", "Exercice"), detail: tx(locale, "Regelbunden träning förbättrar blodcirkulationen till huden, ökar syretillförsel och stödjer lymfdränering. Konditionsträning är dessutom kopplad till längre telomerer -- en markör för biologisk åldring. Studie: Crane et al., Aging Cell (2015).", "Regular exercise improves blood circulation to the skin, increases oxygen delivery and supports lymphatic drainage. Cardio exercise is also linked to longer telomeres -- a marker for biological aging. Study: Crane et al., Aging Cell (2015).", "El ejercicio regular mejora la circulación sanguínea cutánea. Estudio: Crane et al. (2015).", "Regelmäßige Bewegung verbessert die Durchblutung der Haut. Studie: Crane et al. (2015).", "L'exercice régulier améliore la circulation sanguine cutanée. Étude : Crane et al. (2015).") },
    { area: tx(locale, "Tarmhälsa", "Gut health", "Salud intestinal", "Darmgesundheit", "Santé intestinale"), detail: tx(locale, "Tarm-hud-axeln (gut-skin axis) är ett växande forskningsområde. Tarmens mikrobiom påverkar systemisk inflammation som manifesteras i huden. Probiotika och fermenterad mat har visat positiva effekter på akne, rosacea och atopisk dermatit. Studie: Salem et al., Frontiers in Microbiology (2018).", "The gut-skin axis is a growing research field. The gut microbiome influences systemic inflammation that manifests in the skin. Probiotics and fermented foods have shown positive effects on acne, rosacea and atopic dermatitis. Study: Salem et al., Frontiers in Microbiology (2018).", "El eje intestino-piel es un campo de investigación creciente. Estudio: Salem et al. (2018).", "Die Darm-Haut-Achse ist ein wachsendes Forschungsgebiet. Studie: Salem et al. (2018).", "L'axe intestin-peau est un domaine de recherche en expansion. Étude : Salem et al. (2018).") },
  ];

  return (
    <div>
      <SectionHeading>{tx(locale, "Livsstilsrekommendationer", "Lifestyle recommendations", "Recomendaciones de estilo de vida", "Lebensstilempfehlungen", "Recommandations mode de vie")}</SectionHeading>
      <P>
        {tx(locale,
          "Våra livsstilsråd baseras på dina quiz-svar om sömn, stressnivå, kost, vattenintag och fysisk aktivitet. Varje tips viktas med en påverkansgrad (hög, medel eller låg) som speglar hur stor effekt just den faktorn har på din hud, baserat på aktuell dermatologisk forskning.",
          "Our lifestyle advice is based on your quiz answers about sleep, stress levels, diet, water intake and physical activity. Each tip is weighted with an impact level (high, medium or low) reflecting how much that factor affects your skin, based on current dermatological research.",
          "Nuestros consejos de estilo de vida se basan en tus respuestas sobre sueño, estrés, dieta, hidratación y actividad física.",
          "Unsere Lebensstiltipps basieren auf deinen Angaben zu Schlaf, Stress, Ernährung, Wasseraufnahme und Bewegung.",
          "Nos conseils mode de vie sont basés sur vos réponses concernant le sommeil, le stress, l'alimentation, l'hydratation et l'activité physique."
        )}
      </P>

      <SectionHeading>{tx(locale, "Vetenskapliga kopplingar", "Scientific connections", "Conexiones científicas", "Wissenschaftliche Zusammenhänge", "Liens scientifiques")}</SectionHeading>
      <div className="mb-4 space-y-2">
        {areas.map(({ area, detail }) => (
          <div key={area} className="rounded-xl bg-[#f5f5f7]/60 px-3.5 py-3">
            <span className="text-[12px] font-bold text-[#1d1d1f]">{area}</span>
            <p className="mt-1 text-[11px] leading-relaxed text-[#766a62]">{detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab content – ECS & Microbiome                                     */
/* ------------------------------------------------------------------ */

function ECSTab({ locale }: { locale: string }) {
  const ecsFunctions = [
    { label: tx(locale, "Talgbalansering", "Sebum balancing", "Balance sebáceo", "Talgregulierung", "Équilibre sébacé"), desc: tx(locale, "ECS-receptorer i talgkörtlarna reglerar sebumproduktion. CBD har visats normalisera lipidsyntes i SZ95 sebocyter, vilket är relevant för både torr och fet hud. Studie: Oláh et al., Journal of Clinical Investigation (2014).", "ECS receptors in sebaceous glands regulate sebum production. CBD has been shown to normalize lipid synthesis in SZ95 sebocytes, relevant for both dry and oily skin. Study: Oláh et al., Journal of Clinical Investigation (2014).", "Los receptores ECS regulan la producción de sebo. Estudio: Oláh et al. (2014).", "ECS-Rezeptoren regulieren die Talgproduktion. Studie: Oláh et al. (2014).", "Les récepteurs SEC régulent la production de sébum. Étude : Oláh et al. (2014).") },
    { label: tx(locale, "Antiinflammation", "Anti-inflammation", "Antiinflamación", "Antientzündung", "Anti-inflammation"), desc: tx(locale, "Aktivering av CB2-receptorer i keratinocyter och immunoceller dämpar inflammatoriska cytokiner (TNF-alfa, IL-6, IL-8). Detta är relevant för tillstånd som akne, rosacea och dermatit.", "Activation of CB2 receptors in keratinocytes and immune cells dampens inflammatory cytokines (TNF-alpha, IL-6, IL-8). This is relevant for conditions such as acne, rosacea and dermatitis.", "La activación de receptores CB2 amortigua citoquinas inflamatorias.", "Die Aktivierung von CB2-Rezeptoren dämpft entzündliche Zytokine.", "L'activation des récepteurs CB2 atténue les cytokines inflammatoires.") },
    { label: tx(locale, "Barriärfunktion", "Barrier function", "Función barrera", "Barrierefunktion", "Fonction barrière"), desc: tx(locale, "ECS påverkar keratinocytdifferentiering och lipidproduktion i stratum corneum, vilket stärker hudbarriären och minskar transepidermal vattenförlust.", "ECS influences keratinocyte differentiation and lipid production in the stratum corneum, strengthening the skin barrier and reducing transepidermal water loss.", "El SEC influye en la diferenciación de queratinocitos.", "Das ECS beeinflusst die Keratinozyten-Differenzierung.", "Le SEC influence la différenciation des kératinocytes.") },
    { label: tx(locale, "Cellförnyelse", "Cell renewal", "Renovación celular", "Zellerneuerung", "Renouvellement cellulaire"), desc: tx(locale, "Cannabinoidreceptorer reglerar keratinocytproliferation. Balanserad ECS-aktivitet stödjer normal cellförnyelsetakt -- varken för snabb (psoriasis) eller för långsam (torr, matt hud).", "Cannabinoid receptors regulate keratinocyte proliferation. Balanced ECS activity supports normal cell renewal rate -- neither too fast (psoriasis) nor too slow (dry, dull skin).", "Los receptores cannabinoides regulan la proliferación de queratinocitos.", "Cannabinoid-Rezeptoren regulieren die Keratinozyten-Proliferation.", "Les récepteurs cannabinoïdes régulent la prolifération des kératinocytes.") },
  ];

  return (
    <div>
      <SectionHeading>{tx(locale, "Endocannabinoidsystemet (ECS)", "The Endocannabinoid System (ECS)", "El Sistema Endocannabinoide (SEC)", "Das Endocannabinoidsystem (ECS)", "Le Système Endocannabinoïde (SEC)")}</SectionHeading>
      <P>
        {tx(locale,
          "Endocannabinoidsystemet (ECS) är ett biologiskt signalsystem som finns i hela kroppen, inklusive huden. Det består av endocannabinoider (kroppens egna cannabinoider), receptorer (CB1, CB2 och TRPV) samt enzymer som bryter ned dem. I huden reglerar ECS talgproduktion, inflammation, cellproliferation och smärtsignalering.",
          "The endocannabinoid system (ECS) is a biological signaling system found throughout the body, including the skin. It consists of endocannabinoids (the body's own cannabinoids), receptors (CB1, CB2 and TRPV), and enzymes that break them down. In the skin, the ECS regulates sebum production, inflammation, cell proliferation and pain signaling.",
          "El sistema endocannabinoide (SEC) es un sistema de señalización biológica presente en todo el cuerpo, incluida la piel.",
          "Das Endocannabinoidsystem (ECS) ist ein biologisches Signalsystem im gesamten Körper, einschließlich der Haut.",
          "Le système endocannabinoïde (SEC) est un système de signalisation biologique présent dans tout le corps, y compris la peau."
        )}
      </P>

      <SectionHeading>{tx(locale, "ECS i huden", "ECS in the skin", "SEC en la piel", "ECS in der Haut", "SEC dans la peau")}</SectionHeading>
      <div className="mb-4 space-y-2">
        {ecsFunctions.map(({ label, desc }) => (
          <div key={label} className="rounded-xl border border-[#e6e6e6]/40 bg-white px-3 py-2.5">
            <span className="text-[12px] font-semibold text-[#108474]">{label}</span>
            <p className="mt-0.5 text-[11px] leading-relaxed text-[#766a62]">{desc}</p>
          </div>
        ))}
      </div>

      <SectionHeading>{tx(locale, "CBD & CBG i hudvård", "CBD & CBG in skincare", "CBD y CBG en el cuidado de la piel", "CBD & CBG in der Hautpflege", "CBD et CBG dans les soins cutanés")}</SectionHeading>
      <P>
        {tx(locale,
          "CBD (cannabidiol) och CBG (cannabigerol) är fytocannabinoider som interagerar med hudens ECS utan psykoaktiva effekter. 1753 Skincares produkter använder dessa för att stödja hudens naturliga balans. CBD verkar primärt via CB2-receptorer och TRPV1-kanaler, medan CBG har visat bredare aktivitet över både CB1 och CB2.",
          "CBD (cannabidiol) and CBG (cannabigerol) are phytocannabinoids that interact with the skin's ECS without psychoactive effects. 1753 Skincare's products use these to support the skin's natural balance. CBD primarily works via CB2 receptors and TRPV1 channels, while CBG has shown broader activity across both CB1 and CB2.",
          "CBD y CBG son fitocannabinoides que interactúan con el SEC de la piel sin efectos psicoactivos.",
          "CBD und CBG sind Phytocannabinoide, die mit dem Haut-ECS interagieren, ohne psychoaktive Wirkungen.",
          "Le CBD et le CBG sont des phytocannabinoïdes qui interagissent avec le SEC cutané sans effets psychoactifs."
        )}
      </P>

      <SectionHeading>{tx(locale, "Hudens mikrobiom", "The skin microbiome", "El microbioma cutáneo", "Das Hautmikrobiom", "Le microbiome cutané")}</SectionHeading>
      <P>
        {tx(locale,
          "Hudens mikrobiom består av biljoner mikroorganismer (bakterier, svampar, kvalster) som lever på och i huden. Ett balanserat mikrobiom är avgörande för barriärfunktion, immunförsvar och pH-balans. Vår analys bedömer hur din rutin och livsstil påverkar mikrobiombalansen.",
          "The skin microbiome consists of trillions of microorganisms (bacteria, fungi, mites) living on and in the skin. A balanced microbiome is crucial for barrier function, immune defense and pH balance. Our analysis assesses how your routine and lifestyle affect microbiome balance.",
          "El microbioma cutáneo consiste en billones de microorganismos. Un microbioma equilibrado es crucial para la función barrera.",
          "Das Hautmikrobiom besteht aus Billionen von Mikroorganismen. Ein ausgewogenes Mikrobiom ist entscheidend für die Barrierefunktion.",
          "Le microbiome cutané est constitué de milliers de milliards de micro-organismes. Un microbiome équilibré est crucial pour la fonction barrière."
        )}
      </P>
      <P>
        {tx(locale,
          "Forskning visar att ett friskt hudmikrobiom domineras av kommensala arter som Staphylococcus epidermidis och Cutibacterium acnes (i rätt mängd), som producerar antimikrobiella peptider och håller pH lågt. Rubbningar är kopplade till akne, eksem, rosacea och atopisk dermatit. Studie: Byrd et al., Nature Reviews Microbiology (2018).",
          "Research shows that a healthy skin microbiome is dominated by commensal species like Staphylococcus epidermidis and Cutibacterium acnes (in proper amounts), which produce antimicrobial peptides and keep pH low. Disruptions are linked to acne, eczema, rosacea and atopic dermatitis. Study: Byrd et al., Nature Reviews Microbiology (2018).",
          "La investigación muestra que un microbioma sano está dominado por especies comensales. Estudio: Byrd et al. (2018).",
          "Forschung zeigt, dass ein gesundes Hautmikrobiom von kommensalen Arten dominiert wird. Studie: Byrd et al. (2018).",
          "La recherche montre qu'un microbiome sain est dominé par des espèces commensales. Étude : Byrd et al. (2018)."
        )}
      </P>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab content – Sources                                              */
/* ------------------------------------------------------------------ */

const REFERENCES = [
  {
    authors: "Oláh A, Tóth BI, Borbíró I, et al.",
    title: "Cannabidiol exerts sebostatic and antiinflammatory effects on human sebocytes",
    journal: "Journal of Clinical Investigation, 2014; 124(9): 3713-3724",
    relevance_sv: "Grundläggande studie som visar CBD:s effekt på talgproduktion och inflammation i mänskliga sebocyter. Bas för ECS-kopplingen i våra produktrekommendationer.",
    relevance_en: "Foundational study showing CBD's effect on sebum production and inflammation in human sebocytes. Basis for the ECS connection in our product recommendations.",
  },
  {
    authors: "Byrd AL, Belkaid Y, Segre JA.",
    title: "The human skin microbiome",
    journal: "Nature Reviews Microbiology, 2018; 16(3): 143-155",
    relevance_sv: "Översiktsartikel om hudens mikrobiom, dess roll i hälsa och sjukdom. Grund för vår mikrobiomanalys.",
    relevance_en: "Review article on the skin microbiome, its role in health and disease. Basis for our microbiome analysis.",
  },
  {
    authors: "Oyetakin-White P, Suggs A, Koo B, et al.",
    title: "Does poor sleep quality affect skin ageing?",
    journal: "Clinical and Experimental Dermatology, 2015; 40(1): 17-22",
    relevance_sv: "Visar sambandet mellan sömnkvalitet och hudbarriäråterhämtning. Underlag för sömnrelaterade livsstilsråd.",
    relevance_en: "Shows the link between sleep quality and skin barrier recovery. Basis for sleep-related lifestyle advice.",
  },
  {
    authors: "Kabat-Zinn J, Wheeler E, Light T, et al.",
    title: "Influence of a mindfulness meditation-based stress reduction intervention on rates of skin clearing in patients with moderate to severe psoriasis",
    journal: "Psychosomatic Medicine, 1998; 60(5): 625-632",
    relevance_sv: "Pilotstudie som visar att stressreducering snabbar på läkeprocessen vid psoriasis.",
    relevance_en: "Pilot study showing stress reduction accelerates the healing process in psoriasis.",
  },
  {
    authors: "Danby FW.",
    title: "Nutrition and aging skin: sugar and glycation",
    journal: "Clinics in Dermatology, 2010; 28(4): 409-411",
    relevance_sv: "Beskriver hur sockerintag påverkar kollagen genom AGE-bildning (Advanced Glycation End-products).",
    relevance_en: "Describes how sugar intake affects collagen through AGE formation (Advanced Glycation End-products).",
  },
  {
    authors: "Palma L, Marques LT, Bujan J, Rodrigues LM.",
    title: "Dietary water affects human skin hydration and biomechanics",
    journal: "Clinical, Cosmetic and Investigational Dermatology, 2015; 8: 413-421",
    relevance_sv: "Visar att ökat vattenintag förbättrar hudens fuktighet och biomekanik.",
    relevance_en: "Shows that increased water intake improves skin moisture and biomechanics.",
  },
  {
    authors: "Crane JD, MacNeil LG, Lally JS, et al.",
    title: "Exercise-stimulated interleukin-15 is controlled by AMPK and regulates skin metabolism and aging",
    journal: "Aging Cell, 2015; 14(4): 625-634",
    relevance_sv: "Visar hur träning påverkar hudens metabolism och biologiska åldring via IL-15.",
    relevance_en: "Shows how exercise affects skin metabolism and biological aging via IL-15.",
  },
  {
    authors: "Salem I, Ramser A, Isham N, Ghannoum MA.",
    title: "The Gut Microbiome as a Major Regulator of the Gut-Skin Axis",
    journal: "Frontiers in Microbiology, 2018; 9: 1459",
    relevance_sv: "Översiktsartikel om tarm-hud-axeln och hur tarmfloran påverkar hudtillstånd.",
    relevance_en: "Review article on the gut-skin axis and how gut flora affects skin conditions.",
  },
  {
    authors: "Fitzpatrick TB.",
    title: "The validity and practicality of sun-reactive skin types I through VI",
    journal: "Archives of Dermatology, 1988; 124(6): 869-871",
    relevance_sv: "Originalartikeln för Fitzpatrick-skalan som vi använder för hudtypklassificering.",
    relevance_en: "Original article for the Fitzpatrick scale used in our skin type classification.",
  },
  {
    authors: "Tóth KF, Ádám D, Bíró T, Oláh A.",
    title: "Cannabinoid Signaling in the Skin: Therapeutic Potential of the 'C(ut)annabinoid' System",
    journal: "Molecules, 2019; 24(5): 918",
    relevance_sv: "Omfattande översikt av cannabinoidsignalering i huden och dess terapeutiska potential.",
    relevance_en: "Comprehensive review of cannabinoid signaling in the skin and its therapeutic potential.",
  },
];

function SourcesTab({ locale }: { locale: string }) {
  return (
    <div>
      <SectionHeading>{tx(locale, "Vetenskapliga referenser", "Scientific references", "Referencias científicas", "Wissenschaftliche Referenzen", "Références scientifiques")}</SectionHeading>
      <P>
        {tx(locale,
          "Nedan listas de primära vetenskapliga studier och referenser som ligger till grund för vår analysmetodik och våra rekommendationer. Vi strävar efter att basera alla påståenden på peer-reviewed forskning.",
          "Below are the primary scientific studies and references that form the basis of our analysis methodology and recommendations. We strive to base all claims on peer-reviewed research.",
          "A continuación se enumeran los estudios científicos principales que fundamentan nuestra metodología de análisis.",
          "Nachfolgend die wissenschaftlichen Studien, die unserer Analysemethodik zugrunde liegen.",
          "Voici les études scientifiques qui constituent la base de notre méthodologie d'analyse."
        )}
      </P>

      <div className="space-y-3">
        {REFERENCES.map((ref, i) => (
          <div key={i} className="rounded-xl border border-[#e6e6e6]/40 bg-white px-3.5 py-3">
            <p className="text-[11px] font-semibold text-[#1d1d1f]">{ref.authors}</p>
            <p className="mt-0.5 text-[11px] italic text-[#515151]">{ref.title}</p>
            <p className="mt-0.5 text-[10px] text-[#766a62]">{ref.journal}</p>
            <p className="mt-1 text-[10px] leading-relaxed text-[#108474]">
              {locale === "sv" ? ref.relevance_sv : ref.relevance_en}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-[#f5f5f7] px-3.5 py-3">
        <p className="text-[11px] font-semibold text-[#766a62]">Disclaimer</p>
        <p className="mt-1 text-[10px] leading-relaxed text-[#766a62]">
          {tx(locale,
            "Denna analys är ett komplement, inte en ersättning för professionell dermatologisk bedömning. Vid allvarliga eller ihållande hudbesvär rekommenderar vi alltid att kontakta en legitimerad hudläkare. AI-modeller kan göra felbedömningar och resultaten bör tolkas som vägledande, inte diagnostiska.",
            "This analysis is a complement, not a replacement for professional dermatological assessment. For serious or persistent skin concerns, we always recommend consulting a licensed dermatologist. AI models can make errors and the results should be interpreted as guidance, not diagnosis.",
            "Este análisis complementa, no reemplaza, la evaluación dermatológica profesional. Para problemas cutáneos serios, consulte a un dermatólogo.",
            "Diese Analyse ergänzt, ersetzt aber nicht die professionelle dermatologische Beurteilung. Bei ernsthaften Hautproblemen empfehlen wir einen Dermatologen.",
            "Cette analyse complète mais ne remplace pas l'évaluation dermatologique professionnelle. Pour les problèmes cutanés sérieux, consultez un dermatologue."
          )}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab routing                                                        */
/* ------------------------------------------------------------------ */

function TabContent({ tabId, locale }: { tabId: MethodTabId; locale: string }) {
  switch (tabId) {
    case "overview": return <OverviewTab locale={locale} />;
    case "score": return <ScoreTab locale={locale} />;
    case "skinAge": return <SkinAgeTab locale={locale} />;
    case "metrics": return <MetricsTab locale={locale} />;
    case "lifestyle": return <LifestyleTabContent locale={locale} />;
    case "ecs": return <ECSTab locale={locale} />;
    case "sources": return <SourcesTab locale={locale} />;
  }
}

/* ------------------------------------------------------------------ */
/*  Main modal                                                         */
/* ------------------------------------------------------------------ */

export function MethodologyModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { locale } = useLocale();
  const [activeTab, setActiveTab] = useState<MethodTabId>("overview");
  const tabs = getTabs(locale);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);

    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative flex h-[100dvh] w-full max-w-2xl flex-col bg-white shadow-2xl sm:h-auto sm:max-h-[85vh] sm:rounded-3xl">
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pb-0 pt-2 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-[#e6e6e6]" />
        </div>

        <div className="flex items-center justify-between border-b border-[#e6e6e6]/60 px-5 py-3 sm:py-4 sm:px-6">
          <div>
            <h3 className="text-[15px] font-bold text-[#1d1d1f]">
              {tx(locale, "Så fungerar din analys", "How your analysis works", "Cómo funciona tu análisis", "So funktioniert deine Analyse", "Comment fonctionne votre analyse")}
            </h3>
            <p className="mt-0.5 text-[11px] text-[#766a62]">
              {tx(locale, "Metodik, beräkningar och vetenskaplig grund", "Methodology, calculations and scientific basis", "Metodología, cálculos y base científica", "Methodik, Berechnungen und wissenschaftliche Grundlage", "Méthodologie, calculs et base scientifique")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f5f5f7] text-[#766a62] transition-colors hover:bg-[#e6e6e6] hover:text-[#1d1d1f] active:scale-90"
            aria-label={tx(locale, "Stäng", "Close", "Cerrar", "Schließen", "Fermer")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="shrink-0 overflow-x-auto border-b border-[#e6e6e6]/40 px-5 sm:px-6 [-webkit-overflow-scrolling:touch]">
          <div className="flex gap-1 py-2">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2.5 text-[11px] font-semibold transition-all duration-200 active:scale-95",
                    active
                      ? "bg-[#108474]/10 text-[#108474]"
                      : "text-[#766a62] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]"
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6 [-webkit-overflow-scrolling:touch]">
          <TabContent tabId={activeTab} locale={locale} />
        </div>
      </div>
    </div>,
    document.body
  );
}
