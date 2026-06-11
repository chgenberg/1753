// Rot-404 för URL:er som inte matchar någon route alls (t.ex. /en/finns-inte).
// Utan denna renderar Next sin inbyggda 404 server-side medan klienten
// hydrerar annat innehåll, vilket gav React hydration-fel #418.
export { default } from "./[locale]/not-found";
