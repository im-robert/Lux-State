"use client";

import React, { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function AdminPropertiesControls({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const [, startTransition] = useTransition();

  const push = (updates: Record<string, string>) => {
    const params = new URLSearchParams(sp.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v); else params.delete(k);
    });
    params.set("page", "1"); // reset page on filter/search change
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  };

  const currentQ = sp.get("q") ?? "";
  const currentLimit = sp.get("limit") ?? "8";

  return (
    <>
      {/* Controls row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-icons text-gray-400 dark:text-gray-500 text-[18px]">search</span>
          <input
            type="text"
            defaultValue={currentQ}
            placeholder="Search properties by name…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/20 dark:border-primary/30 bg-white dark:bg-[#152e2a] text-nordic dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-sm shadow-sm"
            onChange={e => {
              const v = e.target.value;
              // Debounce via timeout
              const tid = setTimeout(() => push({ q: v }), 400);
              return () => clearTimeout(tid);
            }}
          />
        </div>

        {/* Per-page selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Per page:</span>
          <select
            value={currentLimit}
            onChange={e => push({ limit: e.target.value })}
            className="px-3 py-2.5 rounded-xl border border-primary/20 dark:border-primary/30 bg-white dark:bg-[#152e2a] text-nordic dark:text-white focus:ring-1 focus:ring-primary outline-none text-sm shadow-sm cursor-pointer"
          >
            {["5", "8", "10", "20", "50"].map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        {/* Filter button */}
        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary/20 dark:border-primary/30 bg-white dark:bg-[#152e2a] text-nordic dark:text-gray-300 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors text-sm font-medium shadow-sm whitespace-nowrap"
        >
          <span className="material-icons text-[18px] text-primary">tune</span>
          Filters
          {(sp.get("type") || sp.get("badge") || sp.get("featured") || sp.get("active") || sp.get("min_beds") || sp.get("min_price") || sp.get("max_price")) && (
            <span className="w-2 h-2 rounded-full bg-primary" />
          )}
        </button>
      </div>

      {/* Filter Modal */}
      {filterOpen && (
        <FilterModal
          searchParams={sp}
          onClose={() => setFilterOpen(false)}
          onApply={(filters) => { push(filters); setFilterOpen(false); }}
        />
      )}
    </>
  );
}

// ─── Filter Modal ────────────────────────────────────────────────────────────

interface FilterModalProps {
  searchParams: URLSearchParams;
  onClose: () => void;
  onApply: (filters: Record<string, string>) => void;
}

function FilterModal({ searchParams: sp, onClose, onApply }: FilterModalProps) {
  const [type, setType] = useState(sp.get("type") ?? "");
  const [badge, setBadge] = useState(sp.get("badge") ?? "");
  const [featured, setFeatured] = useState(sp.get("featured") ?? "");
  const [active, setActive] = useState(sp.get("active") ?? "");
  const [minBeds, setMinBeds] = useState(parseInt(sp.get("min_beds") ?? "0") || 0);
  const [minBaths, setMinBaths] = useState(parseInt(sp.get("min_baths") ?? "0") || 0);
  const [minPrice, setMinPrice] = useState(sp.get("min_price") ?? "");
  const [maxPrice, setMaxPrice] = useState(sp.get("max_price") ?? "");

  const Stepper = ({
    label, icon, value, onChange
  }: { label: string; icon: string; value: number; onChange: (v: number) => void }) => (
    <div>
      <label className={lbl}>{label}</label>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))}
          className="w-9 h-9 rounded-xl border border-primary/20 dark:border-primary/30 bg-white dark:bg-[#0f2320] text-nordic dark:text-white flex items-center justify-center hover:bg-primary/5 transition-colors font-bold text-lg leading-none">
          −
        </button>
        <div className="flex-1 text-center">
          {value === 0 ? (
            <span className="text-sm text-gray-400 dark:text-gray-500 font-medium">Any</span>
          ) : (
            <span className="text-sm font-bold text-nordic dark:text-white">
              <span className="material-icons text-primary text-[14px] align-middle mr-0.5">{icon}</span>
              {value}+
            </span>
          )}
        </div>
        <button type="button" onClick={() => onChange(Math.min(10, value + 1))}
          className="w-9 h-9 rounded-xl border border-primary/20 dark:border-primary/30 bg-white dark:bg-[#0f2320] text-nordic dark:text-white flex items-center justify-center hover:bg-primary/5 transition-colors font-bold text-lg leading-none">
          +
        </button>
      </div>
    </div>
  );

  const sel = "w-full px-3 py-2.5 rounded-xl border border-primary/20 dark:border-primary/30 bg-white dark:bg-[#0f2320] text-nordic dark:text-white outline-none focus:ring-1 focus:ring-primary text-sm cursor-pointer";
  const inp = "w-full px-3 py-2.5 rounded-xl border border-primary/20 dark:border-primary/30 bg-white dark:bg-[#0f2320] text-nordic dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-1 focus:ring-primary text-sm";
  const lbl = "block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5";

  const handleApply = () => {
    onApply({
      type, badge, featured, active,
      min_beds: minBeds > 0 ? String(minBeds) : "",
      min_baths: minBaths > 0 ? String(minBaths) : "",
      min_price: minPrice,
      max_price: maxPrice,
    });
  };

  const handleClear = () => {
    setType(""); setBadge(""); setFeatured(""); setActive(""); setMinBeds(0); setMinBaths(0); setMinPrice(""); setMaxPrice("");
    onApply({ type: "", badge: "", featured: "", active: "", min_beds: "", min_baths: "", min_price: "", max_price: "" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-nordic/60 dark:bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white dark:bg-[#152e2a] rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-primary/10 dark:border-primary/20">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#152e2a] px-6 py-5 border-b border-primary/10 dark:border-primary/20 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-icons text-lg">tune</span>
            </div>
            <h2 className="text-lg font-bold text-nordic dark:text-white">Filter Properties</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-nordic dark:hover:text-white hover:bg-primary/5 transition-colors">
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Type & Badge row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Listing Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className={sel}>
                <option value="">All Types</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            <div>
              <label className={lbl}>Badge / Status</label>
              <select value={badge} onChange={e => setBadge(e.target.value)} className={sel}>
                <option value="">Any Status</option>
                <option value="hot">Hot</option>
                <option value="premium">Premium</option>
                <option value="new">New</option>
                <option value="sold">Sold</option>
                <option value="reduced">Price Reduced</option>
              </select>
            </div>
          </div>

          {/* Featured */}
          <div>
            <label className={lbl}>Featured</label>
            <div className="flex gap-3">
              {[["", "All"], ["true", "Featured only"], ["false", "Non-featured"]].map(([v, l]) => (
                <button key={v} type="button" onClick={() => setFeatured(v)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${featured === v ? "bg-primary text-white border-primary" : "border-primary/20 dark:border-primary/30 text-nordic dark:text-gray-300 hover:bg-primary/5"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Visibility (Active/Inactive) */}
          <div>
            <label className={lbl}>Visibility</label>
            <div className="flex gap-3">
              {[["", "All"], ["true", "Active only"], ["false", "Inactive only"]].map(([v, l]) => (
                <button key={v} type="button" onClick={() => setActive(v)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${
                    active === v
                      ? v === "false"
                        ? "bg-gray-500 text-white border-gray-500"
                        : "bg-primary text-white border-primary"
                      : "border-primary/20 dark:border-primary/30 text-nordic dark:text-gray-300 hover:bg-primary/5"
                  }`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div>
            <label className={lbl}>Price Range ($)</label>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" placeholder="Min price" value={minPrice} onChange={e => setMinPrice(e.target.value)} className={inp} />
              <input type="number" placeholder="Max price" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className={inp} />
            </div>
          </div>

          {/* Beds & Baths steppers */}
          <div className="grid grid-cols-2 gap-6">
            <Stepper label="Min. Bedrooms" icon="bed" value={minBeds} onChange={setMinBeds} />
            <Stepper label="Min. Bathrooms" icon="shower" value={minBaths} onChange={setMinBaths} />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-[#152e2a] px-6 py-4 border-t border-primary/10 dark:border-primary/20 flex gap-3">
          <button onClick={handleClear}
            className="flex-1 py-2.5 rounded-xl border border-primary/20 dark:border-primary/30 text-nordic dark:text-gray-300 hover:bg-primary/5 text-sm font-medium transition-colors">
            Clear All
          </button>
          <button onClick={handleApply}
            className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-medium shadow-md shadow-primary/20 transition-all">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
