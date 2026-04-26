"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

interface AdminSidebarProps {
  user: any;
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    try {
      console.log("Attempting sign out...");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Using window.location for a hard redirect to ensure session state is fully cleared
      window.location.href = "/login";
    } catch (error: any) {
      console.error("Error signing out:", error.message);
      alert("Error signing out: " + error.message);
    }
  };

  const navLinks = [
    { href: "/admin", icon: "dashboard", label: "Dashboard" },
    { href: "/admin/properties", icon: "apartment", label: "Properties" },
    { href: "/admin/users", icon: "group", label: "User Roles" },
  ];

  const avatarUrl = user?.user_metadata?.avatar_url;
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin';
  const userRole = user?.app_metadata?.role || 'Verified Admin';

  return (
    <aside className="w-64 bg-white/80 dark:bg-[#152e2a]/80 backdrop-blur-md border-r border-primary/10 dark:border-primary/20 flex flex-col fixed inset-y-0 z-20">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
            <span className="material-symbols-rounded">real_estate_agent</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-nordic dark:text-white">LuxState</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium group relative ${
                isActive 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : 'text-nordic/60 dark:text-gray-400 hover:bg-primary/5 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-white'
              }`}
            >
              <span className={`material-symbols-rounded transition-transform ${isActive ? '' : 'group-hover:scale-110'}`}>
                {link.icon}
              </span>
              <span className="text-sm">{link.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute inset-0 bg-primary rounded-xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
        
        <div className="pt-8 pb-4 px-4 text-[10px] font-bold uppercase tracking-widest text-nordic/40 dark:text-gray-500">
          External
        </div>
        <Link 
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-nordic/60 dark:text-gray-400 hover:bg-primary/5 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-white rounded-xl transition-all font-medium group"
        >
          <span className="material-symbols-rounded group-hover:scale-110 transition-transform">home</span>
          <span className="text-sm">View Site</span>
        </Link>
      </nav>

      <div className="p-6 mt-auto space-y-4 relative z-30">
        <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-4 flex items-center gap-3 border border-primary/10 group">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-rounded">person</span>
            )}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-bold truncate text-nordic dark:text-white" title={user?.email}>{userName}</p>
            <p className="text-[10px] uppercase font-semibold text-primary/70">{userRole}</p>
          </div>
        </div>
        
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all font-medium group text-sm relative z-40"
        >
          <span className="material-symbols-rounded group-hover:translate-x-1 transition-transform">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
