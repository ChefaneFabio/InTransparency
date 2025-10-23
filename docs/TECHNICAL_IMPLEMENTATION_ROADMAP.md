# Technical Implementation Roadmap: Soft Skills & Psychometric Testing
## InTransparency Development Blueprint (16-Week Build Plan)

**Last Updated:** January 2025
**Status:** Ready for Development (pending validation)
**Timeline:** 16 weeks (4 months)
**Team Size:** 2 full-time developers + 1 psychologist consultant
**Budget:** €60-120K (development + validation + legal)

---

## 🏗️ Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js 14)                    │
├─────────────────────────────────────────────────────────────┤
│  Assessment UI    Results Viz    Payment Flow    Dashboard  │
│  ├─ Test Admin   ├─ Charts      ├─ Stripe       ├─ Badges   │
│  ├─ Progress     ├─ Radar       ├─ Receipt      ├─ Analytics│
│  └─ Timer        └─ Percentile  └─ Confirm      └─ Share    │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS/REST API
┌────────────────────────┴────────────────────────────────────┐
│                   BACKEND API (Node.js/Express)              │
├─────────────────────────────────────────────────────────────┤
│  /assessments     /results      /payments       /matching   │
│  ├─ Create       ├─ Get         ├─ Stripe      ├─ Soft+Tech│
│  ├─ Submit       ├─ Calculate   ├─ Webhooks    ├─ Scoring  │
│  └─ Validate     └─ Store       └─ Refunds     └─ Ranking  │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                 AI SERVICE (Python/FastAPI)                  │
├─────────────────────────────────────────────────────────────┤
│  Psychometric Analysis    Personality Scoring    Matching   │
│  ├─ Big Five Calculator  ├─ DISC Profiles      ├─ Soft+Tech│
│  ├─ Competency Scorer    ├─ Trait Analysis     ├─ ML Model │
│  └─ Validation Engine    └─ Percentile Ranks   └─ Recommend│
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│               DATABASE (PostgreSQL + Redis)                  │
├─────────────────────────────────────────────────────────────┤
│  Users   Assessments   Responses   Results   Payments       │
│  └─ Soft Skills Models (Prisma Schema)                       │
│                                                              │
│  Redis Cache: Test sessions, partial responses, temp data   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📅 Implementation Timeline (16 Weeks)

### Phase 1: Foundation (Weeks 1-4)
**Goal:** Database, authentication, basic test framework

- Week 1: Database schema design + Prisma migration
- Week 2: Test administration engine (backend)
- Week 3: Payment integration (Stripe)
- Week 4: Basic assessment UI (frontend)

### Phase 2: Psychometric Tests (Weeks 5-9)
**Goal:** Implement Big Five, DISC, competency assessments

- Week 5-6: Big Five personality test (60 questions)
- Week 7: DISC behavioral assessment (24 questions)
- Week 8: Competency self-assessment (communication, teamwork, etc.)
- Week 9: Test validation + scoring calibration

### Phase 3: UI & Integration (Weeks 10-13)
**Goal:** Results visualization, recruiter views, matching integration

- Week 10: Results visualization (charts, percentiles, badges)
- Week 11: Recruiter dashboard (soft skills filters)
- Week 12: AI matching update (include soft skills)
- Week 13: One-time payment + certification system

### Phase 4: Polish & Launch (Weeks 14-16)
**Goal:** QA, beta testing, compliance review

- Week 14: QA testing, bug fixes
- Week 15: Legal/compliance review (EEOC, GDPR)
- Week 16: Beta launch to 100 users, collect feedback

---

## 🗄️ PART 1: Database Schema (Prisma)

### New Models to Add

