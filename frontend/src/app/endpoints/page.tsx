"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Terminal,
  Play,
  Copy,
  Check,
  ExternalLink,
  Code,
  Database,
  Sparkles,
  ShieldCheck,
  Clock,
  ChevronRight,
  Layers,
  ArrowRight
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface EndpointDef {
  id: string;
  category: "studenthub" | "education" | "careers" | "grants" | "system";
  method: "GET" | "POST";
  path: string;
  title_kz: string;
  title_ru: string;
  desc_kz: string;
  desc_ru: string;
  webLink?: string;
  params: {
    name: string;
    type: "query" | "path";
    defaultValue: string;
    placeholder: string;
    description_kz: string;
    description_ru: string;
  }[];
}

const ENDPOINTS: EndpointDef[] = [
  // 1. StudentHub & Calculator
  {
    id: "sh-calc",
    category: "studenthub",
    method: "GET",
    path: "/api/v1/studenthub/calculator",
    title_kz: "ҰБТ Грант Калькуляторы",
    title_ru: "Калькулятор грантов ЕНТ",
    desc_kz: "Балл, бейіндік пән және қала бойынша грантқа түсу ықтималдығы мен ЖОО-ларды есептеу.",
    desc_ru: "Расчет вероятности поступления на грант и подходящих вузов по баллу, паре предметов и городу.",
    webLink: "/calculator",
    params: [
      { name: "score", type: "query", defaultValue: "115", placeholder: "50 - 140", description_kz: "ҰБТ балы", description_ru: "Балл ЕНТ" },
      { name: "pair", type: "query", defaultValue: "Математика + Информатика", placeholder: "Бейіндік жұп", description_kz: "Бейіндік пәндер", description_ru: "Пара предметов" },
      { name: "city", type: "query", defaultValue: "Астана", placeholder: "Қала", description_kz: "Қала сүзгісі", description_ru: "Фильтр по городу" }
    ]
  },
  {
    id: "sh-programs",
    category: "studenthub",
    method: "GET",
    path: "/api/v1/studenthub/programs",
    title_kz: "StudentHub 218 мамандық тізімі",
    title_ru: "Каталог 218 программ StudentHub",
    desc_kz: "Бейіндік пән, қала, іздеу кілтсөзі және шекті балл бойынша сүзгіленетін бағдарламалар.",
    desc_ru: "Список образовательных программ с фильтрацией по предметной паре, городу и проходному баллу.",
    webLink: "/programs",
    params: [
      { name: "search", type: "query", defaultValue: "IT", placeholder: "іздеу...", description_kz: "Кілтсөз", description_ru: "Поисковый запрос" },
      { name: "pair", type: "query", defaultValue: "", placeholder: "Математика + Информатика", description_kz: "Пән жұбы", description_ru: "Пара предметов" },
      { name: "city", type: "query", defaultValue: "", placeholder: "Астана", description_kz: "Қала", description_ru: "Город" }
    ]
  },
  {
    id: "sh-program-slug",
    category: "studenthub",
    method: "GET",
    path: "/api/v1/studenthub/programs/{slug}",
    title_kz: "Нақты мамандық және ЖОО-лар",
    title_ru: "Детали программы и обучающие вузы",
    desc_kz: "Мамандық сипаттамасы, оқытатын барлық ЖОО-лар, олардың бағасы мен ҰБТ грант тарихы.",
    desc_ru: "Описание специальности, все обучающие вузы с ценами и статистика грантов ЕНТ.",
    webLink: "/programs/data-science",
    params: [
      { name: "slug", type: "path", defaultValue: "data-science", placeholder: "data-science", description_kz: "Мамандық slug-і", description_ru: "Слаг программы" }
    ]
  },
  {
    id: "sh-unis",
    category: "studenthub",
    method: "GET",
    path: "/api/v1/studenthub/universities",
    title_kz: "Қазақстанның 90 университеті",
    title_ru: "90 университетов Казахстана",
    desc_kz: "Қазақстанның 90 ЖОО реестрі, байланыс телефондары және әрқайсысының бағдарламалар саны.",
    desc_ru: "Реестр 90 вузов Казахстана, контакты и количество программ в каждом вузе.",
    webLink: "/universities",
    params: [
      { name: "city", type: "query", defaultValue: "Астана", placeholder: "Астана", description_kz: "Қала сүзгісі", description_ru: "Фильтр по городу" },
      { name: "search", type: "query", defaultValue: "", placeholder: "Атауы", description_kz: "Іздеу", description_ru: "Поиск" }
    ]
  },
  {
    id: "sh-uni-slug",
    category: "studenthub",
    method: "GET",
    path: "/api/v1/studenthub/universities/{slug}",
    title_kz: "Университет және мамандықтар каталогы",
    title_ru: "Вуз и его специальности",
    desc_kz: "Нақты ЖОО профилі, байланыс нөмірлері және осы ЖОО-да бар барлық бағдарламалар.",
    desc_ru: "Профиль вуза, контакты и полный список образовательных программ с баллами.",
    webLink: "/education",
    params: [
      { name: "slug", type: "path", defaultValue: "astana_it_university", placeholder: "astana_it_university", description_kz: "ЖОО slug-і", description_ru: "Слаг вуза" }
    ]
  },
  {
    id: "sh-ent-results",
    category: "studenthub",
    method: "GET",
    path: "/api/v1/studenthub/ent-results",
    title_kz: "128 мамандықтың ҰБТ грант шектері",
    title_ru: "Проходные баллы ЕНТ по 128 специальностям",
    desc_kz: "2024–2026 жылдардағы ҰБТ статистикасы: минималды, орташа балл және грант саны.",
    desc_ru: "Результаты ЕНТ 2024-2026: минимальный, средний балл и количество грантов.",
    webLink: "/grants",
    params: [
      { name: "search", type: "query", defaultValue: "", placeholder: "digital", description_kz: "Іздеу сөзі", description_ru: "Поисковый запрос" }
    ]
  },
  {
    id: "uv-gops",
    category: "studenthub",
    method: "GET",
    path: "/api/v1/gops",
    title_kz: "Бакалавриаттың 131 ГОП-ы (Univision.kz)",
    title_ru: "131 ГОП бакалавриата: гранты и пороги 2025 (Univision.kz)",
    desc_kz: "B001–B271 барлық ГОП кодтары, 2024–2025 жж. грант квоталары, ЖОО шектері және өту балдары.",
    desc_ru: "Все 131 группа образовательных программ (B001–B271), количество грантов 2024–2025, пороги и проходные баллы.",
    webLink: "/programs",
    params: [
      { name: "search", type: "query", defaultValue: "B057", placeholder: "B057", description_kz: "Код немесе атау", description_ru: "Код ГОП или название" },
      { name: "sort", type: "query", defaultValue: "grants", placeholder: "code / grants / score", description_kz: "Сұрыптау", description_ru: "Сортировка" }
    ]
  },
  {
    id: "uv-gop-code",
    category: "studenthub",
    method: "GET",
    path: "/api/v1/gops/{code}",
    title_kz: "Нақты ГОП бойынша ЖОО-лар кестесі (Univision.kz)",
    title_ru: "Детали ГОП: проходные баллы по каждому вузу",
    desc_kz: "ЖОО-лардың ішкі шекті балы, 2025 ж. грант алғандар саны, орташа және ең төменгі балл.",
    desc_ru: "Пороги вузов, статистика конкурса 2025 (мин/средн/макс балл по вузам) и перечень ОП.",
    webLink: "/programs?gop=B057",
    params: [
      { name: "code", type: "path", defaultValue: "B057", placeholder: "B057", description_kz: "ГОП коды", description_ru: "Код ГОП" }
    ]
  },
  {
    id: "uv-kb",
    category: "studenthub",
    method: "GET",
    path: "/api/v1/knowledge-base",
    title_kz: "Абитуриентке арналған 24+ нұсқаулық (StudentHub KB)",
    title_ru: "База знаний: 24 статьи ЕНТ/AIT-2027 и сводка грантов",
    desc_kz: "ҰБТ-2027 шекті балдары, AIT тесті, стипендия, құжаттар, демалыс күндері және грант бөлінісі.",
    desc_ru: "Пороговые баллы ЕНТ-2027, новый тест AIT, стипендии, документы, каникулы и объем грантов РК.",
    webLink: "/guides",
    params: [
      { name: "category", type: "query", defaultValue: "", placeholder: "ent / grants / stipends", description_kz: "Санат", description_ru: "Категория" }
    ]
  },

  // 2. Education & Astana Institutions
  {
    id: "kz-colleges",
    category: "education",
    method: "GET",
    path: "/api/v1/kz-colleges",
    title_kz: "Қазақстанның 688 колледжі (Gov.kz №707, 19 өңір)",
    title_ru: "Полный реестр 688 колледжей Казахстана (Gov.kz №707)",
    desc_kz: "Барлық 19 өңір (Астана 32, Алматы, Шымкент және 16 облыс): мекенжай, директор, телефон, мемлекеттік тапсырыс.",
    desc_ru: "Колледжи всех 19 регионов РК (Астана 32, Алматы, Шымкент, области) с адресами, телефонами и формой собственности.",
    webLink: "/colleges",
    params: [
      { name: "region", type: "query", defaultValue: "almaty", placeholder: "astana / almaty / shymkent / karaganda", description_kz: "Өңір", description_ru: "Регион" },
      { name: "ownership", type: "query", defaultValue: "", placeholder: "state / private", description_kz: "Меншік түрі", description_ru: "Форма собственности" }
    ]
  },
  {
    id: "kz-unis",
    category: "education",
    method: "GET",
    path: "/api/v1/kz-universities",
    title_kz: "Қазақстанның 143 ЖОО-сы (Gov.kz 657 + Univision + StudentHub)",
    title_ru: "143 вуза Казахстана: коды ЕНТ, ректоры и цены",
    desc_kz: "ҚР 20 өңірінің университеттері: 3 таңбалы ҰБТ коды, оқу ақысы, студент саны, ректор контактылары.",
    desc_ru: "Вузы по 20 регионам РК: 3-значный код ЕНТ, цены обучения, статистика студентов, ректоры и контакты.",
    webLink: "/universities",
    params: [
      { name: "search", type: "query", defaultValue: "013", placeholder: "013 / AITU / Алматы", description_kz: "Код немесе атау", description_ru: "Код ЕНТ или название" }
    ]
  },
  {
    id: "uv-professions",
    category: "careers",
    method: "GET",
    path: "/api/v1/professions",
    title_kz: "589 Бакалавриат мамандығы (Univision RU + KK)",
    title_ru: "589 профессий бакалавриата (Univision RU + KK)",
    desc_kz: "Мамандықтар салалар бойынша жіктелген және сәйкес оқу бағдарламаларымен байланыстырылған.",
    desc_ru: "Реестр профессий по отраслям со ссылками на программы обучения и вузы.",
    webLink: "/careers",
    params: [
      { name: "search", type: "query", defaultValue: "IT", placeholder: "IT / врач / инженер", description_kz: "Іздеу", description_ru: "Поиск" }
    ]
  },
  {
    id: "edu-colleges",
    category: "education",
    method: "GET",
    path: "/api/v1/colleges",
    title_kz: "Астананың 32 колледжі (Gov.kz 707)",
    title_ru: "Каталог 32 колледжей Астаны (Gov.kz 707)",
    desc_kz: "Астана қаласының барлық 32 колледжі: 5 аудан (Сарыарқа, Алматы, Байқоңыр, Есіл/Нұра, Сарайшық), мемлекеттік гранттар, байланыстар және жатақханалар.",
    desc_ru: "Все 32 колледжа Астаны: 5 районов, госзаказ/гранты акимата, специальности, телефоны и общежития.",
    webLink: "/colleges",
    params: [
      { name: "district", type: "query", defaultValue: "", placeholder: "Сарыарқа", description_kz: "Аудан сүзгісі", description_ru: "Район" },
      { name: "ownership", type: "query", defaultValue: "", placeholder: "state / private", description_kz: "Меншік түрі", description_ru: "Форма собственности" },
      { name: "specialization", type: "query", defaultValue: "", placeholder: "IT / Медицина / Политехникалық", description_kz: "Специализация", description_ru: "Направление" },
      { name: "search", type: "query", defaultValue: "", placeholder: "политехникалық", description_kz: "Іздеу сөзі", description_ru: "Поиск" }
    ]
  },
  {
    id: "edu-college-slug",
    category: "education",
    method: "GET",
    path: "/api/v1/colleges/{slug}",
    title_kz: "Нақты колледж деректері",
    title_ru: "Детализация конкретного колледжа",
    desc_kz: "Астана политехникалық немесе басқа колледж карточкасы, басшысы, жатақхана және байланыс желілері.",
    desc_ru: "Карточка колледжа: директор, адрес, общежитие, аккредитация и прямые телефоны.",
    webLink: "/education/institutions/astana-polytechnic-college",
    params: [
      { name: "slug", type: "path", defaultValue: "astana-polytechnic-college", placeholder: "astana-polytechnic-college", description_kz: "Колледж slug-і", description_ru: "Слаг колледжа" }
    ]
  },
  {
    id: "edu-insts",
    category: "education",
    method: "GET",
    path: "/api/v1/institutions",
    title_kz: "Астана оқу орындары (Gov.kz)",
    title_ru: "Каталог учебных заведений Астаны",
    desc_kz: "Gov.kz 707 және 657-баптары бойынша 100% тексерілген Астананың 14 ЖОО мен колледждері.",
    desc_ru: "14 вузов и колледжей Астаны, верифицированные по статьям 707 и 657 портала Gov.kz.",
    webLink: "/universities",
    params: [
      { name: "type", type: "query", defaultValue: "", placeholder: "university / college", description_kz: "Түрі (university / college)", description_ru: "Тип заведения" },
      { name: "status", type: "query", defaultValue: "verified", placeholder: "verified", description_kz: "Мәртебесі", description_ru: "Статус" }
    ]
  },
  {
    id: "edu-inst-slug",
    category: "education",
    method: "GET",
    path: "/api/v1/institutions/{slug}",
    title_kz: "Астана оқу орнының карточкасы",
    title_ru: "Карточка учебного заведения Астаны",
    desc_kz: "Заңды атауы, мекенжайы, телефоны, әскери кафедра, жатақхана және веб-сайты.",
    desc_ru: "Юридическое название, адрес, телефоны, военная кафедра, общежитие и сайт.",
    webLink: "/education/institutions/astana-it-university",
    params: [
      { name: "slug", type: "path", defaultValue: "astana-it-university", placeholder: "astana-it-university", description_kz: "Мекеме slug-і", description_ru: "Слаг учреждения" }
    ]
  },
  {
    id: "edu-progs",
    category: "education",
    method: "GET",
    path: "/api/v1/programs",
    title_kz: "Білім беру бағдарламалары (Классификатор)",
    title_ru: "Образовательные программы (Классификатор)",
    desc_kz: "Мемлекеттік классификатор бойынша бекітілген білім беру бағдарламалары мен кодтары.",
    desc_ru: "Образовательные программы и коды бакалавриата по государственному классификатору.",
    webLink: "/education",
    params: [
      { name: "group_id", type: "query", defaultValue: "", placeholder: "топ ID", description_kz: "Бағдарламалар тобы", description_ru: "Группа программ" }
    ]
  },
  {
    id: "edu-prog-code",
    category: "education",
    method: "GET",
    path: "/api/v1/programs/{code}",
    title_kz: "Бағдарлама коды бойынша ақпарат",
    title_ru: "Программа по коду классификатора",
    desc_kz: "Коды (мысалы 6B06101), бейіндік пәндер, оқытатын мекемелер мен шекті балл.",
    desc_ru: "Код (напр. 6B06101), профильные предметы и пороговый балл.",
    webLink: "/education/programs/6B06101",
    params: [
      { name: "code", type: "path", defaultValue: "6B06101", placeholder: "6B06101", description_kz: "Бағдарлама коды", description_ru: "Код программы" }
    ]
  },

  // 3. Careers & Directions
  {
    id: "car-directions",
    category: "careers",
    method: "GET",
    path: "/api/v1/directions",
    title_kz: "Білім беру бағыттары",
    title_ru: "Образовательные направления",
    desc_kz: "IT, Инженерия, Медицина, Құқық және басқа 11 базалық салалар каталогы.",
    desc_ru: "Каталог 11 основных образовательных направлений: IT, Инженерия, Медицина и др.",
    webLink: "/careers",
    params: []
  },
  {
    id: "car-list",
    category: "careers",
    method: "GET",
    path: "/api/v1/careers",
    title_kz: "Мамандықтар каталогы",
    title_ru: "Каталог профессий",
    desc_kz: "Профессиялар сипаттамасы, күнделікті міндеттер, қажетті дағдылар және оқытатын ЖОО-лар.",
    desc_ru: "Описание профессий, ежедневные обязанности, ключевые навыки и связанные вузы.",
    webLink: "/careers",
    params: [
      { name: "direction", type: "query", defaultValue: "", placeholder: "it", description_kz: "Бағыт slug-і", description_ru: "Слаг направления" }
    ]
  },
  {
    id: "car-slug",
    category: "careers",
    method: "GET",
    path: "/api/v1/careers/{slug}",
    title_kz: "Нақты мамандық траекториясы",
    title_ru: "Траектория конкретной профессии",
    desc_kz: "Мамандық → Дағдылар → Оқу бағдарламалары → Оқу орындары → Түсу талаптары.",
    desc_ru: "Полная траектория: Профессия → Навыки → Программы → Вузы → Требования.",
    webLink: "/careers/software-engineer",
    params: [
      { name: "slug", type: "path", defaultValue: "software-engineer", placeholder: "software-engineer", description_kz: "Мамандық slug-і", description_ru: "Слаг профессии" }
    ]
  },

  // 4. Grants & Opportunities
  {
    id: "gr-list",
    category: "grants",
    method: "GET",
    path: "/api/v1/grants",
    title_kz: "Гранттар мен стипендиялар реестрі",
    title_ru: "Реестр грантов и стипендий",
    desc_kz: "Мемлекеттік, Астана әкімі, ForteBank және университеттік гранттар мен жеңілдіктер.",
    desc_ru: "Государственные гранты, гранты акима Астаны, ForteBank, ректорские скидки.",
    webLink: "/grants",
    params: [
      { name: "type", type: "query", defaultValue: "", placeholder: "akimat_astana / national / corporate", description_kz: "Грант түрі", description_ru: "Тип гранта" },
      { name: "level", type: "query", defaultValue: "", placeholder: "bachelor", description_kz: "Деңгейі", description_ru: "Уровень" }
    ]
  },
  {
    id: "gr-slug",
    category: "grants",
    method: "GET",
    path: "/api/v1/grants/{slug}",
    title_kz: "Гранттың толық шарттары",
    title_ru: "Условия гранта",
    desc_kz: "Қамту көлемі, құжаттар тізімі, үміткерлерге талаптар және қабылдау сілтемесі.",
    desc_ru: "Покрытие расходов, перечень документов, критерии отбора и ссылка на подачу.",
    webLink: "/grants/astana-akimat-grant",
    params: [
      { name: "slug", type: "path", defaultValue: "astana-akimat-grant", placeholder: "astana-akimat-grant", description_kz: "Грант slug-і", description_ru: "Слаг гранта" }
    ]
  },
  {
    id: "opp-list",
    category: "grants",
    method: "GET",
    path: "/api/v1/opportunities",
    title_kz: "Мүмкіндіктер (Тегін курстар, Олимпиада, Tech Orda)",
    title_ru: "Возможности (Курсы, Олимпиады, Tech Orda)",
    desc_kz: "Астана оқушылары мен студенттеріне арналған тегін курстар, олимпиадалар, хакатондар.",
    desc_ru: "Бесплатные курсы, ваучеры, олимпиады, хакатоны и стажировки для молодежи Астаны.",
    webLink: "/opportunities",
    params: [
      { name: "type", type: "query", defaultValue: "", placeholder: "course / olympiad / hackathon", description_kz: "Түрі", description_ru: "Тип" },
      { name: "cost", type: "query", defaultValue: "free", placeholder: "free", description_kz: "Құны", description_ru: "Стоимость" }
    ]
  },
  {
    id: "opp-slug",
    category: "grants",
    method: "GET",
    path: "/api/v1/opportunities/{slug}",
    title_kz: "Мүмкіндік сипаттамасы мен өтінім",
    title_ru: "Детали возможности и подача заявки",
    desc_kz: "Қатысушыларға қойылатын талаптар, ұзақтығы, мерзімдері және сайтқа өту.",
    desc_ru: "Требования к участникам, продолжительность, дедлайны и переход к регистрации.",
    webLink: "/opportunities/tech-orda-voucher",
    params: [
      { name: "slug", type: "path", defaultValue: "tech-orda-voucher", placeholder: "tech-orda-voucher", description_kz: "Slug", description_ru: "Слаг" }
    ]
  },

  // 5. System, Deadlines, Sources & Health
  {
    id: "sys-deadlines",
    category: "system",
    method: "GET",
    path: "/api/v1/deadlines",
    title_kz: "Мерзімдер күнтізбесі (Deadlines)",
    title_ru: "Календарь дедлайнов (Deadlines)",
    desc_kz: "Гранттарға, колледждер мен ЖОО-ларға құжат қабылдаудың бекітілген мерзімдері.",
    desc_ru: "Сроки подачи документов на гранты, в колледжи и вузы.",
    webLink: "/deadlines",
    params: []
  },
  {
    id: "sys-sources",
    category: "system",
    method: "GET",
    path: "/api/v1/sources",
    title_kz: "Нормативтік дереккөздер",
    title_ru: "Реестр нормативных источников",
    desc_kz: "Gov.kz, ҰТО, Астана білім басқармасы және «Әділет» заңнамалық актілерінің реестрі.",
    desc_ru: "Реестр НПА и источников данных: Gov.kz, НЦТ, Управление образования Астаны.",
    webLink: "/sources",
    params: []
  },
  {
    id: "sys-search",
    category: "system",
    method: "GET",
    path: "/api/v1/search",
    title_kz: "Жаһандық платформалық іздеу",
    title_ru: "Глобальный поиск по платформе",
    desc_kz: "Барлық мамандықтар, оқу орындары, гранттар мен бағдарламалар бойынша бір уақытта іздеу.",
    desc_ru: "Сквозной поиск по всем профессиям, вузам, колледжам, грантам и возможностям.",
    webLink: "/",
    params: [
      { name: "q", type: "query", defaultValue: "IT", placeholder: "IT", description_kz: "Іздеу сұранысы", description_ru: "Поисковый запрос" }
    ]
  },
  {
    id: "sys-health",
    category: "system",
    method: "GET",
    path: "/api/v1/health",
    title_kz: "Сервер денсаулығы (Health Check)",
    title_ru: "Проверка здоровья API (Health Check)",
    desc_kz: "Сервер күйі, оқу жылы және API нұсқасы туралы жүйелік метадеректер.",
    desc_ru: "Статус сервера, учебный год и системные метаданные платформы.",
    params: []
  }
];

