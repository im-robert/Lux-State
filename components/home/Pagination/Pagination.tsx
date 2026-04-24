"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  function buildHref(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `?${params.toString()}`;
  }

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Property pagination"
      className="mt-12 flex items-center justify-center gap-2"
    >
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white border border-nordic-dark/10 text-nordic-dark text-sm font-medium hover:border-mosque hover:text-mosque transition-all hover:shadow-md"
        >
          <span className="material-icons text-sm">chevron_left</span>
          {t("common.prev")}
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white border border-nordic-dark/5 text-nordic-muted text-sm font-medium cursor-not-allowed">
          <span className="material-icons text-sm">chevron_left</span>
          {t("common.prev")}
        </span>
      )}

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <Link
            key={page}
            href={buildHref(page)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
              page === currentPage
                ? "bg-nordic-dark text-white shadow-sm"
                : "bg-white border border-nordic-dark/10 text-nordic-dark hover:border-mosque hover:text-mosque hover:shadow-md"
            }`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        ))}
      </div>

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white border border-nordic-dark/10 text-nordic-dark text-sm font-medium hover:border-mosque hover:text-mosque transition-all hover:shadow-md"
        >
          {t("common.next")}
          <span className="material-icons text-sm">chevron_right</span>
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white border border-nordic-dark/5 text-nordic-muted text-sm font-medium cursor-not-allowed">
          {t("common.next")}
          <span className="material-icons text-sm">chevron_right</span>
        </span>
      )}
    </nav>
  );
}
