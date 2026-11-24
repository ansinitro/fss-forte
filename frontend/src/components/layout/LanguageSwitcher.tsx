"use client";

import React from "react";
import { useI18n, Language } from "@/lib/i18n/context";

export const LanguageSwitcher: React.FC = () => {
  const { lang, setLang } = useI18n();

  return (
    <div className="flex items-center rounded-lg border border-zinc-200 bg-white p-0.5 text-xs font-semibold shadow-xs">
      <button
        type="button"
        onClick={() => setLang("kz")}
        className={`px-2.5 py-1 rounded-md transition-all ${
          lang === "kz"
            ? "bg-[#A31551] text-white shadow-forte font-bold"
            : "text-zinc-600 hover:text-zinc-900"
        }`}
        aria-label="Қазақ тіліне ауысу"
      >
        ҚАЗ
      </button>
      <button
        type="button"
        onClick={() => setLang("ru")}
        className={`px-2.5 py-1 rounded-md transition-all ${
          lang === "ru"
            ? "bg-[#A31551] text-white shadow-forte font-bold"
            : "text-zinc-600 hover:text-zinc-900"
        }`}
        aria-label="Переключить на русский язык"
      >
        РУС
      </button>
    </div>
  );
};
