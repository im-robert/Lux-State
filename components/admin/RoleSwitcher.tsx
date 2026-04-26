"use client";

import React, { useState, useRef, useEffect } from "react";
import { updateUserRole } from "@/lib/actions/admin";
import { motion, AnimatePresence } from "framer-motion";

interface RoleSwitcherProps {
  userId: string;
  currentRole: "admin" | "user";
}

export function RoleSwitcher({ userId, currentRole }: RoleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRoleChange = async (newRole: "admin" | "user") => {
    if (newRole === currentRole) {
      setIsOpen(false);
      return;
    }

    setLoading(true);
    setIsOpen(false);
    try {
      const result = await updateUserRole(userId, newRole);
      if (!result.success) {
        alert("Failed to update role: " + result.error);
      }
    } catch (error) {
      alert("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full md:w-auto" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className={`inline-flex items-center px-4 py-2 border border-nordic/10 bg-white dark:bg-gray-800 shadow-sm text-xs font-medium rounded-lg text-nordic dark:text-white hover:bg-nordic hover:text-white focus:outline-none transition-all w-full md:w-auto justify-center group ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? (
          <span className="material-symbols-rounded animate-spin text-[16px] mr-2">sync</span>
        ) : null}
        Change Role
        <span className={`material-icons text-[16px] ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-48 rounded-lg shadow-dropdown bg-primary ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden z-50 origin-top-right"
          >
            <div className="py-1">
              <button
                onClick={() => handleRoleChange("admin")}
                className={`w-full group flex items-center px-4 py-3 text-xs transition-colors ${
                  currentRole === 'admin' 
                    ? 'bg-white/20 text-white font-medium' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="material-icons text-sm mr-3 text-white/50 group-hover:text-white">shield</span>
                Administrator
              </button>
              <button
                onClick={() => handleRoleChange("user")}
                className={`w-full group flex items-center px-4 py-3 text-xs transition-colors ${
                  currentRole === 'user' 
                    ? 'bg-white/20 text-white font-medium' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="material-icons text-sm mr-3 text-white/50 group-hover:text-white">person</span>
                Regular User
              </button>
              <div className="border-t border-white/10 my-1"></div>
              <button
                className="w-full group flex items-center px-4 py-3 text-xs text-red-200 hover:bg-red-500/20 hover:text-red-100 transition-colors"
                onClick={() => alert("Suspend functionality coming soon")}
              >
                <span className="material-icons text-sm mr-3 text-red-300 group-hover:text-red-100">block</span>
                Suspend User
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
