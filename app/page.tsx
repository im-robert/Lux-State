import React, { Suspense } from "react";
import { Navbar } from "../components/layout/Navbar";
import { Hero } from "../components/home/Hero";
import { FeaturedPropertyCard } from "../components/properties/FeaturedPropertyCard";
import { PropertyCard } from "../components/properties/PropertyCard";
import { Pagination } from "../components/home/Pagination";
import { createServerClient } from "../lib/supabase/server";

const PAGE_SIZE = 8;

async function getFeaturedProperties() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching featured properties:", error.message);
    return [];
  }
  return data ?? [];
}

async function getNewInMarketProperties(page: number) {
  const supabase = createServerClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from("properties")
    .select("*", { count: "exact" })
    .eq("is_featured", false)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching new-in-market properties:", error.message);
    return { data: [], totalCount: 0 };
  }

  return { data: data ?? [], totalCount: count ?? 0 };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const rawPage = resolvedParams.page;
  const currentPage = Math.max(
    1,
    parseInt(Array.isArray(rawPage) ? rawPage[0] : rawPage ?? "1", 10)
  );

  const [featuredProperties, { data: newInMarketProperties, totalCount }] =
    await Promise.all([
      getFeaturedProperties(),
      getNewInMarketProperties(currentPage),
    ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Hero />

        {/* Featured Collections */}
        <section className="mb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-light text-nordic-dark">
                Featured Collections
              </h2>
              <p className="text-nordic-muted mt-1 text-sm">
                Curated properties for the discerning eye.
              </p>
            </div>
            <a
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity"
              href="#"
            >
              View all{" "}
              <span className="material-icons text-sm">arrow_forward</span>
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredProperties.map((property) => (
              <FeaturedPropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>

        {/* New in Market */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-light text-nordic-dark">
                New in Market
              </h2>
              <p className="text-nordic-muted mt-1 text-sm">
                Fresh opportunities added this week.
              </p>
            </div>
            <div className="hidden md:flex bg-white p-1 rounded-lg">
              <button className="px-4 py-1.5 rounded-md text-sm font-medium bg-nordic-dark text-white shadow-sm">
                All
              </button>
              <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark">
                Buy
              </button>
              <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark">
                Rent
              </button>
            </div>
          </div>

          {newInMarketProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {newInMarketProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-nordic-muted">
              <span className="material-icons text-4xl mb-2 block">
                search_off
              </span>
              <p>No properties found on this page.</p>
            </div>
          )}

          {/* Server-side pagination via URL search params */}
          <Suspense fallback={<div className="mt-12 h-10" />}>
            <Pagination totalPages={totalPages} currentPage={currentPage} />
          </Suspense>

          {totalPages > 1 && (
            <p className="mt-4 text-center text-xs text-nordic-muted">
              Page {currentPage} of {totalPages} &mdash; {totalCount} properties
              total
            </p>
          )}
        </section>
      </main>
    </>
  );
}
