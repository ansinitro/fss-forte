"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Compass,
  X,
  BookOpen,
  Calculator,
  GraduationCap,
  Search,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  AlertTriangle
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { STUDENT_TRACKS, StudentTrackId } from "@/data/studentBooklet";

interface CompassGuideContextType {
  isOpen: boolean;
  tab: "track" | "tour";
  openGuide: (initialTab?: "track" | "tour") => void;
  closeGuide: () => void;
  selectedTrack: StudentTrackId;
  setSelectedTrack: (track: StudentTrackId) => void;
}

const CompassGuideContext = createContext<CompassGuideContextType>({
  isOpen: false,
  tab: "track",
  openGuide: () => {},
  closeGuide: () => {},
  selectedTrack: "grade11",
  setSelectedTrack: () => {},
});

export const useCompassGuide = () => useContext(CompassGuideContext);

const STORAGE_TOUR_KEY = "fc_welcome_seen_v2";
const STORAGE_TRACK_KEY = "fc_student_track_v1";

export const CompassGuideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lang } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<"track" | "tour">("track");
  const [tourStep, setTourStep] = useState(0);
  const [selectedTrack, setSelectedTrackState] = useState<StudentTrackId>("grade11");

  useEffect(() => {
    try {
      const savedTrack = localStorage.getItem(STORAGE_TRACK_KEY) as StudentTrackId | null;
      if (savedTrack && ["grade9", "grade11", "career", "planb"].includes(savedTrack)) {
        setSelectedTrackState(savedTrack);
      }
    } catch {
      // Ignore storage access restrictions
    }
  }, []);

  const markSeen = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_TOUR_KEY, "1");
    } catch {
      // ignore
    }
  }, []);

  const openGuide = useCallback((initialTab: "track" | "tour" = "track") => {
    setTab(initialTab);
    setTourStep(0);
    setIsOpen(true);
  }, []);

  const closeGuide = useCallback(() => {
    setIsOpen(false);
    markSeen();
  }, [markSeen]);

  const setSelectedTrack = useCallback((track: StudentTrackId) => {
    setSelectedTrackState(track);
    try {
      localStorage.setItem(STORAGE_TRACK_KEY, track);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeGuide();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeGuide]);

  const tourSteps = [
    {
      icon: BookOpen,
      color: "bg-[#FDF2F7] text-[#A31551]",
      badge_kz: "1-қадам • Кітапша",
      badge_ru: "Шаг 1 • Карманный буклет",
      title_kz: "Барлық негізгі ережелер — «Абитуриент кітапшасында»",
      title_ru: "Всё главное собрано как понятная книжка-памятка",
      desc_kz: "ҰБТ-да неше сұрақ, шекті балдар (50/65/75), маңызды мерзімдер, құжаттар чек-листі және грантсыз қалсаң не істеу керегі бір жерде. Күрделі заңдарсыз, нақты 6 тарауда!",
      desc_ru: "Никаких запутанных сайтов: пороги ЕНТ (50/65/75), календарь по месяцам, интерактивный чек-лист документов с галочками и План «Б» оформлены в 6 наглядных главах.",
      href: "/booklet",
      cta_kz: "Буклетті ашу",
      cta_ru: "Открыть буклет абитуриента",
    },
    {
      icon: Calculator,
      color: "bg-[#4A0221] text-[#FC9385]",
      badge_kz: "2-қадам • ҰБТ Болжау",
      badge_ru: "Шаг 2 • Проверка шансов ЕНТ",
      title_kz: "Баллыңды енгізіп, грантқа мүмкіндігіңді тексер",
      title_ru: "Введи свои баллы и сразу увидь доступные гранты",
      desc_kz: "Сіздің нақты немесе мақсатты баллыңызды (мысалы, 105) 131 ГОП пен 218 мамандықтың өткен жылғы балдарымен салыстырып береді.",
      desc_ru: "Калькулятор сравнивает твой балл (например, 105) и выбранную пару предметов со статистикой по 131 ГОП и 218 программам вузов за 2025 год.",
      href: "/calculator",
      cta_kz: "Калькуляторға өту",
      cta_ru: "Перейти в калькулятор",
    },
    {
      icon: GraduationCap,
      color: "bg-[#F1F2F3] text-[#4A0221]",
      badge_kz: "3-қадам • Колледж және ЖОО",
      badge_ru: "Шаг 3 • Колледжи (688) и ВУЗы (143)",
      title_kz: "Колледждер мен ЖОО каталогы — кодтар, баға және госзаказ",
      title_ru: "Выбор места учёбы: от колледжей без ЕНТ до всех вузов РК",
      desc_kz: "9-сыныптан кейін колледж іздесең — тегін госзаказды таңда. 11-сыныптан кейін — ЖОО-ның 3 таңбалы ЕНТ коды мен оқу ақысын көр.",
      desc_ru: "После 9 класса — выбирай из 32 колледжей Астаны и 688 по РК (без ЕНТ!). Для вузов сразу есть 3-значный код для eGov-заявки, ректорские контакты и цены.",
      href: "/colleges",
      cta_kz: "Колледждерді қарау",
      cta_ru: "Открыть каталог колледжей",
    },
    {
      icon: Search,
      color: "bg-[#FFF5F4] text-[#820232]",
      badge_kz: "4-қадам • Жылдам іздеу",
      badge_ru: "Шаг 4 • Быстрый поиск ⌘K",
      title_kz: "Іздеу арқылы кез келген код пен мамандықты 2 секундта тап",
      title_ru: "Ищи что угодно за 2 секунды со всей базы",
      desc_kz: "Мысалы: «B057», «Медицина», «AITU», «Грант акима» немесе өз қалаңның атын терсең, бүкіл деректер базасынан бірден жауап аласың.",
      desc_ru: "Просто нажми ⌘K или кнопку поиска вверху и введи «B057», «Дизайн», «ЕНУ», «Шымкент» или «Академический отпуск».",
      href: "/programs",
      cta_kz: "131 ГОП каталогы",
      cta_ru: "Смотреть 131 ГОП",
    },
  ];

  const activeTrackObj = STUDENT_TRACKS.find((t) => t.id === selectedTrack) || STUDENT_TRACKS[1];
  const currentTour = tourSteps[tourStep];
  const TourIcon = currentTour.icon;

  return (
    <CompassGuideContext.Provider
      value={{ isOpen, tab, openGuide, closeGuide, selectedTrack, setSelectedTrack }}
    >
      {children}

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-zinc-950/65 backdrop-blur-xs"
          onClick={closeGuide}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Brand Bar */}
            <div className="p-3.5 sm:p-5 bg-gradient-to-r from-[#270111] via-[#4A0221] to-[#820232] text-white flex items-start justify-between gap-3 shrink-0">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[#F99184] text-[10px] sm:text-[11px] font-bold">
                  <Sparkles className="w-3 h-3" />
                  <span>{lang === "kz" ? "Алғашқы нұсқаулық • Forte Compass" : "Гид для тех, кто впервые здесь"}</span>
                </div>
                <h2 className="text-base sm:text-xl font-black tracking-tight leading-snug">
                  {lang === "kz"
                    ? "Оқуға түсу жолын 1 минутта түсініп ал!"
                    : "Разберись с поступлением за 1 минуту"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeGuide}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                aria-label="Закрыть гид"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="px-3.5 sm:px-5 pt-3 pb-2.5 border-b border-zinc-100 bg-zinc-50/80 shrink-0">
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-zinc-200/70">
                <button
                  type="button"
                  onClick={() => setTab("track")}
                  className={`py-2 px-2 sm:px-4 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                    tab === "track"
                      ? "bg-white text-[#A31551] shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  <span>🎯</span>
                  <span className="hidden sm:inline">{lang === "kz" ? "1. Сенің жағдайың (Трек)" : "1. Кто ты? (Твой план)"}</span>
                  <span className="sm:hidden">{lang === "kz" ? "1. Сенің трегің" : "1. Твой план"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTab("tour")}
                  className={`py-2 px-2 sm:px-4 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                    tab === "tour"
                      ? "bg-white text-[#A31551] shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  <span>🚀</span>
                  <span className="hidden sm:inline">{lang === "kz" ? "2. Сайт қалай жұмыс істейді (4 қадам)" : "2. Как пользоваться сайтом (4 шага)"}</span>
                  <span className="sm:hidden">{lang === "kz" ? "2. Тур (4 шага)" : "2. Тур (4 шага)"}</span>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 custom-scrollbar flex-1 min-h-0">
              {tab === "track" ? (
                <>
                  <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                    {STUDENT_TRACKS.map((tr) => {
                      const active = selectedTrack === tr.id;
                      return (
                        <button
                          key={tr.id}
                          type="button"
                          onClick={() => setSelectedTrack(tr.id)}
                          className={`p-2.5 sm:p-3.5 rounded-2xl border text-left transition-all flex items-start gap-2 sm:gap-3 cursor-pointer ${
                            active
                              ? "border-[#A31551] bg-[#FDF2F7] shadow-xs"
                              : "border-zinc-200 bg-white hover:border-[#F99184]"
                          }`}
                        >
                          <span className="text-lg sm:text-xl shrink-0 mt-0.5">{tr.emoji}</span>
                          <div className="min-w-0">
                            <div className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${active ? "text-[#A31551]" : "text-zinc-400"} truncate`}>
                              {lang === "kz" ? tr.badge_kz : tr.badge_ru}
                            </div>
                            <div className="text-[11px] sm:text-xs font-bold text-zinc-900 mt-0.5 leading-snug line-clamp-2">
                              {lang === "kz" ? tr.title_kz : tr.title_ru}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Preview of selected track's checklist */}
                  <div className="p-3.5 sm:p-4 rounded-2xl border border-[#F99184]/40 bg-[#FDF2F7]/50 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-black text-zinc-950">
                          {activeTrackObj.emoji}{" "}
                          {lang === "kz" ? activeTrackObj.title_kz : activeTrackObj.title_ru}
                        </div>
                        <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                          {lang === "kz" ? activeTrackObj.subtitle_kz : activeTrackObj.subtitle_ru}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {activeTrackObj.steps.map((st, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-zinc-700 bg-white/90 px-3 py-2 rounded-xl border border-zinc-100">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#A31551] shrink-0 mt-0.5" />
                          <span>{lang === "kz" ? st.step_kz : st.step_ru}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-start gap-2 text-[11px] text-[#4A0221] bg-[#FFF5F4] border border-[#FC9385]/60 rounded-xl p-2.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#A31551] shrink-0 mt-0.5" />
                      <span>{lang === "kz" ? activeTrackObj.warning_kz : activeTrackObj.warning_ru}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {/* Step dots */}
                  <div className="flex items-center gap-1.5">
                    {tourSteps.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setTourStep(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          tourStep === idx ? "w-8 bg-[#A31551]" : "w-2 bg-zinc-200 hover:bg-zinc-300"
                        }`}
                        aria-label={`Шаг ${idx + 1}`}
                      />
                    ))}
                    <span className="ml-auto text-[11px] font-bold text-zinc-400">
                      {tourStep + 1} / {tourSteps.length}
                    </span>
                  </div>

                  {/* Active tour slide */}
                  <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-zinc-200 bg-zinc-50/70 space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shrink-0 ${currentTour.color}`}>
                        <TourIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-[#A31551]">
                          {lang === "kz" ? currentTour.badge_kz : currentTour.badge_ru}
                        </span>
                        <h3 className="text-sm sm:text-base font-extrabold text-zinc-950 leading-snug">
                          {lang === "kz" ? currentTour.title_kz : currentTour.title_ru}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                      {lang === "kz" ? currentTour.desc_kz : currentTour.desc_ru}
                    </p>

                    <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                      <Link
                        href={currentTour.href}
                        onClick={closeGuide}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#F99184]/50 text-[#A31551] hover:bg-[#FDF2F7] text-xs font-bold transition-colors"
                      >
                        <span>{lang === "kz" ? currentTour.cta_kz : currentTour.cta_ru}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <div className="flex items-center gap-2 ml-auto">
                        {tourStep > 0 && (
                          <button
                            type="button"
                            onClick={() => setTourStep(tourStep - 1)}
                            className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border border-zinc-200 bg-white text-xs font-semibold text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                          >
                            {lang === "kz" ? "Артқа" : "Назад"}
                          </button>
                        )}
                        {tourStep < tourSteps.length - 1 ? (
                          <button
                            type="button"
                            onClick={() => setTourStep(tourStep + 1)}
                            className="inline-flex items-center gap-1 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#A31551] text-white text-xs font-bold hover:brightness-110 cursor-pointer"
                          >
                            <span>{lang === "kz" ? "Келесі" : "Далее"}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={closeGuide}
                            className="inline-flex items-center gap-1 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#A31551] text-white text-xs font-bold hover:bg-[#820232] cursor-pointer"
                          >
                            <span>{lang === "kz" ? "Түсінікті, бастайық!" : "Всё понятно, поехали!"}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="px-3.5 sm:px-5 py-3 border-t border-zinc-100 bg-zinc-50/80 flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5 shrink-0">
              <button
                type="button"
                onClick={closeGuide}
                className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors py-1 cursor-pointer"
              >
                {lang === "kz" ? "Өткізіп жіберу және сайтты көру" : "Пропустить и смотреть сайт"}
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {tab === "track" && (
                  <button
                    type="button"
                    onClick={() => { setTab("tour"); setTourStep(0); }}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-full border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#A31551]" />
                    <span>{lang === "kz" ? "Сайт туры" : "4-шаговый тур"}</span>
                  </button>
                )}
                <Link
                  href={activeTrackObj.primaryCta.href}
                  onClick={closeGuide}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#A51652] to-[#A31551] hover:brightness-110 text-white text-xs font-bold shadow-md shadow-[#A31551]/20 transition-all text-center"
                >
                  <span>{lang === "kz" ? activeTrackObj.primaryCta.label_kz : activeTrackObj.primaryCta.label_ru}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </CompassGuideContext.Provider>
  );
};
