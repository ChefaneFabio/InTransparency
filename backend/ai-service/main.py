#!/usr/bin/env python3
"""
InTransparency AI Service
Main FastAPI application for AI-powered features including:
- Project analysis and skills extraction
- Candidate-job matching
- Story generation
- Resume optimization
- Market trend analysis
"""

import os
import asyncio
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any
import uvicorn
from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
import redis
import json
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Import our AI models and services
from app.models.schemas import (
    ProjectAnalysisRequest,
    ProjectAnalysisResponse,
    StoryGenerationRequest,
    StoryGenerationResponse,
    CandidateMatchingRequest,
    CandidateMatchingResponse,
    SkillsAssessmentRequest,
    SkillsAssessmentResponse,
    ResumeSuggestionsRequest,
    ResumeSuggestionsResponse,
    MarketTrendsRequest,
    MarketTrendsResponse,
    InterviewQuestionsRequest,
    InterviewQuestionsResponse,
    ProjectRecommendationsRequest,
    ProjectRecommendationsResponse,
    BatchProcessingRequest,
    BatchProcessingResponse
)
from app.services.project_analyzer import ProjectAnalyzer
from app.services.candidate_matcher import CandidateMatcher
from app.services.story_generator import StoryGenerator
from app.services.skills_assessor import SkillsAssessor
from app.services.market_analyzer import MarketAnalyzer
from app.services.resume_optimizer import ResumeOptimizer
from app.utils.cache_manager import CacheManager
from app.utils.rate_limiter import RateLimiter

load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="InTransparency AI Service",
    description="AI-powered services for student-recruiter matching and portfolio analysis",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer(auto_error=False)

# Initialize services
project_analyzer = ProjectAnalyzer()
candidate_matcher = CandidateMatcher()
story_generator = StoryGenerator()
skills_assessor = SkillsAssessor()
market_analyzer = MarketAnalyzer()
resume_optimizer = ResumeOptimizer()
cache_manager = CacheManager()
rate_limiter = RateLimiter()

# Authentication dependency
async def get_api_key(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="API key required")
    
    expected_key = os.getenv("AI_SERVICE_API_KEY")
    if not expected_key or credentials.credentials != expected_key:
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    return credentials.credentials

# Mock user dependency for endpoints
async def get_current_user(api_key: str = Depends(get_api_key)):
    return {"api_key": api_key}

# Rate limiting dependency
async def check_rate_limit(request_type: str = "default", api_key: str = Depends(get_api_key)):
    if not await rate_limiter.check_limit(api_key, request_type):
        raise HTTPException(status_code=429, detail="Rate limit exceeded")
    return True

@app.get("/")
async def root():
    return {"message": "InTransparency AI Service", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "ai",
        "version": "1.0.0",
        "services": {
            "openai": "connected" if os.getenv("OPENAI_API_KEY") else "missing_key",
            "database": "connected"  # Add actual DB check
        }
    }

