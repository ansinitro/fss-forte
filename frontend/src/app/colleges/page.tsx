"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Search,
  MapPin,
  Phone,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Mail,
  UserCheck,
  Globe,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  X
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { api } from "@/lib/api";
import { AstanaCollege, KZCollege, RegionStat } from "@/lib/types";
import { StudentTipBanner } from "@/components/common/StudentTipBanner";
import { ScrollablePillBar } from "@/components/common/ScrollablePillBar";

export default function CollegesPage() {
  const { lang, t } = useI18n();
  const [scope, setScope] = useState<"astana" | "kz">("astana");

  // Featured Astana 32 colleges
  const [colleges, setColleges] = useState<AstanaCollege[]>([]);
  // Nationwide 688 colleges (Gov.kz 707)
  const [kzColleges, setKzColleges] = useState<KZCollege[]>([]);
  const [kzRegions, setKzRegions] = useState<RegionStat[]>([]);
  const [kzTotal, setKzTotal] = useState(688);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [kzLimit, setKzLimit] = useState(40);
  const [loading, setLoading] = useState(true);
  const [loadingKz, setLoadingKz] = useState(false);

  // Filters
  const [collegeSearch, setCollegeSearch] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedOwnership, setSelectedOwnership] = useState<"all" | "state" | "private">("all");
  const [selectedSpec, setSelectedSpec] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const reg = new URLSearchParams(window.location.search).get("region");
      if (reg && reg !== "astana") {
        setScope("kz");
        setSelectedRegion(reg);
      }
    }
    async function loadColleges() {
      setLoading(true);
      const data = await api.getColleges();
      setColleges(Array.isArray(data) ? data : []);
      setLoading(false);
    }
    loadColleges();
  }, []);

  useEffect(() => {
    if (scope !== "kz") return;
    let active = true;
    async function loadKZ() {
      setLoadingKz(true);
      const data = await api.getKZColleges({
        region: selectedRegion,
        ownership: selectedOwnership,
        specialization: selectedSpec,
        search: collegeSearch.trim(),
        limit: kzLimit,
      });
      if (active) {
        setKzColleges(Array.isArray(data?.colleges) ? data.colleges : []);
        setKzRegions(Array.isArray(data?.regions) ? data.regions : []);
        setKzTotal(data?.total ?? 0);
        setLoadingKz(false);
      }
    }
    const timer = setTimeout(loadKZ, collegeSearch ? 200 : 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [scope, selectedRegion, selectedOwnership, selectedSpec, collegeSearch, kzLimit]);

  const filteredColleges = useMemo(() => {
    return (colleges || []).filter((col) => {
      if (collegeSearch.trim()) {
        const q = collegeSearch.toLowerCase();
        const nameMatch = col.name_kz.toLowerCase().includes(q) || col.name_ru.toLowerCase().includes(q);
        const specMatch = col.specialization_kz.toLowerCase().includes(q) || col.specialization_ru.toLowerCase().includes(q);
        const addrMatch = col.address_kz.toLowerCase().includes(q) || col.address_ru.toLowerCase().includes(q);
        const headMatch = col.director?.toLowerCase().includes(q) || false;
        if (!nameMatch && !specMatch && !addrMatch && !headMatch) return false;
      }
      if (selectedOwnership === "state" && !col.is_state) return false;
      if (selectedOwnership === "private" && col.is_state) return false;
      if (selectedDistrict && !col.district_ru.toLowerCase().includes(selectedDistrict.toLowerCase()) && !col.district_kz.toLowerCase().includes(selectedDistrict.toLowerCase())) {
        return false;
      }
      if (selectedSpec) {
        const qSpec = selectedSpec.toLowerCase();
        const inSpec = col.specialization_ru.toLowerCase().includes(qSpec) || col.specialization_kz.toLowerCase().includes(qSpec);
        const inName = col.name_ru.toLowerCase().includes(qSpec) || col.name_kz.toLowerCase().includes(qSpec);
        if (!inSpec && !inName) return false;
      }
      return true;
    });
  }, [colleges, selectedDistrict, selectedOwnership, selectedSpec, collegeSearch]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedOwnership !== "all") count++;
    if (selectedDistrict) count++;
    if (selectedSpec) count++;
    if (scope === "kz" && selectedRegion !== "all") count++;
    return count;
  }, [selectedOwnership, selectedDistrict, selectedSpec, scope, selectedRegion]);

  const handleResetFilters = () => {
    setCollegeSearch("");
    setSelectedDistrict("");
    setSelectedOwnership("all");
    setSelectedSpec("");
    setSelectedRegion("all");
  };

  const specializationsList = [
    { id: "", icon: "🌟", label_kz: "Барлық бағыттар", label_ru: "Все направления" },
    { id: "ит", icon: "💻", label_kz: "IT & Байланыс", label_ru: "ИТ и технологии" },
    { id: "медицин", icon: "🩺", label_kz: "Медицина", label_ru: "Медицина" },
    { id: "педагог", icon: "📚", label_kz: "Педагогика", label_ru: "Педагогика" },
    { id: "транспорт", icon: "🚆", label_kz: "Көлік & Логистика", label_ru: "Транспорт и связь" },
    { id: "сервис", icon: "🍽️", label_kz: "Сервис & Туризм", label_ru: "Сервис и туризм" },
    { id: "техн", icon: "⚙️", label_kz: "Техникалық", label_ru: "Технические науки" },
    { id: "строит", icon: "🏗️", label_kz: "Құрылыс", label_ru: "Строительство" },
    { id: "эконом", icon: "💼", label_kz: "Экономика & Құқық", label_ru: "Экономика и право" },
  ];

  const astanaDistricts = [
    { id: "", label_kz: "Барлық аудандар", label_ru: "Все районы", count: 32 },
    { id: "Сарыарқа", label_kz: "Сарыарқа", label_ru: "Сарыаркинский район", count: 14 },
    { id: "Алматы", label_kz: "Алматы", label_ru: "Алматинский район", count: 7 },
    { id: "Байқоңыр", label_kz: "Байқоңыр", label_ru: "Байконурский район", count: 6 },
    { id: "Есіл", label_kz: "Есіл & Нұра", label_ru: "Есильский & Нуринский", count: 4 },
    { id: "Сарайшық", label_kz: "Сарайшық", label_ru: "Сарайшыкский район", count: 1 },
  ];

  // Render filter items
  const renderFilterControls = () => (
    <div className="space-y-5">
      {/* Scope Selector */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
          {lang === "kz" ? "Аумақ (География):" : "Охват поиска:"}
        </div>
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-zinc-100">
          <button
            type="button"
            onClick={() => setScope("astana")}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
              scope === "astana"
                ? "bg-white text-[#A31551] shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <span>📍</span>
            <span>{lang === "kz" ? "Астана (32)" : "Астана (32)"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setScope("kz");
              setKzLimit(40);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
              scope === "kz"
                ? "bg-white text-[#A31551] shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <span>🌐</span>
            <span>{lang === "kz" ? "Қазақстан (688)" : "Казахстан (688)"}</span>
          </button>
        </div>
      </div>

      {/* Ownership Filter */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
          {lang === "kz" ? "Меншік нысаны / Оқу түрі:" : "Тип учреждения и финансирование:"}
        </div>
        <div className="space-y-1.5">
          {[
            {
              id: "all",
              label_kz: scope === "astana" ? "Барлық 32 колледж" : "Барлық колледждер (688)",
              label_ru: scope === "astana" ? "Все 32 колледжа" : "Все колледжи РК (688)",
              count: scope === "astana" ? 32 : 688,
            },
            {
              id: "state",
              label_kz: scope === "astana" ? "Мемлекеттік (Госзаказ / 10)" : "Мемлекеттік (Госзаказ)",
              label_ru: scope === "astana" ? "Государственные (Госзаказ / 10)" : "Государственные (Госзаказ)",
              badge: lang === "kz" ? "100% тегін" : "100% грант",
            },
            {
              id: "private",
              label_kz: scope === "astana" ? "Жеке меншік (22)" : "Жеке меншік колледждер",
              label_ru: scope === "astana" ? "Частные колледжи (22)" : "Частные колледжи",
              badge: lang === "kz" ? "Ақылы" : "Платные",
            },
          ].map((own) => {
            const isActive = selectedOwnership === own.id;
            return (
              <button
                key={own.id}
                type="button"
                onClick={() => setSelectedOwnership(own.id as any)}
                className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between text-xs ${
                  isActive
                    ? "bg-[#FDF2F7] text-[#A31551] border border-[#F99184]/40 font-bold shadow-2xs"
                    : "bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-medium"
                }`}
              >
                <span>{lang === "kz" ? own.label_kz : own.label_ru}</span>
                {isActive ? (
                  <span className="w-2 h-2 rounded-full bg-[#A31551]" />
                ) : own.badge ? (
                  <span className="text-[10px] text-zinc-400">{own.badge}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* District / Region Filter */}
      {scope === "astana" ? (
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            {lang === "kz" ? "Астана аудандары:" : "Район города Астаны:"}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {astanaDistricts.map((dist) => {
              const isActive = selectedDistrict === dist.id;
              return (
                <button
                  key={dist.id}
                  type="button"
                  onClick={() => setSelectedDistrict(dist.id)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#4A0221] text-white shadow-forte font-bold"
                      : "bg-zinc-50 border border-zinc-200 text-zinc-700 hover:border-[#A31551]/30 hover:bg-[#FDF2F7]/50 font-medium"
                  }`}
                >
                  <span>{lang === "kz" ? dist.label_kz : dist.label_ru}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-white/20 text-white font-bold" : "bg-zinc-200/70 text-zinc-600"}`}>
                    {dist.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            {lang === "kz" ? "Қазақстан өңірлері (19):" : "Регион Казахстана (19):"}
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto custom-scrollbar p-1">
            <button
              type="button"
              onClick={() => {
                setSelectedRegion("all");
                setKzLimit(40);
              }}
              className={`px-3 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 ${
                selectedRegion === "all"
                  ? "bg-[#4A0221] text-white shadow-forte font-bold"
                  : "bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-[#FDF2F7]/50 font-medium"
              }`}
            >
              <span>{lang === "kz" ? "Барлық өңір" : "Все регионы"}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedRegion === "all" ? "bg-white/20 text-white" : "bg-zinc-200/70"}`}>
                688
              </span>
            </button>
            {kzRegions.map((reg) => {
              const isActive = selectedRegion === reg.id;
              return (
                <button
                  key={reg.id}
                  type="button"
                  onClick={() => {
                    setSelectedRegion(reg.id);
                    setKzLimit(80);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#4A0221] text-white shadow-forte font-bold"
                      : "bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-[#FDF2F7]/50 font-medium"
                  }`}
                >
                  <span>{lang === "kz" ? reg.name_kk : reg.name_ru}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-zinc-200/70"}`}>
                    {reg.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Specialization Filter */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
          {lang === "kz" ? "Мамандық бағыты:" : "Профиль подготовки:"}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {specializationsList.map((sp) => {
            const isActive = selectedSpec === sp.id;
            return (
              <button
                key={sp.id}
                type="button"
                onClick={() => setSelectedSpec(sp.id)}
                className={`px-3 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#A31551] text-white shadow-forte font-bold"
                    : "bg-zinc-50 border border-zinc-200 text-zinc-700 hover:border-[#A31551]/30 hover:bg-[#FDF2F7]/50 font-medium"
                }`}
              >
                <span>{sp.icon}</span>
                <span>{lang === "kz" ? sp.label_kz : sp.label_ru}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={handleResetFilters}
          className="w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-[#A31551] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          <span>{lang === "kz" ? "Сүзгілерді тазарту" : "Сбросить все фильтры"}</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
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
          {scope === "astana"
            ? (lang === "kz" ? "Астана колледждері (32)" : "Колледжи Астаны (32)")
            : (lang === "kz" ? "Қазақстан колледждері (688)" : "Колледжи Казахстана (688)")}
        </span>
      </div>

      {/* Header */}
      <div className="space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] text-xs font-bold border border-[#F99184]/40">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Gov.kz №707 • {lang === "kz" ? "Барлық 19 өңір" : "Все 19 регионов РК"}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          {lang === "kz" ? "Астана және Қазақстан колледждері (688)" : "Колледжи Астаны и всего Казахстана (688)"}
        </h1>
        <p className="text-zinc-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
          {lang === "kz"
            ? "Астана қаласының 32 колледжі (5 аудан бойынша) және Қазақстанның 19 өңіріндегі 688 колледж: мемлекеттік тапсырыс, мамандықтар, мекенжайлар мен телефондар."
            : "32 колледжа Астаны по 5 районам и полный республиканский реестр из 688 колледжей по всем 19 регионам Казахстана (Gov.kz №707)."}
        </p>
      </div>

      <StudentTipBanner
        title_kz="Колледжге қалай дұрыс таңдау жасайды? (ҰБТ-сыз!)"
        title_ru="Памятка: как выбрать колледж и поступить без ЕНТ"
        tip_kz="Колледждерге қабылдау аттестат балымен жүреді. Тегін оқу мен шәкіртақы алу үшін «Мемлекеттік (Госзаказ)» сүзгісін таңда. Құжат тапсыру маусым–тамызда SmartNation арқылы өтеді."
        tip_ru="Для поступления в колледж сдавать ЕНТ не нужно — конкурс идёт по среднему баллу аттестата. Включи фильтр «Государственные» для бесплатного обучения со стипендией."
        actionHref="/guides/grade-9"
        actionLabel_kz="9-сынып нұсқаулығы"
        actionLabel_ru="Гид для 9 класса"
      />

      {/* Grade 9 & 11 Explainer Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#270111] via-[#4A0221] to-[#1D1D1D] text-white space-y-3 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A31551]/60 text-[#F99184] text-xs font-bold border border-[#F99184]/40 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#F99184]" />
            <span>{lang === "kz" ? "9 және 11-сынып түлектеріне арналған" : "Выпускникам 9 и 11 классов"}</span>
          </div>
          <span className="text-[11px] font-semibold text-[#FC9385] bg-[#270111] px-3 py-1 rounded-full border border-[#FC9385]/40 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#FC9385]" />
            <span>Мемлекеттік тапсырыс (госзаказ)</span>
          </span>
        </div>

        <h2 className="text-lg sm:text-xl font-black text-white tracking-tight relative z-10">
          {lang === "kz" ? "Колледжге түсу: ҰБТ тапсыру қажет ЕМЕС!" : "Поступление в колледжи: ЕНТ СДАВАТЬ НЕ НУЖНО!"}
        </h2>

        <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed max-w-4xl relative z-10 font-normal">
          {lang === "kz"
            ? "Колледждерге қабылдау мектеп аттестатының орташа балы бойынша конкурстық негізде өтеді. Мемлекеттік колледждерде тегін білім беру гранттары (госзаказ), ай сайынғы шәкіртақы және жатақхана орындары қамтамасыз етілген."
            : "Для поступления в колледж сертификат ЕНТ не требуется — отбор ведется по среднему баллу школьного аттестата. В государственных колледжах действует 100% бесплатный госзаказ со стипендией и общежитиями."}
        </p>
      </div>

      {/* MAIN CATALOG AREA: Desktop 2-column sidebar, Mobile top search + instant results */}
      <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8 pt-1">
        {/* DESKTOP STICKY SIDEBAR (Hidden on mobile) */}
        <aside className="hidden lg:block lg:w-80 shrink-0 sticky top-20 self-start">
          <div className="p-5 rounded-3xl border border-[#EAEBEF] bg-white shadow-forte space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2 font-black text-sm text-zinc-900">
                <SlidersHorizontal className="w-4 h-4 text-[#A31551]" />
                <span>{lang === "kz" ? "Сүзгілер" : "Фильтры"}</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#A31551] text-white text-[11px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-[#A31551] hover:text-[#820232] transition-colors cursor-pointer"
                >
                  {lang === "kz" ? "Тазарту" : "Сбросить"}
                </button>
              )}
            </div>

            {renderFilterControls()}
          </div>
        </aside>

        {/* RESULTS MAIN COLUMN: Search Bar at the very top -> Results immediately below */}
        <main className="flex-1 min-w-0 w-full space-y-4">
          {/* SEARCH BAR — Prominent Forte Pill */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#A31551]" />
            <input
              type="text"
              value={collegeSearch}
              onChange={(e) => {
                setCollegeSearch(e.target.value);
                setKzLimit(40);
                if (e.target.value && showMobileFilters) {
                  setShowMobileFilters(false);
                }
              }}
              placeholder={
                lang === "kz"
                  ? "Колледж атауы, мамандық, мекенжайы немесе басшысы..."
                  : "Поиск колледжа по названию, направлению, городу, адресу или директору..."
              }
              className="w-full pl-11 pr-11 py-3.5 rounded-full border border-zinc-200 bg-white text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#A31551] focus:ring-4 focus:ring-[#A31551]/15 shadow-forte transition-all"
              style={{ outline: "none", boxShadow: "none" }}
            />
            {collegeSearch && (
              <button
                type="button"
                onClick={() => setCollegeSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center text-xs transition-colors cursor-pointer"
                aria-label={lang === "kz" ? "Тазарту" : "Очистить"}
              >
                ✕
              </button>
            )}
          </div>

          {/* CONTROL ROW: Count Badge + Mobile Filter Toggle + Reset */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-[#FDF2F7] border border-[#F99184]/40 text-xs font-bold text-[#A31551]">
                {scope === "astana"
                  ? (lang === "kz"
                      ? `${filteredColleges?.length || 0} / 32 колледж`
                      : `${filteredColleges?.length || 0} из 32 колледжей`)
                  : (lang === "kz" ? `Табылды: ${kzTotal}` : `Найдено: ${kzTotal}`)}
              </span>

              {collegeSearch && (
                <span className="text-xs text-zinc-500 font-medium hidden sm:inline">
                  {lang === "kz" ? `«${collegeSearch}» бойынша` : `по запросу «${collegeSearch}»`}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile Filter Toggle Button */}
              <button
                type="button"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className={`lg:hidden px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                  showMobileFilters || activeFilterCount > 0
                    ? "bg-[#A31551] text-white border-[#A31551]"
                    : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{lang === "kz" ? "Сүзгілер" : "Фильтры"}</span>
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-white text-[#A31551] text-[10px] font-black flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
                {showMobileFilters ? (
                  <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
                )}
              </button>

              {/* Reset Button */}
              {(collegeSearch || activeFilterCount > 0) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-[#A31551] transition-colors cursor-pointer"
                >
                  {lang === "kz" ? "Тазарту ✕" : "Сбросить ✕"}
                </button>
              )}
            </div>
          </div>

          {/* ACTIVE FILTER DISMISSIBLE CHIPS (Instant overview) */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-xs">
              <span className="text-zinc-400 font-semibold text-[11px]">
                {lang === "kz" ? "Қолданылған:" : "Активно:"}
              </span>
              {selectedOwnership !== "all" && (
                <button
                  type="button"
                  onClick={() => setSelectedOwnership("all")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] border border-[#F99184]/40 font-semibold text-[11px] hover:bg-[#fbe4ef]"
                >
                  <span>{selectedOwnership === "state" ? (lang === "kz" ? "Госзаказ" : "Госзаказ") : (lang === "kz" ? "Жеке" : "Частные")}</span>
                  <span>✕</span>
                </button>
              )}
              {selectedDistrict && (
                <button
                  type="button"
                  onClick={() => setSelectedDistrict("")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] border border-[#F99184]/40 font-semibold text-[11px] hover:bg-[#fbe4ef]"
                >
                  <span>📍 {selectedDistrict}</span>
                  <span>✕</span>
                </button>
              )}
              {selectedSpec && (
                <button
                  type="button"
                  onClick={() => setSelectedSpec("")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] border border-[#F99184]/40 font-semibold text-[11px] hover:bg-[#fbe4ef]"
                >
                  <span>{specializationsList.find((s) => s.id === selectedSpec)?.label_ru || selectedSpec}</span>
                  <span>✕</span>
                </button>
              )}
              {scope === "kz" && selectedRegion !== "all" && (
                <button
                  type="button"
                  onClick={() => setSelectedRegion("all")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] border border-[#F99184]/40 font-semibold text-[11px] hover:bg-[#fbe4ef]"
                >
                  <span>{kzRegions.find((r) => r.id === selectedRegion)?.name_ru || selectedRegion}</span>
                  <span>✕</span>
                </button>
              )}
            </div>
          )}

          {/* QUICK 1-LINE HORIZONTAL PILLS BAR (Shown when search is empty or on mobile) */}
          <div className="lg:hidden">
            <ScrollablePillBar bgGradientColor="zinc-50" showIndicator={false}>
              <button
                type="button"
                onClick={() => {
                  setSelectedOwnership("all");
                  setSelectedDistrict("");
                  setSelectedSpec("");
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  activeFilterCount === 0
                    ? "bg-[#A31551] text-white shadow-2xs"
                    : "bg-white border border-zinc-200 text-zinc-700"
                }`}
              >
                {lang === "kz" ? "Барлығы (32)" : "Все (32)"}
              </button>
              <button
                type="button"
                onClick={() => setSelectedOwnership(selectedOwnership === "state" ? "all" : "state")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 flex items-center gap-1 ${
                  selectedOwnership === "state"
                    ? "bg-[#A31551] text-white shadow-2xs"
                    : "bg-white border border-zinc-200 text-zinc-700"
                }`}
              >
                <span>🏛️</span>
                <span>{lang === "kz" ? "Госзаказ (10)" : "Госзаказ (10)"}</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedOwnership(selectedOwnership === "private" ? "all" : "private")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 flex items-center gap-1 ${
                  selectedOwnership === "private"
                    ? "bg-[#A31551] text-white shadow-2xs"
                    : "bg-white border border-zinc-200 text-zinc-700"
                }`}
              >
                <span>🏢</span>
                <span>{lang === "kz" ? "Жеке (22)" : "Частные (22)"}</span>
              </button>
              {specializationsList.filter((s) => s.id).map((sp) => {
                const isActive = selectedSpec === sp.id;
                return (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => setSelectedSpec(isActive ? "" : sp.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 flex items-center gap-1 ${
                      isActive
                        ? "bg-[#A31551] text-white shadow-2xs"
                        : "bg-white border border-zinc-200 text-zinc-700"
                    }`}
                  >
                    <span>{sp.icon}</span>
                    <span>{lang === "kz" ? sp.label_kz : sp.label_ru}</span>
                  </button>
                );
              })}
            </ScrollablePillBar>
          </div>

          {/* MOBILE EXPANDABLE FILTER DRAWER (Collapsible, doesn't bury search results) */}
          {showMobileFilters && (
            <div className="lg:hidden p-5 rounded-3xl border border-[#EAEBEF] bg-white shadow-forte space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
                <span className="font-bold text-xs uppercase tracking-wider text-zinc-700">
                  {lang === "kz" ? "Толық сүзгілер" : "Все параметры фильтрации"}
                </span>
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="text-xs font-bold text-[#A31551] px-2 py-1 rounded-lg hover:bg-[#FDF2F7]"
                >
                  {lang === "kz" ? "Жабу ✕" : "Закрыть ✕"}
                </button>
              </div>

              {renderFilterControls()}
            </div>
          )}

          {/* RESULTS GRID — Displayed IMMEDIATELY below search */}
          {scope === "astana" ? (
            loading ? (
              <div className="py-16 text-center text-xs text-zinc-400 flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-[#A31551] border-t-transparent animate-spin inline-block" />
                <span>{lang === "kz" ? "Колледждер тізімі жүктелуде..." : "Загрузка реестра колледжей..."}</span>
              </div>
            ) : (filteredColleges?.length || 0) === 0 ? (
              <div className="py-16 text-center text-xs text-zinc-500 bg-white rounded-3xl border border-zinc-200 space-y-2">
                <p className="font-bold text-sm text-zinc-800">{t.common.noResults}</p>
                <p className="text-zinc-400">
                  {lang === "kz"
                    ? "Іздеу сөзін өзгертіп көріңіз немесе сүзгілерді тазартыңыз."
                    : "Попробуйте изменить запрос или сбросить активные фильтры."}
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-2 px-4 py-2 rounded-full bg-[#FDF2F7] text-[#A31551] text-xs font-bold border border-[#F99184]/40"
                >
                  {lang === "kz" ? "Барлық 32 колледжді көрсету" : "Показать все 32 колледжа"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {filteredColleges.map((col) => (
                  <div
                    key={col.id}
                    className="p-5 sm:p-6 rounded-3xl border border-[#EAEBEF] bg-white hover:border-[#A31551]/40 card-hover shadow-forte flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[11px] font-bold px-3 py-0.5 rounded-full border ${col.is_state ? "bg-[#FDF2F7] text-[#A31551] border-[#F99184]/40" : "bg-zinc-100 text-zinc-700 border-zinc-200"}`}>
                            {lang === "kz" ? col.ownership_kz : col.ownership_ru}
                          </span>
                          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-600">
                            {lang === "kz" ? col.district_kz : col.district_ru}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-[#A31551] bg-[#FDF2F7] px-2 py-0.5 rounded-full border border-[#FC9385]/50">
                          Gov.kz 707 ✓
                        </span>
                      </div>

                      <Link href={`/education/institutions/${col.slug}`} className="block group">
                        <h3 className="font-extrabold text-zinc-900 text-base sm:text-lg group-hover:text-[#A31551] transition-colors leading-snug">
                          {lang === "kz" ? col.name_kz : col.name_ru}
                        </h3>
                      </Link>

                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100/70 text-zinc-800 text-xs font-semibold">
                        <span>🎓</span>
                        <span>{lang === "kz" ? col.specialization_kz : col.specialization_ru}</span>
                      </div>

                      <div className="space-y-1.5 text-xs text-zinc-600 pt-1">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                          <span>{lang === "kz" ? col.address_kz : col.address_ru}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-[#A31551] shrink-0" />
                          <a href={`tel:${col.contact_phone.split(",")[0].trim()}`} className="font-bold text-[#A31551] hover:underline">
                            {col.contact_phone}
                          </a>
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#FDF2F7]/60 border border-[#F99184]/30 text-xs text-[#4A0221] space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-[#A31551]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#A31551]" />
                          <span>{lang === "kz" ? "Қабылдау талабы:" : "Условия приема:"}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">
                          {lang === "kz" ? col.admission_kz : col.admission_ru}
                        </p>
                      </div>

                      <div className="text-[11px] text-zinc-500 flex items-center gap-1.5">
                        <span className="font-semibold text-zinc-700">{lang === "kz" ? "Жатақхана:" : "Общежитие:"}</span>
                        <span>{lang === "kz" ? col.dormitory_info_kz : col.dormitory_info_ru}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                      <a href={`tel:${col.contact_phone.split(",")[0].trim()}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold transition-colors">
                        <Phone className="w-3 h-3 text-[#A31551]" />
                        <span>{lang === "kz" ? "Қоңырау шалу" : "Позвонить"}</span>
                      </a>

                      <Link href={`/education/institutions/${col.slug}`} className="font-bold text-[#A31551] hover:text-[#820232] flex items-center gap-1 group">
                        <span>{lang === "kz" ? "Толық профиль" : "Подробнее"}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Nationwide 688 Colleges View */
            <div className="space-y-6">
              {loadingKz ? (
                <div className="py-16 text-center text-xs text-zinc-400 flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-[#A31551] border-t-transparent animate-spin inline-block" />
                  <span>{lang === "kz" ? "Қазақстан колледждері жүктелуде..." : "Загрузка колледжей Казахстана..."}</span>
                </div>
              ) : kzColleges.length === 0 ? (
                <div className="py-16 text-center text-xs text-zinc-500 bg-white rounded-3xl border border-zinc-200 space-y-2">
                  <p className="font-bold text-sm text-zinc-800">{t.common.noResults}</p>
                  <p className="text-zinc-400">
                    {lang === "kz"
                      ? "Іздеу сөзін өзгертіп көріңіз немесе сүзгілерді тазартыңыз."
                      : "Попробуйте изменить запрос или сбросить активные фильтры."}
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="mt-2 px-4 py-2 rounded-full bg-[#FDF2F7] text-[#A31551] text-xs font-bold border border-[#F99184]/40"
                  >
                    {lang === "kz" ? "Барлық колледждерді көрсету" : "Показать все колледжи"}
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {kzColleges.map((col) => (
                      <div
                        key={col.id}
                        className="p-5 sm:p-6 rounded-3xl border border-[#EAEBEF] bg-white hover:border-[#A31551]/40 shadow-forte flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className={`text-[11px] font-bold px-3 py-0.5 rounded-full border ${col.is_state ? "bg-[#FDF2F7] text-[#A31551] border-[#F99184]/40" : "bg-zinc-100 text-zinc-700 border-zinc-200"}`}>
                                {lang === "kz" ? col.ownership_kk : col.ownership_ru}
                              </span>
                              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-700">
                                {lang === "kz" ? col.region_kk : col.region_ru}
                              </span>
                            </div>
                            <span className="text-[10px] font-semibold text-[#A31551] bg-[#FDF2F7] px-2 py-0.5 rounded-full border border-[#FC9385]/50">
                              Gov.kz 707 ✓
                            </span>
                          </div>

                          <h3 className="font-extrabold text-zinc-900 text-base sm:text-lg leading-snug">
                            <Link
                              href={`/colleges/${col.slug}`}
                              className="hover:text-[#A31551] transition-colors"
                            >
                              {lang === "kz" ? col.name_kk : col.name_ru}
                            </Link>
                          </h3>

                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100/70 text-zinc-800 text-xs font-semibold">
                            <span>🎓</span>
                            <span>{lang === "kz" ? col.specialization_kk : col.specialization_ru}</span>
                          </div>

                          <div className="space-y-1.5 text-xs text-zinc-600 pt-1">
                            {col.address_ru && (
                              <div className="flex items-start gap-2">
                                <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                                <span>{lang === "kz" ? col.address_kk : col.address_ru}</span>
                              </div>
                            )}
                            {col.director && (
                              <div className="flex items-center gap-2">
                                <UserCheck className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                <span>{col.director}</span>
                              </div>
                            )}
                            {col.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-[#A31551] shrink-0" />
                                <a href={`tel:${col.phone.split(",")[0].trim()}`} className="font-bold text-[#A31551] hover:underline">
                                  {col.phone}
                                </a>
                              </div>
                            )}
                            {col.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                <a href={`mailto:${col.email}`} className="text-zinc-700 hover:underline">
                                  {col.email}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-zinc-400 truncate max-w-[180px]">
                            {lang === "kz" ? col.dormitory_info_kk : col.dormitory_info_ru}
                          </span>
                          <Link
                            href={`/colleges/${col.slug}`}
                            className="font-bold text-[#A31551] hover:text-[#820232] flex items-center gap-1 group shrink-0"
                          >
                            <span>{lang === "kz" ? "Колледж профилі" : "Профиль колледжа"}</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  {kzColleges.length < kzTotal && (
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => setKzLimit((l) => l + 60)}
                        className="px-6 py-3 rounded-full bg-[#A31551] hover:bg-[#820232] text-white text-xs font-bold shadow-forte transition-all cursor-pointer"
                      >
                        {lang === "kz"
                          ? `Тағы көрсету (${kzColleges.length} / ${kzTotal})`
                          : `Показать ещё (${kzColleges.length} из ${kzTotal})`}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
