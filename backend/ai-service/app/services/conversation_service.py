#!/usr/bin/env python3
"""
Conversation Service for InTransparency
Handles AI-powered chat conversations with intent detection,
context management, and role-specific responses.
"""

import os
import json
import logging
import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, AsyncGenerator
from enum import Enum
import redis
import httpx
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

# Import action handlers (lazy import to avoid circular deps)
_student_actions = None
_recruiter_actions = None

def get_student_actions():
    global _student_actions
    if _student_actions is None:
        from app.services.student_actions import StudentActionHandler
        _student_actions = StudentActionHandler()
    return _student_actions

def get_recruiter_actions():
    global _recruiter_actions
    if _recruiter_actions is None:
        from app.services.recruiter_actions import RecruiterActionHandler
        _recruiter_actions = RecruiterActionHandler()
    return _recruiter_actions

_institution_actions = None

def get_institution_actions():
    global _institution_actions
    if _institution_actions is None:
        from app.services.institution_actions import InstitutionActionHandler
        _institution_actions = InstitutionActionHandler()
    return _institution_actions


class UserRole(str, Enum):
    STUDENT = "student"
    RECRUITER = "recruiter"
    COMPANY = "company"
    INSTITUTION = "institution"
    UNIVERSITY = "university"


class Intent(str, Enum):
    # Student intents
    JOB_SEARCH = "job_search"
    PROFILE_BUILD = "profile_build"
    SKILL_ANALYSIS = "skill_analysis"
    CAREER_ADVICE = "career_advice"
    EDUCATION_INFO = "education_info"
    PROJECT_HELP = "project_help"

    # Recruiter intents
    CANDIDATE_SEARCH = "candidate_search"
    MATCH_EXPLANATION = "match_explanation"
    JOB_POSTING_HELP = "job_posting_help"
    MARKET_INTELLIGENCE = "market_intelligence"

    # Institution intents
    PARTNERSHIP_INFO = "partnership_info"
    STUDENT_ANALYTICS = "student_analytics"
    AT_RISK_STUDENTS = "at_risk_students"
    COMPANY_TRENDS = "company_trends"

    # General intents
    GREETING = "greeting"
    HELP = "help"
    CLARIFICATION = "clarification"
    UNKNOWN = "unknown"


class ConversationMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Optional[Dict[str, Any]] = None


class ConversationContext(BaseModel):
    session_id: str
    user_id: Optional[str] = None
    user_role: UserRole
    messages: List[ConversationMessage] = []
    detected_intents: List[str] = []
    extracted_entities: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_activity: datetime = Field(default_factory=datetime.utcnow)


class IntentResult(BaseModel):
    primary_intent: Intent
    confidence: float
    secondary_intents: List[Intent] = []
    entities: Dict[str, Any] = {}


class ConversationResponse(BaseModel):
    message: str
    intent: Intent
    entities: Dict[str, Any] = {}
    suggested_actions: List[Dict[str, str]] = []
    data: Optional[Dict[str, Any]] = None

    class Config:
        arbitrary_types_allowed = True


