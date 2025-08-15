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