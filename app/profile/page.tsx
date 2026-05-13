import React from "react";
import { getProfile, getProfileStats } from "@/lib/actions/profile";
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileView from "@/components/profile/ProfileView";

export const metadata = {
  title: "My Profile | Lux-State",
  description: "Manage your Lux-State account and preferences.",
};

export default async function ProfilePage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [profile, stats] = await Promise.all([
    getProfile(),
    getProfileStats()
  ]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-nordic-dark/50">Error loading profile. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pt-32 pb-20 px-4 antialiased">
      <ProfileView profile={profile} stats={stats} user={user} />
    </div>
  );
}
