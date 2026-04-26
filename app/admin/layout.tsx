import React from "react";
import { createServerClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

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
      <AdminSidebar user={user} />

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
