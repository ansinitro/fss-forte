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
)

//go:embed data/programs.json
var studentHubProgramsJSON []byte

//go:embed data/universities.json
var studentHubUniversitiesJSON []byte

//go:embed data/ent_results.json
var studentHubEntResultsJSON []byte

type StudentHubProgramUni struct {
	UniHref string `json:"uni_href"`
	UniSlug string `json:"uni_slug"`
	UniName string `json:"uni_name"`
	City    string `json:"city"`
	Score   *int   `json:"score"`
	Price   string `json:"price"`
}

type StudentHubProgram struct {
	Slug              string                 `json:"slug"`
	URL               string                 `json:"url"`
	Title             string                 `json:"title"`
	Pair              string                 `json:"pair"`
	AvgScore          *int                   `json:"avg_score"`
	AvgPrice          string                 `json:"avg_price"`
	Description       string                 `json:"description"`
	UniversitiesCount int                    `json:"universities_count"`
	Universities      []StudentHubProgramUni `json:"universities"`
}

type StudentHubUniProgram struct {
	Name  string  `json:"name"`
	Score *int    `json:"score"`
	Pair  string  `json:"pair"`
	Price *string `json:"price"`
}

type StudentHubUniversity struct {
	Slug          string                 `json:"slug"`
	URL           string                 `json:"url"`
	Name          string                 `json:"name"`
	City          string                 `json:"city"`
	Phone         string                 `json:"phone"`
	ProgramsCount int                    `json:"programs_count"`
	Programs      []StudentHubUniProgram `json:"programs"`
}

type StudentHubEntYear struct {
	Competition string `json:"competition"`
	MinScore    *int   `json:"min_score"`
	AvgScore    *int   `json:"avg_score"`
	MaxScore    *int   `json:"max_score"`
	TotalGrants *int   `json:"total_grants"`
}

type StudentHubEntResult struct {
	Slug    string              `json:"slug"`
	URL     string              `json:"url"`
	Title   string              `json:"title"`
	History []StudentHubEntYear `json:"history"`
}

var (
	hubOnce         sync.Once
	hubPrograms     []StudentHubProgram
	hubUniversities []StudentHubUniversity
	hubEntResults   []StudentHubEntResult
	hubEntMap       map[string]StudentHubEntResult
)

func initStudentHubData() {
	hubOnce.Do(func() {
		if err := json.Unmarshal(studentHubProgramsJSON, &hubPrograms); err != nil {
			log.Printf("[StudentHub] Error loading programs: %v", err)
		}
		if err := json.Unmarshal(studentHubUniversitiesJSON, &hubUniversities); err != nil {
			log.Printf("[StudentHub] Error loading universities: %v", err)
		}
		if err := json.Unmarshal(studentHubEntResultsJSON, &hubEntResults); err != nil {
			log.Printf("[StudentHub] Error loading ent results: %v", err)
		}

		hubEntMap = make(map[string]StudentHubEntResult, len(hubEntResults))
		for _, er := range hubEntResults {
			hubEntMap[er.Slug] = er
		}
		log.Printf("[StudentHub] Data loaded: %d programs, %d universities, %d ent results",
			len(hubPrograms), len(hubUniversities), len(hubEntResults))
	})
}

