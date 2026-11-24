package config

import (
	"os"
	"github.com/joho/godotenv"
)

type Config struct {
	Port         string
	DBHost       string
	DBPort       string
	DBUser       string
	DBPassword   string
	DBName       string
	DBSSLMode    string
	JWTSecret    string
	CORSOrigin   string
	AcademicYear string
}

func LoadConfig() *Config {
	_ = godotenv.Load()

	getEnv := func(key, fallback string) string {
		if val := os.Getenv(key); val != "" {
			return val
		}
		return fallback
	}

	return &Config{
		Port:         getEnv("PORT", "8080"),
		DBHost:       getEnv("DB_HOST", "localhost"),
		DBPort:       getEnv("DB_PORT", "5432"),
		DBUser:       getEnv("DB_USER", "postgres"),
		DBPassword:   getEnv("DB_PASSWORD", "postgres"),
		DBName:       getEnv("DB_NAME", "astana_edu"),
		DBSSLMode:    getEnv("DB_SSLMODE", "disable"),
		JWTSecret:    getEnv("JWT_SECRET", "super-secret-astana-edu-platform-key-2026"),
		CORSOrigin:   getEnv("CORS_ORIGIN", "*"),
		AcademicYear: getEnv("CURRENT_ACADEMIC_YEAR", "2026-2027"),
	}
}
