"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Briefcase, ArrowRight, BookOpen, GraduationCap, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { api } from "@/lib/api";
import { Career, Direction } from "@/lib/types";
import { VerificationBadge } from "@/components/common/VerificationBadge";

export default function CareersPage() {
  const { lang, t } = useI18n();
  const [careers, setCareers] = useState<Career[]>([]);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [selectedDirection, setSelectedDirection] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [dirsData, careersData] = await Promise.all([
        api.getDirections(),
        api.getCareers(selectedDirection || undefined),
      ]);
      setDirections(dirsData);
      setCareers(careersData);
      setLoading(false);
    }
    loadData();
  }, [selectedDirection]);

  const filteredCareers = careers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = lang === "kz" ? c.title_kz : c.title_ru;
    const desc = lang === "kz" ? c.description_kz : c.description_ru;
    return title.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] text-xs font-semibold border border-[#F99184]/40">
          <Briefcase className="w-3.5 h-3.5" />
          <span>1-бөлім / Раздел 1</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          {t.sections.careersTitle}
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base max-w-2xl leading-relaxed">
          {t.sections.careersDesc}
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === "kz" ? "Мамандық атауы бойынша іздеу..." : "Поиск по названию профессии..."}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:border-[#A31551] focus:ring-1 focus:ring-[#A31551]"
          />
        </div>

        {/* Direction pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedDirection("")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedDirection === ""
                ? "bg-[#A31551] text-white shadow-forte"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            {t.common.all}
          </button>
          {directions.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelectedDirection(d.slug)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedDirection === d.slug
                  ? "bg-[#A31551] text-white shadow-forte"
                  : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              {lang === "kz" ? d.name_kz : d.name_ru}
            </button>
          ))}
        </div>
      </div>

      {/* Careers Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-zinc-400">
          {lang === "kz" ? "Мамандықтар жүктелуде..." : "Загрузка профессий..."}
        </div>
      ) : filteredCareers.length === 0 ? (
        <div className="py-16 text-center text-xs text-zinc-500 bg-white rounded-2xl border border-zinc-200">
          {t.common.noResults}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCareers.map((c) => (
            <Link
              key={c.id}
              href={`/careers/${c.slug}`}
              className="p-5 rounded-2xl border border-zinc-200 bg-white hover:border-[#F99184]/50 card-hover shadow-xs hover:shadow-forte flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#FDF2F7] text-[#A31551] border border-[#F99184]/30">
                    {c.profile_subjects_kz || "ҰБТ бейіні"}
                  </span>
                  <VerificationBadge status={c.status} compact />
                </div>

                <h3 className="font-bold text-zinc-900 text-base group-hover:text-[#A31551] transition-colors leading-snug">
                  {lang === "kz" ? c.title_kz : c.title_ru}
                </h3>

                <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                  {lang === "kz" ? c.description_kz : c.description_ru}
                </p>

                {/* Key Skills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(lang === "kz" ? c.skills_kz : c.skills_ru).slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-zinc-400 text-[11px]">
                  {c.related_institutions?.length || 1} {lang === "kz" ? "Астана оқу орны" : "вузов / колледжей"}
                </span>
                <span className="font-semibold text-[#A31551] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>{t.common.explore}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
