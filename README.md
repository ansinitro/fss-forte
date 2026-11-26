# Болашағыңды таңда — Astana Education & Opportunity Platform

> **Мамандық таңда. Грант тап. Мүмкіндіктеріңді аш.**  
> *Less information. Better decisions.*

---

## 1. Product Vision & Architecture

**Болашағыңды таңда** is a production-ready, high-trust educational discovery platform built specifically for school students (Grades 9–11), applicants, and parents in Astana, Kazakhstan.

The platform eliminates information overload by structuring pathways into **strictly four navigation sections**:

1. **Мамандық таңдау (`/careers`)**: Career & profession explorer with real duties, required skills, UNT profile combinations, and linked educational institutions in Astana.
2. **Оқу орындары (`/education`)**: Comprehensive explorer for Astana universities and colleges, official programs (6B06101, B058, etc.), admission thresholds, and dormitory info.
3. **Гранттар (`/grants`)**: National government grants, Astana Akimat grants, Rector grants, and charitable scholarships ("Қазақстан халқына") with verified deadlines and requirements.
4. **Мүмкіндіктер (`/opportunities`)**: STEM programs, free IT courses (Tech Orda 600,000 ₸ vouchers), Olympiads (Daryn), and startup incubation (Astana Hub).

---

## 2. Strict Data Accuracy & Verification Rules

1. **Source Hierarchy**: Adilet Zan (Legislation) > Gov.kz/Testcenter.kz (Government) > Authorities (MSHE/Astana Bilim) > Official Institution portals.
2. **Score Separation**: National UNT threshold (50/65/75) is strictly distinguished from university-specific minimums and historical grant competition cutoffs. Past scores explicitly state their academic year (e.g. 2024–2025) and never guarantee future admission.
3. **Academic-Cycle Isolation**: All time-sensitive records belong to a specific admission cycle (`2026-2027`).
4. **Human Review Workflow**: Content is verified before publication. Expired opportunities and unverified claims are isolated.

---

## 3. Technology Stack

- **Backend**: Go 1.22, Fiber v2, PostgreSQL 16 with `pg_trgm` fuzzy trigram search and full-text search, JWT authentication, RBAC middleware.
- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide Icons, bilingual localization (Kazakh primary & Russian).
- **Database**: PostgreSQL 16 with normalized relational schema (`institutions`, `education_program_groups`, `education_programs`, `admission_requirements`, `historical_grant_results`, `grants`, `opportunities`, `deadlines`, `sources`, `verification_logs`).
- **Containerization**: Multi-stage `Dockerfile` (Go & Next.js standalone) and `docker-compose.yml`.

---

## 4. Quick Start

### Option A: Using Docker Compose (Recommended)

```bash
# 1. Clone and enter directory
cd forte-soc

# 2. Configure environment
cp .env.example .env

# 3. Start PostgreSQL, Go Backend, and Next.js Frontend
docker-compose up -d --build

# 4. Check status
docker-compose ps
```

- Web Frontend: `http://localhost:3000`
- REST API: `http://localhost:8080/api/v1`
- Health check: `http://localhost:8080/api/v1/health`

---

### Option B: Local Development

#### 1. Backend (Go)
```bash
cd backend
go run cmd/api/main.go
# API starts on http://localhost:8080 (automatically connects to Postgres or initializes verified memory store)
```

Run tests:
```bash
go test -v ./...
```

#### 2. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
# Web app runs on http://localhost:3000
```

Build production bundle:
```bash
npm run build
```

---

## 5. Administration & Verification Panel

The administration panel is available at `/admin`.

### Authentication:
- Administrative access is configured via the environment variables `JWT_SECRET` and `ADMIN_PASSWORD_HASH`.
- **Role**: `admin`
- For security, credentials are managed through environment variables and are never stored in plain text or rendered on public pages.

Capabilities:
- Manage official sources (`sources`) with exact excerpts and verification status.
- Add and edit institutions, educational program groups, and admission thresholds.
- Add grants and specify exact coverage types (Full tuition, Partial tuition, Monthly stipend).
- Audit verification logs and approve verified claims.

---

## 6. Database Migrations & Backup

Migrations are located in `backend/internal/database/migrations/`:
- `001_initial_schema.sql`: Core relational tables, enums, triggers, and trigram indexes.
- `002_seed_verified_astana.sql`: Verified Astana institutions (AITU, ENU, AMU, Astana Polytechnic College, KATRU), programs, official grants, akimat grants, and STEM opportunities.

### Database Backup
```bash
docker exec -t astana_edu_db pg_dump -U postgres -d astana_edu > backup_$(date +%Y%m%d).sql
```

### Database Restore
```bash
docker exec -i astana_edu_db psql -U postgres -d astana_edu < backup_20261124.sql
```
