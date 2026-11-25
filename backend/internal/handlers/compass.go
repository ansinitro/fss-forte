package handlers

import (
	_ "embed"
	"encoding/json"
	"log"
	"sort"
	"strconv"
	"strings"
	"sync"

	"github.com/gofiber/fiber/v2"
	"astana-platform/internal/models"
)

//go:embed data/all_colleges.json
var allCollegesJSON []byte

//go:embed data/all_universities.json
var allUniversitiesJSON []byte

//go:embed data/univision_gops.json
var univisionGopsJSON []byte

//go:embed data/professions.json
var professionsJSON []byte

//go:embed data/knowledge_base.json
var knowledgeBaseJSON []byte

// --- Colleges across Kazakhstan (Gov.kz 707) ---

type KZCollege struct {
	ID               string `json:"id"`
	Slug             string `json:"slug"`
	RegionID         string `json:"region_id"`
	RegionRu         string `json:"region_ru"`
	RegionKk         string `json:"region_kk"`
	DistrictRu       string `json:"district_ru"`
	DistrictKk       string `json:"district_kk"`
	NameRu           string `json:"name_ru"`
	NameKk           string `json:"name_kk"`
	AddressRu        string `json:"address_ru"`
	AddressKk        string `json:"address_kk"`
	Director         string `json:"director"`
	Phone            string `json:"phone"`
	Email            string `json:"email"`
	Website          string `json:"website"`
	IsState          bool   `json:"is_state"`
	OwnershipRu      string `json:"ownership_ru"`
	OwnershipKk      string `json:"ownership_kk"`
	SpecializationRu string `json:"specialization_ru"`
	SpecializationKk string `json:"specialization_kk"`
	DormitoryInfoRu  string `json:"dormitory_info_ru"`
	DormitoryInfoKk  string `json:"dormitory_info_kk"`
	SourceURL        string `json:"source_url"`
}

type RegionStat struct {
	ID     string `json:"id"`
	NameRu string `json:"name_ru"`
	NameKk string `json:"name_kk"`
	Count  int    `json:"count"`
}

// --- Unified Kazakhstan Universities (Gov.kz 657 + Univision + StudentHub) ---

type UniTuitionSample struct {
	Program  string `json:"program"`
	PriceKZT int    `json:"price_kzt"`
}

type KZUniversity struct {
	ID              string             `json:"id"`
	Slug            string             `json:"slug"`
	EntCode         string             `json:"ent_code"`
	NameRu          string             `json:"name_ru"`
	NameKk          string             `json:"name_kk"`
	RegionID        string             `json:"region_id"`
	RegionRu        string             `json:"region_ru"`
	RegionKk        string             `json:"region_kk"`
	City            string             `json:"city"`
	AddressRu       string             `json:"address_ru"`
	AddressKk       string             `json:"address_kk"`
	FoundedYear     string             `json:"founded_year"`
	Email           string             `json:"email"`
	Phone           string             `json:"phone"`
	Website         string             `json:"website"`
	RectorRu        string             `json:"rector_ru"`
	RectorKk        string             `json:"rector_kk"`
	RectorContacts  string             `json:"rector_contacts"`
	Ownership       string             `json:"ownership"`
	UnivType        string             `json:"univ_type"`
	StudentsTotal   *int               `json:"students_total"`
	StudentsGrant   *int               `json:"students_grant"`
	StudentsPaid    *int               `json:"students_paid"`
	MinTuitionKZT   *int               `json:"min_tuition_kzt"`
	MaxTuitionKZT   *int               `json:"max_tuition_kzt"`
	SamplePrices    []UniTuitionSample `json:"sample_prices"`
	ProgramsCount   int                `json:"programs_count"`
	StudentHubSlug  string             `json:"studenthub_slug"`
	UnivisionURL    string             `json:"univision_url"`
	Sources         []string           `json:"sources"`
}

// --- Univision 131 Bachelor GOPs ---

type GopGrantCounts struct {
	Full2025   *int `json:"full_2025"`
	Full2024   *int `json:"full_2024"`
	Short2025  *int `json:"short_2025"`
	Short2024  *int `json:"short_2024"`
	Quotas2025 *int `json:"quotas_2025"`
}

type GopPassingSummary struct {
	GeneralMin     *int `json:"general_min"`
	GeneralAwarded *int `json:"general_awarded"`
	RuralMin       *int `json:"rural_min"`
	RuralAwarded   *int `json:"rural_awarded"`
}

type GopUniPassing struct {
	UniName     string `json:"uni_name"`
	MinScore    *int   `json:"min_score"`
	MaxScore    *int   `json:"max_score"`
	AvgScore    *int   `json:"avg_score"`
	GrantsCount *int   `json:"grants_count"`
}

