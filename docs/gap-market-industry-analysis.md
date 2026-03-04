# Gap Analysis, Target Markets & Industry Fit

> Last updated: 2026-03-04

## 1. Feature Gaps

### P0 — Ship Immediately

| Gap | Effort | Why |
|-----|--------|-----|
| **CSV export** | 1 week | Table stakes. AlmaLaurea, LinkedIn, Handshake all have it. Recruiters churn without it. |
| **CV auto-generation** | In progress | Most-requested student feature on any talent platform. |

### P1 — Ship Within 6 Months

| Gap | Effort | Why |
|-----|--------|-----|
| **In-platform messaging** | 4-6 weeks | Keeps recruiter-candidate communication on-platform. Increases stickiness and hiring outcome tracking. Currently, pay-per-contact reveals email/phone and pushes conversations off-platform. |
| **White-label portal** | 8-12 weeks | Handshake's #1 selling point for university adoption. Without it, AlmaLaurea's 70+ university network is unassailable. |
| **Multi-university coverage** | Ongoing (sales) | AlmaLaurea: 70+. InTransparency: growing. This is the fundamental network effect. |

### P2 — Build Strategically

| Gap | Effort | Why |
|-----|--------|-----|
| **Mobile PWA** | 4 weeks | Students live on mobile. No PWA manifest or native app exists. |
| **Employer branding pages** | 2 weeks | `/companies/[slug]` exists but isn't monetized. Tutored and Handshake sell employer branding as a revenue stream. |
| **Institutional outcome reports** | 4 weeks | AlmaLaurea's annual "Rapporto" is a key selling point. InTransparency has analytics but no published institutional reports. |

### Gaps the Competitive Matrix Missed

- **Video introductions** — `/app/api/upload/video/` exists but isn't promoted. Handshake offers this. Should surface in matrix as a differentiator.
- **Job board volume** — Routes exist (`/api/jobs/`, student job search) but the question is whether job volume competes with Handshake/LinkedIn.

---

## 2. Target Markets

### Geographic Markets (Ranked by Fit)

#### Tier 1: Italy (Must-Win)
- ITS institution support (unique — zero competition)
- Italian grading (18-30 scale) already supported
- 67 universities + 120+ ITS academies
- AlmaLaurea is the incumbent to displace
- **Strategy**: Dominate ITS first (no competition), then expand to polytechnics

#### Tier 2: Germany / Austria / Switzerland (DACH)
- Grade normalization already supports German system (1.0-5.0)
- **Fachhochschulen** (universities of applied sciences) = German equivalent of ITS, project-heavy, underserved by LinkedIn
- Massive SME sector (Mittelstand) — 3.5M companies that can't justify €8K LinkedIn seats
- Pay-per-contact at €10 is a natural fit
- No dominant university-to-work platform exists
- **Barrier**: German language support needed
- **Strategy**: Pilot with 3-5 Fachhochschulen, add DE locale

#### Tier 3: France
- Grade normalization supports French system (0-20)
- IUT (Instituts Universitaires de Technologie) = French equivalent of ITS
- No dominant platform equivalent to AlmaLaurea
- **Barrier**: French language; strong state-run employment services

#### Tier 4: Spain
- Grade normalization supports Spanish system (0-10)
- FP (Formacion Profesional) = Spanish equivalent of ITS
- 28%+ youth unemployment = strong demand
- **Barrier**: Spanish language; lower employer willingness to pay

#### Tier 5: Netherlands
- Dutch grading (1-10) already supported
- Small but wealthy market, high English proficiency
- Good test market for broader EU expansion

#### Not a Fit
- **US**: Different grading system (GPA), no Bologna Process, Handshake dominates. Platform is EU-centric.
- **Asia/Middle East**: No grading system support, different institutional structures.

### University Segments

| Segment | Fit | Why |
|---------|-----|-----|
| **ITS Academies** | Best | Only platform serving them. 120+ in Italy, zero competition. |
| **Polytechnics / Applied Sciences** | Strong | Project-based curricula map directly to AI project analysis. Politecnico di Milano, Fachhochschulen (DE), Hogescholen (NL). |
| **Mid-tier universities (ranked 50-500)** | Strong | Students most disadvantaged by "CV + cover letter" model. Most helped by verified portfolios. |
| **Elite research universities** | Moderate | Brand cachet, but students already have strong outcomes. Value shifts to analytics for career services. |
| **Online-only / for-profit** | Weak | Institutional verification model requires real faculty/career services relationships. |

### Employer Segments

