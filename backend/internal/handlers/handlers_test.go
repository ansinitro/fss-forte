package handlers_test

import (
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"astana-platform/internal/config"
	"astana-platform/internal/database"
	"astana-platform/internal/handlers"
	"astana-platform/internal/middleware"
	"astana-platform/internal/models"
	"astana-platform/internal/repository"
)

func setupTestApp() (*fiber.App, *config.Config) {
	cfg := &config.Config{
		Port:         "8080",
		JWTSecret:    "test-secret-key",
		AcademicYear: "2026-2027",
	}
	db := &database.DB{IsMock: true}
	repo := repository.NewRepository(db)
	h := handlers.NewHandler(repo, cfg)

	app := fiber.New()
	v1 := app.Group("/api/v1")
	v1.Get("/health", h.Health)
	v1.Get("/search", h.Search)
	v1.Get("/institutions", h.GetInstitutions)
	v1.Get("/grants", h.GetGrants)
	v1.Get("/opportunities", h.GetOpportunities)
	v1.Post("/auth/login", h.Login)

	studenthub := v1.Group("/studenthub")
	studenthub.Get("/programs", h.GetStudentHubPrograms)
	studenthub.Get("/programs/:slug", h.GetStudentHubProgramBySlug)
	studenthub.Get("/universities", h.GetStudentHubUniversities)
	studenthub.Get("/universities/:slug", h.GetStudentHubUniversityBySlug)
	studenthub.Get("/ent-results", h.GetStudentHubEntResults)
	studenthub.Get("/calculator", h.GetStudentHubCalculator)

	v1.Get("/kz-colleges", h.GetAllColleges)
	v1.Get("/kz-colleges/:slug", h.GetAllCollegeBySlug)
	v1.Get("/kz-universities", h.GetAllUniversities)
	v1.Get("/kz-universities/:slug", h.GetAllUniversityBySlug)
	v1.Get("/gops", h.GetUnivisionGops)
	v1.Get("/gops/calculator", h.GetGopCalculatorMatches)
	v1.Get("/gops/:code", h.GetUnivisionGopByCode)
	v1.Get("/professions", h.GetProfessions)
	v1.Get("/knowledge-base", h.GetKnowledgeBase)
	v1.Get("/knowledge-base/:slug", h.GetKnowledgeBaseBySlug)

	admin := v1.Group("/admin")
	admin.Use(middleware.AuthMiddleware(cfg, models.RoleAdmin, models.RoleEditor, models.RoleReviewer))
	admin.Get("/stats", h.GetAdminStats)

	return app, cfg
}

func TestHealthEndpoint(t *testing.T) {
	app, _ := setupTestApp()
	req := httptest.NewRequest("GET", "/api/v1/health", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Failed to test health endpoint: %v", err)
	}

	if resp.StatusCode != fiber.StatusOK {
		t.Errorf("Expected status 200, got %d", resp.StatusCode)
	}
}

func TestSearchEndpoint(t *testing.T) {
	app, _ := setupTestApp()
	req := httptest.NewRequest("GET", "/api/v1/search?q=IT", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Failed to test search: %v", err)
	}

	if resp.StatusCode != fiber.StatusOK {
		t.Errorf("Expected status 200, got %d", resp.StatusCode)
	}

	var searchResp models.SearchResponse
	if err := json.NewDecoder(resp.Body).Decode(&searchResp); err != nil {
		t.Fatalf("Failed to decode search response: %v", err)
	}

	if searchResp.Total == 0 {
		t.Errorf("Expected search results for 'IT', got 0")
	}
}

func TestInstitutionsList(t *testing.T) {
	app, _ := setupTestApp()
	req := httptest.NewRequest("GET", "/api/v1/institutions", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Failed to test institutions: %v", err)
	}

	if resp.StatusCode != fiber.StatusOK {
		t.Errorf("Expected status 200, got %d", resp.StatusCode)
	}

	var insts []models.Institution
	if err := json.NewDecoder(resp.Body).Decode(&insts); err != nil {
		t.Fatalf("Failed to decode institutions: %v", err)
	}

	if len(insts) == 0 {
		t.Errorf("Expected verified institutions, got 0")
	}
}

