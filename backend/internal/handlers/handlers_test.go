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

	// 2. Perform Login
	loginBody, _ := json.Marshal(map[string]string{
		"email":    "admin@tandau-astana.kz",
		"password": "AdminAstana2026!",
	})
	loginReq := httptest.NewRequest("POST", "/api/v1/auth/login", bytes.NewReader(loginBody))
	loginReq.Header.Set("Content-Type", "application/json")

	loginResp, err := app.Test(loginReq)
	if err != nil {
		t.Fatalf("Failed login test: %v", err)
	}
	if loginResp.StatusCode != fiber.StatusOK {
		t.Errorf("Expected status 200 for login, got %d", loginResp.StatusCode)
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
