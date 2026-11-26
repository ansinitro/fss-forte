"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Compass,
  Calendar,
  Calculator,
  CheckSquare,
  Square,
  Award,
  LifeBuoy,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Download,
  Printer,
  CheckCircle2,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useCompassGuide } from "@/components/onboarding/StudentCompassTour";
import { ScrollablePillBar } from "@/components/common/ScrollablePillBar";
import {
  STUDENT_TRACKS,
  BOOKLET_TIMELINE,
  ENT_SCORE_BREAKDOWN,
  ENT_PAIR_CHEATSHEET,
  DOCUMENT_CHECKLIST
} from "@/data/studentBooklet";

interface Props {
  compact?: boolean;
}

const DOC_STORAGE_KEY = "fc_doc_checklist_v1";

export const InteractiveBooklet: React.FC<Props> = ({ compact = false }) => {
  const { lang, t } = useI18n();
  const { selectedTrack, setSelectedTrack, openGuide } = useCompassGuide();
  const [chapter, setChapter] = useState<number>(0);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [showAllForPrint, setShowAllForPrint] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DOC_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setCheckedDocs(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleDoc = (id: string) => {
    setCheckedDocs((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(DOC_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const checkedCount = DOCUMENT_CHECKLIST.filter((d) => checkedDocs[d.id]).length;
  const activeTrack = STUDENT_TRACKS.find((tr) => tr.id === selectedTrack) || STUDENT_TRACKS[1];

  const chapters = [
    {
      id: "track",
      num: "01",
      icon: Compass,
      short_kz: "1. Менің бағытым",
      short_ru: "1. Мой маршрут",
      title_kz: "Өз жағдайыңды таңда — жеке қадамдық жоспар ал",
      title_ru: "Кто ты сейчас? Персональный план действий",
    },
    {
      id: "timeline",
      num: "02",
      icon: Calendar,
      short_kz: "2. Жыл күнтізбесі",
      short_ru: "2. Сроки по месяцам",
      title_kz: "Қаңтардан тамызға дейінгі басты мерзімдер",
      title_ru: "Календарь поступающего: с января по август",
    },
    {
      id: "ent",
      num: "03",
      icon: Calculator,
      short_kz: "3. ҰБТ шпаргалкасы",
      short_ru: "3. Шпаргалка ЕНТ",
      title_kz: "140 балл құрылымы, шекті балдар және пән жұптары",
      title_ru: "120 вопросов, пороги 50/65/70/75 и пары предметов",
    },
    {
      id: "docs",
      num: "04",
      icon: CheckSquare,
      short_kz: "4. Құжаттар",
      short_ru: "4. Чек-лист документов",
      title_kz: "Дайын құжаттарыңды белгіле (сақталады)",
      title_ru: "Отметь собранные документы (прогресс сохраняется)",
    },
    {
      id: "grants",
      num: "05",
      icon: Award,
      short_kz: "5. Гранттар мен квота",
      short_ru: "5. Гранты и квоты",
      title_kz: "Қазақстан гранттарының бөлінуі және 10 квота",
      title_ru: "Сколько грантов выделено в РК и кому положены квоты",
    },
    {
      id: "planb",
      num: "06",
      icon: LifeBuoy,
      short_kz: "6. «Б» жоспары",
      short_ru: "6. План «Б»",
      title_kz: "Грантқа ілікпесең де оқуға болатын 5 нақты жол",
      title_ru: "5 реальных способов учиться бесплатно без госгранта",
    },
  ];

  const handlePrint = () => {
    setShowAllForPrint(true);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div id="booklet" className="rounded-[2rem] border border-[#F99184]/40 bg-white shadow-forte overflow-hidden">
      {/* Booklet Spine Header */}
      <div className="p-5 sm:p-7 bg-gradient-to-r from-[#270111] via-[#4A0221] to-[#4A0221] text-white flex flex-col lg:flex-row lg:items-center justify-between gap-4 print:bg-white print:text-black print:border-b print:border-zinc-300">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F99184] text-[11px] font-bold border border-[#F99184]/30 print:hidden">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === "kz" ? "Интерактивті буклет • 6 тарау" : "Интерактивный буклет абитуриента • 6 глав"}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white print:text-black">
            {lang === "kz" ? "Талапкердің қалта кітапшасы 2026–2027" : "Памятка школьника и абитуриента 2026–2027"}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl print:text-zinc-600">
            {lang === "kz"
              ? "Күрделі сайттарды араламай-ақ оқуға түсудің бүкіл жолын 3 минутта түсініп ал."
              : "Вся суть поступления без лишней воды: от выбора 9/11 класса до готового списка документов и Плана «Б»."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 print:hidden">
          {!compact && (
            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors border border-white/15"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{lang === "kz" ? "Басып шығару" : "Распечатать"}</span>
            </button>
          )}
          <a
            href="/docs/ForteBank_RU_print_compact.pdf"
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-gradient-to-r from-[#F99184] via-[#B8335F] to-[#A51652] hover:brightness-110 text-white text-xs font-bold shadow-md transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === "kz" ? "PDF (400 КБ)" : "PDF (400 КБ)"}</span>
          </a>
          {compact && (
            <Link
              href="/booklet"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white text-[#4A0221] hover:bg-[#FDF2F7] text-xs font-extrabold transition-colors"
            >
              <span>{lang === "kz" ? "Толық кітапша" : "Полный буклет →"}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Chapter Navigation Tabs (Hidden when printing all) */}
      <div className="border-b border-zinc-100 bg-zinc-50/80 px-2 sm:px-6 py-2.5 print:hidden">
        <ScrollablePillBar
          activeItemIndex={chapter}
          bgGradientColor="zinc-50"
          showIndicator={true}
          scrollHint={lang === "kz" ? "Барлық 6 тарауды көру үшін оңға/солға жылжытыңыз" : "Листайте для просмотра всех 6 глав →"}
        >
          {chapters.map((ch, idx) => {
            const Icon = ch.icon;
            const active = chapter === idx;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  setShowAllForPrint(false);
                  setChapter(idx);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  active
                    ? "bg-[#A31551] text-white shadow-forte scale-[1.02]"
                    : "bg-white border border-zinc-200 text-zinc-700 hover:border-[#F99184] hover:text-[#A31551] hover:bg-[#FDF2F7]"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{lang === "kz" ? ch.short_kz : ch.short_ru}</span>
                {ch.id === "docs" && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${active ? "bg-white/20 text-white" : "bg-[#FDF2F7] text-[#A31551]"}`}>
                    {checkedCount}/{DOCUMENT_CHECKLIST.length}
                  </span>
                )}
              </button>
            );
          })}
        </ScrollablePillBar>
      </div>

      {/* Chapter Content Body */}
      <div className="p-5 sm:p-7 space-y-8">
        {/* CHAPTER 1: TRACK & ROADMAP */}
        {(chapter === 0 || showAllForPrint) && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A31551]">
                  {lang === "kz" ? "01-тарау • Жеке бағдар" : "Глава 01 • Персональный трек"}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-zinc-950">
                  {lang === "kz" ? chapters[0].title_kz : chapters[0].title_ru}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => openGuide("tour")}
                className="text-xs font-bold text-[#A31551] hover:underline flex items-center gap-1 print:hidden"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === "kz" ? "Сайт бойынша гид" : "Как работает платформа (тур)"}</span>
              </button>
            </div>

            {/* 4 Track Selector Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 print:hidden">
              {STUDENT_TRACKS.map((tr) => {
                const isSelected = selectedTrack === tr.id;
                return (
                  <button
                    key={tr.id}
                    type="button"
                    onClick={() => setSelectedTrack(tr.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "border-[#A31551] bg-[#FDF2F7] shadow-forte"
                        : "border-zinc-200 bg-zinc-50/60 hover:bg-white hover:border-[#F99184]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{tr.emoji}</span>
                      {isSelected && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#A31551] text-white">
                          {lang === "kz" ? "Таңдалды" : "Выбрано"}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-bold text-[#A31551] mt-2">
                      {lang === "kz" ? tr.badge_kz : tr.badge_ru}
                    </div>
                    <div className="text-xs font-bold text-zinc-900 mt-0.5 leading-snug">
                      {lang === "kz" ? tr.title_kz : tr.title_ru}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Track Roadmap Card */}
            <div className="p-5 sm:p-6 rounded-3xl border border-[#F99184]/40 bg-gradient-to-br from-[#FDF2F7]/70 via-white to-zinc-50 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F99184]/20 pb-3">
                <div>
                  <div className="text-sm sm:text-base font-black text-zinc-950 flex items-center gap-2">
                    <span>{activeTrack.emoji}</span>
                    <span>{lang === "kz" ? activeTrack.title_kz : activeTrack.title_ru}</span>
                  </div>
                  <p className="text-xs text-zinc-600 mt-1">
                    {lang === "kz" ? activeTrack.subtitle_kz : activeTrack.subtitle_ru}
                  </p>
                </div>
                <Link
                  href={activeTrack.primaryCta.href}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#A31551] hover:brightness-110 text-white text-xs font-bold shrink-0 shadow-xs transition-all print:hidden"
                >
                  <span>{lang === "kz" ? activeTrack.primaryCta.label_kz : activeTrack.primaryCta.label_ru}</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeTrack.steps.map((st, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-zinc-200/80 flex flex-col justify-between space-y-2.5">
                    <div>
                      <div className="text-xs font-extrabold text-[#A31551]">
                        {lang === "kz" ? st.step_kz : st.step_ru}
                      </div>
                      <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                        {lang === "kz" ? st.detail_kz : st.detail_ru}
                      </p>
                    </div>
                    {st.href && (
                      <Link
                        href={st.href}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#A31551] hover:underline print:hidden"
                      >
                        <span>{lang === "kz" ? st.cta_kz : st.cta_ru}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFF5F4] border border-[#FC9385]/70 flex items-start gap-2.5 text-xs text-[#4A0221]">
                <AlertTriangle className="w-4 h-4 text-[#A31551] shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">
                  {lang === "kz" ? activeTrack.warning_kz : activeTrack.warning_ru}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* CHAPTER 2: TIMELINE */}
        {(chapter === 1 || showAllForPrint) && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A31551]">
                  {lang === "kz" ? "02-тарау • Мерзімдер" : "Глава 02 • Календарь года"}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-zinc-950">
                  {lang === "kz" ? chapters[1].title_kz : chapters[1].title_ru}
                </h3>
              </div>
              <Link href="/deadlines" className="text-xs font-bold text-[#A31551] hover:underline flex items-center gap-1 print:hidden">
                <span>{lang === "kz" ? "Толық күнтізбе" : "Весь календарь дедлайнов"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {BOOKLET_TIMELINE.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/60 space-y-2 relative">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] text-[11px] font-extrabold border border-[#F99184]/40">
                      {lang === "kz" ? item.period_kz : item.period_ru}
                    </span>
                    <span className="text-[11px] font-bold text-zinc-400">0{idx + 1}</span>
                  </div>
                  <h4 className="font-bold text-sm text-zinc-950 leading-snug">
                    {lang === "kz" ? item.title_kz : item.title_ru}
                  </h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    {lang === "kz" ? item.detail_kz : item.detail_ru}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CHAPTER 3: ENT CHEATSHEET */}
        {(chapter === 2 || showAllForPrint) && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A31551]">
                  {lang === "kz" ? "03-тарау • ҰБТ формуласы" : "Глава 03 • Шпаргалка по ЕНТ"}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-zinc-950">
                  {lang === "kz" ? chapters[2].title_kz : chapters[2].title_ru}
                </h3>
              </div>
              <Link href="/calculator" className="text-xs font-bold text-[#A31551] hover:underline flex items-center gap-1 print:hidden">
                <Calculator className="w-3.5 h-3.5" />
                <span>{lang === "kz" ? "Калькуляторда тексеру" : "Проверить баллы в калькуляторе"}</span>
              </Link>
            </div>

            {/* Thresholds strip + Subject breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-6 p-4 rounded-2xl border border-zinc-200 bg-zinc-50/70 space-y-2.5">
                <div className="text-xs font-extrabold text-zinc-900">
                  {lang === "kz" ? "120 сұрақ = 140 балл (5 пән):" : "Структура ЕНТ: 120 вопросов = 140 баллов"}
                </div>
                <div className="space-y-1.5">
                  {ENT_SCORE_BREAKDOWN.map((sub, i) => (
                    <div key={i} className="flex items-center justify-between text-xs bg-white px-3 py-2 rounded-xl border border-zinc-100">
                      <div>
                        <span className="font-bold text-zinc-900">{lang === "kz" ? sub.name_kz : sub.name_ru}</span>
                        <span className="text-[10px] text-zinc-400 ml-1.5">({lang === "kz" ? sub.note_kz : sub.note_ru})</span>
                      </div>
                      <span className="font-extrabold text-[#A31551] shrink-0">
                        {sub.questions} {lang === "kz" ? "сұр." : "вопр."} / {sub.max} {lang === "kz" ? "б." : "б."}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-6 space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3.5 rounded-2xl border border-zinc-200 bg-white">
                    <div className="text-2xl font-black text-zinc-950">50+</div>
                    <div className="text-[11px] font-bold text-[#A31551]">{lang === "kz" ? "Базалық шек" : "Базовый порог"}</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">{lang === "kz" ? "Көптеген ЖОО мен мамандықтар" : "Большинство вузов и направлений"}</div>
                  </div>
                  <div className="p-3.5 rounded-2xl border border-zinc-200 bg-white">
                    <div className="text-2xl font-black text-zinc-950">65+</div>
                    <div className="text-[11px] font-bold text-[#A31551]">{lang === "kz" ? "Ұлттық ЖОО-лар" : "Национальные вузы"}</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">{lang === "kz" ? "ЕНУ, ҚазҰУ, Satbayev т.б." : "ЕНУ, КазНУ, Satbayev и др."}</div>
                  </div>
                  <div className="p-3.5 rounded-2xl border border-[#EAEBEF] bg-white">
                    <div className="text-2xl font-black text-[#1D1D1D]">70+</div>
                    <div className="text-[11px] font-bold text-[#820232]">{lang === "kz" ? "Медицина" : "Медицина"}</div>
                    <div className="text-[11px] text-[#69758B] mt-0.5">{lang === "kz" ? "Денсаулық сақтау саласы" : "Все медицинские специальности"}</div>
                  </div>
                  <div className="p-3.5 rounded-2xl border border-[#EAEBEF] bg-white">
                    <div className="text-2xl font-black text-[#1D1D1D]">75+</div>
                    <div className="text-[11px] font-bold text-[#4A0221]">{lang === "kz" ? "Педагогика және Құқық" : "Педагогика и Право"}</div>
                    <div className="text-[11px] text-[#69758B] mt-0.5">{lang === "kz" ? "Ең жоғары міндетті шек" : "Минимальный порог по закону"}</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FDF2F7] border border-[#A31551]/30 text-xs text-[#4A0221] flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#A31551] shrink-0 mt-0.5" />
                  <span>
                    {lang === "kz"
                      ? "Маңызды ереже: Әр пәннен кемінде 5 балл (шығармашылықта да) жинау міндетті! Жанама сұрақ — AIT-2027 тесті туралы «Білім базасынан» оқы."
                      : "Критично: минимум 5 баллов по КАЖДОМУ предмету (иначе сертификат не участвует). Про переход на тест AIT-2027 читай в Базе знаний."}
                  </span>
                </div>
              </div>
            </div>

            {/* Subject Pairs Table */}
            <div className="space-y-2">
              <div className="text-xs font-extrabold text-zinc-900">
                {lang === "kz" ? "Негізгі пәндер жұбы → Қайда түсуге болады:" : "Популярные пары предметов → Куда можно поступить:"}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {ENT_PAIR_CHEATSHEET.map((p, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl border border-zinc-200 bg-white space-y-1.5">
                    <div className="text-xs font-extrabold text-[#A31551]">
                      {lang === "kz" ? p.pair_kz : p.pair_ru}
                    </div>
                    <div className="text-xs font-semibold text-zinc-800 leading-snug">
                      {lang === "kz" ? p.examples_kz : p.examples_ru}
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      {lang === "kz" ? p.avg_note_kz : p.avg_note_ru}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CHAPTER 4: INTERACTIVE DOCUMENT CHECKLIST */}
        {(chapter === 3 || showAllForPrint) && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A31551]">
                  {lang === "kz" ? "04-тарау • Құжаттар папкасы" : "Глава 04 • Твой чек-лист документов"}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-zinc-950">
                  {lang === "kz" ? chapters[3].title_kz : chapters[3].title_ru}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3.5 py-1.5 rounded-full bg-[#FDF2F7] border border-[#F99184]/40 text-xs font-extrabold text-[#A31551]">
                  {lang === "kz"
                    ? `Дайын: ${checkedCount} / ${DOCUMENT_CHECKLIST.length}`
                    : `Собрано: ${checkedCount} из ${DOCUMENT_CHECKLIST.length}`}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 rounded-full bg-[#F1F2F3] overflow-hidden print:hidden">
              <div
                className="h-full bg-gradient-to-r from-[#4A0221] via-[#A31551] to-[#FC9385] transition-all duration-300"
                style={{ width: `${Math.round((checkedCount / DOCUMENT_CHECKLIST.length) * 100)}%` }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DOCUMENT_CHECKLIST.map((doc) => {
                const done = Boolean(checkedDocs[doc.id]);
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => toggleDoc(doc.id)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                      done
                        ? "border-[#A31551]/40 bg-[#FDF2F7]"
                        : "border-[#EAEBEF] bg-white hover:border-[#FC9385]"
                    }`}
                  >
                    {done ? (
                      <CheckSquare className="w-5 h-5 text-[#A31551] shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-5 h-5 text-[#69758B] shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className={`text-xs sm:text-sm font-bold leading-snug ${done ? "text-[#4A0221] line-through decoration-[#A31551]/60" : "text-[#1D1D1D]"}`}>
                        {lang === "kz" ? doc.title_kz : doc.title_ru}
                      </div>
                      <div className="text-[11px] text-[#69758B] mt-1">
                        {lang === "kz" ? doc.tip_kz : doc.tip_ru}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* CHAPTER 5: GRANTS & QUOTAS */}
        {(chapter === 4 || showAllForPrint) && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A31551]">
                  {lang === "kz" ? "05-тарау • Гранттар саны" : "Глава 05 • Гранты и льготные квоты"}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-zinc-950">
                  {lang === "kz" ? chapters[4].title_kz : chapters[4].title_ru}
                </h3>
              </div>
              <Link href="/guides/quotas" className="text-xs font-bold text-[#A31551] hover:underline flex items-center gap-1 print:hidden">
                <span>{lang === "kz" ? "Барлық 10 квота кестесі" : "Полная таблица 10 квот"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-[#FDF2F7] border border-[#F99184]/40">
                <div className="text-[11px] font-bold text-[#A31551]">2025 РК</div>
                <div className="text-2xl font-black text-zinc-950 mt-0.5">78 125</div>
                <div className="text-[11px] text-zinc-600">{lang === "kz" ? "Барлық мем. грант" : "Всего госгрантов РК"}</div>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                <div className="text-[11px] font-bold text-zinc-500">{lang === "kz" ? "Бакалавриат" : "Бакалавриат"}</div>
                <div className="text-2xl font-black text-zinc-950 mt-0.5">63 622</div>
                <div className="text-[11px] text-zinc-600">{lang === "kz" ? "Оның 48 697 — толық" : "Из них 48 697 очных"}</div>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                <div className="text-[11px] font-bold text-zinc-500">{lang === "kz" ? "Колледжден кейін" : "После колледжа"}</div>
                <div className="text-2xl font-black text-zinc-950 mt-0.5">3 976</div>
                <div className="text-[11px] text-zinc-600">{lang === "kz" ? "Қысқартылған грант" : "Сокращённых грантов"}</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#4A0221] border border-[#4A0221] text-white">
                <div className="text-[11px] font-bold text-[#FC9385]">{lang === "kz" ? "Жеңілдік квотасы" : "Льготные квоты"}</div>
                <div className="text-2xl font-black text-white mt-0.5">10 949</div>
                <div className="text-[11px] text-white/80">{lang === "kz" ? "10 заңды санат" : "10 категорий граждан"}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {[
                { pct: "35%", kz: "Ауылдық квота", ru: "Сельская квота (соц.-экон. специальности)" },
                { pct: "5%", kz: "Көп балалы отбасылар (4+ бала)", ru: "Дети из многодетных семей (4+ детей)" },
                { pct: "4%", kz: "Қандастар квотасы", ru: "Квота для кандасов (не граждане РК)" },
                { pct: "3% / 1%", kz: "Толық емес отбасы (3+ жыл)", ru: "Неполные семьи (статус от 3 лет)" },
                { pct: "2% / 10%", kz: "Мүгедектігі бар азаматтар", ru: "Инвалидность I–II гр. и с детства" },
                { pct: "2.5%", kz: "Әскери борышын өтегендер", ru: "Отслужившие срочную воинскую службу" },
              ].map((q, idx) => (
                <div key={idx} className="p-3 rounded-2xl border border-zinc-200 bg-white flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-xl bg-[#FDF2F7] text-[#A31551] font-black text-xs shrink-0">
                    {q.pct}
                  </span>
                  <span className="text-xs font-semibold text-zinc-800 leading-snug">
                    {lang === "kz" ? q.kz : q.ru}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CHAPTER 6: PLAN B & STIPENDS */}
        {(chapter === 5 || showAllForPrint) && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A31551]">
                  {lang === "kz" ? "06-тарау • Қосалқы жоспар" : "Глава 06 • План «Б» и поддержка"}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-zinc-950">
                  {lang === "kz" ? chapters[5].title_kz : chapters[5].title_ru}
                </h3>
              </div>
              <Link href="/grants" className="text-xs font-bold text-[#A31551] hover:underline flex items-center gap-1 print:hidden">
                <span>{lang === "kz" ? "Барлық грант түрлері" : "Открыть раздел «Гранты»"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  badge_kz: "5 – 15 тамыз",
                  badge_ru: "5 – 15 августа",
                  title_kz: "Астана қаласы әкімінің гранттары (303+)",
                  title_ru: "Гранты акима города Астаны (303+ мест)",
                  desc_kz: "Педагогика, IT, медицина және құрылыс мамандықтарына қала бюджетінен тегін оқу.",
                  desc_ru: "Городские целевые гранты в вузах Астаны по приоритетным специальностям без возврата средств.",
                  href: "/grants",
                },
                {
                  badge_kz: "1-семестрден соң",
                  badge_ru: "После 1-й сессии",
                  title_kz: "GPA ≥ 3.5 арқылы бос грантқа ауысу",
                  title_ru: "Перевод с платного на вакантный грант",
                  desc_kz: "Сессияны «A» және «B» бағаларымен жапқан студенттер ҚР ҒЖБМ конкурсы арқылы грантқа өтеді.",
                  desc_ru: "По результатам зимней или летней сессии освобождаются гранты — рейтинг идёт строго по GPA.",
                  href: "/guides/transfer-to-grant",
                },
                {
                  badge_kz: "600 000 ₸ ваучер",
                  badge_ru: "Ваучер 600 000 ₸",
                  title_kz: "Tech Orda және Tomorrow School (Astana Hub)",
                  title_ru: "Бесплатное IT-обучение Tech Orda и alem.ai",
                  desc_kz: "Қазақстанның үздік жеке IT-мектептерінде бағдарламалау, AI, Data, дизайнды тегін үйрену.",
                  desc_ru: "Государственное финансирование обучения в частных IT-школах (программирование, Data, UX).",
                  href: "/opportunities",
                },
                {
                  badge_kz: "ҰБТ-сыз",
                  badge_ru: "Без сдачи ЕНТ",
                  title_kz: "Мемлекеттік колледж + болашақ қысқартылған грант",
                  title_ru: "Колледж по аттестату + 3 976 грантов после него",
                  desc_kz: "Тегін оқу, шәкіртақы және кейін ЖОО-ға қысқартылған бағдарламамен түсу құқығы.",
                  desc_ru: "Бесплатное обучение со стипендией и последующий переход в университет по сокращённой ветке.",
                  href: "/colleges",
                },
              ].map((card, i) => (
                <Link
                  key={i}
                  href={card.href}
                  className="p-4 rounded-2xl border border-zinc-200 bg-white hover:border-[#A31551]/40 transition-all flex flex-col justify-between space-y-2 group"
                >
                  <div>
                    <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FDF2F7] text-[#A31551]">
                      {lang === "kz" ? card.badge_kz : card.badge_ru}
                    </span>
                    <h4 className="font-bold text-sm text-zinc-950 mt-2 group-hover:text-[#A31551] transition-colors">
                      {lang === "kz" ? card.title_kz : card.title_ru}
                    </h4>
                    <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                      {lang === "kz" ? card.desc_kz : card.desc_ru}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#A31551] pt-1 print:hidden">
                    <span>{t.common.explore}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Booklet Footer Pager */}
        {!showAllForPrint && (
          <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-2 print:hidden">
            <button
              type="button"
              onClick={() => setChapter((c) => Math.max(0, c - 1))}
              disabled={chapter === 0}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 rounded-full border border-zinc-200 bg-white text-xs font-bold text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === "kz" ? "Алдыңғы тарау" : "Предыдущая глава"}</span>
              <span className="sm:hidden">{lang === "kz" ? "Артқа" : "Назад"}</span>
            </button>

            <span className="text-xs font-bold text-zinc-400 whitespace-nowrap">
              {chapter + 1} / {chapters.length}
            </span>

            <button
              type="button"
              onClick={() => setChapter((c) => Math.min(chapters.length - 1, c + 1))}
              disabled={chapter === chapters.length - 1}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-[#FDF2F7] border border-[#F99184]/40 text-xs font-bold text-[#A31551] hover:bg-[#A31551] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span className="hidden sm:inline">{lang === "kz" ? "Келесі тарау" : "Следующая глава"}</span>
              <span className="sm:hidden">{lang === "kz" ? "Алға" : "Вперед"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
