/**
 * Källförteckning för premium-hudanalysens PDF-rapport.
 *
 * Alla referenser är peer-reviewed studier eller etablerade översikter
 * publicerade i ansedda tidskrifter. Använd ENBART verifierbara
 * citationer (titel + tidskrift + år + volym/nummer/sidor) – aldrig
 * påhittade.
 *
 * Referenserna grupperas per ämnesområde så att samma data kan
 * presenteras snyggt både i PDF (sektionsvis) och en framtida web-vy.
 */
export type CitationCategoryKey =
  | "sleep"
  | "stress"
  | "gut"
  | "ecs"
  | "omega"
  | "antioxidants"
  | "magnesium"
  | "probiotics"
  | "environment"
  | "barrier"
  | "diet"
  | "psychology";

export interface Citation {
  authors: string;
  title: string;
  journal: string;
  yearVolume: string;
}

export interface CitationCategory {
  key: CitationCategoryKey;
  items: Citation[];
}

export const PREMIUM_CITATIONS: CitationCategory[] = [
  {
    key: "sleep",
    items: [
      {
        authors: "Oyetakin-White P, Suggs A, Koo B, et al.",
        title: "Does poor sleep quality affect skin ageing?",
        journal: "Clinical and Experimental Dermatology",
        yearVolume: "2015;40(1):17-22.",
      },
      {
        authors: "Kahan V, Andersen ML, Tomimori J, Tufik S.",
        title:
          "Stress, immunity and skin collagen integrity: evidence from animal models and clinical conditions.",
        journal: "Brain, Behavior, and Immunity",
        yearVolume: "2009;23(8):1089-1095.",
      },
    ],
  },
  {
    key: "stress",
    items: [
      {
        authors: "Chen Y, Lyga J.",
        title:
          "Brain-skin connection: stress, inflammation and skin aging.",
        journal: "Inflammation & Allergy - Drug Targets",
        yearVolume: "2014;13(3):177-190.",
      },
      {
        authors: "Slominski A, Wortsman J.",
        title: "Neuroendocrinology of the skin.",
        journal: "Endocrine Reviews",
        yearVolume: "2000;21(5):457-487.",
      },
      {
        authors: "Chiu A, Chon SY, Kimball AB.",
        title:
          "The response of skin disease to stress: changes in the severity of acne vulgaris as affected by examination stress.",
        journal: "Archives of Dermatology",
        yearVolume: "2003;139(7):897-900.",
      },
    ],
  },
  {
    key: "gut",
    items: [
      {
        authors: "Salem I, Ramser A, Isham N, Ghannoum MA.",
        title:
          "The gut microbiome as a major regulator of the gut-skin axis.",
        journal: "Frontiers in Microbiology",
        yearVolume: "2018;9:1459.",
      },
      {
        authors: "Bowe WP, Logan AC.",
        title:
          "Acne vulgaris, probiotics and the gut-brain-skin axis – back to the future?",
        journal: "Gut Pathogens",
        yearVolume: "2011;3(1):1.",
      },
      {
        authors: "Sinha S, Lin G, Ferenczi K.",
        title: "The skin microbiome and the gut-skin axis.",
        journal: "Clinics in Dermatology",
        yearVolume: "2021;39(5):829-839.",
      },
    ],
  },
  {
    key: "ecs",
    items: [
      {
        authors: "Bíró T, Tóth BI, Haskó G, Paus R, Pacher P.",
        title:
          "The endocannabinoid system of the skin in health and disease: novel perspectives and therapeutic opportunities.",
        journal: "Trends in Pharmacological Sciences",
        yearVolume: "2009;30(8):411-420.",
      },
      {
        authors: "Tóth KF, Ádám D, Bíró T, Oláh A.",
        title:
          "Cannabinoid signaling in the skin: therapeutic potential of the C(ut)annabinoid system.",
        journal: "Molecules",
        yearVolume: "2019;24(5):918.",
      },
      {
        authors: "Mounessa JS, Siegel JA, Dunnick CA, Dellavalle RP.",
        title: "The role of cannabinoids in dermatology.",
        journal: "Journal of the American Academy of Dermatology",
        yearVolume: "2017;77(1):188-190.",
      },
    ],
  },
  {
    key: "omega",
    items: [
      {
        authors: "Pilkington SM, Watson REB, Nicolaou A, Rhodes LE.",
        title:
          "Omega-3 polyunsaturated fatty acids: photoprotective macronutrients.",
        journal: "Experimental Dermatology",
        yearVolume: "2011;20(7):537-543.",
      },
      {
        authors:
          "Balić A, Vlašić D, Žužul K, Marinović B, Bukvić Mokos Z.",
        title:
          "Omega-3 versus omega-6 polyunsaturated fatty acids in the prevention and treatment of inflammatory skin diseases.",
        journal: "International Journal of Molecular Sciences",
        yearVolume: "2020;21(3):741.",
      },
    ],
  },
  {
    key: "antioxidants",
    items: [
      {
        authors: "Pullar JM, Carr AC, Vissers MCM.",
        title: "The roles of vitamin C in skin health.",
        journal: "Nutrients",
        yearVolume: "2017;9(8):866.",
      },
      {
        authors: "Katiyar SK.",
        title:
          "Green tea prevents non-melanoma skin cancer by enhancing DNA repair.",
        journal: "Archives of Biochemistry and Biophysics",
        yearVolume: "2011;508(2):152-158.",
      },
    ],
  },
  {
    key: "magnesium",
    items: [
      {
        authors: "Abbasi B, Kimiagar M, Sadeghniiat K, et al.",
        title:
          "The effect of magnesium supplementation on primary insomnia in elderly: a double-blind placebo-controlled clinical trial.",
        journal: "Journal of Research in Medical Sciences",
        yearVolume: "2012;17(12):1161-1169.",
      },
    ],
  },
  {
    key: "probiotics",
    items: [
      {
        authors: "Kober MM, Bowe WP.",
        title:
          "The effect of probiotics on immune regulation, acne, and photoaging.",
        journal: "International Journal of Women's Dermatology",
        yearVolume: "2015;1(2):85-89.",
      },
      {
        authors: "Lee YB, Byun EJ, Kim HS.",
        title:
          "Potential role of the microbiome in acne: a comprehensive review.",
        journal: "Journal of Clinical Medicine",
        yearVolume: "2019;8(7):987.",
      },
    ],
  },
  {
    key: "environment",
    items: [
      {
        authors: "Krutmann J, Bouloc A, Sore G, Bernard BA, Passeron T.",
        title: "The skin aging exposome.",
        journal: "Journal of Dermatological Science",
        yearVolume: "2017;85(3):152-161.",
      },
      {
        authors: "Vierkötter A, Schikowski T, Ranft U, et al.",
        title: "Airborne particle exposure and extrinsic skin aging.",
        journal: "Journal of Investigative Dermatology",
        yearVolume: "2010;130(12):2719-2726.",
      },
      {
        authors: "Liebel F, Kaur S, Ruvolo E, Kollias N, Southall MD.",
        title:
          "Irradiation of skin with visible light induces reactive oxygen species and matrix-degrading enzymes.",
        journal: "Journal of Investigative Dermatology",
        yearVolume: "2012;132(7):1901-1907.",
      },
    ],
  },
  {
    key: "barrier",
    items: [
      {
        authors: "Madison KC.",
        title:
          "Barrier function of the skin: 'la raison d'être' of the epidermis.",
        journal: "Journal of Investigative Dermatology",
        yearVolume: "2003;121(2):231-241.",
      },
    ],
  },
  {
    key: "diet",
    items: [
      {
        authors: "Melnik BC.",
        title:
          "Linking diet to acne metabolomics, inflammation, and comedogenesis: an update.",
        journal: "Clinical, Cosmetic and Investigational Dermatology",
        yearVolume: "2015;8:371-388.",
      },
    ],
  },
  {
    key: "psychology",
    items: [
      {
        authors: "Hunter HJA, Momen SE, Kleyn CE.",
        title:
          "The impact of psychosocial stress on healthy skin.",
        journal: "Clinical and Experimental Dermatology",
        yearVolume: "2015;40(5):540-546.",
      },
    ],
  },
];

/**
 * Returnerar totalt antal referenser så vi vet hur många nummer
 * som behövs ([1] - [N]).
 */
export function totalCitationCount(): number {
  return PREMIUM_CITATIONS.reduce((acc, cat) => acc + cat.items.length, 0);
}