```prisma
// frontend/prisma/schema.prisma

// ============================================================================
// SOFT SKILLS ASSESSMENT MODELS
// ============================================================================

model SoftSkillAssessment {
  id                String   @id @default(cuid())
  userId            String
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Assessment Metadata
  assessmentType    AssessmentType   // BIG_FIVE, DISC, COMPETENCY
  status            AssessmentStatus // STARTED, IN_PROGRESS, COMPLETED
  startedAt         DateTime  @default(now())
  completedAt       DateTime?
  durationMinutes   Int?      // How long they took

  // Responses (JSON for flexibility)
  responses         Json      // Store all question-answer pairs

  // Calculated Scores
  scores            Json?     // Calculated trait scores
  percentiles       Json?     // Percentile rankings
  interpretation    String?   @db.Text // AI-generated summary

  // Certification
  isCertified       Boolean   @default(false)
  certifiedAt       DateTime?
  certificateUrl    String?   // PDF certificate URL

  // Payment
  paymentId         String?   @unique
  payment           Payment?  @relation(fields: [paymentId], references: [id])

  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  @@index([userId])
  @@index([status])
  @@index([createdAt])
}

enum AssessmentType {
  BIG_FIVE          // Personality (Openness, Conscientiousness, Extraversion, Agreeableness, Stability)
  DISC              // Behavioral style (Dominance, Influence, Steadiness, Compliance)
  COMPETENCY        // Self-assessment (Communication, Teamwork, Leadership, etc.)
  FULL_SUITE        // All of the above combined
}

enum AssessmentStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
  EXPIRED           // If they don't finish in 48 hours
  INVALIDATED       // Flagged as dishonest responses
}

// ============================================================================
// BIG FIVE PERSONALITY MODEL
// ============================================================================

model BigFiveProfile {
  id                String   @id @default(cuid())
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  assessmentId      String   @unique
  assessment        SoftSkillAssessment @relation(fields: [assessmentId], references: [id])

  // Big Five Scores (0-100)
  openness          Float    // Openness to Experience
  conscientiousness Float    // Conscientiousness
  extraversion      Float    // Extraversion
  agreeableness     Float    // Agreeableness
  neuroticism       Float    // Neuroticism (or Emotional Stability if inverted)

  // Percentile Rankings (vs other users)
  opennessPercentile        Float?
  conscientiousnessPercentile Float?
  extraversionPercentile    Float?
  agreeablenessPercentile   Float?
  neuroticismPercentile     Float?

  // Facet Scores (sub-dimensions, optional for detailed assessment)
  facets            Json?    // E.g., {"curiosity": 82, "imagination": 75, ...}

  // Interpretation
  personality Type  String?  // e.g., "Conscientious Achiever"
  summary           String?  @db.Text // AI-generated personality summary

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([userId])
}

// ============================================================================
// DISC BEHAVIORAL PROFILE
// ============================================================================

model DISCProfile {
  id                String   @id @default(cuid())
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  assessmentId      String   @unique
  assessment        SoftSkillAssessment @relation(fields: [assessmentId], references: [id])

  // DISC Scores (0-100)
  dominance         Float    // D - Direct, Results-oriented
  influence         Float    // I - Outgoing, Enthusiastic
  steadiness        Float    // S - Even-tempered, Accommodating
  compliance        Float    // C - Analytical, Reserved

  // Primary Style
  primaryStyle      DISCStyle
  secondaryStyle    DISCStyle?

  // Percentiles
  dominancePercentile   Float?
  influencePercentile   Float?
  steadinessPercentile  Float?
  compliancePercentile  Float?

  // Interpretation
  styleDescription  String?  @db.Text
  workStylePrefs    Json?    // Preferred work environment, communication style

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([userId])
  @@index([primaryStyle])
}

enum DISCStyle {
  D   // Dominant
  I   // Influencer
  S   // Steady
  C   // Conscientious
  DI  // Dominant-Influencer
  DC  // Dominant-Conscientious
  IS  // Influencer-Steady
  SC  // Steady-Conscientious
}

// ============================================================================
// COMPETENCY ASSESSMENT
// ============================================================================

model CompetencyProfile {
  id                String   @id @default(cuid())
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  assessmentId      String   @unique
  assessment        SoftSkillAssessment @relation(fields: [assessmentId], references: [id])

  // Core Competencies (0-100 scores)
  communication     Float    // Verbal & written communication
  teamwork          Float    // Collaboration & cooperation
  leadership        Float    // Influence & initiative
  problemSolving    Float    // Critical thinking & analytical skills
  adaptability      Float    // Flexibility & learning agility
  emotionalIntel    Float    // Self-awareness & empathy
  timeManagement    Float    // Organization & prioritization
  creativity        Float    // Innovation & original thinking

  // Percentiles
  communicationPercentile   Float?
  teamworkPercentile        Float?
  leadershipPercentile      Float?
  problemSolvingPercentile  Float?
  adaptabilityPercentile    Float?

  // Top Strengths (array of competency names)
  topStrengths      String[]
  growthAreas       String[]

  // Interpretation
  summary           String?  @db.Text

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([userId])
}

// ============================================================================
// PAYMENT FOR CERTIFICATION
// ============================================================================

model Payment {
  id                String   @id @default(cuid())
  userId            String
  user              User     @relation(fields: [userId], references: [id])

  // Payment Details
  amount            Float    // €99 (or dynamic pricing)
  currency          String   @default("EUR")
  status            PaymentStatus

  // Stripe Integration
  stripePaymentIntent   String?  @unique
  stripeCheckoutSession String?  @unique
  stripeCustomerId      String?

  // What They Paid For
  productType       String   @default("SOFT_SKILLS_CERTIFICATION")
  assessments       SoftSkillAssessment[]

  // Premium Access (6 months free Premium as bonus)
  grantsPremiumUntil DateTime?

  // Refund Handling
  refundedAt        DateTime?
  refundReason      String?

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([userId])
  @@index([status])
  @@index([stripePaymentIntent])
}

enum PaymentStatus {
  PENDING
  PROCESSING
  SUCCEEDED
  FAILED
  REFUNDED
  DISPUTED
}

// ============================================================================
// CERTIFICATION
// ============================================================================

model Certification {
  id                String   @id @default(cuid())
  userId            String
  user              User     @relation(fields: [userId], references: [id])

  // Certification Details
  certificationId   String   @unique  // e.g., "INTR-SOFT-2025-A3F21"
  certificateName   String   // "InTransparency Soft Skills Certification"
  certificateUrl    String   // PDF certificate URL (S3)

  // Associated Assessments
  bigFiveId         String?
  discId            String?
  competencyId      String?

  // Badge Display
  badgeImageUrl     String   // Badge image (SVG or PNG)
  badgeVerificationUrl String  // Public verification URL

  // Validity
  issuedAt          DateTime @default(now())
  expiresAt         DateTime? // Certifications can expire (e.g., 2 years)
  isActive          Boolean  @default(true)
  revokedAt         DateTime?
  revokeReason      String?

  // Visibility
  isPublic          Boolean  @default(true)
  showOnProfile     Boolean  @default(true)

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([userId])
  @@index([certificationId])
  @@index([isActive])
}

// ============================================================================
// UPDATE EXISTING USER MODEL
// ============================================================================

model User {
  // ... existing fields ...

  // NEW: Soft Skills Relations
  softSkillAssessments SoftSkillAssessment[]
  bigFiveProfile       BigFiveProfile?
  discProfile          DISCProfile?
  competencyProfile    CompetencyProfile?
  certifications       Certification[]
  payments             Payment[]

  // NEW: Soft Skills Summary (denormalized for quick access)
  hasSoftSkillsCert    Boolean  @default(false)
  softSkillsScore      Float?   // Overall soft skills score (0-100)
  topSoftSkills        String[] // e.g., ["Communication", "Teamwork", "Leadership"]

  // ... rest of existing fields ...
}

// ============================================================================
// RECRUITER SAVED SEARCHES (Add soft skills filters)
// ============================================================================

model SavedSearch {
  // ... existing fields ...

  // NEW: Soft Skills Filters
  softSkillsFilters Json? // Store Big Five ranges, DISC preferences, competency minimums

  // Example JSON:
  // {
  //   "bigFive": {"openness": {"min": 60, "max": 100}},
  //   "disc": {"primaryStyle": ["D", "DI"]},
  //   "competencies": {"communication": {"min": 70}}
  // }
}
```

