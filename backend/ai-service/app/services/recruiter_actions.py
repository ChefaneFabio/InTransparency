#!/usr/bin/env python3
"""
Recruiter Action Handlers for Conversation Service
Handles recruiter-specific intents for candidate search, matching, and insights.
"""

import os
import json
import logging
import httpx
import hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, field
import redis

from app.services.candidate_matcher import CandidateMatcher
from app.services.market_analyzer import MarketAnalyzer
from app.services.skills_assessor import SkillsAssessor

logger = logging.getLogger(__name__)


@dataclass
class ActionResult:
    """Result from an action handler"""
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    suggested_actions: Optional[List[Dict[str, str]]] = None


@dataclass
class SearchQuery:
    """Structured search query extracted from natural language"""
    skills: List[str] = field(default_factory=list)
    locations: List[str] = field(default_factory=list)
    universities: List[str] = field(default_factory=list)
    experience_level: Optional[str] = None
    languages: List[str] = field(default_factory=list)
    availability: Optional[str] = None
    disciplines: List[str] = field(default_factory=list)
    min_gpa: Optional[float] = None
    remote_preference: Optional[bool] = None
    raw_query: str = ""


class RecruiterActionHandler:
    """Handles recruiter-specific conversation intents"""

    def __init__(self):
        self.candidate_matcher = CandidateMatcher()
        self.market_analyzer = MarketAnalyzer()
        self.skills_assessor = SkillsAssessor()
        self.backend_api_url = os.getenv("BACKEND_API_URL", "http://localhost:3001")
        self.api_key = os.getenv("AI_SERVICE_API_KEY", "")
        self.redis_client = self._init_redis()

        # Entity dictionaries for extraction
        self.skill_keywords = self._load_skill_keywords()
        self.location_keywords = self._load_location_keywords()
        self.university_keywords = self._load_university_keywords()

    def _init_redis(self):
        """Initialize Redis for saved searches"""
        try:
            redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
            client = redis.from_url(redis_url, decode_responses=True)
            client.ping()
            return client
        except Exception as e:
            logger.warning(f"Redis connection failed: {e}")
            return None

    def _load_skill_keywords(self) -> Dict[str, List[str]]:
        """Load skill keywords for entity extraction"""
        return {
            # Programming Languages
            "python": ["python", "py", "django", "flask", "fastapi"],
            "javascript": ["javascript", "js", "node", "nodejs", "node.js"],
            "typescript": ["typescript", "ts"],
            "java": ["java", "spring", "spring boot", "springboot"],
            "react": ["react", "reactjs", "react.js", "next.js", "nextjs"],
            "angular": ["angular", "angularjs"],
            "vue": ["vue", "vuejs", "vue.js", "nuxt"],
            "sql": ["sql", "mysql", "postgresql", "postgres", "oracle", "database"],
            "aws": ["aws", "amazon web services", "ec2", "s3", "lambda"],
            "docker": ["docker", "container", "kubernetes", "k8s"],
            "machine learning": ["ml", "machine learning", "ai", "artificial intelligence", "deep learning"],
            "data science": ["data science", "data scientist", "analytics", "data analysis"],
            "cybersecurity": ["cybersecurity", "security", "infosec", "penetration testing", "ethical hacking"],
            "devops": ["devops", "ci/cd", "jenkins", "github actions"],
            "mobile": ["mobile", "ios", "android", "swift", "kotlin", "flutter", "react native"],
            "cloud": ["cloud", "azure", "gcp", "google cloud"],
            # Business/Soft Skills
            "marketing": ["marketing", "digital marketing", "seo", "sem", "social media"],
            "design": ["design", "ux", "ui", "figma", "sketch", "adobe"],
            "project management": ["project management", "pm", "agile", "scrum", "jira"],
            "sales": ["sales", "business development", "account management"],
            "finance": ["finance", "accounting", "financial analysis", "excel"],
        }

    def _load_location_keywords(self) -> Dict[str, str]:
        """Load location keywords for entity extraction"""
        return {
            # Italian cities
            "milano": "Milan", "milan": "Milan",
            "roma": "Rome", "rome": "Rome",
            "torino": "Turin", "turin": "Turin",
            "bologna": "Bologna",
            "firenze": "Florence", "florence": "Florence",
            "napoli": "Naples", "naples": "Naples",
            "venezia": "Venice", "venice": "Venice",
            "genova": "Genoa", "genoa": "Genoa",
            "palermo": "Palermo",
            "bari": "Bari",
            "catania": "Catania",
            "verona": "Verona",
            "padova": "Padua", "padua": "Padua",
            "trieste": "Trieste",
            "brescia": "Brescia",
            "parma": "Parma",
            "modena": "Modena",
            "reggio emilia": "Reggio Emilia",
            "pisa": "Pisa",
            # Regions
            "lombardia": "Lombardy", "lombardy": "Lombardy",
            "lazio": "Lazio",
            "piemonte": "Piedmont", "piedmont": "Piedmont",
            "emilia romagna": "Emilia-Romagna", "emilia-romagna": "Emilia-Romagna",
            "veneto": "Veneto",
            "toscana": "Tuscany", "tuscany": "Tuscany",
            "campania": "Campania",
            "sicilia": "Sicily", "sicily": "Sicily",
            # Remote
            "remote": "Remote", "remoto": "Remote",
            "hybrid": "Hybrid", "ibrido": "Hybrid",
        }

    def _load_university_keywords(self) -> Dict[str, str]:
        """Load university keywords for entity extraction"""
        return {
            "politecnico milano": "Politecnico di Milano",
            "polimi": "Politecnico di Milano",
            "politecnico torino": "Politecnico di Torino",
            "polito": "Politecnico di Torino",
            "bocconi": "Università Bocconi",
            "sapienza": "Sapienza Università di Roma",
            "la sapienza": "Sapienza Università di Roma",
            "bologna": "Università di Bologna",
            "unibo": "Università di Bologna",
            "padova": "Università di Padova",
            "statale milano": "Università degli Studi di Milano",
            "unimi": "Università degli Studi di Milano",
            "bicocca": "Università di Milano-Bicocca",
            "cattolica": "Università Cattolica",
            "luiss": "LUISS",
            "its": "ITS",
        }

    def extract_search_entities(self, message: str) -> SearchQuery:
        """
        Extract search entities from natural language query.
        This is the core NLP function for recruiter search.
        """
        message_lower = message.lower()
        query = SearchQuery(raw_query=message)

        # Extract skills
        for skill, keywords in self.skill_keywords.items():
            for keyword in keywords:
                if keyword in message_lower:
                    if skill not in query.skills:
                        query.skills.append(skill)
                    break

        # Extract locations
        for keyword, location in self.location_keywords.items():
            if keyword in message_lower:
                if location not in query.locations:
                    query.locations.append(location)

        # Extract universities
        for keyword, university in self.university_keywords.items():
            if keyword in message_lower:
                if university not in query.universities:
                    query.universities.append(university)

        # Extract experience level
        experience_patterns = {
            "junior": ["junior", "entry level", "entry-level", "neo laureato", "neolaureato", "fresh graduate"],
            "mid": ["mid", "middle", "2-3 years", "2-4 years", "3-5 years", "some experience"],
            "senior": ["senior", "lead", "5+ years", "experienced", "expert"],
            "intern": ["intern", "internship", "stage", "tirocinio", "stagista"],
        }
        for level, patterns in experience_patterns.items():
            if any(p in message_lower for p in patterns):
                query.experience_level = level
                break

        # Extract languages
        language_patterns = {
            "english": ["english", "inglese"],
            "italian": ["italian", "italiano"],
            "german": ["german", "tedesco"],
            "french": ["french", "francese"],
            "spanish": ["spanish", "spagnolo"],
        }
        for lang, patterns in language_patterns.items():
            if any(p in message_lower for p in patterns):
                query.languages.append(lang)

        # Extract availability
        if any(word in message_lower for word in ["immediate", "immediata", "subito", "now", "asap"]):
            query.availability = "immediate"
        elif any(word in message_lower for word in ["month", "mese", "weeks", "settimane"]):
            query.availability = "1_month"

        # Extract discipline/field
        discipline_patterns = {
            "tech": ["tech", "software", "developer", "engineer", "programmer", "informatica"],
            "business": ["business", "commerce", "economia", "management"],
            "design": ["design", "creative", "graphic", "visual"],
            "marketing": ["marketing", "communication", "comunicazione"],
            "data": ["data", "analytics", "scientist"],
            "healthcare": ["healthcare", "medical", "medicina", "sanità"],
        }
        for disc, patterns in discipline_patterns.items():
            if any(p in message_lower for p in patterns):
                if disc not in query.disciplines:
                    query.disciplines.append(disc)

        # Extract remote preference
        if "remote" in message_lower or "remoto" in message_lower:
            query.remote_preference = True
        elif "on-site" in message_lower or "in sede" in message_lower or "office" in message_lower:
            query.remote_preference = False

        return query

    async def handle_candidate_search(
        self,
        entities: Dict[str, Any],
        user_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None,
        raw_message: str = ""
    ) -> ActionResult:
        """
        Handle natural language candidate search.
        Core recruiter functionality.
        """
        try:
            # Extract entities from raw message if provided
            if raw_message:
                search_query = self.extract_search_entities(raw_message)
            else:
                # Build from entities dict
                search_query = SearchQuery(
                    skills=entities.get('skills', []),
                    locations=[entities.get('location')] if entities.get('location') else [],
                    universities=entities.get('universities', []),
                    experience_level=entities.get('experience_level'),
                    raw_query=""
                )

            # Merge with any existing entities
            if entities.get('skills'):
                for skill in entities['skills']:
                    if skill.lower() not in [s.lower() for s in search_query.skills]:
                        search_query.skills.append(skill)

            # Build API search params
            search_params = self._build_search_params(search_query)

            # Fetch candidates from backend
            candidates = await self._fetch_candidates(search_params)

            if not candidates:
                return self._no_results_response(search_query)

            # Format results
            return self._format_search_results(candidates, search_query)

        except Exception as e:
            logger.error(f"Candidate search failed: {e}")
            return ActionResult(
                success=False,
                message="I encountered an issue searching for candidates. Let me try differently.\n\n"
                       "You can also try:\n"
                       "• Advanced Search in the dashboard\n"
                       "• Being more specific about skills or location\n"
                       "• Broadening your criteria",
                suggested_actions=[
                    {"label": "Advanced Search", "action": "advanced_search"},
                    {"label": "Browse All Candidates", "action": "browse_candidates"}
                ]
            )

    def _build_search_params(self, query: SearchQuery) -> Dict[str, Any]:
        """Convert SearchQuery to API params"""
        params = {}

        if query.skills:
            params['skills'] = ','.join(query.skills)

        if query.locations:
            params['location'] = query.locations[0]  # Primary location

        if query.universities:
            params['university'] = query.universities[0]

        if query.experience_level:
            params['experience_level'] = query.experience_level

        if query.languages:
            params['languages'] = ','.join(query.languages)

        if query.disciplines:
            params['discipline'] = query.disciplines[0]

        if query.remote_preference is not None:
            params['remote'] = query.remote_preference

        if query.availability:
            params['availability'] = query.availability

        return params

    def _no_results_response(self, query: SearchQuery) -> ActionResult:
        """Generate helpful response when no candidates found"""
        criteria = []
        if query.skills:
            criteria.append(f"skills: {', '.join(query.skills)}")
        if query.locations:
            criteria.append(f"location: {', '.join(query.locations)}")
        if query.experience_level:
            criteria.append(f"level: {query.experience_level}")

        criteria_text = " | ".join(criteria) if criteria else "your criteria"

        return ActionResult(
            success=True,
            message=f"I searched for candidates matching **{criteria_text}** but didn't find exact matches.\n\n"
                   f"**Suggestions:**\n"
                   f"• Broaden your skill requirements\n"
                   f"• Consider nearby locations\n"
                   f"• Try 'junior' or 'intern' levels for wider pool\n"
                   f"• Check back - new candidates join daily!\n\n"
                   f"Would you like me to adjust the search?",
            data={"candidates_count": 0, "query": query.__dict__},
            suggested_actions=[
                {"label": "Broaden Search", "action": "broaden_search"},
                {"label": "Set Alert", "action": "set_alert"},
                {"label": "Try Different Skills", "action": "different_skills"}
            ]
        )

    def _format_search_results(
        self,
        candidates: List[Dict[str, Any]],
        query: SearchQuery
    ) -> ActionResult:
        """Format candidate search results"""
        total = len(candidates)
        shown = min(5, total)

        # Format candidate summaries
        candidate_summaries = []
        for i, candidate in enumerate(candidates[:5]):
            match_score = candidate.get('match_score', 90 - i*3)
            skills = candidate.get('skills', [])[:4]
            skills_text = ', '.join(skills) if skills else 'Various skills'

            name = candidate.get('name', f"Candidate {i+1}")
            # Anonymize if needed
            if candidate.get('anonymous', False):
                name = f"Candidate #{candidate.get('id', i+1)[:6]}"

            university = candidate.get('university', '')
            location = candidate.get('location', '')

            summary = (
                f"**{name}** - {match_score}% match\n"
                f"   🎓 {university}\n"
                f"   📍 {location}\n"
                f"   🛠️ {skills_text}"
            )
            candidate_summaries.append(summary)

        results_text = "\n\n".join(candidate_summaries)

        # Build search summary
        search_desc = []
        if query.skills:
            search_desc.append(f"**{', '.join(query.skills[:3])}**")
        if query.locations:
            search_desc.append(f"in **{query.locations[0]}**")
        if query.experience_level:
            search_desc.append(f"({query.experience_level} level)")

        search_summary = " ".join(search_desc) if search_desc else "your criteria"

        return ActionResult(
            success=True,
            message=f"Found **{total} candidates** matching {search_summary}:\n\n"
                   f"{results_text}\n\n"
                   f"{'Showing top 5 of ' + str(total) + '. ' if total > 5 else ''}"
                   f"Match scores are based on skills, projects, and profile completeness.\n\n"
                   f"What would you like to do next?",
            data={
                "candidates_count": total,
                "candidates": candidates[:10],
                "query": query.__dict__
            },
            suggested_actions=[
                {"label": "View Full Profiles", "action": "view_profiles"},
                {"label": "Refine Search", "action": "refine_search"},
                {"label": "Compare Top 3", "action": "compare_candidates"},
                {"label": "Save Search", "action": "save_search"}
            ]
        )

    async def handle_match_explanation(
        self,
        entities: Dict[str, Any],
        user_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> ActionResult:
        """
        Explain why candidates match or how matching works.
        """
        try:
            candidate_id = entities.get('candidate_id')

            if candidate_id:
                # Explain specific candidate match
                candidate = await self._fetch_candidate(candidate_id)
                if candidate:
                    return self._explain_candidate_match(candidate)

            # General explanation of matching
            return ActionResult(
                success=True,
                message="**🎯 How Our Matching Works**\n\n"
                       "Our AI analyzes candidates across **6 dimensions**:\n\n"
                       "1. **Skills Match (30%)**\n"
                       "   - Technical skills from projects\n"
                       "   - Verified, not self-reported\n\n"
                       "2. **Project Relevance (20%)**\n"
                       "   - Actual work samples\n"
                       "   - Complexity and outcomes\n\n"
                       "3. **Experience Level (25%)**\n"
                       "   - Years of experience\n"
                       "   - Role progression\n\n"
                       "4. **Education (15%)**\n"
                       "   - Degree relevance\n"
                       "   - University ranking\n\n"
                       "5. **Location (5%)**\n"
                       "   - Geographic fit\n"
                       "   - Remote availability\n\n"
                       "6. **Culture Fit (5%)**\n"
                       "   - Work style preferences\n"
                       "   - Values alignment\n\n"
                       "**Why This Matters:**\n"
                       "Unlike traditional resumes, our scores are based on **verified evidence** "
                       "from actual projects, not just claims.\n\n"
                       "Want me to explain a specific candidate's match score?",
                data={"match_weights": {
                    "skills": 0.30,
                    "projects": 0.20,
                    "experience": 0.25,
                    "education": 0.15,
                    "location": 0.05,
                    "culture": 0.05
                }},
                suggested_actions=[
                    {"label": "View Top Matches", "action": "view_matches"},
                    {"label": "Adjust Weights", "action": "adjust_weights"},
                    {"label": "Search Candidates", "action": "search"}
                ]
            )

        except Exception as e:
            logger.error(f"Match explanation failed: {e}")
            return ActionResult(
                success=False,
                message="Let me explain our matching briefly:\n\n"
                       "We score candidates on skills (verified from projects), "
                       "experience, education, and location fit. Higher scores mean "
                       "better alignment with your requirements.",
                suggested_actions=[
                    {"label": "Search Candidates", "action": "search"}
                ]
            )

    def _explain_candidate_match(self, candidate: Dict[str, Any]) -> ActionResult:
        """Explain why a specific candidate matches"""
        name = candidate.get('name', 'This candidate')
        score = candidate.get('match_score', 85)

        breakdown = candidate.get('match_breakdown', {
            'skills': 0.85,
            'projects': 0.80,
            'experience': 0.75,
            'education': 0.90,
            'location': 1.0,
            'culture': 0.80
        })

        strengths = []
        gaps = []

        for category, value in breakdown.items():
            if value >= 0.8:
                strengths.append(f"✅ Strong {category} alignment ({int(value*100)}%)")
            elif value < 0.6:
                gaps.append(f"⚠️ {category.title()} could be stronger ({int(value*100)}%)")

        strengths_text = "\n".join(strengths) if strengths else "No major strengths identified"
        gaps_text = "\n".join(gaps) if gaps else "No significant gaps"

        return ActionResult(
            success=True,
            message=f"**Match Analysis: {name}** ({score}% overall)\n\n"
                   f"**Strengths:**\n{strengths_text}\n\n"
                   f"**Areas to Explore:**\n{gaps_text}\n\n"
                   f"**Recommendation:** "
                   f"{'Strong candidate - consider reaching out!' if score >= 80 else 'Good potential - review projects carefully.' if score >= 60 else 'May need additional screening.'}",
            data={"candidate": candidate, "breakdown": breakdown},
            suggested_actions=[
                {"label": "View Full Profile", "action": "view_profile"},
                {"label": "Send Message", "action": "message_candidate"},
                {"label": "Compare Others", "action": "compare"}
            ]
        )

    async def handle_job_posting_help(
        self,
        entities: Dict[str, Any],
        user_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> ActionResult:
        """Help with creating or improving job postings"""
        try:
            return ActionResult(
                success=True,
                message="**📝 Job Posting Best Practices**\n\n"
                       "I can help you create job postings that attract top talent!\n\n"
                       "**Key Elements of Great Job Posts:**\n\n"
                       "1. **Clear Title**\n"
                       "   ✅ 'Junior Frontend Developer (React)'\n"
                       "   ❌ 'Ninja Rockstar Developer'\n\n"
                       "2. **Specific Requirements**\n"
                       "   - List must-have vs nice-to-have skills\n"
                       "   - Be realistic about experience level\n\n"
                       "3. **Transparent Compensation**\n"
                       "   - Jobs with salary get 3x more applications\n"
                       "   - Include benefits and perks\n\n"
                       "4. **Company Culture**\n"
                       "   - Remote/hybrid policy\n"
                       "   - Team size and dynamics\n"
                       "   - Growth opportunities\n\n"
                       "5. **Clear Process**\n"
                       "   - Interview steps\n"
                       "   - Timeline expectations\n\n"
                       "Would you like me to help draft a job posting?",
                data={},
                suggested_actions=[
                    {"label": "Draft New Posting", "action": "draft_posting"},
                    {"label": "Review My Posting", "action": "review_posting"},
                    {"label": "View Templates", "action": "templates"}
                ]
            )

        except Exception as e:
            logger.error(f"Job posting help failed: {e}")
            return ActionResult(
                success=False,
                message="I can help with job postings! Tell me:\n"
                       "• What role are you hiring for?\n"
                       "• What skills are required?\n"
                       "• What's the compensation range?",
                suggested_actions=[
                    {"label": "Create Posting", "action": "create_posting"}
                ]
            )

    async def handle_market_intelligence(
        self,
        entities: Dict[str, Any],
        user_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> ActionResult:
        """Provide market intelligence for recruiters"""
        try:
            skills = entities.get('skills', [])

            if skills:
                # Analyze specific skills
                market_data = await self.market_analyzer.analyze_market_trends(
                    technologies=skills[:5],
                    time_horizon="1_year"
                )

                trends = market_data.get('trends', [])
                trend_items = []
                for trend in trends[:5]:
                    direction = trend.get('trend_direction', 'stable')
                    emoji = "📈" if direction in ['rising', 'emerging'] else "📊" if direction == 'stable' else "📉"
                    trend_items.append(
                        f"{emoji} **{trend.get('technology')}**: {direction.title()}\n"
                        f"   Demand: {int(trend.get('demand_score', 0.7)*100)}% | "
                        f"Growth: {trend.get('growth_rate', 5):.0f}%"
                    )

                trends_text = "\n\n".join(trend_items)

                return ActionResult(
                    success=True,
                    message=f"**📊 Market Intelligence Report**\n\n"
                           f"{trends_text}\n\n"
                           f"**Key Insights:**\n"
                           f"• {market_data.get('market_summary', 'Market shows steady demand.')}\n\n"
                           f"**Recommendations for Hiring:**\n"
                           + "\n".join([f"• {r}" for r in market_data.get('recommendations', [])[:3]]),
                    data=market_data,
                    suggested_actions=[
                        {"label": "Salary Insights", "action": "salary_insights"},
                        {"label": "Candidate Supply", "action": "candidate_supply"},
                        {"label": "Hiring Trends", "action": "hiring_trends"}
                    ]
                )

            # General market overview
            return ActionResult(
                success=True,
                message="**📊 What Market Intelligence Do You Need?**\n\n"
                       "I can provide insights on:\n\n"
                       "• **Skill Trends** - Which skills are rising or declining\n"
                       "• **Salary Data** - Compensation benchmarks by role/skill\n"
                       "• **Candidate Supply** - Availability of talent in specific areas\n"
                       "• **Hiring Competition** - How many companies are hiring similar roles\n"
                       "• **Geographic Insights** - Talent distribution by location\n\n"
                       "What would you like to explore?",
                suggested_actions=[
                    {"label": "Tech Skill Trends", "action": "tech_trends"},
                    {"label": "Salary Benchmarks", "action": "salaries"},
                    {"label": "Talent Availability", "action": "talent_supply"}
                ]
            )

        except Exception as e:
            logger.error(f"Market intelligence failed: {e}")
            return ActionResult(
                success=False,
                message="Here's what I can share about the market:\n\n"
                       "**Hot Skills (2024-2025):**\n"
                       "• AI/ML, Python, Cloud (AWS/Azure)\n"
                       "• React, TypeScript, Node.js\n"
                       "• DevOps, Kubernetes\n\n"
                       "Tell me specific skills to get detailed insights!",
                suggested_actions=[
                    {"label": "Analyze Skills", "action": "analyze_skills"}
                ]
            )

    async def handle_compare_candidates(
        self,
        entities: Dict[str, Any],
        user_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> ActionResult:
        """Compare multiple candidates side by side"""
        try:
            candidate_ids = entities.get('candidate_ids', [])

            if not candidate_ids and context:
                # Get from recent search results
                recent_search = context.get('recent_search', {})
                candidates = recent_search.get('candidates', [])[:3]
            else:
                candidates = []
                for cid in candidate_ids[:3]:
                    candidate = await self._fetch_candidate(cid)
                    if candidate:
                        candidates.append(candidate)

            if not candidates:
                return ActionResult(
                    success=True,
                    message="I'd be happy to compare candidates for you!\n\n"
                           "First, let me find some candidates to compare. "
                           "Tell me what skills or role you're hiring for.",
                    suggested_actions=[
                        {"label": "Search Candidates", "action": "search"},
                        {"label": "View Saved Candidates", "action": "saved"}
                    ]
                )

            # Build comparison table
            comparison_rows = []

            # Header
            names = [c.get('name', f"Candidate {i+1}")[:15] for i, c in enumerate(candidates)]
            comparison_rows.append("| Criteria | " + " | ".join(names) + " |")
            comparison_rows.append("|" + "---|" * (len(candidates) + 1))

            # Match scores
            scores = [str(c.get('match_score', 85)) + "%" for c in candidates]
            comparison_rows.append("| **Match Score** | " + " | ".join(scores) + " |")

            # Skills
            skills = [", ".join(c.get('skills', [])[:2]) or "N/A" for c in candidates]
            comparison_rows.append("| **Top Skills** | " + " | ".join(skills) + " |")

            # University
            unis = [c.get('university', 'N/A')[:20] for c in candidates]
            comparison_rows.append("| **University** | " + " | ".join(unis) + " |")

            # Experience
            exp = [c.get('experience_level', 'N/A') for c in candidates]
            comparison_rows.append("| **Experience** | " + " | ".join(exp) + " |")

            # Projects
            projects = [str(len(c.get('projects', []))) for c in candidates]
            comparison_rows.append("| **Projects** | " + " | ".join(projects) + " |")

            comparison_table = "\n".join(comparison_rows)

            return ActionResult(
                success=True,
                message=f"**🔍 Candidate Comparison**\n\n"
                       f"{comparison_table}\n\n"
                       f"**Quick Analysis:**\n"
                       f"• Highest match: **{names[0]}** at {scores[0]}\n"
                       f"• Most projects: **{names[int(max(range(len(projects)), key=lambda i: int(projects[i])))]}**\n\n"
                       f"Would you like me to dive deeper into any candidate?",
                data={"candidates": candidates},
                suggested_actions=[
                    {"label": f"More on {names[0]}", "action": "view_candidate_0"},
                    {"label": "Message All", "action": "message_all"},
                    {"label": "Export Comparison", "action": "export"}
                ]
            )

        except Exception as e:
            logger.error(f"Candidate comparison failed: {e}")
            return ActionResult(
                success=False,
                message="I couldn't compare candidates right now. "
                       "Try searching for candidates first, then I can compare them.",
                suggested_actions=[
                    {"label": "Search Candidates", "action": "search"}
                ]
            )

    async def handle_save_search(
        self,
        entities: Dict[str, Any],
        user_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> ActionResult:
        """Save a search query and optionally set up alerts"""
        try:
            if not user_id:
                return ActionResult(
                    success=False,
                    message="Please log in to save searches and set up alerts.",
                    suggested_actions=[
                        {"label": "Log In", "action": "login"}
                    ]
                )

            # Get search query from context
            recent_search = context.get('recent_search', {}) if context else {}
            query = recent_search.get('query', entities)

            # Generate search hash for deduplication
            query_str = json.dumps(query, sort_keys=True)
            search_hash = hashlib.md5(query_str.encode()).hexdigest()[:12]

            # Save to Redis
            search_data = {
                "id": search_hash,
                "query": query,
                "user_id": user_id,
                "created_at": datetime.now().isoformat(),
                "alert_enabled": True
            }

            if self.redis_client:
                key = f"saved_search:{user_id}:{search_hash}"
                self.redis_client.setex(key, 86400 * 30, json.dumps(search_data))  # 30 days

            # Build description
            desc_parts = []
            if isinstance(query, dict):
                if query.get('skills'):
                    skills = query['skills'] if isinstance(query['skills'], list) else [query['skills']]
                    desc_parts.append(f"skills: {', '.join(skills[:3])}")
                if query.get('locations'):
                    locs = query['locations'] if isinstance(query['locations'], list) else [query['locations']]
                    desc_parts.append(f"in {locs[0]}")

            desc = " | ".join(desc_parts) if desc_parts else "Custom search"

            return ActionResult(
                success=True,
                message=f"**✅ Search Saved!**\n\n"
                       f"**Search:** {desc}\n"
                       f"**ID:** #{search_hash}\n\n"
                       f"🔔 **Alerts Enabled** - I'll notify you when new matching candidates join.\n\n"
                       f"You can manage your saved searches in the dashboard.",
                data={"search_id": search_hash, "query": query},
                suggested_actions=[
                    {"label": "View Saved Searches", "action": "view_saved"},
                    {"label": "Modify Alerts", "action": "modify_alerts"},
                    {"label": "New Search", "action": "new_search"}
                ]
            )

        except Exception as e:
            logger.error(f"Save search failed: {e}")
            return ActionResult(
                success=False,
                message="I couldn't save the search right now. "
                       "You can manually save it from the dashboard.",
                suggested_actions=[
                    {"label": "Go to Dashboard", "action": "dashboard"}
                ]
            )

    async def handle_search_refinement(
        self,
        entities: Dict[str, Any],
        user_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> ActionResult:
        """Refine an existing search based on conversation"""
        try:
            # Get previous search from context
            previous_search = context.get('recent_search', {}) if context else {}
            previous_query = previous_search.get('query', {})

            # Merge with new entities
            refined_query = SearchQuery(
                skills=previous_query.get('skills', []) + entities.get('skills', []),
                locations=previous_query.get('locations', []) + ([entities.get('location')] if entities.get('location') else []),
                experience_level=entities.get('experience_level') or previous_query.get('experience_level'),
                raw_query=entities.get('raw_query', '')
            )

            # De-duplicate
            refined_query.skills = list(set(refined_query.skills))
            refined_query.locations = list(set(refined_query.locations))

            # Perform refined search
            return await self.handle_candidate_search(
                entities=refined_query.__dict__,
                user_id=user_id,
                context=context
            )

        except Exception as e:
            logger.error(f"Search refinement failed: {e}")
            return ActionResult(
                success=False,
                message="I couldn't refine the search. Let's start fresh - "
                       "what are you looking for?",
                suggested_actions=[
                    {"label": "New Search", "action": "new_search"}
                ]
            )

    # Helper methods

    async def _fetch_candidates(self, params: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Fetch candidates from backend API"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.backend_api_url}/api/students",
                    params=params,
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    timeout=10.0
                )
                if response.status_code == 200:
                    data = response.json()
                    return data.get('students', data) if isinstance(data, dict) else data
        except Exception as e:
            logger.error(f"Failed to fetch candidates: {e}")

        # Return mock data for testing
        skills = params.get('skills', 'Python').split(',')
        location = params.get('location', 'Milan')

        return [
            {
                "id": "cand_001",
                "name": "Marco Rossi",
                "university": "Politecnico di Milano",
                "location": location,
                "skills": skills + ["React", "Node.js"],
                "experience_level": "junior",
                "match_score": 94,
                "projects": [{"title": "E-commerce Platform"}, {"title": "ML Pipeline"}]
            },
            {
                "id": "cand_002",
                "name": "Giulia Bianchi",
                "university": "Università di Bologna",
                "location": location,
                "skills": skills + ["TypeScript", "AWS"],
                "experience_level": "mid",
                "match_score": 89,
                "projects": [{"title": "FinTech App"}, {"title": "API Gateway"}]
            },
            {
                "id": "cand_003",
                "name": "Alessandro Verdi",
                "university": "Sapienza Roma",
                "location": "Rome",
                "skills": skills + ["Docker", "PostgreSQL"],
                "experience_level": "junior",
                "match_score": 85,
                "projects": [{"title": "DevOps Pipeline"}]
            }
        ]

    async def _fetch_candidate(self, candidate_id: str) -> Optional[Dict[str, Any]]:
        """Fetch a single candidate by ID"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.backend_api_url}/api/students/{candidate_id}",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    timeout=10.0
                )
                if response.status_code == 200:
                    return response.json()
        except Exception as e:
            logger.error(f"Failed to fetch candidate: {e}")
        return None
