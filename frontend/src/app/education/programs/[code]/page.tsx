"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  BookOpen, 
  ArrowLeft, 
  Building2, 
  Award, 
  ExternalLink, 
  ShieldCheck, 
  FileText 
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { api } from "@/lib/api";
import { EducationProgram } from "@/lib/types";
import { VerificationBadge } from "@/components/common/VerificationBadge";
import { ScoreExplainer } from "@/components/common/ScoreExplainer";

export default function ProgramDetailPage() {
  const { lang, t } = useI18n();
  const params = useParams();
  const code = params?.code as string;
  const [program, setProgram] = useState<EducationProgram | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgram() {
      if (!code) return;
      setLoading(true);
      const data = await api.getProgramByCode(code);
      setProgram(data);
      setLoading(false);
    }
    loadProgram();
  }, [code]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-zinc-400">
        {lang === "kz" ? "Бағдарлама мәліметтері жүктелуде..." : "Загрузка информации о программе..."}
      </div>
    );
  }

  if (!program) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-900">{t.common.noResults}</h2>
        <Link href="/education" className="text-xs font-semibold text-blue-600 hover:underline">
          ← {lang === "kz" ? "Бағдарламалар тізіміне қайту" : "Вернуться к списку программ"}
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
        <span>{lang === "kz" ? "Барлық білім беру бағдарламалары" : "Все образовательные программы"}</span>
      </Link>

      {/* Program Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] border border-[#F99184]/40">
              {program.code}
            </span>
            <span className="text-xs text-zinc-500 font-medium">
              {program.group ? (lang === "kz" ? program.group.name_kz : program.group.name_ru) : "Бакалавриат"}
            </span>
          </div>
          <VerificationBadge status={program.status} compact />
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          {lang === "kz" ? program.name_kz : program.name_ru}
        </h1>
      </div>

      {/* Score Explainer for this Program */}
      <ScoreExplainer 
        untThreshold={50} 
        instThreshold={65} 
        historicalCutoff={program.code.includes("6B061") ? 104 : 116} 
        academicYear="2024–2025" 
      />

      {/* Institutions in Astana offering this program */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="font-bold text-zinc-900 text-base flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600" />
          <span>{lang === "kz" ? "Астана қаласында осы бағдарламаны ұсынатын оқу орындары:" : "Учебные заведения Астаны, предлагающие программу:"}</span>
        </h2>

        {program.institutions && program.institutions.length > 0 ? (
          <div className="space-y-3">
            {program.institutions.map((inst) => (
              <div
                key={inst.id}
                className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/70 flex flex-wrap items-center justify-between gap-4"
              >
                <div>
                  <Link
                    href={`/education/institutions/${inst.slug}`}
                    className="font-bold text-sm text-zinc-900 hover:text-blue-600 transition-colors"
                  >
                    {lang === "kz" ? inst.name_kz : inst.name_ru}
                  </Link>
                  <div className="text-xs text-zinc-500 mt-1 flex items-center gap-3">
                    <span>{t.common.tuitionFee}: {inst.tuition_fee_kzt ? `${inst.tuition_fee_kzt.toLocaleString()} ₸ / жыл` : t.verification.unknownInfo}</span>
                    <span>•</span>
                    <span>Тілдер: {inst.study_languages?.join(", ") || "KZ, RU"}</span>
                  </div>
                </div>

                <Link
                  href={`/education/institutions/${inst.slug}`}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700"
                >
                  {t.common.explore} →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-zinc-400 italic">
            {t.verification.unknownInfo}
          </div>
        )}
      </div>

      {/* Relevant Grants Link */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#270111] via-[#4A0221] to-[#1D1D1D] border border-[#A31551]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white shadow-forte">
        <div className="space-y-1">
          <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-[#F99184]" />
            <span>{lang === "kz" ? "Осы мамандыққа грант іздеп жүрсіз бе?" : "Ищете грант на эту специальность?"}</span>
          </h3>
          <p className="text-xs text-zinc-300 max-w-xl">
            {lang === "kz" ? "Мемлекеттік гранттар және Астана қаласы әкімінің мақсатты гранттарын қараңыз." : "Ознакомьтесь с государственными грантами и грантами акима г. Астана."}
          </p>
        </div>
        <Link
          href="/grants"
          className="text-xs font-bold px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#F99184] via-[#B8335F] to-[#A51652] hover:opacity-95 text-white shrink-0 shadow-forte transition-all"
        >
          {t.sections.grantsTitle} →
        </Link>
      </div>
    </div>
  );
}