type GopUniThreshold struct {
	UniName    string `json:"uni_name"`
	FullScore  *int   `json:"full_score"`
	ShortScore *int   `json:"short_score"`
}

type GopProgramEntry struct {
	Code       string   `json:"code"`
	Name       string   `json:"name"`
	UniCount   int      `json:"uni_count"`
	SampleUnis []string `json:"sample_unis"`
}

type UnivisionGOP struct {
	Code              string            `json:"code"`
	Slug              string            `json:"slug"`
	TitleRu           string            `json:"title_ru"`
	TitleKk           string            `json:"title_kk"`
	URLRu             string            `json:"url_ru"`
	URLKk             string            `json:"url_kk"`
	PairRu            string            `json:"pair_ru"`
	PairKk            string            `json:"pair_kk"`
	AreaRu            string            `json:"area_ru"`
	AreaKk            string            `json:"area_kk"`
	DirectionRu       string            `json:"direction_ru"`
	DirectionKk       string            `json:"direction_kk"`
	ProgramsCount     int               `json:"programs_count"`
	UniversitiesCount int               `json:"universities_count"`
	Grants            GopGrantCounts    `json:"grants"`
	Passing2025       GopPassingSummary `json:"passing_2025"`
	UniPassing2025    []GopUniPassing   `json:"uni_passing_2025"`
	UniThresholds     []GopUniThreshold `json:"uni_thresholds"`
	Programs          []GopProgramEntry `json:"programs"`
}

type GOPSummary struct {
	Code              string            `json:"code"`
	Slug              string            `json:"slug"`
	TitleRu           string            `json:"title_ru"`
	TitleKk           string            `json:"title_kk"`
	PairRu            string            `json:"pair_ru"`
	PairKk            string            `json:"pair_kk"`
	AreaRu            string            `json:"area_ru"`
	AreaKk            string            `json:"area_kk"`
	ProgramsCount     int               `json:"programs_count"`
	UniversitiesCount int               `json:"universities_count"`
	Grants            GopGrantCounts    `json:"grants"`
	Passing2025       GopPassingSummary `json:"passing_2025"`
}

// --- Bachelor Professions (Univision) ---

type ProfessionProgram struct {
	Program    string `json:"program"`
	University string `json:"university"`
}

type Profession struct {
	ID              string              `json:"id"`
	Slug            string              `json:"slug"`
	TitleRu         string              `json:"title_ru"`
	TitleKk         string              `json:"title_kk"`
	CategoryRu      string              `json:"category_ru"`
	CategoryKk      string              `json:"category_kk"`
	URLRu           string              `json:"url_ru"`
	URLKk           string              `json:"url_kk"`
	RelatedPrograms []ProfessionProgram `json:"related_programs,omitempty"`
}

// --- Knowledge Base (StudentHub 24 guides + Univision Grant Summary) ---

type GrantSummary2025 struct {
	Year             int    `json:"year"`
	TotalGrants      int    `json:"total_grants"`
	BachelorTotal    int    `json:"bachelor_total"`
	BachelorFullTime int    `json:"bachelor_full_time"`
	BachelorShort    int    `json:"bachelor_short"`
	BachelorQuotas   int    `json:"bachelor_quotas"`
	MasterTotal      int    `json:"master_total"`
	PhDTotal         int    `json:"phd_total"`
	SourceURL        string `json:"source_url"`
}

type KBSection struct {
	Heading    string   `json:"heading"`
	Paragraphs []string `json:"paragraphs"`
	Bullets    []string `json:"bullets"`
}

type KBArticle struct {
	Slug            string      `json:"slug"`
	Category        string      `json:"category"`
	TitleRu         string      `json:"title_ru"`
	TitleKk         string      `json:"title_kk"`
	SummaryRu       string      `json:"summary_ru"`
	SummaryKk       string      `json:"summary_kk"`
	IntroParagraphs []string    `json:"intro_paragraphs,omitempty"`
	Sections        []KBSection `json:"sections,omitempty"`
	SourceName      string      `json:"source_name"`
	SourceURL       string      `json:"source_url"`
	AcademicYear    string      `json:"academic_year"`
}

type KnowledgeBaseBundle struct {
	GrantSummary GrantSummary2025 `json:"grant_summary"`
	Articles     []KBArticle      `json:"articles"`
}

var (
	compassOnce sync.Once
	allColleges []KZCollege
	allUnis     []KZUniversity
	allGops     []UnivisionGOP
	allProfs    []Profession
	kbBundle    KnowledgeBaseBundle
)

