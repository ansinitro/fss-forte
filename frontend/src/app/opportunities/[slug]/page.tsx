"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Users, 
  Award 
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { api } from "@/lib/api";
import { Opportunity } from "@/lib/types";
import { VerificationBadge } from "@/components/common/VerificationBadge";
import { SourceCard } from "@/components/common/SourceCard";

export default function OpportunityDetailPage() {
  const { lang, t } = useI18n();
  const params = useParams();
  const slug = params?.slug as string;
  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOpp() {
      if (!slug) return;
      setLoading(true);
      const data = await api.getOpportunityBySlug(slug);
      setOpp(data);
      setLoading(false);
    }
    loadOpp();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-zinc-400">
        {lang === "kz" ? "Мүмкіндік мәліметтері жүктелуде..." : "Загрузка информации о программе..."}
      </div>
    );
  }

  if (!opp) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-900">{t.common.noResults}</h2>
        <Link href="/opportunities" className="text-xs font-semibold text-blue-600 hover:underline">
          ← {lang === "kz" ? "Мүмкіндіктер тізіміне қайту" : "Вернуться к списку программ"}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back button */}
      <Link
        href="/opportunities"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{lang === "kz" ? "Барлық мүмкіндіктер" : "Все возможности"}</span>
      </Link>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200/60">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{opp.cost_type === "free" ? (lang === "kz" ? "Тегін қатысу" : "Бесплатное участие") : "Стипендия қарастырылған"}</span>
          </div>
          <VerificationBadge status={opp.status} compact />
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          {lang === "kz" ? opp.title_kz : opp.title_ru}
        </h1>

        <div className="text-sm text-zinc-600 font-medium">
          {lang === "kz" ? "Ұйымдастырушы:" : "Организатор:"}{" "}
          <strong className="text-zinc-900">{lang === "kz" ? opp.provider_kz : opp.provider_ru}</strong>
        </div>
      </div>

      {/* Description */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-3">
        <h2 className="font-bold text-zinc-900 text-base">
          {lang === "kz" ? "Бағдарлама туралы:" : "О программе:"}
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
          {lang === "kz" ? opp.description_kz : opp.description_ru}
        </p>
      </div>

      {/* Target Audience & Restrictions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-2">
          <div className="flex items-center gap-2 text-zinc-900 font-bold text-xs uppercase tracking-wider">
            <Users className="w-4 h-4 text-blue-600" />
            <span>{lang === "kz" ? "Кімдер қатыса алады?" : "Целевая аудитория"}</span>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">
            {lang === "kz" ? opp.target_audience_kz : opp.target_audience_ru}
          </p>
          {opp.age_grade_restrictions && (
            <div className="text-[11px] font-semibold text-zinc-500 pt-1">
              {lang === "kz" ? "Жас/сынып шектеуі: " : "Ограничение по возрасту/классу: "}
              <span className="text-zinc-900">{opp.age_grade_restrictions}</span>
            </div>
          )}
        </div>

        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-2">
          <div className="flex items-center gap-2 text-zinc-900 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4 text-amber-600" />
            <span>{lang === "kz" ? "Қатысушы не алады?" : "Что дает участие?"}</span>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">
            {lang === "kz" ? opp.benefits_kz : opp.benefits_ru}
          </p>
          {opp.duration_kz && (
            <div className="text-[11px] font-semibold text-zinc-500 pt-1">
              {lang === "kz" ? "Ұзақтығы: " : "Продолжительность: "}
              <span className="text-zinc-900">{lang === "kz" ? opp.duration_kz : opp.duration_ru}</span>
            </div>
          )}
        </div>
      </div>

      {/* Official Registration Action */}
      {opp.application_url && (
        <div className="p-4 rounded-2xl bg-zinc-900 text-white flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-sm font-bold">{lang === "kz" ? "Ресми тіркелу және өтініш беру" : "Официальная регистрация"}</div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {lang === "kz" ? "Тіркелу ұйымдастырушының ресми порталы арқылы өтеді." : "Регистрация проходит через сайт организатора."}
            </p>
          </div>
          <a
            href={opp.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-bold transition-colors"
          >
            <span>{t.common.apply}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Source Citation */}
      {opp.source && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            {t.verification.source}
          </h3>
          <SourceCard source={opp.source} />
        </div>
      )}
    </div>
  );
}
