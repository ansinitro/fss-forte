"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  Award, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Laptop 
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { api } from "@/lib/api";
import { Opportunity } from "@/lib/types";
import { VerificationBadge } from "@/components/common/VerificationBadge";

export default function OpportunitiesPage() {
  const { lang, t } = useI18n();
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOpps() {
      setLoading(true);
      const data = await api.getOpportunities(selectedType || undefined);
      setOpps(Array.isArray(data) ? data : []);
      setLoading(false);
    }
    loadOpps();
  }, [selectedType]);

  const filteredOpps = (opps || []).filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = lang === "kz" ? o.title_kz : o.title_ru;
    const prov = lang === "kz" ? o.provider_kz : o.provider_ru;
    return title.toLowerCase().includes(q) || prov.toLowerCase().includes(q);
  });

  const getOppTypeBadge = (type: string) => {
    switch (type) {
      case "course":
        return { label_kz: "IT-курс / Ваучер", label_ru: "ИТ-курс / Ваучер", color: "bg-emerald-50 text-emerald-700 border-emerald-200/60" };
      case "olympiad":
        return { label_kz: "Олимпиада", label_ru: "Олимпиада", color: "bg-blue-50 text-blue-700 border-blue-200/60" };
      case "mentorship":
        return { label_kz: "Стартап / Инкубация", label_ru: "Стартап / Инкубация", color: "bg-purple-50 text-purple-700 border-purple-200/60" };
      case "hackathon":
        return { label_kz: "Хакатон", label_ru: "Хакатон", color: "bg-amber-50 text-amber-700 border-amber-200/60" };
      default:
        return { label_kz: "Мүмкіндік", label_ru: "Возможность", color: "bg-zinc-100 text-zinc-700 border-zinc-200" };
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] text-xs font-semibold border border-[#F99184]/40">
          <Sparkles className="w-3.5 h-3.5" />
          <span>4-бөлім / Раздел 4</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          {t.sections.opportunitiesTitle}
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base max-w-2xl leading-relaxed">
          {t.sections.opportunitiesDesc}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === "kz" ? "Мүмкіндік атауы немесе бағыты бойынша іздеу..." : "Поиск по названию программы или направлению..."}
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

        {/* Opportunity type filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedType("")}
            className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedType === ""
                ? "bg-[#A31551] text-white shadow-forte"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            {t.common.all}
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("course")}
            className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedType === "course"
                ? "bg-[#A31551] text-white shadow-forte"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            {lang === "kz" ? "Тегін курстар (Tech Orda)" : "Курсы (Tech Orda)"}
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("olympiad")}
            className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedType === "olympiad"
                ? "bg-[#A31551] text-white shadow-forte"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            {lang === "kz" ? "Олимпиадалар" : "Олимпиады"}
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("mentorship")}
            className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedType === "mentorship"
                ? "bg-[#A31551] text-white shadow-forte"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            {lang === "kz" ? "Стартап инкубация" : "Инкубация стартапов"}
          </button>
        </div>
      </div>

      {/* Opportunities Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-zinc-400">
          {lang === "kz" ? "Мүмкіндіктер жүктелуде..." : "Загрузка возможностей..."}
        </div>
      ) : filteredOpps.length === 0 ? (
        <div className="py-16 text-center text-xs text-zinc-500 bg-white rounded-3xl border border-zinc-200">
          {t.common.noResults}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredOpps.map((opp) => {
            const badge = getOppTypeBadge(opp.opportunity_type);
            return (
              <div
                key={opp.id}
                className="p-6 rounded-3xl border border-zinc-200 bg-white hover:border-[#F99184]/50 card-hover shadow-xs hover:shadow-forte flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${badge.color}`}>
                      {lang === "kz" ? badge.label_kz : badge.label_ru}
                    </span>
                    <VerificationBadge status={opp.status} compact />
                  </div>

                  <Link href={`/opportunities/${opp.slug}`} className="block group">
                    <h3 className="font-bold text-zinc-900 text-lg group-hover:text-[#A31551] transition-colors leading-snug">
                      {lang === "kz" ? opp.title_kz : opp.title_ru}
                    </h3>
                  </Link>

                  <div className="text-xs text-zinc-500 font-medium">
                    {lang === "kz" ? opp.provider_kz : opp.provider_ru}
                  </div>

                  <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2">
                    {lang === "kz" ? opp.description_kz : opp.description_ru}
                  </p>

                  {/* Benefits highlight */}
                  <div className="p-3 rounded-xl bg-[#FDF2F7]/60 border border-[#F99184]/30 text-xs text-[#4A0221]">
                    <span className="font-semibold">{lang === "kz" ? "Қатысушы не алады: " : "Что получает участник: "}</span>
                    <span>{lang === "kz" ? opp.benefits_kz : opp.benefits_ru}</span>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span>
                      {opp.location_mode === "in_person_astana" ? "Астана қаласы (Офлайн)" : "Астана / Онлайн"}
                    </span>
                  </div>

                  <Link
                    href={`/opportunities/${opp.slug}`}
                    className="font-semibold text-[#A31551] hover:text-[#820232] flex items-center gap-1 group"
                  >
                    <span>{t.common.explore}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