func initCompassData() {
	compassOnce.Do(func() {
		if err := json.Unmarshal(allCollegesJSON, &allColleges); err != nil {
			log.Printf("⚠️ Failed to unmarshal all_colleges.json: %v", err)
		}
		if err := json.Unmarshal(allUniversitiesJSON, &allUnis); err != nil {
			log.Printf("⚠️ Failed to unmarshal all_universities.json: %v", err)
		}
		if err := json.Unmarshal(univisionGopsJSON, &allGops); err != nil {
			log.Printf("⚠️ Failed to unmarshal univision_gops.json: %v", err)
		}
		if err := json.Unmarshal(professionsJSON, &allProfs); err != nil {
			log.Printf("⚠️ Failed to unmarshal professions.json: %v", err)
		}
		if err := json.Unmarshal(knowledgeBaseJSON, &kbBundle); err != nil {
			log.Printf("⚠️ Failed to unmarshal knowledge_base.json: %v", err)
		}
		log.Printf("✅ Compass 4-source datasets loaded: %d colleges, %d unis, %d GOPs, %d professions, %d KB guides",
			len(allColleges), len(allUnis), len(allGops), len(allProfs), len(kbBundle.Articles))
	})
}

func paginateParams(c *fiber.Ctx, defaultLimit, maxLimit int) (int, int) {
	limit, err := strconv.Atoi(c.Query("limit", strconv.Itoa(defaultLimit)))
	if err != nil || limit <= 0 {
		limit = defaultLimit
	}
	if limit > maxLimit {
		limit = maxLimit
	}
	offset, err := strconv.Atoi(c.Query("offset", "0"))
	if err != nil || offset < 0 {
		offset = 0
	}
	return limit, offset
}

func slicePage[T any](items []T, offset, limit int) []T {
	if offset >= len(items) {
		return []T{}
	}
	end := offset + limit
	if end > len(items) {
		end = len(items)
	}
	return items[offset:end]
}

// GetAllColleges serves all 688 Kazakhstan colleges across 19 regions from Gov.kz 707.
func (h *Handler) GetAllColleges(c *fiber.Ctx) error {
	initCompassData()

	region := strings.TrimSpace(strings.ToLower(c.Query("region")))
	district := strings.TrimSpace(strings.ToLower(c.Query("district")))
	ownership := strings.TrimSpace(strings.ToLower(c.Query("ownership")))
	spec := strings.TrimSpace(strings.ToLower(c.Query("specialization")))
	search := strings.TrimSpace(strings.ToLower(c.Query("search", c.Query("q"))))
	if len(search) > 200 {
		search = search[:200]
	}

	// Build region counts across entire catalog
	regOrder := make([]string, 0, 20)
	regStatsMap := make(map[string]*RegionStat, 20)
	for _, col := range allColleges {
		st, ok := regStatsMap[col.RegionID]
		if !ok {
			st = &RegionStat{ID: col.RegionID, NameRu: col.RegionRu, NameKk: col.RegionKk}
			regStatsMap[col.RegionID] = st
			regOrder = append(regOrder, col.RegionID)
		}
		st.Count++
	}
	regions := make([]RegionStat, 0, len(regOrder))
	for _, id := range regOrder {
		regions = append(regions, *regStatsMap[id])
	}

	filtered := make([]KZCollege, 0)
	for _, col := range allColleges {
		if region != "" && region != "all" {
			if strings.ToLower(col.RegionID) != region &&
				!strings.Contains(strings.ToLower(col.RegionRu), region) &&
				!strings.Contains(strings.ToLower(col.RegionKk), region) {
				continue
			}
		}
		if district != "" {
			if !strings.Contains(strings.ToLower(col.DistrictRu), district) &&
				!strings.Contains(strings.ToLower(col.DistrictKk), district) {
				continue
			}
		}
		if ownership == "state" && !col.IsState {
			continue
		}
		if ownership == "private" && col.IsState {
			continue
		}
		if spec != "" {
			if !strings.Contains(strings.ToLower(col.SpecializationRu), spec) &&
				!strings.Contains(strings.ToLower(col.SpecializationKk), spec) {
				continue
			}
		}
		if search != "" {
			if !strings.Contains(strings.ToLower(col.NameRu), search) &&
				!strings.Contains(strings.ToLower(col.NameKk), search) &&
				!strings.Contains(strings.ToLower(col.AddressRu), search) &&
				!strings.Contains(strings.ToLower(col.Director), search) &&
				!strings.Contains(strings.ToLower(col.SpecializationRu), search) &&
				!strings.Contains(strings.ToLower(col.RegionRu), search) {
				continue
			}
		}
		filtered = append(filtered, col)
	}

	limit, offset := paginateParams(c, 120, 700)
	return c.JSON(fiber.Map{
		"total":    len(filtered),
		"regions":  regions,
		"colleges": slicePage(filtered, offset, limit),
	})
}

