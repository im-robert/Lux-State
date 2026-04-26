import React from "react";
import { createServerClient } from "@/lib/supabase/server";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function PropertiesAdminPage({ searchParams }: PageProps) {
  const supabase = await createServerClient();
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1");
  const limit = 8;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Fetch properties with pagination
  const { data: properties, count } = await supabase
    .from("properties")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  const totalPages = Math.ceil((count || 0) / limit);

  // Stats
  const stats = [
    { label: "Total Listings", value: count || 0, icon: "apartment", color: "text-primary", bg: "bg-primary/10" },
    { label: "Active Properties", value: count || 0, icon: "check_circle", color: "text-primary", bg: "bg-hint-green" },
    { label: "Pending Sale", value: 0, icon: "pending", color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30" },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full py-10 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-nordic dark:text-white tracking-tight">My Properties</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your portfolio and track performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white dark:bg-[#152e2a] border border-gray-200 dark:border-primary/30 text-nordic dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-primary/10 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-2">
            <span className="material-icons text-base">filter_list</span> Filter
          </button>
          <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md shadow-primary/20 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2">
            <span className="material-icons text-base">add</span> Add New Property
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#152e2a] p-5 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-nordic dark:text-white mt-1">{stat.value}</p>
            </div>
            <div className={`h-10 w-10 rounded-full ${stat.bg} flex items-center justify-center ${stat.color}`}>
              <span className="material-icons">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Property List Container */}
      <div className="bg-white dark:bg-[#152e2a] rounded-xl shadow-sm border border-gray-200 dark:border-primary/20 overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 dark:bg-primary/5 border-b border-gray-100 dark:border-primary/10 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <div className="col-span-6">Property Details</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {properties?.map((property) => (
          <div key={property.id} className="group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 border-b border-gray-100 dark:border-primary/10 hover:bg-background-light dark:hover:bg-primary/5 transition-colors items-center">
            {/* Property Details */}
            <div className="col-span-12 md:col-span-6 flex gap-4 items-center">
              <div className="relative h-20 w-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                <img 
                  alt={property.title} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  src={property.gallery_images?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400"}
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-nordic dark:text-white group-hover:text-primary transition-colors cursor-pointer line-clamp-1">{property.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{property.location}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                  <span className="flex items-center gap-1"><span className="material-icons text-[14px]">bed</span> {property.beds || 0} Beds</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="flex items-center gap-1"><span className="material-icons text-[14px]">bathtub</span> {property.baths || 0} Baths</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span>{property.area || 0} sqft</span>
                </div>
              </div>
            </div>
            {/* Price */}
            <div className="col-span-6 md:col-span-2">
              <div className="text-base font-semibold text-nordic dark:text-gray-200">${parseFloat(property.price).toLocaleString()}</div>
              <div className="text-xs text-gray-400">Listed: {new Date(property.created_at).toLocaleDateString()}</div>
            </div>
            {/* Status */}
            <div className="col-span-6 md:col-span-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-hint-green text-primary border border-primary/10">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5"></span>
                Active
              </span>
            </div>
            {/* Actions */}
            <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-2">
              <button className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-hint-green/30 transition-all" title="Edit Property">
                <span className="material-icons text-xl">edit</span>
              </button>
              <button className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all" title="Delete Property">
                <span className="material-icons text-xl">delete_outline</span>
              </button>
            </div>
          </div>
        ))}

        {!properties?.length && (
          <div className="py-20 text-center">
            <span className="material-icons text-5xl text-nordic/20 mb-4">apartment</span>
            <p className="text-nordic/40">No properties found in your portfolio.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-primary/20 flex items-center justify-between bg-gray-50/50 dark:bg-primary/5">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium text-nordic dark:text-white">{from + 1}</span> to <span className="font-medium text-nordic dark:text-white">{Math.min(to + 1, count || 0)}</span> of <span className="font-medium text-nordic dark:text-white">{count || 0}</span> results
          </div>
          <div className="flex gap-2">
            <Link
              href={`/admin/properties?page=${page - 1}`}
              className={`px-3 py-1 text-sm border border-gray-200 dark:border-primary/30 rounded-md text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-primary/20 ${page <= 1 ? 'pointer-events-none opacity-50' : ''}`}
            >
              Previous
            </Link>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <Link
                  key={i}
                  href={`/admin/properties?page=${i + 1}`}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    page === i + 1 
                      ? 'bg-primary text-white' 
                      : 'border border-gray-200 dark:border-primary/30 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-primary/20'
                  }`}
                >
                  {i + 1}
                </Link>
              ))}
            </div>
            <Link
              href={`/admin/properties?page=${page + 1}`}
              className={`px-3 py-1 text-sm border border-gray-200 dark:border-primary/30 rounded-md text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-primary/20 ${page >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
            >
              Next
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
