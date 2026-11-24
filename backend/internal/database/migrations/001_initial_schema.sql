-- 001_initial_schema.sql: Initial Relational Database Schema for Astana Education Platform
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enum for verification status
CREATE TYPE content_status AS ENUM (
    'draft',
    'needs_verification',
    'verified',
    'upcoming',
    'open',
    'closed',
    'expired',
    'disputed',
    'archived'
);

-- Enum for user roles
CREATE TYPE user_role AS ENUM (
    'admin',
    'editor',
    'reviewer'
);

-- Users table for admin panel
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'editor',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sources table (Hierarchy & Citations)
CREATE TABLE IF NOT EXISTS sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    source_type VARCHAR(50) NOT NULL, -- 'legislation', 'gov_portal', 'authority', 'institution_official', 'external_discovery'
    academic_year VARCHAR(20),
    publication_date DATE,
    retrieved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    excerpt TEXT,
    verification_status content_status DEFAULT 'verified',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Educational Directions (IT, Medicine, Engineering, etc.)
CREATE TABLE IF NOT EXISTS directions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    name_kz VARCHAR(255) NOT NULL,
    name_ru VARCHAR(255) NOT NULL,
    description_kz TEXT,
    description_ru TEXT,
    icon_name VARCHAR(50),
    sort_order INT DEFAULT 0
);

-- Institutions (Universities & Colleges in Astana)
CREATE TABLE IF NOT EXISTS institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(120) NOT NULL UNIQUE,
    name_kz VARCHAR(255) NOT NULL,
    name_ru VARCHAR(255) NOT NULL,
    short_name_kz VARCHAR(100),
    short_name_ru VARCHAR(100),
    institution_type VARCHAR(50) NOT NULL, -- 'university', 'college'
    official_website TEXT NOT NULL,
    address_kz TEXT,
    address_ru TEXT,
    contact_phone VARCHAR(100),
    contact_email VARCHAR(100),
    dormitory_info_kz TEXT,
    dormitory_info_ru TEXT,
    accreditation_info_kz TEXT,
    accreditation_info_ru TEXT,
    has_military_department BOOLEAN DEFAULT false,
    status content_status NOT NULL DEFAULT 'verified',
    last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Educational Program Groups (e.g., B057 - Информационная безопасность)
CREATE TABLE IF NOT EXISTS education_program_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE, -- e.g. 'B057', 'B058', 'B051'
    name_kz VARCHAR(255) NOT NULL,
    name_ru VARCHAR(255) NOT NULL,
    direction_id UUID REFERENCES directions(id) ON DELETE SET NULL,
    education_level VARCHAR(50) NOT NULL DEFAULT 'bachelor', -- 'college', 'bachelor', 'master'
    description_kz TEXT,
    description_ru TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Educational Programs (Specific programs e.g., 6B06101 - Компьютерные науки)
CREATE TABLE IF NOT EXISTS education_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL, -- official code e.g. '6B06101'
    group_id UUID NOT NULL REFERENCES education_program_groups(id) ON DELETE CASCADE,
    name_kz VARCHAR(255) NOT NULL,
    name_ru VARCHAR(255) NOT NULL,
    education_level VARCHAR(50) NOT NULL DEFAULT 'bachelor',
    status content_status NOT NULL DEFAULT 'verified',
    official_source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(code, group_id)
);

-- Institution Programs (Connecting institutions to offered programs)
CREATE TABLE IF NOT EXISTS institution_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    program_group_id UUID NOT NULL REFERENCES education_program_groups(id) ON DELETE CASCADE,
    program_id UUID REFERENCES education_programs(id) ON DELETE SET NULL,
    education_level VARCHAR(50) NOT NULL DEFAULT 'bachelor',
    study_languages TEXT[] NOT NULL DEFAULT '{"KZ", "RU"}',
    study_forms TEXT[] NOT NULL DEFAULT '{"full-time"}', -- 'full-time', 'dual', 'evening'
    tuition_fee_kzt NUMERIC(12, 2),
    tuition_period VARCHAR(50) DEFAULT 'per_year', -- 'per_year', 'per_semester', 'total'
    is_available BOOLEAN NOT NULL DEFAULT true,
    admission_info_kz TEXT,
    admission_info_ru TEXT,
    accreditation_status VARCHAR(100),
    status content_status NOT NULL DEFAULT 'verified',
    last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Admission Requirements (Year-specific rules, UNT profile combinations, thresholds)
