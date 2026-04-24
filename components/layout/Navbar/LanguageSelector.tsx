"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { languages, Language } from "../../../lib/i18n/translations";

const FlagIcon = ({ country }: { country: string }) => {
  if (country === "US") {
    return (
      <svg className="w-5 h-4 rounded-sm shadow-sm" viewBox="0 0 741 390">
        <path fill="#b22234" d="M0 0h741v390H0z"/>
        <path d="M0 30h741v30H0zm0 60h741v30H0zm0 60h741v30H0zm0 60h741v30H0zm0 60h741v30H0zm0 60h741v30H0z" fill="#fff"/>
        <path fill="#3c3b6e" d="M0 0h296.4v210H0z"/>
        <path fill="#fff" d="M14.8 10.5l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.5 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm-207.2 21l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.5 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm-207.2 21l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.5 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm-207.2 21l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.5 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm-207.2 21l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.5 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm-207.2 21l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.5 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm-207.2 21l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.5 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm-207.2 21l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.5 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm-207.2 21l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.4 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8zm44.5 0l2.1 6.5h6.8l-5.5 4 2.1 6.5-5.5-4-5.5 4 2.1-6.5-5.5-4h6.8z"/>
      </svg>
    );
  }
  if (country === "ES") {
    return (
      <svg className="w-5 h-4 rounded-sm shadow-sm" viewBox="0 0 750 500">
        <path fill="#c60b1e" d="M0 0h750v500H0z"/>
        <path fill="#ffc400" d="M0 125h750v250H0z"/>
        <path fill="#c60b1e" d="M0 375h750v125H0z"/>
      </svg>
    );
  }
  if (country === "FR") {
    return (
      <svg className="w-5 h-4 rounded-sm shadow-sm" viewBox="0 0 900 600">
        <path fill="#ed2939" d="M0 0h900v600H0z"/>
        <path fill="#fff" d="M0 0h600v600H0z"/>
        <path fill="#002395" d="M0 0h300v600H0z"/>
      </svg>
    );
  }
  return null;
};

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/50 hover:bg-white transition-all border border-nordic-dark/5 shadow-sm"
      >
        <FlagIcon country={currentLanguage.flag} />
        <span className="text-sm font-semibold text-nordic-dark uppercase tracking-wider">{currentLanguage.code}</span>
        <span className={`material-symbols-outlined text-sm transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
          expand_more
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-44 py-2 bg-white border border-nordic-dark/10 rounded-2xl shadow-2xl z-[100] animate-in fade-in zoom-in duration-200">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-mosque/5 ${
                language === lang.code ? "text-mosque font-bold bg-mosque/5" : "text-nordic-dark/70 font-medium"
              }`}
            >
              <FlagIcon country={lang.flag} />
              <span>{lang.label}</span>
              {language === lang.code && (
                <span className="material-symbols-outlined text-sm ml-auto">check</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
