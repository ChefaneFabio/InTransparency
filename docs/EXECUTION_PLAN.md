# InTransparency 8-Week Execution Plan

## Overview

**Goal**: Get 3 pilot universities with 300+ verified students, then 5 recruiters testing

**Key Insight**: You have a comprehensive Prisma schema in frontend with real database models. The Express backend has mock implementations. We'll consolidate on Next.js API routes.

---

## Architecture Decision

### Current State
```
Frontend (Next.js)
├── Prisma schema with full models ✅
├── API routes that use Prisma ✅
└── Working database connection ✅

Backend (Express)
├── universityService.ts with 35+ TODOs ❌
├── Mock data everywhere ❌
└── No Prisma connection ❌
```

### Recommended: Use Next.js API Routes

**Why:**
- Already have working Prisma integration
- Simpler deployment (one service, not two)
- Schema is comprehensive (UniversityConnection, Course, Project, etc.)
- Less code to maintain

**Action:** Build university features in Next.js API routes, phase out Express backend for these features.

---

## Week 1-2: Complete University Verification System

### Models Already in Prisma (frontend/prisma/schema.prisma):

```prisma
model UniversityConnection {
  id                  String   @id @default(cuid())
  userId              String   @unique
  universityId        String
  universityName      String
  universityType      String   @default("university")
  city                String?
  institutionalEmail  String
  verificationStatus  VerificationStatus @default(PENDING)
  verificationToken   String?  @unique
  verificationSentAt  DateTime?
  verifiedAt          DateTime?
  // ... sync settings
}

model Course {
  id              String   @id @default(cuid())
  courseName      String
  courseCode      String
  university      String
  professorName   String?
  universityVerified Boolean @default(false)
  // ...
}

model Project {
  // Has grade, courseName, courseCode, universityVerified fields
}
```

### New API Routes to Create:

```
/api/university/register          - University signs up
/api/university/verify-domain     - Verify university domain
/api/university/students/import   - CSV bulk import
/api/university/students/list     - List university students
/api/university/verify-student    - Verify a student
/api/university/dashboard         - University stats
```

### Technical Tasks:

- [ ] Create University model in Prisma schema
- [ ] Build POST /api/university/register
- [ ] Build POST /api/university/verify-domain (email-based)
- [ ] Build POST /api/university/students/import (CSV parsing)
- [ ] Build GET /api/university/students
- [ ] Build POST /api/university/verify-student
- [ ] Update UniversityConnection to link properly
- [ ] Add "Verified by [University]" badge component
- [ ] Replace mock data in university dashboard with real queries

---

## Week 3-4: University Onboarding Flow

### User Journey:

```
1. University Admin visits /register/university
   ↓
2. Fills form: name, domain, contact email, student count
   ↓
3. Receives verification email with code
   ↓
4. Clicks link → domain verified
   ↓
5. Redirected to dashboard with CSV upload prompt
   ↓
6. Uploads student CSV (email, name, program, year)
   ↓
7. System sends invite emails to students
   ↓
8. Students click link → claim profile → add projects
   ↓
9. Projects automatically get "Verified by [University]" badge
   ↓
10. University dashboard shows real stats
```

### Frontend Components Needed:

- [ ] UniversityRegistrationForm component
- [ ] DomainVerificationPage
- [ ] CSVUploadComponent with preview
- [ ] StudentInviteEmailTemplate
- [ ] UniversityDashboard with real data
- [ ] VerifiedBadge component

---

## Week 5-6: University Outreach

### Target: 10 Italian ITS Institutes

**Why ITS:**
- Smaller, more agile than traditional universities
- Career-focused (aligned with your value prop)
- Italy has 120+ ITS institutes
- Less bureaucracy than large universities

### Outreach List:

