"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Calculator as CalcIcon,
  Sparkles,
  Building2,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Search,
  TrendingUp,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { api } from "@/lib/api";
import { CalculatorMatch, GopCalcMatch } from "@/lib/types";
import { StudentTipBanner } from "@/components/common/StudentTipBanner";
import { ScrollablePillBar } from "@/components/common/ScrollablePillBar";

const SUBJECT_PAIRS = [
  "Математика + Физика",
  "Математика + Информатика",
  "Химия + Биология",
  "Биология + География",
  "География + Математика",
  "Всемирная история + География",
  "Всемирная история + Основы права",
  "Иностранный язык + Всемирная история",
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
  "Түркістан"
];

const PRESET_SCORES = [75, 85, 95, 105, 115, 125, 135];

export default function CalculatorPage() {
  const { lang, t } = useI18n();
  const [calcScore, setCalcScore] = useState<number>(105);
  const [calcPair, setCalcPair] = useState<string>("Математика + Информатика");
  const [calcCity, setCalcCity] = useState<string>("Астана");
  const [calcMatches, setCalcMatches] = useState<CalculatorMatch[]>([]);
  const [gopMatches, setGopMatches] = useState<GopCalcMatch[]>([]);
  const [calcFilterChance, setCalcFilterChance] = useState<string>("");
  const [expandedUni, setExpandedUni] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Recalculate chances (StudentHub Programs + Univision GOPs)
  useEffect(() => {
    let isMounted = true;
    async function calculate() {
      setLoading(true);
      const city = calcCity === "Барлығы / Все города" ? "" : calcCity;
      const [res, gopRes] = await Promise.all([
        api.getStudentHubCalculator(calcScore, calcPair, city),
        api.getGopCalculator(calcScore, calcPair),
      ]);
      if (isMounted) {
        setCalcMatches(Array.isArray(res?.matches) ? res.matches : []);
        setGopMatches(Array.isArray(gopRes?.matches) ? gopRes.matches : []);
        setLoading(false);
      }
    }
    calculate();
    return () => { isMounted = false; };
  }, [calcScore, calcPair, calcCity]);

  // Filtered by chance
  const displayedMatches = useMemo(() => {
    if (!calcFilterChance) return calcMatches;
    return calcMatches.filter((m) => m.chance === calcFilterChance);
  }, [calcMatches, calcFilterChance]);

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
          {lang === "kz" ? "ҰБТ Грант Калькуляторы" : "Калькулятор грантов ЕНТ"}
        </span>
      </div>

      <StudentTipBanner
        title_kz="Калькуляторды қалай ақылмен қолдану керек?"
        title_ru="Как использовать результаты калькулятора при подаче на грант?"
        tip_kz="Грант конкурсында 4 нұсқа (ГОП + ЖОО) таңдауға болады: 1-орынға армандаған ЖОО-ны, 2–3-орынға баллың толық жететін нұсқаны, 4-орынға сенімді сақтандыру ГОП-ты қой."
        tip_ru="В заявлении на госгрант можно указать до 4 вариантов (ГОП + ВУЗ). Оптимальная стратегия: 1-м поставь «вуз мечты», 2–3-м — реальные варианты с запасом баллов, 4-м — надёжный запасной ГОП."
        actionHref="/booklet"
        actionLabel_kz="Шекті балдар шпаргалкасы"
        actionLabel_ru="Шпаргалка по ЕНТ"
      />

      {/* Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#270111] via-[#4A0221] to-[#1D1D1D] text-white space-y-6 shadow-xl relative overflow-hidden border border-white/10">
        <div className="relative z-10 space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#F99184] text-xs font-bold border border-[#F99184]/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#F99184]" />
            <span>{lang === "kz" ? "ҰБТ деректері негізіндегі есептеуіш" : "Расчёт на основе результатов ЕНТ"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {lang === "kz" ? "ҰБТ Грант Калькуляторы" : "Калькулятор грантов ЕНТ 2026/2027"}
          </h1>
          <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-normal">
            {lang === "kz"
              ? "Баллыңызды, бейіндік пәндерді және қаланы енгізіңіз. Жүйе 218 мамандық пен 90 университеттің шекті балдарымен салыстырып, грантқа түсу ықтималдығын дәл есептейді."
              : "Введите ваши баллы ЕНТ, профильные предметы и город. Система сопоставит ваши баллы с проходными баллами по 218 специальностям и 90 вузам Казахстана."}
          </p>
        </div>

        {/* Inputs Control Box */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 bg-white/10 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/15 relative z-10">
          {/* UNT Score Input */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-200">
              <span>{lang === "kz" ? "Сіздің ҰБТ балыңыз:" : "Ваш балл ЕНТ:"}</span>
              <span className="text-xl font-extrabold text-[#F99184]">{calcScore} / 140</span>
            </div>
            <input
              type="range"
              min="50"
              max="140"
              value={calcScore}
              onChange={(e) => setCalcScore(Number(e.target.value))}
              className="w-full accent-[#F99184] cursor-pointer"
            />
            {/* Quick Preset Score Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESET_SCORES.map((sc) => (
                <button
                  key={sc}
                  type="button"
                  onClick={() => setCalcScore(sc)}
                  className={`text-[11px] font-bold px-3 py-1 rounded-full transition-all ${calcScore === sc
                    ? "bg-[#F99184] text-[#4A0221] shadow-sm font-extrabold"
                    : "bg-white/15 text-zinc-200 hover:bg-white/25"
                    }`}
                >
                  {sc}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Pair Selection */}
          <div className="md:col-span-4 space-y-2">
            <label className="text-xs font-semibold text-zinc-200 block">
              {lang === "kz" ? "Бейіндік пәндер жұбы:" : "Пара профильных предметов:"}
            </label>
            <select
              value={calcPair}
              onChange={(e) => setCalcPair(e.target.value)}
              className="w-full px-4 py-2.5 rounded-full bg-zinc-900/90 text-white text-xs font-medium border border-white/20 focus:outline-none focus:border-[#F99184]"
            >
              {SUBJECT_PAIRS.map((p) => (
                <option key={p} value={p} className="bg-zinc-900 text-white">
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Target City Selection */}
          <div className="md:col-span-4 space-y-2">
            <label className="text-xs font-semibold text-zinc-200 block">
              {lang === "kz" ? "Оқитын қалаңыз:" : "Желаемый город обучения:"}
            </label>
            <select
              value={calcCity}
              onChange={(e) => setCalcCity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-full bg-zinc-900/90 text-white text-xs font-medium border border-white/20 focus:outline-none focus:border-[#F99184]"
            >
              {CITIES.map((c) => (
                <option key={c} value={c} className="bg-zinc-900 text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Statistical Summary Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-300 relative z-10 pt-1 border-t border-white/10">
          <div>
            {lang === "kz" ? "Табылған мамандықтар:" : "Подходящих специальностей:"}{" "}
            <strong className="text-white font-extrabold">{calcMatches?.length || 0}</strong>
          </div>
          <div className="text-[11px] text-[#F99184]">
            {lang === "kz"
              ? "ҰТО мен ҒЖБМ грант конкурсының шекті балдарымен салыстырылған"
              : "Сопоставлено с проходными порогами конкурса грантов МНВО РК"}
          </div>
        </div>
      </div>

      {/* Chance Filter Pills */}
      <ScrollablePillBar bgGradientColor="white" showIndicator={true}>
        <span className="text-zinc-500 font-medium whitespace-nowrap shrink-0">
          {lang === "kz" ? "Ықтималдық сүзгісі:" : "Фильтр шансов:"}
        </span>
        <button
          type="button"
          onClick={() => setCalcFilterChance("")}
          className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-colors shrink-0 ${calcFilterChance === ""
            ? "bg-[#A31551] text-white shadow-2xs"
            : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            }`}
        >
          {lang === "kz" ? `Барлығы (${calcMatches?.length || 0})` : `Все (${calcMatches?.length || 0})`}
        </button>
        <button
          type="button"
          onClick={() => setCalcFilterChance("high")}
          className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0 ${calcFilterChance === "high"
            ? "bg-[#A31551] text-white shadow-2xs"
            : "bg-[#FDF2F7] text-[#4A0221] border border-[#FC9385]/50 hover:bg-[#FDF2F7]"
            }`}
        >
          <span className={`w-2 h-2 rounded-full ${calcFilterChance === "high" ? "bg-white" : "bg-[#A31551]"}`} />
          <span>{lang === "kz" ? "Жоғары мүмкіндік" : "Высокий шанс"}</span>
          <span>({calcMatches?.filter((m) => m.chance === "high").length || 0})</span>
        </button>
        <button
          type="button"
          onClick={() => setCalcFilterChance("medium")}
          className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0 ${calcFilterChance === "medium"
            ? "bg-[#B8335F] text-white shadow-2xs"
            : "bg-[#FFF5F4] text-[#4A0221] border border-[#FC9385]/60 hover:bg-[#FFF5F4]"
            }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#FC9385]" />
          <span>{lang === "kz" ? "Орташа мүмкіндік" : "Средний шанс"}</span>
          <span>({calcMatches?.filter((m) => m.chance === "medium").length || 0})</span>
        </button>
        <button
          type="button"
          onClick={() => setCalcFilterChance("low")}
          className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0 ${calcFilterChance === "low"
            ? "bg-[#820232] text-white shadow-2xs"
            : "bg-[#F1F2F3] text-[#4A0221] border border-[#DCDDE3] hover:bg-[#F1F2F3]"
            }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#69758B]" />
          <span>{lang === "kz" ? "Төмен / Тәуекел" : "Малый шанс / Риск"}</span>
          <span>({calcMatches?.filter((m) => m.chance === "low").length || 0})</span>
        </button>
      </ScrollablePillBar>

      {/* Univision GOP Codes Match Strip */}
      {!loading && gopMatches.length > 0 && (
        <div className="p-5 sm:p-6 rounded-3xl border border-[#F99184]/40 bg-[#FDF2F7]/50 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-extrabold text-zinc-900 text-sm sm:text-base flex items-center gap-2">
                <span>🎯 {lang === "kz" ? "Грант конкурсына арналған ГОП кодтары (Univision • 2025)" : "Подходящие коды ГОП для заявления на грант (Univision • 2025)"}</span>
              </h2>
              <p className="text-[11px] text-zinc-600 mt-0.5">
                {lang === "kz"
                  ? "Шілдеде eGov.kz арқылы дәл осы 4 ГОП кодын таңдайсыз. 2025 жылғы жалпы/ауыл квотасы мен грант саны көрсетілген:"
                  : "Именно эти коды ГОП указываются при подаче заявления на госгрант в июле. Указаны проходные пороги 2025 г. и число грантов:"}
              </p>
            </div>
            <Link href="/programs" className="text-xs font-bold text-[#A31551] hover:underline">
              {lang === "kz" ? "Барлық 131 ГОП →" : "Все 131 ГОП →"}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {gopMatches.slice(0, 6).map((g) => (
              <Link
                key={g.code}
                href={`/programs?gop=${g.code}`}
                className="p-4 rounded-2xl bg-white border border-zinc-200 hover:border-[#A31551]/50 shadow-2xs transition-all flex flex-col justify-between space-y-2 group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-full bg-[#4A0221] text-[#F99184]">
                    {g.code}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${g.chance === "high" ? "bg-[#FDF2F7] text-[#A31551]" : g.chance === "medium" ? "bg-[#FFF5F4] text-[#820232]" : "bg-[#F1F2F3] text-[#69758B]"}`}>
                    {g.grants_full_2025 ? `${g.grants_full_2025.toLocaleString()} грант` : "Конкурс"}
                  </span>
                </div>
                <div className="font-bold text-xs sm:text-sm text-zinc-900 group-hover:text-[#A31551] leading-snug">
                  {lang === "kz" ? g.title_kk : g.title_ru}
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-zinc-100">
                  <span>{lang === "kz" ? "Өту шегі:" : "Мин. грант:"} <strong className="text-zinc-900">{g.general_min ?? "—"}</strong></span>
                  <span>{lang === "kz" ? "Өтетін ЖОО:" : "Проходите в:"} <strong className="text-[#A31551]">{g.eligible_unis_count}</strong></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Matches Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-zinc-400">
          {lang === "kz" ? "Грант мүмкіндіктері есептелуде..." : "Расчёт вероятности гранта..."}
        </div>
      ) : (displayedMatches || []).length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-zinc-200 bg-white space-y-3">
          <AlertCircle className="w-8 h-8 text-zinc-400 mx-auto" />
          <h3 className="font-bold text-zinc-800 text-sm">
            {lang === "kz" ? "Бұл сүзгі бойынша мамандық табылмады" : "По выбранным критериям программ не найдено"}
          </h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            {lang === "kz"
              ? "ҰБТ балын көтеріңіз немесе басқа бейіндік жұпты таңдаңыз."
              : "Попробуйте изменить балл или выбрать другую пару предметов."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedMatches.map((match) => {
            const isExpanded = expandedUni === match.program.slug;
            const cutoff = match.latest_min_score || match.program.avg_score || 100;
            const diff = calcScore - cutoff;
            const chanceLabel = lang === "kz" ? match.chance_label_kz : match.chance_label_ru;

            return (
              <div
                key={match.program.slug}
                className="p-5 rounded-3xl border border-[#EAEBEF] bg-white hover:border-[#A31551]/30 transition-all shadow-forte flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top status */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${match.chance === "high"
                        ? "bg-[#FDF2F7] text-[#4A0221] border-[#FC9385]/50"
                        : match.chance === "medium"
                          ? "bg-[#FFF5F4] text-[#4A0221] border-[#FC9385]/60"
                          : "bg-[#F1F2F3] text-[#4A0221] border-[#DCDDE3]"
                        }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${match.chance === "high"
                          ? "bg-[#A31551]"
                          : match.chance === "medium"
                            ? "bg-[#FC9385]"
                            : "bg-[#820232]"
                          }`}
                      />
                      <span>{chanceLabel}</span>
                    </span>

                    <span className="text-xs font-semibold text-zinc-500">
                      {lang === "kz" ? "Айырмашылық:" : "Разница:"}{" "}
                      <strong className={diff >= 0 ? "text-[#A31551]" : "text-[#820232]"}>
                        {diff >= 0 ? `+${diff}` : diff} {lang === "kz" ? "балл" : "б."}
                      </strong>
                    </span>
                  </div>

                  {/* Program Title */}
                  <Link href={`/programs/${match.program.slug}`} className="block group">
                    <h3 className="font-bold text-zinc-900 text-base group-hover:text-[#A31551] transition-colors leading-snug">
                      {match.program.title}
                    </h3>
                  </Link>

                  {/* Metrics grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
                      <div className="text-[10px] text-zinc-400 uppercase font-semibold">
                        {lang === "kz" ? "Орташа шекті балл:" : "Проходной балл:"}
                      </div>
                      <div className="font-bold text-zinc-900 mt-0.5">
                        {cutoff} {lang === "kz" ? "балл" : "баллов"}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
                      <div className="text-[10px] text-zinc-400 uppercase font-semibold">
                        {lang === "kz" ? "Оқытатын ЖОО саны:" : "Обучающих вузов:"}
                      </div>
                      <div className="font-bold text-[#A31551] mt-0.5">
                        {match.matching_unis?.length || 0} {lang === "kz" ? "университет" : "вузов"}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Universities List */}
                  {match.matching_unis && match.matching_unis.length > 0 && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setExpandedUni(isExpanded ? null : match.program.slug)}
                        className="text-xs font-bold text-zinc-600 hover:text-zinc-900 flex items-center justify-between w-full py-1.5 px-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors"
                      >
                        <span>{lang === "kz" ? "Қолжетімді ЖОО тізімі" : "Список обучающих вузов"}</span>
                        <span>{isExpanded ? "▲" : "▼"}</span>
                      </button>

                      {isExpanded && (
                        <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar border border-zinc-100 rounded-xl p-2 bg-zinc-50/50 text-xs">
                          {(match.matching_unis || []).map((u, i) => (
                            <div key={i} className="py-1 px-1.5 flex items-center justify-between text-zinc-700 border-b border-zinc-100 last:border-b-0">
                              <span className="font-medium truncate max-w-[200px]">{u.uni_name}</span>
                              <span className="text-[11px] text-zinc-500 font-semibold">{u.city}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Action */}
                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <Link
                    href={`/programs/${match.program.slug}`}
                    className="font-bold text-[#A31551] hover:text-[#820232] flex items-center gap-1 group"
                  >
                    <span>{lang === "kz" ? "Бағдарлама профилін ашу" : "Профиль программы"}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <Link
                    href="/grants"
                    className="text-zinc-500 hover:text-zinc-800 font-medium"
                  >
                    {lang === "kz" ? "Грант ережелері →" : "Правила грантов →"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
