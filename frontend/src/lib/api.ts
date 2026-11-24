import { 
  Institution, 
  Career, 
  Grant, 
  Opportunity, 
  EducationProgram, 
  Deadline, 
  SearchResponse, 
  Source, 
  Direction 
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1` : "/api/v1";

async function fetchJSON<T>(endpoint: string, fallbackData: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      next: { revalidate: 60 },
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      console.warn(`API [${endpoint}] returned status ${res.status}. Using fallback.`);
      return fallbackData;
    }
    return await res.json();
  } catch (err) {
    console.warn(`API [${endpoint}] network error:`, err);
    return fallbackData;
  }
}

export const api = {
  async getDirections(): Promise<Direction[]> {
    return fetchJSON<Direction[]>("/directions", fallbackDirections);
  },

  async getCareers(direction?: string): Promise<Career[]> {
    const query = direction ? `?direction=${direction}` : "";
    return fetchJSON<Career[]>(`/careers${query}`, fallbackCareers);
  },

  async getCareerBySlug(slug: string): Promise<Career | null> {
    const career = await fetchJSON<Career | null>(`/careers/${slug}`, fallbackCareers.find(c => c.slug === slug) || null);
    return career;
  },

  async getInstitutions(type?: string, status?: string): Promise<Institution[]> {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (status) params.set("status", status);
    const query = params.toString() ? `?${params.toString()}` : "";
    return fetchJSON<Institution[]>(`/institutions${query}`, fallbackInstitutions);
  },

  async getInstitutionBySlug(slug: string): Promise<Institution | null> {
    const inst = await fetchJSON<Institution | null>(`/institutions/${slug}`, fallbackInstitutions.find(i => i.slug === slug) || null);
    return inst;
  },

  async getPrograms(groupId?: string): Promise<EducationProgram[]> {
    const query = groupId ? `?group_id=${groupId}` : "";
    return fetchJSON<EducationProgram[]>(`/programs${query}`, fallbackPrograms);
  },

  async getProgramByCode(code: string): Promise<EducationProgram | null> {
    const prog = await fetchJSON<EducationProgram | null>(`/programs/${code}`, fallbackPrograms.find(p => p.code === code) || null);
    return prog;
  },

  async getGrants(type?: string, level?: string): Promise<Grant[]> {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (level) params.set("level", level);
    const query = params.toString() ? `?${params.toString()}` : "";
    return fetchJSON<Grant[]>(`/grants${query}`, fallbackGrants);
  },

  async getGrantBySlug(slug: string): Promise<Grant | null> {
    const grant = await fetchJSON<Grant | null>(`/grants/${slug}`, fallbackGrants.find(g => g.slug === slug) || null);
    return grant;
  },

  async getOpportunities(type?: string, cost?: string): Promise<Opportunity[]> {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (cost) params.set("cost", cost);
    const query = params.toString() ? `?${params.toString()}` : "";
    return fetchJSON<Opportunity[]>(`/opportunities${query}`, fallbackOpportunities);
  },

  async getOpportunityBySlug(slug: string): Promise<Opportunity | null> {
    const opp = await fetchJSON<Opportunity | null>(`/opportunities/${slug}`, fallbackOpportunities.find(o => o.slug === slug) || null);
    return opp;
  },

  async getDeadlines(): Promise<Deadline[]> {
    return fetchJSON<Deadline[]>("/deadlines", fallbackDeadlines);
  },

  async search(q: string, type?: string): Promise<SearchResponse> {
    const params = new URLSearchParams({ q });
    if (type) params.set("type", type);
    try {
      const res = await fetch(`${API_BASE}/search?${params.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback local search
    }
    const lower = q.toLowerCase();
    const results = [
      ...fallbackCareers.filter(c => c.title_kz.toLowerCase().includes(lower) || c.title_ru.toLowerCase().includes(lower)).map(c => ({
        type: 'career' as const,
        id: c.id,
        slug: c.slug,
        title_kz: c.title_kz,
        title_ru: c.title_ru,
        subtitle_kz: "Мамандық",
        subtitle_ru: "Профессия",
        badge: "Мамандық",
        url: `/careers/${c.slug}`
      })),
      ...fallbackInstitutions.filter(i => i.name_kz.toLowerCase().includes(lower) || i.name_ru.toLowerCase().includes(lower)).map(i => ({
        type: 'institution' as const,
        id: i.id,
        slug: i.slug,
        title_kz: i.name_kz,
        title_ru: i.name_ru,
        subtitle_kz: i.institution_type === 'college' ? 'Колледж • Астана' : 'Университет • Астана',
        subtitle_ru: i.institution_type === 'college' ? 'Колледж • Астана' : 'Университет • Астана',
        badge: i.institution_type === 'college' ? 'Колледж' : 'Университет',
        url: `/education/institutions/${i.slug}`
      })),
      ...fallbackGrants.filter(g => g.title_kz.toLowerCase().includes(lower) || g.title_ru.toLowerCase().includes(lower)).map(g => ({
        type: 'grant' as const,
        id: g.id,
        slug: g.slug,
        title_kz: g.title_kz,
        title_ru: g.title_ru,
        subtitle_kz: g.provider_kz,
        subtitle_ru: g.provider_ru,
        badge: "Грант",
        url: `/grants/${g.slug}`
      })),
      ...fallbackOpportunities.filter(o => o.title_kz.toLowerCase().includes(lower) || o.title_ru.toLowerCase().includes(lower)).map(o => ({
        type: 'opportunity' as const,
        id: o.id,
        slug: o.slug,
        title_kz: o.title_kz,
        title_ru: o.title_ru,
        subtitle_kz: o.provider_kz,
        subtitle_ru: o.provider_ru,
        badge: "Мүмкіндік",
        url: `/opportunities/${o.slug}`
      })),
    ];
    return { query: q, total: results.length, results };
  },

  async getSources(): Promise<Source[]> {
    return fetchJSON<Source[]>("/sources", fallbackSources);
  }
};