| ITS | Location | Focus | Contact |
|-----|----------|-------|---------|
| ITS Angelo Rizzoli | Milan | Digital/ICT | [research] |
| ITS Lombardia Meccatronica | Bergamo | Mechatronics | [research] |
| ITS Giulio Natta | Bergamo | Chemistry | [research] |
| ITS Machina Lonati | Brescia | Manufacturing | [research] |
| ITS Incom | Bergamo | Automation | [research] |
| ITS Tech Talent Factory | Milan | Tech | [research] |
| ITS Rizzoli | Milan | Publishing | [research] |
| ITS Servizi alle Imprese | Bologna | Business | [research] |
| ITS Maker | Bologna | Manufacturing | [research] |
| ITS Biomedicale | Mirandola | Biomedical | [research] |

### Outreach Sequence:

**Day 1-3:** Send initial emails
**Day 4-7:** Follow up, book demos
**Day 8-14:** Conduct demos, handle objections
**Day 15-21:** Sign pilot agreements
**Day 22-28:** Hands-on onboarding support

---

## Week 7-8: Recruiter Pilot Program

### Find Recruiters Who Hire From Pilot Universities

**Strategy:**
1. Ask each pilot university: "Which companies hire your students?"
2. Get 5-10 company names per university
3. Reach out to HR/talent acquisition

### Pilot Offer:

```
Subject: Free access - verified talent from [University]

Hi [Name],

I noticed [Company] hires graduates from [ITS Institute].

We're launching InTransparency - a platform where you can
search candidates by verified academic projects and grades.

Every student profile is verified by their institution.
No resume fraud. No unverified claims.

We'd like to offer you free access for 3 months to test it.

Interested in a 15-minute demo?

[Your name]
```

### Success Metrics:

- 5 recruiters with active accounts
- Each recruiter performs 5+ searches
- Collect feedback: "Would you pay? What's missing?"

---

## Technical Deliverables Checklist

### Week 1:
- [ ] Add University model to Prisma schema
- [ ] Create /api/university/register endpoint
- [ ] Create /api/university/verify-domain endpoint
- [ ] Build email verification flow

### Week 2:
- [ ] Create /api/university/students/import (CSV)
- [ ] Build CSV upload UI with validation
- [ ] Create student invite email template
- [ ] Build student claim-profile flow

### Week 3:
- [ ] Replace mock data in university dashboard
- [ ] Add "Verified by [University]" badge
- [ ] Build university settings page
- [ ] Test end-to-end flow

### Week 4:
- [ ] Fix any bugs from testing
- [ ] Add basic analytics for universities
- [ ] Prepare demo environment
- [ ] Create demo script

### Week 5-6:
- [ ] Send outreach emails
- [ ] Conduct university demos
- [ ] Sign pilot agreements
- [ ] Support onboarding

### Week 7-8:
- [ ] Identify recruiters from pilot universities
- [ ] Send recruiter outreach
- [ ] Onboard 5 recruiters
- [ ] Collect feedback

---

## Feature Freeze List

**DO NOT TOUCH for 8 weeks:**

- AI career guidance
- Additional languages
- Mobile app improvements
- Analytics dashboards (beyond basic)
- Messaging system improvements
- New student features
- Subscription/payment features
- Marketing pages

**ONLY WORK ON:**
- University verification
- Student verification badges
- CSV import
- Basic university dashboard
- Recruiter search (if broken)

---

## Success Criteria

### End of Week 4:
- Working university registration flow
- Working CSV student import
- Working verification badge
- Demo-ready product

### End of Week 6:
- 3 signed pilot universities
- 200+ verified students
- Real data in dashboards

### End of Week 8:
- 5 recruiters testing
- Feedback collected
- Clear answer to "Would you pay?"

---

## Decision Point at Week 8

**If recruiters say "Yes, I'd pay":**
→ Build what they ask for
→ Start charging
→ Raise seed round

**If recruiters say "No":**
→ Ask "What would make you pay?"
→ Pivot based on feedback
→ Don't build more features until you know what they want
