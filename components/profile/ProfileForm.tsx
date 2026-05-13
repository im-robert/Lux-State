"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { updateProfile } from "@/lib/actions/profile";
import { motion } from "framer-motion";

interface ProfileFormProps {
  initialData: {
    full_name: string | null;
    phone: string | null;
    bio: string | null;
    email: string;
  };
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    full_name: initialData.full_name || "",
    phone: initialData.phone || "",
    bio: initialData.bio || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setMessage({ type: "success", text: t("profile.success") });
      } else {
        setMessage({ type: "error", text: t("profile.error") });
      }
    } catch (error) {
      setMessage({ type: "error", text: t("profile.error") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-nordic-dark/50 dark:text-gray-400 px-1">
            {t("profile.fullName")}
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-rounded text-nordic-dark/30 text-xl">person</span>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full bg-white dark:bg-[#1a3833] border border-black/5 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-nordic-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-mosque/20 transition-all"
              placeholder="John Doe"
            />
          </div>
        </div>

        {/* Email (Read-only) */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-nordic-dark/50 dark:text-gray-400 px-1">
            {t("profile.email")}
          </label>
          <div className="relative opacity-60">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-rounded text-nordic-dark/30 text-xl">mail</span>
            <input
              type="email"
              value={initialData.email}
              readOnly
              className="w-full bg-black/5 dark:bg-black/20 border border-transparent rounded-xl py-3 pl-12 pr-4 text-nordic-dark dark:text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-nordic-dark/50 dark:text-gray-400 px-1">
            {t("profile.phone")}
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-rounded text-nordic-dark/30 text-xl">call</span>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-white dark:bg-[#1a3833] border border-black/5 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-nordic-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-mosque/20 transition-all"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-nordic-dark/50 dark:text-gray-400 px-1">
          {t("profile.bio")}
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={4}
          className="w-full bg-white dark:bg-[#1a3833] border border-black/5 dark:border-white/10 rounded-xl py-4 px-4 text-nordic-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-mosque/20 transition-all resize-none"
          placeholder="Tell us about yourself..."
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-8 py-3.5 bg-mosque hover:bg-mosque-dark text-white font-bold rounded-xl shadow-soft hover:shadow-soft-hover transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span>
              {t("profile.saving")}
            </>
          ) : (
            <>
              <span className="material-symbols-rounded">save</span>
              {t("profile.saveChanges")}
            </>
          )}
        </button>

        {message && (
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`text-sm font-semibold ${message.type === "success" ? "text-green-500" : "text-red-500"}`}
          >
            {message.text}
          </motion.p>
        )}
      </div>
    </form>
  );
}
