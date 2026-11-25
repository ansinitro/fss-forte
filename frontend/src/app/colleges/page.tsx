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
  ShieldCheck,
  ArrowLeft,
  Filter,
  ExternalLink,
  Building2
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { api } from "@/lib/api";
import { AstanaCollege } from "@/lib/types";

export default function CollegesPage() {
  const { lang, t } = useI18n();
  const [colleges, setColleges] = useState<AstanaCollege[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [collegeSearch, setCollegeSearch] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedOwnership, setSelectedOwnership] = useState<"all" | "state" | "private">("all");
  const [selectedSpec, setSelectedSpec] = useState("");

  useEffect(() => {
    async function loadColleges() {
      setLoading(true);
      const data = await api.getColleges();
      setColleges(Array.isArray(data) ? data : []);
      setLoading(false);
    }
    loadColleges();
  }, []);

  // Filtered colleges calculation
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
          {lang === "kz" ? "Астана колледждері (32)" : "Колледжи Астаны (32)"}
        </span>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] text-xs font-bold border border-[#F99184]/40">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Gov.kz 707 • Астана қаласы</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          {lang === "kz" ? "Астананың 32 колледжі мен тегін гранттары" : "32 колледжа Астаны и госзаказ"}
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base max-w-3xl leading-relaxed">
          {lang === "kz"
            ? "Астана қаласының барлық 32 колледжі: 5 аудан, тегін мемлекеттік тапсырыс орындары, мамандықтар және қабылдау шарттары."
            : "Все 32 колледжа Астаны: 5 районов, бесплатный госзаказ, специальности и условия поступления."}
        </p>
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
            ? "Колледждерге қабылдау тек мектеп аттестатының орташа балы бойынша конкурстық негізде өтеді. Астана қаласының 10 мемлекеттік колледжінде тегін білім беру гранттары (госзаказ), ай сайынғы шәкіртақы, тегін ыстық тамақ және жатақхана орындары толықтай қамтамасыз етілген."
            : "Для поступления в колледж сертификат ЕНТ не требуется — отбор ведется по среднему баллу школьного аттестата. В 10 государственных колледжах Астаны действует 100% бесплатный госзаказ (грант) акимата со стипендией, бесплатным питанием и общежитиями."}
        </p>

        <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-semibold text-[#F99184] relative z-10">
          <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs">✓ 32 колледж</span>
          <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs">✓ 10 мемлекеттік госзаказ колледжі</span>
          <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs">✓ Құжат қабылдау: 25 маусым – 25 тамыз</span>
          <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs">✓ eGov.kz арқылы онлайн өтінім</span>
        </div>
      </div>

      {/* Modern Filter Panel */}
      <div className="p-5 sm:p-6 rounded-3xl border border-[#EAEBEF] bg-white shadow-forte space-y-5">
        {/* Search Bar & Counter */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={collegeSearch}
              onChange={(e) => setCollegeSearch(e.target.value)}
              placeholder={
                lang === "kz"
                  ? "Колледж атауы, мамандық (IT, медицина, политех...), көшесі немесе директоры..."
                  : "Поиск колледжа по названию, направлению (ИТ, медицина, политех...), адресу..."
              }
              className="w-full pl-10 pr-10 py-3 rounded-2xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:border-[#A31551] shadow-2xs transition-colors"
            />
            {collegeSearch && (
              <button
                type="button"
                onClick={() => setCollegeSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 flex items-center justify-center text-xs transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-[#FDF2F7] border border-[#F99184]/40 text-xs font-bold text-[#A31551]">
              {lang === "kz"
                ? `${filteredColleges?.length || 0} / 32 колледж`
                : `${filteredColleges?.length || 0} из 32 колледжей`}
            </div>

            {(collegeSearch || selectedDistrict || selectedOwnership !== "all" || selectedSpec) && (
              <button
                type="button"
                onClick={() => {
                  setCollegeSearch("");
                  setSelectedDistrict("");
                  setSelectedOwnership("all");
                  setSelectedSpec("");
                }}
                className="text-xs font-bold text-[#A31551] hover:text-[#820232] hover:underline transition-colors whitespace-nowrap"
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
                label_kz: `Барлық 32 колледж`,
                label_ru: `Все 32 колледжа`,
                desc_kz: "Астана қаласы бойынша",
                desc_ru: "По городу Астана",
              },
              {
                id: "state",
                label_kz: "Мемлекеттік (100% грант / 10)",
                label_ru: "Государственные (Госзаказ / 10)",
                desc_kz: "Әкімдік гранты + шәкіртақы",
                desc_ru: "Бесплатное обучение + стипендия",
              },
              {
                id: "private",
                label_kz: "Жеке меншік (22)",
                label_ru: "Частные колледжи (22)",
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

        {/* District Filter */}
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
                  className={`px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 ${isActive
                      ? "bg-[#4A0221] text-white shadow-forte font-bold"
                      : "bg-zinc-50 border border-zinc-200 text-zinc-700 hover:border-[#A31551]/30 hover:bg-[#FDF2F7]/50 font-medium"
                    }`}
                >
                  <span>📍</span>
                  <span>{lang === "kz" ? dist.label_kz : dist.label_ru}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-white/20 text-white font-bold" : "bg-zinc-200/70 text-zinc-600"
                      }`}
                  >
                    {dist.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Specialization Filter */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            {lang === "kz" ? "Дайындық бағыты (мамандықтар):" : "Профиль подготовки (специальности):"}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            {[
              { id: "", icon: "🌟", label_kz: "Барлық бағыттар", label_ru: "Все направления" },
              { id: "it", icon: "💻", label_kz: "IT & Цифрлық технологиялар", label_ru: "ИТ и технологии" },
              { id: "медицин", icon: "🩺", label_kz: "Медицина & Фармация", label_ru: "Медицина" },
              { id: "педагог", icon: "📚", label_kz: "Педагогика & Тәрбие", label_ru: "Педагогика" },
              { id: "транспорт", icon: "🚆", label_kz: "Көлік & Логистика", label_ru: "Транспорт и связь" },
              { id: "сервис", icon: "🍽️", label_kz: "Тамақтану & Сервис", label_ru: "Питание и туризм" },
              { id: "техник", icon: "⚙️", label_kz: "Техникалық & Политех", label_ru: "Технические науки" },
              { id: "строитель", icon: "🏗️", label_kz: "Құрылыс & ТКШ", label_ru: "Строительство и ЖКХ" },
              { id: "эконом", icon: "💼", label_kz: "Экономика & Бизнес", label_ru: "Экономика и бизнес" },
              { id: "прав", icon: "⚖️", label_kz: "Құқық & Басқару", label_ru: "Право и управление" },
            ].map((sp) => {
              const isActive = selectedSpec === sp.id;
              return (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => setSelectedSpec(sp.id)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-xs transition-all flex items-center gap-1.5 shrink-0 ${isActive
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

      {/* Colleges Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-zinc-400">
          {lang === "kz" ? "Колледждер тізімі жүктелуде..." : "Загрузка реестра колледжей..."}
        </div>
      ) : (filteredColleges?.length || 0) === 0 ? (
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
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${col.is_state
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
                  <span>{lang === "kz" ? "Толық профиль" : "Подробнее"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
