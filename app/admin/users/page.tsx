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
    <div className="max-w-7xl mx-auto w-full pb-12 space-y-4">
      <header class="w-full pt-8 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-nordic dark:text-white">User Directory</h1>
            <p className="text-nordic/60 dark:text-gray-400 mt-1 text-sm">Manage user access and roles for your properties.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative group w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-icons text-nordic/40 group-focus-within:text-primary text-xl">search</span>
              </div>
              <input 
                className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-white dark:bg-gray-800 text-nordic dark:text-white shadow-soft placeholder-nordic/30 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm" 
                placeholder="Search by name, email..." 
                type="text"
              />
            </div>
            <button className="inline-flex items-center justify-center px-4 py-2.5 border border-primary text-sm font-medium rounded-lg text-primary bg-transparent hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors whitespace-nowrap">
              <span className="material-icons text-lg mr-2">add</span>
              Add User
            </button>
          </div>
        </div>
        <div className="mt-8 flex gap-6 border-b border-nordic/10 overflow-x-auto">
          <button className="pb-3 text-sm font-semibold text-primary border-b-2 border-primary">All Users</button>
          <button className="pb-3 text-sm font-medium text-nordic/60 hover:text-nordic transition-colors">Agents</button>
          <button className="pb-3 text-sm font-medium text-nordic/60 hover:text-nordic transition-colors">Brokers</button>
          <button className="pb-3 text-sm font-medium text-nordic/60 hover:text-nordic transition-colors">Admins</button>
        </div>
      </header>

      <main className="space-y-4">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 text-xs font-semibold uppercase tracking-wider text-nordic/50 mb-2">
          <div className="col-span-4">User Details</div>
          <div className="col-span-3">Role & Status</div>
          <div className="col-span-3">Performance</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {profiles?.map((profile) => (
          <div key={profile.id} className="user-card group relative bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-active-green dark:hover:bg-primary/20 flex flex-col md:grid md:grid-cols-12 gap-4 items-center transition-all">
            <div className="col-span-12 md:col-span-4 flex items-center w-full">
              <div className="relative flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-nordic/10 flex items-center justify-center text-nordic/60 border-2 border-white dark:border-primary overflow-hidden">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
              </div>
              <div className="ml-4 overflow-hidden">
                <div className="text-sm font-bold text-nordic dark:text-white truncate">User</div>
                <div className="text-xs text-nordic/60 dark:text-gray-400 truncate">{profile.email}</div>
                <div className="mt-1 text-[10px] px-2 py-0.5 inline-block bg-gray-50 dark:bg-white/10 rounded text-nordic/50 dark:text-gray-400 group-hover:bg-white/50 transition-colors">
                  ID: #{profile.id.substring(0, 8).toUpperCase()}
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-3 w-full flex items-center justify-between md:justify-start gap-4">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                profile.role === 'admin' 
                  ? 'bg-nordic text-white' 
                  : 'bg-primary/10 text-primary'
              }`}>
                {profile.role === 'admin' ? 'Administrator' : 'User'}
              </span>
              <div className="flex items-center text-xs text-nordic/60 dark:text-gray-400">
                <span className="material-icons text-[14px] mr-1 text-primary">check_circle</span>
                Active
              </div>
            </div>

            <div className="col-span-12 md:col-span-3 w-full grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-nordic/40">Properties</div>
                <div className="text-sm font-semibold text-nordic dark:text-white">0</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-nordic/40">Joined</div>
                <div className="text-sm font-semibold text-nordic dark:text-white">
                  {new Date(profile.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-2 w-full flex justify-end relative">
              <RoleSwitcher userId={profile.id} currentRole={profile.role} />
            </div>
          </div>
        ))}
      </main>

      <footer className="mt-8 border-t border-nordic/5 py-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-nordic/60 dark:text-gray-400">
            Showing <span className="font-medium text-nordic dark:text-white">1</span> to <span className="font-medium text-nordic dark:text-white">{profiles?.length || 0}</span> of <span className="font-medium text-nordic dark:text-white">{profiles?.length || 0}</span> users
          </p>
          <nav className="flex gap-2">
            <button className="px-3 py-1 text-sm border border-nordic/10 rounded-md hover:bg-white transition-colors">Previous</button>
            <button className="px-3 py-1 text-sm border border-nordic/10 rounded-md hover:bg-white transition-colors">Next</button>
          </nav>
        </div>
      </footer>
    </div>
  );
}
