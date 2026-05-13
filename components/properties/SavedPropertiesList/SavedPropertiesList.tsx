"use client";

import React from "react";
import { Property } from "@/types/property";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { useFavorites } from "@/lib/context/FavoritesContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Link from "next/link";

export function SavedPropertiesList({ initialProperties }: { initialProperties: Property[] }) {
  const { favorites, loading } = useFavorites();
  const { t } = useLanguage();

  // Filter properties to only show those that are still in favorites
  // We use initialProperties as a base to avoid re-fetching everything
  const displayProperties = initialProperties.filter((p) => favorites.includes(p.id));

  if (loading && initialProperties.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mosque"></div>
      </div>
    );
  }

  if (displayProperties.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-16 text-center shadow-soft border border-nordic-dark/5">
        <div className="w-20 h-20 bg-mosque/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-icons text-mosque text-4xl">favorite_border</span>
        </div>
        <h2 className="text-xl font-bold text-nordic-dark mb-2">{t("property.noSavedTitle")}</h2>
        <p className="text-nordic-muted mb-8 max-w-md mx-auto">
          {t("property.noSavedDesc")}
        </p>
        <Link 
          href="/"
          className="inline-flex items-center gap-2 bg-nordic-dark text-white px-8 py-3 rounded-xl font-semibold hover:bg-nordic transition-all"
        >
          <span className="material-icons text-sm">search</span>
          {t("property.browseProperties")}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {displayProperties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
