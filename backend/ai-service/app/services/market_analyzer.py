#!/usr/bin/env python3
"""
Market Analyzer Service
AI-powered market trend analysis and career insights
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any, Tuple
import openai
from dataclasses import dataclass
from enum import Enum
import json
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class TrendDirection(Enum):
    RISING = "rising"
    STABLE = "stable"
    DECLINING = "declining"
    EMERGING = "emerging"

class IndustrySegment(Enum):
    FINTECH = "fintech"
    HEALTHCARE = "healthcare"
    ECOMMERCE = "ecommerce"
    GAMING = "gaming"
    ENTERPRISE = "enterprise"
    STARTUPS = "startups"
    GOVERNMENT = "government"
    EDUCATION = "education"

@dataclass
class MarketTrend:
    technology: str
    trend_direction: TrendDirection
    growth_rate: float
    demand_score: float
    salary_impact: float
    time_horizon: str
    description: str
    supporting_evidence: List[str]

@dataclass
class JobMarketInsight:
    role_title: str
    demand_level: float
    salary_range: Dict[str, int]
    growth_projection: float
    required_skills: List[str]
    emerging_skills: List[str]
    industry_distribution: Dict[str, float]

class MarketAnalyzer:
    def __init__(self):
        self.client = openai.AsyncOpenAI()
        
        # Technology categories for analysis
        self.tech_categories = {
            "programming_languages": [
                "Python", "JavaScript", "TypeScript", "Java", "Go", "Rust", 
                "Swift", "Kotlin", "C#", "PHP", "Ruby"
            ],
            "frameworks": [
                "React", "Angular", "Vue.js", "Django", "Flask", "Spring Boot",
                "Express.js", "Next.js", "FastAPI", "Laravel"
            ],
            "cloud_platforms": [
                "AWS", "Azure", "Google Cloud", "Kubernetes", "Docker",
                "Serverless", "Microservices"
            ],
            "data_technologies": [
                "Machine Learning", "Data Science", "Big Data", "AI/ML",
                "TensorFlow", "PyTorch", "Spark", "Hadoop"
            ],
            "emerging_tech": [
                "Blockchain", "Web3", "Metaverse", "IoT", "Edge Computing",
                "Quantum Computing", "AR/VR"
            ]
        }

    async def analyze_market_trends(
        self,
        technologies: List[str],
        time_horizon: str = "1_year",
        industry_focus: Optional[str] = None
    ) -> Dict[str, Any]:
        """Analyze market trends for specified technologies"""
        try:
            trends = []
            
            for tech in technologies:
                trend = await self._analyze_technology_trend(
                    tech, time_horizon, industry_focus
                )
                trends.append(trend)
            
            # Generate overall market insights
            market_summary = await self._generate_market_summary(trends, time_horizon)
            
            # Identify hot and declining technologies
            hot_technologies = [t for t in trends if t.trend_direction in [TrendDirection.RISING, TrendDirection.EMERGING]]
            declining_technologies = [t for t in trends if t.trend_direction == TrendDirection.DECLINING]
            
            # Generate recommendations
            recommendations = await self._generate_technology_recommendations(trends)
            
            return {
                "trends": [self._trend_to_dict(t) for t in trends],
                "market_summary": market_summary,
                "hot_technologies": [t.technology for t in hot_technologies],
                "declining_technologies": [t.technology for t in declining_technologies],
                "recommendations": recommendations,
                "analysis_date": datetime.now().isoformat(),
                "time_horizon": time_horizon
            }
            
        except Exception as e:
            logger.error(f"Market trend analysis failed: {str(e)}")
            raise

    async def analyze_job_market(
        self,
        role_titles: List[str],
        location: Optional[str] = None,
        experience_level: str = "mid"
    ) -> Dict[str, Any]:
        """Analyze job market for specific roles"""
        try:
            job_insights = []
            
            for role in role_titles:
                insight = await self._analyze_role_market(role, location, experience_level)
                job_insights.append(insight)
            
            # Generate market overview
            market_overview = await self._generate_job_market_overview(job_insights, location)
            
            # Identify high-demand roles
            high_demand_roles = [
                insight for insight in job_insights 
                if insight.demand_level > 0.7
            ]
            
            return {
                "job_insights": [self._job_insight_to_dict(j) for j in job_insights],
                "market_overview": market_overview,
                "high_demand_roles": [j.role_title for j in high_demand_roles],
                "analysis_date": datetime.now().isoformat(),
                "location": location,
                "experience_level": experience_level
            }
            
        except Exception as e:
            logger.error(f"Job market analysis failed: {str(e)}")
            raise

    async def get_salary_insights(
        self,
        skills: List[str],
        role_title: str,
        location: Optional[str] = None,
        experience_years: int = 3
    ) -> Dict[str, Any]:
        """Get salary insights based on skills and role"""
        try:
            # Analyze skill value in market
            skill_values = await self._analyze_skill_values(skills, role_title)
            
            # Get base salary estimate
            base_salary = await self._estimate_base_salary(role_title, location, experience_years)
            
            # Calculate skill premiums
            skill_premiums = await self._calculate_skill_premiums(skills, role_title)
            
            # Generate salary recommendations
            salary_recommendations = await self._generate_salary_recommendations(
                skills, role_title, location, experience_years
            )
            
            return {
                "base_salary_range": base_salary,
                "skill_values": skill_values,
                "skill_premiums": skill_premiums,
                "total_estimated_range": self._calculate_total_salary_range(base_salary, skill_premiums),
                "recommendations": salary_recommendations,
                "analysis_date": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Salary analysis failed: {str(e)}")
            raise

    async def _analyze_technology_trend(
        self,
        technology: str,
        time_horizon: str,
        industry_focus: Optional[str]
    ) -> MarketTrend:
        """Analyze trend for a specific technology"""
        
        industry_context = f" in the {industry_focus} industry" if industry_focus else ""
        
        try:
            prompt = f"""
            Analyze the market trend for {technology}{industry_context} over the next {time_horizon.replace('_', ' ')}.
            
            Provide analysis on:
            1. Trend direction (rising, stable, declining, emerging)
            2. Growth rate percentage
            3. Market demand score (0.0-1.0)
            4. Salary impact factor (0.0-2.0, where 1.0 is neutral)
            5. Brief description of the trend
            6. Key evidence supporting this trend
            
            Format as JSON:
            {{
                "trend_direction": "rising|stable|declining|emerging",
                "growth_rate": number,
                "demand_score": number,
                "salary_impact": number,
                "description": "string",
                "evidence": ["point1", "point2", "point3"]
            }}
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=400,
                temperature=0.3
            )
            
            trend_data = json.loads(response.choices[0].message.content.strip())
            
            return MarketTrend(
                technology=technology,
                trend_direction=TrendDirection(trend_data["trend_direction"]),
                growth_rate=trend_data["growth_rate"],
                demand_score=trend_data["demand_score"],
                salary_impact=trend_data["salary_impact"],
                time_horizon=time_horizon,
                description=trend_data["description"],
                supporting_evidence=trend_data["evidence"]
            )
            
        except Exception as e:
            logger.error(f"Technology trend analysis failed for {technology}: {str(e)}")
            # Return default trend
            return MarketTrend(
                technology=technology,
                trend_direction=TrendDirection.STABLE,
                growth_rate=5.0,
                demand_score=0.7,
                salary_impact=1.0,
                time_horizon=time_horizon,
                description=f"{technology} maintains steady market presence",
                supporting_evidence=["Continued industry adoption", "Stable job postings"]
            )

    async def _analyze_role_market(
        self,
        role_title: str,
        location: Optional[str],
        experience_level: str
    ) -> JobMarketInsight:
        """Analyze job market for a specific role"""
        
        location_context = f" in {location}" if location else " globally"
        
        try:
            prompt = f"""
            Analyze the job market for {role_title}{location_context} at {experience_level} level.
            
            Provide:
            1. Market demand level (0.0-1.0)
            2. Salary range (min, max, median in USD)
            3. Growth projection percentage for next 2 years
            4. Top 5 required skills
            5. Top 3 emerging skills
            6. Industry distribution percentages
            
            Format as JSON:
            {{
                "demand_level": number,
                "salary_range": {{"min": number, "max": number, "median": number}},
                "growth_projection": number,
                "required_skills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
                "emerging_skills": ["skill1", "skill2", "skill3"],
                "industry_distribution": {{"tech": number, "finance": number, "healthcare": number, "other": number}}
            }}
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500,
                temperature=0.3
            )
            
            job_data = json.loads(response.choices[0].message.content.strip())
            
            return JobMarketInsight(
                role_title=role_title,
                demand_level=job_data["demand_level"],
                salary_range=job_data["salary_range"],
                growth_projection=job_data["growth_projection"],
                required_skills=job_data["required_skills"],
                emerging_skills=job_data["emerging_skills"],
                industry_distribution=job_data["industry_distribution"]
            )
            
        except Exception as e:
            logger.error(f"Role market analysis failed for {role_title}: {str(e)}")
            # Return default insight
            return JobMarketInsight(
                role_title=role_title,
                demand_level=0.6,
                salary_range={"min": 60000, "max": 120000, "median": 90000},
                growth_projection=8.0,
                required_skills=["Programming", "Problem Solving", "Communication"],
                emerging_skills=["Cloud Computing", "AI/ML", "DevOps"],
                industry_distribution={"tech": 40, "finance": 20, "healthcare": 15, "other": 25}
            )

    async def _generate_market_summary(
        self,
        trends: List[MarketTrend],
        time_horizon: str
    ) -> str:
        """Generate overall market summary"""
        
        try:
            trends_summary = []
            for trend in trends:
                trends_summary.append(f"{trend.technology}: {trend.trend_direction.value} ({trend.growth_rate}% growth)")
            
            prompt = f"""
            Generate a concise market summary for the next {time_horizon.replace('_', ' ')} based on these technology trends:
            
            {chr(10).join(trends_summary)}
            
            Highlight:
            - Overall market direction
            - Key opportunities
            - Notable risks
            - Strategic recommendations
            
            Keep it professional and actionable, 3-4 sentences.
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=200,
                temperature=0.5
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"Market summary generation failed: {str(e)}")
            return "Technology market shows continued growth with opportunities in cloud computing, AI/ML, and modern development frameworks."

    async def _generate_technology_recommendations(self, trends: List[MarketTrend]) -> List[str]:
        """Generate technology investment recommendations"""
        
        try:
            high_potential = [
                t for t in trends 
                if t.demand_score > 0.7 and t.trend_direction in [TrendDirection.RISING, TrendDirection.EMERGING]
            ]
            
            recommendations = []
            
            for trend in high_potential[:5]:  # Top 5
                if trend.trend_direction == TrendDirection.EMERGING:
                    recommendations.append(f"Consider early adoption of {trend.technology} for competitive advantage")
                else:
                    recommendations.append(f"Invest in {trend.technology} skills - high demand and {trend.growth_rate}% growth")
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Technology recommendations generation failed: {str(e)}")
            return ["Focus on cloud technologies", "Develop AI/ML capabilities", "Strengthen full-stack skills"]

    async def _generate_job_market_overview(
        self,
        job_insights: List[JobMarketInsight],
        location: Optional[str]
    ) -> str:
        """Generate job market overview"""
        
        try:
            avg_demand = sum(j.demand_level for j in job_insights) / len(job_insights)
            avg_growth = sum(j.growth_projection for j in job_insights) / len(job_insights)
            
            high_demand_roles = [j.role_title for j in job_insights if j.demand_level > 0.7]
            
            location_text = f"in {location} " if location else ""
            
            prompt = f"""
            Generate a job market overview {location_text}based on:
            - Average demand level: {avg_demand:.1f}/1.0
            - Average growth projection: {avg_growth:.1f}%
            - High-demand roles: {', '.join(high_demand_roles)}
            
            Provide insights on:
            - Market health
            - Best opportunities
            - Skill priorities
            
            Keep it concise and actionable, 3-4 sentences.
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=200,
                temperature=0.5
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"Job market overview generation failed: {str(e)}")
            return "Job market shows strong demand for technical roles with continued growth expected across multiple sectors."

    async def _analyze_skill_values(
        self,
        skills: List[str],
        role_title: str
    ) -> Dict[str, float]:
        """Analyze market value of specific skills"""
        
        skill_values = {}
        
        for skill in skills[:10]:  # Limit to top 10 skills
            try:
                prompt = f"""
                Rate the market value of {skill} for {role_title} roles on a scale of 0.0-1.0.
                
                Consider:
                - Demand in job postings
                - Salary premiums
                - Difficulty to find candidates
                - Strategic importance
                
                Return only the numerical score.
                """
                
                response = await self.client.chat.completions.create(
                    model="gpt-4",
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=50,
                    temperature=0.1
                )
                
                score = float(response.choices[0].message.content.strip())
                skill_values[skill] = score
                
            except Exception as e:
                logger.error(f"Skill value analysis failed for {skill}: {str(e)}")
                skill_values[skill] = 0.6  # Default moderate value
        
        return skill_values

    async def _estimate_base_salary(
        self,
        role_title: str,
        location: Optional[str],
        experience_years: int
    ) -> Dict[str, int]:
        """Estimate base salary range"""
        
        location_context = f" in {location}" if location else " in major tech markets"
        
        try:
            prompt = f"""
            Estimate salary range for {role_title}{location_context} with {experience_years} years experience.
            
            Provide realistic USD amounts for:
            - 25th percentile (min)
            - 50th percentile (median)
            - 75th percentile (max)
            
            Format as JSON: {{"min": number, "median": number, "max": number}}
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=100,
                temperature=0.1
            )
            
            salary_data = json.loads(response.choices[0].message.content.strip())
            return salary_data
            
        except Exception as e:
            logger.error(f"Base salary estimation failed: {str(e)}")
            # Default ranges based on experience
            base = 50000 + (experience_years * 10000)
            return {
                "min": int(base * 0.8),
                "median": base,
                "max": int(base * 1.4)
            }

    async def _calculate_skill_premiums(
        self,
        skills: List[str],
        role_title: str
    ) -> Dict[str, float]:
        """Calculate salary premiums for specific skills"""
        
        skill_premiums = {}
        
        for skill in skills[:10]:  # Limit to top 10 skills
            try:
                prompt = f"""
                Estimate the salary premium percentage for {skill} in {role_title} roles.
                
                Consider:
                - Skill rarity
                - Market demand
                - Typical salary uplift
                
                Return percentage as decimal (e.g., 0.15 for 15% premium, 0.0 for no premium).
                Return only the number.
                """
                
                response = await self.client.chat.completions.create(
                    model="gpt-4",
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=50,
                    temperature=0.1
                )
                
                premium = float(response.choices[0].message.content.strip())
                skill_premiums[skill] = premium
                
            except Exception as e:
                logger.error(f"Skill premium calculation failed for {skill}: {str(e)}")
                skill_premiums[skill] = 0.05  # Default 5% premium
        
        return skill_premiums

    def _calculate_total_salary_range(
        self,
        base_salary: Dict[str, int],
        skill_premiums: Dict[str, float]
    ) -> Dict[str, int]:
        """Calculate total salary range including skill premiums"""
        
        total_premium = sum(skill_premiums.values())
        premium_multiplier = 1 + total_premium
        
        return {
            "min": int(base_salary["min"] * premium_multiplier),
            "median": int(base_salary["median"] * premium_multiplier),
            "max": int(base_salary["max"] * premium_multiplier)
        }

    async def _generate_salary_recommendations(
        self,
        skills: List[str],
        role_title: str,
        location: Optional[str],
        experience_years: int
    ) -> List[str]:
        """Generate salary negotiation recommendations"""
        
        try:
            skills_text = ", ".join(skills[:5])  # Top 5 skills
            location_text = f" in {location}" if location else ""
            
            prompt = f"""
            Generate 3-4 salary negotiation recommendations for a {role_title}{location_text} with {experience_years} years experience and skills in {skills_text}.
            
            Include advice on:
            - Market positioning
            - Skill value proposition
            - Negotiation strategy
            - Additional compensation factors
            
            Format as actionable bullet points.
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=250,
                temperature=0.6
            )
            
            recommendations_text = response.choices[0].message.content.strip()
            return [r.strip("- ").strip() for r in recommendations_text.split("\n") if r.strip()]
            
        except Exception as e:
            logger.error(f"Salary recommendations generation failed: {str(e)}")
            return [
                "Research market rates for your skill combination",
                "Highlight unique technical competencies",
                "Consider total compensation package",
                "Document measurable achievements"
            ]

    def _trend_to_dict(self, trend: MarketTrend) -> Dict[str, Any]:
        """Convert MarketTrend to dictionary"""
        return {
            "technology": trend.technology,
            "trend_direction": trend.trend_direction.value,
            "growth_rate": trend.growth_rate,
            "demand_score": trend.demand_score,
            "salary_impact": trend.salary_impact,
            "time_horizon": trend.time_horizon,
            "description": trend.description,
            "supporting_evidence": trend.supporting_evidence
        }

    def _job_insight_to_dict(self, insight: JobMarketInsight) -> Dict[str, Any]:
        """Convert JobMarketInsight to dictionary"""
        return {
            "role_title": insight.role_title,
            "demand_level": insight.demand_level,
            "salary_range": insight.salary_range,
            "growth_projection": insight.growth_projection,
            "required_skills": insight.required_skills,
            "emerging_skills": insight.emerging_skills,
            "industry_distribution": insight.industry_distribution
        }