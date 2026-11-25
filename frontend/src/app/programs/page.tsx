"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Building2,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Calculator
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { api } from "@/lib/api";
import { StudentHubProgram, StudentHubEntResult } from "@/lib/types";

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
  "Астана",
  "Алматы",
  "Шымкент",
  "Ақтөбе",
  "Қарағанды",
  "Қостанай",
  "Павлодар",
  "Өскемен",
  "Семей",
  "Тараз",
  "Ақтау",
  "Атырау",
  "Қызылорда"
];

export default function ProgramsCatalogPage() {
  const { lang, t } = useI18n();
  const [programs, setPrograms] = useState<StudentHubProgram[]>([]);
  const [entResults, setEntResults] = useState<StudentHubEntResult[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPair, setSelectedPair] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [maxCutoff, setMaxCutoff] = useState<number>(140);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [progsResp, entResp] = await Promise.all([
        api.getStudentHubPrograms(),
        api.getStudentHubEntResults(),
      ]);
      setPrograms(Array.isArray(progsResp?.programs) ? progsResp.programs : []);
      setEntResults(Array.isArray(entResp?.results) ? entResp.results : []);
      setLoading(false);
    }
    loadData();
  }, []);

  const entMap = useMemo(() => {
    const map = new Map<string, StudentHubEntResult>();
    entResults.forEach((e) => map.set(e.slug, e));
    return map;
  }, [entResults]);

  // Filtered programs
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
      if (maxCutoff < 140 && p.avg_score && p.avg_score > maxCutoff) {
        return false;
      }
      return true;
    });
  }, [programs, searchQuery, selectedPair, selectedCity, maxCutoff]);

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
          {lang === "kz" ? "Мамандықтар каталогы (218)" : "Каталог специальностей (218)"}
        </span>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] text-xs font-bold border border-[#F99184]/40">
          <BookOpen className="w-3.5 h-3.5" />
          <span>StudentHub.kz • 218 мамандық реестрі</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          {lang === "kz" ? "Білім беру бағдарламалары мен мамандықтар" : "Каталог образовательных программ и специальностей"}
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base max-w-3xl leading-relaxed">
          {lang === "kz"
            ? "Қазақстанның 218 мамандығы: бейіндік ҰБТ пәндері, орташа шекті балдар, оқытатын ЖОО-лар саны және грант тарихы."
            : "218 образовательных программ Казахстана: профильные предметы ЕНТ, проходные баллы, стоимость обучения и реестр вузов."}
        </p>
      </div>

      {/* Quick Calculator Callout */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#270111] via-[#4A0221] to-[#1D1D1D] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-forte">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5 text-[#F99184]" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              {lang === "kz" ? "Баллыңызбен нақты грант мүмкіндігін тексеріңіз" : "Рассчитайте шансы на грант по вашим баллам ЕНТ"}
            </div>
            <div className="text-xs text-zinc-300">
              {lang === "kz" ? "Интерактивті ҰБТ Грант Калькуляторы арқылы дәл есептеу" : "С помощью интерактивного калькулятора грантов"}
            </div>
          </div>
        </div>
        <Link
          href="/calculator"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F99184] via-[#B8335F] to-[#A51652] text-white text-xs font-bold hover:brightness-110 transition-all shrink-0 shadow-sm"
        >
          {lang === "kz" ? "Калькуляторды ашу →" : "Открыть калькулятор →"}
        </Link>
      </div>

      {/* Filter Controls Panel */}
      <div className="p-5 sm:p-6 rounded-3xl border border-[#EAEBEF] bg-white shadow-forte space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "kz" ? "Мамандық атауы бойынша іздеу..." : "Поиск по названию программы..."}
              className="w-full pl-11 pr-11 py-3 rounded-full border border-zinc-200 bg-white text-xs font-medium text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:border-[#A31551] focus:ring-2 focus:ring-[#A31551]/20 shadow-xs transition-all"
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

          {/* Subject Pair */}
          <div className="md:col-span-4">
            <select
              value={selectedPair}
              onChange={(e) => setSelectedPair(e.target.value)}
              className="w-full px-4 py-3 rounded-full border border-zinc-200 bg-white text-xs font-medium text-zinc-800 focus:outline-hidden focus:border-[#A31551] shadow-xs"
            >
              {SUBJECT_PAIRS.map((p) => (
                <option key={p} value={p === "Барлық пәндер / Все предметы" ? "" : p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div className="md:col-span-3">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-3 rounded-full border border-zinc-200 bg-white text-xs font-medium text-zinc-800 focus:outline-hidden focus:border-[#A31551] shadow-xs"
            >
              {CITIES.map((c) => (
                <option key={c} value={c === "Барлығы / Все города" ? "" : c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Line */}
        <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-100">
          <span>
            {lang === "kz" ? "Табылған бағдарламалар:" : "Найдено программ:"}{" "}
            <strong className="text-zinc-900 font-bold">{filteredPrograms.length}</strong>
          </span>

          {(searchQuery || selectedPair || selectedCity) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedPair("");
                setSelectedCity("");
              }}
              className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-[#A31551] transition-colors"
            >
              {lang === "kz" ? "Сүзгіні тазарту ✕" : "Сбросить фильтры ✕"}
            </button>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-zinc-400">
          {lang === "kz" ? "Бағдарламалар жүктелуде..." : "Загрузка программ..."}
        </div>
      ) : filteredPrograms.length === 0 ? (
        <div className="py-16 text-center text-xs text-zinc-500 bg-white rounded-3xl border border-zinc-200">
          {t.common.noResults}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrograms.map((prog) => {
            const ent = entMap.get(prog.slug);
            const latestEnt = ent?.history?.find((h) => h.min_score != null);

            return (
              <div
                key={prog.slug}
                className="p-5 rounded-3xl border border-[#EAEBEF] bg-white hover:border-[#A31551]/30 hover:shadow-forte-hover transition-all flex flex-col justify-between group shadow-forte"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] border border-[#F99184]/30">
                      {prog.pair}
                    </span>
                    {prog.avg_score && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA]">
                        {prog.avg_score} {lang === "kz" ? "балл" : "баллов"}
                      </span>
                    )}
                  </div>

                  <Link href={`/programs/${prog.slug}`} className="block">
                    <h3 className="font-bold text-zinc-900 text-base group-hover:text-[#A31551] transition-colors leading-snug">
                      {prog.title}
                    </h3>
                  </Link>

                  {prog.description && (
                    <p className="text-xs text-zinc-500 line-clamp-2">
                      {prog.description}
                    </p>
                  )}

                  <div className="pt-2 border-t border-zinc-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-[10px] text-zinc-400 uppercase font-semibold">
                        {lang === "kz" ? "Орташа баға:" : "Средняя цена:"}
                      </div>
                      <div className="font-semibold text-zinc-800">
                        {prog.avg_price || "—"}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-zinc-400 uppercase font-semibold">
                        {lang === "kz" ? "Оқытатын ЖОО:" : "Обучают вузов:"}
                      </div>
                      <div className="font-bold text-[#A31551]">
                        {prog.universities_count} {lang === "kz" ? "университет" : "вузов"}
                      </div>
                    </div>
                  </div>

                  {latestEnt && (
                    <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-100 text-[11px] flex items-center justify-between text-emerald-900">
                      <span>{latestEnt.competition.split("·")[0].trim() || "2026"} {lang === "kz" ? "грант шегі:" : "проходной:"}</span>
                      <strong className="font-bold">{latestEnt.min_score} {lang === "kz" ? "балл" : "баллов"}</strong>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-[#A31551] font-bold group-hover:text-[#820232]">
                  <Link href={`/programs/${prog.slug}`} className="flex items-center gap-1">
                    <span>{lang === "kz" ? "Толық ақпарат" : "Подробнее"}</span>
                    <span>→</span>
                  </Link>

                  <Link href={`/calculator`} className="text-zinc-500 hover:text-zinc-800 font-medium text-[11px]">
                    {lang === "kz" ? "Шансты есептеу" : "Шанс на грант"}
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
