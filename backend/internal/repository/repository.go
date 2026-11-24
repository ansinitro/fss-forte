package repository

import (
	"database/sql"
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
	"astana-platform/internal/database"
	"astana-platform/internal/models"
)

type Repository interface {
	GetDirections() ([]models.Direction, error)
	GetCareers(directionSlug string) ([]models.Career, error)
	GetCareerBySlug(slug string) (*models.Career, error)
	GetInstitutions(instType, status string) ([]models.Institution, error)
	GetInstitutionBySlug(slug string) (*models.Institution, error)
	GetProgramGroups(directionSlug string) ([]models.EducationProgramGroup, error)
	GetPrograms(groupId string) ([]models.EducationProgram, error)
	GetProgramByCode(code string) (*models.EducationProgram, error)
	GetGrants(grantType, eduLevel, status string) ([]models.Grant, error)
	GetGrantBySlug(slug string) (*models.Grant, error)
	GetOpportunities(oppType, costType, status string) ([]models.Opportunity, error)
	GetOpportunityBySlug(slug string) (*models.Opportunity, error)
	GetDeadlines(academicYear string) ([]models.Deadline, error)
	Search(query string, typeFilter string) ([]models.SearchResultItem, error)
	GetSources() ([]models.Source, error)
	GetSourceById(id string) (*models.Source, error)
	CreateSource(source *models.Source) error
	GetVerificationLogs() ([]models.VerificationLog, error)
	CreateVerificationLog(vlog *models.VerificationLog) error
	GetUserByEmail(email string) (*models.User, string, error)
	GetAdminStats() (map[string]interface{}, error)
	UpdateEntityStatus(entityType, id, newStatus, comments, userId string) error
	CreateInstitution(inst *models.Institution) error
	CreateGrant(grant *models.Grant) error
	CreateOpportunity(opp *models.Opportunity) error
}

type repositoryImpl struct {
	db        *database.DB
	memLock   sync.RWMutex
	sources   map[string]models.Source
	dirs      []models.Direction
	careers   map[string]models.Career
	insts     map[string]models.Institution
	groups    map[string]models.EducationProgramGroup
	programs  map[string]models.EducationProgram
	grants    map[string]models.Grant
	opps      map[string]models.Opportunity
	deadlines []models.Deadline
	logs      []models.VerificationLog
	users     map[string]struct {
		user models.User
		hash string
	}
}

func NewRepository(db *database.DB) Repository {
	repo := &repositoryImpl{
		db:        db,
		sources:   make(map[string]models.Source),
		careers:   make(map[string]models.Career),
		insts:     make(map[string]models.Institution),
		groups:    make(map[string]models.EducationProgramGroup),
		programs:  make(map[string]models.EducationProgram),
		grants:    make(map[string]models.Grant),
		opps:      make(map[string]models.Opportunity),
		users:     make(map[string]struct {
			user models.User
			hash string
		}),
	}

	repo.seedMemoryStore()
	return repo
}