// GetAllUniversities serves the merged 143 Kazakhstan Universities registry (Gov.kz 657 + Univision + StudentHub).
func (h *Handler) GetAllUniversities(c *fiber.Ctx) error {
	initCompassData()

	region := strings.TrimSpace(strings.ToLower(c.Query("region")))
	city := strings.TrimSpace(strings.ToLower(c.Query("city")))
	hasPrice := strings.TrimSpace(strings.ToLower(c.Query("has_price")))
	search := strings.TrimSpace(strings.ToLower(c.Query("search", c.Query("q"))))
	if len(search) > 200 {
		search = search[:200]
	}

	regOrder := make([]string, 0, 24)
	regStatsMap := make(map[string]*RegionStat, 24)
	for _, u := range allUnis {
		st, ok := regStatsMap[u.RegionID]
		if !ok {
			st = &RegionStat{ID: u.RegionID, NameRu: u.RegionRu, NameKk: u.RegionKk}
			regStatsMap[u.RegionID] = st
			regOrder = append(regOrder, u.RegionID)
		}
		st.Count++
	}
	regions := make([]RegionStat, 0, len(regOrder))
	for _, id := range regOrder {
		regions = append(regions, *regStatsMap[id])
	}

	filtered := make([]KZUniversity, 0)
	for _, u := range allUnis {
		if region != "" && region != "all" {
			if strings.ToLower(u.RegionID) != region &&
				!strings.Contains(strings.ToLower(u.RegionRu), region) &&
				!strings.Contains(strings.ToLower(u.RegionKk), region) {
				continue
			}
		}
		if city != "" && !strings.Contains(strings.ToLower(u.City), city) {
			continue
		}
		if hasPrice == "true" && u.MinTuitionKZT == nil {
			continue
		}
		if search != "" {
			if !strings.Contains(strings.ToLower(u.NameRu), search) &&
				!strings.Contains(strings.ToLower(u.NameKk), search) &&
				!strings.Contains(strings.ToLower(u.EntCode), search) &&
				!strings.Contains(strings.ToLower(u.City), search) &&
				!strings.Contains(strings.ToLower(u.RectorRu), search) &&
				!strings.Contains(strings.ToLower(u.Email), search) {
				continue
			}
		}
		filtered = append(filtered, u)
	}

	limit, offset := paginateParams(c, 150, 200)
	return c.JSON(fiber.Map{
		"total":        len(filtered),
		"regions":      regions,
		"universities": slicePage(filtered, offset, limit),
	})
}

// GetAllUniversityBySlug returns full details + linked StudentHub programs for a Kazakhstan university.
func (h *Handler) GetAllUniversityBySlug(c *fiber.Ctx) error {
	initCompassData()
	initStudentHubData()

	rawSlug := strings.TrimSpace(c.Params("slug"))
	slug := strings.ToLower(rawSlug)

	// 1. Search in allUnis
	for _, u := range allUnis {
		if strings.ToLower(u.Slug) == slug ||
			strings.ToLower(u.ID) == slug ||
			(u.EntCode != "" && u.EntCode == slug) ||
			(u.StudentHubSlug != "" && strings.ToLower(u.StudentHubSlug) == slug) ||
			strings.ToLower(strings.TrimSpace(u.NameRu)) == slug ||
			strings.ToLower(strings.TrimSpace(u.NameKk)) == slug {
			var programs []StudentHubUniProgram
			if u.StudentHubSlug != "" {
				for _, shu := range hubUniversities {
					if strings.ToLower(shu.Slug) == strings.ToLower(u.StudentHubSlug) {
						programs = shu.Programs
						break
					}
				}
			}
			if programs == nil {
				// try matching by name in hubUniversities
				for _, shu := range hubUniversities {
					if strings.EqualFold(shu.Name, u.NameRu) || strings.EqualFold(shu.Slug, u.Slug) {
						programs = shu.Programs
						break
					}
				}
			}
			if programs == nil {
				programs = []StudentHubUniProgram{}
			}
			return c.JSON(fiber.Map{
				"university": u,
				"programs":   programs,
			})
		}
	}

	// 2. Search directly in hubUniversities (fallback for universities only in StudentHub)
	for _, shu := range hubUniversities {
		if strings.ToLower(shu.Slug) == slug || strings.ToLower(strings.TrimSpace(shu.Name)) == slug {
			synthetic := KZUniversity{
				ID:             shu.Slug,
				Slug:           shu.Slug,
				NameRu:         shu.Name,
				NameKk:         shu.Name,
				City:           shu.City,
				Phone:          shu.Phone,
				ProgramsCount:  shu.ProgramsCount,
				StudentHubSlug: shu.Slug,
				Sources:        []string{"studenthub.kz"},
			}
			return c.JSON(fiber.Map{
				"university": synthetic,
				"programs":   shu.Programs,
			})
		}
	}

	return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "University not found"})
}

