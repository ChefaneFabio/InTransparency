#!/usr/bin/env python3
"""
Skills Assessor Service
AI-powered skills assessment and career path recommendations
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any, Tuple
import openai
from dataclasses import dataclass
from enum import Enum
import json

logger = logging.getLogger(__name__)

class SkillCategory(Enum):
    TECHNICAL = "technical"
    SOFT_SKILLS = "soft_skills"
    TOOLS = "tools"
    FRAMEWORKS = "frameworks"
    LANGUAGES = "languages"
    DATABASES = "databases"
    CLOUD = "cloud"
    DEVOPS = "devops"

class ExperienceLevel(Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

@dataclass
class SkillAssessment:
    skill_name: str
    category: SkillCategory
    current_level: ExperienceLevel
    confidence_score: float
    evidence: List[str]
    improvement_suggestions: List[str]
    market_demand: float
    related_skills: List[str]

@dataclass
class CareerPath:
    title: str
    description: str
    required_skills: List[str]
    recommended_projects: List[str]
    timeline: str
    salary_range: Dict[str, int]
    growth_potential: float

class SkillsAssessor:
    def __init__(self):
        self.client = openai.AsyncOpenAI()
        
        # Skill categories and their typical technologies
        self.skill_categories = {
            SkillCategory.LANGUAGES: [
                "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", 
                "Rust", "Swift", "Kotlin", "PHP", "Ruby", "Scala", "R"
            ],
            SkillCategory.FRAMEWORKS: [
                "React", "Angular", "Vue.js", "Django", "Flask", "FastAPI", 
                "Spring Boot", "Express.js", "Next.js", "Svelte", "Laravel"
            ],
            SkillCategory.DATABASES: [
                "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", 
                "SQLite", "Oracle", "Cassandra", "DynamoDB"
            ],
            SkillCategory.CLOUD: [
                "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", 
                "Terraform", "CloudFormation", "Serverless"
            ],
            SkillCategory.DEVOPS: [
                "CI/CD", "Jenkins", "GitHub Actions", "Docker", "Kubernetes", 
                "Monitoring", "Logging", "Infrastructure as Code"
            ],
            SkillCategory.TOOLS: [
                "Git", "VS Code", "IntelliJ", "Figma", "Postman", "Jira", 
                "Slack", "Notion", "Linux", "Shell Scripting"
            ]
        }

    async def assess_skills(
        self,
        projects: List[Dict[str, Any]],
        technologies: List[str],
        experience_level: str = "intermediate",
        education_background: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Comprehensive skills assessment based on projects and experience"""
        try:
            # Extract skills from projects
            project_skills = await self._extract_skills_from_projects(projects)
            
            # Combine with declared technologies
            all_skills = list(set(technologies + project_skills))
            
            # Assess each skill
            skill_assessments = []
            for skill in all_skills:
                assessment = await self._assess_individual_skill(
                    skill, projects, experience_level
                )
                skill_assessments.append(assessment)
            
            # Calculate overall level
            overall_level = await self._calculate_overall_level(skill_assessments, experience_level)
            
            # Identify strengths and growth areas
            strengths = self._identify_strengths(skill_assessments)
            growth_areas = self._identify_growth_areas(skill_assessments)
            
            # Recommend new skills
            recommended_skills = await self._recommend_skills(skill_assessments, projects)
            
            # Generate career path suggestions
            career_paths = await self._suggest_career_paths(skill_assessments, experience_level)
            
            # Compile skill scores
            skill_scores = {
                assessment.skill_name: {
                    "level": assessment.current_level.value,
                    "confidence": assessment.confidence_score,
                    "category": assessment.category.value,
                    "market_demand": assessment.market_demand,
                    "evidence": assessment.evidence
                }
                for assessment in skill_assessments
            }
            
            return {
                "skill_scores": skill_scores,
                "overall_level": overall_level,
                "strengths": strengths,
                "growth_areas": growth_areas,
                "recommended_skills": recommended_skills,
                "career_path_suggestions": career_paths,
                "assessment_summary": await self._generate_assessment_summary(skill_assessments)
            }
            
        except Exception as e:
            logger.error(f"Skills assessment failed: {str(e)}")
            raise

    async def _extract_skills_from_projects(self, projects: List[Dict[str, Any]]) -> List[str]:
        """Extract skills mentioned in project descriptions and technologies"""
        skills = set()
        
        for project in projects:
            # Add explicit technologies
            project_technologies = project.get('technologies', [])
            skills.update(project_technologies)
            
            # Extract skills from descriptions using AI
            description = project.get('description', '')
            if description:
                extracted = await self._extract_skills_from_text(description)
                skills.update(extracted)
        
        return list(skills)

    async def _extract_skills_from_text(self, text: str) -> List[str]:
        """Use AI to extract technical skills from text"""
        if not text or len(text) < 50:
            return []
        
        try:
            prompt = f"""
            Extract technical skills, programming languages, frameworks, tools, and technologies mentioned in this text:
            
            Text: {text}
            
            Return only a JSON list of skills/technologies found. Include:
            - Programming languages
            - Frameworks and libraries
            - Databases
            - Cloud platforms
            - Tools and software
            - Technical concepts
            
            Format: ["skill1", "skill2", "skill3"]
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=200,
                temperature=0.1
            )
            
            skills_text = response.choices[0].message.content.strip()
            try:
                skills = json.loads(skills_text)
                return skills if isinstance(skills, list) else []
            except json.JSONDecodeError:
                return []
                
        except Exception as e:
            logger.error(f"Skill extraction failed: {str(e)}")
            return []

    async def _assess_individual_skill(
        self,
        skill: str,
        projects: List[Dict[str, Any]],
        base_experience: str
    ) -> SkillAssessment:
        """Assess proficiency level for a specific skill"""
        
        # Categorize the skill
        category = self._categorize_skill(skill)
        
        # Find evidence in projects
        evidence = self._find_skill_evidence(skill, projects)
        
        # Assess level based on evidence and context
        level = await self._assess_skill_level(skill, evidence, projects, base_experience)
        
        # Calculate confidence score
        confidence = self._calculate_confidence(evidence, projects)
        
        # Get market demand
        market_demand = await self._get_market_demand(skill)
        
        # Generate improvement suggestions
        suggestions = await self._generate_skill_suggestions(skill, level, evidence)
        
        # Find related skills
        related_skills = await self._find_related_skills(skill)
        
        return SkillAssessment(
            skill_name=skill,
            category=category,
            current_level=level,
            confidence_score=confidence,
            evidence=evidence,
            improvement_suggestions=suggestions,
            market_demand=market_demand,
            related_skills=related_skills
        )

    def _categorize_skill(self, skill: str) -> SkillCategory:
        """Categorize a skill into the appropriate category"""
        skill_lower = skill.lower()
        
        for category, skills in self.skill_categories.items():
            if any(s.lower() in skill_lower or skill_lower in s.lower() for s in skills):
                return category
        
        # Default categorization
        if any(lang in skill_lower for lang in ['python', 'javascript', 'java', 'cpp', 'csharp']):
            return SkillCategory.LANGUAGES
        elif any(fw in skill_lower for fw in ['react', 'angular', 'django', 'spring']):
            return SkillCategory.FRAMEWORKS
        elif any(db in skill_lower for db in ['sql', 'database', 'mongo', 'redis']):
            return SkillCategory.DATABASES
        elif any(cloud in skill_lower for cloud in ['aws', 'azure', 'cloud', 'docker']):
            return SkillCategory.CLOUD
        else:
            return SkillCategory.TECHNICAL

    def _find_skill_evidence(self, skill: str, projects: List[Dict[str, Any]]) -> List[str]:
        """Find evidence of skill usage in projects"""
        evidence = []
        skill_lower = skill.lower()
        
        for project in projects:
            project_title = project.get('title', '').lower()
            project_desc = project.get('description', '').lower()
            project_techs = [t.lower() for t in project.get('technologies', [])]
            
            if (skill_lower in project_title or 
                skill_lower in project_desc or 
                any(skill_lower in tech for tech in project_techs)):
                
                evidence.append(f"Used in '{project.get('title', 'project')}': {project.get('description', '')[:100]}...")
        
        return evidence

    async def _assess_skill_level(
        self,
        skill: str,
        evidence: List[str],
        projects: List[Dict[str, Any]],
        base_experience: str
    ) -> ExperienceLevel:
        """Assess the proficiency level for a skill"""
        
        if not evidence:
            return ExperienceLevel.BEGINNER
        
        try:
            evidence_text = "\n".join(evidence[:3])  # Limit to top 3 pieces of evidence
            
            prompt = f"""
            Assess the proficiency level for {skill} based on this evidence:
            
            Evidence:
            {evidence_text}
            
            Base Experience Level: {base_experience}
            Number of projects using this skill: {len(evidence)}
            
            Determine proficiency level:
            - beginner: Basic usage, simple implementations
            - intermediate: Solid understanding, multiple projects, some complexity
            - advanced: Deep knowledge, complex implementations, best practices
            - expert: Mastery, innovative usage, mentoring others
            
            Return only the level: beginner, intermediate, advanced, or expert
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=50,
                temperature=0.1
            )
            
            level_text = response.choices[0].message.content.strip().lower()
            
            if "expert" in level_text:
                return ExperienceLevel.EXPERT
            elif "advanced" in level_text:
                return ExperienceLevel.ADVANCED
            elif "intermediate" in level_text:
                return ExperienceLevel.INTERMEDIATE
            else:
                return ExperienceLevel.BEGINNER
                
        except Exception as e:
            logger.error(f"Skill level assessment failed: {str(e)}")
            # Fallback based on evidence count
            if len(evidence) >= 4:
                return ExperienceLevel.ADVANCED
            elif len(evidence) >= 2:
                return ExperienceLevel.INTERMEDIATE
            else:
                return ExperienceLevel.BEGINNER

    def _calculate_confidence(self, evidence: List[str], projects: List[Dict[str, Any]]) -> float:
        """Calculate confidence score for skill assessment"""
        if not evidence:
            return 0.1
        
        # Base confidence on amount of evidence
        evidence_score = min(len(evidence) / 5, 1.0)  # Max at 5 pieces of evidence
        
        # Adjust based on project complexity
        complexity_bonus = 0.0
        for project in projects:
            if project.get('complexity_level') == 'advanced':
                complexity_bonus += 0.1
            elif project.get('complexity_level') == 'expert':
                complexity_bonus += 0.2
        
        return min(evidence_score + complexity_bonus, 1.0)

    async def _get_market_demand(self, skill: str) -> float:
        """Estimate market demand for a skill"""
        # This would ideally connect to job market APIs
        # For now, use AI to estimate based on general knowledge
        
        try:
            prompt = f"""
            Rate the current market demand for {skill} in the tech industry on a scale of 0.0 to 1.0.
            
            Consider:
            - Job posting frequency
            - Industry adoption
            - Future growth potential
            - Salary premiums
            
            Return only the numerical score (0.0 to 1.0).
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
            logger.error(f"Market demand assessment failed: {str(e)}")
            return 0.7  # Default moderate demand

    async def _generate_skill_suggestions(
        self,
        skill: str,
        level: ExperienceLevel,
        evidence: List[str]
    ) -> List[str]:
        """Generate suggestions for improving the skill"""
        
        try:
            prompt = f"""
            Generate 3-4 specific suggestions for improving {skill} skills from {level.value} level.
            
            Current evidence of usage:
            {evidence[:2] if evidence else 'Limited evidence'}
            
            Provide actionable suggestions like:
            - Specific projects to build
            - Technologies to learn alongside
            - Best practices to study
            - Resources or certifications
            
            Format as a simple list.
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=200,
                temperature=0.6
            )
            
            suggestions_text = response.choices[0].message.content.strip()
            return [s.strip("- ").strip() for s in suggestions_text.split("\n") if s.strip()]
            
        except Exception as e:
            logger.error(f"Skill suggestions generation failed: {str(e)}")
            return [f"Practice {skill} in more complex projects", f"Study {skill} best practices"]

    async def _find_related_skills(self, skill: str) -> List[str]:
        """Find skills commonly used with this skill"""
        
        try:
            prompt = f"""
            List 4-5 technical skills commonly used together with {skill}.
            
            Focus on:
            - Complementary technologies
            - Common tech stacks
            - Supporting tools
            
            Return as a simple comma-separated list.
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=100,
                temperature=0.5
            )
            
            related_text = response.choices[0].message.content.strip()
            return [s.strip() for s in related_text.split(",")]
            
        except Exception as e:
            logger.error(f"Related skills finding failed: {str(e)}")
            return []

    async def _calculate_overall_level(
        self,
        assessments: List[SkillAssessment],
        base_experience: str
    ) -> str:
        """Calculate overall skill level"""
        
        if not assessments:
            return base_experience
        
        # Weight levels numerically
        level_weights = {
            ExperienceLevel.BEGINNER: 1,
            ExperienceLevel.INTERMEDIATE: 2,
            ExperienceLevel.ADVANCED: 3,
            ExperienceLevel.EXPERT: 4
        }
        
        # Calculate weighted average
        total_weight = sum(
            level_weights[assessment.current_level] * assessment.confidence_score
            for assessment in assessments
        )
        total_confidence = sum(assessment.confidence_score for assessment in assessments)
        
        if total_confidence == 0:
            return base_experience
        
        avg_level = total_weight / total_confidence
        
        if avg_level >= 3.5:
            return "expert"
        elif avg_level >= 2.5:
            return "advanced"
        elif avg_level >= 1.5:
            return "intermediate"
        else:
            return "beginner"

    def _identify_strengths(self, assessments: List[SkillAssessment]) -> List[str]:
        """Identify top skill strengths"""
        # Sort by level and confidence
        sorted_assessments = sorted(
            assessments,
            key=lambda x: (x.current_level.value, x.confidence_score),
            reverse=True
        )
        
        strengths = []
        for assessment in sorted_assessments[:5]:  # Top 5
            if assessment.current_level in [ExperienceLevel.ADVANCED, ExperienceLevel.EXPERT]:
                strengths.append(f"Strong {assessment.skill_name} skills ({assessment.current_level.value})")
        
        return strengths

    def _identify_growth_areas(self, assessments: List[SkillAssessment]) -> List[str]:
        """Identify areas for skill growth"""
        growth_areas = []
        
        # Find high-demand skills at beginner level
        for assessment in assessments:
            if (assessment.current_level == ExperienceLevel.BEGINNER and 
                assessment.market_demand > 0.7):
                growth_areas.append(f"{assessment.skill_name} (high market demand)")
        
        # Find skills with low confidence
        for assessment in assessments:
            if assessment.confidence_score < 0.5:
                growth_areas.append(f"{assessment.skill_name} (needs more practice)")
        
        return growth_areas[:5]  # Top 5

    async def _recommend_skills(
        self,
        assessments: List[SkillAssessment],
        projects: List[Dict[str, Any]]
    ) -> List[str]:
        """Recommend new skills to learn"""
        
        current_skills = [a.skill_name for a in assessments]
        skill_text = ", ".join(current_skills)
        
        try:
            prompt = f"""
            Based on these current skills: {skill_text}
            
            Recommend 5 complementary skills to learn that would:
            - Enhance current capabilities
            - Have high market demand
            - Create valuable skill combinations
            - Support career growth
            
            Consider modern tech trends and job market demands.
            Return as a simple comma-separated list.
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=150,
                temperature=0.6
            )
            
            recommendations_text = response.choices[0].message.content.strip()
            return [s.strip() for s in recommendations_text.split(",")]
            
        except Exception as e:
            logger.error(f"Skill recommendation failed: {str(e)}")
            return ["Cloud Computing", "Machine Learning", "DevOps", "Mobile Development", "Cybersecurity"]

    async def _suggest_career_paths(
        self,
        assessments: List[SkillAssessment],
        experience_level: str
    ) -> List[Dict[str, Any]]:
        """Suggest potential career paths based on skills"""
        
        skills_by_category = {}
        for assessment in assessments:
            category = assessment.category.value
            if category not in skills_by_category:
                skills_by_category[category] = []
            skills_by_category[category].append(assessment.skill_name)
        
        try:
            skills_summary = ", ".join([
                f"{cat}: {', '.join(skills[:3])}" 
                for cat, skills in skills_by_category.items()
            ])
            
            prompt = f"""
            Based on these skills: {skills_summary}
            Experience level: {experience_level}
            
            Suggest 3-4 career paths with:
            - Job title
            - Brief description
            - Key skills needed
            - Growth potential
            
            Format as JSON list with objects containing: title, description, required_skills, growth_potential
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=400,
                temperature=0.6
            )
            
            career_text = response.choices[0].message.content.strip()
            try:
                return json.loads(career_text)
            except json.JSONDecodeError:
                return self._default_career_paths(experience_level)
                
        except Exception as e:
            logger.error(f"Career path suggestion failed: {str(e)}")
            return self._default_career_paths(experience_level)

    def _default_career_paths(self, experience_level: str) -> List[Dict[str, Any]]:
        """Default career path suggestions"""
        return [
            {
                "title": "Full Stack Developer",
                "description": "Build end-to-end web applications",
                "required_skills": ["Frontend", "Backend", "Database"],
                "growth_potential": 0.8
            },
            {
                "title": "DevOps Engineer",
                "description": "Manage infrastructure and deployment pipelines",
                "required_skills": ["Cloud", "CI/CD", "Containers"],
                "growth_potential": 0.9
            },
            {
                "title": "Data Engineer",
                "description": "Build data pipelines and analytics systems",
                "required_skills": ["Python", "SQL", "Big Data"],
                "growth_potential": 0.85
            }
        ]

    async def _generate_assessment_summary(self, assessments: List[SkillAssessment]) -> str:
        """Generate overall assessment summary"""
        
        try:
            skills_overview = []
            for assessment in assessments[:10]:  # Top 10 skills
                skills_overview.append(f"{assessment.skill_name} ({assessment.current_level.value})")
            
            prompt = f"""
            Write a brief professional summary of this skills assessment:
            
            Skills: {', '.join(skills_overview)}
            
            Highlight:
            - Overall technical profile
            - Key strengths
            - Professional level
            - Market readiness
            
            Keep it to 2-3 sentences, professional tone.
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=150,
                temperature=0.6
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"Assessment summary generation failed: {str(e)}")
            return "Comprehensive technical skills across multiple domains with strong foundation for professional growth."