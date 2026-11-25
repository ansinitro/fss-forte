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
      className="group block p-5 rounded-2xl border border-[#EAEBEF] bg-white hover:border-[#A31551]/40 card-hover shadow-forte"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 rounded-lg bg-[#FDF2F7] flex items-center justify-center text-[#4A0221] group-hover:bg-[#A31551] group-hover:text-white transition-colors">
          <Compass className="w-4 h-4" />
        </div>
        {badge && (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FDF2F7] text-[#A31551]">
            {badge}
          </span>
        )}
      </div>
      <h3 className="font-bold text-[#1D1D1D] group-hover:text-[#A31551] transition-colors text-base leading-snug">
        {title}
      </h3>
      <p className="mt-2 text-xs text-[#69758B] leading-relaxed line-clamp-2">
        {description}
      </p>
      <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#A31551] group-hover:translate-x-0.5 transition-transform">
        <span>{t.common.explore}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </Link>
  );
};