// GetAllCollegeBySlug returns a single college by slug or ID across all 688 Kazakhstan colleges (Gov.kz 707).
func (h *Handler) GetAllCollegeBySlug(c *fiber.Ctx) error {
	initCompassData()
	initAstanaColleges()

	rawSlug := strings.TrimSpace(c.Params("slug"))
	slug := strings.ToLower(rawSlug)

	// 1. Search in all 688 KZ colleges
	for _, col := range allColleges {
		if strings.ToLower(col.Slug) == slug || strings.ToLower(col.ID) == slug || strings.ToLower(strings.TrimSpace(col.NameRu)) == slug {
			return c.JSON(fiber.Map{
				"college": col,
			})
		}
	}

	// 2. Search in Astana verified colleges
	for _, ac := range astanaColleges {
		if strings.ToLower(ac.Slug) == slug || strings.ToLower(ac.ID) == slug || strings.ToLower(strings.TrimSpace(ac.NameRu)) == slug {
			synthetic := KZCollege{
				ID:               ac.ID,
				Slug:             ac.Slug,
				RegionID:         "astana",
				RegionRu:         "г. Астана",
				RegionKk:         "Астана қаласы",
				DistrictRu:       ac.DistrictRu,
				DistrictKk:       ac.DistrictKz,
				NameRu:           ac.NameRu,
				NameKk:           ac.NameKz,
				AddressRu:        ac.AddressRu,
				AddressKk:        ac.AddressKz,
				Director:         ac.Director,
				Phone:            ac.ContactPhone,
				Website:          ac.OfficialWebsite,
				IsState:          ac.IsState,
				OwnershipRu:      ac.OwnershipRu,
				OwnershipKk:      ac.OwnershipKz,
				SpecializationRu: ac.SpecializationRu,
				SpecializationKk: ac.SpecializationKz,
				DormitoryInfoRu:  ac.DormitoryInfoRu,
				DormitoryInfoKk:  ac.DormitoryInfoKz,
				SourceURL:        "https://www.gov.kz/article/707?lang=ru",
			}
			return c.JSON(fiber.Map{
				"college": synthetic,
			})
		}
	}

	return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "College not found"})
}

// GetUnivisionGops serves all 131 Bachelor GOPs (B001-B271) with grant counts & 2025 passing scores.
func (h *Handler) GetUnivisionGops(c *fiber.Ctx) error {
	initCompassData()

	pair := strings.TrimSpace(strings.ToLower(c.Query("pair")))
	sortBy := strings.TrimSpace(strings.ToLower(c.Query("sort", "code")))
	search := strings.TrimSpace(strings.ToLower(c.Query("search", c.Query("q"))))
	if len(search) > 200 {
		search = search[:200]
	}

	// Collect unique UNT subject pairs
	pairSet := make(map[string]bool)
	pairs := make([]string, 0, 20)
	for _, g := range allGops {
		if g.PairRu != "" && !pairSet[g.PairRu] {
			pairSet[g.PairRu] = true
			pairs = append(pairs, g.PairRu)
		}
	}
	sort.Strings(pairs)

	summaries := make([]GOPSummary, 0, len(allGops))
	for _, g := range allGops {
		if pair != "" && !strings.Contains(strings.ToLower(g.PairRu), pair) && !strings.Contains(strings.ToLower(g.PairKk), pair) {
			continue
		}
		if search != "" {
			if !strings.Contains(strings.ToLower(g.Code), search) &&
				!strings.Contains(strings.ToLower(g.TitleRu), search) &&
				!strings.Contains(strings.ToLower(g.TitleKk), search) &&
				!strings.Contains(strings.ToLower(g.PairRu), search) &&
				!strings.Contains(strings.ToLower(g.AreaRu), search) {
				continue
			}
		}
		summaries = append(summaries, GOPSummary{
			Code:              g.Code,
			Slug:              g.Slug,
			TitleRu:           g.TitleRu,
			TitleKk:           g.TitleKk,
			PairRu:            g.PairRu,
			PairKk:            g.PairKk,
			AreaRu:            g.AreaRu,
			AreaKk:            g.AreaKk,
			ProgramsCount:     g.ProgramsCount,
			UniversitiesCount: g.UniversitiesCount,
			Grants:            g.Grants,
			Passing2025:       g.Passing2025,
		})
	}

	switch sortBy {
	case "grants":
		sort.SliceStable(summaries, func(i, j int) bool {
			gi, gj := 0, 0
			if summaries[i].Grants.Full2025 != nil {
				gi = *summaries[i].Grants.Full2025
			}
			if summaries[j].Grants.Full2025 != nil {
				gj = *summaries[j].Grants.Full2025
			}
			return gi > gj
		})
	case "score":
		sort.SliceStable(summaries, func(i, j int) bool {
			si, sj := 999, 999
			if summaries[i].Passing2025.GeneralMin != nil {
				si = *summaries[i].Passing2025.GeneralMin
			}
			if summaries[j].Passing2025.GeneralMin != nil {
				sj = *summaries[j].Passing2025.GeneralMin
			}
			return si < sj
		})
	}

	return c.JSON(fiber.Map{
		"total": len(summaries),
		"pairs": pairs,
		"gops":  summaries,
	})
}