func (r *repositoryImpl) seedMemoryStore() {
	// Pre-populate verified seed data for in-memory access and mock mode
	source1 := models.Source{
		ID:                 "a0000001-0000-0000-0000-000000000001",
		URL:                "https://testcenter.kz/",
		Title:              "Ұлттық тестілеу орталығының ресми ережелері",
		Organization:       "ҚР ҒЖБМ ҰТО",
		SourceType:         "authority",
		AcademicYear:       "2026-2027",
		Excerpt:            "ҰБТ шекті балдары: Ұлттық ЖОО - кемінде 65 балл, Педагогика және медицина - 75 балл, Өзге ЖОО - 50 балл.",
		VerificationStatus: models.StatusVerified,
		RetrievedAt:        time.Now(),
	}
	source2 := models.Source{
		ID:                 "a0000001-0000-0000-0000-000000000002",
		URL:                "https://www.gov.kz/memleket/entities/astana-bilim",
		Title:              "Астана қаласы Білім басқармасының гранттық тапсырысы",
		Organization:       "Астана қаласы Білім басқармасы",
		SourceType:         "authority",
		AcademicYear:       "2026-2027",
		Excerpt:            "Астана қаласы әкімінің гранттары қалаға қажетті кадрларды даярлау үшін бөлінеді (педагогика, медицина, IT).",
		VerificationStatus: models.StatusVerified,
		RetrievedAt:        time.Now(),
	}
	source3 := models.Source{
		ID:                 "a0000001-0000-0000-0000-000000000003",
		URL:                "https://astanait.edu.kz/",
		Title:              "Astana IT University ресми қабылдау ережелері",
		Organization:       "Astana IT University",
		SourceType:         "institution_official",
		AcademicYear:       "2026-2027",
		Excerpt:            "AITU қабылдау шекті балы: кемінде 65 балл (Математика + Информатика). Ректор гранттары олимпиада жүлдегерлеріне беріледі.",
		VerificationStatus: models.StatusVerified,
		RetrievedAt:        time.Now(),
	}
	source4 := models.Source{
		ID:                 "a0000001-0000-0000-0000-000000000004",
		URL:                "https://enu.kz/",
		Title:              "Л.Н. Гумилев атындағы ЕҰУ қабылдау комиссиясы",
		Organization:       "Л.Н. Гумилев атындағы ЕҰУ",
		SourceType:         "institution_official",
		AcademicYear:       "2026-2027",
		Excerpt:            "Ұлттық университет мәртебесі бойынша ең төменгі шекті балл - 65. Педагогикалық бағыттар үшін - 75 балл.",
		VerificationStatus: models.StatusVerified,
		RetrievedAt:        time.Now(),
	}
	source5 := models.Source{
		ID:                 "a0000001-0000-0000-0000-000000000005",
		URL:                "https://amu.edu.kz/",
		Title:              "Астана медицина университетінің талапкерлер бөлімі",
		Organization:       "Астана медицина университеті",
		SourceType:         "institution_official",
		AcademicYear:       "2026-2027",
		Excerpt:            "Денсаулық сақтау бағытында шекті балл кемінде 70. Міндетті түрде психометриялық емтихан тапсырылады.",
		VerificationStatus: models.StatusVerified,
		RetrievedAt:        time.Now(),
	}
	source6 := models.Source{
		ID:                 "a0000001-0000-0000-0000-000000000006",
		URL:                "https://polytech.kz/",
		Title:              "Астана политехникалық колледжінің қабылдау ережелері",
		Organization:       "Астана политехникалық колледжі",
		SourceType:         "institution_official",
		AcademicYear:       "2026-2027",
		Excerpt:            "9 және 11-сыныптан кейін мемлекеттік тапсырыс бойынша қабылдау аттестаттың орташа балымен өтеді. ҰБТ талап етілмейді.",
		VerificationStatus: models.StatusVerified,
		RetrievedAt:        time.Now(),
	}
	source8 := models.Source{
		ID:                 "a0000001-0000-0000-0000-000000000008",
		URL:                "https://astanahub.com/en/tech-orda/",
		Title:              "Tech Orda ваучерлік IT бағдарламасы",
		Organization:       "Astana Hub",
		SourceType:         "authority",
		AcademicYear:       "2026-2027",
		Excerpt:            "Қазақстан азаматтары үшін жетекші IT мектептерде 600 000 теңгеге дейін тегін білім беру ваучері.",
		VerificationStatus: models.StatusVerified,
		RetrievedAt:        time.Now(),
	}

	r.sources[source1.ID] = source1
	r.sources[source2.ID] = source2
	r.sources[source3.ID] = source3
	r.sources[source4.ID] = source4
	r.sources[source5.ID] = source5
	r.sources[source6.ID] = source6
	r.sources[source8.ID] = source8

	// Directions
	d1 := models.Direction{ID: "c0000001-0000-0000-0000-000000000001", Slug: "it-digital", NameKz: "IT және цифрлық технологиялар", NameRu: "IT и цифровые технологии", SortOrder: 1}
	d2 := models.Direction{ID: "c0000001-0000-0000-0000-000000000002", Slug: "engineering", NameKz: "Инженерия және техникалық ғылымдар", NameRu: "Инженерия и технические науки", SortOrder: 2}
	d3 := models.Direction{ID: "c0000001-0000-0000-0000-000000000003", Slug: "medicine", NameKz: "Медицина және денсаулық сақтау", NameRu: "Медицина и здравоохранение", SortOrder: 3}
	d4 := models.Direction{ID: "c0000001-0000-0000-0000-000000000004", Slug: "pedagogy", NameKz: "Педагогика және білім беру", NameRu: "Педагогика и образование", SortOrder: 4}
	d5 := models.Direction{ID: "c0000001-0000-0000-0000-000000000005", Slug: "business-law", NameKz: "Экономика, бизнес және құқық", NameRu: "Экономика, бизнес и право", SortOrder: 5}
	r.dirs = []models.Direction{d1, d2, d3, d4, d5}

	// Groups
	g1 := models.EducationProgramGroup{ID: "e0000001-0000-0000-0000-000000000001", Code: "B057", NameKz: "Ақпараттық қауіпсіздік", NameRu: "Информационная безопасность", DirectionID: &d1.ID, Direction: &d1, EducationLevel: "bachelor"}
	g2 := models.EducationProgramGroup{ID: "e0000001-0000-0000-0000-000000000002", Code: "B058", NameKz: "Ақпараттық технологиялар", NameRu: "Информационные технологии", DirectionID: &d1.ID, Direction: &d1, EducationLevel: "bachelor"}
	g3 := models.EducationProgramGroup{ID: "e0000001-0000-0000-0000-000000000003", Code: "B086", NameKz: "Жалпы медицина", NameRu: "Общая медицина", DirectionID: &d3.ID, Direction: &d3, EducationLevel: "bachelor"}
	g4 := models.EducationProgramGroup{ID: "e0000001-0000-0000-0000-000000000006", Code: "COL-0612", NameKz: "Есептеу техникасы және бағдарламалық қамтамасыз ету", NameRu: "Вычислительная техника и ПО", DirectionID: &d1.ID, Direction: &d1, EducationLevel: "college"}
	r.groups[g1.ID] = g1
	r.groups[g2.ID] = g2
	r.groups[g3.ID] = g3
	r.groups[g4.ID] = g4

	// Programs
	feeAITU := 1250000.0
	p1 := models.EducationProgram{
		ID:             "e1000001-0000-0000-0000-000000000001",
		Code:           "6B06101",
		GroupID:        g2.ID,
		Group:          &g2,
		NameKz:         "Компьютерлік ғылымдар",
		NameRu:         "Компьютерные науки (Computer Science)",
		EducationLevel: "bachelor",
		Status:         models.StatusVerified,
		Institutions: []models.InstitutionSummary{
			{ID: "d0000001-0000-0000-0000-000000000001", Slug: "astana-it-university", NameKz: "Astana IT University", NameRu: "Astana IT University", InstitutionType: "university", TuitionFeeKzt: &feeAITU, StudyLanguages: []string{"KZ", "RU", "EN"}},
		},
	}
	p2 := models.EducationProgram{
		ID:             "e1000001-0000-0000-0000-000000000002",
		Code:           "6B06102",
		GroupID:        g2.ID,
		Group:          &g2,
		NameKz:         "Бағдарламалық инженерия",
		NameRu:         "Программная инженерия (Software Engineering)",
		EducationLevel: "bachelor",
		Status:         models.StatusVerified,
		Institutions: []models.InstitutionSummary{
			{ID: "d0000001-0000-0000-0000-000000000001", Slug: "astana-it-university", NameKz: "Astana IT University", NameRu: "Astana IT University", InstitutionType: "university", TuitionFeeKzt: &feeAITU, StudyLanguages: []string{"KZ", "RU", "EN"}},
		},
	}
	p3 := models.EducationProgram{
		ID:             "e1000001-0000-0000-0000-000000000003",
		Code:           "6B06103",
		GroupID:        g1.ID,
		Group:          &g1,
		NameKz:         "Киберқауіпсіздік",
		NameRu:         "Кибербезопасность (Cybersecurity)",
		EducationLevel: "bachelor",
		Status:         models.StatusVerified,
		Institutions: []models.InstitutionSummary{
			{ID: "d0000001-0000-0000-0000-000000000001", Slug: "astana-it-university", NameKz: "Astana IT University", NameRu: "Astana IT University", InstitutionType: "university", TuitionFeeKzt: &feeAITU, StudyLanguages: []string{"KZ", "RU", "EN"}},
		},
	}
	p4 := models.EducationProgram{
		ID:             "e1000001-0000-0000-0000-000000000004",
		Code:           "6B10101",
		GroupID:        g3.ID,
		Group:          &g3,
		NameKz:         "Жалпы медицина",
		NameRu:         "Общая медицина",
		EducationLevel: "bachelor",
		Status:         models.StatusVerified,
		Institutions: []models.InstitutionSummary{
			{ID: "d0000001-0000-0000-0000-000000000003", Slug: "astana-medical-university", NameKz: "Астана медицина университеті", NameRu: "Медицинский университет Астана", InstitutionType: "university", StudyLanguages: []string{"KZ", "RU"}},
		},
	}
	r.programs[p1.Code] = p1
	r.programs[p2.Code] = p2
	r.programs[p3.Code] = p3
	r.programs[p4.Code] = p4

	// Institutions
	addrAITU := "Астана қ., Мәңгілік Ел даңғылы, C1 (EXPO қалашығы)"
	addrAITURu := "г. Астана, пр. Мангилик Ел, С1 (территория EXPO)"
	phoneAITU := "+7 (7172) 64-57-10"
	emailAITU := "admission@astanait.edu.kz"
	dormAITU := "Студенттер серіктес жатақханалар мен 'Арман қала' кешеніне орналастырылады."
	dormAITURu := "Студенты обеспечиваются местами в партнерских общежитиях и ЖК 'Арман кала'."
	instAITU := models.Institution{
		ID:                     "d0000001-0000-0000-0000-000000000001",
		Slug:                   "astana-it-university",
		NameKz:                 "Astana IT University",
		NameRu:                 "Astana IT University",
		InstitutionType:        "university",
		OfficialWebsite:        "https://astanait.edu.kz",
		AddressKz:              &addrAITU,
		AddressRu:              &addrAITURu,
		ContactPhone:           &phoneAITU,
		ContactEmail:           &emailAITU,
		DormitoryInfoKz:        &dormAITU,
		DormitoryInfoRu:        &dormAITURu,
		HasMilitaryDepartment:  true,
		Status:                 models.StatusVerified,
		LastVerifiedAt:         time.Now(),
		SourceID:               &source3.ID,
		Source:                 &source3,
		ProgramsCount:          3,
		OfferedProgramsSummary: []string{"Компьютерлік ғылымдар (6B06101)", "Бағдарламалық инженерия (6B06102)", "Киберқауіпсіздік (6B06103)"},
	}

	addrENU := "Астана қ., Сәтбаев көшесі, 2"
	addrENURu := "г. Астана, ул. Сатпаева, 2"
	phoneENU := "+7 (7172) 70-95-00"
	dormENU := "Университеттің 8 студенттік үйі бар. 1-курс студенттеріне басымдық беріледі."
	dormENURu := "В наличии 8 студенческих домов. Приоритет предоставляется первокурсникам."
	instENU := models.Institution{
		ID:                     "d0000001-0000-0000-0000-000000000002",
		Slug:                   "enu-gumilyov",
		NameKz:                 "Л.Н. Гумилев атындағы Еуразия ұлттық университеті",
		NameRu:                 "Евразийский национальный университет имени Л.Н. Гумилева",
		InstitutionType:        "university",
		OfficialWebsite:        "https://enu.kz",
		AddressKz:              &addrENU,
		AddressRu:              &addrENURu,
		ContactPhone:           &phoneENU,
		DormitoryInfoKz:        &dormENU,
		DormitoryInfoRu:        &dormENURu,
		HasMilitaryDepartment:  true,
		Status:                 models.StatusVerified,
		LastVerifiedAt:         time.Now(),
		SourceID:               &source4.ID,
		Source:                 &source4,
		ProgramsCount:          2,
		OfferedProgramsSummary: []string{"Ақпараттық технологиялар (B058)", "Құқық (B042)"},
	}

	addrAMU := "Астана қ., Бейбітшілік көшесі, 49/А"
	addrAMURu := "г. Астана, ул. Бейбитшилик, 49/А"
	phoneAMU := "+7 (7172) 53-94-24"
	dormAMU := "Өз жатақханалары мен жалға алынған тұрғын үй кешендері бар."
	dormAMURu := "Имеются собственные общежития и арендованные жилые корпуса."
	instAMU := models.Institution{
		ID:                     "d0000001-0000-0000-0000-000000000003",
		Slug:                   "astana-medical-university",
		NameKz:                 "Астана медицина университеті",
		NameRu:                 "Медицинский университет Астана",
		InstitutionType:        "university",
		OfficialWebsite:        "https://amu.edu.kz",
		AddressKz:              &addrAMU,
		AddressRu:              &addrAMURu,
		ContactPhone:           &phoneAMU,
		DormitoryInfoKz:        &dormAMU,
		DormitoryInfoRu:        &dormAMURu,
		HasMilitaryDepartment:  true,
		Status:                 models.StatusVerified,
		LastVerifiedAt:         time.Now(),
		SourceID:               &source5.ID,
		Source:                 &source5,
		ProgramsCount:          1,
		OfferedProgramsSummary: []string{"Жалпы медицина (6B10101)"},
	}

	addrPoly := "Астана қ., Бейбітшілік көшесі, 39"
	addrPolyRu := "г. Астана, ул. Бейбитшилик, 39"
	phonePoly := "+7 (7172) 31-41-43"
	dormPoly := "Колледж аумағында 450 орындық жатақхана қарастырылған."
	dormPolyRu := "На территории колледжа действует общежитие на 450 мест."
	instPoly := models.Institution{
		ID:                     "d0000001-0000-0000-0000-000000000004",
		Slug:                   "astana-polytechnic-college",
		NameKz:                 "Астана политехникалық колледжі",
		NameRu:                 "Астанинский политехнический колледж",
		InstitutionType:        "college",
		OfficialWebsite:        "https://polytech.kz",
		AddressKz:              &addrPoly,
		AddressRu:              &addrPolyRu,
		ContactPhone:           &phonePoly,
		DormitoryInfoKz:        &dormPoly,
		DormitoryInfoRu:        &dormPolyRu,
		HasMilitaryDepartment:  false,
		Status:                 models.StatusVerified,
		LastVerifiedAt:         time.Now(),
		SourceID:               &source6.ID,
		Source:                 &source6,
		ProgramsCount:          1,
		OfferedProgramsSummary: []string{"Есептеу техникасы және бағдарламалық қамтамасыз ету (06120100)"},
	}

	r.insts[instAITU.Slug] = instAITU
	r.insts[instENU.Slug] = instENU
	r.insts[instAMU.Slug] = instAMU
	r.insts[instPoly.Slug] = instPoly

	// Careers
	subjIT := "Математика + Информатика"
	subjMed := "Биология + Химия"
	c1 := models.Career{
		ID:                  "30000001-0000-0000-0000-000000000001",
		Slug:                "cybersecurity-specialist",
		TitleKz:             "Киберқауіпсіздік маманы",
		TitleRu:             "Специалист по кибербезопасности",
		DirectionID:         &d1.ID,
		Direction:           &d1,
		DescriptionKz:       "Ақпараттық жүйелерді, дерекқорларды және инфрақұрылымды кибершабуылдар мен деректердің жылыстауынан қорғайтын маман.",
		DescriptionRu:       "Специалист, обеспечивающий защиту информационных систем, баз данных и корпоративных сетей от кибератак.",
		DailyTasksKz:        []string{"Қауіпсіздік жүйелерін мониторингтеу", "Шабуылдарға қарсы әрекет ету", "Осалдықтарды талдау (Penetration testing)"},
		DailyTasksRu:        []string{"Мониторинг инцидентов безопасности", "Тестирование на проникновение", "Анализ сетевых протоколов"},
		SkillsKz:            []string{"Linux", "Желілік протоколдар (TCP/IP)", "Python/Bash", "Криптография"},
		SkillsRu:            []string{"Linux", "Сетевые протоколы (TCP/IP)", "Python/Bash", "Криптография"},
		ProfileSubjectsKz:   &subjIT,
		ProfileSubjectsRu:   &subjIT,
		Status:              models.StatusVerified,
		SourceID:            &source3.ID,
		Source:              &source3,
		RelatedProgramGroups: []models.EducationProgramGroup{g1},
		RelatedInstitutions: []models.InstitutionSummary{
			{ID: instAITU.ID, Slug: instAITU.Slug, NameKz: instAITU.NameKz, NameRu: instAITU.NameRu, InstitutionType: "university"},
		},
	}
	c2 := models.Career{
		ID:                  "30000001-0000-0000-0000-000000000002",
		Slug:                "software-engineer",
		TitleKz:             "Бағдарламалық жасақтама инженері",
		TitleRu:             "Инженер-программист (Software Engineer)",
		DirectionID:         &d1.ID,
		Direction:           &d1,
		DescriptionKz:       "Веб-қосымшаларды, мобильді сервистерді және күрделі серверлік архитектураларды жобалап, әзірлейтін маман.",
		DescriptionRu:       "Инженер, проектирующий и создающий масштабируемые веб-сервисы, мобильные приложения и облачную архитектуру.",
		DailyTasksKz:        []string{"Таза әрі тиімді код жазу", "Дерекқорлар мен API құру", "Жүйені автоматтандыру"},
		DailyTasksRu:        []string{"Проектирование сервисов", "Написание чистого кода", "Интеграция API и БД"},
		SkillsKz:            []string{"Алгоритмдер", "Go / TypeScript / Python", "PostgreSQL", "Docker"},
		SkillsRu:            []string{"Алгоритмы и структуры", "Go / TypeScript / Python", "PostgreSQL", "Docker"},
		ProfileSubjectsKz:   &subjIT,
		ProfileSubjectsRu:   &subjIT,
		Status:              models.StatusVerified,
		SourceID:            &source3.ID,
		Source:              &source3,
		RelatedProgramGroups: []models.EducationProgramGroup{g2, g4},
		RelatedInstitutions: []models.InstitutionSummary{
			{ID: instAITU.ID, Slug: instAITU.Slug, NameKz: instAITU.NameKz, NameRu: instAITU.NameRu, InstitutionType: "university"},
			{ID: instPoly.ID, Slug: instPoly.Slug, NameKz: instPoly.NameKz, NameRu: instPoly.NameRu, InstitutionType: "college"},
		},
	}
	c3 := models.Career{
		ID:                  "30000001-0000-0000-0000-000000000003",
		Slug:                "general-practitioner-doctor",
		TitleKz:             "Жалпы практика дәрігері",
		TitleRu:             "Врач общей практики (ВОП)",
		DirectionID:         &d3.ID,
		Direction:           &d3,
		DescriptionKz:       "Науқастардың денсаулығын бақылайтын, алғашқы медициналық-санитариялық көмек көрсететін дәрігер.",
		DescriptionRu:       "Врач первичного звена, осуществляющий диагностику, профилактику и базовое лечение пациентов.",
		DailyTasksKz:        []string{"Пациенттерді қабылдау және тексеру", "Диагноз қою", "Профилактикалық тексерулер"},
		DailyTasksRu:        []string{"Прием пациентов", "Диагностика заболеваний", "Профилактические осмотры"},
		SkillsKz:            []string{"Клиникалық диагностика", "Фармакология", "Шұғыл көмек", "Эмпатия"},
		SkillsRu:            []string{"Клиническая диагностика", "Фармакология", "Неотложная помощь", "Коммуникация"},
		ProfileSubjectsKz:   &subjMed,
		ProfileSubjectsRu:   &subjMed,
		Status:              models.StatusVerified,
		SourceID:            &source5.ID,
		Source:              &source5,
		RelatedProgramGroups: []models.EducationProgramGroup{g3},
		RelatedInstitutions: []models.InstitutionSummary{
			{ID: instAMU.ID, Slug: instAMU.Slug, NameKz: instAMU.NameKz, NameRu: instAMU.NameRu, InstitutionType: "university"},
		},
	}
	r.careers[c1.Slug] = c1
	r.careers[c2.Slug] = c2
	r.careers[c3.Slug] = c3

	// Grants
	urlAkimat := "https://www.gov.kz/memleket/entities/astana-bilim"
	urlState := "https://testcenter.kz"
	urlQazaq := "https://qazaqstanhalqyna.kz"
	urlAITU := "https://astanait.edu.kz"

	gr1 := models.Grant{
		ID:                    "40000001-0000-0000-0000-000000000001",
		Slug:                  "astana-akimat-grant",
		TitleKz:               "Астана қаласы әкімінің гранты",
		TitleRu:               "Грант акима города Астаны",
		ProviderKz:            "Астана қаласының әкімдігі және Білім басқармасы",
		ProviderRu:            "Акимат и Управление образования города Астаны",
		GrantType:             "akimat_astana",
		LocationScope:         "astana",
		EducationLevel:        "bachelor",
		CoverageType:          "full_tuition",
		CoverageDetailsKz:     "Оқу ақысы 100% төленеді + мемлекеттік ай сайынғы шәкіртақы тағайындалады.",
		CoverageDetailsRu:     "100% покрытие стоимости обучения + ежемесячная государственная стипендия.",
		EligibilityCriteriaKz: "Астана қаласында тұрақты тіркеуі бар, ҰБТ шекті балын жинаған талапкерлер. Оқу бітірген соң Астана мекемелерінде 3 жыл жұмыс істеу шарты бар.",
		EligibilityCriteriaRu: "Абитуриенты с постоянной регистрацией в г. Астана, преодолевшие порог ЕНТ. Обязательство отработки 3 года в столице.",
		RequiredDocumentsKz:   []string{"Жеке куәлік көшірмесі", "ҰБТ сертификаты", "Аттестат", "Астанада тұрақты тіркеуі туралы анықтама", "075-У анықтамасы"},
		RequiredDocumentsRu:   []string{"Копия удостоверения личности", "Сертификат ЕНТ", "Аттестат", "Справка с места жительства в Астане", "Медсправка 075-У"},
		ApplicationURL:        &urlAkimat,
		AcademicYear:          "2026-2027",
		Status:                models.StatusVerified,
		LastVerifiedAt:        time.Now(),
		SourceID:              &source2.ID,
		Source:                &source2,
		Deadlines: []models.Deadline{
			{ID: "60000001-0000-0000-0000-000000000002", EntityType: "grant", EntityID: "40000001-0000-0000-0000-000000000001", AcademicYear: "2026-2027", TitleKz: "Құжат тапсыру", TitleRu: "Подача документов", EndDate: "2026-08-15", IsConfirmed: true},
		},
	}

	gr2 := models.Grant{
		ID:                    "40000001-0000-0000-0000-000000000002",
		Slug:                  "state-general-grant",
		TitleKz:               "ҚР Жалпы Мемлекеттік Білім беру гранты",
		TitleRu:               "Общий государственный образовательный грант РК",
		ProviderKz:            "ҚР Ғылым және жоғары білім министрлігі",
		ProviderRu:            "Министерство науки и высшего образования РК",
		GrantType:             "national",
		LocationScope:         "kazakhstan",
		EducationLevel:        "bachelor",
		CoverageType:          "full_tuition",
		CoverageDetailsKz:     "Толық 4 жылдық оқу ақысы және ай сайынғы стандартты/жоғарылатылған шәкіртақы.",
		CoverageDetailsRu:     "Полная стоимость 4 лет обучения на бакалавриате и ежемесячная государственная стипендия.",
		EligibilityCriteriaKz: "ҰБТ шекті балынан өткен барлық түлектер. Республикалық конкурсқа дейін 4 білім беру бағдарламалары тобын таңдау мүмкіндігі.",
		EligibilityCriteriaRu: "Все абитуриенты, набравшие пороговый балл ЕНТ. Возможность выбора до 4 групп образовательных программ.",
		RequiredDocumentsKz:   []string{"Аттестат", "ҰБТ электронды сертификаты", "075-У медициналық анықтамасы", "Жеке куәлік"},
		RequiredDocumentsRu:   []string{"Аттестат", "Сертификат ЕНТ", "Медсправка 075-У", "Удостоверение личности"},
		ApplicationURL:        &urlState,
		AcademicYear:          "2026-2027",
		Status:                models.StatusVerified,
		LastVerifiedAt:        time.Now(),
		SourceID:              &source1.ID,
		Source:                &source1,
		Deadlines: []models.Deadline{
			{ID: "60000001-0000-0000-0000-000000000001", EntityType: "grant", EntityID: "40000001-0000-0000-0000-000000000002", AcademicYear: "2026-2027", TitleKz: "Республикалық конкурсқа құжат қабылдау", TitleRu: "Прием на республиканский конкурс грантов", EndDate: "2026-07-20", IsConfirmed: true},
		},
	}

	gr3 := models.Grant{
		ID:                    "40000001-0000-0000-0000-000000000003",
		Slug:                  "qazaqstan-khalqyna-grant",
		TitleKz:               "'Қазақстан халқына' Қорының Білім Гранты",
		TitleRu:               "Образовательный грант фонда 'Қазақстан халқына'",
		ProviderKz:            "'Қазақстан халқына' қоғамдық қоры",
		ProviderRu:            "Общественный фонд 'Қазақстан халқына'",
		GrantType:             "charitable",
		LocationScope:         "kazakhstan",
		EducationLevel:        "bachelor",
		CoverageType:          "full_tuition",
		CoverageDetailsKz:     "Толық оқу ақысын өтеу + күнтізбелік жыл бойы ай сайынғы шәкіртақы.",
		CoverageDetailsRu:     "100% возмещение стоимости обучения + ежемесячная стипендия в течение календарного года.",
		EligibilityCriteriaKz: "Әлеуметтік осал санаттағы талапкерлер: жетім балалар, 1/2 топ мүгедектігі барлар, көп балалы және аз қамтылған отбасылар. ҰБТ шекті балы міндетті.",
		EligibilityCriteriaRu: "Социально уязвимые категории выпускников, преодолевшие порог ЕНТ, но не получившие госгрант.",
		RequiredDocumentsKz:   []string{"Әлеуметтік санатты растайтын құжаттар", "ҰБТ сертификаты", "Аттестат"},
		RequiredDocumentsRu:   []string{"Документы подтверждения категории", "Сертификат ЕНТ", "Аттестат"},
		ApplicationURL:        &urlQazaq,
		AcademicYear:          "2026-2027",
		Status:                models.StatusVerified,
		LastVerifiedAt:        time.Now(),
		SourceID:              &source1.ID,
		Source:                &source1,
	}

	gr4 := models.Grant{
		ID:                    "40000001-0000-0000-0000-000000000004",
		Slug:                  "aitu-rector-grant",
		TitleKz:               "AITU Ректор гранты және оқу жеңілдіктері",
		TitleRu:               "Ректорский грант и скидки Astana IT University",
		ProviderKz:            "Astana IT University",
		ProviderRu:            "Astana IT University",
		GrantType:             "rector",
		LocationScope:         "astana",
		EducationLevel:        "bachelor",
		CoverageType:          "partial_tuition",
		CoverageDetailsKz:     "100%, 50% және 25% оқу ақысына ішкі жеңілдіктер.",
		CoverageDetailsRu:     "100%, 50% и 25% скидки на оплату обучения от университета.",
		EligibilityCriteriaKz: "Республикалық олимпиада жүлдегерлері (Дарын, Жәутіков) немесе ҰБТ-дан 125+ балл жинаған үміткерлер.",
		EligibilityCriteriaRu: "Призеры республиканских олимпиад (Дарын, Жаутыковская) или обладатели 125+ баллов ЕНТ.",
		RequiredDocumentsKz:   []string{"Олимпиада дипломдары", "ҰБТ сертификаты", "Портфолио"},
		RequiredDocumentsRu:   []string{"Дипломы олимпиад", "Сертификат ЕНТ", "Портфолио"},
		ApplicationURL:        &urlAITU,
		AcademicYear:          "2026-2027",
		Status:                models.StatusVerified,
		LastVerifiedAt:        time.Now(),
		SourceID:              &source3.ID,
		Source:                &source3,
	}

	r.grants[gr1.Slug] = gr1
	r.grants[gr2.Slug] = gr2
	r.grants[gr3.Slug] = gr3
	r.grants[gr4.Slug] = gr4

	// Opportunities
	urlTechOrda := "https://astanahub.com/en/tech-orda/"
	urlDaryn := "https://daryn.kz"
	urlHub := "https://astanahub.com"
	age18 := "18-35 жас"
	ageSch := "9-11 сынып"

	durTech := "6-12 ай"
	durTechRu := "6-12 месяцев"
	durHub := "3 ай"
	durHubRu := "3 месяца"

	op1 := models.Opportunity{
		ID:                   "50000001-0000-0000-0000-000000000001",
		Slug:                 "tech-orda-voucher",
		TitleKz:              "Tech Orda — Тегін IT-ваучерлер бағдарламасы",
		TitleRu:              "Tech Orda — Программа бесплатных ИТ-ваучеров",
		ProviderKz:           "Astana Hub және ҚР ЦДИАӨМ",
		ProviderRu:           "Astana Hub и МЦРИАП РК",
		OpportunityType:      "course",
		DescriptionKz:        "Қазақстанның аккредиттелген IT-мектептерінде веб-бағдарламалау, Data Science және киберқауіпсіздікті тегін оқуға арналған 600 000 теңгелік ваучер.",
		DescriptionRu:        "Ваучеры до 600 000 ₸ на бесплатное обучение веб-разработке, машинному обучению и кибербезопасности в ведущих школах.",
		TargetAudienceKz:     "18-35 жас аралығындағы азаматтар және мектеп бітірушілері.",
		TargetAudienceRu:     "Граждане РК от 18 до 35 лет, выпускники школ и студенты.",
		AgeGradeRestrictions: &age18,
		CostType:             "free",
		BenefitsKz:           "Тегін кәсіби білім, сертификат, жұмысқа орналасуға көмек.",
		BenefitsRu:           "Бесплатное образование, сертификат, содействие в трудоустройстве.",
		DurationKz:           &durTech,
		DurationRu:           &durTechRu,
		LocationMode:         "hybrid",
		ApplicationURL:       &urlTechOrda,
		Status:               models.StatusVerified,
		LastVerifiedAt:       time.Now(),
		SourceID:             &source8.ID,
		Source:               &source8,
		Deadlines: []models.Deadline{
			{ID: "60000001-0000-0000-0000-000000000003", EntityType: "opportunity", EntityID: "50000001-0000-0000-0000-000000000001", AcademicYear: "2026-2027", TitleKz: "Күзгі лекке тіркелу", TitleRu: "Регистрация на осенний поток", EndDate: "2026-10-15", IsConfirmed: true},
		},
	}

	op2 := models.Opportunity{
		ID:                   "50000001-0000-0000-0000-000000000002",
		Slug:                 "daryn-informatics-olympiad",
		TitleKz:              "Информатикадан Республикалық 'Дарын' олимпиадасы",
		TitleRu:              "Республиканская олимпиада школьников по информатике",
		ProviderKz:           "Республикалық 'Дарын' ғылыми-практикалық орталығы",
		ProviderRu:           "РНПЦ 'Дарын' Минпросвещения РК",
		OpportunityType:      "olympiad",
		DescriptionKz:        "Мектеп оқушылары арасындағы ең беделді бағдарламалау жарысы. Жүлдегерлер ҰБТ-сыз грант алу немесе басым құқыққа ие болады.",
		DescriptionRu:        "Главное республиканское соревнование школьников по спортивному программированию. Призеры получают приоритетное право на гранты.",
		TargetAudienceKz:     "9, 10, 11-сынып оқушылары.",
		TargetAudienceRu:     "Учащиеся 9, 10, 11 классов школ Астаны и регионов.",
		AgeGradeRestrictions: &ageSch,
		CostType:             "free",
		BenefitsKz:           "ЖОО-ға басым құқықпен түсу, диплом, бағалы сыйлықтар.",
		BenefitsRu:           "Преимущественное право на образовательные гранты вузов, медали.",
		LocationMode:         "in_person_astana",
		ApplicationURL:       &urlDaryn,
		Status:               models.StatusVerified,
		LastVerifiedAt:       time.Now(),
		SourceID:             &source1.ID,
		Source:               &source1,
	}

	op3 := models.Opportunity{
		ID:                   "50000001-0000-0000-0000-000000000003",
		Slug:                 "astana-hub-startup-garage",
		TitleKz:              "Astana Hub 'Startup Garage' Инкубациясы",
		TitleRu:              "Программа инкубации Startup Garage в Astana Hub",
		ProviderKz:           "Astana Hub халықаралық технопаркі",
		ProviderRu:           "Международный технопарк IT-стартапов Astana Hub",
		OpportunityType:      "mentorship",
		DescriptionKz:        "Мектеп және университет оқушыларына арналған өз IT стартапын нөлден бастап құру, менторлық және инвестиция тарту бағдарламасы.",
		DescriptionRu:        "Интенсивная менторская программа для запуска технологического стартапа со школьной или студенческой скамьи.",
		TargetAudienceKz:     "Жобасы немесе IT идеясы бар оқушылар мен студенттер.",
		TargetAudienceRu:     "Школьники старших классов и студенты с проектами.",
		CostType:             "free",
		BenefitsKz:           "Тегін коворкинг, EXPO алаңы, трекерлік көмек, сарапшылар менторы.",
		BenefitsRu:           "Бесплатное рабочее пространство в EXPO, трекеры, менторы.",
		DurationKz:           &durHub,
		DurationRu:           &durHubRu,
		LocationMode:         "in_person_astana",
		ApplicationURL:       &urlHub,
		Status:               models.StatusVerified,
		LastVerifiedAt:       time.Now(),
		SourceID:             &source8.ID,
		Source:               &source8,
	}

	r.opps[op1.Slug] = op1
	r.opps[op2.Slug] = op2
	r.opps[op3.Slug] = op3

	// Deadlines
	r.deadlines = []models.Deadline{
		{ID: "60000001-0000-0000-0000-000000000001", EntityType: "grant", EntityID: gr2.ID, AcademicYear: "2026-2027", TitleKz: "Мемлекеттік гранттар конкурсына өтінім қабылдау", TitleRu: "Прием заявлений на конкурс государственных грантов", EndDate: "2026-07-20", IsConfirmed: true},
		{ID: "60000001-0000-0000-0000-000000000002", EntityType: "grant", EntityID: gr1.ID, AcademicYear: "2026-2027", TitleKz: "Астана қаласы әкімінің гранттарына құжат тапсыру", TitleRu: "Подача документов на грант акима Астаны", EndDate: "2026-08-15", IsConfirmed: true},
		{ID: "60000001-0000-0000-0000-000000000003", EntityType: "opportunity", EntityID: op1.ID, AcademicYear: "2026-2027", TitleKz: "Tech Orda күзгі легіне тіркелу", TitleRu: "Регистрация на осенний поток Tech Orda", EndDate: "2026-10-15", IsConfirmed: true},
	}

	// Default admin user (Bcrypt of 'AdminAstana2026!')
	adminUser := models.User{
		ID:        "b0000001-0000-0000-0000-000000000001",
		Email:     "admin@tandau-astana.kz",
		FullName:  "Астана Платформа Әкімшісі",
		Role:      models.RoleAdmin,
		IsActive:  true,
		CreatedAt: time.Now(),
	}
	// Password is AdminAstana2026!
	r.users[adminUser.Email] = struct {
		user models.User
		hash string
	}{
		user: adminUser,
		hash: "$2a$10$vQ6/13k4pX10YkL4n74WRe5q2w1Q/aM/F5Tj3OqE4FjQ2E9G/4G5K", // bcrypt hash
	}
}