// GetStudentHubPrograms returns programs with filters for search, pair, city, and min_score
func (h *Handler) GetStudentHubPrograms(c *fiber.Ctx) error {
	initStudentHubData()

	query := strings.TrimSpace(strings.ToLower(c.Query("search")))
	pair := strings.TrimSpace(strings.ToLower(c.Query("pair")))
	city := strings.TrimSpace(strings.ToLower(c.Query("city")))
	maxCutoffStr := strings.TrimSpace(c.Query("max_score"))
	maxCutoff, _ := strconv.Atoi(maxCutoffStr)

	var results []StudentHubProgram
	for _, prog := range hubPrograms {
		if query != "" {
			nameMatch := strings.Contains(strings.ToLower(prog.Title), query)
			descMatch := strings.Contains(strings.ToLower(prog.Description), query)
			pairMatch := strings.Contains(strings.ToLower(prog.Pair), query)
			uniMatch := false
			for _, u := range prog.Universities {
				if strings.Contains(strings.ToLower(u.UniName), query) {
					uniMatch = true
					break
				}
			}
			if !nameMatch && !descMatch && !pairMatch && !uniMatch {
				continue
			}
		}

		if pair != "" {
			if !strings.Contains(strings.ToLower(prog.Pair), pair) {
				continue
			}
		}

		if city != "" {
			cityMatch := false
			for _, u := range prog.Universities {
				if strings.Contains(strings.ToLower(u.City), city) {
					cityMatch = true
					break
				}
			}
			if !cityMatch {
				continue
			}
		}

		if maxCutoff > 0 && prog.AvgScore != nil {
			if *prog.AvgScore > maxCutoff {
				continue
			}
		}

		results = append(results, prog)
	}

	return c.JSON(fiber.Map{
		"total":    len(results),
		"programs": results,
	})
}

// GetStudentHubProgramBySlug returns single program and links historical ENT results if available
func (h *Handler) GetStudentHubProgramBySlug(c *fiber.Ctx) error {
	initStudentHubData()
	slug := strings.TrimSpace(c.Params("slug"))

	for _, prog := range hubPrograms {
		if prog.Slug == slug {
			ent, hasEnt := hubEntMap[slug]
			var entHistory []StudentHubEntYear
			if hasEnt {
				entHistory = ent.History
			}

			return c.JSON(fiber.Map{
				"program":     prog,
				"ent_history": entHistory,
			})
		}
	}

	return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
		"error": "Program not found",
	})
}

// GetStudentHubUniversities returns universities with optional city and search filters
func (h *Handler) GetStudentHubUniversities(c *fiber.Ctx) error {
	initStudentHubData()

	query := strings.TrimSpace(strings.ToLower(c.Query("search")))
	city := strings.TrimSpace(strings.ToLower(c.Query("city")))

	var results []StudentHubUniversity
	for _, u := range hubUniversities {
		if query != "" {
			if !strings.Contains(strings.ToLower(u.Name), query) && !strings.Contains(strings.ToLower(u.City), query) {
				continue
			}
		}
		if city != "" {
			if !strings.Contains(strings.ToLower(u.City), city) {
				continue
			}
		}
		results = append(results, u)
	}

	return c.JSON(fiber.Map{
		"total":        len(results),
		"universities": results,
	})
}

// GetStudentHubUniversityBySlug returns a single university with its full program catalog
func (h *Handler) GetStudentHubUniversityBySlug(c *fiber.Ctx) error {
	initStudentHubData()
	slug := strings.TrimSpace(c.Params("slug"))

	for _, u := range hubUniversities {
		if u.Slug == slug {
			return c.JSON(u)
		}
	}

	return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
		"error": "University not found",
	})
}

// GetStudentHubEntResults returns all official ENT cutoffs with search
func (h *Handler) GetStudentHubEntResults(c *fiber.Ctx) error {
	initStudentHubData()
	query := strings.TrimSpace(strings.ToLower(c.Query("search")))

	if query == "" {
		return c.JSON(fiber.Map{
			"total":   len(hubEntResults),
			"results": hubEntResults,
		})
	}

	var filtered []StudentHubEntResult
	for _, r := range hubEntResults {
		if strings.Contains(strings.ToLower(r.Title), query) || strings.Contains(strings.ToLower(r.Slug), query) {
			filtered = append(filtered, r)
		}
	}

	return c.JSON(fiber.Map{
		"total":   len(filtered),
		"results": filtered,
	})
}

type CalculatorMatch struct {
	Program            StudentHubProgram      `json:"program"`
	Chance             string                 `json:"chance"` // "high", "medium", "low", "reach"
	ChanceLabelKZ      string                 `json:"chance_label_kz"`
	ChanceLabelRU      string                 `json:"chance_label_ru"`
	MatchingUnis       []StudentHubProgramUni `json:"matching_unis"`
	LatestMinScore     *int                   `json:"latest_min_score"`
	LatestAvgScore     *int                   `json:"latest_avg_score"`
	TotalGrants        *int                   `json:"total_grants"`
}

