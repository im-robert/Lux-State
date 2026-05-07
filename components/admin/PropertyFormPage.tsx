"use client";

import React, { useState, useRef, useTransition } from "react";
import Link from "next/link";
import { createProperty, updateProperty, uploadPropertyImages, deletePropertyImage } from "@/lib/actions/properties";
import { Property } from "@/types/property";

const AMENITY_OPTIONS = ["Swimming Pool", "Garden", "Air Conditioning", "Smart Home", "Gym", "Garage", "Elevator", "Security System"];

interface Props { mode: "create" | "edit"; property?: Property; }

export function PropertyFormPage({ mode, property }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [title, setTitle] = useState(property?.title ?? "");
  const [price, setPrice] = useState(property?.price?.toString() ?? "");
  const [priceSuffix, setPriceSuffix] = useState(property?.price_suffix ?? "");
  const [status, setStatus] = useState(property?.badge ?? "");
  const [type, setType] = useState(property?.type ?? "sale");
  const [description, setDescription] = useState(property?.description ?? "");
  const [location, setLocation] = useState(property?.location ?? "");
  const [area, setArea] = useState(property?.area?.toString() ?? "");
  const [yearBuilt, setYearBuilt] = useState(property?.year_built?.toString() ?? "");
  const [beds, setBeds] = useState(property?.beds ?? 0);
  const [baths, setBaths] = useState(property?.baths ?? 0);
  const [parking, setParking] = useState(property?.parking ?? 0);
  const [isFeatured, setIsFeatured] = useState(property?.is_featured ?? false);
  const [amenities, setAmenities] = useState<string[]>(property?.amenities ?? []);
  const [galleryUrls, setGalleryUrls] = useState<string[]>(property?.gallery_images ?? []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingFilesRef = useRef<File[]>([]);
  const latRef = useRef<HTMLInputElement>(null);
  const lngRef = useRef<HTMLInputElement>(null);

  const toggleAmenity = (a: string) =>
    setAmenities(p => p.includes(a) ? p.filter(x => x !== a) : [...p, a]);

  const Counter = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <div className="flex items-center border border-primary/20 dark:border-primary/30 rounded-md overflow-hidden bg-white dark:bg-[#0f2320] shadow-sm">
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))}
        className="w-8 h-8 flex items-center justify-center hover:bg-primary/5 text-nordic dark:text-gray-300 border-r border-primary/10 font-bold">−</button>
      <span className="w-10 text-center text-sm font-medium text-nordic dark:text-white">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)}
        className="w-8 h-8 flex items-center justify-center hover:bg-primary/5 text-nordic dark:text-gray-300 border-l border-primary/10 font-bold">+</button>
    </div>
  );

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || !files.length) return;
    const previews = Array.from(files).map(f => URL.createObjectURL(f));
    pendingFilesRef.current = [...pendingFilesRef.current, ...Array.from(files)];
    setGalleryUrls(p => [...p, ...previews]);
  };

  const removeImage = async (url: string, idx: number) => {
    if (url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
      const blobIdx = idx - galleryUrls.filter(u => !u.startsWith("blob:")).length;
      pendingFilesRef.current = pendingFilesRef.current.filter((_, i) => i !== blobIdx);
      setGalleryUrls(p => p.filter((_, i) => i !== idx));
      return;
    }
    await deletePropertyImage(url);
    setGalleryUrls(p => p.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      let finalUrls = galleryUrls.filter(u => !u.startsWith("blob:"));
      if (pendingFilesRef.current.length > 0) {
        const fd = new FormData();
        pendingFilesRef.current.forEach(f => fd.append("files", f));
        const { urls, error: upErr } = await uploadPropertyImages(fd);
        if (upErr) { setError(upErr); return; }
        // Replace blob previews with real URLs
        const blobUrls = galleryUrls.filter(u => u.startsWith("blob:"));
        blobUrls.forEach(u => URL.revokeObjectURL(u));
        finalUrls = [...finalUrls, ...urls];
        pendingFilesRef.current = [];
        setGalleryUrls([...galleryUrls.filter(u => !u.startsWith("blob:")), ...urls]);
      }

      const fd = new FormData();
      fd.set("title", title); fd.set("price", price); fd.set("price_suffix", priceSuffix);
      fd.set("badge", status); fd.set("type", type); fd.set("description", description);
      fd.set("location", location); fd.set("area", area); fd.set("year_built", yearBuilt);
      fd.set("beds", beds.toString()); fd.set("baths", baths.toString());
      fd.set("parking", parking.toString()); fd.set("is_featured", isFeatured.toString());
      fd.set("latitude", latRef.current?.value ?? ""); fd.set("longitude", lngRef.current?.value ?? "");
      amenities.forEach(a => fd.append("amenities", a));
      finalUrls.forEach(u => fd.append("gallery_images", u));

      const result = mode === "create"
        ? await createProperty(fd)
        : await updateProperty(property!.id, fd);

      if (!result.success) { setError(result.error ?? "Something went wrong"); return; }
      setSuccess(mode === "create" ? "Property created successfully!" : "Property updated successfully!");
    });
  };

  // ── Design tokens (dark-mode aware) ──────────────────────────────
  const inp = "w-full px-4 py-2.5 rounded-lg border border-primary/20 dark:border-primary/30 bg-white dark:bg-[#0f2320] text-nordic dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-sm";
  const sel = `${inp} cursor-pointer`;
  const card = "bg-white dark:bg-[#152e2a] rounded-xl shadow-sm border border-primary/10 dark:border-primary/20 overflow-hidden";
  const cardHdr = "px-8 py-5 border-b border-primary/10 dark:border-primary/20 flex items-center gap-3 bg-gradient-to-r from-primary/5 to-transparent";
  const sideHdr = "px-6 py-4 border-b border-primary/10 dark:border-primary/20 flex items-center gap-3 bg-gradient-to-r from-primary/5 to-transparent";
  const ico = "w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary";
  const lbl = "block text-sm font-medium text-nordic dark:text-gray-200 mb-1.5";
  const lbl2 = "block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1";
  const hr = "border-primary/10 dark:border-primary/20";

  return (
    <div className="py-10">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-primary/10 dark:border-primary/20 pb-8">
        <div className="space-y-2">
          <nav><ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <li><Link href="/admin/properties" className="hover:text-primary transition-colors">Properties</Link></li>
            <li><span className="material-icons text-xs">chevron_right</span></li>
            <li className="text-nordic dark:text-white font-medium">{mode === "create" ? "Add New" : "Edit Property"}</li>
          </ol></nav>
          <h1 className="text-3xl font-bold text-nordic dark:text-white tracking-tight">
            {mode === "create" ? "Add New Property" : "Edit Property"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {mode === "create" ? "Fill in the details below. Fields marked * are required." : "Update the details for this listing."}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/properties"
            className="px-5 py-2.5 rounded-lg border border-primary/20 dark:border-primary/30 bg-transparent text-nordic dark:text-gray-300 hover:bg-primary/5 transition-colors font-medium text-sm">
            Cancel
          </Link>
          <button type="submit" form="property-form" disabled={isPending}
            className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium shadow-md shadow-primary/20 transition-all flex items-center gap-2 text-sm disabled:opacity-60">
            <span className="material-icons text-sm">{isPending ? "hourglass_empty" : "save"}</span>
            {isPending ? "Saving…" : mode === "create" ? "Save Property" : "Update Property"}
          </button>
        </div>
      </header>

      {/* Alerts */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400 flex items-center gap-2">
          <span className="material-icons text-base">error_outline</span> {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-xl text-sm text-primary dark:text-primary flex items-center gap-2">
          <span className="material-icons text-base">check_circle</span> {success}
        </div>
      )}

      <form id="property-form" onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* LEFT */}
        <div className="xl:col-span-8 space-y-8">
          {/* Basic Info */}
          <div className={card}>
            <div className={cardHdr}>
              <div className={ico}><span className="material-icons text-lg">info</span></div>
              <h2 className="text-xl font-bold text-nordic dark:text-white">Basic Information</h2>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className={lbl} htmlFor="title">Property Title <span className="text-red-400">*</span></label>
                <input id="title" type="text" required value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Modern Penthouse with Ocean View" className={inp} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className={lbl} htmlFor="price">Price <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input id="price" type="number" required value={price} onChange={e => setPrice(e.target.value)}
                      placeholder="0.00" className={`${inp} pl-7`} />
                  </div>
                </div>
                <div>
                  <label className={lbl} htmlFor="price_suffix">Price Suffix</label>
                  <input id="price_suffix" type="text" value={priceSuffix} onChange={e => setPriceSuffix(e.target.value)}
                    placeholder="e.g. /month" className={inp} />
                </div>
                <div>
                  <label className={lbl} htmlFor="type">Listing Type</label>
                  <select id="type" value={type} onChange={e => setType(e.target.value)} className={sel}>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={lbl} htmlFor="badge">Badge / Status</label>
                  <select id="badge" value={status} onChange={e => setStatus(e.target.value)} className={sel}>
                    <option value="">None</option>
                    <option value="hot">Hot</option>
                    <option value="premium">Premium</option>
                    <option value="new">New</option>
                    <option value="sold">Sold</option>
                    <option value="reduced">Price Reduced</option>
                  </select>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div onClick={() => setIsFeatured(v => !v)}
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${isFeatured ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`}>
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${isFeatured ? "translate-x-5" : ""}`} />
                    </div>
                    <span className="text-sm font-medium text-nordic dark:text-gray-200 group-hover:text-primary transition-colors">Featured Property</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className={card}>
            <div className={cardHdr}>
              <div className={ico}><span className="material-icons text-lg">description</span></div>
              <h2 className="text-xl font-bold text-nordic dark:text-white">Description</h2>
            </div>
            <div className="p-8">
              <textarea id="description" value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Describe the property features, neighborhood, and unique selling points…"
                className={`${inp} resize-y min-h-[200px] leading-relaxed`} maxLength={2000} />
              <div className="mt-2 text-right text-xs text-gray-400 dark:text-gray-500">{description.length} / 2000</div>
            </div>
          </div>

          {/* Gallery */}
          <div className={card}>
            <div className={`${cardHdr} justify-between`}>
              <div className="flex items-center gap-3">
                <div className={ico}><span className="material-icons text-lg">image</span></div>
                <h2 className="text-xl font-bold text-nordic dark:text-white">Gallery</h2>
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-primary/10 dark:bg-primary/20 px-2 py-1 rounded">JPG · PNG · WEBP</span>
            </div>
            <div className="p-8 space-y-6">
              <div className="relative border-2 border-dashed border-primary/20 dark:border-primary/30 rounded-xl bg-primary/5 dark:bg-primary/5 p-10 text-center hover:border-primary/50 hover:bg-primary/10 transition-colors cursor-pointer group">
                <input ref={fileInputRef} type="file" multiple accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={e => handleFilesSelected(e.target.files)} />
                <div className="flex flex-col items-center gap-3 pointer-events-none">
                  <div className="w-12 h-12 bg-white dark:bg-[#0f2320] rounded-full flex items-center justify-center shadow-sm text-primary group-hover:scale-110 transition-transform">
                    <span className="material-icons text-2xl">cloud_upload</span>
                  </div>
                  <div>
                    <p className="text-base font-medium text-nordic dark:text-white">Click or drag images here</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Max 5 MB per image · Uploaded on save</p>
                  </div>
                </div>
              </div>
              {galleryUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {galleryUrls.map((url, idx) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden relative group shadow-sm bg-primary/5">
                      <img src={url} alt={`img-${idx}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-nordic/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <button type="button" onClick={() => removeImage(url, idx)}
                          className="w-8 h-8 rounded-full bg-white text-red-500 hover:bg-red-50 flex items-center justify-center">
                          <span className="material-icons text-sm">delete</span>
                        </button>
                      </div>
                      {idx === 0 && <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Main</span>}
                    </div>
                  ))}
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-primary/20 dark:border-primary/30 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all group">
                    <span className="material-icons group-hover:scale-110 transition-transform">add</span>
                    <span className="text-xs mt-1 font-medium">Add More</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="xl:col-span-4 space-y-8">
          {/* Location */}
          <div className={card}>
            <div className={sideHdr}>
              <div className={ico}><span className="material-icons text-lg">place</span></div>
              <h2 className="text-lg font-bold text-nordic dark:text-white">Location</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={lbl} htmlFor="location">Address</label>
                <input id="location" type="text" value={location} onChange={e => setLocation(e.target.value)}
                  placeholder="Street Address, City, Zip" className={inp} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl2} htmlFor="latitude">Latitude</label>
                  <input ref={latRef} id="latitude" type="number" step="any" placeholder="18.4861"
                    defaultValue={property?.latitude ?? ""} className={`${inp} text-xs`} />
                </div>
                <div>
                  <label className={lbl2} htmlFor="longitude">Longitude</label>
                  <input ref={lngRef} id="longitude" type="number" step="any" placeholder="-69.9312"
                    defaultValue={property?.longitude ?? ""} className={`${inp} text-xs`} />
                </div>
              </div>
              <div className="h-36 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/10 dark:to-transparent border border-primary/10 dark:border-primary/20 flex items-center justify-center">
                <span className="bg-white/90 dark:bg-[#152e2a]/90 text-nordic dark:text-white px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold flex items-center gap-1.5">
                  <span className="material-icons text-sm text-primary">map</span> Map Preview
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className={`${card} xl:sticky xl:top-24`}>
            <div className={sideHdr}>
              <div className={ico}><span className="material-icons text-lg">straighten</span></div>
              <h2 className="text-lg font-bold text-nordic dark:text-white">Details</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl2} htmlFor="area">Area (m²)</label>
                  <input id="area" type="number" value={area} onChange={e => setArea(e.target.value)}
                    placeholder="0" className={inp} />
                </div>
                <div>
                  <label className={lbl2} htmlFor="year_built">Year Built</label>
                  <input id="year_built" type="number" value={yearBuilt} onChange={e => setYearBuilt(e.target.value)}
                    placeholder="YYYY" className={inp} />
                </div>
              </div>
              <hr className={hr} />
              <div className="space-y-4">
                {[
                  { label: "Bedrooms", icon: "bed", value: beds, setter: setBeds },
                  { label: "Bathrooms", icon: "shower", value: baths, setter: setBaths },
                  { label: "Parking", icon: "directions_car", value: parking, setter: setParking },
                ].map(({ label, icon, value, setter }) => (
                  <div key={label} className="flex items-center justify-between">
                    <label className="text-sm font-medium text-nordic dark:text-gray-200 flex items-center gap-2">
                      <span className="material-icons text-primary/60 text-sm">{icon}</span> {label}
                    </label>
                    <Counter value={value} onChange={setter} />
                  </div>
                ))}
              </div>
              <hr className={hr} />
              <div>
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Amenities</h3>
                <div className="space-y-2.5">
                  {AMENITY_OPTIONS.map(a => (
                    <label key={a} className="flex items-center gap-2.5 cursor-pointer group">
                      <input type="checkbox" checked={amenities.includes(a)} onChange={() => toggleAmenity(a)}
                        className="w-4 h-4 accent-primary border-primary/30 rounded" />
                      <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-nordic dark:group-hover:text-white transition-colors">{a}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-[#152e2a] border-t border-primary/10 dark:border-primary/20 shadow-2xl md:hidden z-40 flex gap-3">
        <Link href="/admin/properties"
          className="flex-1 py-3 rounded-xl border border-primary/20 dark:border-primary/30 text-nordic dark:text-gray-200 font-medium text-center text-sm">
          Cancel
        </Link>
        <button type="submit" form="property-form" disabled={isPending}
          className="flex-1 py-3 rounded-xl bg-primary text-white font-medium flex justify-center items-center gap-2 text-sm disabled:opacity-60">
          <span className="material-icons text-sm">save</span>
          {isPending ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
