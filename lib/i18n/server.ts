import { cookies } from "next/headers";
import { Language, translations } from "./translations";

export async function getTranslations() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("language")?.value as Language) || "en";
  const dictionary = translations[lang] || translations.en;

  const t = (path: string): string => {
    const keys = path.split(".");
    let current: any = dictionary;

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        return path;
      }
    }

    return typeof current === "string" ? current : path;
  };

  return { t, lang };
}