func (r *repositoryImpl) GetDirections() ([]models.Direction, error) {
	r.memLock.RLock()
	defer r.memLock.RUnlock()
	return r.dirs, nil
}

func (r *repositoryImpl) GetCareers(directionSlug string) ([]models.Career, error) {
	r.memLock.RLock()
	defer r.memLock.RUnlock()

	var result []models.Career
	for _, c := range r.careers {
		if directionSlug != "" && c.Direction != nil && c.Direction.Slug != directionSlug {
			continue
		}
		result = append(result, c)
	}
	return result, nil
}

func (r *repositoryImpl) GetCareerBySlug(slug string) (*models.Career, error) {
	r.memLock.RLock()
	defer r.memLock.RUnlock()

	if c, ok := r.careers[slug]; ok {
		return &c, nil
	}
	return nil, sql.ErrNoRows
}

func (r *repositoryImpl) GetInstitutions(instType, status string) ([]models.Institution, error) {
	r.memLock.RLock()
	defer r.memLock.RUnlock()

	var result []models.Institution
	for _, inst := range r.insts {
		if instType != "" && inst.InstitutionType != instType {
			continue
		}
		if status != "" && string(inst.Status) != status {
			continue
		}
		result = append(result, inst)
	}
	return result, nil
}

func (r *repositoryImpl) GetInstitutionBySlug(slug string) (*models.Institution, error) {
	r.memLock.RLock()
	defer r.memLock.RUnlock()

	if inst, ok := r.insts[slug]; ok {
		return &inst, nil
	}
	return nil, sql.ErrNoRows
}

