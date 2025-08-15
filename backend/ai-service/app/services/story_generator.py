#!/usr/bin/env python3
"""
Story Generator Service
AI-powered professional story generation from project data
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any
import openai
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)

class StoryTone(Enum):
    PROFESSIONAL = "professional"
    CASUAL = "casual"
    TECHNICAL = "technical"
    INSPIRATIONAL = "inspirational"
    CONVERSATIONAL = "conversational"

class StoryLength(Enum):
    SHORT = "short"      # 100-200 words
    MEDIUM = "medium"    # 200-400 words
    LONG = "long"        # 400-600 words

class TargetAudience(Enum):
    RECRUITERS = "recruiters"
    TECHNICAL_MANAGERS = "technical_managers"
    PEERS = "peers"
    GENERAL = "general"
    EXECUTIVES = "executives"

@dataclass
class StoryResult:
    story: str
    key_points: List[str]
    call_to_action: str
    alternative_versions: List[str]
    metadata: Dict[str, Any]

class StoryGenerator:
    def __init__(self):
        self.client = openai.AsyncOpenAI()
        
        self.tone_prompts = {
            StoryTone.PROFESSIONAL: "professional, polished, and business-appropriate",
            StoryTone.CASUAL: "friendly, approachable, and conversational",
            StoryTone.TECHNICAL: "detailed, precise, and technically focused",
            StoryTone.INSPIRATIONAL: "motivating, aspirational, and engaging",
            StoryTone.CONVERSATIONAL: "natural, personal, and storytelling"
        }
        
        self.audience_contexts = {
            TargetAudience.RECRUITERS: "hiring managers and talent acquisition professionals",
            TargetAudience.TECHNICAL_MANAGERS: "engineering managers and technical leads",
            TargetAudience.PEERS: "fellow developers and technical professionals",
            TargetAudience.GENERAL: "general professional audience",
            TargetAudience.EXECUTIVES: "C-level executives and business leaders"
        }

    async def generate_story(
        self,
        project_data: Dict[str, Any],
        target_audience: str = "recruiters",
        tone: str = "professional",
        length: str = "medium",
        focus_areas: Optional[List[str]] = None
    ) -> StoryResult:
        """Generate compelling professional story from project data"""
        try:
            # Validate inputs
            tone_enum = StoryTone(tone)
            length_enum = StoryLength(length)
            audience_enum = TargetAudience(target_audience)
            
            # Extract key project information
            project_summary = self._extract_project_summary(project_data)
            
            # Generate main story
            main_story = await self._generate_main_story(
                project_summary, audience_enum, tone_enum, length_enum, focus_areas
            )
            
            # Extract key points
            key_points = await self._extract_key_points(main_story, project_data)
            
            # Generate call to action
            call_to_action = await self._generate_call_to_action(
                project_data, audience_enum
            )
            
            # Generate alternative versions
            alternative_versions = await self._generate_alternatives(
                project_summary, audience_enum, tone_enum, length_enum
            )
            
            # Compile metadata
            metadata = {
                "word_count": len(main_story.split()),
                "tone": tone,
                "audience": target_audience,
                "length": length,
                "focus_areas": focus_areas or [],
                "project_id": project_data.get("id"),
                "generated_at": "now"
            }
            
            return StoryResult(
                story=main_story,
                key_points=key_points,
                call_to_action=call_to_action,
                alternative_versions=alternative_versions,
                metadata=metadata
            )
            
        except Exception as e:
            logger.error(f"Story generation failed: {str(e)}")
            raise

    def _extract_project_summary(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract and structure key project information"""
        return {
            "title": project_data.get("title", ""),
            "description": project_data.get("description", ""),
            "technologies": project_data.get("technologies", []),
            "challenges": project_data.get("challenges", []),
            "solutions": project_data.get("solutions", []),
            "impact": project_data.get("impact", {}),
            "timeline": project_data.get("timeline", {}),
            "team_size": project_data.get("team_size", 1),
            "role": project_data.get("role", "Developer"),
            "achievements": project_data.get("achievements", []),
            "learnings": project_data.get("learnings", []),
            "metrics": project_data.get("metrics", {}),
            "category": project_data.get("category", ""),
            "complexity_level": project_data.get("complexity_level", ""),
            "innovation_score": project_data.get("innovation_score", 0)
        }

    async def _generate_main_story(
        self,
        project_summary: Dict[str, Any],
        audience: TargetAudience,
        tone: StoryTone,
        length: StoryLength,
        focus_areas: Optional[List[str]]
    ) -> str:
        """Generate the main professional story"""
        
        # Determine word count target
        word_targets = {
            StoryLength.SHORT: "100-200",
            StoryLength.MEDIUM: "200-400",
            StoryLength.LONG: "400-600"
        }
        
        # Build focus areas prompt
        focus_prompt = ""
        if focus_areas:
            focus_prompt = f"\nSpecial focus on: {', '.join(focus_areas)}"
        
        prompt = f"""
        Write a compelling professional story about this project for {self.audience_contexts[audience]}.
        
        Project Information:
        - Title: {project_summary['title']}
        - Description: {project_summary['description']}
        - Technologies: {', '.join(project_summary['technologies'])}
        - Role: {project_summary['role']}
        - Team Size: {project_summary['team_size']}
        - Timeline: {project_summary.get('timeline', {}).get('duration', 'Not specified')}
        - Category: {project_summary['category']}
        
        Key Challenges:
        {self._format_list(project_summary['challenges'])}
        
        Solutions Implemented:
        {self._format_list(project_summary['solutions'])}
        
        Achievements:
        {self._format_list(project_summary['achievements'])}
        
        Impact/Results:
        {self._format_dict(project_summary['impact'])}
        
        Key Learnings:
        {self._format_list(project_summary['learnings'])}
        {focus_prompt}
        
        Requirements:
        - Tone: {self.tone_prompts[tone]}
        - Length: {word_targets[length]} words
        - Audience: {self.audience_contexts[audience]}
        - Structure: Problem → Solution → Impact → Growth
        - Make it engaging and highlight problem-solving skills
        - Quantify achievements where possible
        - Show technical and soft skills
        - End with a forward-looking statement
        
        Write a story that showcases both technical competence and professional growth.
        """
        
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=800,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"Main story generation failed: {str(e)}")
            raise

    async def _extract_key_points(
        self, 
        story: str, 
        project_data: Dict[str, Any]
    ) -> List[str]:
        """Extract key bullet points from the story"""
        
        prompt = f"""
        Extract 4-6 key bullet points from this professional story that highlight the most important accomplishments and skills:
        
        Story:
        {story}
        
        Return bullet points that:
        - Highlight technical skills and achievements
        - Show problem-solving abilities
        - Quantify impact where possible
        - Demonstrate growth and learning
        - Are concise and impactful
        
        Format as a simple list with one point per line, starting with "-".
        """
        
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=300,
                temperature=0.5
            )
            
            points_text = response.choices[0].message.content.strip()
            return [point.strip("- ").strip() for point in points_text.split("\n") if point.strip()]
            
        except Exception as e:
            logger.error(f"Key points extraction failed: {str(e)}")
            return [
                "Developed innovative solution using modern technologies",
                "Overcame significant technical challenges",
                "Delivered measurable business impact",
                "Demonstrated strong problem-solving skills"
            ]

    async def _generate_call_to_action(
        self,
        project_data: Dict[str, Any],
        audience: TargetAudience
    ) -> str:
        """Generate appropriate call-to-action based on audience"""
        
        cta_prompts = {
            TargetAudience.RECRUITERS: "recruitment and hiring context",
            TargetAudience.TECHNICAL_MANAGERS: "technical leadership and management",
            TargetAudience.PEERS: "professional networking and collaboration",
            TargetAudience.GENERAL: "general professional engagement",
            TargetAudience.EXECUTIVES: "business value and strategic impact"
        }
        
        prompt = f"""
        Write a compelling call-to-action for this project story, targeted at {self.audience_contexts[audience]}.
        
        Project: {project_data.get('title', 'Software Project')}
        Technologies: {', '.join(project_data.get('technologies', []))}
        
        Context: {cta_prompts[audience]}
        
        Create a 1-2 sentence call-to-action that:
        - Invites engagement or discussion
        - Is appropriate for the target audience
        - Relates to the project or skills demonstrated
        - Is professional but engaging
        
        Examples of good CTAs:
        - "I'd love to discuss how these problem-solving approaches could benefit your team."
        - "Feel free to check out the code repository or reach out with questions."
        - "I'm always interested in discussing innovative solutions to complex challenges."
        """
        
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=100,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"CTA generation failed: {str(e)}")
            return "I'd be happy to discuss this project and my approach to solving complex technical challenges."

    async def _generate_alternatives(
        self,
        project_summary: Dict[str, Any],
        audience: TargetAudience,
        tone: StoryTone,
        length: StoryLength
    ) -> List[str]:
        """Generate alternative story versions with different focuses"""
        
        alternative_focuses = [
            "technical innovation and problem-solving",
            "teamwork and collaboration",
            "business impact and results"
        ]
        
        alternatives = []
        
        for focus in alternative_focuses:
            try:
                prompt = f"""
                Write a brief alternative version of this project story with special focus on {focus}.
                
                Project: {project_summary['title']}
                Technologies: {', '.join(project_summary['technologies'])}
                Role: {project_summary['role']}
                
                Keep it to 100-150 words and emphasize {focus}.
                Tone: {self.tone_prompts[tone]}
                Audience: {self.audience_contexts[audience]}
                """
                
                response = await self.client.chat.completions.create(
                    model="gpt-4",
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=200,
                    temperature=0.8
                )
                
                alternatives.append(response.choices[0].message.content.strip())
                
            except Exception as e:
                logger.error(f"Alternative generation failed for {focus}: {str(e)}")
                continue
        
        return alternatives

    async def generate_linkedin_post(
        self,
        project_data: Dict[str, Any],
        style: str = "achievement"
    ) -> str:
        """Generate LinkedIn-optimized post about the project"""
        
        styles = {
            "achievement": "celebrating an accomplishment",
            "learning": "sharing lessons learned",
            "technical": "discussing technical details",
            "inspiration": "inspiring others"
        }
        
        prompt = f"""
        Write a LinkedIn post about this project in the style of {styles.get(style, 'achievement')}.
        
        Project: {project_data.get('title', '')}
        Description: {project_data.get('description', '')}
        Technologies: {', '.join(project_data.get('technologies', []))}
        Key Achievement: {project_data.get('achievements', [''])[0] if project_data.get('achievements') else ''}
        
        Requirements:
        - 100-200 words
        - Engaging hook in first line
        - Include relevant hashtags
        - Professional yet personable tone
        - Call for engagement (likes, comments, shares)
        - Follow LinkedIn best practices
        
        Make it authentic and engaging while highlighting professional growth.
        """
        
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=300,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"LinkedIn post generation failed: {str(e)}")
            raise

    async def generate_elevator_pitch(
        self,
        project_data: Dict[str, Any],
        duration: int = 30  # seconds
    ) -> str:
        """Generate elevator pitch about the project"""
        
        word_count = duration * 2  # Approximate words per second
        
        prompt = f"""
        Create a {duration}-second elevator pitch about this project ({word_count} words max).
        
        Project: {project_data.get('title', '')}
        Problem Solved: {project_data.get('description', '')}
        Technologies: {', '.join(project_data.get('technologies', [])[:3])}  # Top 3
        Key Impact: {project_data.get('impact', {}).get('summary', '')}
        
        Structure:
        1. Hook (problem/opportunity)
        2. Solution (what you built)
        3. Impact (results/value)
        4. Call to action
        
        Make it conversational, memorable, and compelling.
        Focus on value delivered rather than technical details.
        """
        
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=150,
                temperature=0.6
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"Elevator pitch generation failed: {str(e)}")
            raise

    def _format_list(self, items: List[str]) -> str:
        """Format list items for prompt"""
        if not items:
            return "None specified"
        return "\n".join([f"- {item}" for item in items])

    def _format_dict(self, data: Dict[str, Any]) -> str:
        """Format dictionary for prompt"""
        if not data:
            return "None specified"
        return "\n".join([f"- {k}: {v}" for k, v in data.items()])