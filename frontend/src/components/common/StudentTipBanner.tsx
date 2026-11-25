"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lightbulb, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface Props {
  title_kz: string;
  title_ru: string;
  tip_kz: string;
  tip_ru: string;
  actionHref?: string;
  actionLabel_kz?: string;
  actionLabel_ru?: string;
}

export const StudentTipBanner: React.FC<Props> = ({
  title_kz,
  title_ru,
  tip_kz,
  tip_ru,
  actionHref = "/booklet",
  actionLabel_kz = "Буклетті ашу",
  actionLabel_ru = "Открыть буклет абитуриента",
}) => {
  const { lang } = useI18n();
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded-2xl border border-[#F99184]/40 bg-gradient-to-r from-[#FDF2F7] via-white to-[#FDF2F7]/50 px-4 py-3.5 shadow-2xs">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#A31551] text-white flex items-center justify-center shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1.5 text-left font-extrabold text-xs sm:text-sm text-[#4A0221]"
            >
              <span>{lang === "kz" ? title_kz : title_ru}</span>
              {expanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-[#A31551]" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-[#A31551]" />
              )}
            </button>
            {expanded && (
              <p className="text-xs text-zinc-600 leading-relaxed max-w-3xl">
                {lang === "kz" ? tip_kz : tip_ru}
              </p>
            )}
          </div>
        </div>

        <Link
          href={actionHref}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#F99184]/50 text-[#A31551] hover:bg-[#A31551] hover:text-white text-[11px] font-bold transition-colors shrink-0"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{lang === "kz" ? actionLabel_kz : actionLabel_ru}</span>
        </Link>
      </div>
    </div>
  );
};