func (r *repositoryImpl) GetProgramGroups(directionSlug string) ([]models.EducationProgramGroup, error) {
	r.memLock.RLock()
	defer r.memLock.RUnlock()

	var result []models.EducationProgramGroup
	for _, g := range r.groups {
		if directionSlug != "" && g.Direction != nil && g.Direction.Slug != directionSlug {
			continue
		}
		result = append(result, g)
	}
	return result, nil
}

func (r *repositoryImpl) GetPrograms(groupId string) ([]models.EducationProgram, error) {
	r.memLock.RLock()
	defer r.memLock.RUnlock()

	var result []models.EducationProgram
	for _, p := range r.programs {
		if groupId != "" && p.GroupID != groupId {
			continue
		}
		result = append(result, p)
	}
	return result, nil
}

func (r *repositoryImpl) GetProgramByCode(code string) (*models.EducationProgram, error) {
	r.memLock.RLock()
	defer r.memLock.RUnlock()

	if p, ok := r.programs[code]; ok {
		return &p, nil
	}
	return nil, sql.ErrNoRows
}

func (r *repositoryImpl) GetGrants(grantType, eduLevel, status string) ([]models.Grant, error) {
	r.memLock.RLock()
	defer r.memLock.RUnlock()

	var result []models.Grant
	for _, g := range r.grants {
		if grantType != "" && g.GrantType != grantType {
			continue
		}
		if eduLevel != "" && g.EducationLevel != eduLevel && g.EducationLevel != "all" {
			continue
		}
		if status != "" && string(g.Status) != status {
			continue
		}
		result = append(result, g)
	}
	return result, nil
}

