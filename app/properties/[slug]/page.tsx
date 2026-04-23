import React from "react";
import { notFound } from "next/navigation";
import { createServerClient } from "../../../lib/supabase/server";
import { Navbar } from "../../../components/layout/Navbar";
import dynamic from "next/dynamic";
import { Property } from "../../../types/property";

import { PropertyGallery } from "../../../components/properties/PropertyGallery";
import { PropertyMapDynamic } from "../../../components/properties/PropertyMapDynamic";

async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching property:", error.message);
    return null;
  }
  return data;
}

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const property = await getPropertyBySlug(resolvedParams.slug);

  if (!property) {
    notFound();
  }

  const gallery = property.gallery_images || [];

  // Helper to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-clear-day text-nordic min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Left Column: Images */}
          <PropertyGallery property={property} gallery={gallery} />

          {/* Right Column: Pricing & Contact */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-28 space-y-6">
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-mosque/5">
                <div className="mb-4">
                  <h1 className="text-4xl font-display font-light text-nordic mb-2">
                    {formatCurrency(property.price)}
                    {property.price_suffix && <span className="text-xl text-nordic/50 ml-1">{property.price_suffix}</span>}
                  </h1>
                  <p className="text-nordic/60 font-medium flex items-center gap-1">
                    <span className="material-icons text-mosque text-sm">location_on</span>
                    {property.location}
                  </p>
                </div>
                
                <div className="h-px bg-slate-100 my-6"></div>
                
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    alt="Agent" 
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4TxUmdQRb2VMjuaNxLEwLorv_dgHzoET2_wL5toSvew6nhtziaR3DX-U69DBN7J74yO6oKokpw8tqEFutJf13MeXghCy7FwZuAxnoJel6FYcKeCRUVinpZtrNnkZvXd-MY5_2MAtRD7JP5BieHixfCaeAPW04jm-y-nvF3HIrwcZ_HRDk_MrNP5WiPV3u9zNrEgM-SQoWGh4xLVSV444aZAbVl03mjjsW5WBpIeodCyqJxprTDp6Q157D06VxcdUSCf-l9UKQT-w"
                  />
                  <div>
                    <h3 className="font-semibold text-nordic">Sarah Jenkins</h3>
                    <div className="flex items-center gap-1 text-xs text-mosque font-medium">
                      <span className="material-icons text-[14px]">star</span>
                      <span>Top Rated Agent</span>
                    </div>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <button className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors">
                      <span className="material-icons text-sm">chat</span>
                    </button>
                    <button className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors">
                      <span className="material-icons text-sm">call</span>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button className="w-full bg-mosque hover:bg-primary-hover text-white py-4 px-6 rounded-lg font-medium transition-all shadow-lg shadow-mosque/20 flex items-center justify-center gap-2 group">
                    <span className="material-icons text-xl group-hover:scale-110 transition-transform">calendar_today</span>
                    Schedule Visit
                  </button>
                  <button className="w-full bg-transparent border border-nordic/10 hover:border-mosque text-nordic/80 hover:text-mosque py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                    <span className="material-icons text-xl">mail_outline</span>
                    Contact Agent
                  </button>
                </div>
              </div>
              
              <div className="bg-white p-2 rounded-xl shadow-sm border border-mosque/5 z-0 relative">
                 <PropertyMapDynamic 
                   location={property.location} 
                   lat={property.latitude ?? undefined} 
                   lng={property.longitude ?? undefined} 
                 />
              </div>
              
            </div>
          </div>
          
          {/* Bottom Area: Features & Description */}
          <div className="lg:col-span-8 lg:row-start-2 -mt-8 space-y-8">
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
              <h2 className="text-lg font-semibold mb-6 text-nordic">Property Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <span className="material-icons text-mosque text-2xl mb-2">square_foot</span>
                  <span className="text-xl font-bold text-nordic">{property.area}</span>
                  <span className="text-xs uppercase tracking-wider text-nordic/50">Square Meters</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <span className="material-icons text-mosque text-2xl mb-2">bed</span>
                  <span className="text-xl font-bold text-nordic">{property.beds}</span>
                  <span className="text-xs uppercase tracking-wider text-nordic/50">Bedrooms</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <span className="material-icons text-mosque text-2xl mb-2">shower</span>
                  <span className="text-xl font-bold text-nordic">{property.baths}</span>
                  <span className="text-xs uppercase tracking-wider text-nordic/50">Bathrooms</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <span className="material-icons text-mosque text-2xl mb-2">directions_car</span>
                  <span className="text-xl font-bold text-nordic">2</span>
                  <span className="text-xs uppercase tracking-wider text-nordic/50">Garage</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
              <h2 className="text-lg font-semibold mb-4 text-nordic">About this {property.type === 'rent' ? 'apartment' : 'home'}</h2>
              <div className="prose prose-slate max-w-none text-nordic/70 leading-relaxed">
                <p className="mb-4">
                  Welcome to <strong>{property.title}</strong>, a premium property located in the exclusive area of {property.location}. 
                  This magnificent residence offers an unparalleled lifestyle with modern luxury and sophisticated design elements throughout.
                </p>
                <p>
                  The open-concept layout is designed with an emphasis on indoor-outdoor living, flooding the interiors with natural light. 
                  Featuring {property.beds} bedrooms and {property.baths} bathrooms across {property.area} square meters of living space, 
                  it's the perfect sanctuary for relaxation and entertaining.
                </p>
              </div>
              <button className="mt-4 text-mosque font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                Read more
                <span className="material-icons text-sm">arrow_forward</span>
              </button>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
              <h2 className="text-lg font-semibold mb-6 text-nordic">Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                <div className="flex items-center gap-3 text-nordic/70">
                  <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                  <span>Smart Home System</span>
                </div>
                <div className="flex items-center gap-3 text-nordic/70">
                  <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                  <span>Swimming Pool</span>
                </div>
                <div className="flex items-center gap-3 text-nordic/70">
                  <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                  <span>Central Heating &amp; Cooling</span>
                </div>
                <div className="flex items-center gap-3 text-nordic/70">
                  <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                  <span>Electric Vehicle Charging</span>
                </div>
                <div className="flex items-center gap-3 text-nordic/70">
                  <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                  <span>Private Gym</span>
                </div>
                <div className="flex items-center gap-3 text-nordic/70">
                  <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                  <span>Wine Cellar</span>
                </div>
              </div>
            </div>
            
            <div className="bg-mosque/5 p-6 rounded-xl border border-mosque/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-full text-mosque shadow-sm">
                  <span className="material-icons">calculate</span>
                </div>
                <div>
                  <h3 className="font-semibold text-nordic">Estimated Payment</h3>
                  <p className="text-sm text-nordic/60">Starting from <strong className="text-mosque">{formatCurrency(property.price * 0.005)}/mo</strong> with 20% down</p>
                </div>
              </div>
              <button className="whitespace-nowrap px-4 py-2 bg-white border border-nordic/10 rounded-lg text-sm font-semibold hover:border-mosque transition-colors text-nordic">
                Calculate Mortgage
              </button>
            </div>
            
          </div>
          
        </div>
      </main>
    </div>
  );
}
