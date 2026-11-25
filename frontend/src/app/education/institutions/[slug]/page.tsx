"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  ArrowLeft,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Home,
  ShieldCheck,
  Award,
  BookOpen
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { api } from "@/lib/api";
import { Institution } from "@/lib/types";
import { VerificationBadge } from "@/components/common/VerificationBadge";
import { SourceCard } from "@/components/common/SourceCard";
import { ScoreExplainer } from "@/components/common/ScoreExplainer";

export default function InstitutionDetailPage() {
  const { lang, t } = useI18n();
  const params = useParams();
  const slug = params?.slug as string;
  const [inst, setInst] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInst() {
      if (!slug) return;
      setLoading(true);
      const data = await api.getInstitutionBySlug(slug);
      setInst(data);
      setLoading(false);
    }
    loadInst();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-zinc-400">
        {lang === "kz" ? "Оқу орны туралы мәліметтер жүктелуде..." : "Загрузка информации об учебном заведении..."}
      </div>
    );
  }

  if (!inst) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-900">{t.common.noResults}</h2>
        <Link href="/education" className="text-xs font-semibold text-[#A31551] hover:underline">
          ← {lang === "kz" ? "Оқу орындарына қайту" : "Вернуться к списку учебных заведений"}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back button */}
      <Link
        href="/education"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{lang === "kz" ? "Барлық оқу орындары" : "Все учебные заведения"}</span>
      </Link>

      {/* Main Institution Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] text-xs font-semibold border border-[#F99184]/40 capitalize">
            <Building2 className="w-3.5 h-3.5" />
            <span>{inst.institution_type === "college" ? "Колледж" : "Университет"} • Астана</span>
          </div>
          <VerificationBadge status={inst.status} compact />
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          {lang === "kz" ? inst.name_kz : inst.name_ru}
        </h1>

        {/* Essential verified facts grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
            <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-zinc-900 block">{lang === "kz" ? "Мекенжайы" : "Адрес"}</span>
              <span className="text-zinc-600">{lang === "kz" ? inst.address_kz : inst.address_ru}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
            <Phone className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-zinc-900 block">{lang === "kz" ? "Қабылдау комиссиясы байланысы" : "Контакты приемной комиссии"}</span>
              <span className="text-zinc-600">{inst.contact_phone || t.verification.unknownInfo}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dormitory & Campus Information */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="font-bold text-zinc-900 text-base flex items-center gap-2">
          <Home className="w-4 h-4 text-[#A31551]" />
          <span>{lang === "kz" ? "Студенттер үйі және жатақхана" : "Студенческие дома и общежитие"}</span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
          {lang === "kz" ? inst.dormitory_info_kz : inst.dormitory_info_ru}
        </p>
      </div>

      {/* Admission Thresholds & Explainer */}
      <ScoreExplainer
        untThreshold={inst.institution_type === "university" ? 65 : 50}
        instThreshold={inst.slug === "astana-it-university" ? 65 : 65}
        historicalCutoff={inst.slug === "astana-it-university" ? 104 : undefined}
        academicYear="2024–2025"
      />

      {/* Offered Programs */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="font-bold text-zinc-900 text-base flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#A31551]" />
          <span>{lang === "kz" ? "Қолжетімді білім беру бағдарламалары" : "Доступные образовательные программы"}</span>
        </h2>

        {inst.offered_programs_summary && inst.offered_programs_summary.length > 0 ? (
          <div className="divide-y divide-zinc-100">
            {inst.offered_programs_summary.map((prog, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                <span className="font-medium text-zinc-800">{prog}</span>
                <span className="text-xs font-semibold text-[#A31551] hover:text-[#4A0221]">
                  {lang === "kz" ? "Толық талаптар" : "Требования"} →
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-zinc-400 italic">
            {t.verification.unknownInfo}
          </div>
        )}
      </div>

      {/* Official Actions */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#270111] via-[#4A0221] to-[#1D1D1D] border border-[#A31551]/30 text-white flex flex-wrap items-center justify-between gap-4 shadow-forte">
        <div>
          <div className="text-sm font-bold">{lang === "kz" ? "Құжат тапсыру" : "Подача документов"}</div>
          <p className="text-xs text-zinc-300 mt-0.5">
            {lang === "kz" ? "Барлық өтінімдер тікелей оқу орнының порталы арқылы қабылданады." : "Заявления принимаются непосредственно через сайт образовательного учреждения."}
          </p>
        </div>
        <a
          href={inst.official_website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F99184] via-[#B8335F] to-[#A51652] hover:opacity-95 text-white text-xs font-bold shadow-forte transition-all"
        >
          <span>{t.verification.officialPortal}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Source Citation */}
      {inst.source && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            {t.verification.source}
          </h3>
          <SourceCard source={inst.source} />
        </div>
      )}
    </div>
  );
}