func (r *repositoryImpl) GetGrantBySlug(slug string) (*models.Grant, error) {
	r.memLock.RLock()
	defer r.memLock.RUnlock()

	if g, ok := r.grants[slug]; ok {
		return &g, nil
	}
	return nil, sql.ErrNoRows
}

func (r *repositoryImpl) GetOpportunities(oppType, costType, status string) ([]models.Opportunity, error) {
	r.memLock.RLock()
	defer r.memLock.RUnlock()

	var result []models.Opportunity
	for _, opp := range r.opps {
		if oppType != "" && opp.OpportunityType != oppType {
			continue
		}
		if costType != "" && opp.CostType != costType {
			continue
		}
		if status != "" && string(opp.Status) != status {
			continue
		}
		result = append(result, opp)
	}
	return result, nil
}

func (r *repositoryImpl) GetOpportunityBySlug(slug string) (*models.Opportunity, error) {
	r.memLock.RLock()
	defer r.memLock.RUnlock()

	if opp, ok := r.opps[slug]; ok {
		return &opp, nil
	}
	return nil, sql.ErrNoRows
}

func (r *repositoryImpl) GetDeadlines(academicYear string) ([]models.Deadline, error) {
	r.memLock.RLock()
	defer r.memLock.RUnlock()

	var result []models.Deadline
	for _, d := range r.deadlines {
		if academicYear != "" && d.AcademicYear != academicYear {
			continue
		}
		result = append(result, d)
	}
	return result, nil
}

