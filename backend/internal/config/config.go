package config

import (
	"log"
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

	jwtSecret := getEnv("JWT_SECRET", "")
	if jwtSecret == "" {
		log.Fatal("FATAL: JWT_SECRET environment variable is not set. Refusing to start without a secret key.")
	}
	if len(jwtSecret) < 32 {
		log.Fatal("FATAL: JWT_SECRET must be at least 32 characters long for security.")
	}

	return &Config{
		Port:         getEnv("PORT", "8080"),
		DBHost:       getEnv("DB_HOST", "localhost"),
		DBPort:       getEnv("DB_PORT", "5432"),
		DBUser:       getEnv("DB_USER", "postgres"),
		DBPassword:   getEnv("DB_PASSWORD", "postgres"),
		DBName:       getEnv("DB_NAME", "astana_edu"),
		DBSSLMode:    getEnv("DB_SSLMODE", "disable"),
		JWTSecret:    jwtSecret,
		CORSOrigin:   getEnv("CORS_ORIGIN", "https://fss.piupiu.kz"),
		AcademicYear: getEnv("CURRENT_ACADEMIC_YEAR", "2026-2027"),
	}
}
