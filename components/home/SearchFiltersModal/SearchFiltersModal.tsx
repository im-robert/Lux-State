"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface SearchFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchFiltersModal({ isOpen, onClose }: SearchFiltersModalProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [location, setLocation] = useState(searchParams.get("q") || "");
  const [minPrice, setMinPrice] = useState(parseInt(searchParams.get("minPrice") || "0"));
  const [maxPrice, setMaxPrice] = useState(parseInt(searchParams.get("maxPrice") || "10000000"));
  const [propertyType, setPropertyType] = useState(searchParams.get("type") || t("filters.anyType"));
  const [bedrooms, setBedrooms] = useState(parseInt(searchParams.get("beds") || "0"));
  const [bathrooms, setBathrooms] = useState(parseInt(searchParams.get("baths") || "0"));
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    searchParams.get("amenities")?.split(",") || []
  );

  const minLimit = 0;
  const maxLimit = 10000000;
  const step = 50000;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Sync state with search params when modal opens
      setLocation(searchParams.get("q") || "");
      setMinPrice(parseInt(searchParams.get("minPrice") || "0"));
      setMaxPrice(parseInt(searchParams.get("maxPrice") || "10000000"));
      setPropertyType(searchParams.get("type") || t("filters.anyType"));
      setBedrooms(parseInt(searchParams.get("beds") || "0"));
      setBathrooms(parseInt(searchParams.get("baths") || "0"));
      setSelectedAmenities(searchParams.get("amenities")?.split(",") || []);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, searchParams, t]);


  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (location.trim()) params.set("q", location.trim());
    else params.delete("q");

    if (minPrice > minLimit) params.set("minPrice", minPrice.toString());
    else params.delete("minPrice");

    if (maxPrice < maxLimit) params.set("maxPrice", maxPrice.toString());
    else params.delete("maxPrice");

    if (propertyType && propertyType !== t("filters.anyType")) params.set("type", propertyType);
    else params.delete("type");

    if (bedrooms > 0) params.set("beds", bedrooms.toString());
    else params.delete("beds");

    if (bathrooms > 0) params.set("baths", bathrooms.toString());
    else params.delete("baths");

    if (selectedAmenities.length > 0) params.set("amenities", selectedAmenities.join(","));
    else params.delete("amenities");

    params.set("page", "1");
    router.push(`/?${params.toString()}`);
    onClose();
  };

  const handleClearFilters = () => {
    setLocation("");
    setMinPrice(minLimit);
    setMaxPrice(maxLimit);
    setPropertyType(t("filters.anyType"));
    setBedrooms(0);
    setBathrooms(0);
    setSelectedAmenities([]);
  };

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `$${(price / 1000).toFixed(0)}K`;
    return `$${price}`;
  };

  const AMENITIES_LIST = [
    { id: "pool", icon: "pool", label: t("filters.pool") },
    { id: "gym", icon: "fitness_center", label: t("filters.gym") },
    { id: "parking", icon: "local_parking", label: t("filters.parking") },
    { id: "ac", icon: "ac_unit", label: t("filters.ac") },
    { id: "wifi", icon: "wifi", label: t("filters.wifi") },
    { id: "patio", icon: "deck", label: t("filters.patio") },
  ];


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] transition-opacity" 
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: "-45%", x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, y: "-45%", x: "-50%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 z-[110] w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <header className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-30">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{t("filters.title")}</h1>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
              >
                <span className="material-icons">close</span>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
          <section>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{t("filters.location")}</label>
            <div className="relative group">
              <span className="material-icons absolute left-4 top-3.5 text-gray-400 group-focus-within:text-mosque transition-colors">location_on</span>
              <input 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-mosque focus:bg-white transition-all shadow-sm outline-none" 
                placeholder={t("filters.locationPlaceholder")} 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </section>

          <section>
            <div className="flex justify-between items-end mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("filters.priceRange")}</label>
              <span className="text-sm font-medium text-mosque">{formatPrice(minPrice)} – {formatPrice(maxPrice)}</span>
            </div>
            
            <div className="relative h-12 flex items-center mb-6 px-2">
              <div className="absolute w-full h-1 bg-gray-200 rounded-full">
                <div 
                  className="absolute h-full bg-mosque rounded-full"
                  style={{ 
                    left: `${(minPrice / maxLimit) * 100}%`, 
                    right: `${100 - (maxPrice / maxLimit) * 100}%` 
                  }}
                ></div>
              </div>
              
              <input
                type="range"
                min={minLimit}
                max={maxLimit}
                step={step}
                value={minPrice}
                onChange={(e) => setMinPrice(Math.min(parseInt(e.target.value), maxPrice - step))}
                className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-mosque [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
              />
              
              <input
                type="range"
                min={minLimit}
                max={maxLimit}
                step={step}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Math.max(parseInt(e.target.value), minPrice + step))}
                className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-mosque [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">{t("filters.minPrice")}</label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1">$</span>
                  <input 
                    className="w-full bg-transparent border-0 p-0 text-gray-900 font-medium focus:ring-0 text-sm outline-none" 
                    type="number" 
                    value={minPrice} 
                    onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)} 
                  />
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">{t("filters.maxPrice")}</label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1">$</span>
                  <input 
                    className="w-full bg-transparent border-0 p-0 text-gray-900 font-medium focus:ring-0 text-sm outline-none" 
                    type="number" 
                    value={maxPrice} 
                    onChange={(e) => setMaxPrice(parseInt(e.target.value) || 0)} 
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("filters.propertyType")}</label>
              <div className="relative">
                <select 
                  className="w-full bg-gray-50 border-0 rounded-lg py-3 pl-4 pr-10 text-gray-900 appearance-none focus:ring-2 focus:ring-mosque cursor-pointer outline-none"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option>{t("filters.anyType")}</option>
                  <option value="House">{t("hero.types.house")}</option>
                  <option value="Apartment">{t("hero.types.apartment")}</option>
                  <option value="Villa">{t("hero.types.villa")}</option>
                  <option value="Penthouse">{t("hero.types.penthouse")}</option>
                </select>
                <span className="material-icons absolute right-3 top-3 text-gray-400 pointer-events-none">expand_more</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">{t("filters.bedrooms")}</span>
                <div className="flex items-center space-x-3 bg-gray-50 rounded-full p-1">
                  <button 
                    onClick={() => setBedrooms(Math.max(0, bedrooms - 1))}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-mosque transition-colors"
                  >
                    <span className="material-icons text-base">remove</span>
                  </button>
                  <span className="text-sm font-semibold w-4 text-center">{bedrooms}+</span>
                  <button 
                    onClick={() => setBedrooms(bedrooms + 1)}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                  >
                    <span className="material-icons text-base">add</span>
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">{t("filters.bathrooms")}</span>
                <div className="flex items-center space-x-3 bg-gray-50 rounded-full p-1">
                  <button 
                    onClick={() => setBathrooms(Math.max(0, bathrooms - 1))}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-mosque transition-colors"
                  >
                    <span className="material-icons text-base">remove</span>
                  </button>
                  <span className="text-sm font-semibold w-4 text-center">{bathrooms}+</span>
                  <button 
                    onClick={() => setBathrooms(bathrooms + 1)}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                  >
                    <span className="material-icons text-base">add</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">{t("filters.amenities")}</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AMENITIES_LIST.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity.id);
                return (
                  <motion.button
                    key={amenity.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`relative px-4 py-3 rounded-lg border font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                      isSelected 
                        ? "border-mosque bg-mosque/5 text-mosque" 
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <span className={`material-icons text-lg ${isSelected ? "text-mosque" : "text-gray-400"}`}>
                      {amenity.icon}
                    </span> 
                    {amenity.label}
                    {isSelected && (
                      <motion.div 
                        layoutId="active-dot"
                        className="absolute top-2 right-2 w-2 h-2 bg-mosque rounded-full"
                      ></motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </section>
        </div>

        <footer className="bg-white border-t border-gray-100 px-8 py-6 sticky bottom-0 z-30 flex items-center justify-between">
          <button 
            onClick={handleClearFilters}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors underline decoration-gray-300 underline-offset-4"
          >
            {t("filters.clearAll")}
          </button>
          <button 
            className="bg-mosque hover:bg-mosque/90 text-white px-8 py-3 rounded-lg font-medium shadow-lg shadow-mosque/30 transition-all hover:shadow-mosque/40 flex items-center gap-2 transform active:scale-95"
            onClick={handleApplyFilters}
          >
            {t("filters.showResults")}
            <span className="material-icons text-sm">arrow_forward</span>
          </button>
        </footer>
          </motion.div>
        </>
      )}
    </AnimatePresence>

  );
}

