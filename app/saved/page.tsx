import React from "react";
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { getTranslations } from "@/lib/i18n/server";
import { SavedPropertiesList } from "@/components/properties/SavedPropertiesList";

export default async function SavedHomesPage() {
  const supabase = createServerClient();
  const { t } = await getTranslations();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  // Fetch favorited property IDs on the server for initial render
  const { data: favoritesData } = await supabase
    .from("favorites")
    .select("property_id")
    .eq("user_id", user.id);

  const favoritedIds = favoritesData?.map(f => f.property_id) || [];

  let initialProperties = [];
  if (favoritedIds.length > 0) {
    const { data: propertiesData } = await supabase
      .from("properties")
      .select("*")
      .in("id", favoritedIds)
      .eq("is_active", true);
    
    initialProperties = propertiesData || [];
  }

  return (
    <div className="bg-clear-day min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-8">
          <a 
            href="/"
            className="group flex items-center gap-4 text-nordic-dark/60 hover:text-mosque transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#1a3833] shadow-soft flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-icons text-2xl">arrow_back</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase font-bold tracking-[0.2em] opacity-50">{t("common.back")}</span>
              <span className="text-lg font-black tracking-tight flex items-center gap-1">
                Lux<span className="text-mosque">State</span>
              </span>
            </div>
          </a>

          <nav className="hidden sm:flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-nordic-dark/30">
            <a href="/" className="hover:text-mosque transition-colors">LuxState</a>
            <span className="material-icons text-xs">chevron_right</span>
            <span className="text-nordic-dark/60 dark:text-gray-400">{t("nav.saved")}</span>
          </nav>
        </div>

        <div className="mb-10">
          <h1 className="text-4xl font-black text-nordic-dark dark:text-white tracking-tight mb-2">
            {t("nav.saved")}
          </h1>
        </div>

        <SavedPropertiesList initialProperties={initialProperties} />
      </main>
    </div>
  );
}
