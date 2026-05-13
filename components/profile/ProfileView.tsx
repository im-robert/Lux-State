"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import ProfileForm from "./ProfileForm";
import ProfileActivity from "./ProfileActivity";
import AvatarUpload from "./AvatarUpload";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProfileViewProps {
  profile: any;
  stats: any;
  user: any;
}

export default function ProfileView({ profile, stats, user }: ProfileViewProps) {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-2">
        <Link 
          href="/"
          className="group flex items-center gap-4 text-nordic-dark/60 hover:text-mosque transition-all"
        >
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#1a3833] shadow-soft flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="material-symbols-rounded text-2xl">arrow_back</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase font-bold tracking-[0.2em] opacity-50">{t("common.back")}</span>
            <span className="text-lg font-black tracking-tight flex items-center gap-1">
              Lux<span className="text-mosque">State</span>
            </span>
          </div>
        </Link>

        <nav className="hidden sm:flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-nordic-dark/30">
          <Link href="/" className="hover:text-mosque transition-colors">LuxState</Link>
          <span className="material-symbols-rounded text-xs">chevron_right</span>
          <span className="text-nordic-dark/60 dark:text-gray-400">{t("nav.profile")}</span>
        </nav>
      </div>

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-[#152e2a] p-8 rounded-3xl shadow-soft border border-black/5 dark:border-white/5"
      >
        <AvatarUpload currentUrl={profile.avatar_url} userId={user.id} />
        
        <div className="text-center md:text-left space-y-2 flex-1">
          <h1 className="text-4xl font-black text-nordic-dark dark:text-white tracking-tight">
            {profile.full_name || user.email?.split("@")[0]}
          </h1>
          <p className="text-nordic-dark/50 dark:text-gray-400 font-medium">
            {user.email}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
            <span className="px-3 py-1 bg-mosque/10 text-mosque text-xs font-bold rounded-full uppercase tracking-wider">
              {profile.role || "User"}
            </span>
            <span className="px-3 py-1 bg-black/5 dark:bg-white/5 text-nordic-dark/40 dark:text-gray-500 text-xs font-bold rounded-full uppercase tracking-wider">
              {t("profile.memberSince")} {new Date(profile.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <ProfileActivity stats={stats} />

      {/* Form Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-[#152e2a] p-8 md:p-10 rounded-3xl shadow-soft border border-black/5 dark:border-white/5"
      >
        <h2 className="text-2xl font-black text-nordic-dark dark:text-white mb-8 flex items-center gap-3">
          <span className="material-symbols-rounded text-mosque">settings</span>
          {t("profile.title")}
        </h2>
        
        <ProfileForm 
          initialData={{
            full_name: profile.full_name,
            phone: profile.phone,
            bio: profile.bio,
            email: user.email!
          }} 
        />
      </motion.div>
    </div>
  );
}
