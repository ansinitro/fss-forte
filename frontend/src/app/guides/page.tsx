"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Award,
  ArrowRight,
  Download,
  Table as TableIcon,
  ShieldCheck,
  Sparkles,
  FileText,
  Calendar,
  HelpCircle,
  ExternalLink
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { api } from "@/lib/api";
import { KBArticle, GrantSummary2025 } from "@/lib/types";
import { StudentTipBanner } from "@/components/common/StudentTipBanner";
import { ScrollablePillBar } from "@/components/common/ScrollablePillBar";

const BUILTIN_GUIDES = [
  { slug: "grade-9", badge_kz: "9-сынып", badge_ru: "9 класс", title_kz: "9-сыныптан кейін не істеуге болады?", title_ru: "Что делать после 9 класса?" },
  { slug: "grade-11", badge_kz: "11-сынып", badge_ru: "11 класс", title_kz: "11-сыныптан кейін қалай оқуға түседі?", title_ru: "Как поступить после 11 класса?" },
  { slug: "quotas", badge_kz: "10 санат квота", badge_ru: "10 категорий квот", title_kz: "Қабылдау квоталарының кестесі", title_ru: "Таблица квот приема (10 категорий)" },
  { slug: "transfer-to-grant", badge_kz: "GPA • Бос грант", badge_ru: "GPA • Перевод", title_kz: "Ақылы бөлімнен бос грантқа ауысу", title_ru: "Как перевестись с платного на грант" },
  { slug: "no-grant", badge_kz: "Балама жолдар", badge_ru: "Альтернатива", title_kz: "Грантқа түспесең не істеу керек?", title_ru: "Что делать, если не поступил на грант?" },
  { slug: "documents", badge_kz: "Құжаттар", badge_ru: "Документы", title_kz: "Оқуға түсуге қажетті құжаттар тізімі", title_ru: "Полный перечень документов для поступления" },
];

