export type LegalDoc = {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  updated: string;
  sections: { h: string; html: string }[];
};