// Verified Fallback Seed Data for Client-Side Reliability
const fallbackSources: Source[] = [
  {
    id: "src-1",
    url: "https://testcenter.kz/",
    title: "Ұлттық тестілеу орталығының ресми ережелері",
    organization: "ҚР ҒЖБМ ҰТО",
    source_type: "authority",
    academic_year: "2026-2027",
    retrieved_at: "2026-11-20",
    excerpt: "ҰБТ шекті балдары: Ұлттық ЖОО - кемінде 65 балл, Педагогика және медицина - 75 балл, Өзге ЖОО - 50 балл.",
    verification_status: "verified",
  },
  {
    id: "src-2",
    url: "https://www.gov.kz/memleket/entities/astana-bilim",
    title: "Астана қаласы Білім басқармасының мемлекеттік білім беру тапсырысы",
    organization: "Астана қаласы Білім басқармасы",
    source_type: "authority",
    academic_year: "2026-2027",
    retrieved_at: "2026-11-20",
    excerpt: "Астана қаласы әкімінің гранттары қалаға қажетті кадрларды даярлау үшін бөлінеді (педагогика, медицина, IT).",
    verification_status: "verified",
  },
  {
    id: "src-3",
    url: "https://astanait.edu.kz/",
    title: "Astana IT University ресми қабылдау ережелері",
    organization: "Astana IT University",
    source_type: "institution_official",
    academic_year: "2026-2027",
    retrieved_at: "2026-11-20",
    excerpt: "AITU қабылдау шекті балы: кемінде 65 балл (Математика + Информатика). Ректор гранттары олимпиада жүлдегерлеріне беріледі.",
    verification_status: "verified",
  },
];

const fallbackDirections: Direction[] = [
  { id: "dir-1", slug: "it-digital", name_kz: "IT және цифрлық технологиялар", name_ru: "IT и цифровые технологии", sort_order: 1 },
  { id: "dir-2", slug: "engineering", name_kz: "Инженерия және техникалық ғылымдар", name_ru: "Инженерия и технические науки", sort_order: 2 },
  { id: "dir-3", slug: "medicine", name_kz: "Медицина және денсаулық сақтау", name_ru: "Медицина и здравоохранение", sort_order: 3 },
  { id: "dir-4", slug: "pedagogy", name_kz: "Педагогика және білім беру", name_ru: "Педагогика и образование", sort_order: 4 },
  { id: "dir-5", slug: "business-law", name_kz: "Экономика, бизнес және құқық", name_ru: "Экономика, бизнес и право", sort_order: 5 },
];

