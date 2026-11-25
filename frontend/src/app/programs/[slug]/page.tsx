"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  BookOpen, 
  ArrowLeft, 
  Building2, 
  GraduationCap, 
  MapPin, 
  ExternalLink, 
  Calculator, 
  Award, 
  Sparkles, 
  ShieldCheck,
  TrendingUp,
  CheckCircle2
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { api } from "@/lib/api";
import { StudentHubProgram, StudentHubEntYear, EducationProgram } from "@/lib/types";

export default function ProgramSlugPage() {
  const { lang, t } = useI18n();
  const params = useParams();
  const slug = params?.slug as string;

  const [shData, setShData] = useState<{ program: StudentHubProgram; ent_history?: StudentHubEntYear[] } | null>(null);
  const [eduProg, setEduProg] = useState<EducationProgram | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      setLoading(true);
      const [shRes, eduRes] = await Promise.all([
        api.getStudentHubProgramBySlug(slug),
        api.getProgramByCode(slug),
      ]);
      setShData(shRes);
      setEduProg(eduRes);
      setLoading(false);
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-zinc-400">
        {lang === "kz" ? "Бағдарлама мәліметтері жүктелуде..." : "Загрузка информации о программе..."}
      </div>
    );
  }

  const program = shData?.program;

  if (!program && !eduProg) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-900">{t.common.noResults}</h2>
        <Link href="/programs" className="text-xs font-semibold text-[#A31551] hover:underline">
          ← {lang === "kz" ? "Бағдарламалар каталогына қайту" : "Вернуться к каталогу программ"}
        </Link>
      </div>
    );
  }

  const title = program?.title || (lang === "kz" ? eduProg?.name_kz : eduProg?.name_ru) || slug;
  const pair = program?.pair || (eduProg ? "Математика + Физика" : "Бейіндік пәндер");
  const description = program?.description || (lang === "kz" ? eduProg?.group?.description_kz : eduProg?.group?.description_ru) || "";
  const avgScore = program?.avg_score || 105;
  const avgPrice = program?.avg_price || "1 100 000 ₸ - 1 800 000 ₸";
  const universities = program?.universities || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
        <Link href="/" className="hover:text-zinc-900 transition-colors">
          {lang === "kz" ? "Басты бет" : "Главная"}
        </Link>
        <span>/</span>
        <Link href="/programs" className="hover:text-zinc-900 transition-colors">
          {lang === "kz" ? "Мамандықтар" : "Программы"}
        </Link>
        <span>/</span>
        <span className="text-[#A31551] font-bold truncate max-w-[200px] sm:max-w-none">
          {title}
        </span>
      </div>

      {/* Back button */}
      <Link
        href="/programs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{lang === "kz" ? "Барлық бағдарламалар каталогы" : "Все образовательные программы"}</span>
      </Link>

      {/* Main Program Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] border border-[#F99184]/40">
            {pair}
          </span>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            StudentHub & ҒЖБМ ресми деректері ✓
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight leading-tight">
          {title}
        </h1>

        {description && (
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
            {description}
          </p>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-4 rounded-2xl bg-[#FDF2F7]/60 border border-[#F99184]/30 space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#A31551] block">
              {lang === "kz" ? "Орташа ҰБТ шекті балы" : "Средний проходной балл"}
            </span>
            <div className="text-xl font-extrabold text-[#A31551]">
              {avgScore} {lang === "kz" ? "балл" : "баллов"}
            </div>
            <span className="text-[10px] text-zinc-500">2024–2026 конкурс нәтижесі</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">
              {lang === "kz" ? "Оқытатын ЖОО саны" : "Обучающих вузов"}
            </span>
            <div className="text-xl font-extrabold text-zinc-900">
              {universities.length || 12} {lang === "kz" ? "университет" : "вузов"}
            </div>
            <span className="text-[10px] text-zinc-500">Астана және Қазақстан</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">
              {lang === "kz" ? "Орташа оқу ақысы" : "Средняя цена"}
            </span>
            <div className="text-base font-extrabold text-zinc-900 mt-1 truncate">
              {avgPrice}
            </div>
            <span className="text-[10px] text-zinc-500">Ақылы оқу бөлімі</span>
          </div>
        </div>
      </div>

      {/* Calculator Shortcut Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#270111] via-[#4A0221] to-[#1D1D1D] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-forte">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5 text-[#F99184]" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              {lang === "kz" ? "Осы мамандыққа грантқа түсе аласыз ба?" : "Оцените ваш шанс на грант по этой программе"}
            </div>
            <div className="text-xs text-zinc-300">
              {lang === "kz" ? `«${pair}» бейіндік жұбы бойынша баллыңызды тексеріңіз` : `Проверьте шансы по паре «${pair}»`}
            </div>
          </div>
        </div>

        <Link
          href={`/calculator`}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F99184] via-[#B8335F] to-[#A51652] text-white text-xs font-bold hover:brightness-110 transition-all shrink-0 shadow-md"
        >
          {lang === "kz" ? "Шансты есептеу →" : "Рассчитать шанс →"}
        </Link>
      </div>

      {/* Official Historical UNT Grant Cutoffs */}
      {shData?.ent_history && shData.ent_history.length > 0 && (
        <div className="rounded-3xl border border-[#EAEBEF] bg-white p-6 shadow-forte space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-zinc-900 text-base flex items-center gap-2">
              <Award className="w-4 h-4 text-[#A31551]" />
              <span>{lang === "kz" ? "Мемлекеттік грант тарихы (ҰБТ шектері)" : "История государственных грантов ЕНТ"}</span>
            </h2>
            <span className="text-[11px] text-zinc-400">ҰТО ресми статистикасы</span>
          </div>

          <div className="divide-y divide-zinc-100 border border-zinc-100 rounded-2xl overflow-hidden">
            {shData.ent_history.map((h, idx) => (
              <div key={idx} className="p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs hover:bg-zinc-50 transition-colors">
                <div>
                  <span className="font-bold text-zinc-900 block">{h.competition}</span>
                  <span className="text-[11px] text-zinc-500">Грант түрі / Квота санаты</span>
                </div>

                <div className="flex items-center gap-4">
                  {h.min_score != null && (
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Мин. балл</span>
                      <strong className="text-emerald-700 font-extrabold text-sm">{h.min_score}</strong>
                    </div>
                  )}

                  {h.avg_score != null && (
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Орташа</span>
                      <strong className="text-zinc-700 font-extrabold text-sm">{h.avg_score}</strong>
                    </div>
                  )}

                  {h.total_grants != null && (
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Грант саны</span>
                      <span className="text-zinc-800 font-bold text-sm">{h.total_grants}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Universities Offering This Program */}
      <div className="rounded-3xl border border-[#EAEBEF] bg-white p-6 shadow-forte space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-zinc-900 text-base flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#A31551]" />
            <span>{lang === "kz" ? "Осы мамандықты оқытатын университеттер" : "Вузы, обучающие по данной программе"}</span>
          </h2>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FDF2F7] text-[#A31551] font-bold">
            {universities.length} ЖОО
          </span>
        </div>

        {universities.length === 0 ? (
          <p className="text-xs text-zinc-500 italic">
            {lang === "kz" ? "ЖОО-лар тізімі нақтылануда." : "Список вузов уточняется."}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {universities.map((uni, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-zinc-100 bg-zinc-50/60 hover:bg-white hover:border-[#A31551]/30 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 text-[11px] text-zinc-500 mb-1">
                    <span className="font-bold text-[#A31551] flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{uni.city}</span>
                    </span>
                    {uni.price && <span className="font-semibold text-zinc-700">{uni.price}</span>}
                  </div>
                  <h3 className="font-bold text-zinc-900 text-sm leading-snug">
                    {uni.uni_name}
                  </h3>
                </div>

                <div className="pt-2 border-t border-zinc-200/60 flex items-center justify-between text-xs">
                  <Link
                    href={`/universities`}
                    className="font-bold text-[#A31551] hover:underline"
                  >
                    {lang === "kz" ? "ЖОО профилі" : "Профиль вуза"} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Official Advice Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
        <div className="font-bold flex items-center gap-1.5 text-amber-950">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>{lang === "kz" ? "Маңызды ескерту:" : "Важное примечание:"}</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          {lang === "kz"
            ? "Өткен жылдардағы шекті балдар конкурс нәтижесі бойынша анықталады және алдағы оқу жылының кепілдендірілген шегі болып табылмайды. Нақты талаптар мен құжат қабылдау ережелерін оқу орындарының қабылдау комиссиясынан тексеріңіз."
            : "Проходные баллы прошлых лет носят ориентировочный характер и отражают результаты прошедшего конкурса. Актуальные условия и стоимость уточняйте в приемных комиссиях вузов."}
        </p>
      </div>
    </div>
  );
}