export default function EndpointsPage() {
  const { lang } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [paramValues, setParamValues] = useState<Record<string, Record<string, string>>>(() => {
    const init: Record<string, Record<string, string>> = {};
    ENDPOINTS.forEach((ep) => {
      init[ep.id] = {};
      ep.params.forEach((p) => {
        init[ep.id][p.name] = p.defaultValue;
      });
    });
    return init;
  });

  const [loadingEp, setLoadingEp] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, { status: number; durationMs: number; sizeBytes: number; data: any }>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredEndpoints = ENDPOINTS.filter((ep) => {
    if (selectedCategory === "all") return true;
    return ep.category === selectedCategory;
  });

  const handleParamChange = (epId: string, paramName: string, value: string) => {
    setParamValues((prev) => ({
      ...prev,
      [epId]: {
        ...(prev[epId] || {}),
        [paramName]: value,
      },
    }));
  };

  const buildUrl = (ep: EndpointDef) => {
    let resolvedPath = ep.path;
    const currentParams = paramValues[ep.id] || {};
    const queryParams = new URLSearchParams();

    ep.params.forEach((p) => {
      const val = currentParams[p.name] ?? p.defaultValue;
      if (p.type === "path") {
        resolvedPath = resolvedPath.replace(`{${p.name}}`, encodeURIComponent(val));
      } else if (p.type === "query" && val) {
        queryParams.set(p.name, val);
      }
    });

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
    return `${resolvedPath}${queryString}`;
  };

  const handleExecute = async (ep: EndpointDef) => {
    setLoadingEp(ep.id);
    const start = performance.now();
    const finalUrl = buildUrl(ep);

    try {
      const res = await fetch(finalUrl, {
        headers: { Accept: "application/json" },
      });
      const durationMs = Math.round(performance.now() - start);
      const text = await res.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
      setResponses((prev) => ({
        ...prev,
        [ep.id]: {
          status: res.status,
          durationMs,
          sizeBytes: new Blob([text]).size,
          data,
        },
      }));
    } catch (err: any) {
      const durationMs = Math.round(performance.now() - start);
      setResponses((prev) => ({
        ...prev,
        [ep.id]: {
          status: 500,
          durationMs,
          sizeBytes: 0,
          data: { error: err.message || "Network request failed" },
        },
      }));
    } finally {
      setLoadingEp(null);
    }
  };

  const handleCopyCurl = (ep: EndpointDef) => {
    const fullUrl = `https://fss.piupiu.kz${buildUrl(ep)}`;
    const curl = `curl -X ${ep.method} "${fullUrl}" -H "Accept: application/json"`;
    navigator.clipboard.writeText(curl);
    setCopiedId(`curl-${ep.id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyJSON = (epId: string, data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedId(`json-${epId}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F7] text-[#A31551] text-xs font-semibold border border-[#F99184]/40">
          <Terminal className="w-3.5 h-3.5" />
          <span>{lang === "kz" ? "Ашық деректер мен сервистер" : "Открытые данные и сервисы"}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          {lang === "kz" ? "Платформа деректері мен сервистері" : "Каталог сервисов и данных платформы"}
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base max-w-3xl leading-relaxed">
          {lang === "kz"
            ? "Платформадағы барлық білім деректері (мамандықтар, ЖОО-лар, Астана колледждері, гранттар, калькулятор) осы бөлімде ашық ұсынылған. Кез келген деректі нақты уақытта көруге және сәйкес бетке тікелей өтуге болады."
            : "Все образовательные данные платформы (специальности, вузы, колледжи Астаны, гранты, калькулятор) собраны в этом разделе. Вы можете просмотреть любые данные или мгновенно перейти на соответствующую страницу."}
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        {[
          { id: "all", label_kz: `Барлығы (${ENDPOINTS.length})`, label_ru: `Все (${ENDPOINTS.length})` },
          { id: "studenthub", label_kz: "StudentHub & ҰБТ", label_ru: "StudentHub и ЕНТ" },
          { id: "education", label_kz: "Оқу орындары (Gov.kz)", label_ru: "Вузы и колледжи (Gov.kz)" },
          { id: "careers", label_kz: "Мамандықтар", label_ru: "Профессии" },
          { id: "grants", label_kz: "Гранттар мен Мүмкіндіктер", label_ru: "Гранты и возможности" },
          { id: "system", label_kz: "Мерзімдер & Дереккөздер", label_ru: "Дедлайны и источники" },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2.5 rounded-full font-semibold whitespace-nowrap transition-all ${selectedCategory === cat.id
                ? "bg-[#A31551] text-white shadow-forte font-bold"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              }`}
          >
            {lang === "kz" ? cat.label_kz : cat.label_ru}
          </button>
        ))}
      </div>

      {/* Endpoints List */}
      <div className="space-y-6">
        {filteredEndpoints.map((ep) => {
          const resp = responses[ep.id];
          const isLoading = loadingEp === ep.id;
          const currentUrl = buildUrl(ep);

          return (
            <div
              key={ep.id}
              className="rounded-3xl border border-zinc-200 bg-white overflow-hidden shadow-xs hover:border-zinc-300 transition-all"
            >
              {/* Endpoint Header Bar */}
              <div className="p-4 sm:p-5 bg-zinc-50/70 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-[#FDF2F7] text-[#4A0221]">
                    {ep.method}
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-semibold text-zinc-900 break-all">
                    {ep.path}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {ep.webLink && (
                    <Link
                      href={ep.webLink}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#FDF2F7] text-[#A31551] hover:bg-[#fbe4ef] text-xs font-semibold transition-colors"
                    >
                      <span>{lang === "kz" ? "Сайтта ашу" : "В интерфейсе"}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => handleCopyCurl(ep)}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-medium transition-colors"
                  >
                    {copiedId === `curl-${ep.id}` ? (
                      <>
                        <Check className="w-3 h-3 text-[#A31551]" />
                        <span className="text-[#A31551] font-semibold">{lang === "kz" ? "Көшірілді" : "Скопировано"}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-zinc-400" />
                        <span>cURL</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExecute(ep)}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#A31551] hover:bg-[#820232] text-white text-xs font-bold transition-colors shadow-forte disabled:opacity-50"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isLoading ? (lang === "kz" ? "Жүктелуде..." : "Запрос...") : (lang === "kz" ? "Орындау" : "Выполнить")}</span>
                  </button>
                </div>
              </div>

              {/* Endpoint Details & Parameter Form */}
              <div className="p-4 sm:p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-zinc-900 text-sm sm:text-base">
                    {lang === "kz" ? ep.title_kz : ep.title_ru}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 mt-0.5 leading-relaxed">
                    {lang === "kz" ? ep.desc_kz : ep.desc_ru}
                  </p>
                </div>

                {/* Parameters list */}
                {ep.params.length > 0 && (
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-3">
                    <div className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                      {lang === "kz" ? "Сұраныс параметрлері (Интерактивті):" : "Параметры запроса (Интерактивные):"}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {ep.params.map((p) => {
                        const val = paramValues[ep.id]?.[p.name] ?? p.defaultValue;

                        return (
                          <div key={p.name} className="space-y-1">
                            <label className="text-[11px] font-semibold text-zinc-600 flex items-center justify-between">
                              <span className="font-mono">{p.name}</span>
                              <span className="text-[10px] text-zinc-400 capitalize">{p.type}</span>
                            </label>
                            <input
                              type="text"
                              value={val}
                              onChange={(e) => handleParamChange(ep.id, p.name, e.target.value)}
                              placeholder={p.placeholder}
                              className="w-full px-4 py-2 rounded-full border border-zinc-200 bg-white text-xs font-mono text-zinc-900 focus:outline-hidden focus:border-[#A31551] focus:ring-1 focus:ring-[#A31551]"
                            />
                            <div className="text-[10px] text-zinc-500">
                              {lang === "kz" ? p.description_kz : p.description_ru}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Current Computed URL */}
                <div className="text-xs text-zinc-500 flex items-center justify-between font-mono bg-zinc-100/60 p-2.5 rounded-xl border border-zinc-200/60">
                  <span className="truncate pr-2">
                    URL: <strong className="text-zinc-800">{currentUrl}</strong>
                  </span>
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#A31551] hover:text-[#820232] shrink-0 font-sans font-semibold text-[11px] flex items-center gap-1"
                  >
                    <span>JSON көру</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Response Viewer */}
                {resp && (
                  <div className="space-y-2 pt-2 border-t border-zinc-100">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded-md ${resp.status === 200
                              ? "bg-[#FDF2F7] text-[#4A0221]"
                              : "bg-[#FBE4EF] text-[#820232]"
                            }`}
                        >
                          {resp.status} OK
                        </span>
                        <span className="text-zinc-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-zinc-400" />
                          <span>{resp.durationMs} ms</span>
                        </span>
                        <span className="text-zinc-400 text-[11px]">
                          ({Math.round(resp.sizeBytes / 1024 * 10) / 10} KB)
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyJSON(ep.id, resp.data)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-600 hover:text-zinc-900"
                      >
                        {copiedId === `json-${ep.id}` ? (
                          <span className="text-[#A31551] font-bold">Көшірілді!</span>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>JSON көшіру</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-4 rounded-xl bg-zinc-950 text-zinc-200 font-mono text-xs overflow-x-auto max-h-80 scrollbar-thin">
                      {JSON.stringify(resp.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
