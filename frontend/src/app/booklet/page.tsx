"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Calculator, GraduationCap, Compass } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { InteractiveBooklet } from "@/components/booklet/InteractiveBooklet";
import { useCompassGuide } from "@/components/onboarding/StudentCompassTour";

export default function BookletPage() {
  const { lang } = useI18n();
  const { openGuide } = useCompassGuide();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumb + Quick Tour Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
          <Link href="/" className="hover:text-zinc-900 transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{lang === "kz" ? "Басты бет" : "Главная"}</span>
          </Link>
          <span>/</span>
          <span className="text-[#A31551] font-bold">
            {lang === "kz" ? "Абитуриент кітапшасы" : "Буклет абитуриента"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => openGuide("tour")}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FDF2F7] text-[#A31551] border border-[#F99184]/40 hover:bg-[#A31551] hover:text-white text-xs font-bold transition-colors"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>{lang === "kz" ? "Платформа бойынша тур (4 қадам)" : "Показать гид по сайту"}</span>
        </button>
      </div>

      {/* Main Interactive Booklet */}
      <InteractiveBooklet compact={false} />

      {/* Next Step Deep Tools Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:hidden">
        <Link
          href="/calculator"
          className="p-5 rounded-3xl border border-zinc-200 bg-white hover:border-[#A31551]/40 card-hover flex items-center gap-4 group"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#FDF2F7] text-[#A31551] flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-zinc-950 group-hover:text-[#A31551]">
              {lang === "kz" ? "ҰБТ Калькуляторы" : "Калькулятор грантов ЕНТ"}
            </div>
            <div className="text-xs text-zinc-500">
              {lang === "kz" ? "131 ГОП және 218 мамандық" : "Сравни баллы с 131 ГОП и 218 ОП"}
            </div>
          </div>
        </Link>

        <Link
          href="/colleges"
          className="p-5 rounded-3xl border border-zinc-200 bg-white hover:border-emerald-400 card-hover flex items-center gap-4 group"
        >
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-zinc-950 group-hover:text-emerald-700">
              {lang === "kz" ? "Колледждер (688)" : "Колледжи без ЕНТ (688)"}
            </div>
            <div className="text-xs text-zinc-500">
              {lang === "kz" ? "Астана 32 + 19 өңір" : "32 в Астане + 19 регионов РК"}
            </div>
          </div>
        </Link>

        <Link
          href="/guides"
          className="p-5 rounded-3xl border border-zinc-200 bg-white hover:border-blue-400 card-hover flex items-center gap-4 group"
        >
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-zinc-950 group-hover:text-blue-700">
              {lang === "kz" ? "Толық білім базасы" : "Все 30+ подробных гайдов"}
            </div>
            <div className="text-xs text-zinc-500">
              {lang === "kz" ? "AIT-2027, шәкіртақы, ережелер" : "AIT-2027, стипендии, правила"}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