const fallbackInstitutions: Institution[] = [
  {
    id: "inst-1",
    slug: "astana-it-university",
    name_kz: "Astana IT University",
    name_ru: "Astana IT University",
    short_name_kz: "AITU",
    short_name_ru: "АИТУ",
    institution_type: "university",
    official_website: "https://astanait.edu.kz",
    address_kz: "Астана қ., Мәңгілік Ел даңғылы, C1 (EXPO қалашығы)",
    address_ru: "г. Астана, пр. Мангилик Ел, С1 (территория EXPO)",
    contact_phone: "+7 (7172) 64-57-10",
    contact_email: "admission@astanait.edu.kz",
    dormitory_info_kz: "Студенттер серіктес жатақханалар мен 'Арман қала' кешеніне орналастырылады.",
    dormitory_info_ru: "Студенты обеспечиваются местами в партнерских общежитиях и ЖК 'Арман кала'.",
    has_military_department: true,
    status: "verified",
    last_verified_at: "2026-11-20",
    programs_count: 3,
    offered_programs_summary: ["Компьютерлік ғылымдар (6B06101)", "Бағдарламалық инженерия (6B06102)", "Киберқауіпсіздік (6B06103)"],
    source: fallbackSources[2],
  },
  {
    id: "inst-2",
    slug: "enu-gumilyov",
    name_kz: "Л.Н. Гумилев атындағы Еуразия ұлттық университеті",
    name_ru: "Евразийский национальный университет имени Л.Н. Гумилева",
    short_name_kz: "ЕҰУ",
    short_name_ru: "ЕНУ",
    institution_type: "university",
    official_website: "https://enu.kz",
    address_kz: "Астана қ., Сәтбаев көшесі, 2",
    address_ru: "г. Астана, ул. Сатпаева, 2",
    contact_phone: "+7 (7172) 70-95-00",
    dormitory_info_kz: "Университеттің 8 студенттік үйі бар. 1-курс студенттеріне басымдық беріледі.",
    dormitory_info_ru: "В наличии 8 студенческих домов. Приоритет предоставляется первокурсникам.",
    has_military_department: true,
    status: "verified",
    last_verified_at: "2026-11-20",
    programs_count: 2,
    offered_programs_summary: ["Ақпараттық технологиялар (B058)", "Құқық (B042)"],
    source: fallbackSources[0],
  },
  {
    id: "inst-3",
    slug: "astana-medical-university",
    name_kz: "Астана медицина университеті",
    name_ru: "Медицинский университет Астана",
    short_name_kz: "АМУ",
    short_name_ru: "МУА",
    institution_type: "university",
    official_website: "https://amu.edu.kz",
    address_kz: "Астана қ., Бейбітшілік көшесі, 49/А",
    address_ru: "г. Астана, ул. Бейбитшилик, 49/А",
    contact_phone: "+7 (7172) 53-94-24",
    dormitory_info_kz: "Өз жатақханалары мен жалға алынған тұрғын үй кешендері бар.",
    dormitory_info_ru: "Имеются собственные общежития и арендованные жилые корпуса.",
    has_military_department: true,
    status: "verified",
    last_verified_at: "2026-11-20",
    programs_count: 1,
    offered_programs_summary: ["Жалпы медицина (6B10101)"],
    source: fallbackSources[0],
  },
  {
    id: "inst-4",
    slug: "astana-polytechnic-college",
    name_kz: "Астана политехникалық колледжі",
    name_ru: "Астанинский политехнический колледж",
    short_name_kz: "АПК",
    short_name_ru: "АПК",
    institution_type: "college",
    official_website: "https://polytech.kz",
    address_kz: "Астана қ., Бейбітшілік көшесі, 39",
    address_ru: "г. Астана, ул. Бейбитшилик, 39",
    contact_phone: "+7 (7172) 31-41-43",
    dormitory_info_kz: "Колледж аумағында 450 орындық жатақхана қарастырылған.",
    dormitory_info_ru: "На территории колледжа действует общежитие на 450 мест.",
    has_military_department: false,
    status: "verified",
    last_verified_at: "2026-11-20",
    programs_count: 1,
    offered_programs_summary: ["Есептеу техникасы және бағдарламалық қамтамасыз ету (06120100)"],
    source: fallbackSources[1],
  },
];