---

### Database Migration

```bash
# Run Prisma migration
cd frontend
npx prisma migrate dev --name add_soft_skills_models

# Generate Prisma Client
npx prisma generate

# Seed test data (optional)
npx prisma db seed
```

---

## 🔌 PART 2: Backend API Endpoints

### New API Routes

```javascript
// frontend/app/api/assessments/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

// POST /api/assessments - Create new assessment
export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { assessmentType } = await req.json()

  // Validate user has paid for certification
  const hasPaid = await prisma.payment.findFirst({
    where: {
      userId: session.user.id,
      status: 'SUCCEEDED',
      productType: 'SOFT_SKILLS_CERTIFICATION'
    }
  })

  if (!hasPaid) {
    return NextResponse.json(
      { error: 'Payment required to access assessment' },
      { status: 402 }
    )
  }

  // Create assessment
  const assessment = await prisma.softSkillAssessment.create({
    data: {
      userId: session.user.id,
      assessmentType: assessmentType || 'FULL_SUITE',
      status: 'IN_PROGRESS',
      responses: {},
      paymentId: hasPaid.id
    }
  })

  return NextResponse.json({ assessment }, { status: 201 })
}

// GET /api/assessments - Get user's assessments
export async function GET(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const assessments = await prisma.softSkillAssessment.findMany({
    where: { userId: session.user.id },
    include: {
      payment: true,
      bigFiveProfile: true,
      discProfile: true,
      competencyProfile: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json({ assessments })
}
```

