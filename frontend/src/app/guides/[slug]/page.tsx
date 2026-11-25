"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  Calendar,
  HelpCircle,
  Download,
  FileText,
  Table as TableIcon,
  BookOpen
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { api } from "@/lib/api";
import { KBArticle } from "@/lib/types";

interface QuotaRow {
  category_kz: string;
  category_ru: string;
  quota_uni: string;
  quota_college: string;
  legal_basis: string;
  legal_url: string;
}

const officialQuotasData: QuotaRow[] = [
  {
    category_kz: "Азаматтардың ішіндегі I, II топтағы мүгедектігі барлар, бала кезінен мүгедектер, мүгедек балалар",
    category_ru: "Граждане с инвалидностью I, II групп, дети с инвалидностью, инвалиды с детства",
    quota_uni: "2%",
    quota_college: "10%",
    legal_basis: "№ 357 бұйрық",
    legal_url: "https://adilet.zan.kz/rus/docs/V2300033174"
  },
  {
    category_kz: "Ұлы Отан соғысының ардагерлеріне теңестірілген адамдар және басқа мемлекеттердегі ұрыс қимылдарының ардагерлері",
    category_ru: "Ветераны боевых действий на территории других государств и приравненные лица",
    quota_uni: "0.2%",
    quota_college: "0.5%",
    legal_basis: "№ 357 бұйрық",
    legal_url: "https://adilet.zan.kz/rus/docs/V2300033174"
  },
  {
    category_kz: "Ауылдық жастар (ауылдың әлеуметтік-экономикалық дамуын айқындайтын мамандықтар бойынша)",
    category_ru: "Сельская молодежь (на специальности социально-экономического развития села)",
    quota_uni: "35%",
    quota_college: "35%",
    legal_basis: "№ 357 бұйрық",
    legal_url: "https://adilet.zan.kz/rus/docs/V2300033174"
  },
  {
    category_kz: "Қазақстан Республикасының азаматы болып табылмайтын ұлты қазақ адамдар (қандастар)",
    category_ru: "Лица казахской национальности, не являющиеся гражданами РК (кандасы)",
    quota_uni: "4%",
    quota_college: "4%",
    legal_basis: "№ 357 бұйрық",
    legal_url: "https://adilet.zan.kz/rus/docs/V2300033174"
  },
  {
    category_kz: "Жетім балалар және ата-анасының қамқорлығынсыз қалған балалар",
    category_ru: "Дети-сироты и дети, оставшиеся без попечения родителей",
    quota_uni: "1%",
    quota_college: "1%",
    legal_basis: "№ 357 бұйрық",
    legal_url: "https://adilet.zan.kz/rus/docs/V2300033174"
  },
  {
    category_kz: "ҚР Үкіметі айқындаған өңірлерге қоныс аударатын ауыл жастары («Серпін» бағдарламасы)",
    category_ru: "Сельская молодежь, переселяющаяся в регионы, определенные Правительством РК",
    quota_uni: "3%",
    quota_college: "5%",
    legal_basis: "№ 357 бұйрық",
    legal_url: "https://adilet.zan.kz/rus/docs/V2300033174"
  },
  {
    category_kz: "Төрт және одан да көп кәмелетке толмаған балаларды тәрбиелеп отырған көп балалы отбасылардың балалары",
    category_ru: "Дети из многодетных семей (воспитывающих 4 и более несовершеннолетних детей)",
    quota_uni: "5%",
    quota_college: "5%",
    legal_basis: "№ 357 бұйрық",
    legal_url: "https://adilet.zan.kz/rus/docs/V2300033174"
  },
  {
    category_kz: "Кемінде үш жыл толық емес отбасы мәртебесі бар отбасылардың балалары",
    category_ru: "Дети из неполных семей, имеющих данный статус не менее 3 лет",
    quota_uni: "3%",
    quota_college: "1%",
    legal_basis: "№ 357 бұйрық",
    legal_url: "https://adilet.zan.kz/rus/docs/V2300033174"
  },
  {
    category_kz: "Бала кезінен мүгедектігі бар балаларды, 1, 2-топтағы мүгедектерді тәрбиелеп отырған отбасылардың балалары",
    category_ru: "Дети из семей, воспитывающих детей с инвалидностью с детства, инвалидов I, II групп",
    quota_uni: "2%",
    quota_college: "1%",
    legal_basis: "№ 357 бұйрық",
    legal_url: "https://adilet.zan.kz/rus/docs/V2300033174"
  },
  {
    category_kz: "Мерзімді әскери қызметтің белгіленген мерзімін өткерген ҚР азаматтары",
    category_ru: "Граждане РК, отслужившие установленный срок срочной воинской службы",
    quota_uni: "2.5%",
    quota_college: "1%",
    legal_basis: "№ 261 бұйрық",
    legal_url: "https://adilet.zan.kz/rus/docs/V2300033298"
  }
];

