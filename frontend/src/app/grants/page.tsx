"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Award,
  Search,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Clock
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { api } from "@/lib/api";
import { Grant } from "@/lib/types";
import { VerificationBadge } from "@/components/common/VerificationBadge";
import { ScrollablePillBar } from "@/components/common/ScrollablePillBar";

export default function GrantsPage() {
  const { lang, t } = useI18n();
  const [grants, setGrants] = useState<Grant[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGrants() {
      setLoading(true);
      const data = await api.getGrants(selectedType || undefined);
      setGrants(Array.isArray(data) ? data : []);
      setLoading(false);
    }
    loadGrants();
  }, [selectedType]);

  const filteredGrants = (grants || []).filter((g) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = lang === "kz" ? g.title_kz : g.title_ru;
    const prov = lang === "kz" ? g.provider_kz : g.provider_ru;
    return title.toLowerCase().includes(q) || prov.toLowerCase().includes(q);
  });

  const getGrantTypeBadge = (type: string) => {
    switch (type) {
      case "akimat_astana":
        return { label_kz: "Астана әкімінің гранты", label_ru: "Грант акима Астаны", color: "bg-[#FDF2F7] text-[#A31551] border-[#EAEBEF]" };
      case "national":
        return { label_kz: "Мемлекеттік грант", label_ru: "Государственный грант", color: "bg-[#FDF2F7] text-[#A31551] border-[#FC9385]/50" };
      case "rector":
        return { label_kz: "Ректорлық жеңілдік", label_ru: "Ректорский грант", color: "bg-[#FBE4EF]/70 text-[#4A0221] border-[#FC9385]/40" };
      case "charitable":
        return { label_kz: "Қоғамдық қор гранты", label_ru: "Грант фонда", color: "bg-[#FFF5F4] text-[#820232] border-[#FC9385]/60" };
      default:
        return { label_kz: "Грант", label_ru: "Грант", color: "bg-zinc-100 text-zinc-700 border-zinc-200" };
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] text-xs font-semibold border border-[#F99184]/40">
          <Award className="w-3.5 h-3.5" />
          <span>3-бөлім / Раздел 3</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          {t.sections.grantsTitle}
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base max-w-2xl leading-relaxed">
          {t.sections.grantsDesc}
        </p>
      </div>

      {/* StudentHub ENT Calculator Promotion Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#270111] via-[#4A0221] to-[#1D1D1D] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-forte border border-[#A31551]/30">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#A31551]/40 text-[#F99184] text-[11px] font-bold border border-[#F99184]/30">
            <span>ҰБТ 2026/2027</span>
          </div>
          <h3 className="font-bold text-lg sm:text-xl text-white">
            {lang === "kz" ? "ҰБТ Грант Калькуляторы және 218 мамандықтың шекті балдары" : "Калькулятор грантов ЕНТ и проходные баллы по 218 специальностям"}
          </h3>
          <p className="text-xs text-zinc-300 max-w-xl leading-relaxed">
            {lang === "kz"
              ? "StudentHub статистикасы бойынша баллыңызды енгізіп, мемлекеттік грантқа түсу мүмкіндігіңізді тексеріңіз."
              : "Введите свои баллы и проверьте шансы на грант по статистике StudentHub."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Link
            href="/calculator"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#F99184] via-[#B8335F] to-[#A51652] hover:opacity-95 text-white font-bold text-xs shadow-forte transition-all"
          >
            {lang === "kz" ? "Калькуляторды ашу →" : "Открыть калькулятор →"}
          </Link>
          <Link
            href="/guides"
            className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all"
          >
            {lang === "kz" ? "Білім базасы (30+ гайд)" : "База знаний (30+ гайдов)"}
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === "kz" ? "Грант немесе ұйым атауы бойынша іздеу..." : "Поиск по названию гранта или организации..."}
            className="w-full pl-11 pr-11 py-3 rounded-full border border-zinc-200 bg-white text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#A31551] focus:ring-2 focus:ring-[#A31551]/20 shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 flex items-center justify-center text-xs transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Grant type filter pills */}
        <ScrollablePillBar bgGradientColor="white" showIndicator={true}>
          <button
            type="button"
            onClick={() => setSelectedType("")}
            className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${selectedType === ""
                ? "bg-[#A31551] text-white shadow-forte"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              }`}
          >
            {t.common.all}
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("national")}
            className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${selectedType === "national"
                ? "bg-[#A31551] text-white shadow-forte"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              }`}
          >
            {lang === "kz" ? "Мемлекеттік" : "Государственные"}
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("akimat_astana")}
            className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${selectedType === "akimat_astana"
                ? "bg-[#A31551] text-white shadow-forte"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              }`}
          >
            {lang === "kz" ? "Астана әкімі" : "Акимат Астаны"}
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("charitable")}
            className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${selectedType === "charitable"
                ? "bg-[#A31551] text-white shadow-forte"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              }`}
          >
            {lang === "kz" ? "Қорлар ('Қазақстан халқына')" : "Фонды ('Қазақстан халқына')"}
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("rector")}
            className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${selectedType === "rector"
                ? "bg-[#A31551] text-white shadow-forte"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              }`}
          >
            {lang === "kz" ? "Ректорлық жеңілдіктер" : "Ректорские скидки"}
          </button>
        </ScrollablePillBar>
      </div>

      {/* Grants Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-zinc-400">
          {lang === "kz" ? "Гранттар жүктелуде..." : "Загрузка грантов..."}
        </div>
      ) : filteredGrants.length === 0 ? (
        <div className="py-16 text-center text-xs text-zinc-500 bg-white rounded-3xl border border-zinc-200">
          {t.common.noResults}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredGrants.map((grant) => {
            const badge = getGrantTypeBadge(grant.grant_type);
            return (
              <div
                key={grant.id}
                className="p-6 rounded-3xl border border-zinc-200 bg-white hover:border-[#F99184]/50 card-hover shadow-xs hover:shadow-forte flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${badge.color}`}>
                      {lang === "kz" ? badge.label_kz : badge.label_ru}
                    </span>
                    <VerificationBadge status={grant.status} compact />
                  </div>

                  <Link href={`/grants/${grant.slug}`} className="block group">
                    <h3 className="font-bold text-zinc-900 text-lg group-hover:text-[#A31551] transition-colors leading-snug">
                      {lang === "kz" ? grant.title_kz : grant.title_ru}
                    </h3>
                  </Link>

                  <div className="text-xs text-zinc-500 font-medium">
                    {lang === "kz" ? grant.provider_kz : grant.provider_ru}
                  </div>

                  {/* Financial Coverage Details */}
                  <div className="p-3 rounded-xl bg-[#FDF2F7]/70 border border-[#F99184]/30 text-xs text-[#4A0221] font-medium">
                    {lang === "kz" ? grant.coverage_details_kz : grant.coverage_details_ru}
                  </div>

                  {/* Deadlines preview if confirmed */}
                  {grant.deadlines && grant.deadlines.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>
                        {t.common.deadline}: <strong className="text-zinc-800">{grant.deadlines[0].end_date}</strong>
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-zinc-400">
                    {grant.academic_year} {t.verification.academicCycle}
                  </span>

                  <Link
                    href={`/grants/${grant.slug}`}
                    className="font-semibold text-[#A31551] hover:text-[#820232] flex items-center gap-1 group"
                  >
                    <span>{t.common.explore}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
