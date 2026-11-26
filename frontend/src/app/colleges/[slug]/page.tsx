"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  Building2,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  UserCheck,
  Home,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  BookOpen
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { api } from "@/lib/api";
import { KZCollege, Institution } from "@/lib/types";

export default function CollegeDetailPage() {
  const { lang, t } = useI18n();
  const params = useParams();
  const slug = params?.slug as string;

  const [college, setCollege] = useState<KZCollege | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      setLoading(true);
      const res = await api.getKZCollegeBySlug(slug);
      if (res?.college) {
        setCollege(res.college);
      } else {
        // Fallback check in Astana institutions
        const inst = await api.getInstitutionBySlug(slug);
        if (inst && inst.institution_type === "college") {
          const synthetic: KZCollege = {
            id: inst.id,
            slug: inst.slug,
            region_id: "astana",
            region_ru: "г. Астана",
            region_kk: "Астана қаласы",
            district_ru: "г. Астана",
            district_kk: "Астана қаласы",
            name_ru: inst.name_ru,
            name_kk: inst.name_kz,
            address_ru: inst.address_ru || "",
            address_kk: inst.address_kz || "",
            director: "",
            phone: inst.contact_phone || "",
            email: "",
            website: inst.official_website || "",
            is_state: inst.name_ru.toLowerCase().includes("государственн") || inst.name_kz.toLowerCase().includes("мемлекеттік"),
            ownership_ru: inst.name_ru.toLowerCase().includes("государственн") ? "Государственный (Госзаказ)" : "Частный колледж",
            ownership_kk: inst.name_kz.toLowerCase().includes("мемлекеттік") ? "Мемлекеттік (Мемлекеттік тапсырыс)" : "Жеке колледж",
            specialization_ru: inst.offered_programs_summary?.join(", ") || "Колледж",
            specialization_kk: inst.offered_programs_summary?.join(", ") || "Колледж",
            dormitory_info_ru: inst.dormitory_info_ru || "Информация уточняется в приемной комиссии",
            dormitory_info_kk: inst.dormitory_info_kz || "Мәлімет қабылдау комиссиясынан нақтыланады",
            source_url: "https://www.gov.kz/article/707?lang=ru"
          };
          setCollege(synthetic);
        } else {
          setCollege(null);
        }
      }
      setLoading(false);
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-zinc-400">
        {lang === "kz" ? "Колледж мәліметтері жүктелуде..." : "Загрузка информации о колледже..."}
      </div>
    );
  }

  if (!college) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-900">{t.common.noResults}</h2>
        <p className="text-xs text-zinc-500">
          {lang === "kz" ? "Көрсетілген колледж табылмады." : "Колледж по указанному адресу не найден."}
        </p>
        <Link
          href="/colleges"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A31551] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === "kz" ? "Барлық колледждерге қайту" : "Вернуться ко всем колледжам"}</span>
        </Link>
      </div>
    );
  }

  const title = lang === "kz" ? (college.name_kk || college.name_ru) : (college.name_ru || college.name_kk);
  const regionName = lang === "kz" ? (college.region_kk || college.region_ru) : (college.region_ru || college.region_kk);
  const districtName = lang === "kz" ? (college.district_kk || college.district_ru) : (college.district_ru || college.district_kk);
  const cleanPhone = college.phone ? college.phone.split(",")[0].trim() : "";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8 space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
        <Link href="/" className="hover:text-zinc-900 transition-colors">
          {lang === "kz" ? "Басты бет" : "Главная"}
        </Link>
        <span>/</span>
        <Link href="/colleges" className="hover:text-zinc-900 transition-colors">
          {lang === "kz" ? "Колледждер" : "Колледжи Казахстана"}
        </Link>
        <span>/</span>
        <span className="text-[#A31551] font-bold truncate max-w-[220px] sm:max-w-none">
          {title}
        </span>
      </div>

      {/* Back button */}
      <Link
        href="/colleges"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{lang === "kz" ? "Барлық колледждер каталогы" : "Все колледжи Казахстана"}</span>
      </Link>

      {/* Main College Card */}
      <div className="rounded-3xl border border-[#EAEBEF] bg-white p-6 sm:p-8 shadow-forte space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border ${
                college.is_state
                  ? "bg-[#FDF2F7] text-[#A31551] border-[#F99184]/40"
                  : "bg-zinc-100 text-zinc-700 border-zinc-200"
              }`}
            >
              {lang === "kz" ? college.ownership_kk : college.ownership_ru}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-700">
              <MapPin className="w-3 h-3 inline mr-1" />
              {regionName} {districtName && `• ${districtName}`}
            </span>
            <span className="text-[11px] font-semibold text-[#A31551] bg-[#FDF2F7] px-2.5 py-0.5 rounded-full border border-[#FC9385]/50 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Gov.kz 707 ✓
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight leading-tight">
            {title}
          </h1>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 text-zinc-800 text-xs font-semibold">
            <GraduationCap className="w-4 h-4 text-[#A31551]" />
            <span>{lang === "kz" ? college.specialization_kk : college.specialization_ru}</span>
          </div>
        </div>

        {/* Contact and Administration Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-zinc-50/80 border border-zinc-200/80 text-xs">
          <div className="space-y-2">
            <div className="text-zinc-400 font-bold uppercase text-[10px] tracking-wider">
              {lang === "kz" ? "Мекенжай және байланыс" : "Адрес и контакты"}
            </div>
            {college.address_ru && (
              <div className="flex items-start gap-2 text-zinc-700">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                <span>
                  <strong>{lang === "kz" ? "Мекенжайы: " : "Адрес: "}</strong>
                  {lang === "kz" ? (college.address_kk || college.address_ru) : (college.address_ru || college.address_kk)}
                </span>
              </div>
            )}
            {cleanPhone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#A31551] shrink-0" />
                <span>
                  <strong>{lang === "kz" ? "Телефон: " : "Телефон: "}</strong>
                  <a href={`tel:${cleanPhone}`} className="font-bold text-[#A31551] hover:underline">
                    {college.phone}
                  </a>
                </span>
              </div>
            )}
            {college.email && (
              <div className="flex items-center gap-2 text-zinc-700">
                <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>
                  <strong>Email: </strong>
                  <a href={`mailto:${college.email}`} className="text-zinc-800 hover:underline">
                    {college.email}
                  </a>
                </span>
              </div>
            )}
            {college.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>
                  <strong>Сайт: </strong>
                  <a
                    href={college.website.startsWith("http") ? college.website : `http://${college.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#A31551] hover:underline inline-flex items-center gap-1"
                  >
                    <span>{college.website.replace(/^https?:\/\//, "")}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="text-zinc-400 font-bold uppercase text-[10px] tracking-wider">
              {lang === "kz" ? "Басшылық" : "Руководство (Gov.kz 707)"}
            </div>
            {college.director && (
              <div className="flex items-start gap-2 text-zinc-700">
                <UserCheck className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                <span>
                  <strong>{lang === "kz" ? "Директор: " : "Директор: "}</strong>
                  {college.director}
                </span>
              </div>
            )}
            <div className="flex items-start gap-2 text-zinc-700 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A31551] shrink-0 mt-0.5" />
              <span>
                <strong>{lang === "kz" ? "Дереккөз: " : "Источник: "}</strong>
                <a
                  href={college.source_url || "https://www.gov.kz/article/707?lang=ru"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-600 hover:underline"
                >
                  Gov.kz Реестр ТиПО (Приказ МП РК №707)
                </a>
              </span>
            </div>
          </div>
        </div>

        {/* Dormitory & Campus */}
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 space-y-2">
          <h2 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
            <Home className="w-4 h-4 text-[#A31551]" />
            <span>{lang === "kz" ? "Студенттер жатақханасы" : "Студенческое общежитие"}</span>
          </h2>
          <p className="text-xs text-zinc-600 leading-relaxed">
            {lang === "kz" ? college.dormitory_info_kk : college.dormitory_info_ru}
          </p>
        </div>

        {/* Direct Action Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          {cleanPhone && (
            <a
              href={`tel:${cleanPhone}`}
              className="px-5 py-2.5 rounded-xl bg-[#A31551] hover:bg-[#820232] text-white text-xs font-bold transition-all shadow-forte flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{lang === "kz" ? "Қабылдау комиссиясына қоңырау шалу" : "Позвонить в приемную комиссию"}</span>
            </a>
          )}
          <Link
            href="/colleges"
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 px-3 py-2 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            ← {lang === "kz" ? "Барлық колледждерге қайту" : "К списку всех колледжей"}
          </Link>
        </div>
      </div>

      {/* Booklet Chapter 1 Guidance */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#270111] via-[#4A0221] to-[#1D1D1D] text-white flex flex-wrap items-center justify-between gap-4 shadow-forte">
        <div className="space-y-1">
          <div className="text-xs font-bold text-[#FC9385]">
            {lang === "kz" ? "Буклеттің 1-тарауы" : "Глава 1 Буклета абитуриента"}
          </div>
          <h3 className="text-base sm:text-lg font-black">
            {lang === "kz" ? "Колледж бе, әлде ЖОО ма? Қайсысын таңдаған дұрыс?" : "Колледж или вуз: что выбрать после 9 и 11 класса?"}
          </h3>
          <p className="text-xs text-zinc-300 max-w-lg">
            {lang === "kz"
              ? "ТиПО бағдарламалары, мемлекеттік гранттар және колледжден кейін ЖОО-ға түсу жолдары туралы толық нұсқаулық."
              : "Пошаговый гид по госзаказу в колледжах, стипендиям и траектории поступления в вуз после колледжа."}
          </p>
        </div>
        <Link
          href="/booklet?tab=route"
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#F99184] via-[#B8335F] to-[#A51652] hover:opacity-95 text-white text-xs font-bold shadow-forte transition-all flex items-center gap-1.5 shrink-0"
        >
          <span>{lang === "kz" ? "Гидті ашу" : "Открыть гид"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Mobile Sticky Quick Action Bar */}
      <div className="fixed bottom-14 left-0 right-0 z-30 md:hidden bg-white/95 backdrop-blur-md border-t border-zinc-200/90 p-2.5 shadow-lg">
        <div className="flex items-center gap-2 max-w-md mx-auto">
          {cleanPhone ? (
            <a
              href={`tel:${cleanPhone}`}
              className="flex-1 py-2.5 px-3 rounded-full bg-[#A31551] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{lang === "kz" ? "Қабылдау комиссиясы" : "Позвонить в колледж"}</span>
            </a>
          ) : (
            <Link
              href="/colleges"
              className="flex-1 py-2.5 px-3 rounded-full bg-zinc-100 text-zinc-800 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            >
              <span>{lang === "kz" ? "Барлық колледждер" : "Все колледжи"}</span>
            </Link>
          )}

          <Link
            href="/booklet"
            className="py-2.5 px-4 rounded-full bg-[#FDF2F7] border border-[#F99184]/40 text-[#A31551] font-bold text-xs flex items-center justify-center gap-1 shrink-0 active:scale-95 transition-transform"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === "kz" ? "Буклет" : "В буклет"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