export default function GuideDetailPage() {
  const { lang, t } = useI18n();
  const params = useParams();
  const slug = (params?.slug as string) || "grade-11";
  const [kbArticle, setKbArticle] = useState<KBArticle | null>(null);
  const [loadingKb, setLoadingKb] = useState(false);

  const guides: Record<string, {
    title_kz: string;
    title_ru: string;
    academic_year: string;
    isQuotas?: boolean;
    steps_kz: string[];
    steps_ru: string[];
    details_kz: string;
    details_ru: string;
    sources: { name: string; url: string }[];
  }> = {
    "quotas": {
      title_kz: "Қабылдау квоталарының кестесі (10 санат)",
      title_ru: "Таблица квот приема (10 категорий)",
      academic_year: "2026-2027",
      isQuotas: true,
      steps_kz: [
        "1-қадам: Өзіңіздің немесе отбасыңыздың мәртебесін төмендегі 10 заңды санаттың біріне сәйкестігін тексеріңіз.",
        "2-қадам: eGov.kz немесе ХҚКО арқылы мәртебені растайтын электрондық анықтаманы алдын ала жүктеп алыңыз.",
        "3-қадам: Негізгі ҰБТ шекті балын жинаңыз (Квоталар шекті балды жинаған соң ғана автоматты конкурста ескеріледі).",
        "4-қадам: Шілде айында мемлекеттік гранттар конкурсына құжат тапсырғанда квота белгісін (галочка) қойыңыз."
      ],
      steps_ru: [
        "Шаг 1: Проверьте соответствие своей категории одной из 10 утвержденных льготных групп.",
        "Шаг 2: Получите подтверждающие электронные справки через eGov.kz заранее до начала конкурса.",
        "Шаг 3: Наберите минимальный пороговый балл ЕНТ (квота действует только при преодолении общего порога).",
        "Шаг 4: При подаче заявления на грант в июле укажите признак соответствующей квоты в системе."
      ],
      details_kz: "ҚР Ғылым және жоғары білім министрінің 2023 жылғы 26 шілдедегі № 357 және 2023 жылғы 15 тамыздағы № 261 бұйрықтарына сәйкес қабылдау квоталары жалпы білім беру гранттарының пайыздық үлесі ретінде бекітілген.",
      details_ru: "Размеры квот приема утверждены Приказами Министра науки и высшего образования РК № 357 от 26.07.2023 и № 261 от 15.08.2023. Квота распределяется строго пропорционально среди претендентов соответствующей категории.",
      sources: [
        { name: "ҚР ҒЖБМ № 357 Бұйрығы (Әділет)", url: "https://adilet.zan.kz/rus/docs/V2300033174" },
        { name: "ҚР ҒЖБМ № 261 Бұйрығы (Әділет)", url: "https://adilet.zan.kz/rus/docs/V2300033298" },
        { name: "ForteBank Абитуриент жолсілтемесі", url: "/docs/ForteBank_RU_print_compact.pdf" }
      ]
    },
    "transfer-to-grant": {
      title_kz: "Ақылы бөлімнен бос мемлекеттік грантқа ауысу ережесі",
      title_ru: "Как перевестись с платного отделения на вакантный госгрант",
      academic_year: "2026-2027",
      steps_kz: [
        "1-қадам: Семестрлік емтихандарды тек «өте жақсы» (A, A-) және «жақсы» (B+, B, B-) бағалармен тапсырыңыз. GPA деңгейі кемінде 3.5 болуы ұсынылады.",
        "2-қадам: Қысқы немесе жазғы емтихан сессиясы аяқталған соң факультет деканатынан немесе тіркеуші кеңсесінен босаған бос гранттар тізімін біліңіз.",
        "3-қадам: ЖОО ректорының атына бос білім беру грантына үміткер болу туралы өтініш пен транскрипті өткізіңіз.",
        "4-қадам: Университеттің Ғылыми кеңесі GPA балдарының рейтингі бойынша үміткерлер тізімін ҚР ҒЖБМ-ге жібереді.",
        "5-қадам: Министрлік бұйрығы шыққан соң студент келесі семестрден бастап тегін оқуға көшіп, шәкіртақы ала бастайды."
      ],
      steps_ru: [
        "Шаг 1: Сдавайте сессионные экзамены на оценки «отлично» и «хорошо». Рекомендуемый средний балл GPA — от 3.5 и выше.",
        "Шаг 2: По завершении зимней или летней сессии уточните в офисе регистратора наличие освободившихся вакантных грантов.",
        "Шаг 3: Подайте заявление на имя ректора вуза с приложением транскрипта с академической успеваемостью.",
        "Шаг 4: Ученый совет университета формирует ранжированный список претендентов по убыванию GPA и направляет в МНВО РК.",
        "Шаг 5: После издания приказа министерства студент переводится на бесплатное обучение с начислением стипендии."
      ],
      details_kz: "Босаған мемлекеттік гранттарға ауысу ҚР Білім және ғылым министрінің 2008 жылғы 23 қаңтардағы № 19 бұйрығымен (өзгерістер енгізілген қолданыстағы редакция: ҚР ҒЖБМ 2023 жылғы № 33345) реттеледі. Егер бірнеше үміткердің GPA балы тең болса, алдыңғы оқу кезеңдерінің бағалары және ҰБТ балы ескеріледі.",
      details_ru: "Перевод на вакантные государственные образовательные гранты регламентируется Правилами, утвержденными Приказом МОН РК № 19 с последующими изменениями МНВО РК (№ 33345). Основной критерий отбора — наивысший GPA за весь период обучения.",
      sources: [
        { name: "ҚР ҒЖБМ Бос гранттарға ауысу ережесі (Әділет)", url: "https://adilet.zan.kz/rus/docs/V2300033345" },
        { name: "ForteBank Абитуриент жолсілтемесі (16-17 бет)", url: "/docs/ForteBank_RU_print_compact.pdf" }
      ]
    },
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
      details_kz: "Астана қаласы бойынша жыл сайын политехникалық, IT және медициналық колледждерге тегін орындар бөлінеді. Колледжді бітірген соң ЖОО-ға қысқартылған мерзіммен түсуге болады.",
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
        "1-жол: Астана қаласы әкімінің 303 мақсатты грантына тамыздың 5-10 аралығында құжат тапсырыңыз.",
        "2-жол: 'Қазақстан халқына' қоғамдық қорының гранттық байқауына қатысыңыз (әлеуметтік санаттар үшін).",
        "3-жол: Университеттің ректорлық ішкі жеңілдіктері мен гранттарына (100%, 50%, 25%) өтініш жазыңыз.",
        "4-жол: Ақылы бөлімге түсіп, 1-семестрді үздік бағамен аяқтап, бос қалған мемлекеттік гранттарға ауысыңыз.",
        "5-жол: Tomorrow School (alem.ai) немесе JOLTAP сияқты тегін альтернативті бағдарламалар арқылы кәсіби мамандық игеріңіз."
      ],
      steps_ru: [
        "Путь 1: Подайте документы на 303 целевых гранта акима Астаны (5–10 августа).",
        "Путь 2: Примите участие в конкурсе фонда 'Қазақстан халқына' (для социально уязвимых категорий).",
        "Путь 3: Подайте заявление на внутренние ректорские гранты и скидки университетов (до 100%).",
        "Путь 4: Поступите на платное отделение и подайте на вакантные государственные гранты после 1-го семестра.",
        "Путь 5: Пройдите обучение в бесплатных альтернативных центрах подготовки (Tomorrow School / alem.ai, JOLTAP)."
      ],
      details_kz: "Мемлекеттік грантқа ілікпеу оқу мүмкіндігінен айырылу дегенді білдірмейді. Астанада көптеген баламалы гранттар, әкімдік квоталары мен ауысу тетіктері бар.",
      details_ru: "Неполучение госгранта в первом туре не закрывает доступ к высшему образованию — существуют целевые гранты акима, благотворительные фонды и перевод с платного по высокому GPA.",
      sources: [
        { name: "Астана қаласы Білім басқармасы", url: "https://www.gov.kz/memleket/entities/astana-bilim" },
        { name: "'Қазақстан халқына' қоры", url: "https://qazaqstanhalqyna.kz" },
        { name: "ForteBank Абитуриент жолсілтемесі", url: "/docs/ForteBank_RU_print_compact.pdf" }
      ]
    },
    "documents": {
      title_kz: "Оқуға түсу үшін қажетті құжаттардың толық тізімі (ЖОО және колледж)",
      title_ru: "Полный перечень документов для поступления в вузы и колледжи",
      academic_year: "2026-2027",
      steps_kz: [
        "1. Жеке куәлік (түпнұсқасы және электронды көшірмелері).",
        "2. ҰБТ мемлекеттік сертификаты (app.testcenter.kz арқылы QR-кодталған нұсқасы).",
        "3. Білім туралы құжат: мектептен кейін — орта білім аттестаты түпнұсқасы; колледжден кейін — диплом мен қосымшасы.",
        "4. 075-У нысанындағы медициналық анықтама + флюорографиялық түсірілім (жарамдылық мерзімі — 6 ай).",
        "5. 063 нысанындағы егу картасы немесе баланың денсаулық паспорты.",
        "6. 3×4 см көлеміндегі 6 дана сапалы фотосурет.",
        "7. Ер азаматтар үшін — әскерге шақыру учаскесіне тіркелу туралы куәлік (приписное свидетельство).",
        "8. Қабылдау комиссиясының белгіленген үлгідегі өтініші (университетте немесе eGov.kz арқылы толтырылады)."
      ],
      steps_ru: [
        "1. Удостоверение личности (оригинал и цифровые копии).",
        "2. Сертификат ЕНТ (электронный сертификат с QR-кодом от Национального центра тестирования).",
        "3. Документ об образовании: после школы — подлинник аттестата с приложением; после колледжа — диплом с приложением.",
        "4. Медицинская справка по форме 075-У со снимком флюорографии (срок действия — 6 месяцев).",
        "5. Карта профилактических прививок формы 063 (паспорт здоровья).",
        "6. 6 фотографий размером 3×4 см.",
        "7. Для юношей — приписное свидетельство (приписка к призывному участку).",
        "8. Заявление о приеме по установленному образцу (в приемной комиссии вуза или онлайн через eGov.kz)."
      ],
      details_kz: "Құжаттарды қабылдау университеттерде шілде айынан бастап тамыздың 25-не дейін жүргізіледі. Әлеуметтік немесе квоталық санаттары бар талапкерлер растайтын электронды анықтамаларын eGov.kz арқылы алдын ала әзірлеп алуы қажет.",
      details_ru: "Прием документов в вузах Астаны и РК осуществляется в июле-августе. Документы могут быть поданы как очно в приемную комиссию, так и онлайн через портал электронного правительства eGov.kz.",
      sources: [
        { name: "StudentHub.kz База знаний", url: "https://studenthub.kz/kb/perechen-neobhodimyh-dokumentov-dlya-postupleniya/" },
        { name: "eGov.kz Электронное правительство РК", url: "https://egov.kz" },
        { name: "ҚР Ғылым және жоғары білім министрлігі", url: "https://testcenter.kz" }
      ]
    },
    "creative-exam": {
      title_kz: "Творчестволық емтихандар: талапкер нені білуі керек?",
      title_ru: "Творческий экзамен: что нужно знать абитуриенту",
      academic_year: "2026-2027",
      steps_kz: [
        "1-қадам: Шығармашылық мамандықты анықтаңыз (Сәулет, Дизайн, Журналистика, Дене шынықтыру, Музыка, Театр).",
        "2-қадам: ҰБТ-да тек екі міндетті пәнді тапсырыңыз (Қазақстан тарихы + Оқу сауаттылығы, макс. 50 балл). Шығармашылық бағытқа бейіндік 2 пән тапсырылмайды.",
        "3-қадам: Маусымның 20-сынан бастап таңдалған бір ЖОО-ның қабылдау комиссиясына шығармашылық емтиханға өтініш өткізіңіз (Тек бір ЖОО-ға тапсыруға рұқсат).",
        "4-қадам: Шілденің 7-20 аралығында ЖОО қабырғасында өтетін 2 арнайы шығармашылық емтиханды (сурет, композиция, эссе, спорттық норматив) тапсырыңыз.",
        "5-қадам: ҰБТ балы (макс 50) + 2 емтихан балы (макс 45 + 45 = 90) қосылып, жалпы 140 баллдық жүйе бойынша республикалық гранттар байқауына қатысасыз."
      ],
      steps_ru: [
        "Шаг 1: Определите специальность творческого профиля (Архитектура, Дизайн, Журналистика, Физическая культура, Аудиовизуальное искусство).",
        "Шаг 2: На ЕНТ сдавайте только 2 обязательных предмета (История Казахстана + Грамотность чтения, макс. 50 баллов).",
        "Шаг 3: С 20 июня подайте документы на сдачу экзамена в приемную комиссию выбранного вуза (подача разрешена строго в один вуз).",
        "Шаг 4: С 7 по 20 июля сдайте 2 творческих экзамена непосредственно в университете (рисунок, эссе, композиция, спортивные нормативы).",
        "Шаг 5: Итоговый балл суммируется: ЕНТ (до 50) + два экзамена (до 90) = конкурсный балл из 140 для участия в общем конкурсе грантов."
      ],
      details_kz: "Шығармашылық емтихан нәтижелері тек тапсырған университет шеңберінде ғана жарамды. Басқа оқу орнына шығармашылық емтихан балын ауыстыруға тыйым салынады. Әр емтиханнан кемінде 5 балл жинау міндетті.",
      details_ru: "Каждый экзамен оценивается по шкале до 45 баллов. Минимальный проходной порог по каждому творческому экзамену составляет не менее 5 баллов. Пересдача не допускается.",
      sources: [
        { name: "StudentHub.kz База знаний", url: "https://studenthub.kz/kb/tvorcheskiy-ekzamen-chto-nuzhno-znat-abiturientu/" },
        { name: "ҚР ҒЖБМ қабылдау ережелері", url: "https://testcenter.kz" }
      ]
    },
    "transfer-university": {
      title_kz: "Университеттен университетке ауысу ережелері (Қазақстан)",
      title_ru: "Перевод из одного университета в другой в Казахстане",
      academic_year: "2026-2027",
      steps_kz: [
        "1-шарт: Ауысу тек қысқы және жазғы каникул кезеңдерінде (бірінші семестрді немесе оқу жылын толық бітірген соң) жүзеге асады.",
        "2-шарт: Академиялық қарыздың (debt) болмауы және пәндер бойынша кредиттердің сәйкес келуі (GPA оң деңгейде).",
        "3-қадам: Қабылдаушы ЖОО-ның деканатынан оқу бағдарламаларының айырмашылығын (академиялық айырма, әдетте 15-20 ECTS-тен аспауы тиіс) есептетіңіз.",
        "4-қадам: Қазіргі оқитын оқу орныңыздан транскрипт (бағалар парағын) алып, ректордың атына ауысуға рұқсат сұраған өтініш жазыңыз.",
        "5-қадам: Қабылдаушы ЖОО-ға транскрипт пен өтінішті тапсырып, бұйрық шыққан соң жеке іс құжаттарыңызды жаңа ЖОО-ға өткізіңіз."
      ],
      steps_ru: [
        "Условие 1: Перевод допускается в периоды летних (июнь-август) и зимних каникул после успешного завершения как минимум 1-го семестра.",
        "Условие 2: Отсутствие академической задолженности и соблюдение проходного балла GPA.",
        "Шаг 3: Предоставьте транскрипт в принимающий вуз для сверки учебных планов и определения академической разницы (не более 15-20 кредитов).",
        "Шаг 4: Подайте заявление об отчислении в порядке перевода в исходном университете и получите письменный запрос принимающего вуза.",
        "Шаг 5: Перевод с гранта на грант возможен при совпадении группы программ и наличии вакантного бюджетного места."
      ],
      details_kz: "Мемлекеттік білім грантымен оқитын студенттер грантты сақтай отырып бір ЖОО-дан екіншісіне тек бірдей білім беру тобы бойынша ауыса алады.",
      details_ru: "При переводе студента-грантника на платную основу или при смене специальности без сохранения гранта заключается новый договор об оказании образовательных услуг.",
      sources: [
        { name: "StudentHub.kz База знаний", url: "https://studenthub.kz/kb/perevod-iz-odnogo-universiteta-v-drugoy-v-kazahstane/" },
        { name: "ҚР ҒЖБМ № 19 Бұйрығы", url: "https://adilet.zan.kz/rus/docs/V080005134_" }
      ]
    },
    "ent-rules": {
      title_kz: "ҰБТ ережелері: тыйым салынған заттар және жауапкершілік",
      title_ru: "Правила ЕНТ: запрещенные предметы и последствия нарушений",
      academic_year: "2026-2027",
      steps_kz: [
        "1. Қатаң тыйым салынған заттар: кез келген ұялы телефон, смарт-сағат, калькулятор, құлаққап, шпаргалка, сымсыз байланыс құралдары.",
        "2. Аудиториядағы тәртіп: басқа қатысушылармен сөйлесуге, орын ауыстыруға, парақтармен алмасуға үзілді-кесілді тыйым салынады.",
        "3. Шығу регламенті: компьютерлік сыныптан тестілеу әкімшісінің рұқсатынсыз 10 минуттан артық уақытқа шығуға болмайды.",
        "4. Бейнебақылау және жасанды интеллект: емтихан барысы екі бейнекамера арқылы жазылып, емтихан біткен соң да жыл соңына дейін сарапталады.",
        "5. Жаза: ережені бұзған қатысушы тесттен шығарылып, сол жылғы барлық ҰБТ нәтижелері жойылады және грант байқауынан шеттетіледі."
      ],
      steps_ru: [
        "1. Запрещенные предметы: мобильные телефоны, смарт-часы, наушники, шпаргалки, калькуляторы, корректирующие жидкости и любые гаджеты.",
        "2. Поведение в аудитории: запрещено разговаривать, пересаживаться, меняться черновиками или выносить черновики из класса.",
        "3. Выход из аудитории: не более чем на 10 минут с разрешения дежурного администратора ППЕНТ.",
        "4. Видеофиксация и ИИ: ведется непрерывная видеозапись каждого рабочего места; архив видео перепроверяется до конца календарного года.",
        "5. Ответственность: при обнаружении запрещенных предметов результаты тестирования аннулируются без права пересдачи в текущем периоде."
      ],
      details_kz: "Ұлттық тестілеу орталығының ережелеріне сәйкес тыйым салынған зат аудиторияға кіру кезіндегі тексерісте анықталса да тестіленуші сол мүмкіндігінен айырылады.",
      details_ru: "Даже при попытке проноса запрещенного устройства на металлоискателе составляется акт, и абитуриент лишается текущей попытки сдачи тестирования.",
      sources: [
        { name: "StudentHub.kz База знаний", url: "https://studenthub.kz/kb/chto-zaprescheno-pri-provedenii-ent/" },
        { name: "Ұлттық тестілеу орталығы (НЦТ)", url: "https://testcenter.kz" }
      ]
    },
    "ait-test": {
      title_kz: "Жаңа AIT тесті және ҰБТ болашағы (ETS және ҒЖБМ жобасы)",
      title_ru: "Новый тест AIT и будущее ЕНТ (Проект МНВО РК и ETS)",
      academic_year: "2026-2027",
      steps_kz: [
        "1-факт: AIT (Admissions Insight Test) — ҚР ҒЖБМ, Ұлттық тестілеу орталығы және халықаралық ETS ұйымымен бірлесіп жасалып жатқан жаңа формат.",
        "2-факт: Мақсаты — тек жаттанды фактілерді емес, талапкердің сыни ойлауын, мәліметтерді талдау және мәселелерді шешу қабілетін өлшеу.",
        "3-факт: Пилоттық сынақ 2027 жылдың көктеміне жоспарланған. 2026-2027 оқу жылындағы қабылдау толықтай дәстүрлі ҰБТ бойынша өтеді.",
        "4-факт: Жаңа жүйеге көшу кезең-кезеңімен жүзеге асады және талапкерлерге алдын ала демо-нұсқалар мен дайындық материалдары беріледі."
      ],
      steps_ru: [
        "Факт 1: AIT (Admissions Insight Test) — разрабатываемый национальный экзамен совместно с международной компанией Educational Testing Service (ETS, разработчик TOEFL и GRE).",
        "Факт 2: Фокус теста — оценка критического мышления, функциональной грамотности, логики и умения решать комплексные аналитические задачи.",
        "Факт 3: Пилотная апробация намечена на весну 2027 года; в текущей кампании 2026-2027 года порядок сдачи ЕНТ остается прежним.",
        "Факт 4: Внедрение не станет резким шоком — разработчики гарантируют переходный период и предварительный доступ к открытым демо-версиям."
      ],
      details_kz: "Талапкерлерге алаңдаудың қажеті жоқ: 2026 жылы ЖОО мен гранттарға қабылдау бекітілген мемлекеттік стандартты ҰБТ форматымен жүргізіледі.",
      details_ru: "Новый тест AIT призван сблизить казахстанскую систему вступительных экзаменов с международными стандартами SAT и GRE, повышая справедливость распределения образовательных грантов.",
      sources: [
        { name: "StudentHub.kz База знаний", url: "https://studenthub.kz/kb/novyy-test-ait-v-kazahstane-zamenit-li-on-ent-v-2027-godu/" },
        { name: "ҚР Ғылым және жоғары білім министрлігі", url: "https://www.gov.kz/memleket/entities/sci" }
      ]
    }
  };

  const isBuiltin = Boolean(guides[slug]);

  useEffect(() => {
    if (isBuiltin) return;
    let active = true;
    setLoadingKb(true);
    api.getKnowledgeBaseBySlug(slug).then((data) => {
      if (active) {
        setKbArticle(data);
        setLoadingKb(false);
      }
    });
    return () => { active = false; };
  }, [slug, isBuiltin]);

  // If this slug belongs to the expanded StudentHub Knowledge Base
  if (!isBuiltin) {
    if (loadingKb) {
      return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center text-xs text-zinc-400">
          {lang === "kz" ? "Нұсқаулық жүктелуде..." : "Загрузка руководства..."}
        </div>
      );
    }

    if (kbArticle) {
      return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/guides"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === "kz" ? "Барлық нұсқаулықтар" : "Все руководства"}</span>
            </Link>

            <a
              href="/docs/ForteBank_RU_print_compact.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FDF2F7] border border-[#F99184]/40 text-[#A31551] hover:bg-[#fbe4ef] text-xs font-bold transition-all shadow-forte"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === "kz" ? "Жолсілтемені жүктеу (PDF)" : "Скачать справочник (PDF)"}</span>
            </a>
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] text-xs font-semibold border border-[#F99184]/40">
              <BookOpen className="w-3.5 h-3.5 text-[#A31551]" />
              <span>{kbArticle.source_name} • {kbArticle.academic_year}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight leading-tight">
              {lang === "kz" ? kbArticle.title_kk : kbArticle.title_ru}
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              {lang === "kz" ? kbArticle.summary_kk : kbArticle.summary_ru}
            </p>
          </div>

          {kbArticle.intro_paragraphs && kbArticle.intro_paragraphs.length > 0 && (
            <div className="p-5 sm:p-6 rounded-3xl border border-[#F99184]/30 bg-[#FDF2F7]/50 space-y-2.5 text-sm text-[#4A0221] leading-relaxed">
              {kbArticle.intro_paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}

          <div className="space-y-5">
            {(kbArticle.sections || []).map((sec, idx) => (
              <div key={idx} className="p-6 rounded-3xl border border-zinc-200 bg-white shadow-xs space-y-3">
                <h2 className="font-bold text-zinc-900 text-base sm:text-lg flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FDF2F7] text-[#A31551] text-xs font-black flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{sec.heading}</span>
                </h2>
                {sec.paragraphs?.map((p, pi) => (
                  <p key={pi} className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
                    {p}
                  </p>
                ))}
                {sec.bullets && sec.bullets.length > 0 && (
                  <ul className="space-y-2 pt-1">
                    {sec.bullets.map((b, bi) => (
                      <li key={bi} className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 flex items-start gap-2.5 text-xs sm:text-sm text-zinc-800">
                        <CheckCircle2 className="w-4 h-4 text-[#A31551] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-white border border-zinc-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-bold text-zinc-700">{t.verification.source}: {kbArticle.source_name}</span>
            <a
              href={kbArticle.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#A31551] hover:text-[#820232] font-semibold"
            >
              <span>{lang === "kz" ? "Түпнұсқа мақаланы ашу" : "Открыть первоисточник"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      );
    }
  }

  const guide = guides[slug] || guides["grade-11"];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top back & pdf button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.nav.home}</span>
        </Link>

        <a
          href="/docs/ForteBank_RU_print_compact.pdf"
          target="_blank"
          rel="noopener noreferrer"
          download
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FDF2F7] border border-[#F99184]/40 text-[#A31551] hover:bg-[#fbe4ef] text-xs font-bold transition-all shadow-forte"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{lang === "kz" ? "Жолсілтемені жүктеп алу (PDF)" : "Скачать справочник (PDF)"}</span>
        </a>
      </div>

      {/* Guide Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] text-xs font-semibold border border-[#F99184]/40">
          <Calendar className="w-3.5 h-3.5 text-[#A31551]" />
          <span>{guide.academic_year} {t.verification.academicCycle}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          {lang === "kz" ? guide.title_kz : guide.title_ru}
        </h1>
      </div>

      {/* IF QUOTAS GUIDE: Render Quota Table */}
      {guide.isQuotas && (
        <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-xs space-y-0">
          <div className="p-4 sm:p-5 bg-zinc-50/80 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-[#A31551]" />
              <h2 className="font-bold text-zinc-900 text-sm sm:text-base">
                {lang === "kz" ? "ҚР қабылдау квоталарының пайыздық мөлшері" : "Размеры квот приема в РК"}
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-[#A31551] bg-[#FDF2F7] px-2 py-0.5 rounded-full border border-[#FC9385]/50">
              {t.verification.verified}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-zinc-100/70 border-b border-zinc-200 text-zinc-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3 sm:p-4 w-12 text-center">#</th>
                  <th className="p-3 sm:p-4">{lang === "kz" ? "Азаматтар санаты" : "Категория граждан"}</th>
                  <th className="p-3 sm:p-4 text-center whitespace-nowrap">{lang === "kz" ? "ЖОО квотасы" : "Квота в вузы"}</th>
                  <th className="p-3 sm:p-4 text-center whitespace-nowrap">{lang === "kz" ? "Колледж квотасы" : "Квота в колледж"}</th>
                  <th className="p-3 sm:p-4 whitespace-nowrap">{lang === "kz" ? "Нормативтік негіз" : "Правовая норма"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {officialQuotasData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="p-3 sm:p-4 font-bold text-zinc-400 text-center">{idx + 1}</td>
                    <td className="p-3 sm:p-4 font-medium text-zinc-900">
                      {lang === "kz" ? row.category_kz : row.category_ru}
                    </td>
                    <td className="p-3 sm:p-4 font-extrabold text-[#A31551] text-center whitespace-nowrap">
                      {row.quota_uni}
                    </td>
                    <td className="p-3 sm:p-4 font-extrabold text-[#820232] text-center whitespace-nowrap">
                      {row.quota_college}
                    </td>
                    <td className="p-3 sm:p-4 whitespace-nowrap">
                      <a
                        href={row.legal_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-500 hover:text-[#A31551] underline"
                      >
                        <span>{row.legal_basis}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Step by step checklist */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="font-bold text-zinc-900 text-base">
          {lang === "kz" ? "Қадамдық әрекеттер жоспары мен талаптар:" : "Пошаговый план действий и требования:"}
        </h2>
        <div className="space-y-3">
          {(lang === "kz" ? guide.steps_kz : guide.steps_ru).map((step, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 flex items-start gap-3 text-xs sm:text-sm text-zinc-800">
              <CheckCircle2 className="w-4 h-4 text-[#A31551] shrink-0 mt-0.5" />
              <span className="font-medium">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Important explanation */}
      <div className="rounded-2xl border border-[#F99184]/30 bg-[#FDF2F7]/60 p-6 text-xs sm:text-sm text-[#4A0221] leading-relaxed space-y-2">
        <div className="font-bold flex items-center gap-1.5 text-[#A31551]">
          <HelpCircle className="w-4 h-4 text-[#A31551]" />
          <span>{lang === "kz" ? "Түсіндірме мен заңды негіз" : "Пояснения и нормативно-правовая база"}</span>
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
              className="inline-flex items-center gap-1 text-[#A31551] hover:text-[#820232] font-semibold"
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