const fallbackPrograms: EducationProgram[] = [
  {
    id: "prog-1",
    code: "6B06101",
    group_id: "grp-1",
    name_kz: "Компьютерлік ғылымдар",
    name_ru: "Компьютерные науки (Computer Science)",
    education_level: "bachelor",
    status: "verified",
    group: {
      id: "grp-1",
      code: "B058",
      name_kz: "Ақпараттық технологиялар",
      name_ru: "Информационные технологии",
      education_level: "bachelor",
    },
    institutions: [
      {
        id: "inst-1",
        slug: "astana-it-university",
        name_kz: "Astana IT University",
        name_ru: "Astana IT University",
        institution_type: "university",
        tuition_fee_kzt: 1250000,
        study_languages: ["KZ", "RU", "EN"],
      },
    ],
  },
  {
    id: "prog-2",
    code: "6B06103",
    group_id: "grp-2",
    name_kz: "Киберқауіпсіздік",
    name_ru: "Кибербезопасность (Cybersecurity)",
    education_level: "bachelor",
    status: "verified",
    group: {
      id: "grp-2",
      code: "B057",
      name_kz: "Ақпараттық қауіпсіздік",
      name_ru: "Информационная безопасность",
      education_level: "bachelor",
    },
    institutions: [
      {
        id: "inst-1",
        slug: "astana-it-university",
        name_kz: "Astana IT University",
        name_ru: "Astana IT University",
        institution_type: "university",
        tuition_fee_kzt: 1250000,
        study_languages: ["KZ", "RU", "EN"],
      },
    ],
  },
  {
    id: "prog-3",
    code: "6B10101",
    group_id: "grp-3",
    name_kz: "Жалпы медицина",
    name_ru: "Общая медицина",
    education_level: "bachelor",
    status: "verified",
    group: {
      id: "grp-3",
      code: "B086",
      name_kz: "Жалпы медицина",
      name_ru: "Общая медицина",
      education_level: "bachelor",
    },
    institutions: [
      {
        id: "inst-3",
        slug: "astana-medical-university",
        name_kz: "Астана медицина университеті",
        name_ru: "Медицинский университет Астана",
        institution_type: "university",
        tuition_fee_kzt: 1350000,
        study_languages: ["KZ", "RU"],
      },
    ],
  },
];

const fallbackCareers: Career[] = [
  {
    id: "car-1",
    slug: "cybersecurity-specialist",
    title_kz: "Киберқауіпсіздік маманы",
    title_ru: "Специалист по кибербезопасности",
    description_kz: "Ақпараттық жүйелерді, дерекқорларды және корпоративтік желілерді кибершабуылдар мен деректердің жылыстауынан қорғайтын маман.",
    description_ru: "Специалист, обеспечивающий защиту информационных систем, баз данных и корпоративных сетей от кибератак.",
    daily_tasks_kz: ["Қауіпсіздік жүйелерін мониторингтеу", "Шабуылдарға қарсы әрекет ету", "Осалдықтарды талдау (Penetration testing)"],
    daily_tasks_ru: ["Мониторинг инцидентов безопасности", "Тестирование на проникновение (пентест)", "Анализ уязвимостей систем"],
    skills_kz: ["Linux", "Желілік протоколдар (TCP/IP)", "Python/Bash", "Криптография"],
    skills_ru: ["Linux", "Сетевые протоколы (TCP/IP)", "Python/Bash", "Криптография"],
    profile_subjects_kz: "Математика + Информатика",
    profile_subjects_ru: "Математика + Информатика",
    status: "verified",
    source: fallbackSources[2],
    related_institutions: [
      { id: "inst-1", slug: "astana-it-university", name_kz: "Astana IT University", name_ru: "Astana IT University", institution_type: "university" },
    ],
  },
  {
    id: "car-2",
    slug: "software-engineer",
    title_kz: "Бағдарламалық жасақтама инженері",
    title_ru: "Инженер-программист (Software Engineer)",
    description_kz: "Веб-қосымшаларды, мобильді сервистерді және күрделі серверлік архитектураларды жобалап, әзірлейтін маман.",
    description_ru: "Инженер, проектирующий и создающий масштабируемые веб-сервисы, мобильные приложения и облачную архитектуру.",
    daily_tasks_kz: ["Таза әрі тиімді код жазу", "Дерекқорлар мен API архитектурасын құру", "Жүйені автоматтандыру"],
    daily_tasks_ru: ["Проектирование сервисов", "Написание чистого кода", "Интеграция API и БД"],
    skills_kz: ["Алгоритмдер", "Go / TypeScript / Python", "PostgreSQL", "Git / Docker"],
    skills_ru: ["Алгоритмы и структуры", "Go / TypeScript / Python", "PostgreSQL", "Git / Docker"],
    profile_subjects_kz: "Математика + Информатика",
    profile_subjects_ru: "Математика + Информатика",
    status: "verified",
    source: fallbackSources[2],
    related_institutions: [
      { id: "inst-1", slug: "astana-it-university", name_kz: "Astana IT University", name_ru: "Astana IT University", institution_type: "university" },
      { id: "inst-4", slug: "astana-polytechnic-college", name_kz: "Астана политехникалық колледжі", name_ru: "Астанинский политехнический колледж", institution_type: "college" },
    ],
  },
  {
    id: "car-3",
    slug: "general-practitioner-doctor",
    title_kz: "Жалпы практика дәрігері",
    title_ru: "Врач общей практики (ВОП)",
    description_kz: "Науқастардың денсаулығын бақылайтын, алғашқы медициналық-санитариялық көмек көрсететін және аурулардың алдын алатын білікті маман.",
    description_ru: "Врач первичного звена, осуществляющий диагностику, профилактику и базовое лечение пациентов.",
    daily_tasks_kz: ["Пациенттерді қабылдау және тексеру", "Диагноз қою", "Профилактикалық тексерулер өткізу"],
    daily_tasks_ru: ["Прием пациентов", "Постановка диагноза", "Профилактические осмотры"],
    skills_kz: ["Клиникалық диагностика", "Фармакология негіздері", "Шұғыл көмек", "Эмпатия"],
    skills_ru: ["Клиническая диагностика", "Фармакология", "Неотложная помощь", "Коммуникация"],
    profile_subjects_kz: "Биология + Химия",
    profile_subjects_ru: "Биология + Химия",
    status: "verified",
    source: fallbackSources[0],
    related_institutions: [
      { id: "inst-3", slug: "astana-medical-university", name_kz: "Астана медицина университеті", name_ru: "Медицинский университет Астана", institution_type: "university" },
    ],
  },
];