CREATE TABLE IF NOT EXISTS admission_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    academic_year VARCHAR(20) NOT NULL, -- e.g. '2026-2027', '2025-2026'
    program_group_id UUID NOT NULL REFERENCES education_program_groups(id) ON DELETE CASCADE,
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE, -- null if applies nationally to the group
    profile_subject_1_kz VARCHAR(100) NOT NULL,
    profile_subject_1_ru VARCHAR(100) NOT NULL,
    profile_subject_2_kz VARCHAR(100) NOT NULL,
    profile_subject_2_ru VARCHAR(100) NOT NULL,
    min_unt_total_score INT NOT NULL DEFAULT 50, -- National passing threshold
    institution_specific_threshold INT, -- If university requires higher e.g. 65, 75
    creative_exam_required BOOLEAN DEFAULT false,
    creative_exam_details_kz TEXT,
    creative_exam_details_ru TEXT,
    eligibility_rules_kz TEXT,
    eligibility_rules_ru TEXT,
    status content_status NOT NULL DEFAULT 'verified',
    source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Historical Grant Results (Year-specific competition cutoffs by group and category)
CREATE TABLE IF NOT EXISTS historical_grant_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    academic_year VARCHAR(20) NOT NULL, -- e.g. '2024-2025', '2023-2024'
    program_group_id UUID NOT NULL REFERENCES education_program_groups(id) ON DELETE CASCADE,
    institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
    competition_type VARCHAR(50) NOT NULL DEFAULT 'general', -- 'general', 'rural_quota', 'orphan_quota', 'disability_quota', 'large_family_quota'
    cutoff_score INT NOT NULL,
    max_score INT DEFAULT 140,
    total_grants_allocated INT,
    source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Careers / Professions
CREATE TABLE IF NOT EXISTS careers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(120) NOT NULL UNIQUE,
    title_kz VARCHAR(255) NOT NULL,
    title_ru VARCHAR(255) NOT NULL,
    direction_id UUID REFERENCES directions(id) ON DELETE SET NULL,
    description_kz TEXT NOT NULL,
    description_ru TEXT NOT NULL,
    daily_tasks_kz TEXT[] NOT NULL DEFAULT '{}',
    daily_tasks_ru TEXT[] NOT NULL DEFAULT '{}',
    skills_kz TEXT[] NOT NULL DEFAULT '{}',
    skills_ru TEXT[] NOT NULL DEFAULT '{}',
    profile_subjects_kz VARCHAR(255),
    profile_subjects_ru VARCHAR(255),
    employment_outlook_kz TEXT,
    employment_outlook_ru TEXT,
    status content_status NOT NULL DEFAULT 'verified',
    source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Career to Program Group Linkage
CREATE TABLE IF NOT EXISTS career_program_groups (
    career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
    program_group_id UUID NOT NULL REFERENCES education_program_groups(id) ON DELETE CASCADE,
    PRIMARY KEY(career_id, program_group_id)
);

-- Grants & Scholarships (National, Akimat Astana, Rector, Corporate, Foundations)
CREATE TABLE IF NOT EXISTS grants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(150) NOT NULL UNIQUE,
    title_kz VARCHAR(255) NOT NULL,
    title_ru VARCHAR(255) NOT NULL,
    provider_kz VARCHAR(255) NOT NULL,
    provider_ru VARCHAR(255) NOT NULL,
    grant_type VARCHAR(50) NOT NULL, -- 'national', 'akimat_astana', 'rector', 'corporate', 'charitable', 'international'
    location_scope VARCHAR(50) NOT NULL DEFAULT 'astana', -- 'astana', 'kazakhstan', 'international'
    education_level VARCHAR(50) NOT NULL DEFAULT 'bachelor', -- 'college', 'bachelor', 'master', 'all'
    direction_id UUID REFERENCES directions(id) ON DELETE SET NULL,
    coverage_type VARCHAR(50) NOT NULL, -- 'full_tuition', 'partial_tuition', 'monthly_stipend', 'one_time_aid'
    coverage_details_kz TEXT NOT NULL,
    coverage_details_ru TEXT NOT NULL,
    eligibility_criteria_kz TEXT NOT NULL,
    eligibility_criteria_ru TEXT NOT NULL,
    required_documents_kz TEXT[] NOT NULL DEFAULT '{}',
    required_documents_ru TEXT[] NOT NULL DEFAULT '{}',
    selection_process_kz TEXT,
    selection_process_ru TEXT,
    application_url TEXT,
    academic_year VARCHAR(20) NOT NULL,
    status content_status NOT NULL DEFAULT 'verified',
    last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    next_review_at TIMESTAMP WITH TIME ZONE,
    source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Opportunities (Competitions, STEM, Free Courses, Hackathons, Internships, Mobility)