---

```javascript
// frontend/app/api/assessments/[id]/submit/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { responses } = await req.json()

  // Find assessment
  const assessment = await prisma.softSkillAssessment.findUnique({
    where: { id: params.id }
  })

  if (!assessment || assessment.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (assessment.status === 'COMPLETED') {
    return NextResponse.json(
      { error: 'Assessment already completed' },
      { status: 400 }
    )
  }

  // Calculate scores (call Python AI service)
  const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000'
  const scoreResponse = await fetch(`${aiServiceUrl}/psychometric/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      assessmentType: assessment.assessmentType,
      responses
    })
  })

  if (!scoreResponse.ok) {
    return NextResponse.json(
      { error: 'Scoring failed' },
      { status: 500 }
    )
  }

  const scores = await scoreResponse.json()

  // Update assessment
  const updated = await prisma.softSkillAssessment.update({
    where: { id: params.id },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
      responses,
      scores: scores.scores,
      percentiles: scores.percentiles,
      interpretation: scores.interpretation
    }
  })

  // Create profile records (Big Five, DISC, Competency)
  if (assessment.assessmentType === 'BIG_FIVE' || assessment.assessmentType === 'FULL_SUITE') {
    await prisma.bigFiveProfile.create({
      data: {
        userId: session.user.id,
        assessmentId: params.id,
        ...scores.bigFive
      }
    })
  }

  if (assessment.assessmentType === 'DISC' || assessment.assessmentType === 'FULL_SUITE') {
    await prisma.dISCProfile.create({
      data: {
        userId: session.user.id,
        assessmentId: params.id,
        ...scores.disc
      }
    })
  }

  if (assessment.assessmentType === 'COMPETENCY' || assessment.assessmentType === 'FULL_SUITE') {
    await prisma.competencyProfile.create({
      data: {
        userId: session.user.id,
        assessmentId: params.id,
        ...scores.competency
      }
    })
  }

  // Generate certification
  const certification = await prisma.certification.create({
    data: {
      userId: session.user.id,
      certificationId: `INTR-SOFT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      certificateName: 'InTransparency Soft Skills Certification',
      certificateUrl: '', // TODO: Generate PDF
      badge ImageUrl: '/badges/soft-skills-certified.svg',
      badgeVerificationUrl: `https://intransparency.com/verify/${certificationId}`,
      bigFiveId: scores.bigFive?.id,
      discId: scores.disc?.id,
      competencyId: scores.competency?.id
    }
  })

  // Update user's hasSoftSkillsCert flag
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      hasSoftSkillsCert: true,
      softSkillsScore: scores.overallScore,
      topSoftSkills: scores.topSkills
    }
  })

  return NextResponse.json({
    assessment: updated,
    certification
  })
}
```

---

```javascript
// frontend/app/api/payments/create-checkout/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { priceId } = await req.json() // €99 product price ID

  // Create Stripe Checkout Session
  const checkoutSession = await stripe.checkout.sessions.create({
    customer_email: session.user.email,
    line_items: [
      {
        price: priceId, // Stripe Price ID for €99 one-time product
        quantity: 1
      }
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/student/assessment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/student/pricing`,
    metadata: {
      userId: session.user.id,
      productType: 'SOFT_SKILLS_CERTIFICATION'
    }
  })

  return NextResponse.json({ checkoutUrl: checkoutSession.url })
}
```

---

```javascript
// frontend/app/api/webhooks/stripe/route.ts

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Create Payment record
    await prisma.payment.create({
      data: {
        userId: session.metadata!.userId,
        amount: (session.amount_total || 0) / 100, // Convert cents to euros
        currency: session.currency?.toUpperCase() || 'EUR',
        status: 'SUCCEEDED',
        stripePaymentIntent: session.payment_intent as string,
        stripeCheckoutSession: session.id,
        stripeCustomerId: session.customer as string,
        productType: session.metadata!.productType,
        grantsPremiumUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) // 6 months
      }
    })

    // Send confirmation email (TODO)
  }

  return NextResponse.json({ received: true })
}
```

---

## 🤖 PART 3: AI Service (Python)

### Psychometric Scoring Service

```python
# backend/ai-service/app/services/psychometric_scorer.py

from typing import Dict, List, Any
import numpy as np
from dataclasses import dataclass

@dataclass
class BigFiveScores:
    openness: float
    conscientiousness: float
    extraversion: float
    agreeableness: float
    neuroticism: float
    percentiles: Dict[str, float]
    personality_type: str
    summary: str

@dataclass
class DISCScores:
    dominance: float
    influence: float
    steadiness: float
    compliance: float
    primary_style: str
    secondary_style: str
    percentiles: Dict[str, float]
    description: str

class PsychometricScorer:
    """
    Scores psychometric assessments based on validated frameworks.
    """

    def __init__(self):
        # Big Five question mapping (60 questions total)
        self.big_five_mapping = {
            'openness': [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56],
            'conscientiousness': [2, 7, 12, 17, 22, 27, 32, 37, 42, 47, 52, 57],
            'extraversion': [3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53, 58],
            'agreeableness': [4, 9, 14, 19, 24, 29, 34, 39, 44, 49, 54, 59],
            'neuroticism': [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]
        }

        # DISC question mapping (24 questions total)
        self.disc_mapping = {
            'dominance': [1, 5, 9, 13, 17, 21],
            'influence': [2, 6, 10, 14, 18, 22],
            'steadiness': [3, 7, 11, 15, 19, 23],
            'compliance': [4, 8, 12, 16, 20, 24]
        }

        # Competency mapping (40 questions, 5 per competency)
        self.competency_mapping = {
            'communication': [1, 9, 17, 25, 33],
            'teamwork': [2, 10, 18, 26, 34],
            'leadership': [3, 11, 19, 27, 35],
            'problem_solving': [4, 12, 20, 28, 36],
            'adaptability': [5, 13, 21, 29, 37],
            'emotional_intel': [6, 14, 22, 30, 38],
            'time_management': [7, 15, 23, 31, 39],
            'creativity': [8, 16, 24, 32, 40]
        }

    async def score_big_five(self, responses: Dict[int, int]) -> BigFiveScores:
        """
        Score Big Five personality assessment.
        Responses: {question_id: score (1-5)}
        """
        scores = {}

        for trait, questions in self.big_five_mapping.items():
            trait_scores = []
            for q_id in questions:
                if q_id in responses:
                    score = responses[q_id]
                    # Reverse score if needed (some questions are negatively keyed)
                    if self._is_reverse_keyed(trait, q_id):
                        score = 6 - score  # Reverse 1-5 scale
                    trait_scores.append(score)

            # Calculate mean (0-100 scale)
            if trait_scores:
                raw_score = np.mean(trait_scores)
                scores[trait] = (raw_score - 1) / 4 * 100  # Convert 1-5 to 0-100
            else:
                scores[trait] = 50  # Default to middle if no data

        # Calculate percentiles (vs population norms)
        percentiles = await self._calculate_percentiles('big_five', scores)

        # Determine personality type
        personality_type = self._classify_personality_type(scores)

        # Generate AI summary
        summary = await self._generate_personality_summary(scores, personality_type)

        return BigFiveScores(
            openness=scores['openness'],
            conscientiousness=scores['conscientiousness'],
            extraversion=scores['extraversion'],
            agreeableness=scores['agreeableness'],
            neuroticism=scores['neuroticism'],
            percentiles=percentiles,
            personality_type=personality_type,
            summary=summary
        )

    async def score_disc(self, responses: Dict[int, int]) -> DISCScores:
        """
        Score DISC behavioral assessment.
        Responses: {question_id: score (1-5)}
        """
        scores = {}

        for dimension, questions in self.disc_mapping.items():
            dimension_scores = [responses.get(q_id, 3) for q_id in questions]
            raw_score = np.mean(dimension_scores)
            scores[dimension] = (raw_score - 1) / 4 * 100

        # Determine primary and secondary styles
        sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        primary_style = sorted_scores[0][0][0].upper()  # D, I, S, or C
        secondary_style = sorted_scores[1][0][0].upper() if sorted_scores[1][1] > 60 else None

        # Calculate percentiles
        percentiles = await self._calculate_percentiles('disc', scores)

        # Generate description
        description = await self._generate_disc_description(scores, primary_style, secondary_style)

        return DISCScores(
            dominance=scores['dominance'],
            influence=scores['influence'],
            steadiness=scores['steadiness'],
            compliance=scores['compliance'],
            primary_style=primary_style + (secondary_style or ''),
            secondary_style=secondary_style or '',
            percentiles=percentiles,
            description=description
        )

    async def score_competencies(self, responses: Dict[int, int]) -> Dict[str, Any]:
        """
        Score soft skill competencies.
        Responses: {question_id: score (1-5)}
        """
        scores = {}

        for competency, questions in self.competency_mapping.items():
            competency_scores = [responses.get(q_id, 3) for q_id in questions]
            raw_score = np.mean(competency_scores)
            scores[competency] = (raw_score - 1) / 4 * 100

        # Calculate percentiles
        percentiles = await self._calculate_percentiles('competency', scores)

        # Identify top strengths and growth areas
        sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        top_strengths = [comp for comp, score in sorted_scores[:3] if score > 70]
        growth_areas = [comp for comp, score in sorted_scores[-3:] if score < 60]

        # Generate summary
        summary = await self._generate_competency_summary(scores, top_strengths, growth_areas)

        return {
            **scores,
            'percentiles': percentiles,
            'top_strengths': top_strengths,
            'growth_areas': growth_areas,
            'summary': summary
        }

    def _is_reverse_keyed(self, trait: str, question_id: int) -> bool:
        """
        Determine if a Big Five question is reverse-scored.
        Example: "I am not very organized" should be reversed for Conscientiousness.
        """
        reverse_keyed = {
            'extraversion': [8, 18, 28, 38, 48, 58],
            'agreeableness': [9, 19, 29, 39, 49, 59],
            'conscientiousness': [7, 17, 27, 37, 47, 57],
            'neuroticism': [5, 15, 25, 35, 45, 55],
            'openness': [11, 21, 31, 41, 51]
        }
        return question_id in reverse_keyed.get(trait, [])

    async def _calculate_percentiles(self, assessment_type: str, scores: Dict[str, float]) -> Dict[str, float]:
        """
        Calculate percentile rankings vs other InTransparency users.
        In production, this queries the database for population norms.
        """
        # TODO: Query database for actual user population norms
        # For now, use simulated normal distribution
        percentiles = {}

        for trait, score in scores.items():
            # Assume normal distribution: mean=50, sd=15
            z_score = (score - 50) / 15
            percentile = self._z_to_percentile(z_score)
            percentiles[f"{trait}_percentile"] = percentile

        return percentiles

    def _z_to_percentile(self, z: float) -> float:
        """Convert z-score to percentile (0-100)"""
        from scipy.stats import norm
        return norm.cdf(z) * 100

    def _classify_personality_type(self, scores: Dict[str, float]) -> str:
        """
        Classify personality type based on Big Five scores.
        Simplified classification for demonstration.
        """
        high_o = scores['openness'] > 60
        high_c = scores['conscientiousness'] > 60
        high_e = scores['extraversion'] > 60
        high_a = scores['agreeableness'] > 60
        low_n = scores['neuroticism'] < 40  # Low neuroticism = Emotional stability

        if high_c and high_e and low_n:
            return "Conscientious Achiever"
        elif high_o and high_e:
            return "Creative Communicator"
        elif high_a and high_c:
            return "Reliable Team Player"
        elif high_o and low_n:
            return "Innovative Thinker"
        elif high_e and high_a:
            return "Energetic Collaborator"
        else:
            return "Balanced Personality"

    async def _generate_personality_summary(self, scores: Dict[str, float], personality_type: str) -> str:
        """
        Generate AI summary of personality using OpenAI.
        """
        from openai import AsyncOpenAI
        client = AsyncOpenAI()

        prompt = f"""
        Generate a professional 2-3 sentence personality summary based on Big Five scores:

        Openness: {scores['openness']:.0f}/100
        Conscientiousness: {scores['conscientiousness']:.0f}/100
        Extraversion: {scores['extraversion']:.0f}/100
        Agreeableness: {scores['agreeableness']:.0f}/100
        Emotional Stability: {100 - scores['neuroticism']:.0f}/100

        Personality Type: {personality_type}

        Write it as if describing this person to a recruiter. Focus on workplace strengths.
        """

        response = await client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150,
            temperature=0.7
        )

        return response.choices[0].message.content.strip()

    async def _generate_disc_description(
        self,
        scores: Dict[str, float],
        primary_style: str,
        secondary_style: str | None
    ) -> str:
        """
        Generate DISC behavioral style description.
        """
        style_descriptions = {
            'D': "Direct, results-oriented, and decisive. Thrives in competitive environments and leadership roles.",
            'I': "Outgoing, enthusiastic, and persuasive. Excel in teamwork and client-facing roles.",
            'S': "Steady, patient, and supportive. Values stability and harmonious work relationships.",
            'C': "Analytical, precise, and detail-oriented. Excels in technical and research-focused roles."
        }

        primary_desc = style_descriptions.get(primary_style, "Balanced style")
        secondary_desc = f" with {style_descriptions.get(secondary_style, '')} tendencies" if secondary_style else ""

        return f"{primary_desc}{secondary_desc}"

    async def _generate_competency_summary(
        self,
        scores: Dict[str, float],
        top_strengths: List[str],
        growth_areas: List[str]
    ) -> str:
        """
        Generate competency assessment summary.
        """
        from openai import AsyncOpenAI
        client = AsyncOpenAI()

        strengths_text = ", ".join(top_strengths) if top_strengths else "well-rounded skills"
        growth_text = ", ".join(growth_areas) if growth_areas else "continued development"

        prompt = f"""
        Generate a professional 2-sentence summary of soft skill competencies:

        Top Strengths: {strengths_text}
        Growth Areas: {growth_text}

        Communication: {scores['communication']:.0f}/100
        Teamwork: {scores['teamwork']:.0f}/100
        Leadership: {scores['leadership']:.0f}/100
        Problem-Solving: {scores['problem_solving']:.0f}/100

        Write it professionally for a recruiter to read.
        """

        response = await client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=100,
            temperature=0.7
        )

        return response.choices[0].message.content.strip()
```

---

```python
# backend/ai-service/app/api/psychometric/route.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from app.services.psychometric_scorer import PsychometricScorer

router = APIRouter()
scorer = PsychometricScorer()

class AssessmentRequest(BaseModel):
    assessmentType: str  # BIG_FIVE, DISC, COMPETENCY, FULL_SUITE
    responses: Dict[int, int]

@router.post("/psychometric/score")
async def score_assessment(request: AssessmentRequest) -> Dict[str, Any]:
    """
    Score psychometric assessment and return results.
    """
    try:
        results = {}

        if request.assessmentType in ['BIG_FIVE', 'FULL_SUITE']:
            big_five = await scorer.score_big_five(request.responses)
            results['bigFive'] = {
                'openness': big_five.openness,
                'conscientiousness': big_five.conscientiousness,
                'extraversion': big_five.extraversion,
                'agreeableness': big_five.agreeableness,
                'neuroticism': big_five.neuroticism,
                'percentiles': big_five.percentiles,
                'personalityType': big_five.personality_type,
                'summary': big_five.summary
            }

        if request.assessmentType in ['DISC', 'FULL_SUITE']:
            disc = await scorer.score_disc(request.responses)
            results['disc'] = {
                'dominance': disc.dominance,
                'influence': disc.influence,
                'steadiness': disc.steadiness,
                'compliance': disc.compliance,
                'primaryStyle': disc.primary_style,
                'secondaryStyle': disc.secondary_style,
                'percentiles': disc.percentiles,
                'description': disc.description
            }

        if request.assessmentType in ['COMPETENCY', 'FULL_SUITE']:
            competencies = await scorer.score_competencies(request.responses)
            results['competency'] = competencies

        # Calculate overall soft skills score (weighted average)
        overall_score = calculate_overall_score(results)
        top_skills = extract_top_skills(results)

        results['overallScore'] = overall_score
        results['topSkills'] = top_skills
        results['interpretation'] = f"Overall soft skills assessment completed. {results.get('bigFive', {}).get('summary', '')}"

        return results

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scoring failed: {str(e)}")

def calculate_overall_score(results: Dict[str, Any]) -> float:
    """Calculate weighted overall soft skills score."""
    scores = []

    if 'bigFive' in results:
        bf = results['bigFive']
        # Emotional stability is inverse of neuroticism
        emotional_stability = 100 - bf['neuroticism']
        avg_big_five = (
            bf['openness'] + bf['conscientiousness'] +
            bf['extraversion'] + bf['agreeableness'] + emotional_stability
        ) / 5
        scores.append(avg_big_five * 0.4)  # 40% weight

    if 'disc' in results:
        disc = results['disc']
        # Higher scores in all DISC dimensions indicate flexibility
        avg_disc = (
            disc['dominance'] + disc['influence'] +
            disc['steadiness'] + disc['compliance']
        ) / 4
        scores.append(avg_disc * 0.2)  # 20% weight

    if 'competency' in results:
        comp = results['competency']
        avg_comp = (
            comp['communication'] + comp['teamwork'] +
            comp['leadership'] + comp['problem_solving'] +
            comp['adaptability'] + comp['emotional_intel']
        ) / 6
        scores.append(avg_comp * 0.4)  # 40% weight

    return sum(scores) / len(scores) if scores else 50.0

def extract_top_skills(results: Dict[str, Any]) -> list[str]:
    """Extract top 3-5 soft skills from results."""
    skills = []

    if 'competency' in results:
        comp = results['competency']
        top_strengths = comp.get('top_strengths', [])
        skills.extend(top_strengths[:3])

    if 'bigFive' in results:
        bf = results['bigFive']
        # Add high Big Five traits
        if bf['openness'] > 70:
            skills.append("Creative Thinking")
        if bf['conscientiousness'] > 70:
            skills.append("Reliability")
        if bf['extraversion'] > 70:
            skills.append("Communication")
        if bf['agreeableness'] > 70:
            skills.append("Teamwork")

    # Return unique skills, max 5
    return list(dict.fromkeys(skills))[:5]
```

---

##  (Continued in next message due to length limit...)

**This implementation roadmap is extremely detailed and ready for development. Would you like me to continue with:**
1. Frontend components (React/Next.js UI)
2. Partnership research details
3. Legal compliance checklist

Or should I wrap up the remaining deliverables?