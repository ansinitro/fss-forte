"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  Calendar,
  Clock,
  ShieldCheck,
  Compass,
  BookOpen,
  Calculator
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { GlobalSearchModal } from "@/components/search/GlobalSearchModal";
import { HeroSearch } from "@/components/search/HeroSearch";
import { InteractiveBooklet } from "@/components/booklet/InteractiveBooklet";
import { useCompassGuide } from "@/components/onboarding/StudentCompassTour";

export default function HomePage() {
  const { lang, t } = useI18n();
  const { openGuide } = useCompassGuide();
  const [searchOpen, setSearchOpen] = useState(false);

  const announcements = [
    {
      id: "a1",
      title_kz: "ҚР Мемлекеттік гранттар конкурсының мерзімі",
      title_ru: "Сроки республиканского конкурса госгрантов",
      dates: "13 – 20 шілде / июля 2026",
      source: "ҰТО (testcenter.kz)",
      url: "/grants/state-general-grant",
    },
    {
      id: "a2",
      title_kz: "Астана қаласы әкімінің гранттарына құжат тапсыру",
      title_ru: "Подача документов на грант акима города Астаны",
      dates: "5 – 15 тамыз / августа 2026",
      source: "Астана қаласы Білім басқармасы",
      url: "/grants/astana-akimat-grant",
    },
    {
      id: "a3",
      title_kz: "Tech Orda — IT мектептерде тегін оқуға 600 000 ₸ ваучер",
      title_ru: "Tech Orda — Ваучеры 600 000 ₸ на бесплатное ИТ-обучение",
      dates: "1 қыркүйек – 15 қазан / 1 сен – 15 окт",
      source: "Astana Hub",
      url: "/opportunities/tech-orda-voucher",
    },
  ];

  return (
    <div className="space-y-14 py-8 sm:py-10">
      {/* 1. HERO SECTION — FRIENDLY STUDENT PLAYBOOK HEADER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF2F7] text-[#A31551] text-xs font-bold border border-[#F99184]/40 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#A31551] animate-pulse" />
            <span>
              {lang === "kz"
                ? "Forte Compass • Оқушыларға арналған интерактивті кітапша"
                : "Forte Compass • Понятный путеводитель-буклет для школьников"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-zinc-950 tracking-tight leading-[1.1]">
            <span className="bg-gradient-to-r from-[#4A0221] via-[#A31551] to-[#F03785] bg-clip-text text-transparent">
              {t.hero.title}
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-zinc-600 leading-relaxed font-normal max-w-2xl mx-auto">
            {lang === "kz"
              ? "Мамандық таңдау, ҰБТ шекті балдары, құжаттар чек-листі және 688 колледж бен 143 ЖОО — күрделі сайттарсыз, нақты кітапша форматында."
              : "Куда пойти после 9 или 11 класса, сколько баллов нужно на грант, какие документы собрать и что делать при недоборе — всё в одном понятном буклете."}
          </p>

          {/* Dual First-Time Actions + Booklet CTA */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <a
              href="#booklet"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#A51652] via-[#B8335F] to-[#A31551] hover:brightness-110 text-white text-xs sm:text-sm font-extrabold shadow-md shadow-[#A31551]/25 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>{lang === "kz" ? "Кітапшаны ашу (6 тарау)" : "Читать буклет-памятку (6 глав)"}</span>
            </a>

            <button
              type="button"
              onClick={() => openGuide("track")}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#FDF2F7] hover:bg-[#fbe4ef] text-[#A31551] border border-[#F99184]/50 text-xs sm:text-sm font-bold transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>{lang === "kz" ? "Алғаш рет кірдің бе? Жолсілтеме (1 мин)" : "Впервые здесь? Гид за 1 мин"}</span>
            </button>
          </div>

          {/* Global Search Bar - Interactive In-Place Live Search */}
          <div className="pt-2">
            <HeroSearch onOpenModal={() => setSearchOpen(true)} />

            {/* Quick pathway chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5 text-xs text-zinc-500">
              <span className="font-semibold text-zinc-400">{lang === "kz" ? "Жылдам өту:" : "Быстрый старт:"}</span>
              <Link
                href="/colleges"
                className="px-3 py-1 rounded-full bg-[#FDF2F7] border border-[#F99184]/50 text-[#A31551] hover:bg-[#A31551] hover:text-white font-bold transition-all shadow-2xs inline-flex items-center gap-1.5"
              >
                <span>🏛️ {lang === "kz" ? "Колледждер (ҰБТ-сыз)" : "Колледжи без ЕНТ (688)"}</span>
              </Link>
              <Link
                href="/calculator"
                className="px-3 py-1 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-[#FDF2F7] hover:text-[#A31551] hover:border-[#F99184]/40 font-medium transition-colors shadow-2xs"
              >
                {lang === "kz" ? "ҰБТ Грант калькуляторы" : "Калькулятор грантов ЕНТ"}
              </Link>
              <Link
                href="/programs"
                className="px-3 py-1 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-[#FDF2F7] hover:text-[#A31551] hover:border-[#F99184]/40 font-medium transition-colors shadow-2xs"
              >
                {lang === "kz" ? "131 ГОП + 218 ОП" : "131 ГОП и баллы"}
              </Link>
              <Link
                href="/universities"
                className="px-3 py-1 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-[#FDF2F7] hover:text-[#A31551] hover:border-[#F99184]/40 font-medium transition-colors shadow-2xs"
              >
                {lang === "kz" ? "143 ЖОО" : "143 ВУЗа РК"}
              </Link>
              <Link
                href="/guides"
                className="px-3 py-1 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-[#FDF2F7] hover:text-[#A31551] hover:border-[#F99184]/40 font-medium transition-colors shadow-2xs"
              >
                {lang === "kz" ? "30+ Гайд" : "30+ Гайдов"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE STUDENT BOOKLET RIGHT ON THE HOMEPAGE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <InteractiveBooklet compact />
      </section>

      {/* 3. DUAL INTERACTIVE TOOLS: ENT CALCULATOR & COLLEGES WITHOUT ENT */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#270111] via-[#4A0221] to-[#820232] text-white flex flex-col justify-between shadow-xl border border-white/10 relative overflow-hidden">
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[#FC9385] text-xs font-bold border border-[#FC9385]/40 backdrop-blur-md">
              <Calculator className="w-3.5 h-3.5 text-[#FC9385]" />
              <span>StudentHub + Univision • ҰБТ Калькулятор</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {lang === "kz" ? "Баллыңмен мемлекеттік грантқа түсе аласың ба?" : "Проверь свои шансы на грант по баллам ЕНТ"}
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
              {lang === "kz"
                ? "Қазақстанның 131 ГОП-ы, 218 мамандығы, 143 ЖОО-сы мен 2024–2026 жылдардағы ҰБТ шекті балдары негізіндегі болжау."
                : "Введи свои баллы и пару предметов — система сразу сравнит их с проходными порогами 131 ГОП и 218 программ вузов."}
            </p>
          </div>
          <div className="pt-5 relative z-10">
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#A31551] hover:bg-[#820232] border border-[#FC9385]/40 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
            >
              <Calculator className="w-4 h-4" />
              <span>{lang === "kz" ? "Калькуляторды ашу →" : "Открыть калькулятор →"}</span>
            </Link>
          </div>
        </div>

        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#4A0221] via-[#270111] to-[#1D1D1D] text-white flex flex-col justify-between shadow-xl border border-white/10 relative overflow-hidden">
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[#FC9385] text-xs font-bold border border-[#FC9385]/40 backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FC9385]" />
              <span>{lang === "kz" ? "9 және 11-сыныптарға" : "После 9 и 11 класса • Без ЕНТ"}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {lang === "kz" ? "Астананың 32 және ҚР 688 колледжі" : "32 колледжа Астаны и 688 колледжей РК"}
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
              {lang === "kz"
                ? "ҰБТ тапсыру қажет емес! Қабылдау аттестат балымен. Астананың 32 колледжі (госзаказ + жатақхана) және бүкіл ҚР 688 колледжі."
                : "Приём без ЕНТ по среднему баллу аттестата! Все 32 колледжа Астаны по районам и полный справочник 688 колледжей в 19 регионах."}
            </p>
          </div>
          <div className="pt-5 relative z-10">
            <Link
              href="/colleges"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#A31551] hover:bg-[#FDF2F7] font-bold text-xs sm:text-sm transition-all shadow-md"
            >
              <GraduationCap className="w-4 h-4" />
              <span>{lang === "kz" ? "Колледждер каталогы (688) →" : "Выбрать колледж (688) →"}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. CORE DIRECTORIES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#69758B]">
              {lang === "kz" ? "Анықтамалық" : "Разделы платформы"}
            </span>
            <h2 className="text-xl font-bold text-[#1D1D1D] tracking-tight">
              {lang === "kz" ? "Қосымша анықтамалық бөлімдер" : "Справочники и инструменты по разделам"}
            </h2>
            <p className="text-xs text-[#69758B] mt-0.5">
              {lang === "kz" ? "Барлық мамандықтар, оқу орындары, гранттар және даму курстары" : "Когда определился с направлением — изучай подробные базы"}
            </p>
          </div>
          <Link href="/guides" className="text-xs font-bold text-[#A31551] hover:underline flex items-center gap-1">
            <span>{lang === "kz" ? "Барлық 30+ нұсқаулық" : "База знаний (30+ гайдов)"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Link
            href="/careers"
            className="group p-6 rounded-3xl border border-[#EAEBEF] bg-white hover:border-[#A31551]/40 card-hover shadow-forte flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-2xl bg-[#FDF2F7] text-[#A31551] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-2xs">
                <Briefcase className="w-5 h-5 stroke-[#4A0221]" />
              </div>
              <h3 className="font-bold text-[#1D1D1D] text-lg group-hover:text-[#A31551] transition-colors">
                {t.sections.careersTitle}
              </h3>
              <p className="mt-2 text-xs text-[#69758B] leading-relaxed">
                {t.sections.careersDesc}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#A31551] group-hover:translate-x-1 transition-transform">
              <span>{t.common.explore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/education"
            className="group p-6 rounded-3xl border border-[#EAEBEF] bg-white hover:border-[#A31551]/40 card-hover shadow-forte flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-2xl bg-[#FDF2F7] text-[#A31551] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-2xs">
                <GraduationCap className="w-5 h-5 stroke-[#4A0221]" />
              </div>
              <h3 className="font-bold text-[#1D1D1D] text-lg group-hover:text-[#A31551] transition-colors">
                {t.sections.educationTitle}
              </h3>
              <p className="mt-2 text-xs text-[#69758B] leading-relaxed">
                {t.sections.educationDesc}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#A31551] group-hover:translate-x-1 transition-transform">
              <span>{t.common.explore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/grants"
            className="group p-6 rounded-3xl border border-[#EAEBEF] bg-white hover:border-[#A31551]/40 card-hover shadow-forte flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-2xl bg-[#FDF2F7] text-[#A31551] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-2xs">
                <Award className="w-5 h-5 stroke-[#4A0221]" />
              </div>
              <h3 className="font-bold text-[#1D1D1D] text-lg group-hover:text-[#A31551] transition-colors">
                {t.sections.grantsTitle}
              </h3>
              <p className="mt-2 text-xs text-[#69758B] leading-relaxed">
                {t.sections.grantsDesc}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#A31551] group-hover:translate-x-1 transition-transform">
              <span>{t.common.explore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/opportunities"
            className="group p-6 rounded-3xl border border-[#EAEBEF] bg-white hover:border-[#A31551]/40 card-hover shadow-forte flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-2xl bg-[#FDF2F7] text-[#A31551] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-2xs">
                <Sparkles className="w-5 h-5 stroke-[#4A0221]" />
              </div>
              <h3 className="font-bold text-[#1D1D1D] text-lg group-hover:text-[#A31551] transition-colors">
                {t.sections.opportunitiesTitle}
              </h3>
              <p className="mt-2 text-xs text-[#69758B] leading-relaxed">
                {t.sections.opportunitiesDesc}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#A31551] group-hover:translate-x-1 transition-transform">
              <span>{t.common.explore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* 5. IMPORTANT ANNOUNCEMENTS & DEADLINES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-6 rounded-3xl border border-[#EAEBEF] bg-white shadow-forte space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#A31551]" />
              <h3 className="font-bold text-zinc-900 text-sm tracking-tight">
                {lang === "kz" ? "Алдағы негізгі мерзімдер" : "Ближайшие важные сроки"}
              </h3>
            </div>
            <Link
              href="/deadlines"
              className="text-[11px] font-bold text-[#A31551] hover:text-[#820232] flex items-center gap-1"
            >
              <span>{lang === "kz" ? "Барлық мерзімдер" : "Весь календарь"}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {announcements.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className="p-4 rounded-2xl border border-zinc-100 bg-zinc-50/60 hover:bg-[#FDF2F7]/50 hover:border-[#F99184]/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900">
                    <Clock className="w-3.5 h-3.5 text-[#A31551] shrink-0" />
                    <span>{item.dates}</span>
                  </div>
                  <h4 className="font-semibold text-xs text-zinc-800 mt-2 group-hover:text-[#A31551] transition-colors leading-snug">
                    {lang === "kz" ? item.title_kz : item.title_ru}
                  </h4>
                </div>
                <div className="mt-3 pt-2 border-t border-zinc-200/40 text-[11px] text-zinc-400 flex items-center justify-between">
                  <span>{item.source}</span>
                  <ArrowRight className="w-3 h-3 text-zinc-400 group-hover:text-[#A31551] group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Global Search Dialog */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
