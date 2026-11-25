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
        return <Briefcase className="w-4 h-4 text-purple-600" />;
      case "institution":
        return <GraduationCap className="w-4 h-4 text-blue-600" />;
      case "program":
        return <BookOpen className="w-4 h-4 text-emerald-600" />;
      case "grant":
        return <Award className="w-4 h-4 text-amber-600" />;
      case "opportunity":
        return <Sparkles className="w-4 h-4 text-rose-600" />;
      default:
        return <Search className="w-4 h-4 text-zinc-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-zinc-900/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-zinc-100 gap-3">
          <Search className="w-5 h-5 text-[#A31551] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.hero.searchPlaceholder}
            className="w-full bg-transparent text-sm sm:text-base text-zinc-900 placeholder-zinc-400 focus:outline-hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="w-6 h-6 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 flex items-center justify-center text-xs transition-colors shrink-0"
            >
              ✕
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs px-2.5 py-1 rounded-full border border-zinc-200 text-zinc-500 hover:bg-zinc-50 font-medium shrink-0"
          >
            ESC
          </button>
        </div>

        {/* Results list */}
        <div className="overflow-y-auto p-2 divide-y divide-zinc-50">
          {loading && (
            <div className="py-8 text-center text-xs text-zinc-400">
              {lang === "kz" ? "Іздеуде..." : "Поиск..."}
            </div>
          )}

          {!loading && query && (results?.length ?? 0) === 0 && (
            <div className="py-12 text-center text-xs text-zinc-500">
              {t.common.noResults}
            </div>
          )}

          {!loading && !query && (
            <div className="p-4 text-xs text-zinc-400">
              <span className="font-medium text-zinc-500">{lang === "kz" ? "Танымал іздеулер:" : "Популярные запросы:"}</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {["IT", "AITU", "Медицина", "Грант", "Колледж", "Киберқауіпсіздік"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading && (results || []).map((item) => (
            <Link
              key={`${item.type}-${item.id}`}
              href={item.url}
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                  {getIcon(item.type)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-900 group-hover:text-[#A31551] truncate">
                      {lang === "kz" ? item.title_kz : item.title_ru}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-medium shrink-0">
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
