import React, { Suspense } from "react";
import { createServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { AdminPropertiesControls } from "@/components/admin/AdminPropertiesControls";
import { PropertyStatusToggle } from "@/components/admin/PropertyStatusToggle";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    q?: string;
    type?: string;
    badge?: string;
    featured?: string;
    active?: string;
    min_beds?: string;
    min_baths?: string;
    min_price?: string;
    max_price?: string;
  }>;
}

export default async function PropertiesAdminPage({ searchParams }: PageProps) {
  const supabase = await createServerClient();
  const sp = await searchParams;

  const page = Math.max(1, parseInt(sp.page || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(sp.limit || "8")));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Build query with filters — admin sees ALL properties regardless of is_active
  let query = supabase
    .from("properties")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (sp.q) query = query.ilike("title", `%${sp.q}%`);
  if (sp.type) query = query.eq("type", sp.type);
  if (sp.badge) query = query.eq("badge", sp.badge);
  if (sp.featured) query = query.eq("is_featured", sp.featured === "true");
  // active filter: "true" = only active, "false" = only inactive, absent = all
  if (sp.active === "true") query = query.eq("is_active", true);
  if (sp.active === "false") query = query.eq("is_active", false);
  if (sp.min_beds) query = query.gte("beds", parseInt(sp.min_beds));
  if (sp.min_baths) query = query.gte("baths", parseInt(sp.min_baths));
  if (sp.min_price) query = query.gte("price", parseFloat(sp.min_price));
  if (sp.max_price) query = query.lte("price", parseFloat(sp.max_price));

  const { data: properties, count } = await query.range(from, to);

  const totalPages = Math.ceil((count || 0) / limit);
  const hasFilters = !!(sp.q || sp.type || sp.badge || sp.featured || sp.active || sp.min_beds || sp.min_price || sp.max_price);

  const buildHref = (updates: Record<string, string | number>) => {
    const params = new URLSearchParams();
    if (sp.q) params.set("q", sp.q);
    if (sp.limit) params.set("limit", sp.limit);
    if (sp.type) params.set("type", sp.type);
    if (sp.badge) params.set("badge", sp.badge);
    if (sp.featured) params.set("featured", sp.featured);
    if (sp.active) params.set("active", sp.active);
    if (sp.min_beds) params.set("min_beds", sp.min_beds);
    if (sp.min_baths) params.set("min_baths", sp.min_baths);
    if (sp.min_price) params.set("min_price", sp.min_price);
    if (sp.max_price) params.set("max_price", sp.max_price);
    Object.entries(updates).forEach(([k, v]) => params.set(k, String(v)));
    return `/admin/properties?${params.toString()}`;
  };

  const statusColors: Record<string, string> = {
    hot: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    premium: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    new: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    sold: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
    reduced: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  };

  return (
    <div className="max-w-7xl mx-auto w-full py-10 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-nordic dark:text-white tracking-tight">Properties</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            {count || 0} {hasFilters ? "results match your filters" : "total listings"}
          </p>
        </div>
        <Link href="/admin/properties/new"
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 inline-flex items-center gap-2">
          <span className="material-icons text-base">add</span> Add New Property
        </Link>
      </div>

      {/* Search + Filters + Per-page */}
      <Suspense>
        <AdminPropertiesControls total={count || 0} />
      </Suspense>

      {/* Table */}
      <div className="bg-white dark:bg-[#152e2a] rounded-2xl shadow-sm border border-primary/10 dark:border-primary/20 overflow-hidden">
        {/* Table header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-primary/5 dark:bg-primary/10 border-b border-primary/10 dark:border-primary/20 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <div className="col-span-5">Property Details</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-2">Badge</div>
          <div className="col-span-1">Visibility</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {properties?.map((property) => (
          <div key={property.id}
            className={`group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 border-b border-primary/5 dark:border-primary/10 transition-colors items-center last:border-0 ${
              property.is_active
                ? "hover:bg-primary/5 dark:hover:bg-primary/10"
                : "bg-gray-50/80 dark:bg-black/20 opacity-70 hover:opacity-100 hover:bg-gray-100/80 dark:hover:bg-black/30"
            }`}>
            {/* Details */}
            <div className="col-span-12 md:col-span-5 flex gap-4 items-center">
              <div className="relative h-16 w-24 flex-shrink-0 rounded-xl overflow-hidden bg-primary/10">
                <img
                  alt={property.title}
                  className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${!property.is_active ? "grayscale" : ""}`}
                  src={property.gallery_images?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400"}
                />
                {!property.is_active && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span className="material-icons text-white/80 text-2xl">visibility_off</span>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-nordic dark:text-white group-hover:text-primary transition-colors line-clamp-1">{property.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{property.location}</p>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                  <span className="flex items-center gap-0.5"><span className="material-icons text-[13px]">bed</span>{property.beds || 0}</span>
                  <span className="text-gray-300">·</span>
                  <span className="flex items-center gap-0.5"><span className="material-icons text-[13px]">bathtub</span>{property.baths || 0}</span>
                  <span className="text-gray-300">·</span>
                  <span>{property.area || 0} m²</span>
                  {property.is_featured && (
                    <span className="ml-1 inline-flex items-center gap-0.5 text-primary text-[10px] font-bold uppercase">
                      <span className="material-icons text-[11px]">star</span> Featured
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="col-span-6 md:col-span-2">
              <div className="text-sm font-bold text-nordic dark:text-gray-200">
                ${parseFloat(property.price).toLocaleString()}
                {property.price_suffix && <span className="text-xs font-normal text-gray-400">{property.price_suffix}</span>}
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5 capitalize">{property.type}</div>
            </div>

            {/* Badge */}
            <div className="col-span-6 md:col-span-2">
              {property.badge ? (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[property.badge] || "bg-primary/10 text-primary"}`}>
                  {property.badge}
                </span>
              ) : (
                <span className="text-xs text-gray-400 dark:text-gray-500">—</span>
              )}
            </div>

            {/* Visibility status */}
            <div className="col-span-6 md:col-span-1">
              {property.is_active ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500 dark:bg-gray-800/50 dark:text-gray-400 border border-gray-200 dark:border-gray-700 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" /> Inactive
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-1">
              <Link href={`/admin/properties/${property.id}/edit`}
                className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-all" title="Edit Property">
                <span className="material-icons text-xl">edit</span>
              </Link>
              {/* Toggle active/inactive instead of deleting */}
              <PropertyStatusToggle
                id={property.id}
                isActive={property.is_active ?? true}
              />
            </div>
          </div>
        ))}

        {!properties?.length && (
          <div className="py-20 text-center">
            <span className="material-icons text-5xl text-primary/20 mb-4 block">apartment</span>
            <p className="text-nordic/40 dark:text-gray-500 font-medium">
              {hasFilters ? "No properties match your filters." : "No properties in your portfolio yet."}
            </p>
            {hasFilters && (
              <Link href="/admin/properties" className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
                <span className="material-icons text-base">clear</span> Clear filters
              </Link>
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-primary/10 dark:border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-3 bg-primary/5 dark:bg-primary/10">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-semibold text-nordic dark:text-white">{from + 1}</span>–
            <span className="font-semibold text-nordic dark:text-white">{Math.min(to + 1, count || 0)}</span> of{" "}
            <span className="font-semibold text-nordic dark:text-white">{count || 0}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Link
              href={buildHref({ page: page - 1 })}
              className={`px-3 py-1.5 text-sm border border-primary/20 dark:border-primary/30 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-primary/20 transition-colors ${page <= 1 ? "pointer-events-none opacity-40" : ""}`}
            >
              ← Prev
            </Link>

            {/* Page numbers — show max 7 */}
            {(() => {
              const pages: number[] = [];
              const start = Math.max(1, page - 3);
              const end = Math.min(totalPages, start + 6);
              for (let i = start; i <= end; i++) pages.push(i);
              return pages.map(p => (
                <Link key={p} href={buildHref({ page: p })}
                  className={`w-8 h-8 flex items-center justify-center text-sm rounded-lg transition-colors ${p === page ? "bg-primary text-white shadow-md shadow-primary/20" : "border border-primary/20 dark:border-primary/30 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-primary/20"}`}>
                  {p}
                </Link>
              ));
            })()}

            <Link
              href={buildHref({ page: page + 1 })}
              className={`px-3 py-1.5 text-sm border border-primary/20 dark:border-primary/30 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-primary/20 transition-colors ${page >= totalPages ? "pointer-events-none opacity-40" : ""}`}
            >
              Next →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
