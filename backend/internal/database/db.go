package database

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	_ "github.com/lib/pq"
	"astana-platform/internal/config"
)

type DB struct {
	SqlDB  *sql.DB
	IsMock bool
}

func ConnectDB(cfg *config.Config) (*DB, error) {
	connStr := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s connect_timeout=3",
		cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBSSLMode,
	)

	sqlDB, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Printf("⚠️ PostgreSQL open warning: %v. Running in standalone fallback mode.", err)
		return &DB{SqlDB: nil, IsMock: true}, nil
	}

	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetConnMaxLifetime(5 * time.Minute)

	ctxPing, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	if err := sqlDB.PingContext(ctxPing); err != nil {
		log.Printf("⚠️ PostgreSQL unreachable at %s:%s (%v). Running with verified memory repository fallback.", cfg.DBHost, cfg.DBPort, err)
		return &DB{SqlDB: nil, IsMock: true}, nil
	}

	log.Println("✅ Successfully connected to PostgreSQL database.")
	db := &DB{SqlDB: sqlDB, IsMock: false}

	// Run migrations
	if err := db.RunMigrations(); err != nil {
		log.Printf("⚠️ Migration warning: %v", err)
	}

	return db, nil
}

func (db *DB) RunMigrations() error {
	if db.SqlDB == nil {
		return nil
	}

	// Create migrations table if not exists
	_, err := db.SqlDB.Exec(`
		CREATE TABLE IF NOT EXISTS schema_migrations (
			version VARCHAR(255) PRIMARY KEY,
			applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);
	`)
	if err != nil {
		return fmt.Errorf("failed to create schema_migrations table: %w", err)
	}

	migrationDirs := []string{
		"internal/database/migrations",
		"./backend/internal/database/migrations",
		"/home/hacker/forte-soc/backend/internal/database/migrations",
	}

	var migrationFiles []string
	var chosenDir string
	for _, dir := range migrationDirs {
		matches, err := filepath.Glob(filepath.Join(dir, "*.sql"))
		if err == nil && len(matches) > 0 {
			migrationFiles = matches
			chosenDir = dir
			break
		}
	}

	if len(migrationFiles) == 0 {
		log.Println("ℹ️ No migration files found in search directories.")
		return nil
	}

	sort.Strings(migrationFiles)

	for _, file := range migrationFiles {
		baseName := filepath.Base(file)
		var exists bool
		err := db.SqlDB.QueryRow("SELECT EXISTS(SELECT 1 FROM schema_migrations WHERE version = $1)", baseName).Scan(&exists)
		if err != nil {
			log.Printf("Error checking migration %s: %v", baseName, err)
			continue
		}

		if exists {
			continue
		}

		log.Printf("Running migration: %s", baseName)
		content, err := os.ReadFile(file)
		if err != nil {
			return fmt.Errorf("failed to read migration %s: %w", file, err)
		}

		// Execute migration within transaction
		tx, err := db.SqlDB.Begin()
		if err != nil {
			return err
		}

		queries := strings.Split(string(content), ";")
		for _, q := range queries {
			trimmed := strings.TrimSpace(q)
			if trimmed == "" {
				continue
			}
			if _, err := tx.Exec(trimmed); err != nil {
				_ = tx.Rollback()
				return fmt.Errorf("error in %s query [%s]: %w", baseName, trimmed[:min(50, len(trimmed))], err)
			}
		}

		if _, err := tx.Exec("INSERT INTO schema_migrations (version) VALUES ($1)", baseName); err != nil {
			_ = tx.Rollback()
			return err
		}

		if err := tx.Commit(); err != nil {
			return err
		}

		log.Printf("✅ Migration applied: %s", baseName)
	}

	_ = chosenDir
	return nil
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
