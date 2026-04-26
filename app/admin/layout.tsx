import React from "react";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen bg-[#EEF6F6] dark:bg-[#0f2320]">
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 dark:bg-[#152e2a]/80 backdrop-blur-md border-r border-primary/10 dark:border-primary/20 flex flex-col fixed inset-y-0 z-20">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
              <span className="material-symbols-rounded">real_estate_agent</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-nordic dark:text-white">LuxeEstate</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4">
          <AdminNavLink href="/admin" icon="dashboard">Dashboard</AdminNavLink>
          <AdminNavLink href="/admin/properties" icon="apartment">Properties</AdminNavLink>
          <AdminNavLink href="/admin/users" icon="group">User Roles</AdminNavLink>
          
          <div className="pt-8 pb-4 px-4 text-[10px] font-bold uppercase tracking-widest text-nordic/40 dark:text-gray-500">
            External
          </div>
          <AdminNavLink href="/" icon="home">View Site</AdminNavLink>
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-4 flex items-center gap-3 border border-primary/10">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-rounded">person</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate text-nordic dark:text-white">{user?.email?.split('@')[0] || 'Admin'}</p>
              <p className="text-[10px] uppercase font-semibold text-primary/70">{user?.app_metadata?.role || 'Verified Admin'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function AdminNavLink({ href, icon, children }: { href: string; icon: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-3 px-4 py-3 text-nordic/60 dark:text-gray-400 hover:bg-primary/5 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-white rounded-xl transition-all font-medium group"
    >
      <span className="material-symbols-rounded group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-sm">{children}</span>
    </Link>
  );
}
