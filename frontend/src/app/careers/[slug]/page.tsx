"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Briefcase, 
  ArrowLeft, 
  CheckCircle2, 
  GraduationCap, 
  BookOpen, 
  Award, 
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { api } from "@/lib/api";
import { Career } from "@/lib/types";
import { VerificationBadge } from "@/components/common/VerificationBadge";
import { SourceCard } from "@/components/common/SourceCard";

export default function CareerDetailPage() {
  const { lang, t } = useI18n();
  const params = useParams();
  const slug = params?.slug as string;
  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCareer() {
      if (!slug) return;
      setLoading(true);
      const data = await api.getCareerBySlug(slug);
      setCareer(data);
      setLoading(false);
    }
    loadCareer();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-zinc-400">
        {lang === "kz" ? "Мамандық ақпараты жүктелуде..." : "Загрузка информации о профессии..."}
      </div>
    );
  }

  if (!career) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-900">{t.common.noResults}</h2>
        <Link href="/careers" className="text-xs font-semibold text-blue-600 hover:underline">
          ← {lang === "kz" ? "Мамандықтар тізіміне қайту" : "Вернуться к списку профессий"}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back button */}
      <Link
        href="/careers"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{lang === "kz" ? "Барлық мамандықтар" : "Все профессии"}</span>
      </Link>

      {/* Title & Overview */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] text-xs font-semibold border border-[#F99184]/40">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{career.direction ? (lang === "kz" ? career.direction.name_kz : career.direction.name_ru) : "Мамандық"}</span>
          </div>
          <VerificationBadge status={career.status} lastVerifiedAt={career.source?.retrieved_at} compact />
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          {lang === "kz" ? career.title_kz : career.title_ru}
        </h1>

        <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
          {lang === "kz" ? career.description_kz : career.description_ru}
        </p>
      </div>

      {/* Student Journey: Pathway Ribbon */}
      <div className="p-4 rounded-2xl bg-zinc-100/70 border border-zinc-200/70 text-xs text-zinc-700">
        <div className="font-semibold text-zinc-900 mb-2">
          {lang === "kz" ? "Оқуға түсу жолы (Student Journey):" : "Траектория поступления:"}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-zinc-600 font-medium">
          <span className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-zinc-900">
            {lang === "kz" ? career.title_kz : career.title_ru}
          </span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded-lg bg-[#FDF2F7] border border-[#F99184]/40 text-[#A31551] font-semibold">
            {career.profile_subjects_kz || "Математика + Информатика"}
          </span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-[#4A0221] font-semibold">
            {lang === "kz" ? "Астана оқу орындары" : "Учебные заведения Астаны"}
          </span>
        </div>
      </div>

      {/* Daily Tasks & Responsibilities */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="font-bold text-zinc-900 text-base">
          {lang === "kz" ? "Бұл маман күнделікті не істейді?" : "Что делает этот специалист?"}
        </h2>
        <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-600">
          {(lang === "kz" ? career.daily_tasks_kz : career.daily_tasks_ru).map((task, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <span>{task}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Skills Required */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="font-bold text-zinc-900 text-base">
          {lang === "kz" ? "Қажетті біліктілік пен дағдылар:" : "Необходимые навыки и компетенции:"}
        </h2>
        <div className="flex flex-wrap gap-2">
          {(lang === "kz" ? career.skills_kz : career.skills_ru).map((skill, idx) => (
            <span
              key={idx}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200/60"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Where to study in Astana */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-zinc-900 text-base">
            {lang === "kz" ? "Астанада қайда оқытады?" : "Где обучают в Астане?"}
          </h2>
          <Link
            href="/education"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            {t.common.all} →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {career.related_institutions?.map((inst) => (
            <Link
              key={inst.id}
              href={`/education/institutions/${inst.slug}`}
              className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/70 hover:bg-zinc-100/80 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-zinc-900 group-hover:text-blue-600">
                    {lang === "kz" ? inst.name_kz : inst.name_ru}
                  </div>
                  <div className="text-[11px] text-zinc-400 capitalize">
                    {inst.institution_type === "college" ? "Колледж" : "Университет"} • Астана
                  </div>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-600 shrink-0 ml-2" />
            </Link>
          ))}
        </div>
      </div>

      {/* Official Source Card */}
      {career.source && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            {t.verification.source}
          </h3>
          <SourceCard source={career.source} />
        </div>
      )}
    </div>
  );
}
