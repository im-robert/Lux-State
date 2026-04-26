import React from "react";
import { createServerClient } from "@/lib/supabase/server";

export default async function PropertiesAdminPage() {
  const supabase = await createServerClient();

  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-nordic-dark dark:text-white">Properties Management</h1>
          <p className="text-nordic-dark/60 dark:text-gray-400">View and manage your real estate listings.</p>
        </div>
        <button className="flex items-center gap-2 bg-mosque text-white px-5 py-2.5 rounded-xl font-semibold shadow-soft hover:shadow-soft-hover transition-all">
          <span className="material-symbols-rounded">add</span>
          New Property
        </button>
      </div>

      <div className="bg-white dark:bg-mosque/5 border border-mosque/10 dark:border-white/5 rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-nordic-light/30 dark:bg-mosque/20 text-nordic-dark/70 dark:text-gray-300">
                <th className="px-6 py-4 font-semibold text-sm">Property</th>
                <th className="px-6 py-4 font-semibold text-sm">Location</th>
                <th className="px-6 py-4 font-semibold text-sm">Price</th>
                <th className="px-6 py-4 font-semibold text-sm">Features</th>
                <th className="px-6 py-4 font-semibold text-sm">Status</th>
                <th className="px-6 py-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mosque/5 dark:divide-white/5">
              {properties?.map((property) => (
                <tr key={property.id} className="hover:bg-mosque/5 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-mosque/10 rounded-lg flex items-center justify-center text-mosque overflow-hidden">
                        {property.gallery_images && property.gallery_images[0] ? (
                          <img src={property.gallery_images[0]} alt={property.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-rounded">image</span>
                        )}
                      </div>
                      <span className="font-semibold text-nordic-dark dark:text-white truncate max-w-[200px]">{property.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-nordic-dark/70 dark:text-gray-400">{property.location}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-mosque">
                      ${property.price.toLocaleString()}{property.price_suffix}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 text-xs text-nordic-dark/60 dark:text-gray-400">
                      <span className="bg-nordic-light/50 dark:bg-white/5 px-2 py-1 rounded">{property.beds}bds</span>
                      <span className="bg-nordic-light/50 dark:bg-white/5 px-2 py-1 rounded">{property.baths}ba</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      property.type === 'sale' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {property.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-nordic-dark/40 dark:text-white/40 hover:text-mosque dark:hover:text-mosque transition-colors">
                        <span className="material-symbols-rounded text-xl">edit</span>
                      </button>
                      <button className="p-2 text-nordic-dark/40 dark:text-white/40 hover:text-red-500 transition-colors">
                        <span className="material-symbols-rounded text-xl">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