@app.post("/analyze-project", response_model=ProjectAnalysisResponse)
async def analyze_project(
    request: ProjectAnalysisRequest,
    user = Depends(get_current_user)
):
    """
    Analyze a project using AI to extract insights, assess complexity, and generate scores.
    """
    try:
        analysis = await project_analyzer.analyze_project(
            title=request.title,
            description=request.description,
            technologies=request.technologies,
            category=request.category,
            repository_url=request.repository_url,
            project_files=request.project_files
        )
        
        return ProjectAnalysisResponse(
            innovation_score=analysis["innovation_score"],
            complexity_level=analysis["complexity_level"],
            skill_level=analysis["skill_level"],
            technical_depth=analysis["technical_depth"],
            market_relevance=analysis["market_relevance"],
            learning_outcomes=analysis["learning_outcomes"],
            improvement_suggestions=analysis["improvement_suggestions"],
            key_strengths=analysis["key_strengths"],
            technology_assessment=analysis["technology_assessment"],
            professional_story=analysis["professional_story"],
            tags=analysis["tags"],
            status="success"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/generate-story", response_model=StoryGenerationResponse)
async def generate_story(
    request: StoryGenerationRequest,
    user = Depends(get_current_user)
):
    """
    Generate compelling professional stories from project data.
    """
    try:
        story = await story_generator.generate_story(
            project_data=request.project_data,
            target_audience=request.target_audience,
            tone=request.tone,
            length=request.length,
            focus_areas=request.focus_areas
        )
        
        return StoryGenerationResponse(
            story=story["story"],
            key_points=story["key_points"],
            call_to_action=story["call_to_action"],
            alternative_versions=story.get("alternative_versions", []),
            status="success"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Story generation failed: {str(e)}")

@app.post("/find-matches", response_model=CandidateMatchingResponse)
async def find_matches(
    request: CandidateMatchingRequest,
    user = Depends(get_current_user)
):
    """
    Find relevant matches for candidates and jobs.
    """
    try:
        matches = await candidate_matcher.find_candidate_matches(
            job_data=request.job_data,
            candidates=request.candidates,
            limit=request.limit
        )
        
        return CandidateMatchingResponse(
            matches=[{
                "candidate_id": m.candidate_id,
                "job_id": m.job_id,
                "overall_score": m.overall_score,
                "match_breakdown": m.match_breakdown,
                "strengths": m.strengths,
                "gaps": m.gaps,
                "recommendations": m.recommendations
            } for m in matches],
            status="success"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Matching failed: {str(e)}")

@app.post("/assess-skills", response_model=SkillsAssessmentResponse)
async def assess_skills(
    request: SkillsAssessmentRequest,
    user = Depends(get_current_user)
):
    """
    Assess user skills based on their projects and experience.
    """
    try:
        assessment = await skills_assessor.assess_skills(
            projects=request.projects,
            technologies=request.technologies,
            experience_level=request.experience_level,
            education_background=request.education_background
        )
        
        return SkillsAssessmentResponse(
            skill_scores=assessment["skill_scores"],
            overall_level=assessment["overall_level"],
            strengths=assessment["strengths"],
            growth_areas=assessment["growth_areas"],
            recommended_skills=assessment["recommended_skills"],
            career_path_suggestions=assessment["career_path_suggestions"],
            status="success"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Skill assessment failed: {str(e)}")

@app.post("/analyze-text")
async def analyze_text(
    text: str,
    analysis_type: str = "sentiment",
    user = Depends(get_current_user)
):
    """
    Analyze text for various metrics (sentiment, complexity, readability, etc.)
    """
    try:
        from app.services.text_analyzer import TextAnalyzer
        text_analyzer = TextAnalyzer()
        
        if analysis_type == "sentiment":
            result = await text_analyzer.analyze_sentiment(text)
        elif analysis_type == "complexity":
            result = await text_analyzer.analyze_complexity(text)
        elif analysis_type == "readability":
            result = await text_analyzer.analyze_readability(text)
        elif analysis_type == "keywords":
            result = await text_analyzer.extract_keywords(text)
        else:
            result = await text_analyzer.analyze_all(text)
            
        return {"analysis": result, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text analysis failed: {str(e)}")

@app.post("/process-file")
async def process_file(
    file: UploadFile = File(...),
    processing_type: str = "extract_text",
    user = Depends(get_current_user)
):
    """
    Process uploaded files (extract text, analyze code, etc.)
    """
    try:
        from app.services.file_processor import FileProcessor
        file_processor = FileProcessor()
        
        content = await file.read()
        
        if processing_type == "extract_text":
            result = await file_processor.extract_text(content, file.filename)
        elif processing_type == "analyze_code":
            result = await file_processor.analyze_code(content, file.filename)
        elif processing_type == "detect_language":
            result = await file_processor.detect_language(content)
        else:
            result = await file_processor.process_file(content, file.filename, processing_type)
            
        return {"result": result, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File processing failed: {str(e)}")

@app.post("/analyze-market", response_model=MarketTrendsResponse)
async def analyze_market(
    request: MarketTrendsRequest,
    user = Depends(get_current_user)
):
    """
    Analyze market trends for technologies and roles
    """
    try:
        analysis = await market_analyzer.analyze_market_trends(
            technologies=request.technologies,
            time_horizon=request.time_horizon,
            industry_focus=request.industry_focus
        )
        
        return MarketTrendsResponse(
            trends=analysis["trends"],
            market_summary=analysis["market_summary"],
            hot_technologies=analysis["hot_technologies"],
            declining_technologies=analysis["declining_technologies"],
            recommendations=analysis["recommendations"],
            status="success"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Market analysis failed: {str(e)}")

@app.post("/optimize-resume", response_model=ResumeSuggestionsResponse)
async def optimize_resume(
    request: ResumeSuggestionsRequest,
    user = Depends(get_current_user)
):
    """
    Optimize resume for target role and company
    """
    try:
        optimization = await resume_optimizer.optimize_resume(
            resume_data=request.resume_data,
            target_role=request.target_role,
            optimization_focus=request.optimization_focus,
            target_company=request.target_company
        )
        
        return ResumeSuggestionsResponse(
            optimized_sections=optimization["optimized_sections"],
            suggestions=optimization["suggestions"],
            ats_score=optimization["optimization_score"],
            key_improvements=optimization["next_steps"],
            custom_summary=optimization["custom_summary"],
            status="success"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume optimization failed: {str(e)}")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = "0.0.0.0"
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=os.getenv("ENVIRONMENT") == "development",
        workers=1 if os.getenv("ENVIRONMENT") == "development" else 4
    )