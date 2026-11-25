"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Search,
  ShieldCheck,
  AlertCircle,
  Terminal,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { api } from "@/lib/api";
import { Deadline } from "@/lib/types";

export default function DeadlinesPage() {
  const { lang } = useI18n();
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await api.getDeadlines();
      setDeadlines(Array.isArray(data) ? data : []);
      setLoading(false);
    }
    load();
  }, []);

  const filteredDeadlines = (deadlines || []).filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return d.title_kz.toLowerCase().includes(q) || d.title_ru.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] text-xs font-semibold border border-[#F99184]/40">
          <Calendar className="w-3.5 h-3.5 text-[#A31551]" />
          <span>{lang === "kz" ? "Мерзімдер күнтізбесі" : "Календарь важных дедлайнов"}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          {lang === "kz" ? "Қабылдау және Гранттар мерзімі 2026/2027" : "Сроки приема и дедлайны грантов 2026/2027"}
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base max-w-2xl leading-relaxed">
          {lang === "kz"
            ? "Мемлекеттік гранттар, Астана әкімі гранттары, колледждер мен ЖОО-ларға құжат қабылдаудың бекітілген мерзімдері."
            : "Сроки подачи документов на государственные гранты, гранты акима Астаны, в колледжи и вузы."}
        </p>
      </div>

      {/* Search and API bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === "kz" ? "Мерзім немесе конкурс атауы бойынша іздеу..." : "Поиск по названию конкурса или дедлайна..."}
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
          <span>{lang === "kz" ? "/api/v1/deadlines тексеру" : "Проверить через API"}</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Deadlines Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-zinc-400">
          {lang === "kz" ? "Мерзімдер жүктелуде..." : "Загрузка дедлайнов..."}
        </div>
      ) : filteredDeadlines.length === 0 ? (
        <div className="py-16 text-center text-xs text-zinc-500 bg-white rounded-3xl border border-zinc-200">
          {lang === "kz" ? "Мерзімдер табылмады" : "Дедлайны не найдены"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDeadlines.map((dl) => (
            <div
              key={dl.id}
              className="p-6 rounded-3xl border border-zinc-200 bg-white hover:border-zinc-300 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 capitalize">
                    {dl.academic_year}
                  </span>
                  {dl.is_confirmed ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{lang === "kz" ? "Бекітілген" : "Подтвержден"}</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                      {lang === "kz" ? "Жоба" : "Проект"}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-zinc-900 text-base leading-snug">
                  {lang === "kz" ? dl.title_kz : dl.title_ru}
                </h3>

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100/80 space-y-1 text-xs">
                  <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>
                      {dl.start_date ? `${dl.start_date} — ` : ""}
                      {dl.end_date}
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-800">
                    {lang === "kz" ? "Құжат тапсырудың соңғы күні:" : "Крайний срок подачи:"} <strong>{dl.end_date}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <Link
                  href="/grants"
                  className="text-[#A31551] hover:text-[#820232] font-semibold"
                >
                  {lang === "kz" ? "Гранттарға өту →" : "Перейти к грантам →"}
                </Link>

                <span className="text-zinc-400 font-mono text-[11px]">
                  {dl.entity_type}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
