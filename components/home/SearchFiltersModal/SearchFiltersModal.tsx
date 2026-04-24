"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchFiltersModal({ isOpen, onClose }: SearchFiltersModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [location, setLocation] = useState(searchParams.get("q") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "1200000");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "4500000");
  const [propertyType, setPropertyType] = useState(searchParams.get("type") || "Any Type");
  const [bedrooms, setBedrooms] = useState(parseInt(searchParams.get("beds") || "3"));
  const [bathrooms, setBathrooms] = useState(parseInt(searchParams.get("baths") || "2"));

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (location.trim()) params.set("q", location.trim());
    else params.delete("q");

    if (minPrice) params.set("minPrice", minPrice.replace(/\D/g, ""));
    else params.delete("minPrice");

    if (maxPrice) params.set("maxPrice", maxPrice.replace(/\D/g, ""));
    else params.delete("maxPrice");

    if (propertyType && propertyType !== "Any Type") params.set("type", propertyType);
    else params.delete("type");

    if (bedrooms > 0) params.set("beds", bedrooms.toString());
    else params.delete("beds");

    if (bathrooms > 0) params.set("baths", bathrooms.toString());
    else params.delete("baths");

    params.set("page", "1");
    router.push(`/?${params.toString()}`);
    onClose();
  };

  const handleClearFilters = () => {
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setPropertyType("Any Type");
    setBedrooms(0);
    setBathrooms(0);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] transition-opacity" 
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <header className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-30">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Filters</h1>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <span className="material-icons">close</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-10">
          <section>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Location</label>
            <div className="relative group">
              <span className="material-icons absolute left-4 top-3.5 text-gray-400 group-focus-within:text-mosque transition-colors">location_on</span>
              <input 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-mosque focus:bg-white transition-all shadow-sm outline-none" 
                placeholder="City, neighborhood, or address" 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </section>

          <section>
            <div className="flex justify-between items-end mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Price Range</label>
              <span className="text-sm font-medium text-mosque">$1.2M – $4.5M</span>
            </div>
            <div className="relative h-12 flex items-center mb-6 px-2">
              <div className="absolute w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-mosque w-1/3 ml-[20%]"></div>
              </div>
              <div className="absolute left-[20%] w-6 h-6 bg-white border-2 border-mosque rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform -ml-3 z-10"></div>
              <div className="absolute left-[53%] w-6 h-6 bg-white border-2 border-mosque rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform -ml-3 z-10"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">Min Price</label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1">$</span>
                  <input 
                    className="w-full bg-transparent border-0 p-0 text-gray-900 font-medium focus:ring-0 text-sm outline-none" 
                    type="text" 
                    value={minPrice} 
                    onChange={(e) => setMinPrice(e.target.value)} 
                  />
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">Max Price</label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1">$</span>
                  <input 
                    className="w-full bg-transparent border-0 p-0 text-gray-900 font-medium focus:ring-0 text-sm outline-none" 
                    type="text" 
                    value={maxPrice} 
                    onChange={(e) => setMaxPrice(e.target.value)} 
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Property Type</label>
              <div className="relative">
                <select 
                  className="w-full bg-gray-50 border-0 rounded-lg py-3 pl-4 pr-10 text-gray-900 appearance-none focus:ring-2 focus:ring-mosque cursor-pointer outline-none"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option>Any Type</option>
                  <option>House</option>
                  <option>Apartment</option>
                  <option>Condo</option>
                  <option>Townhouse</option>
                </select>
                <span className="material-icons absolute right-3 top-3 text-gray-400 pointer-events-none">expand_more</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">Bedrooms</span>
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
                <span className="text-sm font-medium text-gray-900">Bathrooms</span>
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
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Amenities &amp; Features</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label className="cursor-pointer group relative">
                <input defaultChecked className="peer sr-only" type="checkbox" />
                <div className="h-full px-4 py-3 rounded-lg border border-mosque bg-mosque/5 text-mosque font-medium text-sm flex items-center justify-center gap-2 transition-all peer-checked:bg-mosque/10 peer-checked:border-mosque peer-checked:text-mosque hover:bg-mosque/10">
                  <span className="material-icons text-lg">pool</span> Swimming Pool
                </div>
                <div className="absolute top-2 right-2 w-2 h-2 bg-mosque rounded-full opacity-100 transition-opacity"></div>
              </label>

              <label className="cursor-pointer group relative">
                <input className="peer sr-only" type="checkbox" />
                <div className="h-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm flex items-center justify-center gap-2 transition-all hover:border-gray-300 peer-checked:border-mosque peer-checked:bg-mosque/5 peer-checked:text-mosque">
                  <span className="material-icons text-lg text-gray-400 group-hover:text-gray-500 peer-checked:text-mosque">fitness_center</span> Gym
                </div>
              </label>

              <label className="cursor-pointer group relative">
                <input className="peer sr-only" type="checkbox" />
                <div className="h-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm flex items-center justify-center gap-2 transition-all hover:border-gray-300 peer-checked:border-mosque peer-checked:bg-mosque/5 peer-checked:text-mosque">
                  <span className="material-icons text-lg text-gray-400 group-hover:text-gray-500 peer-checked:text-mosque">local_parking</span> Parking
                </div>
              </label>

              <label className="cursor-pointer group relative">
                <input className="peer sr-only" type="checkbox" />
                <div className="h-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm flex items-center justify-center gap-2 transition-all hover:border-gray-300 peer-checked:border-mosque peer-checked:bg-mosque/5 peer-checked:text-mosque">
                  <span className="material-icons text-lg text-gray-400 group-hover:text-gray-500 peer-checked:text-mosque">ac_unit</span> Air Conditioning
                </div>
              </label>

              <label className="cursor-pointer group relative">
                <input defaultChecked className="peer sr-only" type="checkbox" />
                <div className="h-full px-4 py-3 rounded-lg border border-mosque bg-mosque/5 text-mosque font-medium text-sm flex items-center justify-center gap-2 transition-all peer-checked:bg-mosque/10 peer-checked:border-mosque peer-checked:text-mosque hover:bg-mosque/10">
                  <span className="material-icons text-lg">wifi</span> High-speed Wifi
                </div>
                <div className="absolute top-2 right-2 w-2 h-2 bg-mosque rounded-full opacity-100 transition-opacity"></div>
              </label>

              <label className="cursor-pointer group relative">
                <input className="peer sr-only" type="checkbox" />
                <div className="h-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm flex items-center justify-center gap-2 transition-all hover:border-gray-300 peer-checked:border-mosque peer-checked:bg-mosque/5 peer-checked:text-mosque">
                  <span className="material-icons text-lg text-gray-400 group-hover:text-gray-500 peer-checked:text-mosque">deck</span> Patio / Terrace
                </div>
              </label>
            </div>
          </section>
        </div>

        <footer className="bg-white border-t border-gray-100 px-8 py-6 sticky bottom-0 z-30 flex items-center justify-between">
          <button 
            onClick={handleClearFilters}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors underline decoration-gray-300 underline-offset-4"
          >
            Clear all filters
          </button>
          <button 
            className="bg-mosque hover:bg-mosque/90 text-white px-8 py-3 rounded-lg font-medium shadow-lg shadow-mosque/30 transition-all hover:shadow-mosque/40 flex items-center gap-2 transform active:scale-95"
            onClick={handleApplyFilters}
          >
            Show Results
            <span className="material-icons text-sm">arrow_forward</span>
          </button>
        </footer>
      </div>
    </>
  );
}
