import React from "react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-nordic-light/30 dark:bg-[#0a1a17]">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-mosque/10 border-r border-mosque/10 dark:border-white/5 flex flex-col fixed inset-y-0 z-20">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-mosque rounded-xl flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
              <span className="material-symbols-rounded">real_estate_agent</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-nordic-dark dark:text-white">LuxeAdmin</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 py-4">
          <AdminNavLink href="/admin" icon="dashboard">Dashboard</AdminNavLink>
          <AdminNavLink href="/admin/properties" icon="apartment">Properties</AdminNavLink>
          <AdminNavLink href="/admin/users" icon="group">User Roles</AdminNavLink>
          <AdminNavLink href="/" icon="home">View Site</AdminNavLink>
        </nav>

        <div className="p-4 border-t border-mosque/10 dark:border-white/5">
          <div className="bg-mosque/5 dark:bg-mosque/20 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-mosque/20 flex items-center justify-center text-mosque">
              <span className="material-symbols-rounded">person</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate dark:text-white">Administrator</p>
              <p className="text-xs text-nordic-dark/60 dark:text-gray-400">Admin Access</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}

function AdminNavLink({ href, icon, children }: { href: string; icon: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-3 px-4 py-3 text-nordic-dark/70 dark:text-gray-400 hover:bg-mosque/5 hover:text-mosque dark:hover:bg-mosque/20 dark:hover:text-white rounded-xl transition-all font-medium group"
    >
      <span className="material-symbols-rounded group-hover:scale-110 transition-transform">{icon}</span>
      {children}
    </Link>
  );
}