const fallbackGrants: Grant[] = [
  {
    id: "gr-1",
    slug: "astana-akimat-grant",
    title_kz: "Астана қаласы әкімінің гранты",
    title_ru: "Грант акима города Астаны",
    provider_kz: "Астана қаласының әкімдігі және Білім басқармасы",
    provider_ru: "Акимат и Управление образования города Астаны",
    grant_type: "akimat_astana",
    location_scope: "astana",
    education_level: "bachelor",
    coverage_type: "full_tuition",
    coverage_details_kz: "Оқу ақысы 100% төленеді + ай сайынғы мемлекеттік шәкіртақы тағайындалады.",
    coverage_details_ru: "100% покрытие стоимости обучения + ежемесячная государственная стипендия.",
    eligibility_criteria_kz: "Астана қаласында тұрақты тіркеуі бар, ҰБТ шекті балын жинаған талапкерлер. Оқу бітірген соң Астана ұйымдарында 3 жыл жұмыс істеу шарты бар.",
    eligibility_criteria_ru: "Абитуриенты с регистрацией в г. Астана, преодолевшие порог ЕНТ. Обязательство отработки 3 года в организациях столицы.",
    required_documents_kz: ["Жеке куәлік көшірмесі", "ҰБТ сертификаты", "Аттестат", "Астанада тұрақты тіркеу туралы анықтама", "075-У анықтамасы"],
    required_documents_ru: ["Копия удостоверения личности", "Сертификат ЕНТ", "Аттестат", "Справка с места жительства в Астане", "Медсправка 075-У"],
    application_url: "https://www.gov.kz/memleket/entities/astana-bilim",
    academic_year: "2026-2027",
    status: "verified",
    last_verified_at: "2026-11-20",
    source: fallbackSources[1],
    deadlines: [
      { id: "dl-1", entity_type: "grant", entity_id: "gr-1", academic_year: "2026-2027", title_kz: "Құжат қабылдау", title_ru: "Подача документов", end_date: "2026-08-15", isConfirmed: true } as any,
    ],
  },
  {
    id: "gr-2",
    slug: "state-general-grant",
    title_kz: "ҚР Жалпы Мемлекеттік Білім беру гранты",
    title_ru: "Общий государственный образовательный грант РК",
    provider_kz: "ҚР Ғылым және жоғары білім министрлігі",
    provider_ru: "Министерство науки и высшего образования РК",
    grant_type: "national",
    location_scope: "kazakhstan",
    education_level: "bachelor",
    coverage_type: "full_tuition",
    coverage_details_kz: "Толық 4 жылдық оқу ақысы және ай сайынғы шәкіртақы.",
    coverage_details_ru: "Полная стоимость 4 лет обучения на бакалавриате и ежемесячная государственная стипендия.",
    eligibility_criteria_kz: "ҰБТ шекті балынан өткен барлық мектеп бітірушілері. Конкурс кезінде 4 бағдарламалар тобын таңдау мүмкіндігі.",
    eligibility_criteria_ru: "Все абитуриенты, набравшие пороговый балл ЕНТ. Возможность указать до 4 групп образовательных программ.",
    required_documents_kz: ["Аттестат", "ҰБТ сертификаты", "075-У анықтамасы", "Жеке куәлік"],
    required_documents_ru: ["Аттестат", "Сертификат ЕНТ", "Медсправка 075-У", "Удостоверение личности"],
    application_url: "https://testcenter.kz",
    academic_year: "2026-2027",
    status: "verified",
    last_verified_at: "2026-11-20",
    source: fallbackSources[0],
    deadlines: [
      { id: "dl-2", entity_type: "grant", entity_id: "gr-2", academic_year: "2026-2027", title_kz: "Республикалық конкурсқа өтінім", title_ru: "Подача на республиканский конкурс", end_date: "2026-07-20", isConfirmed: true } as any,
    ],
  },
  {
    id: "gr-3",
    slug: "qazaqstan-khalqyna-grant",
    title_kz: "'Қазақстан халқына' Қорының Білім Гранты",
    title_ru: "Образовательный грант фонда 'Қазақстан халқына'",
    provider_kz: "'Қазақстан халқына' қоғамдық қоры",
    provider_ru: "Общественный фонд 'Қазақстан халқына'",
    grant_type: "charitable",
    location_scope: "kazakhstan",
    education_level: "bachelor",
    coverage_type: "full_tuition",
    coverage_details_kz: "Толық оқу ақысын өтеу + күнтізбелік жыл бойы шәкіртақы.",
    coverage_details_ru: "100% возмещение стоимости обучения + ежемесячная стипендия.",
    eligibility_criteria_kz: "Әлеуметтік осал санаттағы талапкерлер: жетім балалар, 1/2 топ мүгедектігі барлар, көп балалы және аз қамтылған отбасылар.",
    eligibility_criteria_ru: "Социально уязвимые категории выпускников, преодолевшие порог ЕНТ, но не получившие госгрант.",
    required_documents_kz: ["Санатты растайтын құжаттар", "ҰБТ сертификаты", "Аттестат"],
    required_documents_ru: ["Документы подтверждения категории", "Сертификат ЕНТ", "Аттестат"],
    application_url: "https://qazaqstanhalqyna.kz",
    academic_year: "2026-2027",
    status: "verified",
    last_verified_at: "2026-11-20",
    source: fallbackSources[0],
  },
];