export default function GuidesIndexPage() {
  const { lang, t } = useI18n();
  const [articles, setArticles] = useState<KBArticle[]>([]);
  const [grantSummary, setGrantSummary] = useState<GrantSummary2025 | null>(null);
  const [category, setCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await api.getKnowledgeBase();
      setArticles(Array.isArray(data?.articles) ? data.articles : []);
      if (data?.grant_summary) setGrantSummary(data.grant_summary);
      setLoading(false);
    }
    load();
  }, []);

  const filteredArticles = useMemo(() => {
    return (articles || []).filter((art) => {
      if (category !== "all" && art.category !== category) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          art.title_ru.toLowerCase().includes(q) ||
          art.title_kk.toLowerCase().includes(q) ||
          art.summary_ru.toLowerCase().includes(q) ||
          art.summary_kk.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [articles, category, searchQuery]);

  const catLabels: Record<string, { kz: string; ru: string; color: string }> = {
    ent: { kz: "ҰБТ және AIT", ru: "ЕНТ и AIT-2027", color: "bg-[#FDF2F7] text-[#A31551] border-[#F99184]/40" },
    grants: { kz: "Гранттар", ru: "Гранты и перевод", color: "bg-[#FDF2F7] text-[#A31551] border-[#FC9385]/50" },
    stipends: { kz: "Шәкіртақы", ru: "Стипендии", color: "bg-[#FFF5F4] text-[#4A0221] border-[#FC9385]/60" },
    documents: { kz: "Құжаттар", ru: "Документы", color: "bg-[#FDF2F7] text-[#A31551] border-[#EAEBEF]" },
    calendar: { kz: "Каникул және мерзім", ru: "Каникулы и даты", color: "bg-[#FBE4EF]/70 text-[#4A0221] border-[#FC9385]/40" },
    guides: { kz: "Нұсқаулық", ru: "Руководство", color: "bg-zinc-100 text-zinc-700 border-zinc-200" },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] text-xs font-bold border border-[#F99184]/40">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{lang === "kz" ? "Білім базасы • 30+ нұсқаулық" : "База знаний • 30+ руководств"}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          {lang === "kz" ? "Абитуриентке және оқушыға арналған толық анықтамалық" : "База знаний для школьников и абитуриентов"}
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base max-w-3xl leading-relaxed">
          {lang === "kz"
            ? "ҰБТ-2026/2027 форматы, шекті балдар, жаңа AIT тесті, шәкіртақы мөлшері, қабылдау квоталары, құжаттар тізімі және гранттар статистикасы."
            : "Формат ЕНТ 2026/2027, пороговые баллы, новый тест AIT, размеры стипендий, квоты приема, перечень документов и распределение грантов по РК."}
        </p>
      </div>

      <StudentTipBanner
        title_kz="Барлық негізгі ережені 3 минутта оқығың келе ме?"
        title_ru="Нужна короткая шпаргалка без чтения 30 статей?"
        tip_kz="Егер уақытың аз болса — 6 тараудан тұратын «Талапкер кітапшасын» аш: онда жыл күнтізбесі, 50/65/75 шектері, құжаттар чек-листі және «Б» жоспары жинақталған."
        tip_ru="Открой наш интерактивный буклет: там на 6 коротких вкладках собраны сроки года, шпаргалка по баллам, чек-лист документов с галочками и План «Б»."
        actionHref="/booklet"
        actionLabel_kz="Кітапшаны ашу (6 тарау)"
        actionLabel_ru="Открыть буклет (6 глав)"
      />

      {/* Republic Grant Volume Banner (Univision Data) */}
      {grantSummary && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#270111] via-[#4A0221] to-[#1D1D1D] text-white shadow-xl border border-white/10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#F99184] text-xs font-bold border border-[#F99184]/30">
                <Award className="w-3.5 h-3.5" />
                <span>Univision.kz • {grantSummary.year}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {lang === "kz"
                  ? `Қазақстанда бөлінген жалпы грант саны: ${grantSummary.total_grants.toLocaleString()}`
                  : `Распределение образовательных грантов РК: ${grantSummary.total_grants.toLocaleString()} грантов`}
              </h2>
            </div>

            <a
              href="/docs/ForteBank_RU_print_compact.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#F99184] via-[#B8335F] to-[#A51652] text-white text-xs font-bold shadow-md hover:brightness-110 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{t.guideDownload.button}</span>
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
              <div className="text-[11px] text-zinc-300">{lang === "kz" ? "Бакалавриат (барлығы)" : "Бакалавриат (всего)"}</div>
              <div className="text-xl sm:text-2xl font-black text-[#F99184] mt-1">{grantSummary.bachelor_total.toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
              <div className="text-[11px] text-zinc-300">{lang === "kz" ? "Толық оқу (мектептен)" : "Очная полная (школа)"}</div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">{grantSummary.bachelor_full_time.toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
              <div className="text-[11px] text-zinc-300">{lang === "kz" ? "Қысқартылған (колледж)" : "Сокращённая (колледж)"}</div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">{grantSummary.bachelor_short.toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
              <div className="text-[11px] text-zinc-300">{lang === "kz" ? "Квоталар үлесі" : "Выделено на квоты"}</div>
              <div className="text-xl sm:text-2xl font-black text-[#FC9385] mt-1">{grantSummary.bachelor_quotas.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Interactive Pathways */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-zinc-900">
          {lang === "kz" ? "Негізгі қадамдық нұсқаулықтар" : "Ключевые пошаговые руководства"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BUILTIN_GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="p-5 rounded-3xl border border-[#EAEBEF] bg-white hover:border-[#A31551]/40 card-hover shadow-xs hover:shadow-forte flex flex-col justify-between group"
            >
              <div>
                <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] border border-[#F99184]/30 mb-2">
                  {lang === "kz" ? g.badge_kz : g.badge_ru}
                </span>
                <h3 className="font-bold text-sm text-zinc-900 group-hover:text-[#A31551] transition-colors leading-snug">
                  {lang === "kz" ? g.title_kz : g.title_ru}
                </h3>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#A31551]">
                <span>{t.common.explore}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Knowledge Base (24 Articles from StudentHub) */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-zinc-900">
            {lang === "kz" ? `Мақалалар мен ережелер (${filteredArticles.length})` : `Статьи и правила поступающим (${filteredArticles.length})`}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "kz" ? "ҰБТ, AIT, стипендия, құжаттар, каникул..." : "Поиск по статьям: ЕНТ, AIT, стипендии, документы..."}
              className="w-full pl-11 pr-11 py-3 rounded-full border border-zinc-200 bg-white text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#A31551] focus:ring-2 focus:ring-[#A31551]/20 shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <ScrollablePillBar bgGradientColor="white" showIndicator={true}>
            {[
              { id: "all", kz: "Барлығы", ru: "Все" },
              { id: "ent", kz: "ҰБТ / AIT", ru: "ЕНТ и AIT" },
              { id: "grants", kz: "Гранттар", ru: "Гранты" },
              { id: "stipends", kz: "Шәкіртақы", ru: "Стипендии" },
              { id: "documents", kz: "Құжаттар", ru: "Документы" },
              { id: "calendar", kz: "Каникулдар", ru: "Каникулы" },
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={`px-4 py-2.5 rounded-full font-semibold whitespace-nowrap transition-all shrink-0 ${
                  category === c.id
                    ? "bg-[#A31551] text-white shadow-forte font-bold"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                {lang === "kz" ? c.kz : c.ru}
              </button>
            ))}
          </ScrollablePillBar>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-zinc-400">
            {lang === "kz" ? "Мақалалар жүктелуде..." : "Загрузка статей базы знаний..."}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-500 bg-white rounded-3xl border border-zinc-200">
            {t.common.noResults}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((art) => {
              const badge = catLabels[art.category] || catLabels.guides;
              return (
                <Link
                  key={art.slug}
                  href={`/guides/${art.slug}`}
                  className="p-5 rounded-3xl border border-zinc-200 bg-white hover:border-[#F99184]/60 card-hover shadow-xs hover:shadow-forte flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                        {lang === "kz" ? badge.kz : badge.ru}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-medium">
                        {art.source_name}
                      </span>
                    </div>

                    <h3 className="font-bold text-zinc-900 text-sm sm:text-base group-hover:text-[#A31551] transition-colors leading-snug">
                      {lang === "kz" ? art.title_kk : art.title_ru}
                    </h3>

                    <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2">
                      {lang === "kz" ? art.summary_kk : art.summary_ru}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-zinc-400">{art.academic_year}</span>
                    <span className="font-bold text-[#A31551] flex items-center gap-1">
                      <span>{lang === "kz" ? "Оқу" : "Читать"}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
