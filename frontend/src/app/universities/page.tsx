"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Building2, 
  Search, 
  MapPin, 
  Phone, 
  ArrowRight, 
  ExternalLink, 
  GraduationCap, 
  ShieldCheck, 
  Home, 
  Award,
  Sparkles
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { api } from "@/lib/api";
import { Institution, StudentHubUniversity } from "@/lib/types";

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
  "Қызылорда",
  "Петропавл",
  "Орал",
  "Түркістан"
];

export default function UniversitiesPage() {
  const { lang, t } = useI18n();
  const [scope, setScope] = useState<"astana" | "all">("astana");
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [shUniversities, setShUniversities] = useState<StudentHubUniversity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Барлығы / Все города");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [insts, shUnis] = await Promise.all([
        api.getInstitutions("university"),
        api.getStudentHubUniversities(),
      ]);
      setInstitutions(insts);
      setShUniversities(shUnis.universities);
      setLoading(false);
    }
    loadData();
  }, []);

  // Filtered Astana universities
  const filteredAstana = useMemo(() => {
    return institutions.filter((i) => {
      if (i.institution_type !== "university") return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const name = lang === "kz" ? i.name_kz : i.name_ru;
      const short = (lang === "kz" ? i.short_name_kz : i.short_name_ru) || "";
      return name.toLowerCase().includes(q) || short.toLowerCase().includes(q);
    });
  }, [institutions, searchQuery, lang]);

  // Filtered 90 Kazakhstan universities
  const filteredSh = useMemo(() => {
    return shUniversities.filter((u) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = u.name.toLowerCase().includes(q);
        const cityMatch = u.city.toLowerCase().includes(q);
        const progMatch = u.programs?.some((pr) => pr.name.toLowerCase().includes(q));
        if (!nameMatch && !cityMatch && !progMatch) return false;
      }
      if (selectedCity && selectedCity !== "Барлығы / Все города") {
        if (!u.city.toLowerCase().includes(selectedCity.toLowerCase())) return false;
      }
      return true;
    });
  }, [shUniversities, searchQuery, selectedCity]);

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
          {lang === "kz" ? "Жоғары оқу орындары" : "Университеты и вузы"}
        </span>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] text-xs font-bold border border-[#F99184]/40">
          <Building2 className="w-3.5 h-3.5" />
          <span>{lang === "kz" ? "ЖОО Реестрі • Астана және Қазақстан" : "Реестр вузов • Астана и Казахстан"}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          {lang === "kz" ? "Университеттер мен институттар" : "Университеты и академии"}
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base max-w-3xl leading-relaxed">
          {lang === "kz"
            ? "Астананың мемлекеттік верификацияланған университеттері және Қазақстанның 90 жетекші ЖОО-сы: білім беру бағдарламалары, бағалары, әскери кафедрасы және жатақханалары."
            : "Верифицированные университеты Астаны и 90 ведущих вузов Казахстана: каталог образовательных программ, стоимость, военные кафедры и общежития."}
        </p>
      </div>

      {/* Scope Selector: Astana vs All Kazakhstan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 rounded-2xl bg-zinc-100/80">
        <button
          type="button"
          onClick={() => setScope("astana")}
          className={`p-3.5 rounded-xl text-left transition-all flex items-center justify-between ${
            scope === "astana"
              ? "bg-white text-[#A31551] shadow-forte font-bold border border-[#F99184]/40"
              : "text-zinc-600 hover:text-zinc-900 font-medium"
          }`}
        >
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-[#A31551]" />
            <div>
              <div className="text-sm font-bold">
                {lang === "kz" ? "Астана қаласының ЖОО-лары" : "Вузы города Астаны"}
              </div>
              <div className="text-[11px] text-zinc-400">
                Gov.kz 657 ресми реестрі (100% верификация)
              </div>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] font-bold">
            {institutions.filter(i => i.institution_type === "university").length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setScope("all")}
          className={`p-3.5 rounded-xl text-left transition-all flex items-center justify-between ${
            scope === "all"
              ? "bg-white text-[#A31551] shadow-forte font-bold border border-[#F99184]/40"
              : "text-zinc-600 hover:text-zinc-900 font-medium"
          }`}
        >
          <div className="flex items-center gap-3">
            <GraduationCap className="w-5 h-5 text-[#A31551]" />
            <div>
              <div className="text-sm font-bold">
                {lang === "kz" ? "Қазақстанның 90 университеті" : "Все 90 вузов Казахстана"}
              </div>
              <div className="text-[11px] text-zinc-400">
                Алматы, Астана, Шымкент және өңірлер
              </div>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 font-bold">
            90
          </span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === "kz" ? "Университет атауы немесе мамандық..." : "Поиск по названию университета или программе..."}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:border-[#A31551] shadow-2xs"
          />
        </div>

        {scope === "all" && (
          <div className="sm:w-64">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-800 focus:outline-hidden focus:border-[#A31551]"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Results View */}
      {loading ? (
        <div className="py-16 text-center text-xs text-zinc-400">
          {lang === "kz" ? "Университеттер тізімі жүктелуде..." : "Загрузка списка университетов..."}
        </div>
      ) : scope === "astana" ? (
        /* Astana Universities */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredAstana.map((inst) => (
            <div
              key={inst.id}
              className="p-6 rounded-3xl border border-[#EAEBEF] bg-white hover:border-[#A31551]/30 card-hover shadow-forte flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-[#FDF2F7] text-[#A31551] border border-[#F99184]/40">
                    Астана • {lang === "kz" ? "Университет" : "Вуз"}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Gov.kz 657 ✓
                  </span>
                </div>

                <Link href={`/education/institutions/${inst.slug}`} className="block group">
                  <h3 className="font-extrabold text-zinc-900 text-lg group-hover:text-[#A31551] transition-colors leading-snug">
                    {lang === "kz" ? inst.name_kz : inst.name_ru}
                  </h3>
                </Link>

                <div className="space-y-1.5 text-xs text-zinc-600 pt-1">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                    <span>{lang === "kz" ? inst.address_kz : inst.address_ru}</span>
                  </div>

                  {inst.contact_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#A31551] shrink-0" />
                      <a href={`tel:${inst.contact_phone}`} className="font-bold text-[#A31551] hover:underline">
                        {inst.contact_phone}
                      </a>
                    </div>
                  )}
                </div>

                {inst.offered_programs_summary && inst.offered_programs_summary.length > 0 && (
                  <div className="pt-2">
                    <div className="text-[11px] font-bold text-zinc-500 uppercase">
                      {lang === "kz" ? "Негізгі бағыттары:" : "Основные направления:"}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {inst.offered_programs_summary.slice(0, 3).map((p, idx) => (
                        <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                {inst.official_website && (
                  <a
                    href={inst.official_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-zinc-900 inline-flex items-center gap-1 font-medium"
                  >
                    <span>{t.verification.officialPortal}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                <Link
                  href={`/education/institutions/${inst.slug}`}
                  className="font-bold text-[#A31551] hover:text-[#820232] flex items-center gap-1 group"
                >
                  <span>{lang === "kz" ? "Толық профиль" : "Подробнее"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 90 Kazakhstan Universities */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSh.map((uni) => (
            <div
              key={uni.slug}
              className="p-5 rounded-2xl border border-[#EAEBEF] bg-white hover:border-[#A31551]/30 shadow-forte flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-[#FDF2F7] text-[#A31551] border border-[#F99184]/30">
                    {uni.city || "Қазақстан"}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-bold">
                    {uni.programs_count} {lang === "kz" ? "мамандық" : "программ"}
                  </span>
                </div>

                <h3 className="font-bold text-zinc-900 text-base leading-snug">
                  {uni.name}
                </h3>

                {uni.programs && uni.programs.length > 0 && (
                  <div className="pt-2 space-y-1">
                    <div className="text-[10px] text-zinc-400 uppercase font-semibold">
                      {lang === "kz" ? "Бағдарламалар үлгісі:" : "Примеры программ:"}
                    </div>
                    {uni.programs.slice(0, 2).map((p, idx) => (
                      <div key={idx} className="text-xs text-zinc-600 truncate flex items-center justify-between">
                        <span>• {p.name}</span>
                        {p.price && <span className="text-[10px] text-zinc-400 shrink-0 font-medium">{p.price}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-[#A31551] font-bold">
                <Link href={`/programs?city=${encodeURIComponent(uni.city)}`} className="hover:underline">
                  {lang === "kz" ? "Мамандықтарын қарау" : "Смотреть программы"} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
