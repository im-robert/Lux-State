import React from "react";
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-nordic-dark dark:text-white">Dashboard Overview</h1>
        <p className="text-nordic-dark/60 dark:text-gray-400">Welcome back. Here's what's happening with LuxeEstate.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Properties" 
          value={propertyCount || 0} 
          icon="apartment" 
          trend="+4 this month"
          color="bg-mosque"
        />
        <StatCard 
          title="Registered Users" 
          value={userCount || 0} 
          icon="group" 
          trend="+12 this week"
          color="bg-nordic-dark"
        />
        <StatCard 
          title="Active Listings" 
          value={propertyCount || 0} 
          icon="visibility" 
          trend="85% occupancy"
          color="bg-mosque"
        />
        <StatCard 
          title="Inquiries" 
          value="24" 
          icon="mail" 
          trend="+5 today"
          color="bg-nordic-dark"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-mosque/5 border border-mosque/10 dark:border-white/5 rounded-2xl p-6 shadow-soft">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-mosque/5 last:border-0">
                <div className="w-10 h-10 rounded-full bg-mosque/10 flex items-center justify-center text-mosque">
                  <span className="material-symbols-rounded">update</span>
                </div>
                <div>
                  <p className="text-sm font-semibold dark:text-white">New property added</p>
                  <p className="text-xs text-nordic-dark/60 dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-mosque/5 border border-mosque/10 dark:border-white/5 rounded-2xl p-6 shadow-soft">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center gap-3 p-6 bg-mosque/5 hover:bg-mosque/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-2xl transition-all group">
              <span className="material-symbols-rounded text-3xl text-mosque group-hover:scale-110 transition-transform">add_circle</span>
              <span className="text-sm font-semibold dark:text-white">Add Property</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-3 p-6 bg-mosque/5 hover:bg-mosque/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-2xl transition-all group">
              <span className="material-symbols-rounded text-3xl text-mosque group-hover:scale-110 transition-transform">manage_accounts</span>
              <span className="text-sm font-semibold dark:text-white">Review Roles</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color }: { title: string; value: string | number; icon: string; trend: string; color: string }) {
  return (
    <div className="bg-white dark:bg-mosque/5 border border-mosque/10 dark:border-white/5 rounded-2xl p-6 shadow-soft hover:shadow-soft-hover transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl text-white ${color} shadow-lg`}>
          <span className="material-symbols-rounded">{icon}</span>
        </div>
        <span className="text-xs font-medium text-mosque bg-mosque/10 px-2 py-1 rounded-full">{trend}</span>
      </div>
      <div>
        <p className="text-nordic-dark/60 dark:text-gray-400 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-nordic-dark dark:text-white mt-1">{value}</h3>
      </div>
    </div>
  );
}
