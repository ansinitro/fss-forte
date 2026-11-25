"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Search,
  BookOpen,
  ExternalLink,
  Building2,
  Languages,
  CheckCircle2,
  Filter,
  Calculator,
  Sparkles,
  School,
  MapPin,
  Phone,
  TrendingUp,
  Coins,
  Award,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  ArrowRight
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { api } from "@/lib/api";
import {
  Institution,
  AstanaCollege,
  EducationProgram,
  StudentHubProgram,
  StudentHubUniversity,
  StudentHubEntResult,
  StudentHubEntYear,
  CalculatorMatch
} from "@/lib/types";
import { VerificationBadge } from "@/components/common/VerificationBadge";

const UNT_PAIRS = [
  "Математика + Информатика",
  "Математика + Физика",
  "Биология + Химия",
  "Математика + География",
  "Всемирная история + Основы права",
  "Всемирная история + География",
  "География + Иностранный язык",
  "Иностранный язык + Всемирная история",
  "Биология + География",
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
  "Қызылорда",
  "Петропавл",
  "Орал",
  "Түркістан",
  "Көкшетау",
  "Талдықорған",
  "Жезқазған",
  "Теміртау",
  "Екібастұз"
];

export default function EducationPage() {
  const { lang, t } = useI18n();
  const [activeTab, setActiveTab] = useState<"colleges" | "institutions" | "studenthub" | "calculator" | "universities">("colleges");

  // Verified Astana Colleges Data (32 from Gov.kz 707)
  const [colleges, setColleges] = useState<AstanaCollege[]>([]);
  const [collegeSearch, setCollegeSearch] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedOwnership, setSelectedOwnership] = useState<"all" | "state" | "private">("all");
  const [selectedSpec, setSelectedSpec] = useState("");

  // Verified Astana Institutions & Official Programs
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>("");

  // StudentHub Data
  const [shPrograms, setShPrograms] = useState<StudentHubProgram[]>([]);
  const [shUniversities, setShUniversities] = useState<StudentHubUniversity[]>([]);
  const [entResults, setEntResults] = useState<StudentHubEntResult[]>([]);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPair, setSelectedPair] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [maxCutoff, setMaxCutoff] = useState<number>(140);

  // Calculator State
  const [calcScore, setCalcScore] = useState<number>(105);
  const [calcPair, setCalcPair] = useState<string>("Математика + Информатика");
  const [calcCity, setCalcCity] = useState<string>("Астана");
  const [calcMatches, setCalcMatches] = useState<CalculatorMatch[]>([]);
  const [calcFilterChance, setCalcFilterChance] = useState<string>(""); // all, high, medium, low, reach

  // Selected Program Modal
  const [activeModalProg, setActiveModalProg] = useState<StudentHubProgram | null>(null);
  const [expandedUni, setExpandedUni] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  // Switch tab and sync with URL
  const switchTab = (tab: "colleges" | "institutions" | "studenthub" | "calculator" | "universities") => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState({}, "", url.toString());
    }
  };

  // Sync activeTab with URL ?tab= query parameter on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam === "colleges" || tabParam === "institutions" || tabParam === "studenthub" || tabParam === "calculator" || tabParam === "universities") {
        setActiveTab(tabParam as any);
      }
    }
  }, []);

  // Load all data on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [instsData, collegesData, shProgsResp, shUnisResp, entResp] = await Promise.all([
        api.getInstitutions(typeFilter || undefined),
        api.getColleges(),
        api.getStudentHubPrograms(),
        api.getStudentHubUniversities(),
        api.getStudentHubEntResults(),
      ]);
      setInstitutions(instsData);
      setColleges(collegesData);
      setShPrograms(shProgsResp.programs);
      setShUniversities(shUnisResp.universities);
      setEntResults(entResp.results);
      setLoading(false);
    }
    loadData();
  }, [typeFilter]);

  // Recalculate UNT grant chances when score, pair, or city changes
  useEffect(() => {
    let isMounted = true;
    async function calculate() {
      const city = calcCity === "Барлығы / Все города" ? "" : calcCity;
      const res = await api.getStudentHubCalculator(calcScore, calcPair, city);
      if (isMounted) {
        setCalcMatches(res.matches);
      }
    }
    calculate();
    return () => { isMounted = false; };
  }, [calcScore, calcPair, calcCity]);

  // Map for fast ENT stats lookup
  const entMap = useMemo(() => {
    const map = new Map<string, StudentHubEntResult>();
    entResults.forEach((e) => map.set(e.slug, e));
    return map;
  }, [entResults]);

  // Filtered Astana Institutions
  const filteredInstitutions = useMemo(() => {
    return institutions.filter((i) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const name = lang === "kz" ? i.name_kz : i.name_ru;
      const short = (lang === "kz" ? i.short_name_kz : i.short_name_ru) || "";
      return name.toLowerCase().includes(q) || short.toLowerCase().includes(q);
    });
  }, [institutions, searchQuery, lang]);

  // Filtered Astana Colleges (32 from Gov.kz 707)
  const filteredColleges = useMemo(() => {
    return colleges.filter((c) => {
      if (selectedDistrict) {
        const dKz = c.district_kz.toLowerCase();
        const dRu = c.district_ru.toLowerCase();
        const target = selectedDistrict.toLowerCase();
        if (!dKz.includes(target) && !dRu.includes(target)) return false;
      }
      if (selectedOwnership === "state" && !c.is_state) return false;
      if (selectedOwnership === "private" && c.is_state) return false;
      if (selectedSpec) {
        const sKz = c.specialization_kz.toLowerCase();
        const sRu = c.specialization_ru.toLowerCase();
        const target = selectedSpec.toLowerCase();
        if (!sKz.includes(target) && !sRu.includes(target)) return false;
      }
      if (collegeSearch.trim()) {
        const q = collegeSearch.toLowerCase();
        const nRu = c.name_ru.toLowerCase();
        const nKz = c.name_kz.toLowerCase();
        const fn = c.fullname_ru.toLowerCase();
        const addr = c.address_ru.toLowerCase();
        const ph = c.contact_phone.toLowerCase();
        const spec = c.specialization_ru.toLowerCase();
        if (
          !nRu.includes(q) &&
          !nKz.includes(q) &&
          !fn.includes(q) &&
          !addr.includes(q) &&
          !ph.includes(q) &&
          !spec.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [colleges, selectedDistrict, selectedOwnership, selectedSpec, collegeSearch]);

  // Filtered StudentHub Programs (218)
  const filteredShPrograms = useMemo(() => {
    return shPrograms.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = p.title.toLowerCase().includes(q);
        const descMatch = p.description.toLowerCase().includes(q);
        const pairMatch = p.pair.toLowerCase().includes(q);
        const uniMatch = p.universities.some((u) => u.uni_name.toLowerCase().includes(q) || u.city.toLowerCase().includes(q));
        if (!titleMatch && !descMatch && !pairMatch && !uniMatch) return false;
      }
      if (selectedPair && !p.pair.toLowerCase().includes(selectedPair.toLowerCase())) {
        return false;
      }
      if (selectedCity && selectedCity !== "Барлығы / Все города") {
        const hasCity = p.universities.some((u) => u.city.toLowerCase().includes(selectedCity.toLowerCase()));
        if (!hasCity) return false;
      }
      if (maxCutoff < 140 && p.avg_score && p.avg_score > maxCutoff) {
        return false;
      }
      return true;
    });
  }, [shPrograms, searchQuery, selectedPair, selectedCity, maxCutoff]);

  // Filtered StudentHub Universities (90)
  const filteredShUniversities = useMemo(() => {
    return shUniversities.filter((u) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = u.name.toLowerCase().includes(q);
        const cityMatch = u.city.toLowerCase().includes(q);
        const progMatch = u.programs.some((pr) => pr.name.toLowerCase().includes(q));
        if (!nameMatch && !cityMatch && !progMatch) return false;
      }
      if (selectedCity && selectedCity !== "Барлығы / Все города") {
        if (!u.city.toLowerCase().includes(selectedCity.toLowerCase())) return false;
      }
      return true;
    });
  }, [shUniversities, searchQuery, selectedCity]);

  // Filtered Calculator Matches
  const displayedCalcMatches = useMemo(() => {
    if (!calcFilterChance) return calcMatches;
    return calcMatches.filter((m) => m.chance === calcFilterChance);
  }, [calcMatches, calcFilterChance]);

  // Quick preset scores
  const PRESET_SCORES = [75, 85, 95, 105, 115, 125, 135];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] text-xs font-bold border border-[#F99184]/40">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>2-бөлім / Раздел 2</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          {t.sections.educationTitle}
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base max-w-2xl leading-relaxed">
          {lang === "kz"
            ? "Астананың мемлекеттік реестрі, StudentHub 218 мамандығы, 90 ЖОО және ҰБТ грант калькуляторы бір жерде."
            : "Реестр Астаны, 218 специальностей StudentHub, 90 вузов Казахстана и калькулятор грантов ЕНТ в одном месте."}
        </p>
      </div>

      {/* Main Tab Bar - Forte Branded */}
      <div className="flex border-b border-zinc-200 overflow-x-auto gap-2 sm:gap-6 text-sm font-semibold scrollbar-none pb-1">
        {/* 1. Astana Colleges (32 from Gov.kz 707) */}
        <button
          type="button"
          onClick={() => { switchTab("colleges"); }}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "colleges"
              ? "border-[#A31551] text-[#A31551] font-bold"
              : "border-transparent text-zinc-500 hover:text-zinc-950"
          }`}
        >
          <GraduationCap className="w-4 h-4 text-[#A31551]" />
          <span>{lang === "kz" ? "Астана колледждері (32)" : "Колледжи Астаны (32)"}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#FDF2F7] text-[#A31551] font-bold border border-[#F99184]/40">
            {colleges.length || 32}
          </span>
        </button>

        {/* 2. Astana Universities */}
        <button
          type="button"
          onClick={() => { switchTab("institutions"); setSearchQuery(""); }}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "institutions"
              ? "border-[#A31551] text-[#A31551] font-bold"
              : "border-transparent text-zinc-500 hover:text-zinc-950"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{lang === "kz" ? "Астана ЖОО-лары" : "Вузы Астаны"}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-medium">
            {institutions.length}
          </span>
        </button>

        {/* 3. StudentHub 218 Programs */}
        <button
          type="button"
          onClick={() => { switchTab("studenthub"); setSearchQuery(""); }}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === "studenthub"
            ? "border-[#A31551] text-[#A31551] font-bold"
            : "border-transparent text-zinc-500 hover:text-zinc-950"
            }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{lang === "kz" ? "StudentHub мамандықтары" : "Каталог специальностей"}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#FDF2F7] text-[#A31551] font-bold border border-[#F99184]/30">
            218
          </span>
        </button>

        {/* 4. ENT Grant Calculator */}
        <button
          type="button"
          onClick={() => { switchTab("calculator"); setSearchQuery(""); }}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === "calculator"
            ? "border-[#A31551] text-[#A31551] font-bold"
            : "border-transparent text-zinc-500 hover:text-zinc-950"
            }`}
        >
          <Calculator className="w-4 h-4 text-[#A31551]" />
          <span>
            {lang === "kz" ? "ҰБТ Грант Калькуляторы" : "Калькулятор грантов ЕНТ"}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#FDF2F7] text-[#A31551] font-bold border border-[#F99184]/40 animate-pulse">
            NEW
          </span>
        </button>

        {/* 5. Kazakhstan Universities (90) */}
        <button
          type="button"
          onClick={() => { switchTab("universities"); setSearchQuery(""); }}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === "universities"
            ? "border-[#A31551] text-[#A31551] font-bold"
            : "border-transparent text-zinc-500 hover:text-zinc-950"
            }`}
        >
          <School className="w-4 h-4" />
          <span>{lang === "kz" ? "Қазақстан ЖОО-лары" : "Вузы Казахстана"}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-medium">
            90
          </span>
        </button>
      </div>

      {/* =====================================================================
          TAB 0: ASTANA OFFICIAL COLLEGES (32) - GOV.KZ 707
      ====================================================================== */}
      {activeTab === "colleges" && (
        <div className="space-y-6">
          {/* Grade 9 & 11 Important Notice Banner */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#270111] via-[#4A0221] to-[#1D1D1D] text-white space-y-3 shadow-forte border border-[#A31551]/30">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A31551]/50 text-[#F99184] text-xs font-bold border border-[#F99184]/40">
                <Sparkles className="w-3.5 h-3.5 text-[#F99184]" />
                <span>{lang === "kz" ? "9 және 11-сынып түлектеріне арналған" : "Выпускникам 9 и 11 классов"}</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-700/60 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Gov.kz 707 ресми тізілімі</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              {lang === "kz" ? "Колледжге түсу ережесі: ҰБТ тапсыру қажет ЕМЕС!" : "Правила приема в колледжи: ЕНТ СДАВАТЬ НЕ НУЖНО!"}
            </h2>

            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed max-w-4xl">
              {lang === "kz"
                ? "Колледждерге құжат қабылдау тек мектеп аттестатының орташа балы бойынша конкурстық негізде өтеді (ҰБТ балы талап етілмейді). Астана қаласының 10 мемлекеттік колледжінде тегін білім беру гранттары (госзаказ), ай сайынғы шәкіртақы, тегін ыстық тамақ және жатақхана орындары қарастырылған."
                : "Для поступления в колледжи результаты ЕНТ не требуются — зачисление проходит по среднему баллу школьного аттестата. В 10 государственных колледжах Астаны действует бесплатный государственный заказ (грант) акимата с выплатой стипендии, бесплатным питанием и местами в общежитии."}
            </p>

            <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-semibold text-[#F99184]">
              <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs">✓ 32 ресми колледж</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs">✓ 10 мемлекеттік гранттық колледж</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs">✓ Құжат қабылдау: 25 маусым – 25 тамыз</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs">✓ eGov.kz арқылы онлайн өтінім</span>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={collegeSearch}
                onChange={(e) => setCollegeSearch(e.target.value)}
                placeholder={lang === "kz" ? "Колледж атауы, мамандық (IT, медицина, көлік, сервис), көшесі немесе директоры бойынша іздеу..." : "Поиск колледжа по названию, направлению (ИТ, медицина, сервис), адресу..."}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:border-[#A31551] shadow-forte"
              />
            </div>

            {/* Ownership Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
              <span className="text-zinc-400 text-[11px] uppercase tracking-wider shrink-0 mr-1">
                {lang === "kz" ? "Меншік түрі:" : "Тип:"}
              </span>
              {[
                { id: "all", label_kz: `Барлығы (${colleges.length})`, label_ru: `Все (${colleges.length})` },
                { id: "state", label_kz: "Мемлекеттік (Тегін госзаказ / 10)", label_ru: "Государственные (Госзаказ / 10)" },
                { id: "private", label_kz: "Жеке меншік (22)", label_ru: "Частные колледжи (22)" },
              ].map((own) => (
                <button
                  key={own.id}
                  type="button"
                  onClick={() => setSelectedOwnership(own.id as any)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    selectedOwnership === own.id
                      ? "bg-[#A31551] text-white shadow-forte font-bold"
                      : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  {lang === "kz" ? own.label_kz : own.label_ru}
                </button>
              ))}
            </div>

            {/* District Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
              <span className="text-zinc-400 text-[11px] uppercase tracking-wider shrink-0 mr-1">
                {lang === "kz" ? "Аудан:" : "Район:"}
              </span>
              {[
                { id: "", label_kz: "Барлық аудандар", label_ru: "Все районы" },
                { id: "Сарыарқа", label_kz: "Сарыарқа ауданы (14)", label_ru: "Сарыаркинский район (14)" },
                { id: "Алматы", label_kz: "Алматы ауданы (7)", label_ru: "Алматинский район (7)" },
                { id: "Байқоңыр", label_kz: "Байқоңыр ауданы (6)", label_ru: "Байконурский район (6)" },
                { id: "Есіл", label_kz: "Есіл & Нұра (4)", label_ru: "Есильский & Нуринский (4)" },
                { id: "Сарайшық", label_kz: "Сарайшық (1)", label_ru: "Сарайшыкский район (1)" },
              ].map((dist) => (
                <button
                  key={dist.id}
                  type="button"
                  onClick={() => setSelectedDistrict(dist.id)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    selectedDistrict === dist.id
                      ? "bg-[#4A0221] text-white shadow-forte font-bold"
                      : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  {lang === "kz" ? dist.label_kz : dist.label_ru}
                </button>
              ))}
            </div>

            {/* Specialization Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
              <span className="text-zinc-400 text-[11px] uppercase tracking-wider shrink-0 mr-1">
                {lang === "kz" ? "Бағыты:" : "Профиль:"}
              </span>
              {[
                { id: "", label_kz: "Барлық бағыттар", label_ru: "Все направления" },
                { id: "it", label_kz: "IT & Цифрлық", label_ru: "ИТ и технологии" },
                { id: "медицин", label_kz: "Медицина & Фармация", label_ru: "Медицина" },
                { id: "педагог", label_kz: "Педагогика & Тәрбие", label_ru: "Педагогика" },
                { id: "транспорт", label_kz: "Көлік & Логистика", label_ru: "Транспорт и связь" },
                { id: "сервис", label_kz: "Тамақтану & Сервис", label_ru: "Питание и туризм" },
                { id: "техник", label_kz: "Техникалық & Политех", label_ru: "Технические науки" },
                { id: "строитель", label_kz: "Құрылыс & ТКШ", label_ru: "Строительство и ЖКХ" },
                { id: "эконом", label_kz: "Экономика & Бизнес", label_ru: "Экономика и бизнес" },
                { id: "прав", label_kz: "Құқық & Басқару", label_ru: "Право и управление" },
              ].map((sp) => (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => setSelectedSpec(sp.id)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                    selectedSpec === sp.id
                      ? "bg-[#A31551] text-white shadow-forte font-bold"
                      : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  {lang === "kz" ? sp.label_kz : sp.label_ru}
                </button>
              ))}
            </div>
          </div>

          {/* Colleges Grid */}
          {filteredColleges.length === 0 ? (
            <div className="py-16 text-center text-xs text-zinc-500 bg-white rounded-2xl border border-zinc-200">
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
                    {/* Top Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${
                            col.is_state
                              ? "bg-[#FDF2F7] text-[#A31551] border-[#F99184]/40"
                              : "bg-zinc-100 text-zinc-700 border-zinc-200"
                          }`}
                        >
                          {lang === "kz" ? col.ownership_kz : col.ownership_ru}
                        </span>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-50 border border-zinc-200 text-zinc-600">
                          {lang === "kz" ? col.district_kz : col.district_ru}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Gov.kz 707 ✓
                      </span>
                    </div>

                    {/* College Title */}
                    <Link href={`/education/institutions/${col.slug}`} className="block group">
                      <h3 className="font-extrabold text-zinc-900 text-lg group-hover:text-[#A31551] transition-colors leading-snug">
                        {lang === "kz" ? col.name_kz : col.name_ru}
                      </h3>
                    </Link>

                    {/* Specialization Badge */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100/70 text-zinc-800 text-xs font-semibold">
                      <span>🎓</span>
                      <span>{lang === "kz" ? col.specialization_kz : col.specialization_ru}</span>
                    </div>

                    {/* Address & Phone */}
                    <div className="space-y-1.5 text-xs text-zinc-600 pt-1">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                        <span>{lang === "kz" ? col.address_kz : col.address_ru}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#A31551] shrink-0" />
                        <a
                          href={`tel:${col.contact_phone.split(",")[0].trim()}`}
                          className="font-bold text-[#A31551] hover:underline"
                        >
                          {col.contact_phone}
                        </a>
                      </div>
                    </div>

                    {/* Admission Info */}
                    <div className="p-3 rounded-2xl bg-[#FDF2F7]/60 border border-[#F99184]/30 text-xs text-[#4A0221] space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-[#A31551]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#A31551]" />
                        <span>{lang === "kz" ? "Қабылдау талабы:" : "Условия приема:"}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        {lang === "kz" ? col.admission_kz : col.admission_ru}
                      </p>
                    </div>

                    {/* Dormitory */}
                    <div className="text-[11px] text-zinc-500 flex items-center gap-1.5">
                      <span className="font-semibold text-zinc-700">{lang === "kz" ? "Жатақхана:" : "Общежитие:"}</span>
                      <span>{lang === "kz" ? col.dormitory_info_kz : col.dormitory_info_ru}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                    <a
                      href={`tel:${col.contact_phone.split(",")[0].trim()}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold transition-colors"
                    >
                      <Phone className="w-3 h-3 text-[#A31551]" />
                      <span>{lang === "kz" ? "Қоңырау шалу" : "Позвонить"}</span>
                    </a>

                    <Link
                      href={`/education/institutions/${col.slug}`}
                      className="font-bold text-[#A31551] hover:text-[#820232] flex items-center gap-1 group"
                    >
                      <span>{lang === "kz" ? "Толық ақпарат" : "Подробнее"}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 1: ASTANA OFFICIAL INSTITUTIONS
      ====================================================================== */}
      {activeTab === "institutions" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === "kz" ? "Оқу орнының атауы бойынша іздеу (AITU, ЕҰУ, Колледж...)" : "Поиск по названию вуза/колледжа..."}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:border-[#A31551] shadow-forte"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setTypeFilter("")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${typeFilter === ""
                  ? "bg-[#A31551] text-white"
                  : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                  }`}
              >
                {t.common.all}
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter("university")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${typeFilter === "university"
                  ? "bg-[#A31551] text-white"
                  : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                  }`}
              >
                {lang === "kz" ? "Университеттер" : "Университеты"}
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter("college")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${typeFilter === "college"
                  ? "bg-[#A31551] text-white"
                  : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                  }`}
              >
                {lang === "kz" ? "Колледждер" : "Колледжи"}
              </button>
            </div>
          </div>

          {filteredInstitutions.length === 0 ? (
            <div className="py-16 text-center text-xs text-zinc-500 bg-white rounded-2xl border border-zinc-200">
              {t.common.noResults}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredInstitutions.map((inst) => (
                <div
                  key={inst.id}
                  className="p-6 rounded-2xl border border-[#EAEBEF] bg-white hover:border-[#A31551]/30 card-hover shadow-forte flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-[#FDF2F7] text-[#A31551] capitalize border border-[#F99184]/30">
                        {inst.institution_type === "college" ? (lang === "kz" ? "Мемлекеттік колледж" : "Государственный колледж") : (lang === "kz" ? "Университет" : "Университет")}
                      </span>
                      <VerificationBadge status={inst.status} compact />
                    </div>

                    <Link href={`/education/institutions/${inst.slug}`} className="block group">
                      <h3 className="font-bold text-zinc-900 text-lg group-hover:text-[#A31551] transition-colors leading-snug">
                        {lang === "kz" ? inst.name_kz : inst.name_ru}
                      </h3>
                    </Link>

                    <p className="text-xs text-zinc-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>{lang === "kz" ? inst.address_kz : inst.address_ru}</span>
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-zinc-600">
                      {inst.has_military_department && (
                        <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 font-medium">
                          {lang === "kz" ? "Әскери кафедра бар" : "Есть военная кафедра"}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 font-medium">
                        {t.common.dormitory}: {lang === "kz" ? "Қамтамасыз етіледі" : "Имеется"}
                      </span>
                      {inst.contact_phone && (
                        <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 font-medium flex items-center gap-1">
                          <Phone className="w-3 h-3 text-zinc-400" />
                          <span>{inst.contact_phone}</span>
                        </span>
                      )}
                    </div>

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
                      className="font-bold text-[#A31551] hover:text-[#820232]"
                    >
                      {t.common.explore} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 2: STUDENTHUB 218 PROGRAMS EXPLORER
      ====================================================================== */}
      {activeTab === "studenthub" && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === "kz" ? "Мамандық атауы, кілтсөз немесе ЖОО..." : "Поиск по названию или вузу..."}
                className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-zinc-200 text-xs sm:text-sm text-zinc-900 focus:outline-hidden focus:border-[#A31551]"
              />
            </div>

            {/* UNT Pair Selector */}
            <div className="sm:col-span-4">
              <select
                value={selectedPair}
                onChange={(e) => setSelectedPair(e.target.value)}
                className="w-full py-2 px-3 bg-white rounded-xl border border-zinc-200 text-xs sm:text-sm text-zinc-800 focus:outline-hidden focus:border-[#A31551]"
              >
                <option value="">{lang === "kz" ? "Барлық бейіндік пәндер" : "Все профильные предметы"}</option>
                {UNT_PAIRS.map((pair) => (
                  <option key={pair} value={pair}>
                    {pair}
                  </option>
                ))}
              </select>
            </div>

            {/* City Selector */}
            <div className="sm:col-span-3">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full py-2 px-3 bg-white rounded-xl border border-zinc-200 text-xs sm:text-sm text-zinc-800 focus:outline-hidden focus:border-[#A31551]"
              >
                <option value="">{lang === "kz" ? "Барлық қалалар" : "Все города"}</option>
                {CITIES.map((c) => (
                  <option key={c} value={c === "Барлығы / Все города" ? "" : c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Result Count and Stats */}
          <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
            <span>
              {lang === "kz" ? "Табылған мамандықтар саны:" : "Найдено специальностей:"}{" "}
              <strong className="text-zinc-900 font-bold">{filteredShPrograms.length}</strong> {lang === "kz" ? "мамандық" : "программ"}
            </span>
            <span className="text-[11px] text-zinc-400">
              {lang === "kz" ? "Деректер көзі: StudentHub.kz" : "Источник: StudentHub.kz"}
            </span>
          </div>

          {/* Cards Grid */}
          {filteredShPrograms.length === 0 ? (
            <div className="py-16 text-center text-xs text-zinc-500 bg-white rounded-2xl border border-zinc-200">
              {t.common.noResults}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredShPrograms.map((prog) => {
                const ent = entMap.get(prog.slug);
                const latestEnt = ent?.history?.find((h) => h.min_score != null);

                return (
                  <div
                    key={prog.slug}
                    onClick={() => setActiveModalProg(prog)}
                    className="p-5 rounded-2xl border border-[#EAEBEF] bg-white hover:border-[#A31551]/30 hover:shadow-forte-hover transition-all cursor-pointer flex flex-col justify-between group shadow-forte"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#FDF2F7] text-[#A31551] border border-[#F99184]/30">
                          {prog.pair}
                        </span>
                        {prog.avg_score && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA]">
                            {prog.avg_score} {lang === "kz" ? "балл" : "баллов"}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-zinc-900 text-base group-hover:text-[#A31551] transition-colors leading-snug">
                        {prog.title}
                      </h3>

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
                      <span>{lang === "kz" ? "Толық ақпарат" : "Подробнее"}</span>
                      <span>→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 3: INTERACTIVE UNT GRANT CALCULATOR - FORTE LUXURY BRANDING
      ====================================================================== */}
      {activeTab === "calculator" && (
        <div className="space-y-8">
          {/* Hero Banner for Calculator */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#270111] via-[#4A0221] to-[#1D1D1D] text-white space-y-6 shadow-xl relative overflow-hidden border border-white/10">
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#F99184] text-xs font-bold border border-[#F99184]/30 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-[#F99184]" />
                <span>{lang === "kz" ? "Ресми ҰБТ деректері негізіндегі есептеуіш" : "Расчёт на основе официальных результатов ЕНТ"}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {lang === "kz" ? "ҰБТ Грант Калькуляторы" : "Калькулятор грантов ЕНТ 2026/2027"}
              </h2>
              <p className="text-zinc-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                {lang === "kz"
                  ? "Баллыңызды, бейіндік пәндерді және қаланы енгізіңіз. Жүйе 218 мамандық пен 90 университеттің шекті балдарымен салыстырып, грантқа түсу ықтималдығын есептейді."
                  : "Введите ваши баллы ЕНТ, профильные предметы и город. Система сопоставит ваши баллы с официальными результатами по 218 специальностям и 90 вузам Казахстана."}
              </p>
            </div>

            {/* Inputs Box */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white/10 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/15 relative z-10">
              {/* UNT Score Input */}
              <div className="md:col-span-4 space-y-2">
                <label className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
                  <span>{lang === "kz" ? "Сіздің ҰБТ балыңыз:" : "Ваш балл ЕНТ:"}</span>
                  <span className="text-lg font-extrabold text-[#F99184]">{calcScore} / 140</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="140"
                  value={calcScore}
                  onChange={(e) => setCalcScore(parseInt(e.target.value) || 50)}
                  className="w-full accent-[#A31551] cursor-pointer"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {PRESET_SCORES.map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setCalcScore(score)}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-colors ${calcScore === score
                        ? "bg-[#A31551] text-white font-bold"
                        : "bg-white/15 text-zinc-300 hover:bg-white/25"
                        }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>

              {/* Profile Pair Selector */}
              <div className="md:col-span-5 space-y-2">
                <label className="text-xs font-semibold text-zinc-200">
                  {lang === "kz" ? "Бейіндік пәндер жұбы:" : "Пара профильных предметов:"}
                </label>
                <select
                  value={calcPair}
                  onChange={(e) => setCalcPair(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-zinc-900/80 border border-white/20 text-white text-xs sm:text-sm focus:outline-hidden focus:border-[#A31551]"
                >
                  {UNT_PAIRS.map((pair) => (
                    <option key={pair} value={pair} className="bg-zinc-900 text-white">
                      {pair}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target City Selector */}
              <div className="md:col-span-3 space-y-2">
                <label className="text-xs font-semibold text-zinc-200">
                  {lang === "kz" ? "Қала таңдау:" : "Целевой город:"}
                </label>
                <select
                  value={calcCity}
                  onChange={(e) => setCalcCity(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-zinc-900/80 border border-white/20 text-white text-xs sm:text-sm focus:outline-hidden focus:border-[#A31551]"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c} className="bg-zinc-900 text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Chance Filters Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-zinc-500 font-medium whitespace-nowrap">
              {lang === "kz" ? "Ықтималдық сүзгісі:" : "Фильтр шансов:"}
            </span>
            <button
              type="button"
              onClick={() => setCalcFilterChance("")}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${calcFilterChance === ""
                ? "bg-[#A31551] text-white"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
            >
              {lang === "kz" ? `Барлығы (${calcMatches.length})` : `Все (${calcMatches.length})`}
            </button>
            <button
              type="button"
              onClick={() => setCalcFilterChance("high")}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${calcFilterChance === "high"
                ? "bg-emerald-700 text-white"
                : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{lang === "kz" ? "Жоғары мүмкіндік" : "Высокий шанс"}</span>
              <span className="text-[10px] opacity-80">
                ({calcMatches.filter((m) => m.chance === "high").length})
              </span>
            </button>
            <button
              type="button"
              onClick={() => setCalcFilterChance("medium")}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${calcFilterChance === "medium"
                ? "bg-amber-600 text-white"
                : "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>{lang === "kz" ? "Орташа мүмкіндік" : "Средний шанс"}</span>
              <span className="text-[10px] opacity-80">
                ({calcMatches.filter((m) => m.chance === "medium").length})
              </span>
            </button>
            <button
              type="button"
              onClick={() => setCalcFilterChance("low")}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${calcFilterChance === "low"
                ? "bg-orange-600 text-white"
                : "bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100"
                }`}
            >
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span>{lang === "kz" ? "Төменгі шек" : "Низкий шанс"}</span>
              <span className="text-[10px] opacity-80">
                ({calcMatches.filter((m) => m.chance === "low").length})
              </span>
            </button>
            <button
              type="button"
              onClick={() => setCalcFilterChance("reach")}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${calcFilterChance === "reach"
                ? "bg-zinc-700 text-white"
                : "bg-zinc-100 text-zinc-700 border border-zinc-200 hover:bg-zinc-200"
                }`}
            >
              <span className="w-2 h-2 rounded-full bg-zinc-400" />
              <span>{lang === "kz" ? "Ақылы оқу" : "Платное"}</span>
              <span className="text-[10px] opacity-80">
                ({calcMatches.filter((m) => m.chance === "reach").length})
              </span>
            </button>
          </div>

          {/* Calculator Results Grid */}
          {displayedCalcMatches.length === 0 ? (
            <div className="py-16 text-center text-xs text-zinc-500 bg-white rounded-2xl border border-zinc-200">
              {lang === "kz" ? "Таңдалған критерийлер бойынша бағдарламалар табылмады." : "По выбранным критериям программы не найдены."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedCalcMatches.map((match) => {
                const getChancePill = (chance: string) => {
                  switch (chance) {
                    case "high":
                      return "bg-emerald-50 text-emerald-800 border-emerald-200";
                    case "medium":
                      return "bg-amber-50 text-amber-800 border-amber-200";
                    case "low":
                      return "bg-orange-50 text-orange-800 border-orange-200";
                    default:
                      return "bg-zinc-100 text-zinc-700 border-zinc-200";
                  }
                };

                return (
                  <div
                    key={match.program.slug}
                    onClick={() => setActiveModalProg(match.program)}
                    className="p-5 rounded-2xl border border-[#EAEBEF] bg-white hover:border-[#A31551]/30 hover:shadow-forte-hover transition-all cursor-pointer flex flex-col justify-between shadow-forte"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${getChancePill(match.chance)}`}>
                          {lang === "kz" ? match.chance_label_kz : match.chance_label_ru}
                        </span>
                        {match.latest_min_score && (
                          <span className="text-[11px] text-zinc-500">
                            {lang === "kz" ? "Шекті:" : "Проходной:"} <strong className="text-zinc-900">{match.latest_min_score}</strong>
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-zinc-900 text-base leading-snug">
                        {match.program.title}
                      </h3>

                      <div className="flex flex-wrap gap-2 text-xs text-zinc-600">
                        <span className="px-2 py-0.5 rounded-md bg-[#FDF2F7] text-[#A31551] border border-[#F99184]/30 font-bold">
                          {match.program.pair}
                        </span>
                        {match.program.avg_price && (
                          <span className="px-2 py-0.5 rounded-md bg-zinc-50 border border-zinc-100">
                            {lang === "kz" ? "Орташа оқу ақысы:" : "Обучение:"} {match.program.avg_price}
                          </span>
                        )}
                      </div>

                      {/* Matching Universities Preview */}
                      {match.matching_unis && match.matching_unis.length > 0 && (
                        <div className="pt-2">
                          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                            {lang === "kz" ? "Бұл қалада оқытатын ЖОО:" : "Вузы в этом городе:"}
                          </div>
                          <div className="space-y-1">
                            {match.matching_unis.slice(0, 3).map((u, i) => (
                              <div key={i} className="text-xs text-zinc-700 flex items-center justify-between py-0.5 border-b border-zinc-50">
                                <span className="truncate pr-2">{u.uni_name}</span>
                                {u.score && (
                                  <span className="font-mono text-[11px] text-[#A31551] shrink-0 font-bold">
                                    {u.score} б.
                                  </span>
                                )}
                              </div>
                            ))}
                            {match.matching_unis.length > 3 && (
                              <div className="text-[11px] text-[#A31551] font-bold pt-0.5">
                                + тағы {match.matching_unis.length - 3} университет...
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-[#A31551] font-bold">
                      <span>{lang === "kz" ? "Университеттер мен тарихты ашу" : "Посмотреть вузы и проходные"}</span>
                      <span>→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 4: KAZAKHSTAN UNIVERSITIES (90)
      ====================================================================== */}
      {activeTab === "universities" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === "kz" ? "Университет атауы немесе мамандық..." : "Поиск по названию университета или программе..."}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:border-[#A31551] shadow-forte"
              />
            </div>

            <div className="sm:w-64">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full py-2.5 px-3 bg-white rounded-xl border border-zinc-200 text-sm text-zinc-800 focus:outline-hidden focus:border-[#A31551] shadow-forte"
              >
                <option value="">{lang === "kz" ? "Барлық қалалар" : "Все города"}</option>
                {CITIES.map((c) => (
                  <option key={c} value={c === "Барлығы / Все города" ? "" : c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
            <span>
              {lang === "kz" ? "Табылған университеттер:" : "Найдено университетов:"}{" "}
              <strong className="text-zinc-900 font-bold">{filteredShUniversities.length}</strong>
            </span>
          </div>

          {filteredShUniversities.length === 0 ? (
            <div className="py-16 text-center text-xs text-zinc-500 bg-white rounded-2xl border border-zinc-200">
              {t.common.noResults}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredShUniversities.map((uni) => {
                const isExpanded = expandedUni === uni.slug;

                return (
                  <div
                    key={uni.slug}
                    className="p-6 rounded-2xl border border-[#EAEBEF] bg-white hover:border-[#A31551]/30 shadow-forte flex flex-col justify-between"
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

                      <h3 className="font-bold text-zinc-900 text-lg leading-snug">
                        {uni.name}
                      </h3>

                      <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                        {uni.phone && (
                          <a
                            href={`tel:${uni.phone}`}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-50 hover:bg-[#FDF2F7] text-zinc-700 hover:text-[#A31551] font-medium transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5 text-zinc-400" />
                            <span>{uni.phone}</span>
                          </a>
                        )}
                      </div>

                      {/* Expandable program list */}
                      {uni.programs && uni.programs.length > 0 && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => setExpandedUni(isExpanded ? null : uni.slug)}
                            className="text-xs font-bold text-[#A31551] hover:text-[#820232] flex items-center gap-1"
                          >
                            <span>
                              {isExpanded
                                ? (lang === "kz" ? "Мамандықтар тізімін жабу" : "Скрыть список программ")
                                : (lang === "kz" ? `Мамандықтар тізімін көру (${uni.programs.length})` : `Показать программы (${uni.programs.length})`)}
                            </span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          {isExpanded && (
                            <div className="mt-3 space-y-1.5 max-h-64 overflow-y-auto pr-1 border-t border-zinc-100 pt-2 text-xs">
                              {uni.programs.map((pr, idx) => (
                                <div
                                  key={idx}
                                  className="p-2 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-between"
                                >
                                  <div>
                                    <div className="font-semibold text-zinc-900">{pr.name}</div>
                                    <div className="text-[11px] text-zinc-500">{pr.pair}</div>
                                  </div>
                                  {pr.score && (
                                    <span className="font-mono text-xs font-bold text-[#A31551] bg-[#FDF2F7] px-2 py-0.5 rounded-md shrink-0 border border-[#F99184]/30">
                                      {pr.score} б.
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                      <a
                        href={uni.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-zinc-900 flex items-center gap-1 font-medium"
                      >
                        <span>{lang === "kz" ? "StudentHub парақшасы" : "Страница StudentHub"}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          PROGRAM DETAIL MODAL (OFFERING UNIVERSITIES + HISTORICAL ENT GRANTS)
      ====================================================================== */}
      {activeModalProg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-zinc-200 flex flex-col justify-between">
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-100 sticky top-0 bg-white/95 backdrop-blur-xs z-10 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-[#FDF2F7] text-[#A31551] border border-[#F99184]/40">
                  {activeModalProg.pair}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 leading-tight">
                  {activeModalProg.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalProg(null)}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Score and Price summary */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#FDF2F7]/50 border border-[#F99184]/30">
                  <div className="text-[10px] text-[#A31551] uppercase font-bold">
                    {lang === "kz" ? "Орташа шекті балл" : "Средний балл ЕНТ"}
                  </div>
                  <div className="text-lg font-extrabold text-[#A31551] mt-0.5">
                    {activeModalProg.avg_score ? `${activeModalProg.avg_score} балл` : "—"}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <div className="text-[10px] text-zinc-400 uppercase font-bold">
                    {lang === "kz" ? "Орташа оқу ақысы" : "Ориентировочная цена"}
                  </div>
                  <div className="text-base font-extrabold text-zinc-900 mt-0.5">
                    {activeModalProg.avg_price || "—"}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-zinc-400 uppercase font-bold">
                    {lang === "kz" ? "Оқытатын ЖОО" : "Обучают вузов"}
                  </div>
                  <div className="text-lg font-extrabold text-[#A31551] mt-0.5">
                    {activeModalProg.universities_count}
                  </div>
                </div>
              </div>

              {/* Description */}
              {activeModalProg.description && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                    {lang === "kz" ? "Мамандық сипаттамасы" : "Описание специальности"}
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    {activeModalProg.description}
                  </p>
                </div>
              )}

              {/* Historical ENT Results */}
              {(() => {
                const ent = entMap.get(activeModalProg.slug);
                if (!ent || !ent.history || ent.history.length === 0) return null;
                const validYears = ent.history.filter((h) => h.min_score != null);
                if (validYears.length === 0) return null;

                return (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>{lang === "kz" ? "ҰБТ мемлекеттік гранттар статистикасы" : "Статистика государственных грантов ЕНТ"}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {validYears.map((h, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-2">
                          <div className="text-xs font-bold text-amber-900">
                            {h.competition}
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                              <div className="text-[10px] text-amber-700">{lang === "kz" ? "Шекті" : "Мин"}</div>
                              <div className="text-sm font-extrabold text-amber-950">{h.min_score}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-amber-700">{lang === "kz" ? "Орташа" : "Сред"}</div>
                              <div className="text-sm font-extrabold text-amber-950">{h.avg_score || "—"}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-amber-700">{lang === "kz" ? "Грант саны" : "Грантов"}</div>
                              <div className="text-sm font-extrabold text-amber-950">{h.total_grants || "—"}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Universities List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center justify-between">
                  <span>{lang === "kz" ? "Осы мамандықты оқытатын университеттер:" : "Университеты, обучающие по программе:"}</span>
                  <span className="text-zinc-400 text-[11px] font-normal">
                    {activeModalProg.universities.length} {lang === "kz" ? "университет" : "вузов"}
                  </span>
                </h4>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {activeModalProg.universities.map((u, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl border border-zinc-200 bg-white hover:border-[#A31551]/30 flex items-center justify-between gap-3 text-xs shadow-2xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-zinc-900">{u.uni_name}</div>
                        <div className="text-zinc-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-zinc-400" />
                          <span>{u.city || "Қазақстан"}</span>
                          {u.price && <span className="ml-2 font-medium text-zinc-700">• {u.price}</span>}
                        </div>
                      </div>

                      {u.score && (
                        <div className="shrink-0 text-right">
                          <div className="text-[10px] text-zinc-400 font-semibold uppercase">{lang === "kz" ? "Шекті балл" : "Проходной"}</div>
                          <div className="font-mono text-sm font-bold text-[#A31551]">{u.score} б.</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-zinc-50 border-t border-zinc-100 rounded-b-3xl flex items-center justify-between text-xs">
              <a
                href={activeModalProg.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 hover:text-zinc-900 font-medium flex items-center gap-1"
              >
                <span>{lang === "kz" ? "StudentHub ресми бетін ашу" : "Оригинал на StudentHub.kz"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setActiveModalProg(null)}
                className="px-5 py-2.5 bg-[#A31551] hover:bg-[#820232] text-white font-bold rounded-xl transition-colors shadow-sm"
              >
                {lang === "kz" ? "Жабу" : "Закрыть"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