class ConversationService:
    def __init__(self):
        self.redis_client = None
        self.anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.session_ttl = 3600  # 1 hour
        self._init_redis()

    def _init_redis(self):
        """Initialize Redis connection for session management"""
        try:
            redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
            self.redis_client = redis.from_url(
                redis_url,
                decode_responses=True,
                socket_connect_timeout=5,
                socket_timeout=5
            )
            self.redis_client.ping()
            logger.info("Conversation service: Redis connected")
        except Exception as e:
            logger.warning(f"Redis connection failed: {e}. Using in-memory storage.")
            self.redis_client = None
            self._memory_sessions: Dict[str, str] = {}

    async def get_session(self, session_id: str) -> Optional[ConversationContext]:
        """Retrieve conversation session from storage"""
        try:
            if self.redis_client:
                data = self.redis_client.get(f"conv:{session_id}")
                if data:
                    return ConversationContext(**json.loads(data))
            elif hasattr(self, '_memory_sessions'):
                data = self._memory_sessions.get(session_id)
                if data:
                    return ConversationContext(**json.loads(data))
        except Exception as e:
            logger.error(f"Error retrieving session: {e}")
        return None

    async def save_session(self, context: ConversationContext) -> bool:
        """Save conversation session to storage"""
        try:
            context.last_activity = datetime.utcnow()
            data = context.model_dump_json()

            if self.redis_client:
                self.redis_client.setex(
                    f"conv:{context.session_id}",
                    self.session_ttl,
                    data
                )
            elif hasattr(self, '_memory_sessions'):
                self._memory_sessions[context.session_id] = data

            return True
        except Exception as e:
            logger.error(f"Error saving session: {e}")
            return False

    async def create_session(
        self,
        session_id: str,
        user_role: UserRole,
        user_id: Optional[str] = None
    ) -> ConversationContext:
        """Create a new conversation session"""
        context = ConversationContext(
            session_id=session_id,
            user_id=user_id,
            user_role=user_role
        )

        # Add initial greeting
        greeting = self._get_greeting(user_role)
        context.messages.append(ConversationMessage(
            role="assistant",
            content=greeting
        ))

        await self.save_session(context)
        return context

    def _get_greeting(self, role: UserRole) -> str:
        """Get role-specific greeting message"""
        greetings = {
            UserRole.STUDENT: (
                "👋 Hi! I'm Transparenty, your AI career assistant. I can help you:\n\n"
                "• Build your profile from projects\n"
                "• Find jobs matching your skills\n"
                "• Get career advice and skill insights\n"
                "• Understand what companies are looking for\n\n"
                "What would you like to do?"
            ),
            UserRole.RECRUITER: (
                "👋 Hi! I'm Transparenty, your AI recruiting assistant. I can help you:\n\n"
                "• Find verified candidates across all disciplines\n"
                "• Understand match explanations\n"
                "• Get sourcing tips and market insights\n"
                "• See skill demand trends\n\n"
                "How can I assist your search?"
            ),
            UserRole.COMPANY: (
                "👋 Hi! I'm Transparenty, your AI recruiting assistant. I can help you:\n\n"
                "• Find verified candidates across all disciplines\n"
                "• Understand match explanations\n"
                "• Get sourcing tips and market insights\n"
                "• See skill demand trends\n\n"
                "How can I assist your search?"
            ),
            UserRole.INSTITUTION: (
                "👋 Hi! I'm Transparenty, your institutional assistant. I can help you:\n\n"
                "• Set up free partnership\n"
                "• Understand dashboard analytics\n"
                "• Get early intervention alerts\n"
                "• Explore European job opportunities\n\n"
                "What would you like to know?"
            ),
            UserRole.UNIVERSITY: (
                "👋 Hi! I'm Transparenty, your institutional assistant. I can help you:\n\n"
                "• Set up free partnership\n"
                "• Understand dashboard analytics\n"
                "• Get early intervention alerts\n"
                "• Explore European job opportunities\n\n"
                "What would you like to know?"
            )
        }
        return greetings.get(role, greetings[UserRole.STUDENT])

    async def detect_intent(
        self,
        message: str,
        user_role: UserRole,
        context: Optional[ConversationContext] = None
    ) -> IntentResult:
        """Detect user intent from message using Claude"""

        # Build context from previous messages
        conversation_history = ""
        if context and context.messages:
            recent_messages = context.messages[-6:]  # Last 3 exchanges
            conversation_history = "\n".join([
                f"{m.role}: {m.content}" for m in recent_messages
            ])

        system_prompt = f"""You are an intent classifier for InTransparency, a platform connecting students with jobs.
The user is a {user_role.value}.

Analyze the message and return a JSON object with:
- primary_intent: The main intent (one of: {', '.join([i.value for i in Intent])})
- confidence: A score from 0.0 to 1.0
- secondary_intents: List of other possible intents
- entities: Extracted entities like skills, locations, universities, job types, etc.

For {user_role.value}, focus on these intents:
"""

        if user_role in [UserRole.STUDENT]:
            system_prompt += """
- job_search: Looking for jobs, internships, or opportunities
- profile_build: Building or improving their profile
- skill_analysis: Understanding skill gaps or market demand
- career_advice: General career guidance
- education_info: Questions about ITS, Master's, courses
- project_help: Help with showcasing projects
"""
        elif user_role in [UserRole.RECRUITER, UserRole.COMPANY]:
            system_prompt += """
- candidate_search: Looking for candidates with specific criteria
- match_explanation: Understanding why candidates match
- job_posting_help: Creating or improving job postings
- market_intelligence: Skill trends, salary insights
"""
        else:  # Institution/University
            system_prompt += """
- partnership_info: How partnerships work
- student_analytics: Understanding student placement data
- at_risk_students: Identifying students needing help
- company_trends: What companies are searching for
"""

        system_prompt += """
- greeting: Hello, hi, etc.
- help: General help requests
- clarification: Asking for more info about previous response
- unknown: Cannot determine intent

Return ONLY valid JSON, no explanation."""

        try:
            if self.anthropic_api_key:
                result = await self._call_claude(system_prompt, message, conversation_history)
            elif self.openai_api_key:
                result = await self._call_openai(system_prompt, message, conversation_history)
            else:
                # Fallback to rule-based detection
                result = self._rule_based_intent(message, user_role)

            return IntentResult(**result)

        except Exception as e:
            logger.error(f"Intent detection failed: {e}")
            return IntentResult(
                primary_intent=Intent.UNKNOWN,
                confidence=0.0,
                entities={}
            )

    async def _call_claude(
        self,
        system_prompt: str,
        message: str,
        conversation_history: str = ""
    ) -> Dict[str, Any]:
        """Call Claude API for intent detection"""
        async with httpx.AsyncClient() as client:
            user_content = message
            if conversation_history:
                user_content = f"Previous conversation:\n{conversation_history}\n\nNew message: {message}"

            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": self.anthropic_api_key,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json"
                },
                json={
                    "model": "claude-3-haiku-20240307",
                    "max_tokens": 500,
                    "system": system_prompt,
                    "messages": [{"role": "user", "content": user_content}]
                },
                timeout=30.0
            )

            if response.status_code == 200:
                data = response.json()
                content = data["content"][0]["text"]
                # Parse JSON from response
                return json.loads(content)
            else:
                logger.error(f"Claude API error: {response.status_code}")
                raise Exception(f"Claude API error: {response.status_code}")

    async def _call_openai(
        self,
        system_prompt: str,
        message: str,
        conversation_history: str = ""
    ) -> Dict[str, Any]:
        """Call OpenAI API for intent detection"""
        async with httpx.AsyncClient() as client:
            user_content = message
            if conversation_history:
                user_content = f"Previous conversation:\n{conversation_history}\n\nNew message: {message}"

            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.openai_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_content}
                    ],
                    "max_tokens": 500,
                    "temperature": 0.1
                },
                timeout=30.0
            )

            if response.status_code == 200:
                data = response.json()
                content = data["choices"][0]["message"]["content"]
                return json.loads(content)
            else:
                logger.error(f"OpenAI API error: {response.status_code}")
                raise Exception(f"OpenAI API error: {response.status_code}")

    def _rule_based_intent(self, message: str, user_role: UserRole) -> Dict[str, Any]:
        """Fallback rule-based intent detection"""
        message_lower = message.lower()

        # Greeting patterns
        greetings = ['hello', 'hi', 'hey', 'ciao', 'buongiorno', 'salve']
        if any(g in message_lower for g in greetings):
            return {
                "primary_intent": Intent.GREETING.value,
                "confidence": 0.9,
                "secondary_intents": [],
                "entities": {}
            }

        # Help patterns
        if 'help' in message_lower or 'aiuto' in message_lower:
            return {
                "primary_intent": Intent.HELP.value,
                "confidence": 0.8,
                "secondary_intents": [],
                "entities": {}
            }

        # Role-specific patterns
        if user_role == UserRole.STUDENT:
            if any(w in message_lower for w in ['job', 'lavoro', 'work', 'internship', 'stage']):
                return {
                    "primary_intent": Intent.JOB_SEARCH.value,
                    "confidence": 0.8,
                    "secondary_intents": [],
                    "entities": self._extract_entities(message)
                }
            if any(w in message_lower for w in ['profile', 'profilo', 'build']):
                return {
                    "primary_intent": Intent.PROFILE_BUILD.value,
                    "confidence": 0.8,
                    "secondary_intents": [],
                    "entities": {}
                }
            if any(w in message_lower for w in ['skill', 'competenz', 'trend']):
                return {
                    "primary_intent": Intent.SKILL_ANALYSIS.value,
                    "confidence": 0.8,
                    "secondary_intents": [],
                    "entities": {}
                }

        elif user_role in [UserRole.RECRUITER, UserRole.COMPANY]:
            if any(w in message_lower for w in ['find', 'cerca', 'search', 'candidat']):
                return {
                    "primary_intent": Intent.CANDIDATE_SEARCH.value,
                    "confidence": 0.8,
                    "secondary_intents": [],
                    "entities": self._extract_entities(message)
                }
            if any(w in message_lower for w in ['match', 'explain', 'score']):
                return {
                    "primary_intent": Intent.MATCH_EXPLANATION.value,
                    "confidence": 0.8,
                    "secondary_intents": [],
                    "entities": {}
                }

        elif user_role in [UserRole.INSTITUTION, UserRole.UNIVERSITY]:
            if any(w in message_lower for w in ['partnership', 'free', 'setup']):
                return {
                    "primary_intent": Intent.PARTNERSHIP_INFO.value,
                    "confidence": 0.8,
                    "secondary_intents": [],
                    "entities": {}
                }
            if any(w in message_lower for w in ['at-risk', 'intervention', 'rischio']):
                return {
                    "primary_intent": Intent.AT_RISK_STUDENTS.value,
                    "confidence": 0.8,
                    "secondary_intents": [],
                    "entities": {}
                }

        return {
            "primary_intent": Intent.UNKNOWN.value,
            "confidence": 0.3,
            "secondary_intents": [],
            "entities": self._extract_entities(message)
        }

    def _extract_entities(self, message: str) -> Dict[str, Any]:
        """Extract basic entities from message"""
        entities = {}
        message_lower = message.lower()

        # Italian cities
        cities = ['milano', 'milan', 'roma', 'rome', 'torino', 'turin',
                  'bologna', 'firenze', 'florence', 'napoli', 'naples', 'venezia']
        for city in cities:
            if city in message_lower:
                entities['location'] = city.title()
                break

        # Common skills
        skills = ['python', 'java', 'react', 'javascript', 'typescript',
                  'excel', 'sql', 'aws', 'docker', 'machine learning', 'ml',
                  'cybersecurity', 'marketing', 'design', 'figma', 'autocad']
        found_skills = [s for s in skills if s in message_lower]
        if found_skills:
            entities['skills'] = found_skills

        return entities

    async def generate_response(
        self,
        message: str,
        context: ConversationContext,
        intent_result: IntentResult
    ) -> ConversationResponse:
        """Generate AI response based on intent and context"""

        # Check if we should use action handlers for specific intents
        student_action_intents = {
            Intent.JOB_SEARCH,
            Intent.SKILL_ANALYSIS,
            Intent.PROFILE_BUILD,
            Intent.CAREER_ADVICE,
            Intent.EDUCATION_INFO
        }

        recruiter_action_intents = {
            Intent.CANDIDATE_SEARCH,
            Intent.MATCH_EXPLANATION,
            Intent.JOB_POSTING_HELP,
            Intent.MARKET_INTELLIGENCE
        }

        # Use action handlers for student-specific intents
        if (context.user_role == UserRole.STUDENT and
            intent_result.primary_intent in student_action_intents and
            intent_result.confidence > 0.6):

            action_result = await self._handle_student_action(
                intent_result.primary_intent,
                intent_result.entities,
                context
            )

            if action_result:
                return ConversationResponse(
                    message=action_result.message,
                    intent=intent_result.primary_intent,
                    entities=intent_result.entities,
                    suggested_actions=action_result.suggested_actions or [],
                    data=action_result.data
                )

        # Use action handlers for recruiter-specific intents
        if (context.user_role in [UserRole.RECRUITER, UserRole.COMPANY] and
            intent_result.primary_intent in recruiter_action_intents and
            intent_result.confidence > 0.6):

            action_result = await self._handle_recruiter_action(
                intent_result.primary_intent,
                intent_result.entities,
                context,
                message  # Pass raw message for NLP extraction
            )

            if action_result:
                return ConversationResponse(
                    message=action_result.message,
                    intent=intent_result.primary_intent,
                    entities=intent_result.entities,
                    suggested_actions=action_result.suggested_actions or [],
                    data=action_result.data
                )

        # Institution-specific intents
        institution_action_intents = {
            Intent.PARTNERSHIP_INFO,
            Intent.STUDENT_ANALYTICS,
            Intent.AT_RISK_STUDENTS,
            Intent.COMPANY_TRENDS
        }

        # Use action handlers for institution-specific intents
        if (context.user_role in [UserRole.INSTITUTION, UserRole.UNIVERSITY] and
            intent_result.primary_intent in institution_action_intents and
            intent_result.confidence > 0.6):

            action_result = await self._handle_institution_action(
                intent_result.primary_intent,
                intent_result.entities,
                context,
                message
            )

            if action_result:
                return ConversationResponse(
                    message=action_result.message,
                    intent=intent_result.primary_intent,
                    entities=intent_result.entities,
                    suggested_actions=action_result.suggested_actions or [],
                    data=action_result.data
                )

        # Build the prompt for response generation
        system_prompt = self._build_response_prompt(context.user_role, intent_result)

        # Get conversation history
        history = self._format_conversation_history(context)

        try:
            if self.anthropic_api_key:
                response_text = await self._generate_with_claude(
                    system_prompt, message, history, intent_result
                )
            elif self.openai_api_key:
                response_text = await self._generate_with_openai(
                    system_prompt, message, history, intent_result
                )
            else:
                response_text = self._generate_fallback_response(
                    intent_result.primary_intent,
                    context.user_role,
                    intent_result.entities
                )

            # Generate suggested actions
            actions = self._get_suggested_actions(intent_result.primary_intent, context.user_role)

            return ConversationResponse(
                message=response_text,
                intent=intent_result.primary_intent,
                entities=intent_result.entities,
                suggested_actions=actions
            )

        except Exception as e:
            logger.error(f"Response generation failed: {e}")
            return ConversationResponse(
                message="I apologize, but I encountered an issue processing your request. Could you please rephrase your question?",
                intent=intent_result.primary_intent,
                entities={}
            )

    async def _handle_student_action(
        self,
        intent: Intent,
        entities: Dict[str, Any],
        context: ConversationContext
    ):
        """Handle student-specific actions using action handlers"""
        try:
            student_actions = get_student_actions()
            user_context = {
                'user_id': context.user_id,
                'previous_entities': context.extracted_entities
            }

            if intent == Intent.JOB_SEARCH:
                return await student_actions.handle_job_search(
                    entities, context.user_id, user_context
                )
            elif intent == Intent.SKILL_ANALYSIS:
                return await student_actions.handle_skill_analysis(
                    entities, context.user_id, user_context
                )
            elif intent == Intent.PROFILE_BUILD:
                return await student_actions.handle_profile_suggestions(
                    entities, context.user_id, user_context
                )
            elif intent == Intent.CAREER_ADVICE:
                return await student_actions.handle_career_advice(
                    entities, context.user_id, user_context
                )
            elif intent == Intent.EDUCATION_INFO:
                return await student_actions.handle_education_info(
                    entities, context.user_id, user_context
                )

        except Exception as e:
            logger.error(f"Student action handler failed: {e}")
            return None

        return None

    async def _handle_recruiter_action(
        self,
        intent: Intent,
        entities: Dict[str, Any],
        context: ConversationContext,
        raw_message: str = ""
    ):
        """Handle recruiter-specific actions using action handlers"""
        try:
            recruiter_actions = get_recruiter_actions()
            user_context = {
                'user_id': context.user_id,
                'previous_entities': context.extracted_entities,
                'recent_search': context.extracted_entities.get('last_search')
            }

            if intent == Intent.CANDIDATE_SEARCH:
                return await recruiter_actions.handle_candidate_search(
                    entities, context.user_id, user_context, raw_message
                )
            elif intent == Intent.MATCH_EXPLANATION:
                return await recruiter_actions.handle_match_explanation(
                    entities, context.user_id, user_context
                )
            elif intent == Intent.JOB_POSTING_HELP:
                return await recruiter_actions.handle_job_posting_help(
                    entities, context.user_id, user_context
                )
            elif intent == Intent.MARKET_INTELLIGENCE:
                return await recruiter_actions.handle_market_intelligence(
                    entities, context.user_id, user_context
                )

        except Exception as e:
            logger.error(f"Recruiter action handler failed: {e}")
            return None

        return None

    async def _handle_institution_action(
        self,
        intent: Intent,
        entities: Dict[str, Any],
        context: ConversationContext,
        raw_message: str = ""
    ):
        """Handle institution/university-specific actions using action handlers"""
        try:
            institution_actions = get_institution_actions()
            user_context = {
                'user_id': context.user_id,
                'institution_id': context.extracted_entities.get('institution_id'),
                'previous_entities': context.extracted_entities
            }

            if intent == Intent.STUDENT_ANALYTICS:
                # Could be search analytics, skill demand, or general analytics
                if any(word in raw_message.lower() for word in ['search', 'cercano', 'looking']):
                    return await institution_actions.handle_search_analytics(
                        entities, context.user_id, user_context
                    )
                elif any(word in raw_message.lower() for word in ['skill', 'competenz', 'gap']):
                    return await institution_actions.handle_skill_demand(
                        entities, context.user_id, user_context
                    )
                else:
                    return await institution_actions.handle_search_analytics(
                        entities, context.user_id, user_context
                    )

            elif intent == Intent.AT_RISK_STUDENTS:
                return await institution_actions.handle_at_risk_students(
                    entities, context.user_id, user_context
                )

            elif intent == Intent.COMPANY_TRENDS:
                if any(word in raw_message.lower() for word in ['benchmark', 'compare', 'ranking']):
                    return await institution_actions.handle_benchmark_comparison(
                        entities, context.user_id, user_context
                    )
                else:
                    return await institution_actions.handle_company_interest(
                        entities, context.user_id, user_context
                    )

            elif intent == Intent.PARTNERSHIP_INFO:
                return await institution_actions.handle_partnership_info(
                    entities, context.user_id, user_context
                )

        except Exception as e:
            logger.error(f"Institution action handler failed: {e}")
            return None

        return None

    def _build_response_prompt(self, user_role: UserRole, intent: IntentResult) -> str:
        """Build system prompt for response generation"""
        base_prompt = f"""You are Transparenty, the AI assistant for InTransparency platform.
You're helping a {user_role.value}.

Guidelines:
- Be helpful, concise, and professional
- Use emojis sparingly for visual structure
- Format responses with bullet points and bold for key info
- Always be transparent about how data is used
- Suggest actionable next steps
- If you don't have specific data, explain what you CAN help with
- Keep responses under 300 words unless detailed analysis is needed

The user's intent is: {intent.primary_intent.value}
Extracted entities: {json.dumps(intent.entities)}

Respond naturally and helpfully to their message."""

        return base_prompt

    def _format_conversation_history(self, context: ConversationContext) -> str:
        """Format recent conversation history for context"""
        if not context.messages:
            return ""

        recent = context.messages[-8:]  # Last 4 exchanges
        return "\n".join([
            f"{m.role.upper()}: {m.content}" for m in recent
        ])

    async def _generate_with_claude(
        self,
        system_prompt: str,
        message: str,
        history: str,
        intent: IntentResult
    ) -> str:
        """Generate response using Claude"""
        async with httpx.AsyncClient() as client:
            user_content = message
            if history:
                user_content = f"Conversation so far:\n{history}\n\nUser's new message: {message}"

            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": self.anthropic_api_key,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json"
                },
                json={
                    "model": "claude-3-haiku-20240307",
                    "max_tokens": 1000,
                    "system": system_prompt,
                    "messages": [{"role": "user", "content": user_content}]
                },
                timeout=30.0
            )

            if response.status_code == 200:
                data = response.json()
                return data["content"][0]["text"]
            else:
                raise Exception(f"Claude API error: {response.status_code}")

    async def _generate_with_openai(
        self,
        system_prompt: str,
        message: str,
        history: str,
        intent: IntentResult
    ) -> str:
        """Generate response using OpenAI"""
        async with httpx.AsyncClient() as client:
            messages = [{"role": "system", "content": system_prompt}]

            if history:
                messages.append({"role": "user", "content": f"Conversation context:\n{history}"})

            messages.append({"role": "user", "content": message})

            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.openai_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-3.5-turbo",
                    "messages": messages,
                    "max_tokens": 1000,
                    "temperature": 0.7
                },
                timeout=30.0
            )

            if response.status_code == 200:
                data = response.json()
                return data["choices"][0]["message"]["content"]
            else:
                raise Exception(f"OpenAI API error: {response.status_code}")

    def _generate_fallback_response(
        self,
        intent: Intent,
        role: UserRole,
        entities: Dict[str, Any]
    ) -> str:
        """Generate fallback response when AI APIs are unavailable"""

        responses = {
            Intent.JOB_SEARCH: (
                "I can help you find jobs! Based on your profile, I'll search for opportunities "
                f"{'in ' + entities.get('location', 'your area') if entities.get('location') else ''} "
                f"{'matching skills like ' + ', '.join(entities.get('skills', [])) if entities.get('skills') else ''}.\n\n"
                "To get the best results:\n"
                "• Make sure your profile is complete\n"
                "• Add your key projects\n"
                "• Specify your preferences (location, job type)\n\n"
                "Would you like me to show you top matches?"
            ),
            Intent.PROFILE_BUILD: (
                "Let's build your profile! Here's what makes a strong profile:\n\n"
                "1. **Projects** - Add your best work (thesis, code, designs)\n"
                "2. **Skills** - I'll verify them from your projects\n"
                "3. **Education** - Courses and grades that matter\n"
                "4. **Bio** - A compelling 2-3 sentence summary\n\n"
                "Which area would you like to start with?"
            ),
            Intent.CANDIDATE_SEARCH: (
                f"I'll help you find candidates"
                f"{'in ' + entities.get('location', '') if entities.get('location') else ''}"
                f"{' with ' + ', '.join(entities.get('skills', [])) if entities.get('skills') else ''}.\n\n"
                "Our AI-powered search provides:\n"
                "• Verified skill profiles (not self-reported)\n"
                "• Transparent match scores with explanations\n"
                "• Project-based evidence of capabilities\n\n"
                "Tell me more about your ideal candidate!"
            ),
            Intent.GREETING: (
                self._get_greeting(role)
            ),
            Intent.HELP: (
                f"I'm here to help! As a {role.value}, I can assist you with:\n\n"
                + (
                    "• Finding jobs matching your skills\n• Building your profile\n• Career advice\n• Skill gap analysis"
                    if role == UserRole.STUDENT else
                    "• Finding verified candidates\n• Understanding match scores\n• Market intelligence\n• Job posting tips"
                    if role in [UserRole.RECRUITER, UserRole.COMPANY] else
                    "• Setting up partnership\n• Student analytics\n• At-risk student identification\n• Company trends"
                ) + "\n\nWhat would you like to explore?"
            )
        }

        return responses.get(intent,
            "I'd love to help with that! Could you tell me more about what you're looking for? "
            "I can assist with job searching, profile building, career advice, and more."
        )

    def _get_suggested_actions(self, intent: Intent, role: UserRole) -> List[Dict[str, str]]:
        """Get suggested follow-up actions based on intent"""

        actions_map = {
            Intent.JOB_SEARCH: [
                {"label": "View Job Matches", "action": "view_jobs"},
                {"label": "Update Preferences", "action": "edit_preferences"},
                {"label": "See Skill Trends", "action": "skill_trends"}
            ],
            Intent.PROFILE_BUILD: [
                {"label": "Add Project", "action": "add_project"},
                {"label": "Edit Profile", "action": "edit_profile"},
                {"label": "View Tips", "action": "profile_tips"}
            ],
            Intent.CANDIDATE_SEARCH: [
                {"label": "Advanced Search", "action": "advanced_search"},
                {"label": "Save Search", "action": "save_search"},
                {"label": "View Saved Candidates", "action": "view_saved"}
            ],
            Intent.SKILL_ANALYSIS: [
                {"label": "View Skill Report", "action": "skill_report"},
                {"label": "Market Trends", "action": "market_trends"},
                {"label": "Recommended Courses", "action": "courses"}
            ]
        }

        return actions_map.get(intent, [])

    async def process_message(
        self,
        session_id: str,
        message: str,
        user_role: UserRole,
        user_id: Optional[str] = None
    ) -> ConversationResponse:
        """Main entry point: process a user message and return response"""

        # Get or create session
        context = await self.get_session(session_id)
        if not context:
            context = await self.create_session(session_id, user_role, user_id)

        # Add user message to context
        context.messages.append(ConversationMessage(
            role="user",
            content=message
        ))

        # Detect intent
        intent_result = await self.detect_intent(message, user_role, context)
        context.detected_intents.append(intent_result.primary_intent.value)
        context.extracted_entities.update(intent_result.entities)

        # Generate response
        response = await self.generate_response(message, context, intent_result)

        # Add assistant response to context
        context.messages.append(ConversationMessage(
            role="assistant",
            content=response.message,
            metadata={
                "intent": intent_result.primary_intent.value,
                "confidence": intent_result.confidence
            }
        ))

        # Save updated context
        await self.save_session(context)

        return response

    async def stream_response(
        self,
        session_id: str,
        message: str,
        user_role: UserRole,
        user_id: Optional[str] = None
    ) -> AsyncGenerator[str, None]:
        """Stream response tokens for real-time UI updates"""

        # Get or create session
        context = await self.get_session(session_id)
        if not context:
            context = await self.create_session(session_id, user_role, user_id)

        # Add user message
        context.messages.append(ConversationMessage(
            role="user",
            content=message
        ))

        # Detect intent first (not streamed)
        intent_result = await self.detect_intent(message, user_role, context)

        # Stream the response
        full_response = ""

        if self.anthropic_api_key:
            async for chunk in self._stream_claude_response(context, message, intent_result):
                full_response += chunk
                yield chunk
        elif self.openai_api_key:
            async for chunk in self._stream_openai_response(context, message, intent_result):
                full_response += chunk
                yield chunk
        else:
            # Fallback: yield complete response at once
            response = self._generate_fallback_response(
                intent_result.primary_intent,
                user_role,
                intent_result.entities
            )
            full_response = response
            yield response

        # Save the complete response
        context.messages.append(ConversationMessage(
            role="assistant",
            content=full_response
        ))
        await self.save_session(context)

    async def _stream_claude_response(
        self,
        context: ConversationContext,
        message: str,
        intent: IntentResult
    ) -> AsyncGenerator[str, None]:
        """Stream response from Claude API"""
        system_prompt = self._build_response_prompt(context.user_role, intent)
        history = self._format_conversation_history(context)

        user_content = message
        if history:
            user_content = f"Conversation so far:\n{history}\n\nUser's new message: {message}"

        async with httpx.AsyncClient() as client:
            async with client.stream(
                "POST",
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": self.anthropic_api_key,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json"
                },
                json={
                    "model": "claude-3-haiku-20240307",
                    "max_tokens": 1000,
                    "stream": True,
                    "system": system_prompt,
                    "messages": [{"role": "user", "content": user_content}]
                },
                timeout=60.0
            ) as response:
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data = json.loads(line[6:])
                        if data.get("type") == "content_block_delta":
                            text = data.get("delta", {}).get("text", "")
                            if text:
                                yield text

    async def _stream_openai_response(
        self,
        context: ConversationContext,
        message: str,
        intent: IntentResult
    ) -> AsyncGenerator[str, None]:
        """Stream response from OpenAI API"""
        system_prompt = self._build_response_prompt(context.user_role, intent)
        history = self._format_conversation_history(context)

        messages = [{"role": "system", "content": system_prompt}]
        if history:
            messages.append({"role": "assistant", "content": f"Previous context:\n{history}"})
        messages.append({"role": "user", "content": message})

        async with httpx.AsyncClient() as client:
            async with client.stream(
                "POST",
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.openai_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-3.5-turbo",
                    "messages": messages,
                    "max_tokens": 1000,
                    "stream": True
                },
                timeout=60.0
            ) as response:
                async for line in response.aiter_lines():
                    if line.startswith("data: ") and line != "data: [DONE]":
                        data = json.loads(line[6:])
                        content = data.get("choices", [{}])[0].get("delta", {}).get("content", "")
                        if content:
                            yield content
