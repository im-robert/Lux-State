"use client";

import React from "react";
import Link from "next/link";
import { LanguageSelector } from "./LanguageSelector";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/AuthContext";
import { useState } from "react";

export function Navbar() {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background-light/95 backdrop-blur-md border-b border-nordic-dark/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-nordic-dark flex items-center justify-center">
              <span className="material-icons text-white text-lg">apartment</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-nordic-dark">LuxeEstate</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <a className="text-mosque font-medium text-sm border-b-2 border-mosque px-1 py-1" href="#">{t("nav.buy")}</a>
            <a className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all" href="#">{t("nav.rent")}</a>
            <a className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all" href="#">{t("nav.sell")}</a>
            <a className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all" href="#">{t("nav.saved")}</a>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>
            <div className="flex items-center space-x-4 pl-4 border-l border-nordic-dark/10">
              <button className="text-nordic-dark hover:text-mosque transition-colors">
                <span className="material-icons">search</span>
              </button>
              <button className="text-nordic-dark hover:text-mosque transition-colors relative">
                <span className="material-icons">notifications_none</span>
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light"></span>
              </button>
              
              <div className="relative">
                {user ? (
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2"
                  >
                    <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all">
                      <img 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                        src={user.user_metadata.avatar_url || "https://www.gravatar.com/avatar/?d=mp"}
                      />
                    </div>
                  </button>
                ) : (
                  <Link 
                    href="/login"
                    className="bg-mosque text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-primary-dark transition-all shadow-soft hover:shadow-soft-hover"
                  >
                    {t("nav.login") || "Login"}
                  </Link>
                )}

                {isDropdownOpen && user && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-soft-hover border border-nordic-dark/5 py-2 z-50">
                    <div className="px-4 py-2 border-b border-nordic-dark/5 mb-1">
                      <p className="text-xs text-nordic-dark/50">{t("nav.signedInAs") || "Signed in as"}</p>
                      <p className="text-sm font-semibold text-nordic-dark truncate">{user.email}</p>
                    </div>
                    <button 
                      onClick={() => {
                        signOut();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <span className="material-icons text-lg">logout</span>
                      {t("nav.signOut") || "Sign Out"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden border-t border-nordic-dark/5 bg-background-light overflow-hidden h-0 transition-all duration-300">
        <div className="px-4 py-2 space-y-1">
          <a className="block px-3 py-2 rounded-md text-base font-medium text-mosque bg-mosque/10" href="#">{t("nav.buy")}</a>
          <a className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5" href="#">{t("nav.rent")}</a>
          <a className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5" href="#">{t("nav.sell")}</a>
          <a className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5" href="#">{t("nav.saved")}</a>
          <div className="pt-2 px-3">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </nav>
  );
}
