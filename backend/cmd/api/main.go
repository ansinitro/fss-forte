package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
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
		AppName:      "Astana Education & Opportunity Platform API",
		ServerHeader: "AstanaEdu/1.0",
	})

	// Global Middlewares
	app.Use(recover.New())
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.CORSOrigin,
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET, POST, PUT, DELETE, OPTIONS",
		AllowCredentials: true,
	}))

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
	v1.Get("/programs", h.GetPrograms)
	v1.Get("/programs/:code", h.GetProgramByCode)
	v1.Get("/grants", h.GetGrants)
	v1.Get("/grants/:slug", h.GetGrantBySlug)
	v1.Get("/opportunities", h.GetOpportunities)
	v1.Get("/opportunities/:slug", h.GetOpportunityBySlug)
	v1.Get("/deadlines", h.GetDeadlines)
	v1.Get("/sources", h.GetSources)
	v1.Get("/sources/:id", h.GetSourceById)

	// Auth Endpoints
	v1.Post("/auth/login", h.Login)

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

	log.Printf("🚀 Astana Education & Opportunity Platform API starting on port %s", cfg.Port)
	if err := app.Listen(":" + cfg.Port); err != nil {
		log.Fatalf("Server shutdown error: %v", err)
	}
}