CREATE TABLE IF NOT EXISTS opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(150) NOT NULL UNIQUE,
    title_kz VARCHAR(255) NOT NULL,
    title_ru VARCHAR(255) NOT NULL,
    provider_kz VARCHAR(255) NOT NULL,
    provider_ru VARCHAR(255) NOT NULL,
    opportunity_type VARCHAR(50) NOT NULL, -- 'course', 'olympiad', 'hackathon', 'stem', 'internship', 'mobility', 'mentorship'
    description_kz TEXT NOT NULL,
    description_ru TEXT NOT NULL,
    target_audience_kz TEXT NOT NULL,
    target_audience_ru TEXT NOT NULL,
    age_grade_restrictions VARCHAR(100),
    cost_type VARCHAR(50) NOT NULL DEFAULT 'free', -- 'free', 'stipend_paid', 'subsidized'
    benefits_kz TEXT NOT NULL,
    benefits_ru TEXT NOT NULL,
    duration_kz VARCHAR(100),
    duration_ru VARCHAR(100),
    location_mode VARCHAR(50) NOT NULL DEFAULT 'in_person_astana', -- 'in_person_astana', 'online', 'hybrid'
    application_url TEXT,
    application_requirements_kz TEXT,
    application_requirements_ru TEXT,
    status content_status NOT NULL DEFAULT 'verified',
    last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    next_review_at TIMESTAMP WITH TIME ZONE,
    source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Deadlines Table (Strict academic cycle dates)
CREATE TABLE IF NOT EXISTS deadlines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL, -- 'grant', 'opportunity', 'admission'
    entity_id UUID NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    title_kz VARCHAR(255) NOT NULL,
    title_ru VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE NOT NULL,
    is_confirmed BOOLEAN NOT NULL DEFAULT true,
    source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Source Claims (Connecting individual claims to exact sources with excerpts)
CREATE TABLE IF NOT EXISTS source_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    claim_field VARCHAR(100) NOT NULL,
    excerpt_support TEXT,
    verified_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Verification Logs (Audit trail)
CREATE TABLE IF NOT EXISTS verification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'created', 'updated', 'verified', 'status_changed'
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance & full-text / trigram search
CREATE INDEX IF NOT EXISTS idx_institutions_slug ON institutions(slug);
CREATE INDEX IF NOT EXISTS idx_institutions_type ON institutions(institution_type);
CREATE INDEX IF NOT EXISTS idx_institutions_status ON institutions(status);

CREATE INDEX IF NOT EXISTS idx_program_groups_code ON education_program_groups(code);
CREATE INDEX IF NOT EXISTS idx_program_groups_direction ON education_program_groups(direction_id);

CREATE INDEX IF NOT EXISTS idx_programs_code ON education_programs(code);
CREATE INDEX IF NOT EXISTS idx_programs_group ON education_programs(group_id);

CREATE INDEX IF NOT EXISTS idx_inst_prog_inst ON institution_programs(institution_id);
CREATE INDEX IF NOT EXISTS idx_inst_prog_group ON institution_programs(program_group_id);

CREATE INDEX IF NOT EXISTS idx_adm_req_group_year ON admission_requirements(program_group_id, academic_year);
CREATE INDEX IF NOT EXISTS idx_hist_grants_group_year ON historical_grant_results(program_group_id, academic_year);

CREATE INDEX IF NOT EXISTS idx_careers_slug ON careers(slug);
CREATE INDEX IF NOT EXISTS idx_careers_direction ON careers(direction_id);

CREATE INDEX IF NOT EXISTS idx_grants_slug ON grants(slug);
CREATE INDEX IF NOT EXISTS idx_grants_status ON grants(status);
CREATE INDEX IF NOT EXISTS idx_grants_type ON grants(grant_type);

CREATE INDEX IF NOT EXISTS idx_opps_slug ON opportunities(slug);
CREATE INDEX IF NOT EXISTS idx_opps_status ON opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opps_type ON opportunities(opportunity_type);

CREATE INDEX IF NOT EXISTS idx_deadlines_entity ON deadlines(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_deadlines_end_date ON deadlines(end_date);

-- GIN trigram indexes for fast fuzzy search in Kazakh & Russian
CREATE INDEX IF NOT EXISTS idx_inst_name_kz_trgm ON institutions USING gin (name_kz gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_inst_name_ru_trgm ON institutions USING gin (name_ru gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_prog_name_kz_trgm ON education_programs USING gin (name_kz gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_prog_name_ru_trgm ON education_programs USING gin (name_ru gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_careers_title_kz_trgm ON careers USING gin (title_kz gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_careers_title_ru_trgm ON careers USING gin (title_ru gin_trgm_ops);