func (r *repositoryImpl) Search(query string, typeFilter string) ([]models.SearchResultItem, error) {
	r.memLock.RLock()
	defer r.memLock.RUnlock()

	q := strings.ToLower(strings.TrimSpace(query))
	var items []models.SearchResultItem

	matches := func(texts ...string) bool {
		if q == "" {
			return true
		}
		for _, t := range texts {
			if strings.Contains(strings.ToLower(t), q) {
				return true
			}
		}
		return false
	}

	// 1. Careers
	if typeFilter == "" || typeFilter == "careers" {
		for _, c := range r.careers {
			if matches(c.TitleKz, c.TitleRu, c.Slug, c.DescriptionKz, c.DescriptionRu) {
				subKz := "Мамандық"
				subRu := "Профессия"
				if c.Direction != nil {
					subKz = c.Direction.NameKz
					subRu = c.Direction.NameRu
				}
				items = append(items, models.SearchResultItem{
					Type:       "career",
					ID:         c.ID,
					Slug:       c.Slug,
					TitleKz:    c.TitleKz,
					TitleRu:    c.TitleRu,
					SubtitleKz: subKz,
					SubtitleRu: subRu,
					Badge:      "Мамандық",
					URL:        "/careers/" + c.Slug,
				})
			}
		}
	}

	// 2. Institutions
	if typeFilter == "" || typeFilter == "institutions" {
		for _, inst := range r.insts {
			shortKz, shortRu := "", ""
			if inst.ShortNameKz != nil {
				shortKz = *inst.ShortNameKz
			}
			if inst.ShortNameRu != nil {
				shortRu = *inst.ShortNameRu
			}
			if matches(inst.NameKz, inst.NameRu, shortKz, shortRu, inst.Slug) {
				badge := "Университет"
				if inst.InstitutionType == "college" {
					badge = "Колледж"
				}
				items = append(items, models.SearchResultItem{
					Type:       "institution",
					ID:         inst.ID,
					Slug:       inst.Slug,
					TitleKz:    inst.NameKz,
					TitleRu:    inst.NameRu,
					SubtitleKz: badge + " • Астана",
					SubtitleRu: badge + " • Астана",
					Badge:      badge,
					URL:        "/education/institutions/" + inst.Slug,
				})
			}
		}
	}

	// 3. Programs
	if typeFilter == "" || typeFilter == "programs" {
		for _, p := range r.programs {
			if matches(p.NameKz, p.NameRu, p.Code) {
				items = append(items, models.SearchResultItem{
					Type:       "program",
					ID:         p.ID,
					Slug:       p.Code,
					TitleKz:    p.NameKz,
					TitleRu:    p.NameRu,
					SubtitleKz: "Бағдарлама коды: " + p.Code,
					SubtitleRu: "Код программы: " + p.Code,
					Badge:      p.Code,
					URL:        "/education/programs/" + p.Code,
				})
			}
		}
	}

	// 4. Grants
	if typeFilter == "" || typeFilter == "grants" {
		for _, g := range r.grants {
			if matches(g.TitleKz, g.TitleRu, g.ProviderKz, g.ProviderRu, g.Slug) {
				items = append(items, models.SearchResultItem{
					Type:       "grant",
					ID:         g.ID,
					Slug:       g.Slug,
					TitleKz:    g.TitleKz,
					TitleRu:    g.TitleRu,
					SubtitleKz: g.ProviderKz,
					SubtitleRu: g.ProviderRu,
					Badge:      "Грант",
					URL:        "/grants/" + g.Slug,
				})
			}
		}
	}

	// 5. Opportunities
	if typeFilter == "" || typeFilter == "opportunities" {
		for _, opp := range r.opps {
			if matches(opp.TitleKz, opp.TitleRu, opp.ProviderKz, opp.ProviderRu, opp.Slug) {
				items = append(items, models.SearchResultItem{
					Type:       "opportunity",
					ID:         opp.ID,
					Slug:       opp.Slug,
					TitleKz:    opp.TitleKz,
					TitleRu:    opp.TitleRu,
					SubtitleKz: opp.ProviderKz,
					SubtitleRu: opp.ProviderRu,
					Badge:      "Мүмкіндік",
					URL:        "/opportunities/" + opp.Slug,
				})
			}
		}
	}

	return items, nil
}