// GetUnivisionGopByCode returns full details for a single GOP by code (e.g. B057) or slug.
func (h *Handler) GetUnivisionGopByCode(c *fiber.Ctx) error {
	initCompassData()
	param := strings.TrimSpace(strings.ToLower(c.Params("code")))

	for _, g := range allGops {
		if strings.ToLower(g.Code) == param || strings.ToLower(g.Slug) == param {
			return c.JSON(g)
		}
	}
	return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "GOP not found"})
}

type GopCalcMatch struct {
	Code              string            `json:"code"`
	Slug              string            `json:"slug"`
	TitleRu           string            `json:"title_ru"`
	TitleKk           string            `json:"title_kk"`
	PairRu            string            `json:"pair_ru"`
	PairKk            string            `json:"pair_kk"`
	GrantsFull2025    *int              `json:"grants_full_2025"`
	GeneralMin        *int              `json:"general_min"`
	RuralMin          *int              `json:"rural_min"`
	Chance            string            `json:"chance"`
	EligibleUnisCount int               `json:"eligible_unis_count"`
	TotalUnisCount    int               `json:"total_unis_count"`
	TopEligibleUnis   []GopUniPassing   `json:"top_eligible_unis"`
}

// GetGopCalculatorMatches checks student UNT score against GOP passing scores & university thresholds.
func (h *Handler) GetGopCalculatorMatches(c *fiber.Ctx) error {
	initCompassData()

	scoreStr := strings.TrimSpace(c.Query("score", "105"))
	score, err := strconv.Atoi(scoreStr)
	if err != nil || score < 50 || score > 140 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Score must be between 50 and 140"})
	}

	// Normalize StudentHub pair format "Математика + Информатика" vs Univision "Математика и Информатика"
	pairQ := strings.ToLower(strings.TrimSpace(c.Query("pair")))
	pairNormalized := strings.ReplaceAll(pairQ, " + ", " и ")

	matches := make([]GopCalcMatch, 0)
	for _, g := range allGops {
		pLow := strings.ToLower(g.PairRu)
		if pairQ != "" {
			if !strings.Contains(pLow, pairNormalized) && !strings.Contains(pLow, pairQ) {
				// Also check individual subject words if order differs (e.g. "Химия + Биология" vs "Биология и Химия")
				tokens := strings.Fields(strings.ReplaceAll(pairNormalized, "+", " "))
				matchedTokens := 0
				totalMeaningful := 0
				for _, tok := range tokens {
					if tok != "и" && len([]rune(tok)) > 2 {
						totalMeaningful++
						if strings.Contains(pLow, tok) {
							matchedTokens++
						}
					}
				}
				if totalMeaningful == 0 || matchedTokens < totalMeaningful {
					continue
				}
			}
		}

		chance := "reach"
		genMin := g.Passing2025.GeneralMin
		if genMin != nil {
			if score >= *genMin+15 {
				chance = "high"
			} else if score >= *genMin {
				chance = "medium"
			} else if score >= *genMin-8 {
				chance = "low"
			}
		} else {
			chance = "medium"
		}

		eligibleUnis := make([]GopUniPassing, 0)
		for _, up := range g.UniPassing2025 {
			if up.MinScore != nil && score >= *up.MinScore {
				eligibleUnis = append(eligibleUnis, up)
			}
		}
		if len(eligibleUnis) > 6 {
			eligibleUnis = eligibleUnis[:6]
		}

		matches = append(matches, GopCalcMatch{
			Code:              g.Code,
			Slug:              g.Slug,
			TitleRu:           g.TitleRu,
			TitleKk:           g.TitleKk,
			PairRu:            g.PairRu,
			PairKk:            g.PairKk,
			GrantsFull2025:    g.Grants.Full2025,
			GeneralMin:        g.Passing2025.GeneralMin,
			RuralMin:          g.Passing2025.RuralMin,
			Chance:            chance,
			EligibleUnisCount: len(eligibleUnis),
			TotalUnisCount:    g.UniversitiesCount,
			TopEligibleUnis:   eligibleUnis,
		})
	}

	chanceOrder := map[string]int{"high": 0, "medium": 1, "low": 2, "reach": 3}
	sort.SliceStable(matches, func(i, j int) bool {
		return chanceOrder[matches[i].Chance] < chanceOrder[matches[j].Chance]
	})

	return c.JSON(fiber.Map{
		"score":   score,
		"total":   len(matches),
		"matches": matches,
	})
}

