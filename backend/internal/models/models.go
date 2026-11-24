package models

import (
	"time"
)

type ContentStatus string

const (
	StatusDraft             ContentStatus = "draft"
	StatusNeedsVerification ContentStatus = "needs_verification"
	StatusVerified          ContentStatus = "verified"
	StatusUpcoming          ContentStatus = "upcoming"
	StatusOpen              ContentStatus = "open"
	StatusClosed            ContentStatus = "closed"
	StatusExpired           ContentStatus = "expired"
	StatusDisputed          ContentStatus = "disputed"
	StatusArchived          ContentStatus = "archived"
)

type UserRole string

const (
	RoleAdmin    UserRole = "admin"
	RoleEditor   UserRole = "editor"
	RoleReviewer UserRole = "reviewer"
)

type User struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	FullName  string    `json:"full_name"`
	Role      UserRole  `json:"role"`
	IsActive  bool      `json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
}

type Source struct {
	ID                 string        `json:"id"`
	URL                string        `json:"url"`
	Title              string        `json:"title"`
	Organization       string        `json:"organization"`
	SourceType         string        `json:"source_type"` // legislation, gov_portal, authority, institution_official, external_discovery
	AcademicYear       string        `json:"academic_year"`
	PublicationDate    *string       `json:"publication_date"`
	RetrievedAt        time.Time     `json:"retrieved_at"`
	Excerpt            string        `json:"excerpt"`
	VerificationStatus ContentStatus `json:"verification_status"`
}

type Direction struct {
	ID            string  `json:"id"`
	Slug          string  `json:"slug"`
	NameKz        string  `json:"name_kz"`
	NameRu        string  `json:"name_ru"`
	DescriptionKz *string `json:"description_kz"`
	DescriptionRu *string `json:"description_ru"`
	IconName      *string `json:"icon_name"`
	SortOrder     int     `json:"sort_order"`
}

type Institution struct {
	ID                     string        `json:"id"`
	Slug                   string        `json:"slug"`
	NameKz                 string        `json:"name_kz"`
	NameRu                 string        `json:"name_ru"`
	ShortNameKz            *string       `json:"short_name_kz"`
	ShortNameRu            *string       `json:"short_name_ru"`
	InstitutionType        string        `json:"institution_type"` // university, college
	OfficialWebsite        string        `json:"official_website"`
	AddressKz              *string       `json:"address_kz"`
	AddressRu              *string       `json:"address_ru"`
	ContactPhone           *string       `json:"contact_phone"`
	ContactEmail           *string       `json:"contact_email"`
	DormitoryInfoKz        *string       `json:"dormitory_info_kz"`
	DormitoryInfoRu        *string       `json:"dormitory_info_ru"`
	AccreditationInfoKz    *string       `json:"accreditation_info_kz"`
	AccreditationInfoRu    *string       `json:"accreditation_info_ru"`
	HasMilitaryDepartment  bool          `json:"has_military_department"`
	Status                 ContentStatus `json:"status"`
	LastVerifiedAt         time.Time     `json:"last_verified_at"`
	SourceID               *string       `json:"source_id"`
	Source                 *Source       `json:"source,omitempty"`
	ProgramsCount          int           `json:"programs_count,omitempty"`
	OfferedProgramsSummary []string      `json:"offered_programs_summary,omitempty"`
}

type EducationProgramGroup struct {
	ID             string     `json:"id"`
	Code           string     `json:"code"` // e.g. B057
	NameKz         string     `json:"name_kz"`
	NameRu         string     `json:"name_ru"`
	DirectionID    *string    `json:"direction_id"`
	Direction      *Direction `json:"direction,omitempty"`
	EducationLevel string     `json:"education_level"`
	DescriptionKz  *string    `json:"description_kz"`
	DescriptionRu  *string    `json:"description_ru"`
}

type EducationProgram struct {
	ID               string                 `json:"id"`
	Code             string                 `json:"code"` // e.g. 6B06101
	GroupID          string                 `json:"group_id"`
	Group            *EducationProgramGroup `json:"group,omitempty"`
	NameKz           string                 `json:"name_kz"`
	NameRu           string                 `json:"name_ru"`
	EducationLevel   string                 `json:"education_level"`
	Status           ContentStatus          `json:"status"`
	OfficialSourceID *string                `json:"official_source_id"`
	Institutions     []InstitutionSummary   `json:"institutions,omitempty"`
}

type InstitutionSummary struct {
	ID              string   `json:"id"`
	Slug            string   `json:"slug"`
	NameKz          string   `json:"name_kz"`
	NameRu          string   `json:"name_ru"`
	InstitutionType string   `json:"institution_type"`
	TuitionFeeKzt   *float64 `json:"tuition_fee_kzt"`
	StudyLanguages  []string `json:"study_languages"`
}

type InstitutionProgram struct {
	ID                  string                 `json:"id"`
	InstitutionID       string                 `json:"institution_id"`
	Institution         *Institution           `json:"institution,omitempty"`
	ProgramGroupID      string                 `json:"program_group_id"`
	ProgramGroup        *EducationProgramGroup `json:"program_group,omitempty"`
	ProgramID           *string                `json:"program_id"`
	Program             *EducationProgram      `json:"program,omitempty"`
	EducationLevel      string                 `json:"education_level"`
	StudyLanguages      []string               `json:"study_languages"`
	StudyForms          []string               `json:"study_forms"`
	TuitionFeeKzt       *float64               `json:"tuition_fee_kzt"`
	TuitionPeriod       string                 `json:"tuition_period"`
	IsAvailable         bool                   `json:"is_available"`
	AdmissionInfoKz     *string                `json:"admission_info_kz"`
	AdmissionInfoRu     *string                `json:"admission_info_ru"`
	AccreditationStatus *string                `json:"accreditation_status"`
	Status              ContentStatus          `json:"status"`
	LastVerifiedAt      time.Time              `json:"last_verified_at"`
	SourceID            *string                `json:"source_id"`
}

type AdmissionRequirement struct {
	ID                           string        `json:"id"`
	AcademicYear                 string        `json:"academic_year"`
	ProgramGroupID               string        `json:"program_group_id"`
	InstitutionID                *string       `json:"institution_id"`
	ProfileSubject1Kz            string        `json:"profile_subject_1_kz"`
	ProfileSubject1Ru            string        `json:"profile_subject_1_ru"`
	ProfileSubject2Kz            string        `json:"profile_subject_2_kz"`
	ProfileSubject2Ru            string        `json:"profile_subject_2_ru"`
	MinUntTotalScore             int           `json:"min_unt_total_score"`
	InstitutionSpecificThreshold *int          `json:"institution_specific_threshold"`
	CreativeExamRequired         bool          `json:"creative_exam_required"`
	CreativeExamDetailsKz        *string       `json:"creative_exam_details_kz"`
	CreativeExamDetailsRu        *string       `json:"creative_exam_details_ru"`
	EligibilityRulesKz           *string       `json:"eligibility_rules_kz"`
	EligibilityRulesRu           *string       `json:"eligibility_rules_ru"`
	Status                       ContentStatus `json:"status"`
	SourceID                     *string       `json:"source_id"`
}

type HistoricalGrantResult struct {
	ID                   string  `json:"id"`
	AcademicYear         string  `json:"academic_year"`
	ProgramGroupID       string  `json:"program_group_id"`
	InstitutionID        *string `json:"institution_id"`
	CompetitionType      string  `json:"competition_type"`
	CutoffScore          int     `json:"cutoff_score"`
	MaxScore             int     `json:"max_score"`
	TotalGrantsAllocated *int    `json:"total_grants_allocated"`
	SourceID             *string `json:"source_id"`
}

type Career struct {
	ID                   string                   `json:"id"`
	Slug                 string                   `json:"slug"`
	TitleKz              string                   `json:"title_kz"`
	TitleRu              string                   `json:"title_ru"`
	DirectionID          *string                  `json:"direction_id"`
	Direction            *Direction               `json:"direction,omitempty"`
	DescriptionKz        string                   `json:"description_kz"`
	DescriptionRu        string                   `json:"description_ru"`
	DailyTasksKz         []string                 `json:"daily_tasks_kz"`
	DailyTasksRu         []string                 `json:"daily_tasks_ru"`
	SkillsKz             []string                 `json:"skills_kz"`
	SkillsRu             []string                 `json:"skills_ru"`
	ProfileSubjectsKz    *string                  `json:"profile_subjects_kz"`
	ProfileSubjectsRu    *string                  `json:"profile_subjects_ru"`
	EmploymentOutlookKz  *string                  `json:"employment_outlook_kz"`
	EmploymentOutlookRu  *string                  `json:"employment_outlook_ru"`
	Status               ContentStatus            `json:"status"`
	SourceID             *string                  `json:"source_id"`
	Source               *Source                  `json:"source,omitempty"`
	RelatedProgramGroups []EducationProgramGroup  `json:"related_program_groups,omitempty"`
	RelatedInstitutions  []InstitutionSummary     `json:"related_institutions,omitempty"`
}

type Grant struct {
	ID                    string        `json:"id"`
	Slug                  string        `json:"slug"`
	TitleKz               string        `json:"title_kz"`
	TitleRu               string        `json:"title_ru"`
	ProviderKz            string        `json:"provider_kz"`
	ProviderRu            string        `json:"provider_ru"`
	GrantType             string        `json:"grant_type"` // national, akimat_astana, rector, corporate, charitable, international
	LocationScope         string        `json:"location_scope"`
	EducationLevel        string        `json:"education_level"`
	DirectionID           *string       `json:"direction_id"`
	Direction             *Direction    `json:"direction,omitempty"`
	CoverageType          string        `json:"coverage_type"` // full_tuition, partial_tuition, monthly_stipend, one_time_aid
	CoverageDetailsKz     string        `json:"coverage_details_kz"`
	CoverageDetailsRu     string        `json:"coverage_details_ru"`
	EligibilityCriteriaKz string        `json:"eligibility_criteria_kz"`
	EligibilityCriteriaRu string        `json:"eligibility_criteria_ru"`
	RequiredDocumentsKz   []string      `json:"required_documents_kz"`
	RequiredDocumentsRu   []string      `json:"required_documents_ru"`
	SelectionProcessKz    *string       `json:"selection_process_kz"`
	SelectionProcessRu    *string       `json:"selection_process_ru"`
	ApplicationURL        *string       `json:"application_url"`
	AcademicYear          string        `json:"academic_year"`
	Status                ContentStatus `json:"status"`
	LastVerifiedAt        time.Time     `json:"last_verified_at"`
	NextReviewAt          *time.Time    `json:"next_review_at"`
	SourceID              *string       `json:"source_id"`
	Source                *Source       `json:"source,omitempty"`
	Deadlines             []Deadline    `json:"deadlines,omitempty"`
}

type Opportunity struct {
	ID                         string        `json:"id"`
	Slug                       string        `json:"slug"`
	TitleKz                    string        `json:"title_kz"`
	TitleRu                    string        `json:"title_ru"`
	ProviderKz                 string        `json:"provider_kz"`
	ProviderRu                 string        `json:"provider_ru"`
	OpportunityType            string        `json:"opportunity_type"` // course, olympiad, hackathon, stem, internship, mobility, mentorship
	DescriptionKz              string        `json:"description_kz"`
	DescriptionRu              string        `json:"description_ru"`
	TargetAudienceKz           string        `json:"target_audience_kz"`
	TargetAudienceRu           string        `json:"target_audience_ru"`
	AgeGradeRestrictions      *string       `json:"age_grade_restrictions"`
	CostType                   string        `json:"cost_type"` // free, stipend_paid, subsidized
	BenefitsKz                 string        `json:"benefits_kz"`
	BenefitsRu                 string        `json:"benefits_ru"`
	DurationKz                 *string       `json:"duration_kz"`
	DurationRu                 *string       `json:"duration_ru"`
	LocationMode               string        `json:"location_mode"` // in_person_astana, online, hybrid
	ApplicationURL             *string       `json:"application_url"`
	ApplicationRequirementsKz  *string       `json:"application_requirements_kz"`
	ApplicationRequirementsRu  *string       `json:"application_requirements_ru"`
	Status                     ContentStatus `json:"status"`
	LastVerifiedAt             time.Time     `json:"last_verified_at"`
	NextReviewAt               *time.Time    `json:"next_review_at"`
	SourceID                   *string       `json:"source_id"`
	Source                     *Source       `json:"source,omitempty"`
	Deadlines                  []Deadline    `json:"deadlines,omitempty"`
}

type Deadline struct {
	ID           string  `json:"id"`
	EntityType   string  `json:"entity_type"`
	EntityID     string  `json:"entity_id"`
	AcademicYear string  `json:"academic_year"`
	TitleKz      string  `json:"title_kz"`
	TitleRu      string  `json:"title_ru"`
	StartDate    *string `json:"start_date"`
	EndDate      string  `json:"end_date"`
	IsConfirmed  bool    `json:"is_confirmed"`
	SourceID     *string `json:"source_id"`
}

type VerificationLog struct {
	ID         string    `json:"id"`
	EntityType string    `json:"entity_type"`
	EntityID   string    `json:"entity_id"`
	Action     string    `json:"action"`
	OldStatus  *string   `json:"old_status"`
	NewStatus  *string   `json:"new_status"`
	UserID     *string   `json:"user_id"`
	UserEmail  *string   `json:"user_email,omitempty"`
	Comments   *string   `json:"comments"`
	CreatedAt  time.Time `json:"created_at"`
}

type SearchResultItem struct {
	Type        string `json:"type"` // "career", "institution", "program", "grant", "opportunity"
	ID          string `json:"id"`
	Slug        string `json:"slug"`
	TitleKz     string `json:"title_kz"`
	TitleRu     string `json:"title_ru"`
	SubtitleKz  string `json:"subtitle_kz"`
	SubtitleRu  string `json:"subtitle_ru"`
	Badge       string `json:"badge"`
	URL         string `json:"url"`
}

type SearchResponse struct {
	Query   string             `json:"query"`
	Total   int                `json:"total"`
	Results []SearchResultItem `json:"results"`
}
