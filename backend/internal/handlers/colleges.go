package handlers

import (
	_ "embed"
	"encoding/json"
	"log"
	"strings"
	"sync"

	"github.com/gofiber/fiber/v2"
)

//go:embed data/astana_colleges.json
var astanaCollegesJSON []byte

type AstanaCollege struct {
	ID               string `json:"id"`
	Slug             string `json:"slug"`
	Num              int    `json:"num"`
	NameRu           string `json:"name_ru"`
	NameKz           string `json:"name_kz"`
	FullnameRu       string `json:"fullname_ru"`
	FullnameKz       string `json:"fullname_kz"`
	DistrictKz       string `json:"district_kz"`
	DistrictRu       string `json:"district_ru"`
	AddressRu        string `json:"address_ru"`
	AddressKz        string `json:"address_kz"`
	ContactPhone     string `json:"contact_phone"`
	Director         string `json:"director"`
	IsState          bool   `json:"is_state"`
	OwnershipKz      string `json:"ownership_kz"`
	OwnershipRu      string `json:"ownership_ru"`
	SpecializationKz string `json:"specialization_kz"`
	SpecializationRu string `json:"specialization_ru"`
	InstitutionType  string `json:"institution_type"`
	OfficialWebsite  string `json:"official_website"`
	HasDormitory     bool   `json:"has_dormitory"`
	DormitoryInfoKz  string `json:"dormitory_info_kz"`
	DormitoryInfoRu  string `json:"dormitory_info_ru"`
	AdmissionKz      string `json:"admission_kz"`
	AdmissionRu      string `json:"admission_ru"`
	SourceURL        string `json:"source_url"`
	Status           string `json:"status"`
}

var (
	astanaColleges     []AstanaCollege
	astanaCollegesOnce sync.Once
)

func initAstanaColleges() {
	astanaCollegesOnce.Do(func() {
		if err := json.Unmarshal(astanaCollegesJSON, &astanaColleges); err != nil {
			log.Printf("⚠️ Failed to unmarshal astana_colleges.json: %v", err)
		}
	})
}

// GetColleges returns the 32 verified colleges of Astana from Gov.kz 707
func (h *Handler) GetColleges(c *fiber.Ctx) error {
	initAstanaColleges()

	district := strings.TrimSpace(strings.ToLower(c.Query("district")))
	specialization := strings.TrimSpace(strings.ToLower(c.Query("specialization")))
	ownership := strings.TrimSpace(strings.ToLower(c.Query("ownership"))) // "state", "private"
	search := strings.TrimSpace(strings.ToLower(c.Query("search", c.Query("q"))))

	var result []AstanaCollege
	for _, col := range astanaColleges {
		if district != "" {
			dKz := strings.ToLower(col.DistrictKz)
			dRu := strings.ToLower(col.DistrictRu)
			if !strings.Contains(dKz, district) && !strings.Contains(dRu, district) {
				continue
			}
		}

		if specialization != "" {
			sKz := strings.ToLower(col.SpecializationKz)
			sRu := strings.ToLower(col.SpecializationRu)
			if !strings.Contains(sKz, specialization) && !strings.Contains(sRu, specialization) {
				continue
			}
		}

		if ownership == "state" && !col.IsState {
			continue
		}
		if ownership == "private" && col.IsState {
			continue
		}

		if search != "" {
			nameRu := strings.ToLower(col.NameRu)
			nameKz := strings.ToLower(col.NameKz)
			fullname := strings.ToLower(col.FullnameRu)
			addr := strings.ToLower(col.AddressRu)
			director := strings.ToLower(col.Director)
			spec := strings.ToLower(col.SpecializationRu)

			if !strings.Contains(nameRu, search) &&
				!strings.Contains(nameKz, search) &&
				!strings.Contains(fullname, search) &&
				!strings.Contains(addr, search) &&
				!strings.Contains(director, search) &&
				!strings.Contains(spec, search) {
				continue
			}
		}

		result = append(result, col)
	}

	return c.JSON(result)
}

// GetCollegeBySlug returns a single college by its slug
func (h *Handler) GetCollegeBySlug(c *fiber.Ctx) error {
	initAstanaColleges()

	slug := strings.TrimSpace(strings.ToLower(c.Params("slug")))
	for _, col := range astanaColleges {
		if strings.ToLower(col.Slug) == slug {
			return c.JSON(col)
		}
	}

	return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
		"error": "College not found",
	})
}
