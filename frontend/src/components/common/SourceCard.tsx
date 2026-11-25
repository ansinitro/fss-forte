"use client";

import React from "react";
import { FileText, ExternalLink, ShieldCheck } from "lucide-react";
import { Source } from "@/lib/types";
import { useI18n } from "@/lib/i18n/context";

export const SourceCard: React.FC<{ source: Source }> = ({ source }) => {
  const { lang, t } = useI18n();

  return (
    <div className="rounded-2xl border border-[#EAEBEF] bg-white p-4 shadow-forte">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#4A0221] shrink-0" />
          <h4 className="font-bold text-[#1D1D1D] text-sm">{source.title}</h4>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FDF2F7] text-[#A31551] border border-[#FC9385]/40 shrink-0">
          <ShieldCheck className="w-3 h-3 text-[#A31551]" />
          {t.verification.verified}
        </span>
      </div>

      <p className="mt-2 text-xs text-[#2B2D35] leading-relaxed italic bg-[#F7F6F6] p-2.5 rounded-xl border border-[#EAEBEF]">
        &ldquo;{source.excerpt}&rdquo;
      </p>

      <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-[#69758B] gap-2">
        <span>{source.organization} • {source.academic_year || "2026-2027"}</span>
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[#A31551] hover:text-[#820232] font-bold"
        >
          <span>{lang === "kz" ? "Түпнұсқа сілтемесі" : "Ссылка на первоисточник"}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
