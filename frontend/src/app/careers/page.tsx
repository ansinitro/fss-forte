"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Briefcase, ArrowRight, GraduationCap, Compass, Layers } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { api } from "@/lib/api";
import { Career, Direction, Profession, RegionStat } from "@/lib/types";
import { VerificationBadge } from "@/components/common/VerificationBadge";
import { StudentTipBanner } from "@/components/common/StudentTipBanner";

export default function CareersPage() {
  const { lang, t } = useI18n();
  const [careers, setCareers] = useState<Career[]>([]);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [selectedDirection, setSelectedDirection] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Univision 589 Bachelor Professions
  const [profs, setProfs] = useState<Profession[]>([]);
  const [profCategories, setProfCategories] = useState<RegionStat[]>([]);
  const [profTotal, setProfTotal] = useState(589);
  const [selectedProfCat, setSelectedProfCat] = useState("all");
  const [profSearch, setProfSearch] = useState("");
  const [profLimit, setProfLimit] = useState(36);
  const [loadingProfs, setLoadingProfs] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [dirsData, careersData] = await Promise.all([
        api.getDirections(),
        api.getCareers(selectedDirection || undefined),
      ]);
      setDirections(Array.isArray(dirsData) ? dirsData : []);
      setCareers(Array.isArray(careersData) ? careersData : []);
      setLoading(false);
    }
    loadData();
  }, [selectedDirection]);

  useEffect(() => {
    let active = true;
    async function loadProfs() {
      setLoadingProfs(true);
      const resp = await api.getProfessions({
        category: selectedProfCat,
        search: profSearch.trim(),
        limit: profLimit,
      });
      if (active) {
        setProfs(Array.isArray(resp?.professions) ? resp.professions : []);
        setProfCategories(Array.isArray(resp?.categories) ? resp.categories : []);
        setProfTotal(resp?.total ?? 0);
        setLoadingProfs(false);
      }
    }
    const timer = setTimeout(loadProfs, profSearch ? 180 : 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [selectedProfCat, profSearch, profLimit]);

  const filteredCareers = (careers || []).filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = lang === "kz" ? c.title_kz : c.title_ru;
    const desc = lang === "kz" ? c.description_kz : c.description_ru;
    return title.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] text-xs font-semibold border border-[#F99184]/40">
          <Briefcase className="w-3.5 h-3.5" />
          <span>{lang === "kz" ? "1-бөлім • 589+ мамандық" : "Раздел 1 • 589+ профессий"}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          {t.sections.careersTitle}
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base max-w-3xl leading-relaxed">
          {t.sections.careersDesc}
        </p>
      </div>

      <StudentTipBanner
        title_kz="Мамандық таңдаудағы 3 қарапайым қадам"
        title_ru="Как пользоваться справочником из 589 профессий?"
        tip_kz="1) Қызықты саланы таңда; 2) ҰБТ-да қандай 2 бейіндік пән керегін қара; 3) Сәйкес ГОП кодын (B001–B271) тауып, грант санын тексер."
        tip_ru="Выбери интересную сферу ниже, узнай, какие профильные предметы ЕНТ нужны для старта, и сразу проверь доступные ГОП и количество грантов на это направление."
        actionHref="/programs"
        actionLabel_kz="131 ГОП каталогы"
        actionLabel_ru="Смотреть 131 ГОП"
      />

      {/* SECTION A: Curated Astana Trajectories */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "kz" ? "Негізгі бағыт немесе мамандық іздеу..." : "Поиск по ключевым профессиям столицы..."}
              className="w-full pl-11 pr-11 py-3 rounded-full border border-zinc-200 bg-white text-sm text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:border-[#A31551] focus:ring-2 focus:ring-[#A31551]/20 shadow-xs transition-all"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-100 text-zinc-500 text-xs">✕</button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedDirection("")}
              className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedDirection === "" ? "bg-[#A31551] text-white shadow-forte" : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"}`}
            >
              {t.common.all}
            </button>
            {directions.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDirection(d.slug)}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedDirection === d.slug ? "bg-[#A31551] text-white shadow-forte" : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"}`}
              >
                {lang === "kz" ? d.name_kz : d.name_ru}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-zinc-400">
            {lang === "kz" ? "Мамандықтар жүктелуде..." : "Загрузка профессий..."}
          </div>
        ) : filteredCareers.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-500 bg-white rounded-3xl border border-zinc-200">
            {t.common.noResults}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCareers.map((c) => (
              <Link
                key={c.id}
                href={`/careers/${c.slug}`}
                className="p-5 rounded-3xl border border-zinc-200 bg-white hover:border-[#F99184]/50 card-hover shadow-xs hover:shadow-forte flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] border border-[#F99184]/30">
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
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(lang === "kz" ? c.skills_kz : c.skills_ru).slice(0, 3).map((skill) => (
                      <span key={skill} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
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

      {/* SECTION B: Full 589 Bachelor Professions Directory (Univision RU + KK) */}
      <div className="space-y-5 pt-4 border-t border-zinc-200">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-bold">
              <Layers className="w-3.5 h-3.5 text-[#A31551]" />
              <span>Univision.kz • {lang === "kz" ? "Атлас және реестр" : "Реестр профессий бакалавриата"}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
              {lang === "kz" ? `Қазақстандағы 589 мамандық (${profTotal})` : `Полный справочник профессий РК (${profTotal})`}
            </h2>
          </div>

          <Link
            href="/programs"
            className="text-xs font-bold text-[#A31551] hover:underline flex items-center gap-1"
          >
            <span>{lang === "kz" ? "131 ГОП және балдар →" : "131 ГОП и проходные баллы →"}</span>
          </Link>
        </div>

        {/* Search & Category Filters */}
        <div className="p-5 rounded-3xl border border-[#EAEBEF] bg-white shadow-forte space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={profSearch}
              onChange={(e) => {
                setProfSearch(e.target.value);
                setProfLimit(36);
              }}
              placeholder={lang === "kz" ? "IT, инженер, дәрігер, дизайнер, HR, логист..." : "Поиск по 589 профессиям: программист, врач, инженер, аналитик..."}
              className="w-full pl-11 pr-10 py-3 rounded-full border border-zinc-200 bg-white text-sm text-zinc-900 focus:outline-hidden focus:border-[#A31551]"
            />
            {profSearch && (
              <button type="button" onClick={() => setProfSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-100 text-zinc-500 text-xs">✕</button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => { setSelectedProfCat("all"); setProfLimit(36); }}
              className={`px-3.5 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${selectedProfCat === "all" ? "bg-[#A31551] text-white shadow-forte font-bold" : "bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-zinc-100"}`}
            >
              {lang === "kz" ? "Барлығы (589)" : "Все (589)"}
            </button>
            {profCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => { setSelectedProfCat(cat.id); setProfLimit(36); }}
                className={`px-3.5 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${selectedProfCat === cat.id ? "bg-[#A31551] text-white shadow-forte font-bold" : "bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-zinc-100"}`}
              >
                {lang === "kz" ? cat.name_kk : cat.name_ru} ({cat.count})
              </button>
            ))}
          </div>
        </div>

        {loadingProfs ? (
          <div className="py-12 text-center text-xs text-zinc-400">...</div>
        ) : profs.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-500 bg-white rounded-3xl border border-zinc-200">
            {t.common.noResults}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profs.map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-3xl border border-[#EAEBEF] bg-white hover:border-[#A31551]/30 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2.5">
                    <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FDF2F7] text-[#A31551] border border-[#F99184]/30">
                      {lang === "kz" ? p.category_kk : p.category_ru}
                    </span>
                    <h3 className="font-bold text-zinc-900 text-sm sm:text-base leading-snug">
                      {lang === "kz" ? p.title_kk : p.title_ru}
                    </h3>

                    {p.related_programs && p.related_programs.length > 0 && (
                      <div className="pt-2 border-t border-zinc-100 space-y-1">
                        <div className="text-[10px] font-bold text-zinc-400 uppercase">
                          {lang === "kz" ? "Оқытатын бағдарламалар мен ЖОО:" : "Программы и вузы для обучения:"}
                        </div>
                        {p.related_programs.slice(0, 3).map((rp, idx) => (
                          <div key={idx} className="text-[11px] text-zinc-600 leading-snug">
                            <span className="font-semibold text-zinc-900">{rp.program}</span>
                            <span className="text-zinc-400"> • {rp.university.split("(")[0].trim()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px]">
                    <Link href="/programs" className="font-bold text-[#A31551] hover:underline">
                      {lang === "kz" ? "ГОП таңдау →" : "Подобрать ГОП →"}
                    </Link>
                    <Link href="/calculator" className="text-zinc-500 hover:text-zinc-900">
                      {lang === "kz" ? "Калькулятор" : "Калькулятор"}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {profs.length < profTotal && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setProfLimit((l) => l + 48)}
                  className="px-6 py-3 rounded-full bg-[#A31551] hover:bg-[#820232] text-white text-xs font-bold shadow-forte transition-all"
                >
                  {lang === "kz" ? `Тағы көрсету (${profs.length} / ${profTotal})` : `Показать ещё (${profs.length} из ${profTotal})`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
