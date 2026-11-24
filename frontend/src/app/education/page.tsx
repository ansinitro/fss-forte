"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  Search, 
  BookOpen, 
  ExternalLink, 
  Building2, 
  Languages, 
  CheckCircle2, 
  Filter 
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { api } from "@/lib/api";
import { Institution, EducationProgram } from "@/lib/types";
import { VerificationBadge } from "@/components/common/VerificationBadge";

export default function EducationPage() {
  const { lang, t } = useI18n();
  const [activeTab, setActiveTab] = useState<"institutions" | "programs">("institutions");
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [programs, setPrograms] = useState<EducationProgram[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>(""); // all, university, college
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [instsData, progsData] = await Promise.all([
        api.getInstitutions(typeFilter || undefined),
        api.getPrograms(),
      ]);
      setInstitutions(instsData);
      setPrograms(progsData);
      setLoading(false);
    }
    loadData();
  }, [typeFilter]);

  const filteredInstitutions = institutions.filter((i) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const name = lang === "kz" ? i.name_kz : i.name_ru;
    const short = (lang === "kz" ? i.short_name_kz : i.short_name_ru) || "";
    return name.toLowerCase().includes(q) || short.toLowerCase().includes(q);
  });

  const filteredPrograms = programs.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const name = lang === "kz" ? p.name_kz : p.name_ru;
    return name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200/60">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>2-бөлім / Раздел 2</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          {t.sections.educationTitle}
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base max-w-2xl leading-relaxed">
          {t.sections.educationDesc}
        </p>
      </div>

      {/* Primary Tabs: Institutions vs Programs */}
      <div className="flex border-b border-zinc-200 gap-6 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("institutions")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "institutions"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-zinc-500 hover:text-zinc-900"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{lang === "kz" ? "Астана оқу орындары (Университет / Колледж)" : "Учебные заведения Астаны"}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
            {institutions.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("programs")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "programs"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-zinc-500 hover:text-zinc-900"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{lang === "kz" ? "Білім беру бағдарламалары (Кодтар)" : "Образовательные программы"}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
            {programs.length}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === "institutions"
                ? (lang === "kz" ? "Оқу орнының атауы бойынша іздеу (AITU, ЕҰУ, Колледж...)" : "Поиск по названию вуза/колледжа...")
                : (lang === "kz" ? "Бағдарлама коды немесе атауы бойынша іздеу (6B06101, B058...)" : "Поиск по коду или названию программы...")
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:border-zinc-400"
          />
        </div>

        {activeTab === "institutions" && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setTypeFilter("")}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                typeFilter === ""
                  ? "bg-zinc-900 text-white"
                  : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              {t.common.all}
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("university")}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                typeFilter === "university"
                  ? "bg-zinc-900 text-white"
                  : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              {lang === "kz" ? "Университеттер" : "Университеты"}
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("college")}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                typeFilter === "college"
                  ? "bg-zinc-900 text-white"
                  : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              {lang === "kz" ? "Колледждер" : "Колледжи"}
            </button>
          </div>
        )}
      </div>

      {/* Content views */}
      {loading ? (
        <div className="py-16 text-center text-xs text-zinc-400">
          {lang === "kz" ? "Мәліметтер жүктелуде..." : "Загрузка данных..."}
        </div>
      ) : activeTab === "institutions" ? (
        /* Institutions List */
        filteredInstitutions.length === 0 ? (
          <div className="py-16 text-center text-xs text-zinc-500 bg-white rounded-2xl border border-zinc-200">
            {t.common.noResults}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredInstitutions.map((inst) => (
              <div
                key={inst.id}
                className="p-6 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 card-hover shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 capitalize">
                      {inst.institution_type === "college" ? "Колледж" : "Университет"}
                    </span>
                    <VerificationBadge status={inst.status} compact />
                  </div>

                  <Link href={`/education/institutions/${inst.slug}`} className="block group">
                    <h3 className="font-bold text-zinc-900 text-lg group-hover:text-blue-600 transition-colors leading-snug">
                      {lang === "kz" ? inst.name_kz : inst.name_ru}
                    </h3>
                  </Link>

                  <p className="text-xs text-zinc-500 line-clamp-1">
                    {lang === "kz" ? inst.address_kz : inst.address_ru}
                  </p>

                  {/* Summary tags */}
                  <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-zinc-600">
                    {inst.has_military_department && (
                      <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 font-medium">
                        {lang === "kz" ? "Әскери кафедра бар" : "Есть военная кафедра"}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 font-medium">
                      {t.common.dormitory}: {lang === "kz" ? "Қамтамасыз етіледі" : "Имеется"}
                    </span>
                  </div>

                  {/* Offered programs preview */}
                  {inst.offered_programs_summary && inst.offered_programs_summary.length > 0 && (
                    <div className="pt-2">
                      <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                        {lang === "kz" ? "Даярлау бағыттары:" : "Направления подготовки:"}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {inst.offered_programs_summary.map((prog, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-50 border border-zinc-100 text-zinc-700"
                          >
                            {prog}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <a
                    href={inst.official_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-zinc-900 flex items-center gap-1 font-medium"
                  >
                    <span>{t.verification.officialPortal}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <Link
                    href={`/education/institutions/${inst.slug}`}
                    className="font-semibold text-blue-600 hover:text-blue-800"
                  >
                    {t.common.explore} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Educational Programs List */
        filteredPrograms.length === 0 ? (
          <div className="py-16 text-center text-xs text-zinc-500 bg-white rounded-2xl border border-zinc-200">
            {t.common.noResults}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPrograms.map((prog) => (
              <Link
                key={prog.id}
                href={`/education/programs/${prog.code}`}
                className="p-5 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 card-hover shadow-xs flex flex-col justify-between group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                      {prog.code}
                    </span>
                    <span className="text-xs text-zinc-400 capitalize">
                      {prog.group ? (lang === "kz" ? prog.group.name_kz : prog.group.name_ru) : "Бакалавриат"}
                    </span>
                  </div>

                  <h3 className="font-bold text-zinc-900 text-base group-hover:text-blue-600 transition-colors">
                    {lang === "kz" ? prog.name_kz : prog.name_ru}
                  </h3>

                  <div className="text-xs text-zinc-500">
                    {prog.institutions && prog.institutions.length > 0 ? (
                      <span className="font-medium text-zinc-700">
                        {lang === "kz" ? "Астанада оқытатын ЖОО:" : "Обучают в Астане:"}{" "}
                        {prog.institutions.map(i => lang === "kz" ? i.name_kz : i.name_ru).join(", ")}
                      </span>
                    ) : (
                      <span>{t.verification.unknownInfo}</span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-zinc-400">
                    {lang === "kz" ? "Шекті балл және гранттар тарихы" : "Пороговый балл и история грантов"}
                  </span>
                  <span className="font-semibold text-blue-600">
                    {t.common.explore} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  );
}
