export type ContentStatus = 
  | 'draft'
  | 'needs_verification'
  | 'verified'
  | 'upcoming'
  | 'open'
  | 'closed'
  | 'expired'
  | 'disputed'
  | 'archived';

export type UserRole = 'admin' | 'editor' | 'reviewer';

export interface Source {
  id: string;
  url: string;
  title: string;
  organization: string;
  source_type: 'legislation' | 'gov_portal' | 'authority' | 'institution_official' | 'external_discovery';
  academic_year?: string;
  publication_date?: string;
  retrieved_at: string;
  excerpt: string;
  verification_status: ContentStatus;
}

export interface Direction {
  id: string;
  slug: string;
  name_kz: string;
  name_ru: string;
  description_kz?: string;
  description_ru?: string;
  icon_name?: string;
  sort_order: number;
}

export interface InstitutionSummary {
  id: string;
  slug: string;
  name_kz: string;
  name_ru: string;
  institution_type: 'university' | 'college';
  tuition_fee_kzt?: number;
  study_languages?: string[];
}

export interface Institution {
  id: string;
  slug: string;
  name_kz: string;
  name_ru: string;
  short_name_kz?: string;
  short_name_ru?: string;
  institution_type: 'university' | 'college';
  official_website: string;
  address_kz?: string;
  address_ru?: string;
  contact_phone?: string;
  contact_email?: string;
  dormitory_info_kz?: string;
  dormitory_info_ru?: string;
  accreditation_info_kz?: string;
  accreditation_info_ru?: string;
  has_military_department: boolean;
  status: ContentStatus;
  last_verified_at: string;
  source_id?: string;
  source?: Source;
  programs_count?: number;
  offered_programs_summary?: string[];
}

export interface EducationProgramGroup {
  id: string;
  code: string;
  name_kz: string;
  name_ru: string;
  direction_id?: string;
  direction?: Direction;
  education_level: 'college' | 'bachelor' | 'master';
  description_kz?: string;
  description_ru?: string;
}

export interface EducationProgram {
  id: string;
  code: string;
  group_id: string;
  group?: EducationProgramGroup;
  name_kz: string;
  name_ru: string;
  education_level: string;
  status: ContentStatus;
  official_source_id?: string;
  institutions?: InstitutionSummary[];
}

export interface AdmissionRequirement {
  id: string;
  academic_year: string;
  program_group_id: string;
  institution_id?: string;
  profile_subject_1_kz: string;
  profile_subject_1_ru: string;
  profile_subject_2_kz: string;
  profile_subject_2_ru: string;
  min_unt_total_score: number;
  institution_specific_threshold?: number;
  creative_exam_required: boolean;
  creative_exam_details_kz?: string;
  creative_exam_details_ru?: string;
  eligibility_rules_kz?: string;
  eligibility_rules_ru?: string;
  status: ContentStatus;
  source_id?: string;
}

export interface HistoricalGrantResult {
  id: string;
  academic_year: string;
  program_group_id: string;
  institution_id?: string;
  competition_type: string;
  cutoff_score: number;
  max_score: number;
  total_grants_allocated?: number;
  source_id?: string;
}

export interface Career {
  id: string;
  slug: string;
  title_kz: string;
  title_ru: string;
  direction_id?: string;
  direction?: Direction;
  description_kz: string;
  description_ru: string;
  daily_tasks_kz: string[];
  daily_tasks_ru: string[];
  skills_kz: string[];
  skills_ru: string[];
  profile_subjects_kz?: string;
  profile_subjects_ru?: string;
  employment_outlook_kz?: string;
  employment_outlook_ru?: string;
  status: ContentStatus;
  source_id?: string;
  source?: Source;
  related_program_groups?: EducationProgramGroup[];
  related_institutions?: InstitutionSummary[];
}

export interface Deadline {
  id: string;
  entity_type: string;
  entity_id: string;
  academic_year: string;
  title_kz: string;
  title_ru: string;
  start_date?: string;
  end_date: string;
  is_confirmed: boolean;
  source_id?: string;
}

