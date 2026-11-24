"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Compass, Menu, X, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { GlobalSearchModal } from "../search/GlobalSearchModal";

export const Header: React.FC = () => {
  const { lang, t } = useI18n();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exactly four main navigation sections per Section 2 requirements
  const navItems = [
    { href: "/careers", label: t.nav.careers },
    { href: "/education", label: t.nav.education },
    { href: "/grants", label: t.nav.grants },
    { href: "/opportunities", label: t.nav.opportunities },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
              <Compass className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-zinc-900 text-sm tracking-tight leading-none">
                {t.brand.name}
              </span>
              <span className="text-[10px] text-zinc-500 font-medium leading-tight mt-0.5">
                Астана
              </span>
            </div>
          </Link>

          {/* Desktop 4 Main Navigation Items */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    active
                      ? "bg-zinc-100 text-zinc-900 font-semibold"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions: Search Button & Language Switcher */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-xs text-zinc-500 font-medium transition-colors"
              aria-label="Іздеу"
            >
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">{t.nav.search}</span>
              <kbd className="hidden sm:inline text-[10px] px-1 py-0.5 rounded bg-zinc-200/60 text-zinc-500">⌘K</kbd>
            </button>

            <LanguageSwitcher />

            {/* Mobile menu hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 md:hidden text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-100"
              aria-label="Мәзірді ашу"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-zinc-200 bg-white px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive(item.href)
                    ? "bg-zinc-100 text-zinc-900 font-semibold"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-zinc-100 mt-2">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-800"
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
