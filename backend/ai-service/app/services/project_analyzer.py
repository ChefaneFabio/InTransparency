import openai
import os
import json
import re
from typing import Dict, List, Optional, Any
import asyncio
from datetime import datetime

class ProjectAnalyzer:
    def __init__(self):
        self.openai_client = openai.OpenAI(
            api_key=os.getenv("OPENAI_API_KEY")
        )
        
        # Technology categories and their weights
        self.tech_categories = {
            "Frontend": {
                "technologies": ["React", "Vue", "Angular", "HTML", "CSS", "JavaScript", "TypeScript", "Svelte"],
                "complexity_weight": 1.0
            },
            "Backend": {
                "technologies": ["Node.js", "Python", "Java", "C#", "Go", "Rust", "PHP", "Ruby"],
                "complexity_weight": 1.2
            },
            "Database": {
                "technologies": ["PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Cassandra"],
                "complexity_weight": 1.1
            },
            "Cloud": {
                "technologies": ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform"],
                "complexity_weight": 1.3
            },
            "AI/ML": {
                "technologies": ["TensorFlow", "PyTorch", "scikit-learn", "OpenAI", "Hugging Face"],
                "complexity_weight": 1.5
            },
            "Mobile": {
                "technologies": ["React Native", "Flutter", "Swift", "Kotlin", "Xamarin"],
                "complexity_weight": 1.2
            }
        }

    async def analyze_project(
        self,
        title: str,
        description: str,
        technologies: List[str],
        category: Optional[str] = None,
        repository_url: Optional[str] = None,
        project_files: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Comprehensive project analysis using AI and rule-based scoring.
        """
        try:
            # Parallel analysis tasks
            tasks = [
                self._analyze_with_ai(title, description, technologies, category),
                self._calculate_complexity_score(technologies, description),
                self._assess_market_relevance(title, description, category),
                self._extract_learning_outcomes(description, technologies),
                self._generate_improvement_suggestions(description, technologies),
                self._assess_technical_depth(technologies, description)
            ]
            
            results = await asyncio.gather(*tasks)
            
            ai_analysis = results[0]
            complexity_score = results[1]
            market_relevance = results[2]
            learning_outcomes = results[3]
            improvement_suggestions = results[4]
            technical_depth = results[5]
            
            # Calculate innovation score
            innovation_score = await self._calculate_innovation_score(
                title, description, technologies, category
            )
            
            # Determine complexity level
            complexity_level = self._determine_complexity_level(complexity_score)
            
            # Calculate skill level (1-10)
            skill_level = min(10, max(1, int(complexity_score / 10)))
            
            # Generate professional story
            professional_story = await self._generate_professional_story(
                title, description, technologies, ai_analysis.get("key_strengths", [])
            )
            
            # Extract and enhance tags
            tags = await self._extract_enhanced_tags(title, description, technologies)
            
            # Technology assessment
            tech_assessment = self._assess_technologies(technologies)
            
            return {
                "innovation_score": innovation_score,
                "complexity_level": complexity_level,
                "skill_level": skill_level,
                "technical_depth": technical_depth,
                "market_relevance": market_relevance,
                "learning_outcomes": learning_outcomes,
                "improvement_suggestions": improvement_suggestions,
                "key_strengths": ai_analysis.get("key_strengths", []),
                "technology_assessment": tech_assessment,
                "professional_story": professional_story,
                "tags": tags,
                "ai_insights": ai_analysis,
                "analysis_timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"Project analysis error: {e}")
            return self._fallback_analysis(title, description, technologies)

    async def _analyze_with_ai(
        self,
        title: str,
        description: str,
        technologies: List[str],
        category: Optional[str]
    ) -> Dict[str, Any]:
        """
        Use OpenAI to analyze the project comprehensively.
        """
        try:
            prompt = f"""
            Analyze this academic/professional project:

            Title: {title}
            Description: {description}
            Technologies: {', '.join(technologies)}
            Category: {category or 'Not specified'}

            Provide a detailed analysis in JSON format with:
            1. key_strengths: List of 3-5 main strengths
            2. innovation_aspects: What makes this project innovative
            3. technical_challenges: Technical challenges likely faced
            4. learning_value: Educational value and skills developed
            5. industry_relevance: How relevant to current industry needs
            6. scalability_potential: Can this project be scaled up
            7. code_quality_indicators: Signs of good/poor code quality
            8. project_maturity: How complete/mature the project appears

            Respond only with valid JSON.
            """

            response = await asyncio.to_thread(
                self.openai_client.chat.completions.create,
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=1000
            )
            
            content = response.choices[0].message.content
            return json.loads(content)
            
        except Exception as e:
            print(f"AI analysis error: {e}")
            return {
                "key_strengths": ["Uses modern technologies", "Addresses real problem"],
                "innovation_aspects": "Combines existing technologies effectively",
                "technical_challenges": "Integration and performance optimization",
                "learning_value": "Full-stack development experience",
                "industry_relevance": "High demand for similar solutions",
                "scalability_potential": "Good foundation for scaling",
                "code_quality_indicators": "Standard implementation patterns",
                "project_maturity": "Functional prototype"
            }

    async def _calculate_complexity_score(
        self,
        technologies: List[str],
        description: str
    ) -> float:
        """
        Calculate project complexity score (0-100).
        """
        score = 0
        
        # Base score from technology count
        score += min(len(technologies) * 5, 30)
        
        # Technology-specific scoring
        for tech in technologies:
            for category, data in self.tech_categories.items():
                if any(t.lower() in tech.lower() for t in data["technologies"]):
                    score += data["complexity_weight"] * 10
                    break
        
        # Description complexity indicators
        complexity_keywords = [
            "microservices", "distributed", "real-time", "machine learning",
            "ai", "blockchain", "kubernetes", "docker", "ci/cd", "testing",
            "authentication", "authorization", "api", "database", "cloud",
            "responsive", "mobile", "progressive web app", "scalable"
        ]
        
        description_lower = description.lower()
        for keyword in complexity_keywords:
            if keyword in description_lower:
                score += 3
        
        # Integration complexity
        if len(technologies) > 5:
            score += 10  # Integration bonus
            
        return min(score, 100)

    async def _assess_market_relevance(
        self,
        title: str,
        description: str,
        category: Optional[str]
    ) -> int:
        """
        Assess market relevance (1-10).
        """
        try:
            prompt = f"""
            Rate the market relevance of this project (1-10 scale):
            
            Title: {title}
            Description: {description}
            Category: {category or 'Not specified'}
            
            Consider:
            - Current industry demand
            - Problem relevance
            - Technology trends
            - Commercial potential
            
            Respond with only a number (1-10).
            """

            response = await asyncio.to_thread(
                self.openai_client.chat.completions.create,
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=10
            )
            
            content = response.choices[0].message.content.strip()
            score = int(re.search(r'\d+', content).group())
            return min(max(score, 1), 10)
            
        except Exception as e:
            print(f"Market relevance assessment error: {e}")
            return 7  # Default moderate relevance

    async def _extract_learning_outcomes(
        self,
        description: str,
        technologies: List[str]
    ) -> List[str]:
        """
        Extract learning outcomes from the project.
        """
        try:
            prompt = f"""
            Based on this project description and technologies, list 5-7 specific learning outcomes:
            
            Description: {description}
            Technologies: {', '.join(technologies)}
            
            Focus on:
            - Technical skills gained
            - Software engineering practices
            - Problem-solving abilities
            - Industry-relevant knowledge
            
            Format as a simple list, one item per line.
            """

            response = await asyncio.to_thread(
                self.openai_client.chat.completions.create,
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.4,
                max_tokens=400
            )
            
            content = response.choices[0].message.content
            outcomes = [line.strip().lstrip('- ') for line in content.split('\n') if line.strip()]
            return outcomes[:7]
            
        except Exception as e:
            print(f"Learning outcomes extraction error: {e}")
            return [
                f"Hands-on experience with {', '.join(technologies[:3])}",
                "Full-stack development skills",
                "Problem-solving and debugging",
                "Project planning and execution",
                "Code organization and documentation"
            ]

    async def _generate_improvement_suggestions(
        self,
        description: str,
        technologies: List[str]
    ) -> List[str]:
        """
        Generate suggestions for project improvement.
        """
        try:
            prompt = f"""
            Suggest 4-6 specific improvements for this project:
            
            Description: {description}
            Technologies: {', '.join(technologies)}
            
            Focus on:
            - Technical enhancements
            - Additional features
            - Performance optimizations
            - Best practices
            - Testing improvements
            - Documentation
            
            Be specific and actionable. Format as a simple list.
            """

            response = await asyncio.to_thread(
                self.openai_client.chat.completions.create,
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.5,
                max_tokens=400
            )
            
            content = response.choices[0].message.content
            suggestions = [line.strip().lstrip('- ') for line in content.split('\n') if line.strip()]
            return suggestions[:6]
            
        except Exception as e:
            print(f"Improvement suggestions error: {e}")
            return [
                "Add comprehensive unit tests",
                "Implement error handling and logging",
                "Add user authentication and authorization",
                "Optimize database queries and indexing",
                "Add API documentation",
                "Implement CI/CD pipeline"
            ]

    async def _assess_technical_depth(
        self,
        technologies: List[str],
        description: str
    ) -> int:
        """
        Assess technical depth (1-10).
        """
        depth_score = 5  # Base score
        
        # Advanced technology bonus
        advanced_techs = [
            "kubernetes", "docker", "microservices", "graphql", "websockets",
            "redis", "elasticsearch", "kafka", "tensorflow", "pytorch"
        ]
        
        description_lower = description.lower()
        tech_lower = [t.lower() for t in technologies]
        
        for tech in advanced_techs:
            if any(tech in t for t in tech_lower) or tech in description_lower:
                depth_score += 0.5
                
        # Architecture complexity indicators
        architecture_keywords = [
            "distributed", "scalable", "high availability", "load balancing",
            "caching", "optimization", "performance", "security"
        ]
        
        for keyword in architecture_keywords:
            if keyword in description_lower:
                depth_score += 0.3
                
        return min(int(depth_score), 10)

    async def _calculate_innovation_score(
        self,
        title: str,
        description: str,
        technologies: List[str],
        category: Optional[str]
    ) -> int:
        """
        Calculate innovation score (0-100).
        """
        try:
            prompt = f"""
            Rate the innovation level of this project (0-100):
            
            Title: {title}
            Description: {description}
            Technologies: {', '.join(technologies)}
            Category: {category or 'Not specified'}
            
            Consider:
            - Novelty of approach
            - Creative use of technology
            - Problem-solving innovation
            - Technical creativity
            - Unique features
            
            Respond with only a number (0-100).
            """

            response = await asyncio.to_thread(
                self.openai_client.chat.completions.create,
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                max_tokens=10
            )
            
            content = response.choices[0].message.content.strip()
            score = int(re.search(r'\d+', content).group())
            return min(max(score, 0), 100)
            
        except Exception as e:
            print(f"Innovation score calculation error: {e}")
            return 65  # Default moderate innovation

    def _determine_complexity_level(self, complexity_score: float) -> str:
        """
        Determine complexity level based on score.
        """
        if complexity_score < 30:
            return "Beginner"
        elif complexity_score < 60:
            return "Intermediate"
        elif complexity_score < 85:
            return "Advanced"
        else:
            return "Expert"

    async def _generate_professional_story(
        self,
        title: str,
        description: str,
        technologies: List[str],
        key_strengths: List[str]
    ) -> str:
        """
        Generate a compelling professional story.
        """
        try:
            prompt = f"""
            Write a compelling 2-3 sentence professional story for this project:
            
            Title: {title}
            Description: {description}
            Technologies: {', '.join(technologies)}
            Key Strengths: {', '.join(key_strengths)}
            
            Make it:
            - Professional but engaging
            - Achievement-focused
            - Suitable for LinkedIn/resume
            - Emphasize impact and skills
            """

            response = await asyncio.to_thread(
                self.openai_client.chat.completions.create,
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.6,
                max_tokens=200
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Professional story generation error: {e}")
            return f"Developed {title} using {', '.join(technologies[:3])}, demonstrating strong technical skills and problem-solving abilities in creating a functional solution."

    async def _extract_enhanced_tags(
        self,
        title: str,
        description: str,
        technologies: List[str]
    ) -> List[str]:
        """
        Extract enhanced tags for better searchability.
        """
        tags = set(technologies)
        
        # Add category-based tags
        for category, data in self.tech_categories.items():
            if any(tech.lower() in t.lower() for tech in technologies for t in data["technologies"]):
                tags.add(category.lower())
        
        # Common project type tags
        description_lower = description.lower()
        title_lower = title.lower()
        
        tag_keywords = {
            "web-app": ["web app", "website", "web application"],
            "mobile-app": ["mobile app", "mobile application", "android", "ios"],
            "api": ["api", "rest", "graphql", "backend"],
            "dashboard": ["dashboard", "analytics", "admin panel"],
            "e-commerce": ["shop", "store", "commerce", "marketplace"],
            "social": ["social", "chat", "messaging", "community"],
            "ai": ["artificial intelligence", "machine learning", "ai", "ml"],
            "game": ["game", "gaming", "unity", "godot"],
            "iot": ["iot", "internet of things", "arduino", "raspberry pi"]
        }
        
        for tag, keywords in tag_keywords.items():
            if any(keyword in description_lower or keyword in title_lower for keyword in keywords):
                tags.add(tag)
        
        return list(tags)[:15]  # Limit to 15 tags

    def _assess_technologies(self, technologies: List[str]) -> Dict[str, Any]:
        """
        Assess the technology stack.
        """
        assessment = {
            "categories": {},
            "modern_stack": True,
            "complexity_level": "intermediate",
            "learning_curve": "moderate"
        }
        
        for tech in technologies:
            for category, data in self.tech_categories.items():
                if any(t.lower() in tech.lower() for t in data["technologies"]):
                    if category not in assessment["categories"]:
                        assessment["categories"][category] = []
                    assessment["categories"][category].append(tech)
                    break
        
        # Assess overall stack modernity and complexity
        total_complexity = sum(
            len(techs) * self.tech_categories[cat]["complexity_weight"]
            for cat, techs in assessment["categories"].items()
            if cat in self.tech_categories
        )
        
        if total_complexity > 20:
            assessment["complexity_level"] = "advanced"
            assessment["learning_curve"] = "steep"
        elif total_complexity < 10:
            assessment["complexity_level"] = "beginner"
            assessment["learning_curve"] = "gentle"
            
        return assessment

    def _fallback_analysis(self, title: str, description: str, technologies: List[str]) -> Dict[str, Any]:
        """
        Fallback analysis when AI services fail.
        """
        return {
            "innovation_score": 60,
            "complexity_level": "Intermediate",
            "skill_level": 6,
            "technical_depth": 6,
            "market_relevance": 7,
            "learning_outcomes": [
                f"Hands-on experience with {', '.join(technologies[:3])}",
                "Full-stack development skills",
                "Problem-solving and debugging",
                "Project planning and execution"
            ],
            "improvement_suggestions": [
                "Add comprehensive testing",
                "Improve documentation",
                "Optimize performance",
                "Enhance error handling"
            ],
            "key_strengths": [
                "Uses modern technology stack",
                "Addresses real-world problem",
                "Demonstrates technical competency"
            ],
            "technology_assessment": self._assess_technologies(technologies),
            "professional_story": f"Developed {title} showcasing technical skills in {', '.join(technologies[:2])} and demonstrating ability to create functional solutions.",
            "tags": technologies + ["web-development", "full-stack"],
            "analysis_timestamp": datetime.now().isoformat()
        }