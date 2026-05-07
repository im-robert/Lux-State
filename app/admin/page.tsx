import React from "react";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createServerClient();

  // Fetch stats
  const { count: propertyCount } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true });

  const { count: userCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  return (
    <div className="py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-nordic dark:text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back. Here's what's happening with LuxState.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Properties" 
          value={propertyCount || 0} 
          icon="apartment" 
          trend="+4 this month"
          color="primary"
        />
        <StatCard 
          title="Registered Users" 
          value={userCount || 0} 
          icon="group" 
          trend="+12 this week"
          color="nordic"
        />
        <StatCard 
          title="Active Listings" 
          value={propertyCount || 0} 
          icon="check_circle" 
          trend="85% occupancy"
          color="primary"
        />
        <StatCard 
          title="Inquiries" 
          value="24" 
          icon="mail" 
          trend="+5 today"
          color="nordic"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-[#152e2a] border border-primary/10 dark:border-primary/20 rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-nordic dark:text-white flex items-center gap-2">
            <span className="material-icons text-primary">history</span>
            Recent Activity
          </h2>
          <div className="space-y-6">
            {[
              { title: "New property added", time: "2 hours ago", desc: "The Nordic Villa was listed." },
              { title: "User role updated", time: "5 hours ago", desc: "Marcus Chen was promoted to Agent." },
              { title: "New inquiry received", time: "Yesterday", desc: "Inquiry about Sunset Apartments." },
              { title: "Property status changed", time: "2 days ago", desc: "The Family Estate is now Sold." }
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                  <span className="material-symbols-rounded text-xl">update</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-nordic dark:text-white">{activity.title}</p>
                  <p className="text-xs text-nordic/60 dark:text-gray-400 mt-0.5">{activity.desc}</p>
                  <p className="text-[10px] uppercase font-bold text-primary/60 mt-2 tracking-wider">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-[#152e2a] border border-primary/10 dark:border-primary/20 rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-nordic dark:text-white flex items-center gap-2">
            <span className="material-icons text-primary">bolt</span>
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/properties/new" className="flex flex-col items-center justify-center gap-4 p-8 bg-[#EEF6F6] dark:bg-primary/5 hover:bg-primary/10 dark:hover:bg-primary/10 border border-primary/5 rounded-2xl transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="material-icons">add_circle</span>
              </div>
              <span className="text-sm font-bold text-nordic dark:text-white">Add Property</span>
            </Link>
            <button className="flex flex-col items-center justify-center gap-4 p-8 bg-[#EEF6F6] dark:bg-primary/5 hover:bg-primary/10 dark:hover:bg-primary/10 border border-primary/5 rounded-2xl transition-all group">
              <div className="w-12 h-12 rounded-xl bg-nordic text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="material-icons">manage_accounts</span>
              </div>
              <span className="text-sm font-bold text-nordic dark:text-white">Review Roles</span>
            </button>
          </div>
          
          <div className="mt-8 p-6 bg-hint-green/30 dark:bg-primary/10 rounded-2xl border border-primary/10">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Pro Tip</h3>
            <p className="text-xs text-nordic/70 dark:text-gray-400 leading-relaxed">
              Use the property management dashboard to track performance metrics and sales (YTD) for each individual agent in your directory.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color }: { title: string; value: string | number; icon: string; trend: string; color: string }) {
  const colorMap: Record<string, string> = {
    primary: "bg-primary",
    nordic: "bg-nordic"
  };

  return (
    <div className="bg-white dark:bg-[#152e2a] border border-primary/10 dark:border-primary/20 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-xl text-white ${colorMap[color]} shadow-lg flex items-center justify-center`}>
          <span className="material-icons text-2xl">{icon}</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full">{trend}</span>
      </div>
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest">{title}</p>
        <h3 className="text-3xl font-bold text-nordic dark:text-white mt-1 tracking-tight">{value}</h3>
      </div>
    </div>
  );
}
