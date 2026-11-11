// Sparar kassans kunduppgifter lokalt i webbläsaren när kunden skickas till
// betalningen. Blir betalningen inte klar (Swish som inte öppnas, nekat kort,
// stängd flik) slipper kunden fylla i allt igen. Rensas när köpet är klart.

const KEY = "1753_checkout_form";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export interface SavedCheckoutForm {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  zip: string;
  city: string;
  country: string;
}

const FIELDS: (keyof SavedCheckoutForm)[] = [
  "firstname",
  "lastname",
  "email",
  "phone",
  "address",
  "zip",
  "city",
  "country",
];

export function saveCheckoutForm(form: SavedCheckoutForm): void {
  try {
    const data: Record<string, string> = {};
    for (const f of FIELDS) data[f] = String(form[f] ?? "");
    localStorage.setItem(KEY, JSON.stringify({ savedAt: Date.now(), form: data }));
  } catch {
    /* storage otillgängligt – kunden får fylla i igen, inget går sönder */
  }
}

export function loadCheckoutForm(): SavedCheckoutForm | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { savedAt?: number; form?: Record<string, unknown> };
    if (!parsed?.form || typeof parsed.savedAt !== "number" || Date.now() - parsed.savedAt > MAX_AGE_MS) {
      localStorage.removeItem(KEY);
      return null;
    }
    const out = {} as SavedCheckoutForm;
    for (const f of FIELDS) {
      const v = parsed.form[f];
      out[f] = typeof v === "string" ? v : "";
    }
    return out;
  } catch {
    return null;
  }
}

export function clearCheckoutForm(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* inget att göra */
  }
}
