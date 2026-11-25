"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, ArrowRight, BookOpen, GraduationCap, Award, Sparkles, Briefcase } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { api } from "@/lib/api";
import { SearchResultItem } from "@/lib/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { lang, t } = useI18n();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const res = await api.search(query);
      setResults(Array.isArray(res?.results) ? res.results : []);
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "career":
        return <Briefcase className="w-4 h-4 text-[#A31551]" />;
      case "institution":
        return <GraduationCap className="w-4 h-4 text-[#4A0221]" />;
      case "program":
        return <BookOpen className="w-4 h-4 text-[#A31551]" />;
      case "grant":
        return <Award className="w-4 h-4 text-[#820232]" />;
      case "opportunity":
        return <Sparkles className="w-4 h-4 text-[#B8335F]" />;
      default:
        return <Search className="w-4 h-4 text-[#69758B]" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-3 sm:px-4 bg-zinc-900/50 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl sm:rounded-[2rem] shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[82vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header - Rounded Forte Pill */}
        <div className="p-3 sm:p-5 border-b border-zinc-100 bg-white">
          <div className="relative flex items-center gap-3 px-4 py-3 rounded-full bg-[#F7F6F6] border-2 border-[#EAEBEF] focus-within:border-[#A31551] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#A31551]/15 transition-all shadow-2xs">
            <Search className="w-5 h-5 text-[#A31551] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.hero.searchPlaceholder}
              className="w-full bg-transparent text-sm sm:text-base text-zinc-900 placeholder-zinc-400 border-none outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0"
              style={{ outline: "none", boxShadow: "none" }}
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="w-6 h-6 rounded-full bg-zinc-200 hover:bg-zinc-300 text-zinc-600 flex items-center justify-center text-xs transition-colors shrink-0"
                aria-label={lang === "kz" ? "Тазарту" : "Очистить"}
              >
                ✕
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-xs px-2.5 py-1 rounded-full bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-600 hover:bg-zinc-100 font-semibold shrink-0 shadow-2xs transition-colors"
            >
              ESC
            </button>
          </div>
        </div>

        {/* Results list */}
        <div className="overflow-y-auto p-3 sm:p-4 divide-y divide-zinc-50 custom-scrollbar">
          {loading && (
            <div className="py-10 text-center text-xs text-zinc-400 flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-[#A31551] border-t-transparent animate-spin inline-block" />
              <span>{lang === "kz" ? "Іздеуде..." : "Поиск..."}</span>
            </div>
          )}

          {!loading && query && (results?.length ?? 0) === 0 && (
            <div className="py-12 text-center text-xs text-zinc-500">
              <p className="font-semibold text-zinc-700">{t.common.noResults}</p>
              <p className="mt-1 text-zinc-400">
                {lang === "kz" 
                  ? "Басқа сөз тіркесін қолданып көріңіз немесе төмендегі бөлімдерді қараңыз." 
                  : "Попробуйте изменить запрос или воспользуйтесь разделами каталога."}
              </p>
            </div>
          )}

          {!loading && !query && (
            <div className="p-3 text-xs text-zinc-400 space-y-4">
              <div>
                <span className="font-semibold text-zinc-600">
                  {lang === "kz" ? "Танымал іздеулер:" : "Популярные запросы:"}
                </span>
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {["IT", "AITU", "Медицина", "Грант", "Колледж", "Киберқауіпсіздік"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setQuery(s)}
                      className="px-3.5 py-1.5 rounded-full bg-[#F1F2F3] text-zinc-700 hover:bg-[#FDF2F7] hover:text-[#A31551] hover:border-[#F99184]/40 border border-transparent text-xs font-semibold transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-3 border-t border-zinc-100 flex flex-wrap gap-2">
                <Link
                  href="/booklet"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FDF2F7] text-[#A31551] font-bold hover:bg-[#fbe4ef] border border-[#F99184]/40 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{lang === "kz" ? "Талапкер кітапшасы (6 тарау)" : "Буклет абитуриента (6 глав)"}</span>
                </Link>
                <Link
                  href="/calculator"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-100 text-zinc-700 font-semibold hover:bg-zinc-200 transition-colors"
                >
                  <span>{lang === "kz" ? "ҰБТ Калькуляторы" : "Калькулятор грантов ЕНТ"}</span>
                </Link>
              </div>
            </div>
          )}

          {!loading && (results || []).map((item) => (
            <Link
              key={`${item.type}-${item.id}`}
              href={item.url}
              onClick={onClose}
              className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl hover:bg-[#FDF2F7]/50 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#FDF2F7] text-[#A31551] flex items-center justify-center shrink-0">
                  {getIcon(item.type)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-900 group-hover:text-[#A31551] truncate">
                      {lang === "kz" ? item.title_kz : item.title_ru}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 font-medium text-zinc-600 group-hover:bg-[#FDF2F7] group-hover:text-[#A31551] shrink-0">
                      {item.badge}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 truncate mt-0.5">
                    {lang === "kz" ? item.subtitle_kz : item.subtitle_ru}
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-[#A31551] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
