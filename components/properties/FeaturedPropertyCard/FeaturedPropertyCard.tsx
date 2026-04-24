"use client";

import React from "react";
import Link from "next/link";
import { Property } from "../../../types/property";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function FeaturedPropertyCard({ property }: { property: Property }) {
  const { t } = useLanguage();

  const getTranslatedBadge = (badge: string | null) => {
    if (!badge) return null;
    const lowerBadge = badge.toLowerCase();
    if (lowerBadge === "exclusive") return t("property.exclusive");
    if (lowerBadge === "new") return t("property.new");
    if (lowerBadge === "hot") return t("property.hot");
    if (lowerBadge === "premium") return t("property.premium");
    if (lowerBadge === "for sale") return t("property.forSale");
    if (lowerBadge === "for rent") return t("property.forRent");
    return badge;
  };

  const getTranslatedSuffix = (suffix: string | null) => {
    if (!suffix) return null;
    const lowerSuffix = suffix.toLowerCase().trim();
    if (lowerSuffix === "/mo" || lowerSuffix === "per month" || lowerSuffix === "/month") return t("property.mo");
    if (lowerSuffix === "/yr" || lowerSuffix === "per year" || lowerSuffix === "/year") return t("property.year");
    return suffix;
  };

  return (
    <Link href={`/properties/${property.slug}`} className="block">
      <div className="group relative rounded-xl overflow-hidden shadow-soft bg-white cursor-pointer h-full">
        <div className="aspect-[16/9] lg:aspect-[4/3] w-full overflow-hidden relative">
        <img
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={property.gallery_images?.[0] || ""}
        />
        {property.badge && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-nordic-dark shadow-sm">
            {getTranslatedBadge(property.badge)}
          </div>
        )}
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-nordic-dark hover:bg-mosque hover:text-white transition-all shadow-md z-10">
          <span className="material-icons text-xl">favorite_border</span>
        </button>
        <div className={`absolute bottom-4 left-4 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10 ${property.type === 'sale' ? 'bg-nordic-dark/90' : 'bg-mosque/90'}`}>
          {property.type === 'sale' ? t("property.forSale") : t("property.forRent")}
        </div>
        <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
      </div>

      <div className="p-6 relative">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-medium text-nordic-dark group-hover:text-mosque transition-colors">{property.title}</h3>
            <p className="text-nordic-muted text-sm flex items-center gap-1 mt-1">
              <span className="material-icons text-sm">place</span> {property.location}
            </p>
          </div>
          <span className="text-xl font-semibold text-mosque">
            ${property.price.toLocaleString()}{getTranslatedSuffix(property.price_suffix)}
          </span>
        </div>

        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-nordic-dark/5">
          <div className="flex items-center gap-2 text-nordic-muted text-sm">
            <span className="material-icons text-lg">king_bed</span> 
            <span>{property.beds} {t("property.bedsShort")}</span>
          </div>
          <div className="flex items-center gap-2 text-nordic-muted text-sm">
            <span className="material-icons text-lg">bathtub</span> 
            <span>{property.baths} {t("property.bathsShort")}</span>
          </div>
          <div className="flex items-center gap-2 text-nordic-muted text-sm">
            <span className="material-icons text-lg">square_foot</span> 
            <span>{property.area.toLocaleString()} m²</span>
          </div>
        </div>
      </div>
    </div>
    </Link>
  );
}
