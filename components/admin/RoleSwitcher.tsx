"use client";

import React, { useState } from "react";
import { updateUserRole } from "@/lib/actions/admin";

interface RoleSwitcherProps {
  userId: string;
  currentRole: "admin" | "user";
}

export function RoleSwitcher({ userId, currentRole }: RoleSwitcherProps) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as "admin" | "user";
    if (newRole === currentRole) return;

    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      e.target.value = currentRole;
      return;
    }

    setLoading(true);
    try {
      const result = await updateUserRole(userId, newRole);
      if (!result.success) {
        alert("Failed to update role: " + result.error);
        e.target.value = currentRole;
      }
    } catch (error) {
      alert("An unexpected error occurred");
      e.target.value = currentRole;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-block w-full">
      <select
        defaultValue={currentRole}
        onChange={handleChange}
        disabled={loading}
        className={`w-full bg-white dark:bg-nordic-dark/50 border border-mosque/10 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-mosque/50 outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 ${
          currentRole === 'admin' ? 'text-mosque font-bold' : 'text-nordic-dark/70 dark:text-gray-300'
        }`}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-nordic-dark/30 dark:text-white/30">
        {loading ? (
          <span className="material-symbols-rounded animate-spin text-sm">sync</span>
        ) : (
          <span className="material-symbols-rounded text-sm">unfold_more</span>
        )}
      </div>
    </div>
  );
}
