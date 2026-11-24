"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface Props {
  title: string;
  description: string;
  href: string;
  badge?: string;
}

export const PathwayCard: React.FC<Props> = ({ title, description, href, badge }) => {
  const { t } = useI18n();

  return (
    <Link
      href={href}
      className="group block p-5 rounded-2xl border border-zinc-200/90 bg-white hover:border-zinc-300 card-hover shadow-xs"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
          <Compass className="w-4 h-4" />
        </div>
        {badge && (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
            {badge}
          </span>
        )}
      </div>
      <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors text-base leading-snug">
        {title}
      </h3>
      <p className="mt-2 text-xs text-zinc-500 leading-relaxed line-clamp-2">
        {description}
      </p>
      <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
        <span>{t.common.explore}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </Link>
  );
};