export interface Grant {
  id: string;
  slug: string;
  title_kz: string;
  title_ru: string;
  provider_kz: string;
  provider_ru: string;
  grant_type: 'national' | 'akimat_astana' | 'rector' | 'corporate' | 'charitable' | 'international';
  location_scope: string;
  education_level: string;
  direction_id?: string;
  direction?: Direction;
  coverage_type: 'full_tuition' | 'partial_tuition' | 'monthly_stipend' | 'one_time_aid';
  coverage_details_kz: string;
  coverage_details_ru: string;
  eligibility_criteria_kz: string;
  eligibility_criteria_ru: string;
  required_documents_kz: string[];
  required_documents_ru: string[];
  selection_process_kz?: string;
  selection_process_ru?: string;
  application_url?: string;
  academic_year: string;
  status: ContentStatus;
  last_verified_at: string;
  next_review_at?: string;
  source_id?: string;
  source?: Source;
  deadlines?: Deadline[];
}

export interface Opportunity {
  id: string;
  slug: string;
  title_kz: string;
  title_ru: string;
  provider_kz: string;
  provider_ru: string;
  opportunity_type: 'course' | 'olympiad' | 'hackathon' | 'stem' | 'internship' | 'mobility' | 'mentorship';
  description_kz: string;
  description_ru: string;
  target_audience_kz: string;
  target_audience_ru: string;
  age_grade_restrictions?: string;
  cost_type: 'free' | 'stipend_paid' | 'subsidized';
  benefits_kz: string;
  benefits_ru: string;
  duration_kz?: string;
  duration_ru?: string;
  location_mode: 'in_person_astana' | 'online' | 'hybrid';
  application_url?: string;
  application_requirements_kz?: string;
  application_requirements_ru?: string;
  status: ContentStatus;
  last_verified_at: string;
  next_review_at?: string;
  source_id?: string;
  source?: Source;
  deadlines?: Deadline[];
}

export interface SearchResultItem {
  type: 'career' | 'institution' | 'program' | 'grant' | 'opportunity';
  id: string;
  slug: string;
  title_kz: string;
  title_ru: string;
  subtitle_kz: string;
  subtitle_ru: string;
  badge: string;
  url: string;
}

export interface SearchResponse {
  query: string;
  total: number;
  results: SearchResultItem[];
}

// StudentHub & ENT Calculator Types
export interface StudentHubProgramUni {
  uni_href: string;
  uni_slug: string;
  uni_name: string;
  city: string;
  score?: number | null;
  price?: string | null;
}

export interface StudentHubProgram {
  slug: string;
  url: string;
  title: string;
  pair: string;
  avg_score?: number | null;
  avg_price: string;
  description: string;
  universities_count: number;
  universities: StudentHubProgramUni[];
}

export interface StudentHubUniProgram {
  name: string;
  score?: number | null;
  pair: string;
  price?: string | null;
}

export interface StudentHubUniversity {
  slug: string;
  url: string;
  name: string;
  city: string;
  phone: string;
  programs_count: number;
  programs: StudentHubUniProgram[];
}

export interface StudentHubEntYear {
  competition: string;
  min_score?: number | null;
  avg_score?: number | null;
  max_score?: number | null;
  total_grants?: number | null;
}

export interface StudentHubEntResult {
  slug: string;
  url: string;
  title: string;
  history: StudentHubEntYear[];
}

export interface CalculatorMatch {
  program: StudentHubProgram;
  chance: 'high' | 'medium' | 'low' | 'reach';
  chance_label_kz: string;
  chance_label_ru: string;
  matching_unis: StudentHubProgramUni[];
  latest_min_score?: number | null;
  latest_avg_score?: number | null;
  total_grants?: number | null;
}

export interface CalculatorResponse {
  score: number;
  pair?: string;
  city?: string;
  total: number;
  matches: CalculatorMatch[];
}

