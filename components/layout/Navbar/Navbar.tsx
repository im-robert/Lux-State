"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { LanguageSelector } from "./LanguageSelector";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/AuthContext";

export function Navbar() {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-background-light/95 backdrop-blur-md border-b border-nordic-dark/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-mosque flex items-center justify-center shadow-soft">
              <span className="material-icons text-white text-xl">apartment</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-nordic-dark">
              Lux<span className="text-mosque">State</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a className="text-mosque font-semibold text-sm relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-mosque" href="#">
              {t("nav.buy")}
            </a>
            <a className="text-nordic-dark/60 hover:text-nordic-dark font-medium text-sm transition-colors" href="#">
              {t("nav.rent")}
            </a>
            <a className="text-nordic-dark/60 hover:text-nordic-dark font-medium text-sm transition-colors" href="#">
              {t("nav.sell")}
            </a>
            <a className="text-nordic-dark/60 hover:text-nordic-dark font-medium text-sm transition-colors" href="#">
              {t("nav.saved")}
            </a>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>
            
            <div className="h-8 w-[1px] bg-nordic-dark/10 mx-2 hidden sm:block"></div>

            <div className="flex items-center gap-2">
              <button className="p-2 text-nordic-dark/70 hover:text-mosque transition-colors">
                <span className="material-icons">search</span>
              </button>

              <div className="relative" ref={dropdownRef}>
                {user ? (
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-black/5 transition-all"
                  >
                    <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all shadow-sm">
                      <img
                        alt="Profile"
                        className="w-full h-full object-cover"
                        src={user.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${user.email}&background=006655&color=fff`}
                      />
                    </div>
                    <span className="material-icons text-nordic-dark/40 text-sm hidden sm:block">
                      {isDropdownOpen ? "expand_less" : "expand_more"}
                    </span>
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="bg-mosque text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-all shadow-soft hover:shadow-soft-hover transform hover:-translate-y-0.5"
                  >
                    {t("nav.login")}
                  </Link>
                )}

                {/* Premium Dropdown */}
                {isDropdownOpen && user && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-soft-hover border border-nordic-dark/5 py-3 z-50 transform origin-top-right transition-all">
                    <div className="px-5 py-3 border-b border-nordic-dark/5 mb-2">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-nordic-dark/40 mb-1">
                        {t("nav.signedInAs")}
                      </p>
                      <p className="text-sm font-bold text-nordic-dark truncate">
                        {user.email}
                      </p>
                    </div>
                    
                    <div className="px-2">
                      <button className="w-full text-left px-3 py-2.5 text-sm text-nordic-dark/70 hover:bg-black/5 hover:text-nordic-dark rounded-xl transition-colors flex items-center gap-3">
                        <span className="material-icons text-xl">person_outline</span>
                        {t("nav.profile")}
                      </button>
                      <button className="w-full text-left px-3 py-2.5 text-sm text-nordic-dark/70 hover:bg-black/5 hover:text-nordic-dark rounded-xl transition-colors flex items-center gap-3">
                        <span className="material-icons text-xl">favorite_border</span>
                        {t("nav.saved")}
                      </button>
                      
                      <div className="h-[1px] bg-nordic-dark/5 my-2 mx-3"></div>
                      
                      <button
                        onClick={() => {
                          signOut();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                          <span className="material-icons text-lg">logout</span>
                        </div>
                        <span className="font-semibold">{t("nav.signOut")}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-nordic-dark"
              >
                <span className="material-icons">{isMobileMenuOpen ? "close" : "menu"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-[500px] border-t border-nordic-dark/5" : "max-h-0"}`}>
        <div className="px-4 py-6 bg-background-light space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <a className="flex items-center justify-center px-4 py-3 rounded-xl bg-mosque/10 text-mosque font-bold text-sm" href="#">{t("nav.buy")}</a>
            <a className="flex items-center justify-center px-4 py-3 rounded-xl bg-black/5 text-nordic-dark font-semibold text-sm" href="#">{t("nav.rent")}</a>
            <a className="flex items-center justify-center px-4 py-3 rounded-xl bg-black/5 text-nordic-dark font-semibold text-sm" href="#">{t("nav.sell")}</a>
            <a className="flex items-center justify-center px-4 py-3 rounded-xl bg-black/5 text-nordic-dark font-semibold text-sm" href="#">{t("nav.saved")}</a>
          </div>

          <div className="pt-2">
            {user ? (
              <div className="bg-white rounded-2xl p-4 shadow-soft border border-nordic-dark/5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden ring-2 ring-mosque/20">
                    <img
                      src={user.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${user.email}&background=006655&color=fff`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-nordic-dark truncate max-w-[180px]">{user.email}</p>
                    <p className="text-xs text-nordic-dark/50">{t("nav.signedInAs")}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl font-bold transition-colors"
                >
                  <span className="material-icons text-lg">logout</span>
                  {t("nav.signOut")}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center bg-mosque text-white px-4 py-4 rounded-2xl font-bold shadow-soft"
              >
                {t("nav.login")}
              </Link>
            )}
          </div>

          <div className="flex justify-center pt-2">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </nav>
  );
}
