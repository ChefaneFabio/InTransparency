#!/usr/bin/env python3
"""
Candidate Matcher Service
AI-powered matching between candidates and job opportunities
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any, Tuple
import openai
import numpy as np
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)

class MatchType(Enum):
    SKILLS = "skills"
    EXPERIENCE = "experience"
    EDUCATION = "education"
    LOCATION = "location"
    CULTURE = "culture"
    PROJECTS = "projects"

@dataclass
class MatchResult:
    candidate_id: str
    job_id: str
    overall_score: float
    match_breakdown: Dict[str, float]
    strengths: List[str]
    gaps: List[str]
    recommendations: List[str]

class CandidateMatcher:
    def __init__(self):
        self.client = openai.AsyncOpenAI()
        self.skill_weights = {
            MatchType.SKILLS: 0.30,
            MatchType.EXPERIENCE: 0.25,
            MatchType.EDUCATION: 0.15,
            MatchType.PROJECTS: 0.20,
            MatchType.LOCATION: 0.05,
            MatchType.CULTURE: 0.05
        }
    
    async def find_candidate_matches(
        self,
        job_data: Dict[str, Any],
        candidates: List[Dict[str, Any]],
        limit: int = 10,
        min_score: float = 0.5
    ) -> List[MatchResult]:
        """Find best candidate matches for a job position"""
        try:
            matches = []
            
            for candidate in candidates:
                match_result = await self._calculate_match_score(job_data, candidate)
                if match_result.overall_score >= min_score:
                    matches.append(match_result)
            
            # Sort by overall score descending
            matches.sort(key=lambda x: x.overall_score, reverse=True)
            return matches[:limit]
            
        except Exception as e:
            logger.error(f"Candidate matching failed: {str(e)}")
            raise

    async def find_job_matches(
        self,
        candidate_data: Dict[str, Any],
        jobs: List[Dict[str, Any]],
        limit: int = 10,
        min_score: float = 0.5
    ) -> List[MatchResult]:
        """Find best job matches for a candidate"""
        try:
            matches = []
            
            for job in jobs:
                match_result = await self._calculate_match_score(job, candidate_data)
                if match_result.overall_score >= min_score:
                    matches.append(match_result)
            
            # Sort by overall score descending
            matches.sort(key=lambda x: x.overall_score, reverse=True)
            return matches[:limit]
            
        except Exception as e:
            logger.error(f"Job matching failed: {str(e)}")
            raise

    async def _calculate_match_score(
        self,
        job_data: Dict[str, Any],
        candidate_data: Dict[str, Any]
    ) -> MatchResult:
        """Calculate comprehensive match score between job and candidate"""
        
        # Extract key information
        job_skills = job_data.get('required_skills', []) + job_data.get('preferred_skills', [])
        candidate_skills = candidate_data.get('skills', [])
        
        # Calculate individual match scores
        skills_score = await self._calculate_skills_match(job_skills, candidate_skills)
        experience_score = await self._calculate_experience_match(
            job_data.get('experience_requirements', {}),
            candidate_data.get('experience', {})
        )
        education_score = await self._calculate_education_match(
            job_data.get('education_requirements', {}),
            candidate_data.get('education', {})
        )
        projects_score = await self._calculate_projects_match(
            job_data.get('job_description', ''),
            candidate_data.get('projects', [])
        )
        location_score = self._calculate_location_match(
            job_data.get('location', {}),
            candidate_data.get('location', {})
        )
        culture_score = await self._calculate_culture_match(
            job_data.get('company_culture', ''),
            candidate_data.get('preferences', {})
        )
        
        # Calculate weighted overall score
        match_breakdown = {
            'skills': skills_score,
            'experience': experience_score,
            'education': education_score,
            'projects': projects_score,
            'location': location_score,
            'culture': culture_score
        }
        
        overall_score = sum(
            score * self.skill_weights[MatchType(key)]
            for key, score in match_breakdown.items()
        )
        
        # Generate insights
        strengths = await self._identify_strengths(match_breakdown, job_data, candidate_data)
        gaps = await self._identify_gaps(match_breakdown, job_data, candidate_data)
        recommendations = await self._generate_recommendations(gaps, candidate_data)
        
        return MatchResult(
            candidate_id=candidate_data.get('id', ''),
            job_id=job_data.get('id', ''),
            overall_score=overall_score,
            match_breakdown=match_breakdown,
            strengths=strengths,
            gaps=gaps,
            recommendations=recommendations
        )

    async def _calculate_skills_match(
        self,
        required_skills: List[str],
        candidate_skills: List[str]
    ) -> float:
        """Calculate skills match using AI similarity"""
        if not required_skills or not candidate_skills:
            return 0.0
        
        try:
            prompt = f"""
            Analyze the match between required skills and candidate skills:
            
            Required Skills: {', '.join(required_skills)}
            Candidate Skills: {', '.join(candidate_skills)}
            
            Return a score from 0.0 to 1.0 representing how well the candidate's skills match the requirements.
            Consider:
            - Direct skill matches
            - Related/transferable skills
            - Skill level and depth
            - Missing critical skills
            
            Return only the numerical score.
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=50,
                temperature=0.1
            )
            
            score_text = response.choices[0].message.content.strip()
            return float(score_text)
            
        except Exception as e:
            logger.error(f"Skills matching failed: {str(e)}")
            # Fallback to simple matching
            matches = len(set(required_skills) & set(candidate_skills))
            return min(matches / len(required_skills), 1.0)

    async def _calculate_experience_match(
        self,
        job_requirements: Dict[str, Any],
        candidate_experience: Dict[str, Any]
    ) -> float:
        """Calculate experience level match"""
        try:
            required_years = job_requirements.get('years', 0)
            candidate_years = candidate_experience.get('years', 0)
            required_level = job_requirements.get('level', 'entry')
            candidate_level = candidate_experience.get('level', 'entry')
            
            # Years experience scoring
            years_score = min(candidate_years / max(required_years, 1), 1.0)
            
            # Level matching
            level_hierarchy = {'entry': 1, 'junior': 2, 'mid': 3, 'senior': 4, 'lead': 5, 'executive': 6}
            required_level_num = level_hierarchy.get(required_level, 1)
            candidate_level_num = level_hierarchy.get(candidate_level, 1)
            level_score = min(candidate_level_num / required_level_num, 1.0)
            
            return (years_score + level_score) / 2
            
        except Exception as e:
            logger.error(f"Experience matching failed: {str(e)}")
            return 0.5

    async def _calculate_education_match(
        self,
        job_requirements: Dict[str, Any],
        candidate_education: Dict[str, Any]
    ) -> float:
        """Calculate education requirements match"""
        try:
            required_degree = job_requirements.get('degree_level', '')
            candidate_degree = candidate_education.get('degree_level', '')
            required_field = job_requirements.get('field_of_study', '')
            candidate_field = candidate_education.get('field_of_study', '')
            
            # Degree level scoring
            degree_hierarchy = {'certificate': 1, 'associates': 2, 'bachelors': 3, 'masters': 4, 'doctorate': 5}
            required_degree_num = degree_hierarchy.get(required_degree.lower(), 0)
            candidate_degree_num = degree_hierarchy.get(candidate_degree.lower(), 0)
            
            if required_degree_num == 0:
                degree_score = 1.0  # No specific requirement
            else:
                degree_score = min(candidate_degree_num / required_degree_num, 1.0)
            
            # Field of study matching
            if not required_field or not candidate_field:
                field_score = 0.8  # Neutral if not specified
            else:
                field_score = 1.0 if required_field.lower() in candidate_field.lower() else 0.5
            
            return (degree_score + field_score) / 2
            
        except Exception as e:
            logger.error(f"Education matching failed: {str(e)}")
            return 0.7

    async def _calculate_projects_match(
        self,
        job_description: str,
        candidate_projects: List[Dict[str, Any]]
    ) -> float:
        """Calculate relevance of candidate projects to job"""
        if not candidate_projects or not job_description:
            return 0.5
        
        try:
            projects_text = "\n".join([
                f"- {p.get('title', '')}: {p.get('description', '')}"
                for p in candidate_projects[:5]  # Limit to top 5 projects
            ])
            
            prompt = f"""
            Analyze how relevant these projects are to the job description:
            
            Job Description: {job_description[:1000]}
            
            Candidate Projects:
            {projects_text}
            
            Return a score from 0.0 to 1.0 representing project relevance.
            Consider:
            - Technology stack alignment
            - Problem-solving approach
            - Industry relevance
            - Complexity and scope
            
            Return only the numerical score.
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=50,
                temperature=0.1
            )
            
            score_text = response.choices[0].message.content.strip()
            return float(score_text)
            
        except Exception as e:
            logger.error(f"Projects matching failed: {str(e)}")
            return 0.5

    def _calculate_location_match(
        self,
        job_location: Dict[str, Any],
        candidate_location: Dict[str, Any]
    ) -> float:
        """Calculate location compatibility"""
        try:
            job_remote = job_location.get('remote', False)
            candidate_remote_preference = candidate_location.get('remote_preference', False)
            
            if job_remote or candidate_remote_preference:
                return 1.0
            
            job_city = job_location.get('city', '').lower()
            candidate_city = candidate_location.get('city', '').lower()
            job_state = job_location.get('state', '').lower()
            candidate_state = candidate_location.get('state', '').lower()
            
            if job_city == candidate_city and job_state == candidate_state:
                return 1.0
            elif job_state == candidate_state:
                return 0.7
            else:
                return 0.3
                
        except Exception as e:
            logger.error(f"Location matching failed: {str(e)}")
            return 0.5

    async def _calculate_culture_match(
        self,
        company_culture: str,
        candidate_preferences: Dict[str, Any]
    ) -> float:
        """Calculate culture fit using AI analysis"""
        if not company_culture:
            return 0.8
        
        try:
            preferences_text = ", ".join([
                f"{k}: {v}" for k, v in candidate_preferences.items()
                if k in ['work_style', 'company_size', 'industry_preference', 'values']
            ])
            
            if not preferences_text:
                return 0.8
            
            prompt = f"""
            Analyze culture fit between company and candidate:
            
            Company Culture: {company_culture}
            Candidate Preferences: {preferences_text}
            
            Return a score from 0.0 to 1.0 representing culture fit.
            Consider work style, values alignment, and environment preferences.
            
            Return only the numerical score.
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=50,
                temperature=0.1
            )
            
            score_text = response.choices[0].message.content.strip()
            return float(score_text)
            
        except Exception as e:
            logger.error(f"Culture matching failed: {str(e)}")
            return 0.8

    async def _identify_strengths(
        self,
        match_breakdown: Dict[str, float],
        job_data: Dict[str, Any],
        candidate_data: Dict[str, Any]
    ) -> List[str]:
        """Identify candidate's key strengths for this position"""
        strengths = []
        
        for category, score in match_breakdown.items():
            if score >= 0.8:
                if category == 'skills':
                    strengths.append("Strong technical skills alignment")
                elif category == 'experience':
                    strengths.append("Excellent experience match")
                elif category == 'education':
                    strengths.append("Strong educational background")
                elif category == 'projects':
                    strengths.append("Highly relevant project experience")
                elif category == 'location':
                    strengths.append("Ideal location compatibility")
                elif category == 'culture':
                    strengths.append("Excellent culture fit")
        
        return strengths

    async def _identify_gaps(
        self,
        match_breakdown: Dict[str, float],
        job_data: Dict[str, Any],
        candidate_data: Dict[str, Any]
    ) -> List[str]:
        """Identify areas where candidate may need development"""
        gaps = []
        
        for category, score in match_breakdown.items():
            if score < 0.6:
                if category == 'skills':
                    gaps.append("Some required technical skills missing")
                elif category == 'experience':
                    gaps.append("Limited relevant experience")
                elif category == 'education':
                    gaps.append("Educational background doesn't fully align")
                elif category == 'projects':
                    gaps.append("Projects lack direct relevance")
                elif category == 'location':
                    gaps.append("Location may present challenges")
                elif category == 'culture':
                    gaps.append("Culture fit needs assessment")
        
        return gaps

    async def _generate_recommendations(
        self,
        gaps: List[str],
        candidate_data: Dict[str, Any]
    ) -> List[str]:
        """Generate recommendations to improve candidacy"""
        recommendations = []
        
        if "Some required technical skills missing" in gaps:
            recommendations.append("Consider upskilling in required technologies")
        
        if "Limited relevant experience" in gaps:
            recommendations.append("Highlight transferable skills and achievements")
        
        if "Projects lack direct relevance" in gaps:
            recommendations.append("Develop projects that align with target role")
        
        if "Educational background doesn't fully align" in gaps:
            recommendations.append("Consider relevant certifications or courses")
        
        return recommendations