"use client";

import React, { useState } from "react";
import { Property } from "../../types/property";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface PropertyGalleryProps {
  property: Property;
  gallery: string[];
}

export function PropertyGallery({ property, gallery }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
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

  return (
    <div className="lg:col-span-8 space-y-4">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-sm group">
        <img 
          src={gallery[activeIndex] || ""} 
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {property.is_featured && (
            <span className="bg-mosque text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              {t("property.premium")}
            </span>
          )}
          {property.badge && (
            <span className="bg-white/90 backdrop-blur text-nordic text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              {getTranslatedBadge(property.badge)}
            </span>
          )}
        </div>
        <button className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-nordic px-4 py-2 rounded-lg text-xs font-bold shadow-lg backdrop-blur transition-all flex items-center gap-2 uppercase tracking-wide">
          <span className="material-icons text-sm">grid_view</span>
          {t("property.viewAllPhotos")}
        </button>
      </div>
      
      {/* Gallery Thumbnail Row */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x">
        {gallery.map((img, i) => (
          <div 
            key={i} 
            onClick={() => setActiveIndex(i)}
            className={`flex-none w-48 aspect-[4/3] rounded-lg overflow-hidden cursor-pointer snap-start transition-opacity ${
              i === activeIndex 
                ? 'ring-2 ring-mosque ring-offset-2 ring-offset-clear-day opacity-100' 
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
