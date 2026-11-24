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
  Terminal
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { GlobalSearchModal } from "@/components/search/GlobalSearchModal";

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
      {/* 1. HERO SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-semibold border border-zinc-200/80 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.brand.city}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight leading-tight">
            {t.hero.title}
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
            {t.hero.subtitle}
          </p>

          {/* Prominent Global Search Bar */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="w-full max-w-xl mx-auto flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-zinc-300 bg-white hover:border-zinc-400 shadow-sm transition-all text-left group"
            >
              <div className="flex items-center gap-3 text-zinc-400">
                <Search className="w-5 h-5 group-hover:text-zinc-600 transition-colors" />
                <span className="text-sm sm:text-base text-zinc-500">
                  {t.hero.searchPlaceholder}
                </span>
              </div>
              <span className="hidden sm:inline text-xs font-semibold px-2 py-1 rounded-md bg-zinc-100 text-zinc-600">
                ⌘K
              </span>
            </button>

            {/* Quick search chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-zinc-500">
              <span className="font-medium text-zinc-400">{lang === "kz" ? "Мысалдар:" : "Примеры:"}</span>
              {["IT", "Медицина", "AITU", "Гранттар", "Колледждер", "Тегін курстар"].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOUR MAIN CATEGORY CARDS (Section 2 Core Architecture) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Careers */}
          <Link
            href="/careers"
            className="group p-6 rounded-2xl border border-zinc-200 bg-white hover:border-purple-300 card-hover shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-zinc-900 text-lg group-hover:text-purple-600 transition-colors">
                {t.sections.careersTitle}
              </h2>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                {t.sections.careersDesc}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-purple-600 group-hover:translate-x-1 transition-transform">
              <span>{t.common.explore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 2: Education */}
          <Link
            href="/education"
            className="group p-6 rounded-2xl border border-zinc-200 bg-white hover:border-blue-300 card-hover shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-zinc-900 text-lg group-hover:text-blue-600 transition-colors">
                {t.sections.educationTitle}
              </h2>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                {t.sections.educationDesc}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
              <span>{t.common.explore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 3: Grants */}
          <Link
            href="/grants"
            className="group p-6 rounded-2xl border border-zinc-200 bg-white hover:border-amber-300 card-hover shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-zinc-900 text-lg group-hover:text-amber-600 transition-colors">
                {t.sections.grantsTitle}
              </h2>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                {t.sections.grantsDesc}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-amber-600 group-hover:translate-x-1 transition-transform">
              <span>{t.common.explore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 4: Opportunities */}
          <Link
            href="/opportunities"
            className="group p-6 rounded-2xl border border-zinc-200 bg-white hover:border-rose-300 card-hover shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-zinc-900 text-lg group-hover:text-rose-600 transition-colors">
                {t.sections.opportunitiesTitle}
              </h2>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                {t.sections.opportunitiesDesc}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-rose-600 group-hover:translate-x-1 transition-transform">
              <span>{t.common.explore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* 3. VERIFIED IMPORTANT ANNOUNCEMENTS & DEADLINES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-6 rounded-3xl border border-zinc-200/90 bg-white shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-zinc-900 text-sm tracking-tight">
                {lang === "kz" ? "Маңызды ресми мерзімдер мен хабарландырулар" : "Важные подтвержденные сроки и анонсы"}
              </h3>
            </div>
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              {t.common.confirmed} (2026–2027)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {announcements.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/60 hover:bg-zinc-100/70 transition-colors group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
                    <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span>{item.dates}</span>
                  </div>
                  <h4 className="font-semibold text-xs text-zinc-800 mt-2 group-hover:text-blue-600 transition-colors leading-snug">
                    {lang === "kz" ? item.title_kz : item.title_ru}
                  </h4>
                </div>
                <div className="mt-3 pt-2 border-t border-zinc-200/40 text-[11px] text-zinc-400 flex items-center justify-between">
                  <span>{item.source}</span>
                  <ArrowRight className="w-3 h-3 text-zinc-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FORTEBANK APPLICANT GUIDE OFFICIAL DOWNLOAD & COMPACT HUB */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/90 via-white to-blue-50/40 shadow-xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/90 text-blue-800 text-[11px] font-bold tracking-wide">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
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
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm shadow-blue-600/20 hover:shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{t.guideDownload.button}</span>
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-blue-100 flex flex-wrap items-center gap-3 text-xs font-semibold text-zinc-600">
            <span className="text-zinc-400 font-normal">{lang === "kz" ? "Жылдам өту:" : "Быстрый переход:"}</span>
            <Link
              href="/guides/quotas"
              className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 bg-white px-3 py-1.5 rounded-xl border border-blue-200/80 hover:border-blue-300 transition-colors shadow-2xs"
            >
              <TableIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>{t.guideDownload.readQuotas}</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </Link>
            <Link
              href="/guides/transfer-to-grant"
              className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 bg-white px-3 py-1.5 rounded-xl border border-blue-200/80 hover:border-blue-300 transition-colors shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>{t.guideDownload.readTransfer}</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. ALTERNATIVE PATHWAYS SECTION */}
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
            className="p-5 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 card-hover shadow-xs flex flex-col justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                9-сынып
              </div>
              <h3 className="font-bold text-zinc-900 text-sm group-hover:text-blue-600 transition-colors">
                {t.pathways.grade9Title}
              </h3>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                {t.pathways.grade9Desc}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-zinc-900 group-hover:text-blue-600">
              <span>{t.common.explore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/guides/grade-11"
            className="p-5 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 card-hover shadow-xs flex flex-col justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                11-сынып
              </div>
              <h3 className="font-bold text-zinc-900 text-sm group-hover:text-blue-600 transition-colors">
                {t.pathways.grade11Title}
              </h3>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                {t.pathways.grade11Desc}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-zinc-900 group-hover:text-blue-600">
              <span>{t.common.explore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/guides/quotas"
            className="p-5 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 card-hover shadow-xs flex flex-col justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
                {lang === "kz" ? "10 санат" : "10 категорий"}
              </div>
              <h3 className="font-bold text-zinc-900 text-sm group-hover:text-purple-600 transition-colors">
                {t.pathways.quotasTitle}
              </h3>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                {t.pathways.quotasDesc}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-zinc-900 group-hover:text-purple-600">
              <span>{t.common.explore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/guides/transfer-to-grant"
            className="p-5 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 card-hover shadow-xs flex flex-col justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                GPA / Бос грант
              </div>
              <h3 className="font-bold text-zinc-900 text-sm group-hover:text-emerald-600 transition-colors">
                {t.pathways.transferTitle}
              </h3>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                {t.pathways.transferDesc}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-zinc-900 group-hover:text-emerald-600">
              <span>{t.common.explore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/guides/no-grant"
            className="p-5 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 card-hover shadow-xs flex flex-col justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
                {lang === "kz" ? "Балама жол" : "Альтернатива"}
              </div>
              <h3 className="font-bold text-zinc-900 text-sm group-hover:text-amber-600 transition-colors">
                {t.pathways.noGrantTitle}
              </h3>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                {t.pathways.noGrantDesc}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-zinc-900 group-hover:text-amber-600">
              <span>{t.common.explore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/guides/documents"
            className="p-5 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 card-hover shadow-xs flex flex-col justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                {lang === "kz" ? "Құжаттар тізімі" : "Документы"}
              </div>
              <h3 className="font-bold text-zinc-900 text-sm group-hover:text-blue-600 transition-colors">
                {lang === "kz" ? "Оқуға түсу үшін қажетті құжаттардың толық тізімі" : "Полный перечень документов для поступления в вузы"}
              </h3>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                {lang === "kz" ? "Аттестат, 075-У, ҰБТ сертификаты, фотосуреттер мен тіркеу ережелері." : "Аттестат, форма 075-У, сертификат ЕНТ, фотографии и порядок подачи."}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-zinc-900 group-hover:text-blue-600">
              <span>{t.common.explore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/guides/creative-exam"
            className="p-5 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 card-hover shadow-xs flex flex-col justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-pink-600 uppercase tracking-wider mb-1">
                {lang === "kz" ? "Шығармашылық" : "Творческий"}
              </div>
              <h3 className="font-bold text-zinc-900 text-sm group-hover:text-pink-600 transition-colors">
                {lang === "kz" ? "Творчестволық емтихандар: талапкерге нұсқаулық" : "Творческие экзамены: сроки, баллы и особенности"}
              </h3>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                {lang === "kz" ? "Сәулет, дизайн және өнер: ЖОО-дағы емтихан мерзімдері мен балл есептеу." : "Архитектура, дизайн, медиа: формат сдачи и расчет итогового балла."}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-zinc-900 group-hover:text-pink-600">
              <span>{t.common.explore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/guides/transfer-university"
            className="p-5 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 card-hover shadow-xs flex flex-col justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                {lang === "kz" ? "Ауысу" : "Перевод"}
              </div>
              <h3 className="font-bold text-zinc-900 text-sm group-hover:text-indigo-600 transition-colors">
                {lang === "kz" ? "Бір университеттен басқасына қалай ауысуға болады?" : "Правила перевода из одного университета в другой"}
              </h3>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                {lang === "kz" ? "Академиялық айырма, семестр каникулдары және грантты сақтау шарттары." : "Академическая разница, сроки каникул и сохранение государственного гранта."}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-zinc-900 group-hover:text-indigo-600">
              <span>{t.common.explore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/guides/ent-rules"
            className="p-5 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 card-hover shadow-xs flex flex-col justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
                {lang === "kz" ? "ҰБТ ережелері" : "Правила ЕНТ"}
              </div>
              <h3 className="font-bold text-zinc-900 text-sm group-hover:text-red-600 transition-colors">
                {lang === "kz" ? "Тыйым салынған заттар және нәтижені жою тәртібі" : "Запрещенные предметы на ЕНТ и ответственность"}
              </h3>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                {lang === "kz" ? "Смартфон, смарт-сағат, бейнебақылау және AI арқылы тексеру шаралары." : "Смартфоны, смарт-часы, видеофиксация и аннулирование результатов."}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-zinc-900 group-hover:text-red-600">
              <span>{t.common.explore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* 5. OFFICIAL CONTEXTUAL RESOURCES DIRECTORY */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-6 rounded-3xl border border-zinc-200 bg-zinc-50/70 space-y-4">
          <h3 className="font-bold text-zinc-900 text-sm">
            {t.externalResources.title}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <a
              href="https://testcenter.kz"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white rounded-xl border border-zinc-200/80 hover:border-zinc-300 flex items-center justify-between text-zinc-700 hover:text-zinc-950 font-medium group"
            >
              <span>{t.externalResources.testcenter}</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-600" />
            </a>
            <a
              href="https://epvo.kz"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white rounded-xl border border-zinc-200/80 hover:border-zinc-300 flex items-center justify-between text-zinc-700 hover:text-zinc-950 font-medium group"
            >
              <span>{t.externalResources.epvo}</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-600" />
            </a>
            <a
              href="https://www.gov.kz/memleket/entities/astana-bilim"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white rounded-xl border border-zinc-200/80 hover:border-zinc-300 flex items-center justify-between text-zinc-700 hover:text-zinc-950 font-medium group"
            >
              <span>{t.externalResources.astanaBilim}</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-600" />
            </a>
            <a
              href="https://college.smartnation.kz"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white rounded-xl border border-zinc-200/80 hover:border-zinc-300 flex items-center justify-between text-zinc-700 hover:text-zinc-950 font-medium group"
            >
              <span>{t.externalResources.smartnation}</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-600" />
            </a>
            <a
              href="https://astanahub.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white rounded-xl border border-zinc-200/80 hover:border-zinc-300 flex items-center justify-between text-zinc-700 hover:text-zinc-950 font-medium group"
            >
              <span>{t.externalResources.astanaHub}</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-600" />
            </a>
            <a
              href="https://adilet.zan.kz"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white rounded-xl border border-zinc-200/80 hover:border-zinc-300 flex items-center justify-between text-zinc-700 hover:text-zinc-950 font-medium group"
            >
              <span>{t.externalResources.adiletZan}</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-600" />
            </a>
            <a
              href="https://studenthub.kz"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white rounded-xl border border-zinc-200/80 hover:border-zinc-300 flex items-center justify-between text-zinc-700 hover:text-zinc-950 font-medium group"
            >
              <span>StudentHub.kz (Қазақстанның білім платформасы)</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-600" />
            </a>
          </div>
        </div>
      </section>

      {/* 6. OPEN DATA & INTERACTIVE API SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-zinc-900 via-zinc-950 to-blue-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg border border-zinc-800">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              <Terminal className="w-3.5 h-3.5" />
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
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5"
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