func (r *repositoryImpl) GetSources() ([]models.Source, error) {
	r.memLock.RLock()
	defer r.memLock.RUnlock()

	var result []models.Source
	for _, s := range r.sources {
		result = append(result, s)
	}
	return result, nil
}

func (r *repositoryImpl) GetSourceById(id string) (*models.Source, error) {
	r.memLock.RLock()
	defer r.memLock.RUnlock()

	if s, ok := r.sources[id]; ok {
		return &s, nil
	}
	return nil, sql.ErrNoRows
}

func (r *repositoryImpl) CreateSource(source *models.Source) error {
	r.memLock.Lock()
	defer r.memLock.Unlock()

	if source.ID == "" {
		source.ID = uuid.New().String()
	}
	source.RetrievedAt = time.Now()
	r.sources[source.ID] = *source
	return nil
}

func (r *repositoryImpl) GetVerificationLogs() ([]models.VerificationLog, error) {
	r.memLock.RLock()
	defer r.memLock.RUnlock()
	return r.logs, nil
}

func (r *repositoryImpl) CreateVerificationLog(vlog *models.VerificationLog) error {
	r.memLock.Lock()
	defer r.memLock.Unlock()

	if vlog.ID == "" {
		vlog.ID = uuid.New().String()
	}
	vlog.CreatedAt = time.Now()
	r.logs = append([]models.VerificationLog{*vlog}, r.logs...)
	return nil
}

