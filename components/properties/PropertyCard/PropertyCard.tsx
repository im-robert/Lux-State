"use client";

import React from "react";
import Link from "next/link";
import { Property } from "../../../types/property";
import { useLanguage } from "@/lib/i18n/LanguageContext";

import { useFavorites } from "@/lib/context/FavoritesContext";

export function PropertyCard({ property }: { property: Property }) {
  const { t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isSale = property.type === "sale";
  const favorited = isFavorite(property.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id);
  };

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
    <Link href={`/properties/${property.slug}`} className="block h-full">
      <article className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 group cursor-pointer h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
        <img
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={property.gallery_images?.[0] || ""}
        />
        
        {/* Top-left badge from image */}
        {property.badge && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
            <span className="text-[10px] font-bold text-nordic-dark uppercase tracking-wider">
              {getTranslatedBadge(property.badge)}
            </span>
          </div>
        )}

        <button 
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full transition-all flex items-center justify-center shadow-md z-10 ${
            favorited 
              ? "bg-mosque text-white scale-110" 
              : "bg-white/90 backdrop-blur-sm text-nordic-dark hover:bg-mosque hover:text-white"
          }`}
        >
          <span className="material-icons text-lg">{favorited ? "favorite" : "favorite_border"}</span>
        </button>
        
        <div className={`absolute bottom-3 left-3 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm ${isSale ? 'bg-nordic-dark/90' : 'bg-mosque/90'}`}>
          {isSale ? t("property.forSale") : t("property.forRent")}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="font-bold text-lg text-nordic-dark">
            ${property.price.toLocaleString()}
            {property.price_suffix && (
              <span className="text-sm font-normal text-nordic-muted ml-1">{getTranslatedSuffix(property.price_suffix)}</span>
            )}
          </h3>
        </div>

        <h4 className="text-nordic-dark font-medium truncate mb-1">{property.title}</h4>
        <p className="text-nordic-muted text-xs mb-4">{property.location}</p>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">king_bed</span> 
            <span>{property.beds} {t("property.bedsShort")}</span>
          </div>
          <div className="flex items-center gap-1.5 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">bathtub</span> 
            <span>{property.baths} {t("property.bathsShort")}</span>
          </div>
          <div className="flex items-center gap-1.5 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">square_foot</span> 
            <span>{property.area}m²</span>
          </div>
        </div>
      </div>
    </article>
    </Link>
  );
}
