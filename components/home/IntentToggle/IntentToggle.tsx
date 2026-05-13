"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function IntentToggle() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentIntent = searchParams.get("intent") || "all";

  const handleIntentChange = (intent: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (intent === "all") {
      params.delete("intent");
    } else {
      params.set("intent", intent);
    }
    params.set("page", "1"); // Reset to first page
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const options = [
    { id: "all", label: t("common.all") },
    { id: "sale", label: t("nav.buy") },
    { id: "rent", label: t("nav.rent") },
  ];

  return (
    <div className="flex bg-white p-1 rounded-lg border border-gray-100 shadow-sm">
      {options.map((option) => {
        const isActive = currentIntent === option.id;
        return (
          <button
            key={option.id}
            onClick={() => handleIntentChange(option.id)}
            className={`px-6 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-nordic-dark text-white shadow-sm"
                : "text-nordic-muted hover:text-nordic-dark hover:bg-gray-50"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
