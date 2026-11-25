"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Calculator,
  Award,
  Layers,
  X,
  TrendingUp,
  Building2,
  ArrowRight
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { api } from "@/lib/api";
import { StudentHubProgram, StudentHubEntResult, GOPSummary, UnivisionGOP } from "@/lib/types";
import { StudentTipBanner } from "@/components/common/StudentTipBanner";

const SUBJECT_PAIRS = [
  "Барлық пәндер / Все предметы",
  "Математика + Физика",
  "Математика + Информатика",
  "Химия + Биология",
  "Биология + География",
  "География + Математика",
  "Всемирная история + География",
  "Всемирная история + Основы права",
  "Иностранный язык + Всемирная история",
  "Химия + Физика",
  "Казахский язык + Казахская литература",
  "Русский язык + Русская литература",
  "Творческие экзамены"
];

const CITIES = [
  "Барлығы / Все города",
  "Астана", "Алматы", "Шымкент", "Ақтөбе", "Қарағанды",
  "Қостанай", "Павлодар", "Өскемен", "Семей", "Тараз",
  "Ақтау", "Атырау", "Қызылорда"
];

export default function ProgramsCatalogPage() {
  const { lang, t } = useI18n();
  const [activeTab, setActiveTab] = useState<"gops" | "studenthub">("gops");

  // Univision 131 GOPs
  const [gops, setGops] = useState<GOPSummary[]>([]);
  const [gopPairs, setGopPairs] = useState<string[]>([]);
  const [gopSearch, setGopSearch] = useState("");
  const [gopPairFilter, setGopPairFilter] = useState("");
  const [gopSort, setGopSort] = useState<"code" | "grants" | "score">("code");
  const [loadingGops, setLoadingGops] = useState(true);

  // GOP Detail Modal
  const [activeGop, setActiveGop] = useState<UnivisionGOP | null>(null);
  const [loadingGopDetail, setLoadingGopDetail] = useState(false);

  // StudentHub 218 Programs
  const [programs, setPrograms] = useState<StudentHubProgram[]>([]);
  const [entResults, setEntResults] = useState<StudentHubEntResult[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPair, setSelectedPair] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [loadingProgs, setLoadingProgs] = useState(true);

  const openGopDetail = async (code: string) => {
    setLoadingGopDetail(true);
    const detail = await api.getGopByCode(code);
    if (detail) setActiveGop(detail);
    setLoadingGopDetail(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      const gopParam = p.get("gop");
      const cityParam = p.get("city");
      if (gopParam) {
        setActiveTab("gops");
        openGopDetail(gopParam);
      } else if (cityParam) {
        setActiveTab("studenthub");
        setSelectedCity(cityParam);
      }
    }

    async function loadAll() {
      setLoadingGops(true);
      setLoadingProgs(true);
      const [gopsResp, progsResp, entResp] = await Promise.all([
        api.getGops(),
        api.getStudentHubPrograms(),
        api.getStudentHubEntResults(),
      ]);
      setGops(Array.isArray(gopsResp?.gops) ? gopsResp.gops : []);
      setGopPairs(Array.isArray(gopsResp?.pairs) ? gopsResp.pairs : []);
      setPrograms(Array.isArray(progsResp?.programs) ? progsResp.programs : []);
      setEntResults(Array.isArray(entResp?.results) ? entResp.results : []);
      setLoadingGops(false);
      setLoadingProgs(false);
    }
    loadAll();
  }, []);

  const filteredGops = useMemo(() => {
    const list = (gops || []).filter((g) => {
      if (gopSearch.trim()) {
        const q = gopSearch.toLowerCase();
        if (
          !g.code.toLowerCase().includes(q) &&
          !g.title_ru.toLowerCase().includes(q) &&
          !g.title_kk.toLowerCase().includes(q) &&
          !g.pair_ru.toLowerCase().includes(q) &&
          !g.area_ru.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (gopPairFilter && g.pair_ru !== gopPairFilter) return false;
      return true;
    });

    const sorted = [...list];
    if (gopSort === "grants") {
      sorted.sort((a, b) => (b.grants?.full_2025 ?? 0) - (a.grants?.full_2025 ?? 0));
    } else if (gopSort === "score") {
      sorted.sort((a, b) => (a.passing_2025?.general_min ?? 999) - (b.passing_2025?.general_min ?? 999));
    }
    return sorted;
  }, [gops, gopSearch, gopPairFilter, gopSort]);

  const entMap = useMemo(() => {
    const map = new Map<string, StudentHubEntResult>();
    entResults.forEach((e) => map.set(e.slug, e));
    return map;
  }, [entResults]);

  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = p.title.toLowerCase().includes(q);
        const descMatch = p.description?.toLowerCase().includes(q);
        const pairMatch = p.pair.toLowerCase().includes(q);
        const uniMatch = p.universities?.some((u) => u.uni_name.toLowerCase().includes(q) || u.city.toLowerCase().includes(q));
        if (!titleMatch && !descMatch && !pairMatch && !uniMatch) return false;
      }
      if (selectedPair && selectedPair !== "Барлық пәндер / Все предметы" && !p.pair.toLowerCase().includes(selectedPair.toLowerCase())) {
        return false;
      }
      if (selectedCity && selectedCity !== "Барлығы / Все города") {
        const hasCity = p.universities?.some((u) => u.city.toLowerCase().includes(selectedCity.toLowerCase()));
        if (!hasCity) return false;
      }
      return true;
    });
  }, [programs, searchQuery, selectedPair, selectedCity]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
        <Link href="/" className="hover:text-zinc-900 transition-colors">
          {lang === "kz" ? "Басты бет" : "Главная"}
        </Link>
        <span>/</span>
        <Link href="/education" className="hover:text-zinc-900 transition-colors">
          {lang === "kz" ? "Оқу орындары" : "Образование"}
        </Link>
        <span>/</span>
        <span className="text-[#A31551] font-bold">
          {lang === "kz" ? "ГОП және Мамандықтар (131 + 218)" : "ГОП и Специальности (131 + 218)"}
        </span>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] text-xs font-bold border border-[#F99184]/40">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Univision.kz (131 ГОП) + StudentHub.kz (218 ОП)</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          {lang === "kz" ? "Білім беру бағдарламалары мен ГОП каталогы" : "Группы ОП (ГОП B001–B271) и Специальности"}
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base max-w-3xl leading-relaxed">
          {lang === "kz"
            ? "Грант байқауы дәл осы ГОП кодтары бойынша өтеді. Әр топтың 2024–2025 жылдардағы грант саны, ЖОО-лардың шекті балдары және нақты өту балдары."
            : "Конкурс на гранты в РК проходит по кодам ГОП (групп образовательных программ). Смотрите точное количество грантов, пороги каждого вуза и проходные баллы."}
        </p>
      </div>

      <StudentTipBanner
        title_kz="ГОП (B001–B271) деген не және оны қалай таңдайды?"
        title_ru="Что такое ГОП (B001–B271) и зачем он нужен?"
        tip_kz="Шілдеде грантқа өтініш бергенде сен нақты мамандыққа емес, ГОП кодына (мысалы, B057 — Ақпараттық технологиялар) тапсырасың. Кез келген ГОП картасын ашып, ЖОО-лардағы өту балдарын қара!"
        tip_ru="При подаче на грант указывается именно код ГОП (например, B057 — Информационные технологии), а не узкое название профессии. Нажми на любую карточку ГОП, чтобы увидеть баллы по вузам за 2025 год."
        actionHref="/calculator"
        actionLabel_kz="Калькуляторды ашу"
        actionLabel_ru="Проверить балл в калькуляторе"
      />

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 rounded-3xl bg-zinc-100/80">
        <button
          type="button"
          onClick={() => setActiveTab("gops")}
          className={`p-4 rounded-2xl text-left transition-all flex items-center justify-between ${activeTab === "gops"
              ? "bg-white text-[#A31551] shadow-forte font-bold border border-[#F99184]/40"
              : "text-zinc-600 hover:text-zinc-900 font-medium"
            }`}
        >
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-[#A31551]" />
            <div>
              <div className="text-sm font-bold">
                {lang === "kz" ? "Бакалавриат ГОП-тары (B001–B271)" : "Группы программ (ГОП B001–B271)"}
              </div>
              <div className="text-[11px] text-zinc-400">
                {lang === "kz" ? "Грант саны 2025, ЖОО шектері және өту балдары" : "Квоты грантов 2025, пороги вузов и проходные баллы"}
              </div>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] font-bold">
            {gops.length || 131}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("studenthub")}
          className={`p-4 rounded-2xl text-left transition-all flex items-center justify-between ${activeTab === "studenthub"
              ? "bg-white text-[#A31551] shadow-forte font-bold border border-[#F99184]/40"
              : "text-zinc-600 hover:text-zinc-900 font-medium"
            }`}
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-[#A31551]" />
            <div>
              <div className="text-sm font-bold">
                {lang === "kz" ? "Мамандықтар каталогы (StudentHub)" : "Каталог специальностей (StudentHub)"}
              </div>
              <div className="text-[11px] text-zinc-400">
                {lang === "kz" ? "Оқу ақысы және ЖОО тізімімен" : "Со стоимостью обучения и подборкой вузов"}
              </div>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 font-bold">
            {programs.length || 218}
          </span>
        </button>
      </div>

      {/* TAB 1: UNIVISION 131 GOPS */}
      {activeTab === "gops" ? (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl border border-[#EAEBEF] bg-white shadow-forte space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-5 relative">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={gopSearch}
                  onChange={(e) => setGopSearch(e.target.value)}
                  placeholder={lang === "kz" ? "Код (B057, B086) немесе атауы..." : "Поиск по коду (B057, B086) или названию..."}
                  className="w-full pl-11 pr-10 py-3 rounded-full border border-zinc-200 bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#A31551] shadow-xs"
                />
                {gopSearch && (
                  <button type="button" onClick={() => setGopSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-100 text-zinc-500 text-xs">✕</button>
                )}
              </div>

              <div className="md:col-span-4">
                <select
                  value={gopPairFilter}
                  onChange={(e) => setGopPairFilter(e.target.value)}
                  className="w-full px-4 py-3 rounded-full border border-zinc-200 bg-white text-xs font-medium text-zinc-800 focus:outline-none focus:border-[#A31551]"
                >
                  <option value="">{lang === "kz" ? "Барлық бейіндік пәндер" : "Все пары профильных предметов"}</option>
                  {gopPairs.map((pr) => (
                    <option key={pr} value={pr}>{pr}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <select
                  value={gopSort}
                  onChange={(e) => setGopSort(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-full border border-zinc-200 bg-white text-xs font-medium text-zinc-800 focus:outline-none focus:border-[#A31551]"
                >
                  <option value="code">{lang === "kz" ? "Сұрыптау: Код (B001...)" : "Сортировка: По коду (B001...)"}</option>
                  <option value="grants">{lang === "kz" ? "Грант саны бойынша ↓" : "Больше всего грантов ↓"}</option>
                  <option value="score">{lang === "kz" ? "Шекті балл бойынша ↑" : "По проходному баллу ↑"}</option>
                </select>
              </div>
            </div>
          </div>

          {loadingGops ? (
            <div className="py-16 text-center text-xs text-zinc-400">...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGops.map((gop) => (
                <div
                  key={gop.code}
                  onClick={() => openGopDetail(gop.code)}
                  className="p-5 rounded-3xl border border-[#EAEBEF] bg-white hover:border-[#A31551]/40 card-hover shadow-forte flex flex-col justify-between space-y-4 cursor-pointer group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-black px-3 py-1 rounded-full bg-[#4A0221] text-[#F99184]">
                        {gop.code}
                      </span>
                      {gop.grants?.full_2025 != null && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FDF2F7] text-[#4A0221] border border-[#FC9385]/50">
                          {gop.grants.full_2025.toLocaleString()} {lang === "kz" ? "грант" : "грантов"}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-zinc-900 text-base group-hover:text-[#A31551] transition-colors leading-snug">
                      {lang === "kz" ? gop.title_kk : gop.title_ru}
                    </h3>

                    {(gop.pair_ru || gop.pair_kk) && (
                      <div className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#FDF2F7] text-[#A31551] inline-block">
                        {lang === "kz" ? gop.pair_kk : gop.pair_ru}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100 text-xs">
                      <div>
                        <div className="text-[10px] text-zinc-400 uppercase font-semibold">
                          {lang === "kz" ? "Жалпы өту (2025)" : "Общий порог (2025)"}
                        </div>
                        <div className="font-extrabold text-zinc-900">
                          {gop.passing_2025?.general_min != null ? `${gop.passing_2025.general_min} балл` : "—"}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-400 uppercase font-semibold">
                          {lang === "kz" ? "Оқытатын ЖОО" : "Вузов / ОП"}
                        </div>
                        <div className="font-bold text-[#A31551]">
                          {gop.universities_count} {lang === "kz" ? "ЖОО" : "вузов"} • {gop.programs_count} ОП
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-[#A31551]">
                    <span>{lang === "kz" ? "ЖОО балдары мен шектері" : "Баллы по вузам и пороги"}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* TAB 2: STUDENTHUB 218 PROGRAMS */
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl border border-[#EAEBEF] bg-white shadow-forte space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-5 relative">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === "kz" ? "Мамандық атауы бойынша іздеу..." : "Поиск по названию программы..."}
                  className="w-full pl-11 pr-11 py-3 rounded-full border border-zinc-200 bg-white text-xs font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#A31551]"
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-100 text-zinc-500 text-xs">✕</button>
                )}
              </div>

              <div className="md:col-span-4">
                <select
                  value={selectedPair}
                  onChange={(e) => setSelectedPair(e.target.value)}
                  className="w-full px-4 py-3 rounded-full border border-zinc-200 bg-white text-xs font-medium text-zinc-800 focus:outline-none focus:border-[#A31551]"
                >
                  {SUBJECT_PAIRS.map((p) => (
                    <option key={p} value={p === "Барлық пәндер / Все предметы" ? "" : p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-full border border-zinc-200 bg-white text-xs font-medium text-zinc-800 focus:outline-none focus:border-[#A31551]"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c === "Барлығы / Все города" ? "" : c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loadingProgs ? (
            <div className="py-16 text-center text-xs text-zinc-400">...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPrograms.map((prog) => {
                const ent = entMap.get(prog.slug);
                const latestEnt = ent?.history?.find((h) => h.min_score != null);
                return (
                  <div key={prog.slug} className="p-5 rounded-3xl border border-[#EAEBEF] bg-white hover:border-[#A31551]/30 hover:shadow-forte-hover transition-all flex flex-col justify-between group shadow-forte">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] border border-[#F99184]/30">
                          {prog.pair}
                        </span>
                        {prog.avg_score && (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF5F4] text-[#820232] border border-[#FC9385]">
                            {prog.avg_score} балл
                          </span>
                        )}
                      </div>
                      <Link href={`/programs/${prog.slug}`} className="block">
                        <h3 className="font-bold text-zinc-900 text-base group-hover:text-[#A31551] transition-colors leading-snug">
                          {prog.title}
                        </h3>
                      </Link>
                      {prog.description && <p className="text-xs text-zinc-500 line-clamp-2">{prog.description}</p>}
                      <div className="pt-2 border-t border-zinc-100 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="text-[10px] text-zinc-400 uppercase font-semibold">{lang === "kz" ? "Орташа баға:" : "Средняя цена:"}</div>
                          <div className="font-semibold text-zinc-800">{prog.avg_price || "—"}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-zinc-400 uppercase font-semibold">{lang === "kz" ? "Оқытатын ЖОО:" : "Обучают вузов:"}</div>
                          <div className="font-bold text-[#A31551]">{prog.universities_count}</div>
                        </div>
                      </div>
                      {latestEnt && (
                        <div className="p-2 rounded-xl bg-[#FDF2F7] border border-[#F99184]/30 text-[11px] flex items-center justify-between text-[#4A0221]">
                          <span>{latestEnt.competition.split("·")[0].trim() || "2026"}:</span>
                          <strong className="font-bold">{latestEnt.min_score} балл</strong>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-[#A31551] font-bold">
                      <Link href={`/programs/${prog.slug}`}>{lang === "kz" ? "Толық ақпарат →" : "Подробнее →"}</Link>
                      <Link href="/calculator" className="text-zinc-500 hover:text-zinc-800 font-medium text-[11px]">{lang === "kz" ? "Калькулятор" : "Калькулятор"}</Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* GOP Detail Modal */}
      {activeGop && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs"
          onClick={() => setActiveGop(null)}
        >
          <div
            className="w-full max-w-4xl max-h-[88vh] overflow-y-auto rounded-3xl bg-white border border-zinc-200 shadow-2xl p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-black px-3 py-1 rounded-full bg-[#4A0221] text-[#F99184]">
                    {activeGop.code}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551]">
                    {lang === "kz" ? activeGop.pair_kk : activeGop.pair_ru}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950">
                  {lang === "kz" ? activeGop.title_kk : activeGop.title_ru}
                </h2>
                <div className="text-xs text-zinc-500">
                  {lang === "kz" ? activeGop.area_kk : activeGop.area_ru}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveGop(null)}
                className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Grant Quotas 2025 vs 2024 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-[#FDF2F7] border border-[#FC9385]/50">
                <div className="text-[11px] text-[#4A0221]">{lang === "kz" ? "Толық грант (2025)" : "Очная полная (2025)"}</div>
                <div className="text-xl font-black text-[#A31551]">{activeGop.grants?.full_2025 ?? "—"}</div>
                {activeGop.grants?.full_2024 && <div className="text-[10px] text-[#A31551]">2024: {activeGop.grants.full_2024}</div>}
              </div>
              <div className="p-3 rounded-2xl bg-[#FDF2F7] border border-[#EAEBEF]">
                <div className="text-[11px] text-[#4A0221]">{lang === "kz" ? "Қысқартылған (2025)" : "Сокращенная (2025)"}</div>
                <div className="text-xl font-black text-[#A31551]">{activeGop.grants?.short_2025 ?? "—"}</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#FDF2F7] border border-[#F99184]/40">
                <div className="text-[11px] text-[#A31551]">{lang === "kz" ? "Жалпы конкурс шегі" : "Общий конкурс (мин)"}</div>
                <div className="text-xl font-black text-[#A31551]">{activeGop.passing_2025?.general_min ?? "—"}</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#FFF5F4] border border-[#FC9385]/60">
                <div className="text-[11px] text-[#4A0221]">{lang === "kz" ? "Ауыл квотасы" : "Сельская квота"}</div>
                <div className="text-xl font-black text-[#820232]">{activeGop.passing_2025?.rural_min ?? "—"}</div>
              </div>
            </div>

            {/* Passing Scores by University (2025 General Competition) */}
            {activeGop.uni_passing_2025 && activeGop.uni_passing_2025.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-zinc-900">
                  {lang === "kz" ? "2025 жылғы ЖОО-лар бойынша грант балдары (Жалпы конкурс)" : "Проходные баллы на грант 2025 по вузам (Общий конкурс)"}
                </h3>
                <div className="max-h-60 overflow-y-auto rounded-2xl border border-zinc-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 sticky top-0">
                      <tr>
                        <th className="p-3">{lang === "kz" ? "Университет" : "ВУЗ"}</th>
                        <th className="p-3 text-center">Мин</th>
                        <th className="p-3 text-center">Средн.</th>
                        <th className="p-3 text-center">Макс</th>
                        <th className="p-3 text-center">{lang === "kz" ? "Грант" : "Грантов"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {activeGop.uni_passing_2025.map((row, idx) => (
                        <tr key={idx} className="hover:bg-zinc-50">
                          <td className="p-3 font-semibold text-zinc-900">{row.uni_name}</td>
                          <td className="p-3 text-center font-extrabold text-[#A31551]">{row.min_score ?? "—"}</td>
                          <td className="p-3 text-center text-zinc-600">{row.avg_score ?? "—"}</td>
                          <td className="p-3 text-center text-zinc-600">{row.max_score ?? "—"}</td>
                          <td className="p-3 text-center font-bold text-[#A31551]">{row.grants_count ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* University Minimum Admission Thresholds */}
            {activeGop.uni_thresholds && activeGop.uni_thresholds.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-zinc-900">
                  {lang === "kz" ? "ЖОО-лардың қабылдауға арналған ішкі шекті балдары" : "Минимальные пороговые баллы для поступления в вузы"}
                </h3>
                <div className="max-h-48 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeGop.uni_thresholds.map((t, idx) => (
                    <div key={idx} className="px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200/70 flex items-center justify-between text-xs">
                      <span className="font-medium text-zinc-800 truncate pr-2">{t.uni_name}</span>
                      <span className="font-extrabold text-[#4A0221] shrink-0">
                        {t.full_score ?? "—"} балл
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Programs inside this GOP */}
            {activeGop.programs && activeGop.programs.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-zinc-900">
                  {lang === "kz" ? `Осы ГОП құрамындағы бағдарламалар (${activeGop.programs_count})` : `Образовательные программы в составе ${activeGop.code}`}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activeGop.programs.slice(0, 18).map((p, idx) => (
                    <span key={idx} className="text-xs px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-800 font-medium">
                      <strong className="font-mono text-[#A31551]">{p.code}</strong> {p.name} ({p.uni_count})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
