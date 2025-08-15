#!/usr/bin/env python3
"""
Resume Optimizer Service
AI-powered resume optimization and enhancement
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any, Tuple
import openai
from dataclasses import dataclass
from enum import Enum
import json
import re

logger = logging.getLogger(__name__)

class OptimizationFocus(Enum):
    TECHNICAL_SKILLS = "technical_skills"
    LEADERSHIP = "leadership"
    ACHIEVEMENTS = "achievements"
    ATS_OPTIMIZATION = "ats_optimization"
    CAREER_CHANGE = "career_change"
    ENTRY_LEVEL = "entry_level"
    SENIOR_LEVEL = "senior_level"

class ResumeSection(Enum):
    SUMMARY = "summary"
    EXPERIENCE = "experience"
    SKILLS = "skills"
    EDUCATION = "education"
    PROJECTS = "projects"
    ACHIEVEMENTS = "achievements"

@dataclass
class OptimizationSuggestion:
    section: ResumeSection
    priority: str  # high, medium, low
    suggestion_type: str  # add, modify, remove, restructure
    current_content: str
    suggested_content: str
    reasoning: str
    impact_score: float

@dataclass
class ResumeAnalysis:
    overall_score: float
    ats_compatibility: float
    keyword_density: Dict[str, float]
    suggestions: List[OptimizationSuggestion]
    strengths: List[str]
    weaknesses: List[str]
    missing_elements: List[str]

class ResumeOptimizer:
    def __init__(self):
        self.client = openai.AsyncOpenAI()
        
        # Common ATS keywords by category
        self.ats_keywords = {
            "technical": [
                "developed", "implemented", "designed", "optimized", "automated",
                "integrated", "deployed", "maintained", "debugged", "tested"
            ],
            "leadership": [
                "led", "managed", "coordinated", "supervised", "mentored",
                "guided", "directed", "facilitated", "collaborated"
            ],
            "achievements": [
                "improved", "increased", "reduced", "saved", "generated",
                "delivered", "achieved", "exceeded", "streamlined"
            ],
            "impact": [
                "revenue", "efficiency", "performance", "productivity", "costs",
                "time", "quality", "user experience", "customer satisfaction"
            ]
        }

    async def optimize_resume(
        self,
        resume_data: Dict[str, Any],
        target_role: str,
        optimization_focus: str = "technical_skills",
        target_company: Optional[str] = None
    ) -> Dict[str, Any]:
        """Comprehensive resume optimization"""
        try:
            focus_enum = OptimizationFocus(optimization_focus)
            
            # Analyze current resume
            analysis = await self._analyze_resume(resume_data, target_role)
            
            # Generate optimization suggestions
            suggestions = await self._generate_optimization_suggestions(
                resume_data, target_role, focus_enum, target_company
            )
            
            # Optimize specific sections
            optimized_sections = {}
            for section in ResumeSection:
                if section.value in resume_data:
                    optimized_sections[section.value] = await self._optimize_section(
                        section, resume_data[section.value], target_role, suggestions
                    )
            
            # Generate ATS-optimized version
            ats_optimized = await self._generate_ats_version(resume_data, target_role)
            
            # Create achievement-focused bullets
            achievement_bullets = await self._create_achievement_bullets(
                resume_data.get('experience', []), target_role
            )
            
            # Generate custom summary
            custom_summary = await self._generate_custom_summary(
                resume_data, target_role, target_company
            )
            
            return {
                "analysis": self._analysis_to_dict(analysis),
                "suggestions": [self._suggestion_to_dict(s) for s in suggestions],
                "optimized_sections": optimized_sections,
                "ats_optimized_resume": ats_optimized,
                "achievement_bullets": achievement_bullets,
                "custom_summary": custom_summary,
                "optimization_score": await self._calculate_optimization_score(suggestions),
                "next_steps": await self._generate_next_steps(suggestions)
            }
            
        except Exception as e:
            logger.error(f"Resume optimization failed: {str(e)}")
            raise

    async def _analyze_resume(
        self,
        resume_data: Dict[str, Any],
        target_role: str
    ) -> ResumeAnalysis:
        """Analyze resume and identify areas for improvement"""
        
        # Calculate ATS compatibility
        ats_score = self._calculate_ats_compatibility(resume_data)
        
        # Analyze keyword density
        keyword_density = await self._analyze_keyword_density(resume_data, target_role)
        
        # Identify strengths and weaknesses
        strengths = await self._identify_strengths(resume_data)
        weaknesses = await self._identify_weaknesses(resume_data, target_role)
        missing_elements = await self._identify_missing_elements(resume_data, target_role)
        
        # Calculate overall score
        overall_score = await self._calculate_overall_score(
            resume_data, target_role, ats_score, keyword_density
        )
        
        return ResumeAnalysis(
            overall_score=overall_score,
            ats_compatibility=ats_score,
            keyword_density=keyword_density,
            suggestions=[],  # Will be populated later
            strengths=strengths,
            weaknesses=weaknesses,
            missing_elements=missing_elements
        )

    def _calculate_ats_compatibility(self, resume_data: Dict[str, Any]) -> float:
        """Calculate ATS compatibility score"""
        score = 0.0
        checks = 0
        
        # Check for standard sections
        required_sections = ['summary', 'experience', 'skills', 'education']
        for section in required_sections:
            checks += 1
            if section in resume_data and resume_data[section]:
                score += 0.2
        
        # Check for quantified achievements
        experience = resume_data.get('experience', [])
        if experience:
            checks += 1
            quantified_count = sum(
                1 for exp in experience
                for bullet in exp.get('bullets', [])
                if any(char.isdigit() for char in bullet)
            )
            if quantified_count > 0:
                score += 0.2
        
        return score / checks if checks > 0 else 0.0

    async def _analyze_keyword_density(
        self,
        resume_data: Dict[str, Any],
        target_role: str
    ) -> Dict[str, float]:
        """Analyze keyword density for target role"""
        
        try:
            # Extract all text from resume
            resume_text = self._extract_resume_text(resume_data)
            
            prompt = f"""
            Analyze keyword density in this resume for a {target_role} position.
            
            Resume text: {resume_text[:2000]}
            
            Return the density (0.0-1.0) for these categories:
            - technical_skills
            - leadership_skills
            - achievements
            - industry_keywords
            - soft_skills
            
            Format as JSON: {{"category": density_score}}
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=200,
                temperature=0.1
            )
            
            return json.loads(response.choices[0].message.content.strip())
            
        except Exception as e:
            logger.error(f"Keyword density analysis failed: {str(e)}")
            return {
                "technical_skills": 0.6,
                "leadership_skills": 0.4,
                "achievements": 0.5,
                "industry_keywords": 0.5,
                "soft_skills": 0.3
            }

    def _extract_resume_text(self, resume_data: Dict[str, Any]) -> str:
        """Extract all text content from resume data"""
        text_parts = []
        
        # Add summary
        if 'summary' in resume_data:
            text_parts.append(resume_data['summary'])
        
        # Add experience
        if 'experience' in resume_data:
            for exp in resume_data['experience']:
                text_parts.append(exp.get('title', ''))
                text_parts.append(exp.get('company', ''))
                text_parts.append(exp.get('description', ''))
                if 'bullets' in exp:
                    text_parts.extend(exp['bullets'])
        
        # Add skills
        if 'skills' in resume_data:
            if isinstance(resume_data['skills'], list):
                text_parts.extend(resume_data['skills'])
            elif isinstance(resume_data['skills'], dict):
                for category, skills in resume_data['skills'].items():
                    if isinstance(skills, list):
                        text_parts.extend(skills)
        
        # Add projects
        if 'projects' in resume_data:
            for project in resume_data['projects']:
                text_parts.append(project.get('title', ''))
                text_parts.append(project.get('description', ''))
        
        return ' '.join(text_parts)

    async def _identify_strengths(self, resume_data: Dict[str, Any]) -> List[str]:
        """Identify resume strengths"""
        
        try:
            resume_text = self._extract_resume_text(resume_data)
            
            prompt = f"""
            Identify the top 4-5 strengths in this resume:
            
            {resume_text[:1500]}
            
            Look for:
            - Strong technical skills
            - Quantified achievements
            - Leadership experience
            - Diverse experience
            - Clear progression
            - Industry relevance
            
            Return as a simple list, one strength per line.
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=200,
                temperature=0.5
            )
            
            strengths_text = response.choices[0].message.content.strip()
            return [s.strip("- ").strip() for s in strengths_text.split("\n") if s.strip()]
            
        except Exception as e:
            logger.error(f"Strengths identification failed: {str(e)}")
            return ["Technical skills demonstrated", "Professional experience", "Educational background"]

    async def _identify_weaknesses(
        self,
        resume_data: Dict[str, Any],
        target_role: str
    ) -> List[str]:
        """Identify areas for improvement"""
        
        try:
            resume_text = self._extract_resume_text(resume_data)
            
            prompt = f"""
            Identify weaknesses or areas for improvement in this resume for a {target_role} position:
            
            {resume_text[:1500]}
            
            Look for:
            - Missing quantified results
            - Lack of relevant keywords
            - Weak action verbs
            - Missing skills
            - Poor formatting indicators
            - Unclear career progression
            
            Return as a simple list, one weakness per line.
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=200,
                temperature=0.5
            )
            
            weaknesses_text = response.choices[0].message.content.strip()
            return [w.strip("- ").strip() for w in weaknesses_text.split("\n") if w.strip()]
            
        except Exception as e:
            logger.error(f"Weaknesses identification failed: {str(e)}")
            return ["Could benefit from more quantified achievements", "Technical skills could be expanded"]

    async def _identify_missing_elements(
        self,
        resume_data: Dict[str, Any],
        target_role: str
    ) -> List[str]:
        """Identify missing resume elements"""
        
        missing = []
        
        # Check for standard sections
        if 'summary' not in resume_data or not resume_data['summary']:
            missing.append("Professional summary")
        
        if 'skills' not in resume_data or not resume_data['skills']:
            missing.append("Technical skills section")
        
        if 'projects' not in resume_data or not resume_data['projects']:
            missing.append("Projects section")
        
        # Check for quantified achievements
        experience = resume_data.get('experience', [])
        has_quantified = any(
            any(re.search(r'\d+', bullet) for bullet in exp.get('bullets', []))
            for exp in experience
        )
        if not has_quantified:
            missing.append("Quantified achievements")
        
        # Check for relevant keywords using AI
        try:
            resume_text = self._extract_resume_text(resume_data)
            
            prompt = f"""
            What key elements are missing from this resume for a {target_role} position?
            
            Resume: {resume_text[:1000]}
            
            Consider missing:
            - Industry-specific keywords
            - Technical certifications
            - Relevant experience types
            - Project examples
            - Measurable outcomes
            
            Return 2-3 most important missing elements, one per line.
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=150,
                temperature=0.5
            )
            
            ai_missing = [m.strip("- ").strip() for m in response.choices[0].message.content.strip().split("\n") if m.strip()]
            missing.extend(ai_missing)
            
        except Exception as e:
            logger.error(f"AI missing elements identification failed: {str(e)}")
        
        return missing

    async def _generate_optimization_suggestions(
        self,
        resume_data: Dict[str, Any],
        target_role: str,
        focus: OptimizationFocus,
        target_company: Optional[str]
    ) -> List[OptimizationSuggestion]:
        """Generate specific optimization suggestions"""
        
        suggestions = []
        
        # Summary optimization
        if 'summary' in resume_data:
            summary_suggestion = await self._optimize_summary_suggestion(
                resume_data['summary'], target_role, target_company
            )
            suggestions.append(summary_suggestion)
        
        # Experience optimization
        if 'experience' in resume_data:
            for i, exp in enumerate(resume_data['experience']):
                exp_suggestion = await self._optimize_experience_suggestion(
                    exp, target_role, focus
                )
                suggestions.append(exp_suggestion)
        
        # Skills optimization
        if 'skills' in resume_data:
            skills_suggestion = await self._optimize_skills_suggestion(
                resume_data['skills'], target_role
            )
            suggestions.append(skills_suggestion)
        
        return suggestions

    async def _optimize_summary_suggestion(
        self,
        current_summary: str,
        target_role: str,
        target_company: Optional[str]
    ) -> OptimizationSuggestion:
        """Generate summary optimization suggestion"""
        
        company_context = f" at {target_company}" if target_company else ""
        
        try:
            prompt = f"""
            Optimize this professional summary for a {target_role} position{company_context}:
            
            Current: {current_summary}
            
            Create an improved version that:
            - Starts with years of experience or key expertise
            - Includes relevant keywords
            - Highlights measurable achievements
            - Matches the target role requirements
            - Is 3-4 sentences long
            
            Return only the optimized summary.
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=200,
                temperature=0.6
            )
            
            optimized_summary = response.choices[0].message.content.strip()
            
            return OptimizationSuggestion(
                section=ResumeSection.SUMMARY,
                priority="high",
                suggestion_type="modify",
                current_content=current_summary,
                suggested_content=optimized_summary,
                reasoning="Enhanced with role-specific keywords and quantified achievements",
                impact_score=0.8
            )
            
        except Exception as e:
            logger.error(f"Summary optimization failed: {str(e)}")
            return OptimizationSuggestion(
                section=ResumeSection.SUMMARY,
                priority="medium",
                suggestion_type="modify",
                current_content=current_summary,
                suggested_content="Consider adding more specific achievements and keywords",
                reasoning="Could benefit from more targeted language",
                impact_score=0.6
            )

    async def _optimize_experience_suggestion(
        self,
        experience: Dict[str, Any],
        target_role: str,
        focus: OptimizationFocus
    ) -> OptimizationSuggestion:
        """Generate experience optimization suggestion"""
        
        try:
            current_bullets = experience.get('bullets', [])
            bullets_text = "\n".join([f"- {bullet}" for bullet in current_bullets])
            
            focus_instruction = self._get_focus_instruction(focus)
            
            prompt = f"""
            Optimize these experience bullets for a {target_role} position with focus on {focus.value}:
            
            Current bullets:
            {bullets_text}
            
            {focus_instruction}
            
            Requirements:
            - Start with strong action verbs
            - Include quantified results where possible
            - Use relevant keywords
            - Show impact and value delivered
            - Keep each bullet to 1-2 lines
            
            Return optimized bullets, one per line, starting with "-".
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=300,
                temperature=0.6
            )
            
            optimized_bullets = response.choices[0].message.content.strip()
            
            return OptimizationSuggestion(
                section=ResumeSection.EXPERIENCE,
                priority="high",
                suggestion_type="modify",
                current_content=bullets_text,
                suggested_content=optimized_bullets,
                reasoning=f"Enhanced with {focus.value} focus and stronger action verbs",
                impact_score=0.9
            )
            
        except Exception as e:
            logger.error(f"Experience optimization failed: {str(e)}")
            return OptimizationSuggestion(
                section=ResumeSection.EXPERIENCE,
                priority="medium",
                suggestion_type="modify",
                current_content="Current experience",
                suggested_content="Consider adding more quantified achievements",
                reasoning="Could benefit from stronger impact statements",
                impact_score=0.7
            )

    def _get_focus_instruction(self, focus: OptimizationFocus) -> str:
        """Get specific instructions based on optimization focus"""
        
        instructions = {
            OptimizationFocus.TECHNICAL_SKILLS: "Emphasize technical competencies, programming languages, frameworks, and technical problem-solving.",
            OptimizationFocus.LEADERSHIP: "Highlight team leadership, project management, mentoring, and cross-functional collaboration.",
            OptimizationFocus.ACHIEVEMENTS: "Focus on quantified results, business impact, and measurable outcomes.",
            OptimizationFocus.ATS_OPTIMIZATION: "Use industry-standard keywords and phrases that ATS systems recognize.",
            OptimizationFocus.CAREER_CHANGE: "Emphasize transferable skills and relevant experience that applies to the new role.",
            OptimizationFocus.ENTRY_LEVEL: "Highlight projects, internships, coursework, and potential rather than extensive experience.",
            OptimizationFocus.SENIOR_LEVEL: "Emphasize strategic thinking, leadership impact, and high-level technical decisions."
        }
        
        return instructions.get(focus, "Focus on relevance to the target role and quantified achievements.")

    async def _optimize_skills_suggestion(
        self,
        current_skills: Any,
        target_role: str
    ) -> OptimizationSuggestion:
        """Generate skills section optimization"""
        
        try:
            skills_text = json.dumps(current_skills) if isinstance(current_skills, dict) else str(current_skills)
            
            prompt = f"""
            Optimize this skills section for a {target_role} position:
            
            Current: {skills_text}
            
            Provide:
            - Relevant technical skills
            - Industry-standard terminology
            - Proper categorization
            - Skills in order of relevance
            
            Format as categories with comma-separated skills:
            Programming Languages: skill1, skill2
            Frameworks: skill1, skill2
            Tools: skill1, skill2
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=250,
                temperature=0.5
            )
            
            optimized_skills = response.choices[0].message.content.strip()
            
            return OptimizationSuggestion(
                section=ResumeSection.SKILLS,
                priority="medium",
                suggestion_type="modify",
                current_content=skills_text,
                suggested_content=optimized_skills,
                reasoning="Reorganized with role-relevant skills and proper categorization",
                impact_score=0.7
            )
            
        except Exception as e:
            logger.error(f"Skills optimization failed: {str(e)}")
            return OptimizationSuggestion(
                section=ResumeSection.SKILLS,
                priority="low",
                suggestion_type="modify",
                current_content="Current skills",
                suggested_content="Consider reorganizing skills by relevance",
                reasoning="Skills section could be more targeted",
                impact_score=0.5
            )

    async def _calculate_optimization_score(self, suggestions: List[OptimizationSuggestion]) -> float:
        """Calculate overall optimization potential score"""
        
        if not suggestions:
            return 0.8  # Assume good starting point
        
        total_impact = sum(s.impact_score for s in suggestions)
        avg_impact = total_impact / len(suggestions)
        
        # Convert to optimization score (how much better it could be)
        return min(avg_impact, 1.0)

    async def _generate_next_steps(self, suggestions: List[OptimizationSuggestion]) -> List[str]:
        """Generate actionable next steps"""
        
        high_priority = [s for s in suggestions if s.priority == "high"]
        
        steps = []
        
        if high_priority:
            steps.append("Implement high-priority suggestions first")
        
        steps.extend([
            "Add quantified achievements to experience bullets",
            "Customize summary for each application",
            "Include relevant keywords from job postings",
            "Proofread for consistency and clarity"
        ])
        
        return steps[:5]  # Top 5 steps

    def _analysis_to_dict(self, analysis: ResumeAnalysis) -> Dict[str, Any]:
        """Convert ResumeAnalysis to dictionary"""
        return {
            "overall_score": analysis.overall_score,
            "ats_compatibility": analysis.ats_compatibility,
            "keyword_density": analysis.keyword_density,
            "strengths": analysis.strengths,
            "weaknesses": analysis.weaknesses,
            "missing_elements": analysis.missing_elements
        }

    def _suggestion_to_dict(self, suggestion: OptimizationSuggestion) -> Dict[str, Any]:
        """Convert OptimizationSuggestion to dictionary"""
        return {
            "section": suggestion.section.value,
            "priority": suggestion.priority,
            "suggestion_type": suggestion.suggestion_type,
            "current_content": suggestion.current_content,
            "suggested_content": suggestion.suggested_content,
            "reasoning": suggestion.reasoning,
            "impact_score": suggestion.impact_score
        }