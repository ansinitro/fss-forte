"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Calculator, Building2, GraduationCap, Compass } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export const MobileBottomNav: React.FC = () => {
  const { lang } = useI18n();
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: lang === "kz" ? "Басты бет" : "Главная",
      icon: Home,
      exact: true,
      hasBadge: false,
    },
    {
      href: "/booklet",
      label: lang === "kz" ? "Буклет" : "Буклет",
      icon: BookOpen,
      exact: false,
      hasBadge: true,
      badgeText: "QR",
    },
    {
      href: "/calculator",
      label: lang === "kz" ? "Шанстар" : "Калькулятор",
      icon: Calculator,
      exact: false,
      hasBadge: false,
    },
    {
      href: "/universities",
      label: lang === "kz" ? "ЖОО-лар" : "Вузы",
      icon: Building2,
      exact: false,
      hasBadge: false,
    },
    {
      href: "/colleges",
      label: lang === "kz" ? "Колледж" : "Колледжи",
      icon: GraduationCap,
      exact: false,
      hasBadge: false,
    },
  ];

  const isItemActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <nav
      aria-label="Мобильді навигация"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-zinc-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] print:hidden transition-transform"
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom, 0px), 6px)",
      }}
    >
      <div className="grid grid-cols-5 h-14 max-w-md mx-auto items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center h-full py-1 rounded-xl transition-all select-none active:scale-95 ${
                active
                  ? "text-[#A31551]"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              <div className="relative flex items-center justify-center">
                <div
                  className={`w-9 h-7 rounded-full flex items-center justify-center transition-all ${
                    active ? "bg-[#FDF2F7]" : "bg-transparent"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-transform ${
                      active ? "stroke-[2.4] scale-110" : "stroke-[1.8]"
                    }`}
                  />
                </div>

                {item.hasBadge && (
                  <span className="absolute -top-0.5 -right-1 flex h-3 px-1 items-center justify-center rounded-full bg-[#A31551] text-[8px] font-black text-white shadow-2xs">
                    {item.badgeText}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] leading-tight tracking-tight mt-0.5 truncate max-w-[62px] text-center ${
                  active ? "font-bold text-[#A31551]" : "font-medium text-zinc-600"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