const fallbackOpportunities: Opportunity[] = [
  {
    id: "op-1",
    slug: "tech-orda-voucher",
    title_kz: "Tech Orda — Тегін IT-ваучерлер бағдарламасы",
    title_ru: "Tech Orda — Программа бесплатных ИТ-ваучеров",
    provider_kz: "Astana Hub және ҚР ЦДИАӨМ",
    provider_ru: "Astana Hub и МЦРИАП РК",
    opportunity_type: "course",
    description_kz: "Қазақстанның аккредиттелген IT-мектептерінде веб-бағдарламалау, Data Science және киберқауіпсіздікті тегін оқуға арналған 600 000 теңгелік ваучер.",
    description_ru: "Ваучеры до 600 000 ₸ на бесплатное обучение веб-разработке, машинному обучению и кибербезопасности в ведущих школах.",
    target_audience_kz: "18-35 жас аралығындағы азаматтар және 11-сынып бітірушілері.",
    target_audience_ru: "Граждане РК от 18 до 35 лет, выпускники школ и студенты.",
    cost_type: "free",
    benefits_kz: "Тегін кәсіби білім, сертификат, жұмысқа орналасуға көмек.",
    benefits_ru: "Бесплатное образование, сертификат, содействие в трудоустройстве.",
    duration_kz: "6-12 ай",
    duration_ru: "6-12 месяцев",
    location_mode: "hybrid",
    application_url: "https://astanahub.com/en/tech-orda/",
    status: "verified",
    last_verified_at: "2026-11-20",
    source: fallbackSources[0],
    deadlines: [
      { id: "dl-3", entity_type: "opportunity", entity_id: "op-1", academic_year: "2026-2027", title_kz: "Күзгі лекке тіркелу", title_ru: "Регистрация на поток", end_date: "2026-10-15", isConfirmed: true } as any,
    ],
  },
  {
    id: "op-2",
    slug: "daryn-informatics-olympiad",
    title_kz: "Информатикадан Республикалық 'Дарын' олимпиадасы",
    title_ru: "Республиканская олимпиада школьников по информатике",
    provider_kz: "Республикалық 'Дарын' ғылыми-практикалық орталығы",
    provider_ru: "РНПЦ 'Дарын' Минпросвещения РК",
    opportunity_type: "olympiad",
    description_kz: "Мектеп оқушылары арасындағы ең беделді бағдарламалау жарысы. Жүлдегерлер ҰБТ-сыз грант алу немесе басым құқыққа ие болады.",
    description_ru: "Главное республиканское соревнование школьников по спортивному программированию. Призеры получают приоритетное право на гранты.",
    target_audience_kz: "9, 10, 11-сынып оқушылары.",
    target_audience_ru: "Учащиеся 9, 10, 11 классов школ Астаны и регионов.",
    cost_type: "free",
    benefits_kz: "ЖОО-ға басым құқықпен түсу, диплом, бағалы сыйлықтар.",
    benefits_ru: "Преимущественное право на образовательные гранты вузов, медали.",
    location_mode: "in_person_astana",
    application_url: "https://daryn.kz",
    status: "verified",
    last_verified_at: "2026-11-20",
    source: fallbackSources[0],
  },
  {
    id: "op-3",
    slug: "astana-hub-startup-garage",
    title_kz: "Astana Hub 'Startup Garage' Инкубациясы",
    title_ru: "Программа инкубации Startup Garage в Astana Hub",
    provider_kz: "Astana Hub халықаралық технопаркі",
    provider_ru: "Международный технопарк IT-стартапов Astana Hub",
    opportunity_type: "mentorship",
    description_kz: "Мектеп және университет оқушыларына арналған өз IT стартапын нөлден бастап құру, менторлық және инвестиция тарту бағдарламасы.",
    description_ru: "Интенсивная менторская программа для запуска технологического стартапа со школьной или студенческой скамьи.",
    target_audience_kz: "Жобасы немесе IT идеясы бар оқушылар мен студенттер.",
    target_audience_ru: "Школьники старших классов и студенты с проектами.",
    cost_type: "free",
    benefits_kz: "Тегін коворкинг, EXPO алаңы, трекерлік көмек, сарапшылар менторы.",
    benefits_ru: "Бесплатное рабочее пространство в EXPO, трекеры, менторы.",
    duration_kz: "3 ай",
    duration_ru: "3 месяца",
    location_mode: "in_person_astana",
    application_url: "https://astanahub.com",
    status: "verified",
    last_verified_at: "2026-11-20",
    source: fallbackSources[0],
  },
];

const fallbackDeadlines: Deadline[] = [
  {
    id: "dl-1",
    entity_type: "grant",
    entity_id: "gr-2",
    academic_year: "2026-2027",
    title_kz: "Мемлекеттік гранттар конкурсына өтінім қабылдау",
    title_ru: "Прием заявлений на конкурс государственных грантов",
    start_date: "2026-07-13",
    end_date: "2026-07-20",
    is_confirmed: true,
  },
  {
    id: "dl-2",
    entity_type: "grant",
    entity_id: "gr-1",
    academic_year: "2026-2027",
    title_kz: "Астана қаласы әкімінің гранттарына құжат тапсыру",
    title_ru: "Подача документов на грант акима Астаны",
    start_date: "2026-08-05",
    end_date: "2026-08-15",
    is_confirmed: true,
  },
  {
    id: "dl-3",
    entity_type: "opportunity",
    entity_id: "op-1",
    academic_year: "2026-2027",
    title_kz: "Tech Orda күзгі легіне тіркелу",
    title_ru: "Регистрация на осенний поток Tech Orda",
    start_date: "2026-09-01",
    end_date: "2026-10-15",
    is_confirmed: true,
  },
];
