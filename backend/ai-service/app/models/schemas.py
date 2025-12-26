from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from enum import Enum

class TargetAudience(str, Enum):
    RECRUITER = "recruiter"
    PEER = "peer"
    ACADEMIC = "academic"
    CLIENT = "client"
    GENERAL = "general"

class ToneType(str, Enum):
    PROFESSIONAL = "professional"
    CASUAL = "casual"
    ACADEMIC = "academic"
    ENTHUSIASTIC = "enthusiastic"
    TECHNICAL = "technical"

class LengthType(str, Enum):
    SHORT = "short"  # 1-2 sentences
    MEDIUM = "medium"  # 3-4 sentences
    LONG = "long"  # 5+ sentences

class QueryType(str, Enum):
    PROJECT_TO_USERS = "project_to_users"
    USER_TO_PROJECTS = "user_to_projects"
    USER_TO_USERS = "user_to_users"
    PROJECT_TO_OPPORTUNITIES = "project_to_opportunities"

class ComplexityLevel(str, Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"
    EXPERT = "Expert"

# Request Models
class ProjectAnalysisRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=10, max_length=2000)
    technologies: List[str] = Field(..., min_items=1)
    category: Optional[str] = None
    repository_url: Optional[str] = None
    live_url: Optional[str] = None
    project_files: Optional[List[str]] = None

class StoryGenerationRequest(BaseModel):
    project_data: Dict[str, Any]
    target_audience: TargetAudience = TargetAudience.RECRUITER
    tone: ToneType = ToneType.PROFESSIONAL
    length: LengthType = LengthType.MEDIUM
    focus_areas: Optional[List[str]] = None

class MatchingRequest(BaseModel):
    query_type: QueryType
    query_data: Dict[str, Any]
    filters: Optional[Dict[str, Any]] = None
    limit: int = Field(default=10, ge=1, le=100)

class SkillAssessmentRequest(BaseModel):
    projects: List[Dict[str, Any]]
    technologies: List[str]
    experience_level: Optional[str] = None
    education_background: Optional[Dict[str, Any]] = None

# Response Models
class ProjectAnalysisResponse(BaseModel):
    innovation_score: int = Field(..., ge=0, le=100)
    complexity_level: ComplexityLevel
    skill_level: int = Field(..., ge=1, le=10)
    technical_depth: int = Field(..., ge=1, le=10)
    market_relevance: int = Field(..., ge=1, le=10)
    learning_outcomes: List[str]
    improvement_suggestions: List[str]
    key_strengths: List[str]
    technology_assessment: Dict[str, Any]
    professional_story: str
    tags: List[str]
    status: str

class StoryGenerationResponse(BaseModel):
    story: str
    key_points: List[str]
    call_to_action: str
    alternative_versions: Optional[List[str]] = None
    status: str

class MatchingResponse(BaseModel):
    matches: List[Dict[str, Any]]
    total_matches: int
    confidence_scores: List[float]
    matching_criteria: List[str]
    status: str

class SkillAssessmentResponse(BaseModel):
    skill_scores: Dict[str, float]
    overall_level: str
    strengths: List[str]
    growth_areas: List[str]
    recommended_skills: List[str]
    career_path_suggestions: List[str]
    status: str

# Internal Models
class TechnologySkill(BaseModel):
    name: str
    level: int = Field(..., ge=1, le=10)
    experience_years: Optional[float] = None
    projects_count: int = 0

class ProjectMetrics(BaseModel):
    lines_of_code: Optional[int] = None
    complexity_score: Optional[float] = None
    test_coverage: Optional[float] = None
    documentation_score: Optional[float] = None

class UserProfile(BaseModel):
    user_id: str
    skills: List[TechnologySkill]
    experience_level: str
    interests: List[str]
    career_goals: List[str]
    education: Optional[Dict[str, Any]] = None

class AnalysisCache(BaseModel):
    project_id: str
    analysis_data: Dict[str, Any]
    created_at: str
    expires_at: str


# ============================================
# Conversation / Chat Models
# ============================================

class UserRole(str, Enum):
    STUDENT = "student"
    RECRUITER = "recruiter"
    COMPANY = "company"
    INSTITUTION = "institution"
    UNIVERSITY = "university"


class ConversationMessageRequest(BaseModel):
    session_id: str = Field(..., description="Unique session identifier")
    message: str = Field(..., min_length=1, max_length=2000)
    user_role: UserRole = Field(default=UserRole.STUDENT)
    user_id: Optional[str] = None
    stream: bool = Field(default=False, description="Enable streaming response")


class ConversationMessageResponse(BaseModel):
    message: str
    intent: str
    confidence: float = 0.0
    entities: Dict[str, Any] = {}
    suggested_actions: List[Dict[str, str]] = []
    session_id: str
    status: str = "success"


class ConversationHistoryRequest(BaseModel):
    session_id: str


class ConversationHistoryResponse(BaseModel):
    session_id: str
    messages: List[Dict[str, Any]]
    user_role: str
    created_at: str
    status: str = "success"


class CandidateMatchingRequest(BaseModel):
    job_data: Dict[str, Any]
    candidates: List[Dict[str, Any]]
    limit: int = Field(default=10, ge=1, le=100)


class CandidateMatch(BaseModel):
    candidate_id: str
    job_id: str
    overall_score: float
    match_breakdown: Dict[str, float]
    strengths: List[str]
    gaps: List[str]
    recommendations: List[str]


class CandidateMatchingResponse(BaseModel):
    matches: List[Dict[str, Any]]
    status: str


class SkillsAssessmentRequest(BaseModel):
    projects: List[Dict[str, Any]]
    technologies: List[str]
    experience_level: Optional[str] = None
    education_background: Optional[Dict[str, Any]] = None


class SkillsAssessmentResponse(BaseModel):
    skill_scores: Dict[str, float]
    overall_level: str
    strengths: List[str]
    growth_areas: List[str]
    recommended_skills: List[str]
    career_path_suggestions: List[str]
    status: str


class MarketTrendsRequest(BaseModel):
    technologies: List[str] = []
    time_horizon: str = "month"
    industry_focus: Optional[str] = None


class MarketTrendsResponse(BaseModel):
    trends: List[Dict[str, Any]]
    market_summary: str
    hot_technologies: List[str]
    declining_technologies: List[str]
    recommendations: List[str]
    status: str


class ResumeSuggestionsRequest(BaseModel):
    resume_data: Dict[str, Any]
    target_role: str
    optimization_focus: Optional[str] = None
    target_company: Optional[str] = None


class ResumeSuggestionsResponse(BaseModel):
    optimized_sections: Dict[str, Any]
    suggestions: List[str]
    ats_score: float
    key_improvements: List[str]
    custom_summary: str
    status: str


class InterviewQuestionsRequest(BaseModel):
    job_data: Dict[str, Any]
    candidate_data: Dict[str, Any]
    question_count: int = Field(default=5, ge=1, le=20)


class InterviewQuestionsResponse(BaseModel):
    questions: List[Dict[str, Any]]
    status: str


class ProjectRecommendationsRequest(BaseModel):
    user_profile: Dict[str, Any]
    target_role: Optional[str] = None


class ProjectRecommendationsResponse(BaseModel):
    recommendations: List[Dict[str, Any]]
    status: str


class BatchProcessingRequest(BaseModel):
    operations: List[Dict[str, Any]]


class BatchProcessingResponse(BaseModel):
    results: List[Dict[str, Any]]
    status: str