"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProfileActivityProps {
  stats: {
    favorites: number;
    inquiries: number;
  };
}

export default function ProfileActivity({ stats }: ProfileActivityProps) {
  const { t } = useLanguage();

  const cards = [
    {
      label: t("profile.savedHomesCount"),
      value: stats.favorites,
      icon: "favorite",
      color: "bg-red-50 text-red-500",
      href: "/saved"
    },
    {
      label: t("profile.inquiriesCount"),
      value: stats.inquiries,
      icon: "send",
      color: "bg-blue-50 text-blue-500",
      href: "#"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map((card, index) => (
        <Link key={index} href={card.href}>
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-[#1a3833] border border-black/5 dark:border-white/10 p-6 rounded-2xl shadow-soft hover:shadow-soft-hover transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                <span className="material-symbols-rounded">{card.icon}</span>
              </div>
              <div>
                <p className="text-3xl font-black text-nordic-dark dark:text-white">
                  {card.value}
                </p>
                <p className="text-sm font-bold text-nordic-dark/40 dark:text-gray-400">
                  {card.label}
                </p>
              </div>
              <div className="ml-auto">
                <span className="material-symbols-rounded text-nordic-dark/20 dark:text-white/20">chevron_right</span>
              </div>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