| Segment | Fit | Why |
|---------|-----|-----|
| **SMEs (10-250 employees)** | Best | Pay-per-contact designed for this. Can't justify annual subscriptions but hire 2-5 grads/year. "Cost per hire ~€100" directly targets them. |
| **Mid-market (250-2,000)** | Strong | Have structured recruitment but lack dedicated talent tech. ATS integrations (Greenhouse/Lever) and Decision Packs serve them well. |
| **Large enterprises** | Moderate | RECRUITER_ENTERPRISE tier exists. Would value API access and bulk search. But already locked into LinkedIn/AlmaLaurea. |
| **Staffing agencies** | Weak | Pay-per-contact conflicts with agency business models (need volume access, not per-contact gating). |

---

## 3. Industry Fit

### Tier 1: Highest Value

#### Engineering & Manufacturing
- Project portfolios are the currency of engineering hiring (CAD, FEA, circuit designs)
- ITS institutions serve this directly (mechatronics, automation, Industry 4.0)
- Italian manufacturing is SME-heavy and struggles with talent acquisition
- DISC profiles matter for team dynamics in project-based engineering

#### Information Technology & Software
- GitHub integration already built
- AI project analysis evaluates code quality, architecture, technical complexity
- Most competitive segment — every platform targets tech hiring
- Differentiate via institutional verification (vs. self-reported LinkedIn skills)

#### Consulting & Professional Services
- Soft skills verification (DISC, communication, teamwork) is disproportionately valuable
- Big Four spend heavily on behavioral assessment — InTransparency's 25-section personality insights is directly relevant
- Grade-sensitive hiring → normalized grades add clear value

#### Architecture & Design
- Portfolio-based hiring is standard practice
- Italian universities are world-class in design (Politecnico di Milano, IUAV, Domus Academy)
- Search filters already include "Design (Industrial/Graphic/Fashion)" and "Architecture"

### Tier 2: Strong Fit

#### Financial Services & Banking
- Verified quantitative skills (grades in math, statistics, econometrics) matter
- Italian banking (UniCredit, Intesa Sanpaolo) recruits heavily from Italian universities
- DISC profiles used for team composition and client-facing roles

#### Pharmaceuticals & Biotech
- ITS academies cover biotech
- Regulatory environments value verified, traceable credentials
- Lab work and research papers are verifiable project artifacts

#### Legal Services
- Search includes "Corporate Law" and "International Law" categories
- Grade-sensitive hiring → normalized grades critical
- Bologna Process normalization enables cross-border hiring of EU lawyers

#### Marketing, Communications & Media
- Portfolio-based hiring (campaigns, content, social media metrics)
- Less grade-sensitive, more portfolio-sensitive — plays to InTransparency's strengths

### Tier 3: Moderate Fit

| Industry | Notes |
|----------|-------|
| Healthcare (non-physician) | Admin, informatics, nursing management. Physician hiring has different dynamics. |
| Education & Training | Teaching staff, ed-tech, curriculum designers. Smaller market, lower willingness to pay. |
| EU public sector | Increasingly competency-based hiring. National public sector (concorsi) is too regulated. |

### Not a Fit

| Industry | Why |
|----------|-----|
| Retail / Hospitality / Food Service | High-volume, low-skill. €100/hire too expensive. |
| Construction / Trades | Industry-specific certifications, not academic portfolios. |
| Agriculture | Low-volume graduate hiring, minimal digital adoption. |
| Gig economy | Workers aren't "hired" traditionally. No fit for pay-per-contact. |

---

## 4. Positioning Gaps

| Gap | Current State | Action |
|-----|--------------|--------|
| **Geographic messaging** | Zero messaging about non-Italian markets despite supporting 6 EU grading systems | Add "European expansion ready" messaging; pilot DE market |
| **Industry landing pages** | Claims "ANY sector" but no industry-specific pages | Create `/for-engineering`, `/for-consulting`, `/for-design` landing pages |
| **SME positioning** | Pay-per-contact is designed for SMEs but "SME" appears nowhere | Make SME targeting explicit in marketing copy |
| **Industry case studies** | Social proof = UniBG + Start Cup Bergamo only | Add employer testimonials from Engineering, IT, Consulting verticals |
| **ITS expansion** | Strong `/for-its-institutes` page but no equivalent for EU counterparts | Create Fachhochschulen/IUT-specific pages for expansion |

---

## 5. Strategic Moat

InTransparency's three unique differentiators (per competitive matrix):

1. **Pay-per-contact pricing** — No competitor offers this. Eliminates risk for SMEs. Deepening strategy: Add contact bundles (10 for €80, 25 for €175) for mid-market.

2. **AI project analysis** — Unique. No competitor analyzes student projects with AI. Deepening strategy: Add industry-specific analysis frameworks (engineering rigor, code quality, design craft).

3. **Personality coaching (25 sections)** — Far beyond any competitor. Deepening strategy: Add AI-generated coaching plans that update monthly based on new assessments.

**Invest in deepening these moats rather than broadening into more features.**
