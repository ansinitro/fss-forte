"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ExternalLink, Terminal, Heart } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { ForteLogo } from "./ForteLogo";

export const Footer: React.FC = () => {
  const { lang, t } = useI18n();

  return (
    <footer className="border-t border-zinc-200 bg-white text-zinc-500 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <ForteLogo size="sm" subtitle={t.brand.tagline} />
            <p className="text-zinc-500 leading-relaxed text-[11px] pt-1">
              {lang === "kz" 
                ? "Астана мектеп оқушылары мен талапкерлеріне арналған білім және мүмкіндіктер ашу платформасы."
                : "Платформа осознанного выбора профессии, образования и грантов для школьников и абитуриентов Астаны."}
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.verification.verified}</span>
            </div>
          </div>

          {/* Navigation sections */}
          <div>
            <h4 className="font-bold text-zinc-900 mb-3 text-xs tracking-wider uppercase">
              {lang === "kz" ? "Бөлімдер" : "Разделы"}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/careers" className="hover:text-[#A31551] transition-colors">
                  {t.nav.careers}
                </Link>
              </li>
              <li>
                <Link href="/education" className="hover:text-[#A31551] transition-colors">
                  {t.nav.education}
                </Link>
              </li>
              <li>
                <Link href="/grants" className="hover:text-[#A31551] transition-colors">
                  {t.nav.grants}
                </Link>
              </li>
              <li>
                <Link href="/opportunities" className="hover:text-[#A31551] transition-colors">
                  {t.nav.opportunities}
                </Link>
              </li>
              <li className="pt-2 border-t border-zinc-100">
                <Link href="/endpoints" className="text-[#A31551] hover:text-[#820232] font-bold flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-[#A31551]" />
                  <span>{lang === "kz" ? "Ашық API & Эндпоинттер" : "Открытый API и эндпоинты"}</span>
                </Link>
              </li>
              <li>
                <Link href="/sources" className="hover:text-[#A31551] transition-colors">
                  {lang === "kz" ? "Дереккөздер реестрі" : "Реестр источников"}
                </Link>
              </li>
              <li>
                <Link href="/deadlines" className="hover:text-[#A31551] transition-colors">
                  {lang === "kz" ? "Мерзімдер күнтізбесі" : "Календарь дедлайнов"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Resources */}
          <div>
            <h4 className="font-bold text-zinc-900 mb-3 text-xs tracking-wider uppercase">
              {lang === "kz" ? "Ресми ресурстар" : "Официальные ресурсы"}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://forte.kz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#A31551] font-semibold text-[#A31551] transition-colors"
                >
                  <span>Forte.kz</span>
                  <ExternalLink className="w-3 h-3 text-[#A31551]" />
                </a>
              </li>
              <li>
                <a
                  href="https://testcenter.kz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-zinc-900 transition-colors"
                >
                  <span>testcenter.kz (ҰТО)</span>
                  <ExternalLink className="w-3 h-3 text-zinc-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.gov.kz/memleket/entities/astana-bilim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-zinc-900 transition-colors"
                >
                  <span>astana-bilim.kz</span>
                  <ExternalLink className="w-3 h-3 text-zinc-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://epvo.kz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-zinc-900 transition-colors"
                >
                  <span>epvo.kz (ЕПВО)</span>
                  <ExternalLink className="w-3 h-3 text-zinc-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://studenthub.kz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-zinc-900 transition-colors"
                >
                  <span>StudentHub.kz</span>
                  <ExternalLink className="w-3 h-3 text-zinc-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Editorial policy */}
          <div>
            <h4 className="font-bold text-zinc-900 mb-3 text-xs tracking-wider uppercase">
              {lang === "kz" ? "Ақпараттық саясат" : "Редакционная политика"}
            </h4>
            <p className="text-zinc-500 leading-relaxed text-[11px]">
              {lang === "kz"
                ? "Барлық мәліметтер ресми заңнамалық актілер мен мемлекеттік органдардың бұйрықтары негізінде тексеріледі. Тексерілмеген ақпарат жарияланбайды."
                : "Все данные верифицируются на основе нормативных правовых актов и официальных источников. Неподтвержденные сведения не публикуются."}
            </p>
            <div className="mt-3">
              <Link href="/admin" className="text-zinc-400 hover:text-zinc-600 transition-colors text-[11px]">
                {t.nav.admin}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-200 flex flex-wrap items-center justify-between text-[11px] text-zinc-400 gap-4">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Forte Education • Болашағыңды таңда.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-zinc-600">{t.hero.lessInfoBetterDecisions}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
