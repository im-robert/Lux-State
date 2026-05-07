"use client";

import React, { useState, useTransition } from "react";
import { togglePropertyStatus } from "@/lib/actions/properties";

interface Props {
  id: string;
  isActive: boolean;
}

export function PropertyStatusToggle({ id, isActive: initialActive }: Props) {
  const [isActive, setIsActive] = useState(initialActive);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleToggle = () => {
    const next = !isActive;
    setIsActive(next); // optimistic update
    setError(null);

    startTransition(async () => {
      const result = await togglePropertyStatus(id, next);
      if (result.error) {
        setIsActive(!next); // revert on error
        setError(result.error);
      }
    });
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        disabled={isPending}
        title={isActive ? "Deactivate property (hide from public)" : "Activate property (show to public)"}
        className={`p-2 rounded-lg transition-all disabled:opacity-50 ${
          isActive
            ? "text-gray-400 hover:text-orange-500 hover:bg-orange-500/10"
            : "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"
        }`}
      >
        <span className="material-icons text-xl">
          {isPending ? "hourglass_empty" : isActive ? "visibility_off" : "visibility"}
        </span>
      </button>
      {error && (
        <div className="absolute bottom-full right-0 mb-1 bg-red-500 text-white text-xs rounded-lg px-3 py-1.5 whitespace-nowrap shadow-lg z-10">
          {error}
        </div>
      )}
    </div>
  );
}