func TestAuthAndAdminStats(t *testing.T) {
	app, _ := setupTestApp()

	// 1. Attempt admin stats without token (must fail 401)
	unauthReq := httptest.NewRequest("GET", "/api/v1/admin/stats", nil)
	unauthResp, err := app.Test(unauthReq)
	if err != nil {
		t.Fatalf("Failed unauth test: %v", err)
	}
	if unauthResp.StatusCode != fiber.StatusUnauthorized {
		t.Errorf("Expected status 401 for unauthorized admin request, got %d", unauthResp.StatusCode)
	}

	// 2. Perform Login with admin@forte.kz
	loginBody, _ := json.Marshal(map[string]string{
		"email":    "admin@forte.kz",
		"password": "FrtCmps@2026#Secure",
	})
	loginReq := httptest.NewRequest("POST", "/api/v1/auth/login", bytes.NewReader(loginBody))
	loginReq.Header.Set("Content-Type", "application/json")

	loginResp, err := app.Test(loginReq, 5000)
	if err != nil {
		t.Fatalf("Failed login test: %v", err)
	}
	if loginResp.StatusCode != fiber.StatusOK {
		t.Errorf("Expected status 200 for login, got %d", loginResp.StatusCode)
	}

	// Verify legacy admin@tandau-astana.kz is rejected
	legacyBody, _ := json.Marshal(map[string]string{
		"email":    "admin@tandau-astana.kz",
		"password": "AdminAstana2026!",
	})
	legacyReq := httptest.NewRequest("POST", "/api/v1/auth/login", bytes.NewReader(legacyBody))
	legacyReq.Header.Set("Content-Type", "application/json")
	legacyResp, err := app.Test(legacyReq, 5000)
	if err != nil {
		t.Fatalf("Failed legacy login test: %v", err)
	}
	if legacyResp.StatusCode != fiber.StatusUnauthorized {
		t.Errorf("Expected status 401 for legacy login, got %d", legacyResp.StatusCode)
	}

	var loginData struct {
		Token string      `json:"token"`
		User  models.User `json:"user"`
	}
	if err := json.NewDecoder(loginResp.Body).Decode(&loginData); err != nil {
		t.Fatalf("Failed to decode login response: %v", err)
	}

	if loginData.Token == "" {
		t.Fatal("Expected JWT token, got empty string")
	}

	// 3. Admin stats with token (must succeed 200)
	authReq := httptest.NewRequest("GET", "/api/v1/admin/stats", nil)
	authReq.Header.Set("Authorization", "Bearer "+loginData.Token)
	authResp, err := app.Test(authReq)
	if err != nil {
		t.Fatalf("Failed auth request test: %v", err)
	}
	if authResp.StatusCode != fiber.StatusOK {
		t.Errorf("Expected status 200 for authorized request, got %d", authResp.StatusCode)
	}
}

func TestStudentHubEndpoints(t *testing.T) {
	app, _ := setupTestApp()

	// 1. Programs list
	req := httptest.NewRequest("GET", "/api/v1/studenthub/programs?pair=Информатика", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Failed test studenthub programs: %v", err)
	}
	if resp.StatusCode != fiber.StatusOK {
		t.Errorf("Expected status 200, got %d", resp.StatusCode)
	}

	var progsData struct {
		Total    int                         `json:"total"`
		Programs []handlers.StudentHubProgram `json:"programs"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&progsData); err != nil {
		t.Fatalf("Failed to decode programs response: %v", err)
	}
	if progsData.Total == 0 {
		t.Errorf("Expected programs for 'Информатика', got 0")
	}

	// 2. Universities list
	reqUni := httptest.NewRequest("GET", "/api/v1/studenthub/universities?city=Астана", nil)
	respUni, err := app.Test(reqUni)
	if err != nil {
		t.Fatalf("Failed test studenthub universities: %v", err)
	}
	if respUni.StatusCode != fiber.StatusOK {
		t.Errorf("Expected status 200, got %d", respUni.StatusCode)
	}

	// 3. Calculator with score 115
	reqCalc := httptest.NewRequest("GET", "/api/v1/studenthub/calculator?score=115&pair=Математика+%2B+Информатика", nil)
	respCalc, err := app.Test(reqCalc)
	if err != nil {
		t.Fatalf("Failed test studenthub calculator: %v", err)
	}
	if respCalc.StatusCode != fiber.StatusOK {
		t.Errorf("Expected status 200 for calculator, got %d", respCalc.StatusCode)
	}

	var calcData struct {
		Score   int                        `json:"score"`
		Total   int                        `json:"total"`
		Matches []handlers.CalculatorMatch `json:"matches"`
	}
	if err := json.NewDecoder(respCalc.Body).Decode(&calcData); err != nil {
		t.Fatalf("Failed to decode calc response: %v", err)
	}
	if calcData.Total == 0 {
		t.Errorf("Expected calculator matches for score 115, got 0")
	}
}


func TestCompass4SourcesEndpoints(t *testing.T) {
	app, _ := setupTestApp()

	routes := []string{
		"/api/v1/kz-colleges?region=almaty",
		"/api/v1/kz-colleges/eagi-college",
		"/api/v1/kz-universities?search=013",
		"/api/v1/kz-universities/kostanayskiy_inzhenerno_ekonomicheskiy_universitet_im_m_dulatova",
		"/api/v1/gops?search=B057",
		"/api/v1/gops/B057",
		"/api/v1/gops/calculator?score=115&pair=Математика+%2B+Информатика",
		"/api/v1/professions?search=IT",
		"/api/v1/knowledge-base",
		"/api/v1/search?q=B057",
	}

	for _, r := range routes {
		req := httptest.NewRequest("GET", r, nil)
		resp, err := app.Test(req)
		if err != nil {
			t.Fatalf("Route %s failed: %v", r, err)
		}
		if resp.StatusCode != fiber.StatusOK {
			t.Errorf("Route %s expected HTTP 200, got %d", r, resp.StatusCode)
		}
	}
}
