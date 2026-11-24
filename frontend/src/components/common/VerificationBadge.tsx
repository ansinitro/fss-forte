"use client";

import React from "react";
import { ShieldCheck, AlertCircle, Clock, ExternalLink } from "lucide-react";
import { ContentStatus, Source } from "@/lib/types";
import { useI18n } from "@/lib/i18n/context";

interface Props {
  status: ContentStatus;
  lastVerifiedAt?: string;
  source?: Source;
  compact?: boolean;
}

export const VerificationBadge: React.FC<Props> = ({
  status,
  lastVerifiedAt,
  source,
  compact = false,
}) => {
  const { lang, t } = useI18n();

  const isVerified = status === "verified" || status === "open" || status === "upcoming";

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
          isVerified
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
            : "bg-amber-50 text-amber-700 border border-amber-200/60"
        }`}
      >
        <ShieldCheck className="w-3 h-3 text-emerald-600" />
        {isVerified ? t.verification.verified : t.verification.unknownInfo}
      </span>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/60 p-3.5 text-xs text-zinc-600">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 font-medium text-zinc-900">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{isVerified ? t.verification.verified : t.verification.unknownInfo}</span>
        </div>
        {lastVerifiedAt && (
          <div className="flex items-center gap-1 text-zinc-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{t.verification.lastVerified}: {new Date(lastVerifiedAt).toLocaleDateString(lang === 'kz' ? 'kk-KZ' : 'ru-RU')}</span>
          </div>
        )}
      </div>

      {source && (
        <div className="mt-2.5 pt-2 border-t border-zinc-200/60 flex items-center justify-between gap-2">
          <span className="text-zinc-500 truncate">
            {t.verification.source}: <strong className="text-zinc-700 font-medium">{source.organization}</strong>
          </span>
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium shrink-0"
          >
            <span>{t.verification.officialPortal}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
};
