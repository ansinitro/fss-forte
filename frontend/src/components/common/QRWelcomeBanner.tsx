"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, X, BookOpen, ArrowRight, Compass } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useCompassGuide } from "@/components/onboarding/StudentCompassTour";

export const QRWelcomeBanner: React.FC = () => {
  const { lang } = useI18n();
  const { openGuide } = useCompassGuide();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const isFromQR = params.get("src") === "qr" || params.get("qr") === "1" || params.get("from") === "booklet";
    const dismissed = sessionStorage.getItem("fc_qr_dismissed");

    if (isFromQR && !dismissed) {
      setVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem("fc_qr_dismissed", "1");
    } catch {
      // ignore
    }
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="QR Welcome Banner"
      className="max-w-6xl mx-auto px-4 sm:px-6 pt-3 pb-1 print:hidden animate-fade-in"
    >
      <div className="relative p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#270111] via-[#4A0221] to-[#1D1D1D] text-white shadow-forte border border-[#FC9385]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#FC9385]/20 text-[#FC9385] border border-[#FC9385]/30 flex items-center justify-center shrink-0 mt-0.5">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#FC9385]">
              <Sparkles className="w-3 h-3" />
              <span>{lang === "kz" ? "Қағаз буклеттегі QR сканерленді" : "Переход по QR-коду из буклета"}</span>
            </div>
            <h4 className="text-sm font-extrabold text-white">
              {lang === "kz"
                ? "Қош келдің! Мұнда буклеттің барлық 6 тарауы, ҰБТ калькуляторы және ЖОО каталогы бар."
                : "Добро пожаловать! Здесь доступны все 6 глав буклета, калькулятор ЕНТ и полная база вузов."}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pl-12 sm:pl-0">
          <button
            type="button"
            onClick={() => {
              openGuide("tour");
              handleDismiss();
            }}
            className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
          >
            {lang === "kz" ? "Турді бастау" : "Гид за 1 мин"}
          </button>
          <Link
            href="/booklet"
            onClick={handleDismiss}
            className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#F99184] via-[#B8335F] to-[#A51652] hover:opacity-95 text-white text-xs font-extrabold shadow-sm transition-all"
          >
            <span>{lang === "kz" ? "Буклетке өту" : "В буклет"}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <button
            type="button"
            onClick={handleDismiss}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
            aria-label="Жабу"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
