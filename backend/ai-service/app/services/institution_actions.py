#!/usr/bin/env python3
"""
Institution/University Action Handlers for Conversation Service
Handles university-specific intents for analytics, student tracking, and insights.
"""

import os
import json
import logging
import httpx
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, field
from collections import Counter
import redis

from app.services.market_analyzer import MarketAnalyzer

logger = logging.getLogger(__name__)


@dataclass
class ActionResult:
    """Result from an action handler"""
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    suggested_actions: Optional[List[Dict[str, str]]] = None


@dataclass
class SearchAnalytics:
    """Analytics data for company searches"""
    total_searches: int
    unique_companies: int
    top_skills_searched: List[Tuple[str, int]]
    top_locations_searched: List[Tuple[str, int]]
    search_trend: str  # "increasing", "stable", "decreasing"
    period: str
    your_students_viewed: int
    conversion_rate: float  # views to messages


@dataclass
class StudentRiskProfile:
    """Risk profile for a student"""
    student_id: str
    name: str
    risk_level: str  # "high", "medium", "low"
    risk_factors: List[str]
    recommendations: List[str]
    last_activity: Optional[datetime]
    profile_completeness: float
    job_applications: int


class InstitutionActionHandler:
    """Handles institution/university-specific conversation intents"""

    def __init__(self):
        self.market_analyzer = MarketAnalyzer()
        self.backend_api_url = os.getenv("BACKEND_API_URL", "http://localhost:3001")
        self.api_key = os.getenv("AI_SERVICE_API_KEY", "")
        self.redis_client = self._init_redis()

    def _init_redis(self):
        """Initialize Redis for caching analytics"""
        try:
            redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
            client = redis.from_url(redis_url, decode_responses=True)
            client.ping()
            return client
        except Exception as e:
            logger.warning(f"Redis connection failed: {e}")
            return None

    async def handle_search_analytics(
        self,
        entities: Dict[str, Any],
        user_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> ActionResult:
        """
        Show what companies are searching for.
        Key insight for curriculum planning and student guidance.
        """
        try:
            # Get time period from entities
            period = entities.get('period', 'month')
            institution_id = entities.get('institution_id') or context.get('institution_id') if context else None

            # Fetch analytics data
            analytics = await self._fetch_search_analytics(institution_id, period)

            # Format top skills
            skills_list = []
            for skill, count in analytics.top_skills_searched[:10]:
                trend_emoji = "📈" if count > 50 else "📊"
                skills_list.append(f"{trend_emoji} **{skill}**: {count} searches")

            skills_text = "\n".join(skills_list)

            # Format top locations
            locations_list = []
            for location, count in analytics.top_locations_searched[:5]:
                locations_list.append(f"📍 {location}: {count} searches")

            locations_text = "\n".join(locations_list)

            # Trend indicator
            trend_emoji = "📈" if analytics.search_trend == "increasing" else "📉" if analytics.search_trend == "decreasing" else "➡️"

            return ActionResult(
                success=True,
                message=f"**📊 Search Analytics - Last {period.replace('_', ' ')}**\n\n"
                       f"**Overview:**\n"
                       f"• Total searches: **{analytics.total_searches:,}**\n"
                       f"• Unique companies: **{analytics.unique_companies}**\n"
                       f"• Your students viewed: **{analytics.your_students_viewed}** times\n"
                       f"• View-to-contact rate: **{analytics.conversion_rate:.1%}**\n"
                       f"• Trend: {trend_emoji} {analytics.search_trend.title()}\n\n"
                       f"**🔥 Most Searched Skills:**\n{skills_text}\n\n"
                       f"**📍 Top Locations:**\n{locations_text}\n\n"
                       f"**💡 Insight:** Companies are increasingly searching for "
                       f"{analytics.top_skills_searched[0][0] if analytics.top_skills_searched else 'various skills'}. "
                       f"Consider highlighting students with these skills.",
                data={
                    "analytics": {
                        "total_searches": analytics.total_searches,
                        "unique_companies": analytics.unique_companies,
                        "top_skills": analytics.top_skills_searched,
                        "top_locations": analytics.top_locations_searched,
                        "trend": analytics.search_trend,
                        "students_viewed": analytics.your_students_viewed,
                        "conversion_rate": analytics.conversion_rate
                    }
                },
                suggested_actions=[
                    {"label": "Skill Gap Analysis", "action": "skill_gaps"},
                    {"label": "Student Recommendations", "action": "recommend_students"},
                    {"label": "Export Report", "action": "export_analytics"}
                ]
            )

        except Exception as e:
            logger.error(f"Search analytics failed: {e}")
            return ActionResult(
                success=False,
                message="I couldn't fetch the analytics right now. Here's what I can tell you:\n\n"
                       "**General Market Trends:**\n"
                       "• Python, React, and Cloud skills are most searched\n"
                       "• Remote work searches have increased 40%\n"
                       "• Companies are looking for project-based evidence\n\n"
                       "Try again in a moment for your specific data.",
                suggested_actions=[
                    {"label": "Retry", "action": "retry_analytics"}
                ]
            )

    async def handle_skill_demand(
        self,
        entities: Dict[str, Any],
        user_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> ActionResult:
        """
        Aggregate skill demand data for curriculum planning.
        Shows what skills are most in demand vs what students have.
        """
        try:
            institution_id = entities.get('institution_id') or context.get('institution_id') if context else None

            # Fetch skill demand data
            demand_data = await self._fetch_skill_demand(institution_id)

            # Format skill gaps
            gaps = demand_data.get('skill_gaps', [])
            gaps_items = []
            for gap in gaps[:5]:
                demand = gap.get('market_demand', 0.8)
                supply = gap.get('student_supply', 0.3)
                gap_size = demand - supply
                emoji = "🔴" if gap_size > 0.4 else "🟡" if gap_size > 0.2 else "🟢"
                gaps_items.append(
                    f"{emoji} **{gap.get('skill')}**\n"
                    f"   Market demand: {int(demand*100)}% | Your students: {int(supply*100)}% | Gap: {int(gap_size*100)}%"
                )

            gaps_text = "\n\n".join(gaps_items)

            # Format strengths
            strengths = demand_data.get('strengths', [])
            strengths_items = [f"✅ {s}" for s in strengths[:5]]
            strengths_text = "\n".join(strengths_items)

            # Recommendations
            recommendations = demand_data.get('recommendations', [])
            rec_items = [f"• {r}" for r in recommendations[:4]]
            rec_text = "\n".join(rec_items)

            return ActionResult(
                success=True,
                message=f"**📊 Skill Demand Analysis**\n\n"
                       f"**🎯 Biggest Skill Gaps:**\n{gaps_text}\n\n"
                       f"**💪 Your Strengths:**\n{strengths_text}\n\n"
                       f"**💡 Recommendations:**\n{rec_text}\n\n"
                       f"These insights can help align curriculum with market needs.",
                data=demand_data,
                suggested_actions=[
                    {"label": "Detailed Report", "action": "detailed_gaps"},
                    {"label": "Student Training", "action": "training_suggestions"},
                    {"label": "Compare to Market", "action": "market_comparison"}
                ]
            )

        except Exception as e:
            logger.error(f"Skill demand analysis failed: {e}")
            return ActionResult(
                success=False,
                message="Here's a general skill demand overview:\n\n"
                       "**High Demand Skills (2024-2025):**\n"
                       "🔴 AI/ML, Cloud Computing, Cybersecurity\n"
                       "🟡 React, Python, Data Analysis\n"
                       "🟢 Project Management, Communication\n\n"
                       "Upload your student data for personalized analysis.",
                suggested_actions=[
                    {"label": "Upload Data", "action": "upload_data"}
                ]
            )

    async def handle_at_risk_students(
        self,
        entities: Dict[str, Any],
        user_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> ActionResult:
        """
        Identify students who may need intervention.
        Based on profile activity, completeness, and engagement.
        """
        try:
            institution_id = entities.get('institution_id') or context.get('institution_id') if context else None
            risk_level = entities.get('risk_level', 'all')  # 'high', 'medium', 'all'

            # Fetch at-risk students
            at_risk = await self._fetch_at_risk_students(institution_id, risk_level)

            if not at_risk:
                return ActionResult(
                    success=True,
                    message="**✅ Great news!**\n\n"
                           "No students are currently flagged as high-risk. "
                           "Your students are actively engaged with the platform.\n\n"
                           "**Keep up the good work by:**\n"
                           "• Encouraging project uploads\n"
                           "• Reminding students to complete profiles\n"
                           "• Sharing job opportunities",
                    data={"at_risk_count": 0},
                    suggested_actions=[
                        {"label": "View All Students", "action": "view_students"},
                        {"label": "Send Encouragement", "action": "bulk_message"}
                    ]
                )

            # Group by risk level
            high_risk = [s for s in at_risk if s.risk_level == 'high']
            medium_risk = [s for s in at_risk if s.risk_level == 'medium']

            # Format high risk students
            high_risk_items = []
            for student in high_risk[:5]:
                factors = ", ".join(student.risk_factors[:2])
                high_risk_items.append(
                    f"🔴 **{student.name}**\n"
                    f"   Profile: {int(student.profile_completeness*100)}% | "
                    f"Applications: {student.job_applications}\n"
                    f"   Issues: {factors}"
                )

            high_risk_text = "\n\n".join(high_risk_items) if high_risk_items else "None"

            # Summary stats
            total_at_risk = len(at_risk)
            high_count = len(high_risk)
            medium_count = len(medium_risk)

            return ActionResult(
                success=True,
                message=f"**⚠️ At-Risk Students Report**\n\n"
                       f"**Summary:**\n"
                       f"• 🔴 High risk: **{high_count}** students\n"
                       f"• 🟡 Medium risk: **{medium_count}** students\n"
                       f"• Total needing attention: **{total_at_risk}**\n\n"
                       f"**🔴 High Risk Students:**\n{high_risk_text}\n\n"
                       f"**Common Risk Factors:**\n"
                       f"• Incomplete profiles (< 50%)\n"
                       f"• No job applications in 30+ days\n"
                       f"• Missing projects\n"
                       f"• No recent activity\n\n"
                       f"**Recommended Actions:**\n"
                       f"• Send personalized outreach\n"
                       f"• Offer profile completion workshop\n"
                       f"• Connect with career counselor",
                data={
                    "at_risk_count": total_at_risk,
                    "high_risk": [s.__dict__ for s in high_risk[:10]],
                    "medium_risk_count": medium_count
                },
                suggested_actions=[
                    {"label": "Contact High Risk", "action": "contact_high_risk"},
                    {"label": "Schedule Workshop", "action": "schedule_workshop"},
                    {"label": "Export List", "action": "export_at_risk"}
                ]
            )

        except Exception as e:
            logger.error(f"At-risk students query failed: {e}")
            return ActionResult(
                success=False,
                message="I couldn't fetch the at-risk student data. "
                       "Here are general warning signs to watch for:\n\n"
                       "**At-Risk Indicators:**\n"
                       "• Profile completeness below 50%\n"
                       "• No login in 30+ days\n"
                       "• Zero job applications\n"
                       "• Missing portfolio projects\n\n"
                       "Check your dashboard for the full list.",
                suggested_actions=[
                    {"label": "Go to Dashboard", "action": "dashboard"}
                ]
            )

    async def handle_company_interest(
        self,
        entities: Dict[str, Any],
        user_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> ActionResult:
        """
        Track which companies are interested in institution's students.
        Shows company engagement metrics.
        """
        try:
            institution_id = entities.get('institution_id') or context.get('institution_id') if context else None
            period = entities.get('period', 'month')

            # Fetch company interest data
            interest_data = await self._fetch_company_interest(institution_id, period)

            # Format top companies
            companies = interest_data.get('top_companies', [])
            company_items = []
            for i, company in enumerate(companies[:8]):
                views = company.get('student_views', 0)
                messages = company.get('messages_sent', 0)
                industry = company.get('industry', 'Tech')
                company_items.append(
                    f"**{i+1}. {company.get('name', 'Company')}** ({industry})\n"
                    f"   👁️ {views} profile views | 💬 {messages} messages sent"
                )

            companies_text = "\n\n".join(company_items)

            # Industry breakdown
            industries = interest_data.get('industry_breakdown', {})
            industry_items = [f"• {ind}: {pct:.0%}" for ind, pct in industries.items()]
            industry_text = "\n".join(industry_items[:5])

            # Trend
            trend = interest_data.get('trend', 'stable')
            trend_emoji = "📈" if trend == 'increasing' else "📉" if trend == 'decreasing' else "➡️"

            return ActionResult(
                success=True,
                message=f"**🏢 Company Interest Report - Last {period.replace('_', ' ')}**\n\n"
                       f"**Overview:**\n"
                       f"• Companies viewing your students: **{interest_data.get('unique_companies', 0)}**\n"
                       f"• Total student views: **{interest_data.get('total_views', 0):,}**\n"
                       f"• Messages to students: **{interest_data.get('total_messages', 0)}**\n"
                       f"• Trend: {trend_emoji} {trend.title()}\n\n"
                       f"**🏆 Most Active Companies:**\n{companies_text}\n\n"
                       f"**📊 Industry Breakdown:**\n{industry_text}\n\n"
                       f"**💡 Opportunity:** Consider reaching out to top companies "
                       f"for career days or partnerships.",
                data=interest_data,
                suggested_actions=[
                    {"label": "Contact Top Companies", "action": "contact_companies"},
                    {"label": "Schedule Career Day", "action": "career_day"},
                    {"label": "View All Companies", "action": "all_companies"}
                ]
            )

        except Exception as e:
            logger.error(f"Company interest tracking failed: {e}")
            return ActionResult(
                success=False,
                message="I couldn't fetch company interest data. "
                       "Here's what typically drives company interest:\n\n"
                       "**Increase Company Engagement:**\n"
                       "• Ensure students have complete profiles\n"
                       "• Encourage project uploads with code samples\n"
                       "• Highlight unique skills and experiences\n"
                       "• Participate in platform events",
                suggested_actions=[
                    {"label": "Improve Visibility", "action": "visibility_tips"}
                ]
            )

    async def handle_benchmark_comparison(
        self,
        entities: Dict[str, Any],
        user_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> ActionResult:
        """
        Compare institution's performance against benchmarks.
        Shows how students compare to peers at other institutions.
        """
        try:
            institution_id = entities.get('institution_id') or context.get('institution_id') if context else None
            compare_to = entities.get('compare_to', 'national')  # 'national', 'regional', 'similar'

            # Fetch benchmark data
            benchmark = await self._fetch_benchmark_data(institution_id, compare_to)

            # Format metrics comparison
            metrics = benchmark.get('metrics', {})
            metrics_items = []
            for metric, data in metrics.items():
                your_value = data.get('your_value', 0)
                avg_value = data.get('average', 0)
                diff = your_value - avg_value
                emoji = "✅" if diff > 0 else "⚠️" if diff < -10 else "➡️"
                diff_text = f"+{diff:.0f}" if diff > 0 else f"{diff:.0f}"
                metrics_items.append(
                    f"{emoji} **{metric.replace('_', ' ').title()}**\n"
                    f"   You: {your_value:.0f}% | Average: {avg_value:.0f}% | {diff_text}%"
                )

            metrics_text = "\n\n".join(metrics_items)

            # Ranking
            ranking = benchmark.get('ranking', {})
            rank = ranking.get('position', 'N/A')
            total = ranking.get('total', 'N/A')

            # Strengths and improvements
            strengths = benchmark.get('strengths', [])
            improvements = benchmark.get('improvements', [])

            strengths_text = "\n".join([f"✅ {s}" for s in strengths[:3]])
            improvements_text = "\n".join([f"⚠️ {i}" for i in improvements[:3]])

            return ActionResult(
                success=True,
                message=f"**📊 Benchmark Comparison - {compare_to.title()} Average**\n\n"
                       f"**Your Ranking:** #{rank} of {total} institutions\n\n"
                       f"**Key Metrics:**\n{metrics_text}\n\n"
                       f"**💪 Your Strengths:**\n{strengths_text}\n\n"
                       f"**📈 Areas to Improve:**\n{improvements_text}\n\n"
                       f"**💡 Recommendation:** Focus on improving "
                       f"{improvements[0] if improvements else 'overall engagement'} "
                       f"to move up in rankings.",
                data=benchmark,
                suggested_actions=[
                    {"label": "Detailed Breakdown", "action": "detailed_benchmark"},
                    {"label": "Improvement Plan", "action": "improvement_plan"},
                    {"label": "Compare Similar Schools", "action": "similar_comparison"}
                ]
            )

        except Exception as e:
            logger.error(f"Benchmark comparison failed: {e}")
            return ActionResult(
                success=False,
                message="I couldn't fetch benchmark data. "
                       "Here are typical performance indicators:\n\n"
                       "**Key Metrics to Track:**\n"
                       "• Profile completion rate (target: 80%+)\n"
                       "• Average projects per student (target: 2+)\n"
                       "• Company engagement rate\n"
                       "• Placement rate within 6 months\n"
                       "• Student activity rate",
                suggested_actions=[
                    {"label": "View Your Metrics", "action": "view_metrics"}
                ]
            )

    async def handle_partnership_info(
        self,
        entities: Dict[str, Any],
        user_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> ActionResult:
        """
        Provide information about institutional partnerships.
        """
        try:
            return ActionResult(
                success=True,
                message="**🤝 InTransparency Partnership Program**\n\n"
                       "**Free Tier (You're here!):**\n"
                       "• Basic analytics dashboard\n"
                       "• Student profile visibility\n"
                       "• Company interest tracking\n"
                       "• Monthly reports\n\n"
                       "**Premium Features:**\n"
                       "• 📊 Advanced analytics & benchmarking\n"
                       "• 🎯 At-risk student identification\n"
                       "• 🏢 Company partnership management\n"
                       "• 📧 Bulk communication tools\n"
                       "• 🔗 Embeddable widget for your website\n"
                       "• 📈 Custom reporting\n"
                       "• 👥 Priority support\n\n"
                       "**Cost Comparison:**\n"
                       "• InTransparency: Starting at €99/month\n"
                       "• vs AlmaLaurea: ~€2,500/year\n"
                       "• **Save 50%+** while getting more features!\n\n"
                       "Would you like to explore premium features?",
                data={
                    "current_tier": "free",
                    "premium_price": 99,
                    "comparison_savings": "50%+"
                },
                suggested_actions=[
                    {"label": "Upgrade to Premium", "action": "upgrade"},
                    {"label": "Schedule Demo", "action": "demo"},
                    {"label": "View Current Features", "action": "features"}
                ]
            )

        except Exception as e:
            logger.error(f"Partnership info failed: {e}")
            return ActionResult(
                success=False,
                message="Contact us at partnerships@intransparency.com for more information.",
                suggested_actions=[
                    {"label": "Contact Us", "action": "contact"}
                ]
            )

    async def handle_conversational_query(
        self,
        query: str,
        entities: Dict[str, Any],
        user_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> ActionResult:
        """
        Handle free-form conversational queries about analytics.
        Uses NLP to understand and route queries.
        """
        query_lower = query.lower()

        # Route based on query content
        if any(word in query_lower for word in ['search', 'searching', 'looking for', 'cercano']):
            return await self.handle_search_analytics(entities, user_id, context)

        elif any(word in query_lower for word in ['skill', 'competenz', 'demand', 'gap']):
            return await self.handle_skill_demand(entities, user_id, context)

        elif any(word in query_lower for word in ['risk', 'rischio', 'at-risk', 'intervention', 'help']):
            return await self.handle_at_risk_students(entities, user_id, context)

        elif any(word in query_lower for word in ['company', 'companies', 'aziend', 'interest']):
            return await self.handle_company_interest(entities, user_id, context)

        elif any(word in query_lower for word in ['benchmark', 'compare', 'ranking', 'other school']):
            return await self.handle_benchmark_comparison(entities, user_id, context)

        elif any(word in query_lower for word in ['partnership', 'premium', 'upgrade', 'pricing']):
            return await self.handle_partnership_info(entities, user_id, context)

        # Default: show available analytics
        return ActionResult(
            success=True,
            message="**📊 What Would You Like to Know?**\n\n"
                   "I can help you with:\n\n"
                   "• **Search Analytics** - What companies are searching for\n"
                   "• **Skill Demand** - Market demand vs your student skills\n"
                   "• **At-Risk Students** - Students needing intervention\n"
                   "• **Company Interest** - Who's viewing your students\n"
                   "• **Benchmarks** - Compare with other institutions\n"
                   "• **Partnership Info** - Upgrade options\n\n"
                   "Just ask! For example:\n"
                   "• 'What skills are companies searching for?'\n"
                   "• 'Show me at-risk students'\n"
                   "• 'Which companies are interested in us?'",
            suggested_actions=[
                {"label": "Search Analytics", "action": "search_analytics"},
                {"label": "Skill Gaps", "action": "skill_gaps"},
                {"label": "At-Risk Students", "action": "at_risk"},
                {"label": "Company Interest", "action": "company_interest"}
            ]
        )

    # Helper methods for data fetching

    async def _fetch_search_analytics(
        self,
        institution_id: Optional[str],
        period: str
    ) -> SearchAnalytics:
        """Fetch search analytics from backend or generate sample data"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.backend_api_url}/api/analytics/searches",
                    params={"institution_id": institution_id, "period": period},
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    timeout=10.0
                )
                if response.status_code == 200:
                    data = response.json()
                    return SearchAnalytics(**data)
        except Exception as e:
            logger.error(f"Failed to fetch search analytics: {e}")

        # Return sample data
        return SearchAnalytics(
            total_searches=2847,
            unique_companies=156,
            top_skills_searched=[
                ("Python", 342), ("React", 289), ("JavaScript", 256),
                ("AWS", 198), ("Machine Learning", 167), ("SQL", 145),
                ("Docker", 132), ("TypeScript", 118), ("Node.js", 98),
                ("Cybersecurity", 87)
            ],
            top_locations_searched=[
                ("Milan", 523), ("Rome", 412), ("Turin", 234),
                ("Bologna", 198), ("Remote", 456)
            ],
            search_trend="increasing",
            period=period,
            your_students_viewed=423,
            conversion_rate=0.12
        )

    async def _fetch_skill_demand(
        self,
        institution_id: Optional[str]
    ) -> Dict[str, Any]:
        """Fetch skill demand data"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.backend_api_url}/api/analytics/skill-demand",
                    params={"institution_id": institution_id},
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    timeout=10.0
                )
                if response.status_code == 200:
                    return response.json()
        except Exception as e:
            logger.error(f"Failed to fetch skill demand: {e}")

        # Return sample data
        return {
            "skill_gaps": [
                {"skill": "Cloud Computing (AWS/Azure)", "market_demand": 0.85, "student_supply": 0.35},
                {"skill": "Machine Learning", "market_demand": 0.78, "student_supply": 0.28},
                {"skill": "Cybersecurity", "market_demand": 0.82, "student_supply": 0.22},
                {"skill": "DevOps/CI-CD", "market_demand": 0.75, "student_supply": 0.30},
                {"skill": "React/Modern Frontend", "market_demand": 0.80, "student_supply": 0.55},
            ],
            "strengths": [
                "Strong Python fundamentals",
                "Good database knowledge",
                "Solid problem-solving skills",
                "Project-based learning evident"
            ],
            "recommendations": [
                "Add cloud computing modules to curriculum",
                "Partner with AWS/Azure for student certifications",
                "Introduce cybersecurity fundamentals course",
                "Expand ML/AI practical projects"
            ]
        }

    async def _fetch_at_risk_students(
        self,
        institution_id: Optional[str],
        risk_level: str
    ) -> List[StudentRiskProfile]:
        """Fetch at-risk students data"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.backend_api_url}/api/analytics/at-risk-students",
                    params={"institution_id": institution_id, "risk_level": risk_level},
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    timeout=10.0
                )
                if response.status_code == 200:
                    data = response.json()
                    return [StudentRiskProfile(**s) for s in data.get('students', [])]
        except Exception as e:
            logger.error(f"Failed to fetch at-risk students: {e}")

        # Return sample data
        return [
            StudentRiskProfile(
                student_id="stu_001",
                name="Giuseppe Esposito",
                risk_level="high",
                risk_factors=["Profile 25% complete", "No activity in 45 days", "Zero applications"],
                recommendations=["Personal outreach", "Profile workshop"],
                last_activity=datetime.now() - timedelta(days=45),
                profile_completeness=0.25,
                job_applications=0
            ),
            StudentRiskProfile(
                student_id="stu_002",
                name="Francesca Romano",
                risk_level="high",
                risk_factors=["No projects uploaded", "Missing skills section"],
                recommendations=["Project guidance", "Skill assessment"],
                last_activity=datetime.now() - timedelta(days=30),
                profile_completeness=0.40,
                job_applications=1
            ),
            StudentRiskProfile(
                student_id="stu_003",
                name="Andrea Colombo",
                risk_level="medium",
                risk_factors=["Only 1 project", "Low engagement"],
                recommendations=["Encourage project uploads"],
                last_activity=datetime.now() - timedelta(days=14),
                profile_completeness=0.60,
                job_applications=2
            ),
        ]

    async def _fetch_company_interest(
        self,
        institution_id: Optional[str],
        period: str
    ) -> Dict[str, Any]:
        """Fetch company interest data"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.backend_api_url}/api/analytics/company-interest",
                    params={"institution_id": institution_id, "period": period},
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    timeout=10.0
                )
                if response.status_code == 200:
                    return response.json()
        except Exception as e:
            logger.error(f"Failed to fetch company interest: {e}")

        # Return sample data
        return {
            "unique_companies": 89,
            "total_views": 1247,
            "total_messages": 156,
            "trend": "increasing",
            "top_companies": [
                {"name": "Accenture", "industry": "Consulting", "student_views": 89, "messages_sent": 12},
                {"name": "Intesa Sanpaolo", "industry": "Banking", "student_views": 67, "messages_sent": 8},
                {"name": "Reply", "industry": "Tech", "student_views": 54, "messages_sent": 15},
                {"name": "Deloitte", "industry": "Consulting", "student_views": 48, "messages_sent": 6},
                {"name": "Amazon", "industry": "Tech", "student_views": 45, "messages_sent": 9},
                {"name": "Enel", "industry": "Energy", "student_views": 38, "messages_sent": 4},
                {"name": "TIM", "industry": "Telecom", "student_views": 34, "messages_sent": 5},
                {"name": "UniCredit", "industry": "Banking", "student_views": 31, "messages_sent": 3},
            ],
            "industry_breakdown": {
                "Tech": 0.35,
                "Consulting": 0.25,
                "Banking/Finance": 0.18,
                "Manufacturing": 0.12,
                "Other": 0.10
            }
        }

    async def _fetch_benchmark_data(
        self,
        institution_id: Optional[str],
        compare_to: str
    ) -> Dict[str, Any]:
        """Fetch benchmark comparison data"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.backend_api_url}/api/analytics/benchmark",
                    params={"institution_id": institution_id, "compare_to": compare_to},
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    timeout=10.0
                )
                if response.status_code == 200:
                    return response.json()
        except Exception as e:
            logger.error(f"Failed to fetch benchmark data: {e}")

        # Return sample data
        return {
            "ranking": {"position": 12, "total": 85},
            "metrics": {
                "profile_completion": {"your_value": 72, "average": 65},
                "projects_per_student": {"your_value": 1.8, "average": 1.5},
                "company_engagement": {"your_value": 45, "average": 52},
                "placement_rate": {"your_value": 78, "average": 71},
                "student_activity": {"your_value": 68, "average": 61}
            },
            "strengths": [
                "Higher than average profile completion",
                "Good placement rate",
                "Active student base"
            ],
            "improvements": [
                "Company engagement could improve",
                "Increase average projects per student",
                "More industry partnerships needed"
            ]
        }
