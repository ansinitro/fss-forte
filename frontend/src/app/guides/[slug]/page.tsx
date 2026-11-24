"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, ExternalLink, Calendar, HelpCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export default function GuideDetailPage() {
  const { lang, t } = useI18n();
  const params = useParams();
  const slug = params?.slug as string;

  const guides: Record<string, {
    title_kz: string;
    title_ru: string;
    academic_year: string;
    steps_kz: string[];
    steps_ru: string[];
    details_kz: string;
    details_ru: string;
    sources: { name: string; url: string }[];
  }> = {
    "grade-9": {
      title_kz: "9-сыныптан кейін не істеуге болады?",
      title_ru: "Что делать после 9 класса?",
      academic_year: "2026-2027",
      steps_kz: [
        "1-қадам: Астана қаласы колледждерінің мемлекеттік білім беру тапсырысын (тегін орындар) қарап шығыңыз.",
        "2-қадам: 9-сынып аттестатының орташа балын есептеңіз (Колледжге қабылдау ҰБТ-сыз, аттестат балы бойынша жүреді).",
        "3-қадам: smartnation.kz немесе колледждің қабылдау комиссиясы арқылы маусым-тамыз айларында құжат тапсырыңыз.",
        "4-қадам: Егер 10-сыныпта қалуды ұйғарсаңыз, болашақ мамандығыңызға сәйкес бейіндік сыныпты (жаратылыстану-математика немесе қоғамдық-гуманитарлық) таңдаңыз."
      ],
      steps_ru: [
        "Шаг 1: Ознакомьтесь с госзаказом (бесплатными местами) в колледжах Астаны.",
        "Шаг 2: Рассчитайте средний балл аттестата за 9 класс (поступление в колледж проходит без ЕНТ по конкурсу аттестатов).",
        "Шаг 3: Подайте документы через портал smartnation.kz или приемную комиссию колледжа в июне-августе.",
        "Шаг 4: Если остаетесь в 10 классе, выберите профильное направление (естественно-математическое или общественно-гуманитарное)."
      ],
      details_kz: "Астана қаласы бойынша жыл сайын политехникалық, IT және медициналық колледждерге мыңдаған тегін орын бөлінеді. Колледжді бітірген соң ЖОО-ға қысқартылған мерзіммен түсуге болады.",
      details_ru: "В колледжах Астаны действует бесплатное техническое и профессиональное образование по востребованным рабочим и IT специальностям с выплатой стипендии.",
      sources: [
        { name: "Астана қаласы Білім басқармасы", url: "https://www.gov.kz/memleket/entities/astana-bilim" },
        { name: "SmartNation Колледж порталы", url: "https://college.smartnation.kz" }
      ]
    },
    "grade-11": {
      title_kz: "11-сыныптан кейін қалай оқуға түседі?",
      title_ru: "Как поступить после 11 класса?",
      academic_year: "2026-2027",
      steps_kz: [
        "1-қадам: ҰБТ бейіндік пәндер жұбын таңдаңыз (мысалы, IT үшін: Математика + Информатика).",
        "2-қадам: Негізгі гранттық ҰБТ-ға app.testcenter.kz арқылы тіркеліп, екі мүмкіндікті де пайдаланыңыз (мамыр-маусым).",
        "3-қадам: Жоғары балл жинаған сертификатпен шілде айында eGov.kz арқылы мемлекеттік гранттар конкурсына 4 топ таңдап өтініш беріңіз.",
        "4-қадам: Грант нәтижесі шыққан соң (тамыз басында) таңдалған университетке құжаттарыңызды өткізіңіз."
      ],
      steps_ru: [
        "Шаг 1: Определите пару профильных предметов ЕНТ (например, для IT: Математика + Информатика).",
        "Шаг 2: Зарегистрируйтесь на основное ЕНТ через app.testcenter.kz (май-июнь) и используйте обе попытки.",
        "Шаг 3: В июле подайте заявление на конкурс госгрантов через eGov.kz, указав до 4 групп программ.",
        "Шаг 4: После публикации результатов конкурса (начало августа) сдайте оригиналы документов в вуз."
      ],
      details_kz: "Ұлттық ЖОО-лар үшін шекті балл - кемінде 65, педагогика мен медицина үшін - 75 балл. Әр бейіндік пәннен кемінде 5 балл жинау міндетті.",
      details_ru: "Для национальных вузов минимальный порог составляет 65 баллов, для педагогики и медицины - 75 баллов.",
      sources: [
        { name: "Ұлттық тестілеу орталығы (НЦТ)", url: "https://testcenter.kz" },
        { name: "eGov.kz Электрондық үкімет порталы", url: "https://egov.kz" }
      ]
    },
    "no-grant": {
      title_kz: "Грантқа түспесең не істеу керек?",
      title_ru: "Что делать, если не поступил на грант?",
      academic_year: "2026-2027",
      steps_kz: [
        "1-жол: Астана қаласы әкімінің мақсатты гранттарына тамыздың 5-15 аралығында құжат тапсырыңыз.",
        "2-жол: 'Қазақстан халқына' қоғамдық қорының гранттық байқауына қатысыңыз (әлеуметтік санаттар үшін).",
        "3-жол: Университеттің ректорлық ішкі жеңілдіктері мен гранттарына (100%, 50%, 25%) өтініш жазыңыз.",
        "4-жол: Ақылы бөлімге түсіп, 1-семестрді үздік бағамен аяқтап, бос қалған мемлекеттік бос гранттарға ауысыңыз.",
        "5-жол: Тамыз немесе қаңтар айындағы ақылы ҰБТ-ны қайта тапсырып, қысқы қабылдау мүмкіндігін қарастырыңыз."
      ],
      steps_ru: [
        "Путь 1: Подайте документы на целевой грант акима Астаны (5–15 августа).",
        "Путь 2: Примите участие в конкурсе фонда 'Қазақстан халқына' (для социально уязвимых категорий).",
        "Путь 3: Подайте заявление на внутренние ректорские гранты и скидки университетов (до 100%).",
        "Путь 4: Поступите на платное отделение и подайте на вакантные государственные гранты после 1-го семестра.",
        "Путь 5: Сдайте повторное платное ЕНТ (август или январь) для зимнего зачисления."
      ],
      details_kz: "Мемлекеттік грантқа ілікпеу оқу мүмкіндігінен айырылу дегенді білдірмейді. Астанада көптеген баламалы гранттар мен ауысу тетіктері бар.",
      details_ru: "Неполучение госгранта в первом туре не закрывает доступ к высшему образованию — существуют гранты акима, благотворительные фонды и перевод с платного.",
      sources: [
        { name: "Астана қаласы Білім басқармасы", url: "https://www.gov.kz/memleket/entities/astana-bilim" },
        { name: "'Қазақстан халқына' қоры", url: "https://qazaqstanhalqyna.kz" }
      ]
    }
  };

  const guide = guides[slug] || guides["grade-11"];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{t.nav.home}</span>
      </Link>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>{guide.academic_year} {t.verification.academicCycle}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          {lang === "kz" ? guide.title_kz : guide.title_ru}
        </h1>
      </div>

      {/* Step by step checklist */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="font-bold text-zinc-900 text-base">
          {lang === "kz" ? "Қадамдық әрекеттер жоспары:" : "Пошаговый план действий:"}
        </h2>
        <div className="space-y-3">
          {(lang === "kz" ? guide.steps_kz : guide.steps_ru).map((step, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 flex items-start gap-3 text-xs sm:text-sm text-zinc-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="font-medium">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Important explanation */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-6 text-xs sm:text-sm text-blue-950 leading-relaxed space-y-2">
        <div className="font-bold flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>{lang === "kz" ? "Түсіндірме мен заңды негіз" : "Пояснения и правовые нормы"}</span>
        </div>
        <p>{lang === "kz" ? guide.details_kz : guide.details_ru}</p>
      </div>

      {/* Official sources */}
      <div className="p-5 rounded-2xl bg-white border border-zinc-200 space-y-3 text-xs">
        <span className="font-bold text-zinc-900 block">{t.verification.source}:</span>
        <div className="flex flex-wrap gap-3">
          {guide.sources.map((s, idx) => (
            <a
              key={idx}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
            >
              <span>{s.name}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
