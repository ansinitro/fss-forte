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
  Globe
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { api } from "@/lib/api";
import { AstanaCollege, KZCollege, RegionStat } from "@/lib/types";
import { StudentTipBanner } from "@/components/common/StudentTipBanner";

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
          {scope === "astana"
            ? (lang === "kz" ? "Астана колледждері (32)" : "Колледжи Астаны (32)")
            : (lang === "kz" ? "Қазақстан колледждері (688)" : "Колледжи Казахстана (688)")}
        </span>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] text-xs font-bold border border-[#F99184]/40">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Gov.kz №707 • {lang === "kz" ? "Барлық 19 өңір" : "Все 19 регионов РК"}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          {lang === "kz" ? "Астана және Қазақстан колледждері (688)" : "Колледжи Астаны и всего Казахстана (688)"}
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base max-w-3xl leading-relaxed">
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

      {/* Scope Switcher: Astana 32 vs Full Kazakhstan 688 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 rounded-3xl bg-zinc-100/80">
        <button
          type="button"
          onClick={() => setScope("astana")}
          className={`p-4 rounded-2xl text-left transition-all flex items-center justify-between ${scope === "astana"
              ? "bg-white text-[#A31551] shadow-forte font-bold border border-[#F99184]/40"
              : "text-zinc-600 hover:text-zinc-900 font-medium"
            }`}
        >
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#A31551]" />
            <div>
              <div className="text-sm font-bold">
                {lang === "kz" ? "Астана қаласы (5 аудан)" : "Колледжи города Астаны"}
              </div>
              <div className="text-[11px] text-zinc-400">
                {lang === "kz" ? "Жатақхана, бағыттар және госзаказ (10 / 22)" : "Общежития, госзаказ (10) и частные (22)"}
              </div>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] font-bold">
            32
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setScope("kz");
            setKzLimit(40);
          }}
          className={`p-4 rounded-2xl text-left transition-all flex items-center justify-between ${scope === "kz"
              ? "bg-white text-[#A31551] shadow-forte font-bold border border-[#F99184]/40"
              : "text-zinc-600 hover:text-zinc-900 font-medium"
            }`}
        >
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-[#A31551]" />
            <div>
              <div className="text-sm font-bold">
                {lang === "kz" ? "Бүкіл Қазақстан колледждері" : "Все колледжи Казахстана"}
              </div>
              <div className="text-[11px] text-zinc-400">
                {lang === "kz" ? "Алматы, Шымкент және барлық облыстар" : "Алматы, Шымкент и 16 областей (Gov.kz 707)"}
              </div>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 font-bold">
            688
          </span>
        </button>
      </div>

      {/* Grade 9 & 11 Explainer Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#270111] via-[#4A0221] to-[#1D1D1D] text-white space-y-4 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A31551]/60 text-[#F99184] text-xs font-bold border border-[#F99184]/40 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#F99184]" />
            <span>{lang === "kz" ? "9 және 11-сынып түлектеріне арналған" : "Выпускникам 9 и 11 классов"}</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-700/60 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Мемлекеттік тапсырыс (госзаказ)</span>
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight relative z-10">
          {lang === "kz" ? "Колледжге түсу: ҰБТ тапсыру қажет ЕМЕС!" : "Поступление в колледжи: ЕНТ СДАВАТЬ НЕ НУЖНО!"}
        </h2>

        <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed max-w-4xl relative z-10 font-normal">
          {lang === "kz"
            ? "Колледждерге қабылдау мектеп аттестатының орташа балы бойынша конкурстық негізде өтеді. Мемлекеттік колледждерде тегін білім беру гранттары (госзаказ), ай сайынғы шәкіртақы және жатақхана орындары қамтамасыз етілген."
            : "Для поступления в колледж сертификат ЕНТ не требуется — отбор ведется по среднему баллу школьного аттестата. В государственных колледжах действует 100% бесплатный госзаказ со стипендией и общежитиями."}
        </p>

        <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-semibold text-[#F99184] relative z-10">
          <span className="px-2.5 py-1 rounded-lg bg-white/10">✓ 688 колледж (ҚР)</span>
          <span className="px-2.5 py-1 rounded-lg bg-white/10">✓ 32 колледж (Астана)</span>
          <span className="px-2.5 py-1 rounded-lg bg-white/10">✓ Құжат қабылдау: 25 маусым – 25 тамыз</span>
          <span className="px-2.5 py-1 rounded-lg bg-white/10">✓ eGov.kz арқылы онлайн өтінім</span>
        </div>
      </div>

      {/* Modern Filter Panel */}
      <div className="p-5 sm:p-6 rounded-3xl border border-[#EAEBEF] bg-white shadow-forte space-y-5">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={collegeSearch}
              onChange={(e) => {
                setCollegeSearch(e.target.value);
                setKzLimit(40);
              }}
              placeholder={
                lang === "kz"
                  ? "Колледж атауы, мамандық, мекенжайы немесе басшысы..."
                  : "Поиск колледжа по названию, направлению, городу, адресу или директору..."
              }
              className="w-full pl-11 pr-11 py-3.5 rounded-full border border-zinc-200 bg-white text-sm text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:border-[#A31551] focus:ring-2 focus:ring-[#A31551]/20 shadow-xs transition-all"
            />
            {collegeSearch && (
              <button
                type="button"
                onClick={() => setCollegeSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 flex items-center justify-center text-xs transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-full bg-[#FDF2F7] border border-[#F99184]/40 text-xs font-bold text-[#A31551]">
              {scope === "astana"
                ? (lang === "kz" ? `${filteredColleges?.length || 0} / 32 колледж` : `${filteredColleges?.length || 0} из 32 колледжей`)
                : (lang === "kz" ? `Табылды: ${kzTotal}` : `Найдено: ${kzTotal}`)}
            </div>

            {(collegeSearch || selectedDistrict || selectedOwnership !== "all" || selectedSpec || (scope === "kz" && selectedRegion !== "all")) && (
              <button
                type="button"
                onClick={() => {
                  setCollegeSearch("");
                  setSelectedDistrict("");
                  setSelectedOwnership("all");
                  setSelectedSpec("");
                  setSelectedRegion("all");
                }}
                className="text-xs font-bold px-3 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-[#A31551] transition-colors whitespace-nowrap"
              >
                {lang === "kz" ? "Тазарту ✕" : "Сбросить ✕"}
              </button>
            )}
          </div>
        </div>

        {/* Ownership Filter */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            {lang === "kz" ? "Меншік нысаны / Оқу түрі:" : "Тип учреждения и финансирование:"}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1 rounded-2xl bg-zinc-100/80">
            {[
              {
                id: "all",
                label_kz: scope === "astana" ? "Барлық 32 колледж" : "Барлық колледждер (688)",
                label_ru: scope === "astana" ? "Все 32 колледжа" : "Все колледжи РК (688)",
                desc_kz: scope === "astana" ? "Астана қаласы" : "Барлық өңірлер",
                desc_ru: scope === "astana" ? "По городу Астана" : "По всему Казахстану",
              },
              {
                id: "state",
                label_kz: scope === "astana" ? "Мемлекеттік (100% грант / 10)" : "Мемлекеттік колледждер",
                label_ru: scope === "astana" ? "Государственные (Госзаказ / 10)" : "Государственные (Госзаказ)",
                desc_kz: "Әкімдік гранты + шәкіртақы",
                desc_ru: "Бесплатное обучение + стипендия",
              },
              {
                id: "private",
                label_kz: scope === "astana" ? "Жеке меншік (22)" : "Жеке меншік колледждер",
                label_ru: scope === "astana" ? "Частные колледжи (22)" : "Частные колледжи",
                desc_kz: "Ақылы және серіктестік",
                desc_ru: "Коммерческие и контрактные",
              },
            ].map((own) => {
              const isActive = selectedOwnership === own.id;
              return (
                <button
                  key={own.id}
                  type="button"
                  onClick={() => setSelectedOwnership(own.id as any)}
                  className={`p-2.5 sm:p-3 rounded-xl text-left transition-all flex flex-col justify-between ${isActive
                      ? "bg-white text-[#A31551] shadow-forte border border-[#F99184]/40 font-bold"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-white/60 font-medium"
                    }`}
                >
                  <span className="text-xs font-bold flex items-center justify-between">
                    <span>{lang === "kz" ? own.label_kz : own.label_ru}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#A31551]" />}
                  </span>
                  <span className={`text-[10px] mt-0.5 ${isActive ? "text-[#A31551]/80" : "text-zinc-400"}`}>
                    {lang === "kz" ? own.desc_kz : own.desc_ru}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* District filter (Astana) OR Region filter (KZ) */}
        {scope === "astana" ? (
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              {lang === "kz" ? "Астана аудандары:" : "Район города Астаны:"}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "", label_kz: "Барлық аудандар", label_ru: "Все районы", count: 32 },
                { id: "Сарыарқа", label_kz: "Сарыарқа", label_ru: "Сарыаркинский район", count: 14 },
                { id: "Алматы", label_kz: "Алматы", label_ru: "Алматинский район", count: 7 },
                { id: "Байқоңыр", label_kz: "Байқоңыр", label_ru: "Байконурский район", count: 6 },
                { id: "Есіл", label_kz: "Есіл & Нұра", label_ru: "Есильский & Нуринский", count: 4 },
                { id: "Сарайшық", label_kz: "Сарайшық", label_ru: "Сарайшыкский район", count: 1 },
              ].map((dist) => {
                const isActive = selectedDistrict === dist.id;
                return (
                  <button
                    key={dist.id}
                    type="button"
                    onClick={() => setSelectedDistrict(dist.id)}
                    className={`px-3.5 py-2 rounded-full text-xs transition-all flex items-center gap-1.5 ${isActive
                        ? "bg-[#4A0221] text-white shadow-forte font-bold"
                        : "bg-zinc-50 border border-zinc-200 text-zinc-700 hover:border-[#A31551]/30 hover:bg-[#FDF2F7]/50 font-medium"
                      }`}
                  >
                    <span>📍</span>
                    <span>{lang === "kz" ? dist.label_kz : dist.label_ru}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white font-bold" : "bg-zinc-200/70 text-zinc-600"}`}>
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
              {lang === "kz" ? "Қазақстан өңірлері (19):" : "Регион / Город Казахстана (19):"}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedRegion("all");
                  setKzLimit(40);
                }}
                className={`px-3.5 py-2 rounded-full text-xs transition-all flex items-center gap-1.5 ${selectedRegion === "all"
                    ? "bg-[#4A0221] text-white shadow-forte font-bold"
                    : "bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-[#FDF2F7]/50 font-medium"
                  }`}
              >
                <span>{lang === "kz" ? "Барлық өңір" : "Все регионы"}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedRegion === "all" ? "bg-white/20 text-white" : "bg-zinc-200/70"}`}>
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
                    className={`px-3.5 py-2 rounded-full text-xs transition-all flex items-center gap-1.5 ${isActive
                        ? "bg-[#4A0221] text-white shadow-forte font-bold"
                        : "bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-[#FDF2F7]/50 font-medium"
                      }`}
                  >
                    <span>{lang === "kz" ? reg.name_kk : reg.name_ru}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-zinc-200/70"}`}>
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
            {lang === "kz" ? "Дайындық бағыты (мамандықтар):" : "Профиль подготовки (специальности):"}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            {[
              { id: "", icon: "🌟", label_kz: "Барлық бағыттар", label_ru: "Все направления" },
              { id: "ит", icon: "💻", label_kz: "IT & Байланыс", label_ru: "ИТ и технологии" },
              { id: "медицин", icon: "🩺", label_kz: "Медицина & Фармация", label_ru: "Медицина" },
              { id: "педагог", icon: "📚", label_kz: "Педагогика", label_ru: "Педагогика" },
              { id: "транспорт", icon: "🚆", label_kz: "Көлік & Логистика", label_ru: "Транспорт и связь" },
              { id: "сервис", icon: "🍽️", label_kz: "Тамақтану & Сервис", label_ru: "Сервис и туризм" },
              { id: "техн", icon: "⚙️", label_kz: "Техникалық & Политех", label_ru: "Технические науки" },
              { id: "строит", icon: "🏗️", label_kz: "Құрылыс & Сәулет", label_ru: "Строительство" },
              { id: "эконом", icon: "💼", label_kz: "Экономика & Бизнес", label_ru: "Экономика и право" },
            ].map((sp) => {
              const isActive = selectedSpec === sp.id;
              return (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => setSelectedSpec(sp.id)}
                  className={`px-3.5 py-2 rounded-full whitespace-nowrap text-xs transition-all flex items-center gap-1.5 shrink-0 ${isActive
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
      </div>

      {/* Results Grid */}
      {scope === "astana" ? (
        loading ? (
          <div className="py-16 text-center text-xs text-zinc-400">
            {lang === "kz" ? "Колледждер тізімі жүктелуде..." : "Загрузка реестра колледжей..."}
          </div>
        ) : (filteredColleges?.length || 0) === 0 ? (
          <div className="py-16 text-center text-xs text-zinc-500 bg-white rounded-3xl border border-zinc-200">
            {t.common.noResults}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredColleges.map((col) => (
              <div
                key={col.id}
                className="p-6 rounded-3xl border border-[#EAEBEF] bg-white hover:border-[#A31551]/40 card-hover shadow-forte flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${col.is_state ? "bg-[#FDF2F7] text-[#A31551] border-[#F99184]/40" : "bg-zinc-100 text-zinc-700 border-zinc-200"}`}>
                        {lang === "kz" ? col.ownership_kz : col.ownership_ru}
                      </span>
                      <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-600">
                        {lang === "kz" ? col.district_kz : col.district_ru}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Gov.kz 707 ✓
                    </span>
                  </div>

                  <Link href={`/education/institutions/${col.slug}`} className="block group">
                    <h3 className="font-extrabold text-zinc-900 text-lg group-hover:text-[#A31551] transition-colors leading-snug">
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
            <div className="py-16 text-center text-xs text-zinc-400">
              {lang === "kz" ? "Қазақстан колледждері жүктелуде..." : "Загрузка колледжей Казахстана..."}
            </div>
          ) : kzColleges.length === 0 ? (
            <div className="py-16 text-center text-xs text-zinc-500 bg-white rounded-3xl border border-zinc-200">
              {t.common.noResults}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Gov.kz 707 ✓
                        </span>
                      </div>

                      <h3 className="font-extrabold text-zinc-900 text-base sm:text-lg leading-snug">
                        {lang === "kz" ? col.name_kk : col.name_ru}
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
                            <span className="font-bold text-[#A31551]">{col.phone}</span>
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

                    <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
                      <span>{lang === "kz" ? col.dormitory_info_kk : col.dormitory_info_ru}</span>
                    </div>
                  </div>
                ))}
              </div>

              {kzColleges.length < kzTotal && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setKzLimit((l) => l + 60)}
                    className="px-6 py-3 rounded-full bg-[#A31551] hover:bg-[#820232] text-white text-xs font-bold shadow-forte transition-all"
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
    </div>
  );
}
