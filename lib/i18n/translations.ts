import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";

export const translations = {
  en,
  es,
  fr,
} as const;

export type Language = keyof typeof translations;
export type TranslationKeys = typeof en;

export const languages: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "US" },
  { code: "es", label: "Español", flag: "ES" },
  { code: "fr", label: "Français", flag: "FR" },
];
