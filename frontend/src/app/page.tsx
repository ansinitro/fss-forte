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
  ExternalLink,
  BookOpen,
  Download,
  Table as TableIcon,
  Terminal,
  Calculator,
  CheckCircle2
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { GlobalSearchModal } from "@/components/search/GlobalSearchModal";
import { ForteLogo } from "@/components/layout/ForteLogo";

export default function HomePage() {
  const { lang, t } = useI18n();
  const [searchOpen, setSearchOpen] = useState(false);

  const announcements = [
    {
      id: "a1",
      title_kz: "ҚР Мемлекеттік гранттар конкурсының ресми мерзімі",
      title_ru: "Официальные сроки республиканского конкурса госгрантов",
      dates: "13 – 20 шілде / июля 2026",
      source: "ҰТО (testcenter.kz)",
      url: "/grants/state-general-grant",
      isUrgent: false,
    },
    {
      id: "a2",
      title_kz: "Астана қаласы әкімінің гранттарына құжат тапсыру",
      title_ru: "Подача документов на грант акима города Астаны",
      dates: "5 – 15 тамыз / августа 2026",
      source: "Астана қаласы Білім басқармасы",
      url: "/grants/astana-akimat-grant",
      isUrgent: true,
    },
    {
      id: "a3",
      title_kz: "Tech Orda — IT мектептерде тегін оқуға 600 000 ₸ ваучер",
      title_ru: "Tech Orda — Ваучеры 600 000 ₸ на бесплатное ИТ-обучение",
      dates: "1 қыркүйек – 15 қазан / 1 сен – 15 окт",
      source: "Astana Hub",
      url: "/opportunities/tech-orda-voucher",
      isUrgent: false,
    },
  ];

  return (
    <div className="space-y-16 py-8 sm:py-12">
      {/* 1. HERO SECTION - FORTE BRANDED */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF2F7] text-[#A31551] text-xs font-bold border border-[#F99184]/40 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#A31551] animate-pulse" />
            <span>Forte Education • {t.brand.city}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-zinc-950 tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-[#4A0221] via-[#A31551] to-[#D33D83] bg-clip-text text-transparent">
              {t.hero.title}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed font-normal max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>

          {/* Prominent Global Search Bar */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="w-full max-w-xl mx-auto flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-zinc-200 bg-white hover:border-[#A31551]/50 shadow-forte hover:shadow-forte-hover transition-all text-left group"
            >
              <div className="flex items-center gap-3 text-zinc-400">
                <Search className="w-5 h-5 text-[#A31551] group-hover:scale-110 transition-transform" />
                <span className="text-sm sm:text-base text-zinc-500">
                  {t.hero.searchPlaceholder}
                </span>
              </div>
              <span className="hidden sm:inline text-xs font-bold px-2 py-1 rounded-md bg-[#FDF2F7] text-[#A31551] border border-[#F99184]/30">
                ⌘K
              </span>
            </button>

            {/* Quick search chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5 text-xs text-zinc-500">
              <span className="font-semibold text-zinc-400">{lang === "kz" ? "Танымал:" : "Популярно:"}</span>
              {["IT мамандықтар", "Медицина", "AITU", "Грант калькуляторы", "Колледждер", "Tech Orda"].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="px-3 py-1 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-[#FDF2F7] hover:text-[#A31551] hover:border-[#F99184]/40 font-medium transition-colors shadow-2xs"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOUR MAIN CATEGORY CARDS (Section 2 Core Architecture - Forte Elevated) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Careers */}
          <Link
            href="/careers"
            className="group p-6 rounded-2xl border border-[#EAEBEF] bg-white hover:border-[#A31551]/40 card-hover shadow-forte flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#FDF2F7] text-[#A31551] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-2xs">
                <Briefcase className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-zinc-900 text-lg group-hover:text-[#A31551] transition-colors">
                {t.sections.careersTitle}
              </h2>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                {t.sections.careersDesc}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#A31551] group-hover:translate-x-1 transition-transform">
              <span>{t.common.explore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 2: Education */}
          <Link
            href="/education"
            className="group p-6 rounded-2xl border border-[#EAEBEF] bg-white hover:border-[#185AC5]/40 card-hover shadow-forte flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#F0F7FF] text-[#185AC5] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-2xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-zinc-900 text-lg group-hover:text-[#185AC5] transition-colors">
                {t.sections.educationTitle}
              </h2>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                {t.sections.educationDesc}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#185AC5] group-hover:translate-x-1 transition-transform">
              <span>{t.common.explore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 3: Grants */}
          <Link
            href="/grants"
            className="group p-6 rounded-2xl border border-[#EAEBEF] bg-white hover:border-[#C2410C]/40 card-hover shadow-forte flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#FFF7ED] text-[#C2410C] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-2xs">
                <Award className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-zinc-900 text-lg group-hover:text-[#C2410C] transition-colors">
                {t.sections.grantsTitle}
              </h2>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                {t.sections.grantsDesc}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#C2410C] group-hover:translate-x-1 transition-transform">
              <span>{t.common.explore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 4: Opportunities */}
          <Link
            href="/opportunities"
            className="group p-6 rounded-2xl border border-[#EAEBEF] bg-white hover:border-[#A31551]/40 card-hover shadow-forte flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#FDF2F7] text-[#A31551] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-2xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-zinc-900 text-lg group-hover:text-[#A31551] transition-colors">
                {t.sections.opportunitiesTitle}
              </h2>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
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

      {/* 3. STUDENTHUB & UNT CALCULATOR PROMINENT SHOWCASE BANNER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#270111] via-[#4A0221] to-[#1D1D1D] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl border border-white/10 relative overflow-hidden">
          <div className="relative z-10 space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#F99184] text-xs font-bold border border-[#F99184]/30 backdrop-blur-md">
              <Calculator className="w-3.5 h-3.5 text-[#F99184]" />
              <span>StudentHub 218 мамандық & ҰБТ Грант Калькуляторы</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {lang === "kz" ? "Баллыңызбен мемлекеттік грантқа түсе аласыз ба?" : "Проверьте свои шансы на грант по баллам ЕНТ"}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {lang === "kz"
                ? "Қазақстанның 218 мамандығы, 90 университеті және соңғы 3 жылдың ресми ҰБТ шекті балдары негізінде жасалған грант болжау жүйесі."
                : "Калькулятор сопоставляет ваш балл с проходными порогами по 218 специальностям и 90 вузам Казахстана за 2024–2026 годы."}
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/education"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#F99184] via-[#B8335F] to-[#A51652] hover:brightness-110 text-white font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-[#A51652]/30 flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              <span>{lang === "kz" ? "Калькуляторды ашу →" : "Открыть калькулятор →"}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. VERIFIED IMPORTANT ANNOUNCEMENTS & DEADLINES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-6 rounded-3xl border border-[#EAEBEF] bg-white shadow-forte space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#A31551]" />
              <h3 className="font-bold text-zinc-900 text-sm tracking-tight">
                {lang === "kz" ? "Маңызды ресми мерзімдер мен хабарландырулар" : "Важные подтвержденные сроки и анонсы"}
              </h3>
            </div>
            <Link
              href="/deadlines"
              className="text-[11px] font-bold text-[#A31551] hover:text-[#820232] flex items-center gap-1"
            >
              <span>{lang === "kz" ? "Барлық мерзімдер" : "Все дедлайны"}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {announcements.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/60 hover:bg-[#FDF2F7]/50 hover:border-[#F99184]/40 transition-all group flex flex-col justify-between"
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

      {/* 5. FORTEBANK APPLICANT GUIDE OFFICIAL DOWNLOAD & COMPACT HUB */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 rounded-3xl border border-[#F99184]/40 bg-gradient-to-br from-[#FDF2F7] via-white to-[#FBE4EF]/60 shadow-forte space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4A0221] text-[#F99184] text-[11px] font-bold tracking-wide">
                <BookOpen className="w-3.5 h-3.5 text-[#F99184]" />
                <span>{t.guideDownload.badge}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
                {t.guideDownload.title}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                {t.guideDownload.desc}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <a
                href="/docs/ForteBank_RU_print_compact.pdf"
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#A51652] via-[#B8335F] to-[#A31551] hover:brightness-110 text-white text-xs sm:text-sm font-bold shadow-md shadow-[#A31551]/25 hover:shadow-lg transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{t.guideDownload.button}</span>
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F99184]/20 flex flex-wrap items-center gap-3 text-xs font-semibold text-zinc-600">
            <span className="text-zinc-400 font-normal">{lang === "kz" ? "Жылдам өту:" : "Быстрый переход:"}</span>
            <Link
              href="/guides/quotas"
              className="inline-flex items-center gap-1 text-[#A31551] hover:text-[#820232] bg-white px-3 py-1.5 rounded-xl border border-[#F99184]/40 hover:border-[#A31551] transition-colors shadow-2xs font-bold"
            >
              <TableIcon className="w-3.5 h-3.5 text-[#A31551]" />
              <span>{t.guideDownload.readQuotas}</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </Link>
            <Link
              href="/guides/transfer-to-grant"
              className="inline-flex items-center gap-1 text-[#A31551] hover:text-[#820232] bg-white px-3 py-1.5 rounded-xl border border-[#F99184]/40 hover:border-[#A31551] transition-colors shadow-2xs font-bold"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#A31551]" />
              <span>{t.guideDownload.readTransfer}</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. ALTERNATIVE PATHWAYS SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
            {t.pathways.title}
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            {lang === "kz" ? "Шешім қабылдауға көмектесетін қысқа нұсқаулықтар" : "Краткие ориентиры для взвешенного выбора"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/guides/grade-9"
            className="p-5 rounded-2xl border border-[#EAEBEF] bg-white hover:border-[#A31551]/30 card-hover shadow-forte flex flex-col justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-[#A31551] uppercase tracking-wider mb-1">
                9-сынып
              </div>
              <h3 className="font-bold text-zinc-900 text-sm group-hover:text-[#A31551] transition-colors">
                {t.pathways.grade9Title}
              </h3>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                {t.pathways.grade9Desc}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-zinc-900 group-hover:text-[#A31551]">
              <span>{t.common.explore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/guides/grade-11"
            className="p-5 rounded-2xl border border-[#EAEBEF] bg-white hover:border-[#A31551]/30 card-hover shadow-forte flex flex-col justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-[#A31551] uppercase tracking-wider mb-1">
                11-сынып
              </div>
              <h3 className="font-bold text-zinc-900 text-sm group-hover:text-[#A31551] transition-colors">
                {t.pathways.grade11Title}
              </h3>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                {t.pathways.grade11Desc}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-zinc-900 group-hover:text-[#A31551]">
              <span>{t.common.explore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/guides/quotas"
            className="p-5 rounded-2xl border border-[#EAEBEF] bg-white hover:border-[#A31551]/30 card-hover shadow-forte flex flex-col justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
                {lang === "kz" ? "10 санат" : "10 категорий"}
              </div>
              <h3 className="font-bold text-zinc-900 text-sm group-hover:text-purple-700 transition-colors">
                {t.pathways.quotasTitle}
              </h3>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                {t.pathways.quotasDesc}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-zinc-900 group-hover:text-purple-700">
              <span>{t.common.explore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/guides/transfer-to-grant"
            className="p-5 rounded-2xl border border-[#EAEBEF] bg-white hover:border-emerald-500/40 card-hover shadow-forte flex flex-col justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                GPA / Бос грант
              </div>
              <h3 className="font-bold text-zinc-900 text-sm group-hover:text-emerald-700 transition-colors">
                {t.pathways.transferTitle}
              </h3>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                {t.pathways.transferDesc}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-zinc-900 group-hover:text-emerald-700">
              <span>{t.common.explore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/guides/no-grant"
            className="p-5 rounded-2xl border border-[#EAEBEF] bg-white hover:border-amber-500/40 card-hover shadow-forte flex flex-col justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                {lang === "kz" ? "Балама жол" : "Альтернатива"}
              </div>
              <h3 className="font-bold text-zinc-900 text-sm group-hover:text-amber-700 transition-colors">
                {t.pathways.noGrantTitle}
              </h3>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                {t.pathways.noGrantDesc}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-zinc-900 group-hover:text-amber-700">
              <span>{t.common.explore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/guides/documents"
            className="p-5 rounded-2xl border border-[#EAEBEF] bg-white hover:border-[#A31551]/30 card-hover shadow-forte flex flex-col justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-[#A31551] uppercase tracking-wider mb-1">
                {lang === "kz" ? "Құжаттар тізімі" : "Документы"}
              </div>
              <h3 className="font-bold text-zinc-900 text-sm group-hover:text-[#A31551] transition-colors">
                {lang === "kz" ? "Оқуға түсу үшін қажетті құжаттардың толық тізімі" : "Полный перечень документов для поступления в вузы"}
              </h3>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                {lang === "kz" ? "Аттестат, 075-У, ҰБТ сертификаты, фотосуреттер мен тіркеу ережелері." : "Аттестат, форма 075-У, сертификат ЕНТ, фотографии и порядок подачи."}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-zinc-900 group-hover:text-[#A31551]">
              <span>{t.common.explore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* 7. OPEN DATA & INTERACTIVE API SECTION - FORTE BRANDED */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#270111] via-[#4A0221] to-[#1D1D1D] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl border border-white/10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#F99184] text-xs font-bold border border-[#F99184]/30">
              <Terminal className="w-3.5 h-3.5 text-[#F99184]" />
              <span>{lang === "kz" ? "Ашық деректер және Интерактивті API" : "Открытые данные и Интерактивный API"}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {lang === "kz" ? "Платформаның барлық 22+ эндпоинті сайтта қолжетімді" : "Все 22+ эндпоинта платформы доступны прямо на сайте"}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {lang === "kz"
                ? "StudentHub-тың 218 мамандығы, 90 ЖОО, ҰБТ калькуляторы, Астана оқу орындары және ресми дереккөздер — тікелей браузерден сұраныс жіберіп тексеруге болады."
                : "218 специальностей StudentHub, 90 вузов, калькулятор ЕНТ, учебные заведения Астаны и нормативные источники — проверяйте через веб-консоль в реальном времени."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/endpoints"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#F99184] via-[#B8335F] to-[#A51652] hover:brightness-110 text-white font-extrabold text-xs transition-all shadow-md shadow-[#A51652]/30 flex items-center gap-1.5"
            >
              <Terminal className="w-4 h-4" />
              <span>{lang === "kz" ? "API консолін ашу →" : "Открыть API консоль →"}</span>
            </Link>
            <Link
              href="/sources"
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-200 font-semibold text-xs transition-colors"
            >
              {lang === "kz" ? "Дереккөздер" : "Источники"}
            </Link>
            <Link
              href="/deadlines"
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-200 font-semibold text-xs transition-colors"
            >
              {lang === "kz" ? "Мерзімдер" : "Дедлайны"}
            </Link>
          </div>
        </div>
      </section>

      {/* Global Search Dialog */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
