"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Award, 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  FileText, 
  AlertTriangle,
  Building,
  Calendar
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { api } from "@/lib/api";
import { Grant } from "@/lib/types";
import { VerificationBadge } from "@/components/common/VerificationBadge";
import { SourceCard } from "@/components/common/SourceCard";

export default function GrantDetailPage() {
  const { lang, t } = useI18n();
  const params = useParams();
  const slug = params?.slug as string;
  const [grant, setGrant] = useState<Grant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGrant() {
      if (!slug) return;
      setLoading(true);
      const data = await api.getGrantBySlug(slug);
      setGrant(data);
      setLoading(false);
    }
    loadGrant();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-zinc-400">
        {lang === "kz" ? "Грант мәліметтері жүктелуде..." : "Загрузка информации о гранте..."}
      </div>
    );
  }

  if (!grant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-900">{t.common.noResults}</h2>
        <Link href="/grants" className="text-xs font-semibold text-blue-600 hover:underline">
          ← {lang === "kz" ? "Гранттар тізіміне қайту" : "Вернуться к списку грантов"}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back button */}
      <Link
        href="/grants"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{lang === "kz" ? "Барлық гранттар мен стипендиялар" : "Все гранты и стипендии"}</span>
      </Link>

      {/* Grant Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] text-xs font-semibold border border-[#F99184]/40">
            <Award className="w-3.5 h-3.5" />
            <span>{grant.academic_year} {t.verification.academicCycle}</span>
          </div>
          <VerificationBadge status={grant.status} compact />
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          {lang === "kz" ? grant.title_kz : grant.title_ru}
        </h1>

        <div className="text-sm text-zinc-600 font-medium">
          {lang === "kz" ? "Ұйымдастырушы / Қамтамасыз етуші:" : "Организатор / Провайдер:"}{" "}
          <strong className="text-zinc-900">{lang === "kz" ? grant.provider_kz : grant.provider_ru}</strong>
        </div>
      </div>

      {/* Coverage Type & Details */}
      <div className="rounded-2xl border border-[#F99184]/30 bg-[#FDF2F7]/60 p-6 shadow-xs space-y-3">
        <h2 className="font-bold text-[#4A0221] text-base">
          {lang === "kz" ? "Қаржыландыру көлемі мен жеңілдіктер" : "Объем финансирования и льготы"}
        </h2>
        <p className="text-sm text-[#4A0221]/90 leading-relaxed font-medium">
          {lang === "kz" ? grant.coverage_details_kz : grant.coverage_details_ru}
        </p>
      </div>

      {/* Eligibility Criteria */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="font-bold text-zinc-900 text-base">
          {lang === "kz" ? "Кімдер қатыса алады? (Іріктеу шарттары)" : "Кто может претендовать? (Критерии отбора)"}
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
          {lang === "kz" ? grant.eligibility_criteria_kz : grant.eligibility_criteria_ru}
        </p>
      </div>

      {/* Required Documents */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="font-bold text-zinc-900 text-base flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <span>{lang === "kz" ? "Қажетті құжаттар тізімі:" : "Необходимые документы:"}</span>
        </h2>
        <ul className="space-y-2 text-xs sm:text-sm text-zinc-600">
          {(lang === "kz" ? grant.required_documents_kz : grant.required_documents_ru).map((doc, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{doc}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Deadlines Section */}
      {grant.deadlines && grant.deadlines.length > 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-xs space-y-3">
          <h2 className="font-bold text-zinc-900 text-base flex items-center gap-2">
            <Calendar className="w-4 h-4 text-zinc-700" />
            <span>{lang === "kz" ? "Өтінім қабылдау кезеңі" : "Период подачи заявлений"}</span>
          </h2>
          <div className="text-xs sm:text-sm text-zinc-700">
            {grant.deadlines.map((dl) => (
              <div key={dl.id} className="flex items-center justify-between py-2 border-b border-zinc-200/60 last:border-0">
                <span className="font-medium">{lang === "kz" ? dl.title_kz : dl.title_ru}</span>
                <span className="font-bold text-zinc-900 bg-white px-2.5 py-1 rounded-md border border-zinc-200">
                  {dl.end_date} дейін / до
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official Application Portal Link */}
      {grant.application_url && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#270111] via-[#4A0221] to-[#1D1D1D] border border-[#A31551]/30 text-white flex flex-wrap items-center justify-between gap-4 shadow-forte">
          <div>
            <div className="text-sm font-bold">{lang === "kz" ? "Ресми өтінім беру порталы" : "Официальный портал подачи заявок"}</div>
            <p className="text-xs text-zinc-300 mt-0.5">
              {lang === "kz" ? "Өтінімді ресми ресурс арқылы ғана жіберіңіз." : "Подавайте заявку исключительно через официальный сервис."}
            </p>
          </div>
          <a
            href={grant.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F99184] via-[#B8335F] to-[#A51652] hover:opacity-95 text-white text-xs font-bold shadow-forte transition-all"
          >
            <span>{t.common.apply}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Source Citation */}
      {grant.source && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            {t.verification.source}
          </h3>
          <SourceCard source={grant.source} />
        </div>
      )}
    </div>
  );
}