func (r *repositoryImpl) GetUserByEmail(email string) (*models.User, string, error) {
	r.memLock.RLock()
	defer r.memLock.RUnlock()

	if entry, ok := r.users[email]; ok {
		return &entry.user, entry.hash, nil
	}
	return nil, "", sql.ErrNoRows
}

func (r *repositoryImpl) GetAdminStats() (map[string]interface{}, error) {
	r.memLock.RLock()
	defer r.memLock.RUnlock()

	totalVerified := 0
	for _, inst := range r.insts {
		if inst.Status == models.StatusVerified {
			totalVerified++
		}
	}
	for _, g := range r.grants {
		if g.Status == models.StatusVerified {
			totalVerified++
		}
	}
	for _, op := range r.opps {
		if op.Status == models.StatusVerified {
			totalVerified++
		}
	}

	return map[string]interface{}{
		"institutions_count": len(r.insts),
		"programs_count":     len(r.programs),
		"careers_count":      len(r.careers),
		"grants_count":       len(r.grants),
		"opportunities_count": len(r.opps),
		"sources_count":      len(r.sources),
		"verified_records":   totalVerified,
		"pending_reviews":    0,
	}, nil
}

func (r *repositoryImpl) UpdateEntityStatus(entityType, id, newStatus, comments, userId string) error {
	r.memLock.Lock()
	defer r.memLock.Unlock()

	var oldStatus string
	switch entityType {
	case "institution":
		for k, v := range r.insts {
			if v.ID == id || v.Slug == id {
				oldStatus = string(v.Status)
				v.Status = models.ContentStatus(newStatus)
				v.LastVerifiedAt = time.Now()
				r.insts[k] = v
				break
			}
		}
	case "grant":
		for k, v := range r.grants {
			if v.ID == id || v.Slug == id {
				oldStatus = string(v.Status)
				v.Status = models.ContentStatus(newStatus)
				v.LastVerifiedAt = time.Now()
				r.grants[k] = v
				break
			}
		}
	case "opportunity":
		for k, v := range r.opps {
			if v.ID == id || v.Slug == id {
				oldStatus = string(v.Status)
				v.Status = models.ContentStatus(newStatus)
				v.LastVerifiedAt = time.Now()
				r.opps[k] = v
				break
			}
		}
	default:
		return fmt.Errorf("unsupported entity type: %s", entityType)
	}

	vlog := models.VerificationLog{
		ID:         uuid.New().String(),
		EntityType: entityType,
		EntityID:   id,
		Action:     "status_changed",
		OldStatus:  &oldStatus,
		NewStatus:  &newStatus,
		UserID:     &userId,
		Comments:   &comments,
		CreatedAt:  time.Now(),
	}
	r.logs = append([]models.VerificationLog{vlog}, r.logs...)
	return nil
}

func (r *repositoryImpl) CreateInstitution(inst *models.Institution) error {
	r.memLock.Lock()
	defer r.memLock.Unlock()
	if inst.ID == "" {
		inst.ID = uuid.New().String()
	}
	r.insts[inst.Slug] = *inst
	return nil
}

func (r *repositoryImpl) CreateGrant(grant *models.Grant) error {
	r.memLock.Lock()
	defer r.memLock.Unlock()
	if grant.ID == "" {
		grant.ID = uuid.New().String()
	}
	r.grants[grant.Slug] = *grant
	return nil
}

func (r *repositoryImpl) CreateOpportunity(opp *models.Opportunity) error {
	r.memLock.Lock()
	defer r.memLock.Unlock()
	if opp.ID == "" {
		opp.ID = uuid.New().String()
	}
	r.opps[opp.Slug] = *opp
	return nil
}