// GetStudentHubCalculator computes realistic grant chances based on score, subject pair, and city
func (h *Handler) GetStudentHubCalculator(c *fiber.Ctx) error {
	initStudentHubData()

	scoreStr := strings.TrimSpace(c.Query("score"))
	pair := strings.TrimSpace(c.Query("pair"))
	city := strings.TrimSpace(c.Query("city"))

	score, err := strconv.Atoi(scoreStr)
	if err != nil || score < 50 || score > 140 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Please provide a valid UNT score between 50 and 140",
		})
	}

	var matches []CalculatorMatch
	pairLower := strings.ToLower(pair)
	cityLower := strings.ToLower(city)

	for _, prog := range hubPrograms {
		if pair != "" && !strings.Contains(strings.ToLower(prog.Pair), pairLower) {
			continue
		}

		// Filter universities by city if requested
		var matchingUnis []StudentHubProgramUni
		for _, u := range prog.Universities {
			if cityLower != "" && !strings.Contains(strings.ToLower(u.City), cityLower) {
				continue
			}
			matchingUnis = append(matchingUnis, u)
		}

		if cityLower != "" && len(matchingUnis) == 0 {
			continue
		}

		// Check ENT historical stats for threshold
		ent, hasEnt := hubEntMap[prog.Slug]
		var minScore, avgScore, totalGrants *int
		if hasEnt && len(ent.History) > 0 {
			for _, h := range ent.History {
				if h.MinScore != nil {
					minScore = h.MinScore
					avgScore = h.AvgScore
					totalGrants = h.TotalGrants
					break
				}
			}
		}

		// Baseline benchmark score (from ENT stats or program avg_score)
		benchmarkMin := 75
		if minScore != nil {
			benchmarkMin = *minScore
		} else if prog.AvgScore != nil {
			benchmarkMin = *prog.AvgScore - 10
		}

		benchmarkAvg := 90
		if avgScore != nil {
			benchmarkAvg = *avgScore
		} else if prog.AvgScore != nil {
			benchmarkAvg = *prog.AvgScore
		}

		var chance, labelKZ, labelRU string
		if score >= benchmarkAvg {
			chance = "high"
			labelKZ = "Жоғары грант мүмкіндігі (≥ Орташа балл)"
			labelRU = "Высокий шанс на грант (≥ Средний балл)"
		} else if score >= benchmarkMin {
			chance = "medium"
			labelKZ = "Орташа грант мүмкіндігі (Шекті балл шегінде)"
			labelRU = "Средний шанс на грант (В пределах проходного)"
		} else if score >= benchmarkMin-8 {
			chance = "low"
			labelKZ = "Төмен грант мүмкіндігі (Резерв немесе ауыл квотасы)"
			labelRU = "Низкий шанс на грант (Резерв или сельская квота)"
		} else {
			chance = "reach"
			labelKZ = "Ақылы оқу немесе грантқа қосымша дайындық қажет"
			labelRU = "Платное обучение или требуется подготовка"
		}

		matches = append(matches, CalculatorMatch{
			Program:        prog,
			Chance:         chance,
			ChanceLabelKZ:  labelKZ,
			ChanceLabelRU:  labelRU,
			MatchingUnis:   matchingUnis,
			LatestMinScore: minScore,
			LatestAvgScore: avgScore,
			TotalGrants:    totalGrants,
		})
	}

	// Sort matches: high chances first, then medium, then low, then reach
	chanceOrder := map[string]int{"high": 0, "medium": 1, "low": 2, "reach": 3}
	sort.SliceStable(matches, func(i, j int) bool {
		return chanceOrder[matches[i].Chance] < chanceOrder[matches[j].Chance]
	})

	return c.JSON(fiber.Map{
		"score":   score,
		"pair":    pair,
		"city":    city,
		"total":   len(matches),
		"matches": matches,
	})
}
