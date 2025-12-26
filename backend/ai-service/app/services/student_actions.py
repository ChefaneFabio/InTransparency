#!/usr/bin/env python3
"""
Student Action Handlers for Conversation Service
Handles student-specific intents by integrating with existing AI services.
"""

import os
import json
import logging
import httpx
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass

from app.services.skills_assessor import SkillsAssessor
from app.services.candidate_matcher import CandidateMatcher
from app.services.market_analyzer import MarketAnalyzer

logger = logging.getLogger(__name__)


@dataclass
class ActionResult:
    """Result from an action handler"""
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    suggested_actions: Optional[List[Dict[str, str]]] = None


class StudentActionHandler:
    """Handles student-specific conversation intents"""

    def __init__(self):
        self.skills_assessor = SkillsAssessor()
        self.candidate_matcher = CandidateMatcher()
        self.market_analyzer = MarketAnalyzer()
        self.backend_api_url = os.getenv("BACKEND_API_URL", "http://localhost:3001")
        self.api_key = os.getenv("AI_SERVICE_API_KEY", "")

    async def handle_job_search(
        self,
        entities: Dict[str, Any],
        user_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> ActionResult:
        """
        Handle job search intent.
        Extracts filters from entities and searches for matching jobs.
        """
        try:
            # Extract search parameters from entities
            location = entities.get('location')
            skills = entities.get('skills', [])
            job_type = entities.get('job_type')  # internship, full-time, etc.

            # Build search query
            search_params = {}
            if location:
                search_params['location'] = location
            if skills:
                search_params['skills'] = ','.join(skills) if isinstance(skills, list) else skills
            if job_type:
                search_params['type'] = job_type

            # Try to fetch jobs from backend API
            jobs = await self._fetch_jobs(search_params)

            if not jobs:
                # Return helpful message if no jobs found
                location_text = f" in {location}" if location else ""
                skills_text = f" matching {', '.join(skills)}" if skills else ""

                return ActionResult(
                    success=True,
                    message=f"I searched for jobs{location_text}{skills_text}, but didn't find exact matches right now.\n\n"
                           f"**Suggestions:**\n"
                           f"• Broaden your search criteria\n"
                           f"• Check back soon - new jobs are posted daily\n"
                           f"• Set up job alerts for your preferences\n\n"
                           f"Would you like me to help you set up job alerts or explore different criteria?",
                    data={"jobs_count": 0},
                    suggested_actions=[
                        {"label": "Set Job Alerts", "action": "set_alerts"},
                        {"label": "Broaden Search", "action": "broaden_search"},
                        {"label": "View All Jobs", "action": "view_all_jobs"}
                    ]
                )

            # Format job results
            job_summaries = []
            for i, job in enumerate(jobs[:5]):  # Top 5 jobs
                match_score = job.get('match_score', 85 + i)  # Placeholder if no score
                job_summaries.append(
                    f"**{job.get('title', 'Position')}** at {job.get('company', 'Company')}\n"
                    f"   📍 {job.get('location', 'Location TBD')} | "
                    f"💰 {job.get('salary_range', 'Competitive')} | "
                    f"🎯 {match_score}% match"
                )

            jobs_text = "\n\n".join(job_summaries)
            location_text = f" in {location}" if location else ""

            return ActionResult(
                success=True,
                message=f"I found **{len(jobs)} jobs**{location_text} that might interest you:\n\n"
                       f"{jobs_text}\n\n"
                       f"These are ranked by how well they match your profile. "
                       f"Would you like more details on any of these positions?",
                data={
                    "jobs_count": len(jobs),
                    "jobs": jobs[:5],
                    "search_params": search_params
                },
                suggested_actions=[
                    {"label": "View More Jobs", "action": "view_more_jobs"},
                    {"label": "Refine Search", "action": "refine_search"},
                    {"label": "Apply to Top Match", "action": "apply_top"}
                ]
            )

        except Exception as e:
            logger.error(f"Job search action failed: {e}")
            return ActionResult(
                success=False,
                message="I encountered an issue searching for jobs. Let me try a different approach.\n\n"
                       "In the meantime, you can:\n"
                       "• Browse jobs directly in the Jobs section\n"
                       "• Update your profile to improve matches\n"
                       "• Tell me more about what you're looking for",
                suggested_actions=[
                    {"label": "Browse Jobs", "action": "browse_jobs"},
                    {"label": "Update Profile", "action": "edit_profile"}
                ]
            )

    async def handle_skill_analysis(
        self,
        entities: Dict[str, Any],
        user_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> ActionResult:
        """
        Handle skill analysis intent.
        Analyzes user skills and provides market insights.
        """
        try:
            # Get user's projects and skills (from context or fetch)
            projects = context.get('projects', []) if context else []
            technologies = entities.get('skills', [])

            if not technologies and not projects:
                return ActionResult(
                    success=True,
                    message="To analyze your skills and show market demand, I need to know more about you.\n\n"
                           "**Options:**\n"
                           "• Tell me about your skills (e.g., 'I know Python, React, and SQL')\n"
                           "• Add projects to your profile so I can extract skills\n"
                           "• Upload your resume for automatic skill detection\n\n"
                           "What would you like to do?",
                    suggested_actions=[
                        {"label": "Add Skills", "action": "add_skills"},
                        {"label": "Add Project", "action": "add_project"},
                        {"label": "Upload Resume", "action": "upload_resume"}
                    ]
                )

            # Analyze market trends for user's skills
            if technologies:
                market_data = await self.market_analyzer.analyze_market_trends(
                    technologies=technologies[:10],
                    time_horizon="1_year"
                )

                # Format skill insights
                hot_skills = market_data.get('hot_technologies', [])
                trends = market_data.get('trends', [])

                skill_insights = []
                for trend in trends[:5]:
                    direction = trend.get('trend_direction', 'stable')
                    emoji = "📈" if direction in ['rising', 'emerging'] else "📊" if direction == 'stable' else "📉"
                    skill_insights.append(
                        f"{emoji} **{trend.get('technology')}**: {direction.title()} "
                        f"({trend.get('growth_rate', 0):.0f}% growth, "
                        f"{trend.get('demand_score', 0.7)*100:.0f}% demand)"
                    )

                insights_text = "\n".join(skill_insights)

                # Generate recommendations
                recommendations = market_data.get('recommendations', [])
                rec_text = "\n".join([f"• {r}" for r in recommendations[:3]])

                return ActionResult(
                    success=True,
                    message=f"**📊 Skills Market Analysis**\n\n"
                           f"{insights_text}\n\n"
                           f"**🎯 Recommendations:**\n{rec_text}\n\n"
                           f"{market_data.get('market_summary', '')}\n\n"
                           f"Want me to suggest skills to learn or analyze your skill gaps?",
                    data=market_data,
                    suggested_actions=[
                        {"label": "Skill Gap Analysis", "action": "skill_gaps"},
                        {"label": "Learning Path", "action": "learning_path"},
                        {"label": "Salary Insights", "action": "salary_insights"}
                    ]
                )

            return ActionResult(
                success=True,
                message="Please tell me which skills you'd like me to analyze.",
                suggested_actions=[
                    {"label": "My Current Skills", "action": "show_skills"},
                    {"label": "Popular Skills", "action": "popular_skills"}
                ]
            )

        except Exception as e:
            logger.error(f"Skill analysis action failed: {e}")
            return ActionResult(
                success=False,
                message="I couldn't complete the skill analysis right now. Here's what I can tell you:\n\n"
                       "**Top In-Demand Skills (2024-2025):**\n"
                       "• Python, JavaScript, TypeScript\n"
                       "• Cloud (AWS, Azure, GCP)\n"
                       "• AI/ML and Data Science\n"
                       "• React, Next.js, Node.js\n\n"
                       "Tell me your skills and I'll give you personalized insights!",
                suggested_actions=[
                    {"label": "Enter My Skills", "action": "add_skills"}
                ]
            )

    async def handle_profile_suggestions(
        self,
        entities: Dict[str, Any],
        user_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> ActionResult:
        """
        Handle profile improvement suggestions.
        Analyzes user profile and suggests improvements.
        """
        try:
            # Fetch user profile if we have user_id
            profile = await self._fetch_user_profile(user_id) if user_id else {}

            if not profile:
                return ActionResult(
                    success=True,
                    message="I'd love to help you build a standout profile! Here's what makes profiles successful:\n\n"
                           "**🌟 Profile Checklist:**\n"
                           "1. **Projects** - Add 2-3 of your best works\n"
                           "2. **Skills** - List technologies you know\n"
                           "3. **Education** - Add your university and courses\n"
                           "4. **Bio** - Write 2-3 compelling sentences\n"
                           "5. **Photo** - Add a professional headshot\n\n"
                           "Which area would you like to work on first?",
                    suggested_actions=[
                        {"label": "Add Project", "action": "add_project"},
                        {"label": "Add Skills", "action": "add_skills"},
                        {"label": "Write Bio", "action": "write_bio"}
                    ]
                )

            # Analyze profile completeness
            suggestions = []
            score = 0
            max_score = 100

            # Check profile sections
            if profile.get('projects', []):
                score += 30
            else:
                suggestions.append("📁 Add projects to showcase your work")

            if profile.get('skills', []):
                score += 20
            else:
                suggestions.append("🛠️ Add your technical skills")

            if profile.get('bio'):
                score += 15
            else:
                suggestions.append("📝 Write a compelling bio")

            if profile.get('education'):
                score += 15
            else:
                suggestions.append("🎓 Add your education details")

            if profile.get('photo_url'):
                score += 10
            else:
                suggestions.append("📸 Add a professional photo")

            if profile.get('location'):
                score += 10
            else:
                suggestions.append("📍 Add your location for better job matches")

            # Generate message based on score
            if score >= 80:
                status = "excellent"
                emoji = "🌟"
            elif score >= 60:
                status = "good"
                emoji = "👍"
            elif score >= 40:
                status = "improving"
                emoji = "💪"
            else:
                status = "needs work"
                emoji = "🚀"

            suggestions_text = "\n".join([f"• {s}" for s in suggestions]) if suggestions else "Your profile looks great!"

            return ActionResult(
                success=True,
                message=f"{emoji} **Profile Score: {score}%** ({status})\n\n"
                       f"**Suggestions to improve:**\n{suggestions_text}\n\n"
                       f"A complete profile gets **3x more views** from recruiters!\n\n"
                       f"What would you like to work on?",
                data={
                    "score": score,
                    "suggestions": suggestions,
                    "profile_sections": {
                        "projects": bool(profile.get('projects')),
                        "skills": bool(profile.get('skills')),
                        "bio": bool(profile.get('bio')),
                        "education": bool(profile.get('education')),
                        "photo": bool(profile.get('photo_url'))
                    }
                },
                suggested_actions=[
                    {"label": suggestions[0].split(' ', 1)[1] if suggestions else "View Profile", "action": "improve_profile"},
                    {"label": "AI Profile Review", "action": "ai_review"},
                    {"label": "View Public Profile", "action": "view_profile"}
                ]
            )

        except Exception as e:
            logger.error(f"Profile suggestions action failed: {e}")
            return ActionResult(
                success=False,
                message="Let me give you general profile tips while I work on your specific analysis:\n\n"
                       "**Top Profile Tips:**\n"
                       "• Add real projects (even class projects count!)\n"
                       "• Use keywords from job descriptions\n"
                       "• Quantify your achievements\n"
                       "• Keep your bio concise but impactful",
                suggested_actions=[
                    {"label": "Edit Profile", "action": "edit_profile"}
                ]
            )

    async def handle_career_advice(
        self,
        entities: Dict[str, Any],
        user_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> ActionResult:
        """
        Handle career advice requests.
        Provides personalized career guidance based on user's background.
        """
        try:
            # Extract field/area from entities
            field = entities.get('field') or entities.get('major')
            career_goal = entities.get('career_goal')

            if field:
                # Analyze job market for this field
                roles = self._get_roles_for_field(field)
                market_data = await self.market_analyzer.analyze_job_market(
                    role_titles=roles[:3],
                    experience_level="entry"
                )

                job_insights = market_data.get('job_insights', [])

                # Format career advice
                career_paths = []
                for insight in job_insights[:3]:
                    salary = insight.get('salary_range', {})
                    career_paths.append(
                        f"**{insight.get('role_title')}**\n"
                        f"   💼 Demand: {'High' if insight.get('demand_level', 0) > 0.7 else 'Moderate'}\n"
                        f"   💰 Salary: €{salary.get('min', 30000):,} - €{salary.get('max', 60000):,}\n"
                        f"   📈 Growth: {insight.get('growth_projection', 8)}%/year\n"
                        f"   🛠️ Key Skills: {', '.join(insight.get('required_skills', [])[:4])}"
                    )

                paths_text = "\n\n".join(career_paths)

                return ActionResult(
                    success=True,
                    message=f"**Career Paths for {field}:**\n\n"
                           f"{paths_text}\n\n"
                           f"**💡 My Advice:**\n"
                           f"1. Build projects that showcase relevant skills\n"
                           f"2. Network through LinkedIn and events\n"
                           f"3. Consider internships for experience\n"
                           f"4. Learn emerging skills in your field\n\n"
                           f"Want me to dive deeper into any of these paths?",
                    data=market_data,
                    suggested_actions=[
                        {"label": "Skill Roadmap", "action": "skill_roadmap"},
                        {"label": "Find Mentors", "action": "find_mentors"},
                        {"label": "View Related Jobs", "action": "related_jobs"}
                    ]
                )

            # Generic career advice if no field specified
            return ActionResult(
                success=True,
                message="I'd love to give you personalized career advice! Tell me more about:\n\n"
                       "• **Your field** - What did you study or what interests you?\n"
                       "• **Your goals** - What kind of role are you aiming for?\n"
                       "• **Your timeline** - Are you graduating soon or exploring options?\n\n"
                       "For example, you can ask:\n"
                       "• 'Career advice for Computer Science graduates'\n"
                       "• 'How to become a Data Scientist'\n"
                       "• 'Best entry-level jobs in Marketing'",
                suggested_actions=[
                    {"label": "Tech Careers", "action": "career_tech"},
                    {"label": "Business Careers", "action": "career_business"},
                    {"label": "Design Careers", "action": "career_design"}
                ]
            )

        except Exception as e:
            logger.error(f"Career advice action failed: {e}")
            return ActionResult(
                success=False,
                message="Here's some universal career advice while I work on your specific request:\n\n"
                       "**🎯 Career Success Tips:**\n"
                       "• Build a portfolio of real projects\n"
                       "• Network actively on LinkedIn\n"
                       "• Apply to both dream jobs and backup options\n"
                       "• Keep learning - the market changes fast\n"
                       "• Get feedback from professionals in your target field",
                suggested_actions=[
                    {"label": "Browse Jobs", "action": "browse_jobs"}
                ]
            )

    async def handle_education_info(
        self,
        entities: Dict[str, Any],
        user_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> ActionResult:
        """
        Handle education information requests (ITS, Master's, courses).
        """
        try:
            education_type = entities.get('education_type', '').lower()
            field = entities.get('field')

            if 'its' in education_type or 'istituto tecnico' in education_type:
                return ActionResult(
                    success=True,
                    message="**📚 ITS (Istituti Tecnici Superiori)**\n\n"
                           "ITS are post-diploma courses that provide specialized technical training.\n\n"
                           "**Key Facts:**\n"
                           "• Duration: 2 years (1800-2000 hours)\n"
                           "• 30% internship with companies\n"
                           "• 80%+ employment rate\n"
                           "• Free or low-cost (regional funding)\n\n"
                           "**Popular ITS Areas:**\n"
                           "• ICT & Digital Technologies\n"
                           "• Mechatronics & Industry 4.0\n"
                           "• Tourism & Cultural Heritage\n"
                           "• Fashion & Made in Italy\n"
                           "• Agri-food & Sustainability\n\n"
                           "**Why Consider ITS:**\n"
                           "✅ Direct path to employment\n"
                           "✅ Hands-on, practical learning\n"
                           "✅ Strong industry connections\n"
                           "✅ Smaller classes, more support\n\n"
                           "Want me to help you find ITS programs in your area?",
                    suggested_actions=[
                        {"label": "Find ITS Programs", "action": "find_its"},
                        {"label": "ITS vs University", "action": "its_comparison"},
                        {"label": "Job Outcomes", "action": "its_outcomes"}
                    ]
                )

            elif 'master' in education_type or 'magistrale' in education_type:
                return ActionResult(
                    success=True,
                    message="**🎓 Master's Degree (Laurea Magistrale)**\n\n"
                           "A Master's degree deepens your expertise and opens senior roles.\n\n"
                           "**Types of Master's:**\n"
                           "• **Laurea Magistrale** (2 years) - Academic path\n"
                           "• **Master Universitario** (1 year) - Professional focus\n"
                           "• **MBA** - Business leadership\n\n"
                           "**Should You Get a Master's?**\n\n"
                           "✅ **Consider if:**\n"
                           "• You want research/academic roles\n"
                           "• Your field requires it (e.g., Psychology, Engineering leadership)\n"
                           "• You want to specialize deeply\n"
                           "• Salary boost potential (15-30% higher)\n\n"
                           "⚠️ **Maybe skip if:**\n"
                           "• You want to start working immediately\n"
                           "• Your field values experience over degrees\n"
                           "• You're unsure about specialization\n\n"
                           "What field are you considering for your Master's?",
                    suggested_actions=[
                        {"label": "Master's in Tech", "action": "masters_tech"},
                        {"label": "Master's in Business", "action": "masters_business"},
                        {"label": "Work vs Study", "action": "work_vs_study"}
                    ]
                )

            # General education guidance
            return ActionResult(
                success=True,
                message="**🎓 Education Pathways**\n\n"
                       "I can help you explore different educational options:\n\n"
                       "**After High School/Diploma:**\n"
                       "• **ITS** - 2-year technical programs (high employment)\n"
                       "• **Laurea Triennale** - 3-year bachelor's degree\n\n"
                       "**After Bachelor's:**\n"
                       "• **Laurea Magistrale** - 2-year master's\n"
                       "• **Master Professionale** - 1-year specialized\n"
                       "• **Work + Learning** - Entry-level job + courses\n\n"
                       "What would you like to know more about?",
                suggested_actions=[
                    {"label": "ITS Programs", "action": "its_info"},
                    {"label": "Master's Degrees", "action": "masters_info"},
                    {"label": "Online Courses", "action": "online_courses"}
                ]
            )

        except Exception as e:
            logger.error(f"Education info action failed: {e}")
            return ActionResult(
                success=False,
                message="I can help with education questions! Ask me about:\n"
                       "• ITS programs\n"
                       "• Master's degrees\n"
                       "• Online courses and certifications\n"
                       "• Comparing different paths",
                suggested_actions=[
                    {"label": "ITS Info", "action": "its_info"},
                    {"label": "Master's Info", "action": "masters_info"}
                ]
            )

    # Helper methods

    async def _fetch_jobs(self, params: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Fetch jobs from backend API"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.backend_api_url}/api/jobs",
                    params=params,
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    timeout=10.0
                )
                if response.status_code == 200:
                    data = response.json()
                    return data.get('jobs', data) if isinstance(data, dict) else data
        except Exception as e:
            logger.error(f"Failed to fetch jobs: {e}")

        # Return mock data for testing
        return [
            {
                "id": "1",
                "title": "Junior Software Developer",
                "company": "TechCorp",
                "location": params.get('location', 'Milan'),
                "salary_range": "€30,000 - €40,000",
                "match_score": 92
            },
            {
                "id": "2",
                "title": "Frontend Developer Intern",
                "company": "StartupXYZ",
                "location": params.get('location', 'Milan'),
                "salary_range": "€800/month",
                "match_score": 88
            }
        ]

    async def _fetch_user_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Fetch user profile from backend API"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.backend_api_url}/api/students/{user_id}",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    timeout=10.0
                )
                if response.status_code == 200:
                    return response.json()
        except Exception as e:
            logger.error(f"Failed to fetch user profile: {e}")
        return None

    def _get_roles_for_field(self, field: str) -> List[str]:
        """Map academic fields to job roles"""
        field_lower = field.lower()

        field_roles = {
            'computer science': ['Software Developer', 'Data Engineer', 'DevOps Engineer'],
            'informatica': ['Software Developer', 'Data Engineer', 'DevOps Engineer'],
            'engineering': ['Software Engineer', 'Systems Engineer', 'Product Manager'],
            'ingegneria': ['Software Engineer', 'Systems Engineer', 'Product Manager'],
            'business': ['Business Analyst', 'Product Manager', 'Marketing Manager'],
            'economia': ['Business Analyst', 'Financial Analyst', 'Consultant'],
            'economics': ['Financial Analyst', 'Data Analyst', 'Consultant'],
            'marketing': ['Marketing Manager', 'Digital Marketing Specialist', 'Content Manager'],
            'design': ['UX Designer', 'Product Designer', 'Creative Director'],
            'data science': ['Data Scientist', 'ML Engineer', 'Data Analyst'],
            'law': ['Legal Analyst', 'Compliance Officer', 'Contract Manager'],
            'giurisprudenza': ['Legal Analyst', 'Compliance Officer', 'Contract Manager'],
        }

        for key, roles in field_roles.items():
            if key in field_lower:
                return roles

        # Default roles
        return ['Analyst', 'Consultant', 'Project Manager']
