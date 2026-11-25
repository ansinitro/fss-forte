"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ExternalLink,
  Search,
  FileText,
  Calendar,
  Building,
  CheckCircle2,
  Terminal,
  ArrowRight
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { api } from "@/lib/api";
import { Source } from "@/lib/types";
import { VerificationBadge } from "@/components/common/VerificationBadge";

export default function SourcesPage() {
  const { lang } = useI18n();
  const [sources, setSources] = useState<Source[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await api.getSources();
      setSources(Array.isArray(data) ? data : []);
      setLoading(false);
    }
    load();
  }, []);

  const filteredSources = (sources || []).filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.organization.toLowerCase().includes(q) ||
      s.excerpt.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] text-xs font-semibold border border-[#F99184]/40">
          <ShieldCheck className="w-3.5 h-3.5 text-[#A31551]" />
          <span>{lang === "kz" ? "Дереккөздер каталогы" : "Каталог источников"}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          {lang === "kz" ? "Дереккөздер және Верификация" : "Источники и Верификация данных"}
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base max-w-2xl leading-relaxed">
          {lang === "kz"
            ? "Платформадағы әрбір оқу орны, мамандық, грант және шекті балл мемлекеттік нормативтік құжаттармен (Gov.kz, ҰТО, Әділет, Әкімдік) 100% расталған."
            : "Каждое учебное заведение, специальность, грант и проходной балл на платформе на 100% подтверждены первоисточниками (Gov.kz, НЦТ, Адилет, Акимат)."}
        </p>
      </div>

      {/* Search and stats bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === "kz" ? "Құжат атауы, орган немесе мәтін бойынша іздеу..." : "Поиск по названию документа, органу или тексту..."}
            className="w-full pl-11 pr-11 py-3 rounded-full border border-zinc-200 bg-white text-sm text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:border-[#A31551] focus:ring-2 focus:ring-[#A31551]/20 shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 flex items-center justify-center text-xs transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        <Link
          href="/endpoints"
          className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full bg-[#A31551] hover:bg-[#820232] text-white text-xs font-semibold shadow-forte transition-colors"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>{lang === "kz" ? "API арқылы тексеру" : "Проверить через API"}</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Sources Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-zinc-400">
          {lang === "kz" ? "Дереккөздер жүктелуде..." : "Загрузка источников..."}
        </div>
      ) : filteredSources.length === 0 ? (
        <div className="py-16 text-center text-xs text-zinc-500 bg-white rounded-3xl border border-zinc-200">
          {lang === "kz" ? "Дереккөз табылмады" : "Источники не найдены"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSources.map((source) => (
            <div
              key={source.id}
              className="p-6 rounded-3xl border border-zinc-200 bg-white hover:border-zinc-300 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {source.id}
                  </span>
                  <VerificationBadge status={source.verification_status} compact />
                </div>

                <h3 className="font-bold text-zinc-900 text-base leading-snug">
                  {source.title}
                </h3>

                <div className="flex flex-wrap gap-2 text-xs text-zinc-600">
                  <span className="px-2 py-0.5 rounded-md bg-zinc-100 font-medium">
                    {source.organization}
                  </span>
                  {source.academic_year && (
                    <span className="px-2 py-0.5 rounded-md bg-zinc-100">
                      {source.academic_year}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-500">
                    {lang === "kz" ? "Тексерілді:" : "Проверено:"} {source.retrieved_at}
                  </span>
                </div>

                <p className="text-xs text-zinc-600 bg-zinc-50 p-3 rounded-xl border border-zinc-100 leading-relaxed font-sans italic">
                  "{source.excerpt}"
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A31551] hover:text-[#820232] font-semibold flex items-center gap-1"
                >
                  <span>{lang === "kz" ? "Құжатты ашу" : "Перейти к документу"}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <Link
                  href={`/endpoints`}
                  className="text-zinc-500 hover:text-[#A31551] text-[11px]"
                >
                  /api/v1/sources/{source.id}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