// GetProfessions serves the 589 Bachelor Professions catalog (RU + KK) from Univision.
func (h *Handler) GetProfessions(c *fiber.Ctx) error {
	initCompassData()

	category := strings.TrimSpace(strings.ToLower(c.Query("category")))
	search := strings.TrimSpace(strings.ToLower(c.Query("search", c.Query("q"))))
	if len(search) > 200 {
		search = search[:200]
	}

	catOrder := make([]string, 0, 15)
	catStats := make(map[string]*RegionStat, 15)
	for _, p := range allProfs {
		st, ok := catStats[p.CategoryRu]
		if !ok {
			st = &RegionStat{ID: p.CategoryRu, NameRu: p.CategoryRu, NameKk: p.CategoryKk}
			catStats[p.CategoryRu] = st
			catOrder = append(catOrder, p.CategoryRu)
		}
		st.Count++
	}
	categories := make([]RegionStat, 0, len(catOrder))
	for _, id := range catOrder {
		categories = append(categories, *catStats[id])
	}

	filtered := make([]Profession, 0)
	for _, p := range allProfs {
		if category != "" && category != "all" {
			if strings.ToLower(p.CategoryRu) != category && !strings.Contains(strings.ToLower(p.CategoryRu), category) {
				continue
			}
		}
		if search != "" {
			inProgs := false
			for _, rp := range p.RelatedPrograms {
				if strings.Contains(strings.ToLower(rp.Program), search) || strings.Contains(strings.ToLower(rp.University), search) {
					inProgs = true
					break
				}
			}
			if !inProgs &&
				!strings.Contains(strings.ToLower(p.TitleRu), search) &&
				!strings.Contains(strings.ToLower(p.TitleKk), search) &&
				!strings.Contains(strings.ToLower(p.CategoryRu), search) {
				continue
			}
		}
		filtered = append(filtered, p)
	}

	limit, offset := paginateParams(c, 60, 200)
	return c.JSON(fiber.Map{
		"total":       len(filtered),
		"categories":  categories,
		"professions": slicePage(filtered, offset, limit),
	})
}

// GetKnowledgeBase returns StudentHub 24 KB articles + Univision 2025 grant breakdown.
func (h *Handler) GetKnowledgeBase(c *fiber.Ctx) error {
	initCompassData()

	category := strings.TrimSpace(strings.ToLower(c.Query("category")))
	search := strings.TrimSpace(strings.ToLower(c.Query("search", c.Query("q"))))
	if len(search) > 200 {
		search = search[:200]
	}

	filtered := make([]KBArticle, 0, len(kbBundle.Articles))
	for _, art := range kbBundle.Articles {
		if category != "" && category != "all" && strings.ToLower(art.Category) != category {
			continue
		}
		if search != "" {
			if !strings.Contains(strings.ToLower(art.TitleRu), search) &&
				!strings.Contains(strings.ToLower(art.TitleKk), search) &&
				!strings.Contains(strings.ToLower(art.SummaryRu), search) &&
				!strings.Contains(strings.ToLower(art.SummaryKk), search) {
				continue
			}
		}
		// Return summary cards without full nested body for fast index response
		filtered = append(filtered, KBArticle{
			Slug:         art.Slug,
			Category:     art.Category,
			TitleRu:      art.TitleRu,
			TitleKk:      art.TitleKk,
			SummaryRu:    art.SummaryRu,
			SummaryKk:    art.SummaryKk,
			SourceName:   art.SourceName,
			SourceURL:    art.SourceURL,
			AcademicYear: art.AcademicYear,
		})
	}

	return c.JSON(fiber.Map{
		"total":         len(filtered),
		"grant_summary": kbBundle.GrantSummary,
		"articles":      filtered,
	})
}

// GetKnowledgeBaseBySlug returns one full Knowledge Base guide with all sections.
func (h *Handler) GetKnowledgeBaseBySlug(c *fiber.Ctx) error {
	initCompassData()
	slug := strings.TrimSpace(strings.ToLower(c.Params("slug")))

	for _, art := range kbBundle.Articles {
		if strings.ToLower(art.Slug) == slug {
			return c.JSON(art)
		}
	}
	return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Guide not found"})
}

