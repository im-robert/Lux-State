"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ProfileHeader({ titleKey, icon }: { titleKey: string, icon: string }) {
  const { t } = useLanguage();
  
  return (
    <h2 className="text-2xl font-black text-nordic-dark dark:text-white mb-8 flex items-center gap-3">
      <span className="material-symbols-rounded text-mosque">{icon}</span>
      {t(titleKey)}
    </h2>
  );
}
