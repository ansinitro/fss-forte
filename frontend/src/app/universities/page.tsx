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
  Mail,
  Users,
  Coins,
  UserCheck,
  X,
  BookOpen
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { api } from "@/lib/api";
import { Institution, KZUniversity, RegionStat, StudentHubUniProgram } from "@/lib/types";
import { StudentTipBanner } from "@/components/common/StudentTipBanner";
import { ScrollablePillBar } from "@/components/common/ScrollablePillBar";

export default function UniversitiesPage() {
  const { lang, t } = useI18n();
  const [scope, setScope] = useState<"astana" | "all">("all");
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [kzUnis, setKzUnis] = useState<KZUniversity[]>([]);
  const [regions, setRegions] = useState<RegionStat[]>([]);
  const [totalKz, setTotalKz] = useState(143);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [onlyWithPrice, setOnlyWithPrice] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal state for deep inspection (Gov.kz + Univision + StudentHub merged)
  const [activeUni, setActiveUni] = useState<KZUniversity | null>(null);
  const [activeUniPrograms, setActiveUniPrograms] = useState<StudentHubUniProgram[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const qParam = new URLSearchParams(window.location.search).get("q");
      if (qParam) {
        setSearchQuery(qParam);
        setScope("all");
      }
    }
    async function loadAstana() {
      const insts = await api.getInstitutions("university");
      setInstitutions(Array.isArray(insts) ? insts : []);
    }
    loadAstana();
  }, []);

  useEffect(() => {
    let active = true;
    async function loadKZ() {
      setLoading(true);
      const data = await api.getKZUniversities({
        region: selectedRegion === "all" ? "" : selectedRegion,
        has_price: onlyWithPrice,
        search: searchQuery.trim(),
        limit: 200,
      });
      if (active) {
        setKzUnis(Array.isArray(data?.universities) ? data.universities : []);
        setRegions(Array.isArray(data?.regions) ? data.regions : []);
        setTotalKz(data?.total ?? 0);
        setLoading(false);
      }
    }
    const timer = setTimeout(loadKZ, searchQuery ? 180 : 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [selectedRegion, onlyWithPrice, searchQuery]);

  const openUniModal = async (u: KZUniversity) => {
    setActiveUni(u);
    setActiveUniPrograms([]);
    setLoadingDetail(true);
    const detail = await api.getKZUniversityBySlug(u.slug);
    if (detail?.programs) {
      setActiveUniPrograms(detail.programs);
    }
    setLoadingDetail(false);
  };

  const filteredAstana = useMemo(() => {
    return (institutions || []).filter((i) => {
      if (i.institution_type !== "university") return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const name = lang === "kz" ? i.name_kz : i.name_ru;
      const short = (lang === "kz" ? i.short_name_kz : i.short_name_ru) || "";
      return name.toLowerCase().includes(q) || short.toLowerCase().includes(q);
    });
  }, [institutions, searchQuery, lang]);

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
          {lang === "kz" ? "Университеттер (143 ЖОО)" : "Университеты Казахстана (143 вуза)"}
        </span>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] text-xs font-bold border border-[#F99184]/40">
          <Building2 className="w-3.5 h-3.5" />
          <span>Gov.kz 657 + Univision + StudentHub • {lang === "kz" ? "20 өңір" : "20 регионов"}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          {lang === "kz" ? "Қазақстан университеттері мен институттары" : "Университеты и вузы Казахстана (143)"}
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base max-w-3xl leading-relaxed">
          {lang === "kz"
            ? "ҚР 20 өңірінің ЖОО реестрі: грант конкурсына арналған 3 таңбалы кодтар (001–522), оқу ақысы, студенттер статистикасы, ректорлар мен байланыс мәліметтері."
            : "Объединённый справочник вузов по всем 20 регионам РК: коды ЕНТ для заявления на грант (001–522), стоимость обучения, статистика грантов, контакты ректоратов и программы."}
        </p>
      </div>

      <StudentTipBanner
        title_kz="Кеңес: ЖОО-ның 3 таңбалы коды не үшін керек?"
        title_ru="Зачем знать 3-значный код вуза и как выбрать университет?"
        tip_kz="Шілдеде eGov арқылы грантқа өтініш бергенде ЖОО-ның 3 таңбалы коды (мысалы, 013 — ЕНУ) және ГОП коды (мысалы, B057) көрсетіледі. Картаны басып, оқу ақысы мен өту балдарын қара!"
        tip_ru="В июле при подаче на госгрант на eGov указывается 3-значный код вуза (например, 013 для ЕНУ) и код ГОП. Нажми на любой вуз, чтобы увидеть стоимость обучения, контакты и пороги."
        actionHref="/programs"
        actionLabel_kz="131 ГОП-ты ашу"
        actionLabel_ru="Коды 131 ГОП"
      />

      {/* Scope Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 rounded-3xl bg-zinc-100/80">
        <button
          type="button"
          onClick={() => setScope("all")}
          className={`p-4 rounded-2xl text-left transition-all flex items-center justify-between ${scope === "all"
              ? "bg-white text-[#A31551] shadow-forte font-bold border border-[#F99184]/40"
              : "text-zinc-600 hover:text-zinc-900 font-medium"
            }`}
        >
          <div className="flex items-center gap-3">
            <GraduationCap className="w-5 h-5 text-[#A31551]" />
            <div>
              <div className="text-sm font-bold">
                {lang === "kz" ? "Қазақстанның барлық ЖОО-лары (Коды, бағасы, байланыс)" : "Все вузы Казахстана (Коды ЕНТ, цены, контакты)"}
              </div>
              <div className="text-[11px] text-zinc-400">
                Gov.kz 657 + Univision.kz + StudentHub.kz
              </div>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] font-bold">
            143
          </span>
        </button>

        <button
          type="button"
          onClick={() => setScope("astana")}
          className={`p-4 rounded-2xl text-left transition-all flex items-center justify-between ${scope === "astana"
              ? "bg-white text-[#A31551] shadow-forte font-bold border border-[#F99184]/40"
              : "text-zinc-600 hover:text-zinc-900 font-medium"
            }`}
        >
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-[#A31551]" />
            <div>
              <div className="text-sm font-bold">
                {lang === "kz" ? "Астананың негізгі ЖОО профильдері" : "Детальные профили вузов Астаны"}
              </div>
              <div className="text-[11px] text-zinc-400">
                {lang === "kz" ? "Әскери кафедра және жатақхана шолуы" : "Военная кафедра и общежития столицы"}
              </div>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 font-bold">
            {(institutions || []).filter(i => i.institution_type === "university").length}
          </span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 sm:p-5 rounded-3xl border border-[#EAEBEF] bg-white shadow-forte space-y-3.5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#A31551]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === "kz"
                  ? "Атауы, ҰБТ коды (мыс. 013, 522), қала, ректор..."
                  : "Поиск по названию, коду ЕНТ (напр. 013, 522), городу или ректору..."
              }
              className="w-full pl-11 pr-11 py-3.5 rounded-full border border-zinc-200 bg-white text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#A31551] focus:ring-4 focus:ring-[#A31551]/15 shadow-xs transition-all"
              style={{ outline: "none", boxShadow: "none" }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center text-xs cursor-pointer transition-colors"
                aria-label={lang === "kz" ? "Тазарту" : "Очистить"}
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {scope === "all" && (
              <button
                type="button"
                onClick={() => setOnlyWithPrice(!onlyWithPrice)}
                className={`px-4 py-3 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${onlyWithPrice
                    ? "bg-[#A31551] text-white shadow-forte"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span>{lang === "kz" ? "Оқу ақысы көрсетілген" : "С известной ценой"}</span>
              </button>
            )}

            {(searchQuery || (scope === "all" && (selectedRegion !== "all" || onlyWithPrice))) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedRegion("all");
                  setOnlyWithPrice(false);
                }}
                className="px-3.5 py-3 rounded-full bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-[#A31551] transition-colors cursor-pointer"
              >
                {lang === "kz" ? "Тазарту ✕" : "Сбросить ✕"}
              </button>
            )}
          </div>
        </div>

        {/* Search Results Summary & Active Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#FDF2F7] border border-[#F99184]/40 text-xs font-bold text-[#A31551]">
              {scope === "astana"
                ? (lang === "kz" ? `Табылды: ${filteredAstana.length} ЖОО` : `Найдено: ${filteredAstana.length} вузов`)
                : (lang === "kz" ? `Табылды: ${kzUnis.length} ЖОО` : `Найдено: ${kzUnis.length} вузов`)}
            </span>
            {searchQuery && (
              <span className="text-xs text-zinc-500 font-medium">
                {lang === "kz" ? `«${searchQuery}» бойынша` : `по запросу «${searchQuery}»`}
              </span>
            )}
          </div>

          {scope === "all" && selectedRegion !== "all" && (
            <button
              type="button"
              onClick={() => setSelectedRegion("all")}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FDF2F7] text-[#A31551] border border-[#F99184]/40 font-semibold text-xs hover:bg-[#fbe4ef]"
            >
              <span>{regions.find((r) => r.id === selectedRegion)?.name_ru || selectedRegion}</span>
              <span>✕</span>
            </button>
          )}
        </div>

        {/* Region Filter Pills for All Kazakhstan */}
        {scope === "all" && regions.length > 0 && (
          <div className="pt-1">
            <ScrollablePillBar bgGradientColor="white" showIndicator={true}>
              <button
                type="button"
                onClick={() => setSelectedRegion("all")}
                className={`px-3.5 py-2 rounded-full font-semibold whitespace-nowrap transition-all shrink-0 ${selectedRegion === "all"
                    ? "bg-[#4A0221] text-white shadow-forte font-bold"
                    : "bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                  }`}
              >
                {lang === "kz" ? `Барлық өңір (${totalKz})` : `Все регионы (${totalKz})`}
              </button>
              {regions.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRegion(r.id)}
                  className={`px-3.5 py-2 rounded-full font-semibold whitespace-nowrap transition-all shrink-0 ${selectedRegion === r.id
                      ? "bg-[#4A0221] text-white shadow-forte font-bold"
                      : "bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                    }`}
                >
                  {lang === "kz" ? r.name_kk : r.name_ru} ({r.count})
                </button>
              ))}
            </ScrollablePillBar>
          </div>
        )}
      </div>

      {/* Results View */}
      {scope === "astana" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredAstana.map((inst) => (
            <div
              key={inst.id}
              className="p-6 rounded-3xl border border-[#EAEBEF] bg-white hover:border-[#A31551]/30 card-hover shadow-forte flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FDF2F7] text-[#A31551] border border-[#F99184]/40">
                    Астана • {lang === "kz" ? "Университет" : "Вуз"}
                  </span>
                  <span className="text-[10px] font-semibold text-[#A31551] bg-[#FDF2F7] px-2 py-0.5 rounded-full border border-[#FC9385]/50">
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
      ) : loading ? (
        <div className="py-16 text-center text-xs text-zinc-400">
          {lang === "kz" ? "Университеттер тізімі жүктелуде..." : "Загрузка единого реестра вузов..."}
        </div>
      ) : kzUnis.length === 0 ? (
        <div className="py-16 text-center text-xs text-zinc-500 bg-white rounded-3xl border border-zinc-200">
          {t.common.noResults}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kzUnis.map((uni) => (
            <div
              key={uni.id}
              className="p-5 rounded-3xl border border-[#EAEBEF] bg-white hover:border-[#A31551]/40 card-hover shadow-forte flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5">
                    {uni.ent_code && (
                      <span className="font-mono text-[11px] font-black px-2.5 py-0.5 rounded-full bg-[#4A0221] text-[#F99184]">
                        Код {uni.ent_code}
                      </span>
                    )}
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FDF2F7] text-[#A31551] border border-[#F99184]/30">
                      {uni.city || (lang === "kz" ? uni.region_kk : uni.region_ru)}
                    </span>
                  </div>
                  {uni.founded_year && (
                    <span className="text-[10px] text-zinc-400 font-semibold">
                      {uni.founded_year} ж.
                    </span>
                  )}
                </div>

                <h3
                  onClick={() => openUniModal(uni)}
                  className="font-extrabold text-zinc-900 text-base leading-snug hover:text-[#A31551] cursor-pointer transition-colors"
                >
                  {lang === "kz" ? uni.name_kk : uni.name_ru}
                </h3>

                {/* Quick Ownership / Students / Price Badges */}
                <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold">
                  {uni.ownership && (
                    <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                      {uni.ownership}
                    </span>
                  )}
                  {uni.min_tuition_kzt && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FFF5F4] text-[#4A0221] border border-[#FC9385]/60">
                      от {(uni.min_tuition_kzt / 1000).toLocaleString()} тыс ₸
                    </span>
                  )}
                  {uni.students_total && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FDF2F7] text-[#A31551]">
                      {uni.students_total.toLocaleString()} {lang === "kz" ? "студ." : "студ."}
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-xs text-zinc-600">
                  {uni.address_ru && (
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{lang === "kz" ? uni.address_kk : uni.address_ru}</span>
                    </div>
                  )}
                  {uni.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate">{uni.email}</span>
                    </div>
                  )}
                  {uni.rector_ru && (
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate">{lang === "kz" ? uni.rector_kk : uni.rector_ru}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                {uni.website ? (
                  <a
                    href={uni.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-zinc-900 inline-flex items-center gap-1 font-medium"
                  >
                    <span>{lang === "kz" ? "Сайт" : "Сайт"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[11px] text-zinc-400">
                    {uni.programs_count > 0 ? `${uni.programs_count} ОП` : "Gov.kz 657"}
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => openUniModal(uni)}
                  className="font-bold text-[#A31551] hover:text-[#820232] flex items-center gap-1"
                >
                  <span>{lang === "kz" ? "Бағасы & Программалар" : "Цены и программы"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rich Detail Modal */}
      {activeUni && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs"
          onClick={() => setActiveUni(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-3xl bg-white border border-zinc-200 shadow-2xl p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  {activeUni.ent_code && (
                    <span className="font-mono text-xs font-black px-3 py-1 rounded-full bg-[#4A0221] text-[#F99184]">
                      Код ЕНТ: {activeUni.ent_code}
                    </span>
                  )}
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551]">
                    {activeUni.city || (lang === "kz" ? activeUni.region_kk : activeUni.region_ru)}
                  </span>
                  {activeUni.ownership && (
                    <span className="text-xs px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 font-semibold">
                      {activeUni.ownership}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950">
                  {lang === "kz" ? activeUni.name_kk : activeUni.name_ru}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveUni(null)}
                className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Governance & Contact Grid (Gov.kz 657) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-xs">
              <div className="space-y-1.5">
                <div className="text-zinc-400 font-bold uppercase text-[10px]">{lang === "kz" ? "Мекенжай және байланыс" : "Адрес и контакты"}</div>
                <div><strong>{lang === "kz" ? "Мекенжайы:" : "Адрес:"}</strong> {lang === "kz" ? activeUni.address_kk : activeUni.address_ru}</div>
                {activeUni.email && <div><strong>Email:</strong> {activeUni.email}</div>}
                {activeUni.phone && <div><strong>{lang === "kz" ? "Телефон:" : "Приемная:"}</strong> {activeUni.phone}</div>}
              </div>
              <div className="space-y-1.5">
                <div className="text-zinc-400 font-bold uppercase text-[10px]">{lang === "kz" ? "Басшылық (Gov.kz 657)" : "Руководство (Gov.kz 657)"}</div>
                {activeUni.rector_ru && <div><strong>{lang === "kz" ? "Ректор:" : "Ректор:"}</strong> {lang === "kz" ? activeUni.rector_kk : activeUni.rector_ru}</div>}
                {activeUni.rector_contacts && <div><strong>{lang === "kz" ? "Байланыс:" : "Контакты:"}</strong> {activeUni.rector_contacts}</div>}
                {activeUni.founded_year && <div><strong>{lang === "kz" ? "Құрылған жылы:" : "Год основания:"}</strong> {activeUni.founded_year}</div>}
              </div>
            </div>

            {/* Students & Grant Ratio (Univision) */}
            {activeUni.students_total && (
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <div className="text-[11px] text-zinc-500">{lang === "kz" ? "Барлық студент" : "Всего студентов"}</div>
                  <div className="text-lg font-black text-zinc-900">{activeUni.students_total.toLocaleString()}</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#FDF2F7] border border-[#FC9385]/50">
                  <div className="text-[11px] text-[#4A0221]">{lang === "kz" ? "Грантта" : "На гранте"}</div>
                  <div className="text-lg font-black text-[#A31551]">{(activeUni.students_grant ?? 0).toLocaleString()}</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#FFF5F4] border border-[#FC9385]/60">
                  <div className="text-[11px] text-[#4A0221]">{lang === "kz" ? "Ақылы бөлім" : "Платно"}</div>
                  <div className="text-lg font-black text-[#820232]">{(activeUni.students_paid ?? 0).toLocaleString()}</div>
                </div>
              </div>
            )}

            {/* Tuition Prices Table (Univision) */}
            {activeUni.sample_prices && activeUni.sample_prices.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-[#A31551]" />
                  <span>{lang === "kz" ? "Бағдарламалар бойынша оқу ақысы (Univision)" : "Стоимость обучения по программам (Univision)"}</span>
                </h3>
                <div className="rounded-2xl border border-zinc-200 overflow-hidden text-xs">
                  {activeUni.sample_prices.map((pr, idx) => (
                    <div key={idx} className="px-4 py-2.5 flex items-center justify-between border-b last:border-b-0 border-zinc-100 bg-white">
                      <span className="font-medium text-zinc-800">{pr.program}</span>
                      <span className="font-bold text-[#A31551] shrink-0 ml-3">{pr.price_kzt.toLocaleString()} ₸</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* StudentHub Programs Breakdown */}
            {loadingDetail ? (
              <div className="text-center text-xs text-zinc-400 py-4">...</div>
            ) : activeUniPrograms.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#A31551]" />
                  <span>{lang === "kz" ? `Білім беру бағдарламалары (${activeUniPrograms.length})` : `Образовательные программы и баллы (${activeUniPrograms.length})`}</span>
                </h3>
                <div className="max-h-60 overflow-y-auto rounded-2xl border border-zinc-200 divide-y divide-zinc-100 text-xs">
                  {activeUniPrograms.map((prog, i) => (
                    <div key={i} className="px-4 py-2.5 flex items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-zinc-900">{prog.name}</div>
                        <div className="text-[11px] text-zinc-400">{prog.pair}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {prog.score && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#FDF2F7] text-[#4A0221] font-bold border border-[#FC9385]/50">
                            {prog.score} балл
                          </span>
                        )}
                        {prog.price && (
                          <span className="text-[11px] text-zinc-500 font-medium">{prog.price}</span>
                        )}
                      </div>
                    </div>
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