// SearchCompass adds matching GOPs, Universities, Colleges, Professions & Guides to global Search results.
func SearchCompass(query, typeFilter string) []models.SearchResultItem {
	initCompassData()
	q := strings.ToLower(strings.TrimSpace(query))
	if q == "" {
		return nil
	}

	var out []models.SearchResultItem
	add := func(item models.SearchResultItem) {
		if len(out) < 35 {
			out = append(out, item)
		}
	}

	// 1. GOPs
	if typeFilter == "" || typeFilter == "program" || typeFilter == "programs" {
		for _, g := range allGops {
			if strings.Contains(strings.ToLower(g.Code), q) ||
				strings.Contains(strings.ToLower(g.TitleRu), q) ||
				strings.Contains(strings.ToLower(g.TitleKk), q) ||
				strings.Contains(strings.ToLower(g.PairRu), q) {
				add(models.SearchResultItem{
					Type:       "program",
					ID:         g.Code,
					Slug:       g.Slug,
					TitleKz:    g.Code + " " + g.TitleKk,
					TitleRu:    g.Code + " " + g.TitleRu,
					SubtitleKz: g.PairKk,
					SubtitleRu: g.PairRu,
					Badge:      "ГОП • " + g.Code,
					URL:        "/programs?gop=" + g.Code,
				})
			}
		}
	}

	// 2. All Kazakhstan Universities
	if typeFilter == "" || typeFilter == "institution" || typeFilter == "institutions" {
		for _, u := range allUnis {
			if strings.Contains(strings.ToLower(u.NameRu), q) ||
				strings.Contains(strings.ToLower(u.NameKk), q) ||
				(u.EntCode != "" && strings.Contains(strings.ToLower(u.EntCode), q)) ||
				strings.Contains(strings.ToLower(u.City), q) {
				badge := "ЖОО / ВУЗ"
				if u.EntCode != "" {
					badge = "Код " + u.EntCode
				}
				add(models.SearchResultItem{
					Type:       "institution",
					ID:         u.ID,
					Slug:       u.Slug,
					TitleKz:    u.NameKk,
					TitleRu:    u.NameRu,
					SubtitleKz: u.RegionKk,
					SubtitleRu: u.RegionRu,
					Badge:      badge,
					URL:        "/universities?q=" + u.EntCode,
				})
			}
		}

		// 3. All Kazakhstan Colleges (outside Astana + Astana)
		for _, col := range allColleges {
			if col.RegionID == "astana" {
				continue // already indexed in repo
			}
			if strings.Contains(strings.ToLower(col.NameRu), q) ||
				strings.Contains(strings.ToLower(col.NameKk), q) ||
				strings.Contains(strings.ToLower(col.RegionRu), q) {
				add(models.SearchResultItem{
					Type:       "institution",
					ID:         col.ID,
					Slug:       col.Slug,
					TitleKz:    col.NameKk,
					TitleRu:    col.NameRu,
					SubtitleKz: "Колледж • " + col.RegionKk,
					SubtitleRu: "Колледж • " + col.RegionRu,
					Badge:      "Колледж",
					URL:        "/colleges?region=" + col.RegionID,
				})
			}
		}
	}

	// 4. Knowledge Base Guides
	if typeFilter == "" || typeFilter == "guide" || typeFilter == "grants" {
		for _, art := range kbBundle.Articles {
			if strings.Contains(strings.ToLower(art.TitleRu), q) ||
				strings.Contains(strings.ToLower(art.TitleKk), q) ||
				strings.Contains(strings.ToLower(art.SummaryRu), q) {
				add(models.SearchResultItem{
					Type:       "grant",
					ID:         art.Slug,
					Slug:       art.Slug,
					TitleKz:    art.TitleKk,
					TitleRu:    art.TitleRu,
					SubtitleKz: "Нұсқаулық • StudentHub",
					SubtitleRu: "Руководство • База знаний",
					Badge:      "Гайд",
					URL:        "/guides/" + art.Slug,
				})
			}
		}
	}

	// 5. Professions
	if typeFilter == "" || typeFilter == "career" || typeFilter == "careers" {
		for _, p := range allProfs {
			if strings.Contains(strings.ToLower(p.TitleRu), q) ||
				strings.Contains(strings.ToLower(p.TitleKk), q) {
				add(models.SearchResultItem{
					Type:       "career",
					ID:         "prof-" + p.ID,
					Slug:       p.Slug,
					TitleKz:    p.TitleKk,
					TitleRu:    p.TitleRu,
					SubtitleKz: p.CategoryKk,
					SubtitleRu: p.CategoryRu,
					Badge:      "Мамандық",
					URL:        "/careers",
				})
			}
		}
	}

	return out
}
