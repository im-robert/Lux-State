import React from "react";
import { createServerClient } from "@/lib/supabase/server";
import { RoleSwitcher } from "@/components/admin/RoleSwitcher";

export default async function UsersAdminPage() {
  const supabase = await createServerClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-nordic-dark dark:text-white">User Management</h1>
        <p className="text-nordic-dark/60 dark:text-gray-400">Manage user permissions and roles across the platform.</p>
      </div>

      <div className="bg-white dark:bg-mosque/5 border border-mosque/10 dark:border-white/5 rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-nordic-light/30 dark:bg-mosque/20 text-nordic-dark/70 dark:text-gray-300">
                <th className="px-6 py-4 font-semibold text-sm">User</th>
                <th className="px-6 py-4 font-semibold text-sm">Email</th>
                <th className="px-6 py-4 font-semibold text-sm">Joined</th>
                <th className="px-6 py-4 font-semibold text-sm w-[200px]">Role</th>
                <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mosque/5 dark:divide-white/5">
              {profiles?.map((profile) => (
                <tr key={profile.id} className="hover:bg-mosque/5 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-mosque/10 flex items-center justify-center text-mosque">
                        <span className="material-symbols-rounded">person</span>
                      </div>
                      <span className="font-semibold text-nordic-dark dark:text-white">User</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-nordic-dark/70 dark:text-gray-400">{profile.email}</td>
                  <td className="px-6 py-4 text-sm text-nordic-dark/60 dark:text-gray-400">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <RoleSwitcher userId={profile.id} currentRole={profile.role} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-nordic-dark/40 dark:text-white/40 hover:text-nordic-dark dark:hover:text-white transition-colors">
                      <span className="material-symbols-rounded">more_vert</span>
                    </button>
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
