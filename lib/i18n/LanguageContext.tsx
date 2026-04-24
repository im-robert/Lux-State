"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations, TranslationKeys } from "./translations";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ 
  children, 
  initialLanguage = "en" 
}: { 
  children: React.ReactNode;
  initialLanguage?: Language;
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  useEffect(() => {
    // Sync html lang on mount
    document.documentElement.lang = language;
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // Save to cookie (valid for 1 year)
    document.cookie = `language=${lang}; path=/; max-age=${365 * 24 * 60 * 60}`;
    // Update html lang attribute
    document.documentElement.lang = lang;
  };

  const t = (path: string): string => {
    const keys = path.split(".");
    let current: any = translations[language];

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        return path; // Return key if translation not found
      }
    }

    return typeof current === "string" ? current : path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
