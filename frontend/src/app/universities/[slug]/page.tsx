"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Coins,
  BookOpen,
  UserCheck,
  Calendar,
  ExternalLink,
  Search,
  Award,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calculator,
  ArrowRight
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { api } from "@/lib/api";
import { KZUniversity, StudentHubUniProgram } from "@/lib/types";

export default function UniversityDetailPage() {
  const { lang, t } = useI18n();
  const params = useParams();
  const slug = params?.slug as string;

  const [uni, setUni] = useState<KZUniversity | null>(null);
  const [programs, setPrograms] = useState<StudentHubUniProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [progSearch, setProgSearch] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      setLoading(true);
      const res = await api.getKZUniversityBySlug(slug);
      if (res?.university) {
        setUni(res.university);
        setPrograms(res.programs || []);
      } else {
        // Fallback check in studenthub
        const shRes = await api.getStudentHubUniversityBySlug(slug);
        if (shRes) {
          const synthetic: KZUniversity = {
            id: shRes.slug,
            slug: shRes.slug,
            ent_code: "",
            name_ru: shRes.name,
            name_kk: shRes.name,
            region_id: "",
            region_ru: shRes.city,
            region_kk: shRes.city,
            city: shRes.city,
            address_ru: shRes.city,
            address_kk: shRes.city,
            founded_year: "",
            email: "",
            phone: shRes.phone || "",
            website: "",
            rector_ru: "",
            rector_kk: "",
            rector_contacts: "",
            ownership: "",
            univ_type: "",
            students_total: null,
            students_grant: null,
            students_paid: null,
            min_tuition_kzt: null,
            max_tuition_kzt: null,
            sample_prices: [],
            programs_count: shRes.programs_count,
            studenthub_slug: shRes.slug,
            univision_url: shRes.url,
            sources: ["studenthub.kz"]
          };
          setUni(synthetic);
          setPrograms(shRes.programs || []);
        } else {
          // Fallback check in institutions
          const instRes = await api.getInstitutionBySlug(slug);
          if (instRes) {
            const synthetic: KZUniversity = {
              id: instRes.id,
              slug: instRes.slug,
              ent_code: "",
              name_ru: instRes.name_ru,
              name_kk: instRes.name_kz,
              region_id: "astana",
              region_ru: "г. Астана",
              region_kk: "Астана қаласы",
              city: "Астана",
              address_ru: instRes.address_ru || "",
              address_kk: instRes.address_kz || "",
              founded_year: "",
              email: instRes.contact_email || "",
              phone: instRes.contact_phone || "",
              website: instRes.official_website || "",
              rector_ru: "",
              rector_kk: "",
              rector_contacts: "",
              ownership: instRes.institution_type === "university" ? "Вуз" : "Колледж",
              univ_type: "Университет",
              students_total: null,
              students_grant: null,
              students_paid: null,
              min_tuition_kzt: null,
              max_tuition_kzt: null,
              sample_prices: [],
              programs_count: instRes.offered_programs_summary?.length || 0,
              studenthub_slug: "",
              univision_url: "",
              sources: ["Gov.kz 657", "Forte Astana"]
            };
            setUni(synthetic);
            setPrograms(
              (instRes.offered_programs_summary || []).map((progName) => ({
                code: "",
                name: progName,
                faculty: "",
                pair: "",
                grant_min_general: null,
                grant_min_rural: null,
                grant_count: null,
                tuition_price: null,
                url: ""
              }))
            );
          } else {
            setUni(null);
          }
        }
      }
      setLoading(false);
    }
    loadData();
  }, [slug]);

  const filteredPrograms = useMemo(() => {
    if (!progSearch.trim()) return programs;
    const q = progSearch.toLowerCase();
    return programs.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      (p.pair && p.pair.toLowerCase().includes(q))
    );
  }, [programs, progSearch]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center text-xs text-zinc-400">
        {lang === "kz" ? "Университет мәліметтері жүктелуде..." : "Загрузка информации об университете..."}
      </div>
    );
  }

  if (!uni) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-900">{t.common.noResults}</h2>
        <p className="text-xs text-zinc-500">
          {lang === "kz" ? "Көрсетілген университет табылмады." : "Университет по данному адресу не найден."}
        </p>
        <Link
          href="/universities"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A31551] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === "kz" ? "Барлық университеттерге қайту" : "Вернуться ко всем университетам"}</span>
        </Link>
      </div>
    );
  }

  const title = lang === "kz" ? (uni.name_kk || uni.name_ru) : (uni.name_ru || uni.name_kk);
  const regionName = lang === "kz" ? (uni.region_kk || uni.city) : (uni.region_ru || uni.city);
  const cleanPhone = uni.phone ? uni.phone.split(",")[0].trim() : "";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8 space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
        <Link href="/" className="hover:text-zinc-900 transition-colors">
          {lang === "kz" ? "Басты бет" : "Главная"}
        </Link>
        <span>/</span>
        <Link href="/universities" className="hover:text-zinc-900 transition-colors">
          {lang === "kz" ? "ЖОО каталогы" : "Университеты Казахстана"}
        </Link>
        <span>/</span>
        <span className="text-[#A31551] font-bold truncate max-w-[220px] sm:max-w-none">
          {title}
        </span>
      </div>

      {/* Back button */}
      <Link
        href="/universities"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{lang === "kz" ? "Барлық университеттер каталогы" : "Все университеты Казахстана"}</span>
      </Link>

      {/* University Hero Header */}
      <div className="rounded-3xl border border-[#EAEBEF] bg-white p-6 sm:p-8 shadow-forte space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {uni.ent_code && (
              <span className="font-mono text-xs font-black px-3.5 py-1 rounded-full bg-[#4A0221] text-[#F99184]">
                Код ЕНТ: {uni.ent_code}
              </span>
            )}
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551]">
              <MapPin className="w-3 h-3 inline mr-1" />
              {uni.city || regionName}
            </span>
            {uni.ownership && (
              <span className="text-xs px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 font-semibold">
                {uni.ownership}
              </span>
            )}
            {uni.univ_type && (
              <span className="text-xs px-3 py-1 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-600 font-medium">
                {uni.univ_type}
              </span>
            )}
            <span className="text-[11px] font-semibold text-[#A31551] bg-[#FDF2F7] px-2.5 py-0.5 rounded-full border border-[#FC9385]/50 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Gov.kz 657 & Univision ✓
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight leading-tight">
            {title}
          </h1>
        </div>

        {/* Student & Stats Summary (Univision & Gov.kz) */}
        {(uni.students_total != null || uni.min_tuition_kzt != null || programs.length > 0) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {uni.students_total != null && (
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-center">
                <div className="text-[11px] text-zinc-500 font-medium">
                  {lang === "kz" ? "Барлық студент" : "Всего студентов"}
                </div>
                <div className="text-xl font-black text-zinc-900 mt-0.5">
                  {uni.students_total.toLocaleString()}
                </div>
              </div>
            )}
            {uni.students_grant != null && (
              <div className="p-4 rounded-2xl bg-[#FDF2F7] border border-[#FC9385]/50 text-center">
                <div className="text-[11px] text-[#4A0221] font-semibold">
                  {lang === "kz" ? "Грантта оқиды" : "На гранте"}
                </div>
                <div className="text-xl font-black text-[#A31551] mt-0.5">
                  {uni.students_grant.toLocaleString()}
                </div>
              </div>
            )}
            {uni.students_paid != null && (
              <div className="p-4 rounded-2xl bg-[#FFF5F4] border border-[#FC9385]/60 text-center">
                <div className="text-[11px] text-[#4A0221] font-semibold">
                  {lang === "kz" ? "Ақылы бөлім" : "Платно"}
                </div>
                <div className="text-xl font-black text-[#820232] mt-0.5">
                  {uni.students_paid.toLocaleString()}
                </div>
              </div>
            )}
            {uni.min_tuition_kzt != null && (
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-center">
                <div className="text-[11px] text-zinc-500 font-medium">
                  {lang === "kz" ? "Оқу ақысы (бастап)" : "Обучение от"}
                </div>
                <div className="text-lg font-black text-[#A31551] mt-0.5">
                  {uni.min_tuition_kzt.toLocaleString()} ₸
                </div>
              </div>
            )}
          </div>
        )}

        {/* Governance & Contact Grid (Gov.kz 657) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-zinc-50/80 border border-zinc-200/80 text-xs">
          <div className="space-y-2">
            <div className="text-zinc-400 font-bold uppercase text-[10px] tracking-wider">
              {lang === "kz" ? "Мекенжай және байланыс" : "Адрес и контакты"}
            </div>
            {uni.address_ru && (
              <div className="flex items-start gap-2 text-zinc-700">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                <span>
                  <strong>{lang === "kz" ? "Мекенжайы: " : "Адрес: "}</strong>
                  {lang === "kz" ? (uni.address_kk || uni.address_ru) : (uni.address_ru || uni.address_kk)}
                </span>
              </div>
            )}
            {cleanPhone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#A31551] shrink-0" />
                <span>
                  <strong>{lang === "kz" ? "Байланыс: " : "Приемная: "}</strong>
                  <a href={`tel:${cleanPhone}`} className="font-bold text-[#A31551] hover:underline">
                    {uni.phone}
                  </a>
                </span>
              </div>
            )}
            {uni.email && (
              <div className="flex items-center gap-2 text-zinc-700">
                <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>
                  <strong>Email: </strong>
                  <a href={`mailto:${uni.email}`} className="text-zinc-800 hover:underline">
                    {uni.email}
                  </a>
                </span>
              </div>
            )}
            {uni.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>
                  <strong>Сайт: </strong>
                  <a
                    href={uni.website.startsWith("http") ? uni.website : `http://${uni.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#A31551] hover:underline inline-flex items-center gap-1"
                  >
                    <span>{uni.website.replace(/^https?:\/\//, "")}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="text-zinc-400 font-bold uppercase text-[10px] tracking-wider">
              {lang === "kz" ? "Басшылық және мәліметтер" : "Руководство (Gov.kz 657)"}
            </div>
            {uni.rector_ru && (
              <div className="flex items-start gap-2 text-zinc-700">
                <UserCheck className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                <span>
                  <strong>{lang === "kz" ? "Ректор: " : "Ректор: "}</strong>
                  {lang === "kz" ? (uni.rector_kk || uni.rector_ru) : (uni.rector_ru || uni.rector_kk)}
                </span>
              </div>
            )}
            {uni.rector_contacts && (
              <div className="text-zinc-600 pl-5">
                <span className="text-[11px]">{uni.rector_contacts}</span>
              </div>
            )}
            {uni.founded_year && (
              <div className="flex items-center gap-2 text-zinc-700">
                <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>
                  <strong>{lang === "kz" ? "Құрылған жылы: " : "Год основания: "}</strong>
                  {uni.founded_year}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Educational Programs & Specializations Catalog */}
      <div className="rounded-3xl border border-[#EAEBEF] bg-white p-6 sm:p-8 shadow-forte space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#A31551]" />
              <span>
                {lang === "kz" ? "Білім беру бағдарламалары мен мамандықтар" : "Образовательные программы и специальности"}
              </span>
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              {lang === "kz"
                ? `Барлығы ${programs.length} мамандық бойынша оқыту жүргізіледі`
                : `В данном вузе доступно ${programs.length} аккредитованных программ обучения`}
            </p>
          </div>

          {/* Quick Search inside programs */}
          {programs.length > 5 && (
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={progSearch}
                onChange={(e) => setProgSearch(e.target.value)}
                placeholder={lang === "kz" ? "Мамандық іздеу..." : "Поиск специальности..."}
                className="w-full pl-9 pr-3 py-1.5 rounded-full border border-zinc-200 text-xs focus:outline-none focus:border-[#A31551] bg-zinc-50"
              />
            </div>
          )}
        </div>

        {filteredPrograms.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-400 italic">
            {programs.length === 0
              ? (lang === "kz" ? "Мамандықтар тізімі нақтылануда." : "Каталог специальностей уточняется приемной комиссией.")
              : (lang === "kz" ? "Іздеу бойынша мамандық табылмады." : "По вашему запросу специальности не найдены.")}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredPrograms.map((prog, idx) => {
              const progLink = prog.slug ? `/programs/${prog.slug}` : `/programs?q=${encodeURIComponent(prog.name)}`;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-zinc-100 bg-zinc-50/70 hover:bg-white hover:border-[#A31551]/30 transition-all flex flex-col justify-between space-y-3 group shadow-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="text-zinc-500 font-medium">{prog.pair || "Математика + Физика"}</span>
                      {prog.score && (
                        <span className="font-extrabold text-[#A31551] bg-[#FDF2F7] px-2 py-0.5 rounded-full border border-[#FC9385]/50">
                          {prog.score} {lang === "kz" ? "балл" : "балл"}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-zinc-900 text-sm leading-snug group-hover:text-[#A31551] transition-colors">
                      <Link href={progLink}>
                        {prog.name}
                      </Link>
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-zinc-200/60 flex items-center justify-between text-xs">
                    {prog.price ? (
                      <span className="font-semibold text-zinc-700 text-[11px]">{prog.price}</span>
                    ) : (
                      <span className="text-[11px] text-zinc-400">
                        {lang === "kz" ? "Грант / Ақылы" : "Грант и контракт"}
                      </span>
                    )}

                    <Link
                      href={progLink}
                      className="font-bold text-[#A31551] hover:underline flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>{lang === "kz" ? "Толығырақ" : "Подробнее"}</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sample Tuition Fees by Direction (Univision) */}
      {uni.sample_prices && uni.sample_prices.length > 0 && (
        <div className="rounded-3xl border border-[#EAEBEF] bg-white p-6 sm:p-8 shadow-forte space-y-4">
          <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <Coins className="w-5 h-5 text-[#A31551]" />
            <span>{lang === "kz" ? "Бағыттар бойынша оқу ақысы (Univision)" : "Стоимость обучения по направлениям"}</span>
          </h2>
          <div className="rounded-2xl border border-zinc-200 overflow-hidden text-xs divide-y divide-zinc-100">
            {uni.sample_prices.map((pr, idx) => (
              <div key={idx} className="px-4 py-3 flex items-center justify-between bg-white hover:bg-zinc-50/60 transition-colors">
                <span className="font-medium text-zinc-800">{pr.program}</span>
                <span className="font-bold text-[#A31551] shrink-0 ml-3">
                  {pr.price_kzt.toLocaleString()} ₸ / {lang === "kz" ? "жыл" : "год"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grant Calculator CTA */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#270111] via-[#4A0221] to-[#1D1D1D] text-white space-y-4 shadow-forte">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FC9385]/20 text-[#FC9385] text-xs font-bold border border-[#FC9385]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === "kz" ? "ЕНТ Грант Калькуляторы" : "Калькулятор грантов ЕНТ"}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              {lang === "kz" ? "Осы ЖОО-ға грантқа түсу мүмкіндігін тексеріңіз" : "Оцените шансы на поступление в этот университет"}
            </h3>
            <p className="text-xs text-zinc-300 max-w-xl">
              {lang === "kz"
                ? "Өз ЕНТ балыңызды және бейіндік пәндеріңізді енгізіп, соңғы жылдардағы бекітілген балл шектеріне сәйкес грантқа түсу ықтималдығын көріңіз."
                : "Введите свои баллы ЕНТ и комбинацию предметов, чтобы увидеть реальную вероятность получения гранта на основе подтвержденных проходных баллов."}
            </p>
          </div>

          <Link
            href="/calculator"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#F99184] via-[#B8335F] to-[#A51652] hover:opacity-95 text-white text-xs font-bold shadow-forte transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>{lang === "kz" ? "Шансты есептеу" : "Рассчитать шансы"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
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
              <span>{lang === "kz" ? "Қабылдау комиссиясы" : "Позвонить в приемную"}</span>
            </a>
          ) : (
            <Link
              href="/universities"
              className="flex-1 py-2.5 px-3 rounded-full bg-zinc-100 text-zinc-800 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            >
              <span>{lang === "kz" ? "Барлық ЖОО-лар" : "Все университеты"}</span>
            </Link>
          )}

          <Link
            href="/calculator"
            className="py-2.5 px-4 rounded-full bg-[#FDF2F7] border border-[#F99184]/40 text-[#A31551] font-bold text-xs flex items-center justify-center gap-1 shrink-0 active:scale-95 transition-transform"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{lang === "kz" ? "Шанс" : "Шансы ЕНТ"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
