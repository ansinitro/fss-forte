"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, ShieldCheck, Terminal, FileText, Calendar, BookOpen, Compass } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useCompassGuide } from "@/components/onboarding/StudentCompassTour";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { GlobalSearchModal } from "../search/GlobalSearchModal";
import { ForteLogo } from "./ForteLogo";

export const Header: React.FC = () => {
  const { lang, t } = useI18n();
  const { openGuide } = useCompassGuide();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/booklet", label: lang === "kz" ? "Кітапша" : "Буклет", isBooklet: true },
    { href: "/careers", label: t.nav.careers, isBooklet: false },
    { href: "/education", label: t.nav.education, isBooklet: false },
    { href: "/grants", label: t.nav.grants, isBooklet: false },
    { href: "/opportunities", label: t.nav.opportunities, isBooklet: false },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/95 backdrop-blur-md print:hidden">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
          {/* Forte Logo & Brand */}
          <Link href="/" className="shrink-0 group">
            <ForteLogo
              size="md"
              subtitle={lang === "kz" ? "Астана • Оқушылар компасы" : "Астана • Компас для школьников"}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all inline-flex items-center gap-1.5 ${
                    active
                      ? "bg-[#FDF2F7] text-[#A31551] font-bold shadow-2xs"
                      : item.isBooklet
                        ? "bg-[#FDF2F7]/60 text-[#A31551] hover:bg-[#FDF2F7] font-bold border border-[#F99184]/35"
                        : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
                  }`}
                >
                  {item.isBooklet && <BookOpen className="w-3.5 h-3.5 shrink-0" />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right actions: First-Time Guide, Search Button & Language Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => openGuide("tour")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#F99184]/50 bg-[#FDF2F7] hover:bg-[#A31551] hover:text-white text-xs text-[#A31551] font-bold transition-all shadow-2xs"
              title={lang === "kz" ? "Сайтты қалай қолдануға болады" : "Гид для тех, кто впервые здесь"}
            >
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === "kz" ? "Гид" : "Гид"}</span>
            </button>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-center sm:justify-start gap-2 w-8 h-8 sm:w-auto sm:px-3.5 sm:py-1.5 rounded-full border border-zinc-200 bg-zinc-50 hover:border-[#A31551]/30 hover:bg-white text-xs text-zinc-500 font-medium transition-all shadow-2xs"
              aria-label={t.nav.search}
            >
              <Search className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="hidden sm:inline">{t.nav.search}</span>
              <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-200/70 text-zinc-600 font-semibold">⌘K</kbd>
            </button>

            <LanguageSwitcher />

            {/* Mobile menu hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-8 h-8 flex items-center justify-center lg:hidden text-zinc-600 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors border border-zinc-200 sm:border-0"
              aria-label="Мәзірді ашу"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-zinc-200 bg-white px-3 sm:px-4 py-3 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openGuide("tour");
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-[#270111] via-[#4A0221] to-[#820232] text-white font-bold text-xs shadow-xs mb-2 text-left"
            >
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#F99184]" />
                <span>{lang === "kz" ? "Платформа бойынша тур (1 мин)" : "Гид по платформе (1 мин)"}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-[#FC9385]">
                {lang === "kz" ? "Бастау" : "Старт"} →
              </span>
            </button>

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${isActive(item.href)
                  ? "bg-[#FDF2F7] text-[#A31551]"
                  : "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50"
                  }`}
              >
                {item.isBooklet && <BookOpen className="w-3.5 h-3.5 text-[#A31551]" />}
                <span>{item.label}</span>
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openGuide("track");
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#A31551] bg-[#FDF2F7]/70 text-left"
            >
              <Compass className="w-4 h-4 text-[#A31551]" />
              <span>{lang === "kz" ? "Алғаш рет кірдің бе? Жоспар таңда" : "Впервые здесь? Выбрать свой план"}</span>
            </button>
            <div className="pt-2 border-t border-zinc-100 mt-2 space-y-1">
              <Link
                href="/guides"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-zinc-800 hover:bg-zinc-50"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#A31551]" />
                <span>{lang === "kz" ? "Білім базасы (30+ гайд)" : "База знаний (30+ гайдов)"}</span>
              </Link>
              <Link
                href="/endpoints"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#A31551] bg-[#FDF2F7]"
              >
                <Terminal className="w-3.5 h-3.5 text-[#A31551]" />
                <span>{lang === "kz" ? "Сервистер мен деректер" : "Каталог сервисов и данных"}</span>
              </Link>
              <Link
                href="/sources"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50"
              >
                <FileText className="w-3.5 h-3.5 text-zinc-500" />
                <span>{lang === "kz" ? "Дереккөздер каталогы" : "Источники данных"}</span>
              </Link>
              <Link
                href="/deadlines"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50"
              >
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <span>{lang === "kz" ? "Мерзімдер күнтізбесі" : "Календарь дедлайнов"}</span>
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:text-zinc-800"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {t.nav.admin}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Dialog */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
