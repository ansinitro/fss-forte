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
      setGrants(data);
      setLoading(false);
    }
    loadGrants();
  }, [selectedType]);

  const filteredGrants = grants.filter((g) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = lang === "kz" ? g.title_kz : g.title_ru;
    const prov = lang === "kz" ? g.provider_kz : g.provider_ru;
    return title.toLowerCase().includes(q) || prov.toLowerCase().includes(q);
  });

  const getGrantTypeBadge = (type: string) => {
    switch (type) {
      case "akimat_astana":
        return { label_kz: "Астана әкімінің гранты", label_ru: "Грант акима Астаны", color: "bg-blue-50 text-blue-700 border-blue-200/60" };
      case "national":
        return { label_kz: "Мемлекеттік грант", label_ru: "Государственный грант", color: "bg-emerald-50 text-emerald-700 border-emerald-200/60" };
      case "rector":
        return { label_kz: "Ректорлық жеңілдік", label_ru: "Ректорский грант", color: "bg-purple-50 text-purple-700 border-purple-200/60" };
      case "charitable":
        return { label_kz: "Қоғамдық қор гранты", label_ru: "Грант фонда", color: "bg-amber-50 text-amber-700 border-amber-200/60" };
      default:
        return { label_kz: "Грант", label_ru: "Грант", color: "bg-zinc-100 text-zinc-700 border-zinc-200" };
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200/60">
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === "kz" ? "Грант немесе ұйым атауы бойынша іздеу..." : "Поиск по названию гранта или организации..."}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:border-zinc-400"
          />
        </div>

        {/* Grant type filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedType("")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedType === ""
                ? "bg-zinc-900 text-white"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            {t.common.all}
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("national")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedType === "national"
                ? "bg-zinc-900 text-white"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            {lang === "kz" ? "Мемлекеттік" : "Государственные"}
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("akimat_astana")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedType === "akimat_astana"
                ? "bg-zinc-900 text-white"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            {lang === "kz" ? "Астана әкімі" : "Акимат Астаны"}
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("charitable")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedType === "charitable"
                ? "bg-zinc-900 text-white"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            {lang === "kz" ? "Қорлар ('Қазақстан халқына')" : "Фонды ('Қазақстан халқына')"}
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("rector")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedType === "rector"
                ? "bg-zinc-900 text-white"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            {lang === "kz" ? "Ректорлық жеңілдіктер" : "Ректорские скидки"}
          </button>
        </div>
      </div>

      {/* Grants Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-zinc-400">
          {lang === "kz" ? "Гранттар жүктелуде..." : "Загрузка грантов..."}
        </div>
      ) : filteredGrants.length === 0 ? (
        <div className="py-16 text-center text-xs text-zinc-500 bg-white rounded-2xl border border-zinc-200">
          {t.common.noResults}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredGrants.map((grant) => {
            const badge = getGrantTypeBadge(grant.grant_type);
            return (
              <div
                key={grant.id}
                className="p-6 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 card-hover shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${badge.color}`}>
                      {lang === "kz" ? badge.label_kz : badge.label_ru}
                    </span>
                    <VerificationBadge status={grant.status} compact />
                  </div>

                  <Link href={`/grants/${grant.slug}`} className="block group">
                    <h3 className="font-bold text-zinc-900 text-lg group-hover:text-amber-600 transition-colors leading-snug">
                      {lang === "kz" ? grant.title_kz : grant.title_ru}
                    </h3>
                  </Link>

                  <div className="text-xs text-zinc-500 font-medium">
                    {lang === "kz" ? grant.provider_kz : grant.provider_ru}
                  </div>

                  {/* Financial Coverage Details */}
                  <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-xs text-amber-950 font-medium">
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
                    className="font-semibold text-amber-600 hover:text-amber-800 flex items-center gap-1"
                  >
                    <span>{t.common.explore}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
