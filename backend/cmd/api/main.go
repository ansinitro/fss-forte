package main

import (
	"log"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"

	"astana-platform/internal/config"
	"astana-platform/internal/database"
	"astana-platform/internal/handlers"
	"astana-platform/internal/middleware"
	"astana-platform/internal/models"
	"astana-platform/internal/repository"
)

func main() {
	cfg := config.LoadConfig()

	// Connect to Database (with automatic fallback to verified in-memory store)
	db, err := database.ConnectDB(cfg)
	if err != nil {
		log.Fatalf("Fatal error initializing database: %v", err)
	}

	repo := repository.NewRepository(db)
	h := handlers.NewHandler(repo, cfg)

	app := fiber.New(fiber.Config{
		AppName:      "Forte Compass Platform API",
		// Do NOT expose server implementation in response headers
		ServerHeader: "",
	})

	// Global Middlewares
	app.Use(recover.New())
	app.Use(logger.New())

	// Security headers middleware
	app.Use(func(c *fiber.Ctx) error {
		c.Set("X-Content-Type-Options", "nosniff")
		c.Set("X-Frame-Options", "DENY")
		c.Set("X-XSS-Protection", "1; mode=block")
		c.Set("Referrer-Policy", "strict-origin-when-cross-origin")
		c.Set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
		return c.Next()
	})

	corsConfig := cors.Config{
		AllowOrigins: cfg.CORSOrigin,
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}
	if cfg.CORSOrigin != "*" {
		corsConfig.AllowCredentials = true
	}
	app.Use(cors.New(corsConfig))

	// API Routes Group
	v1 := app.Group("/api/v1")

	// Public Endpoints
	v1.Get("/health", h.Health)
	v1.Get("/search", h.Search)
	v1.Get("/directions", h.GetDirections)
	v1.Get("/careers", h.GetCareers)
	v1.Get("/careers/:slug", h.GetCareerBySlug)
	v1.Get("/institutions", h.GetInstitutions)
	v1.Get("/institutions/:slug", h.GetInstitutionBySlug)
	v1.Get("/colleges", h.GetColleges)
	v1.Get("/colleges/:slug", h.GetCollegeBySlug)
	v1.Get("/programs", h.GetPrograms)
	v1.Get("/programs/:code", h.GetProgramByCode)
	v1.Get("/grants", h.GetGrants)
	v1.Get("/grants/:slug", h.GetGrantBySlug)
	v1.Get("/opportunities", h.GetOpportunities)
	v1.Get("/opportunities/:slug", h.GetOpportunityBySlug)
	v1.Get("/deadlines", h.GetDeadlines)
	v1.Get("/sources", h.GetSources)
	v1.Get("/sources/:id", h.GetSourceById)

	// StudentHub 218 Programs & ENT Grant Calculator Endpoints
	studenthub := v1.Group("/studenthub")
	studenthub.Get("/programs", h.GetStudentHubPrograms)
	studenthub.Get("/programs/:slug", h.GetStudentHubProgramBySlug)
	studenthub.Get("/universities", h.GetStudentHubUniversities)
	studenthub.Get("/universities/:slug", h.GetStudentHubUniversityBySlug)
	studenthub.Get("/ent-results", h.GetStudentHubEntResults)
	studenthub.Get("/calculator", h.GetStudentHubCalculator)

	// Unified 4-Source Compass Endpoints (Univision + Gov.kz 657/707 + StudentHub KB)
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

	// Auth Endpoints — rate limiting per real client IP (Cloudflare / reverse proxy aware)
	authLimiter := limiter.New(limiter.Config{
		Max:        60,
		Expiration: 5 * time.Minute,
		KeyGenerator: func(c *fiber.Ctx) string {
			if cf := c.Get("CF-Connecting-IP"); cf != "" {
				return cf
			}
			if xff := c.Get("X-Forwarded-For"); xff != "" {
				parts := strings.Split(xff, ",")
				if len(parts) > 0 && strings.TrimSpace(parts[0]) != "" {
					return strings.TrimSpace(parts[0])
				}
			}
			if rip := c.Get("X-Real-IP"); rip != "" {
				return rip
			}
			return c.IP()
		},
		LimitReached: func(c *fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error": "Тым көп қате әрекет. 5 минуттан соң қайталаңыз / Слишком много попыток входа. Повторите через 5 минут.",
			})
		},
	})
	v1.Post("/auth/login", authLimiter, h.Login)

	// Protected Admin Endpoints
	admin := v1.Group("/admin")
	admin.Use(middleware.AuthMiddleware(cfg, models.RoleAdmin, models.RoleEditor, models.RoleReviewer))
	admin.Get("/me", h.GetMe)
	admin.Get("/stats", h.GetAdminStats)
	admin.Get("/verification-logs", h.GetVerificationLogs)
	admin.Post("/sources", h.CreateSource)
	admin.Post("/institutions", h.CreateInstitution)
	admin.Post("/grants", h.CreateGrant)
	admin.Post("/opportunities", h.CreateOpportunity)

	// High impact verification change restricted to Reviewer & Admin
	reviewersOnly := admin.Group("/verify")
	reviewersOnly.Use(middleware.AuthMiddleware(cfg, models.RoleAdmin, models.RoleReviewer))
	reviewersOnly.Post("/status", h.UpdateStatus)

	log.Printf("🚀 Forte Compass API starting on port %s", cfg.Port)
	if err := app.Listen(":" + cfg.Port); err != nil {
		log.Fatalf("Server shutdown error: %v", err)
	}
}
