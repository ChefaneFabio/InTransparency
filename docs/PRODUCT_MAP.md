# InTransparency — Product Map (Functions + Goals by Segment)

Comprehensive reference of every page in the product, what it does, and why
it exists. Three customer segments, plus shared/marketing surfaces.

---

## Table of Contents

1. [Three customer segments — at a glance](#three-customer-segments)
2. [Students](#students)
3. [Companies / Recruiters](#companies--recruiters)
4. [Institutions (Universities, ITS, Schools)](#institutions-universities-its-schools)
5. [Professors (cross-segment, institution-affiliated)](#professors)
6. [Marketing / Public surfaces](#marketing--public)
7. [Auth flows](#auth)

---

## Three customer segments

| Segment | Core job-to-be-done | Pricing model |
|---|---|---|
| **Students** | "Help me capire chi sei (figure out who I am), then make my work visible to companies that fit." | Free + Premium €3.99/mo or €29/yr |
| **Companies** | "Hire verified graduates fast — see what they actually built, contact only the ones we want." | Free (5 contacts/mo per domain) + Subscription €89/mo + Enterprise |
| **Institutions** | "Run placement as an auditable workflow, prove our outcomes, stay AI-Act compliant." | Free Core forever + Institutional Premium €39/mo + 9 add-ons |

---

## Students

### Marketing pages (public)

| Route | Function | Goal |
|---|---|---|
| `/for-students` | Hero + benefits + journey timeline + FAQ + sticky CTA | Convert visitors to register: show how unverified declarations get replaced with verified evidence |
| `/for-university-students` | Specific copy for university-track students | Compete with Handshake/JobTeaser on the academic verification angle |
| `/for-its-students` | Copy tailored to ITS Academy students | Emphasise stage→hire conversion, language certs, professional skills |
| `/for-high-school-students` | Copy for orientation-stage students | Funnel into school-led PCTO / orientation flows |
| `/self-discovery` | 6-step exploration: values → strengths → projects → interests → skills → reconcile | "Self-discovery before showcasing" — the HR-validated moat. Generates a fit profile + insights for free |

### Dashboard pages (`/dashboard/student/*`)

| Route | Function | Goal |
|---|---|---|
| `/` | Home: at-a-glance — applications, top matches, journey progress, action items | Show "what to do next today" — engagement loop |
| `/journey` | 3D-styled milestone timeline (enrollment → first project → first verified → first application → first interview → placement → graduation) | Visualize progress, gamify completion of evidence-building |
| `/profile` | Edit personal info, photo, bio, **portfolio URL** (Premium), CV upload | Public-facing identity recruiters see |
| `/projects` | List all projects with filter by discipline | Inventory of evidence — the foundation of everything else |
| `/projects/new` | Create a new project (title, description, discipline, skills, files, GitHub) | Add raw material that AI extracts skills from |
| `/projects/[id]` | View one project — AI analysis, professor endorsements, skill extraction | The "evidence packet" recruiters can see |
| `/projects/[id]/edit` | Edit project details, request endorsements, manage media | Iterate on positioning — change framing as student matures |
| `/skills` | Verified skill graph from projects + grades | "What I actually know, with proof" — the alternative to LinkedIn declarations |
| `/skill-graph` | Visual graph view of skill relationships and verification sources | Drill into where each skill is sourced (which project, which course, which endorsement) |
| `/skill-path` | 12-month skill development roadmap (Premium: deep version) | Forward-looking — what to learn next to hit target roles |
| `/credentials` | Diplomas, certificates, signed Europass credentials | Single source for verifiable credentials (W3C VC compatible) |
| `/cv` | One-click Europass + custom CV builder from profile | Generate the artifact recruiters still ask for, automatically |
| `/fit-profile` | Self-discovery results: values, motivations, dealbreakers | Powers the matching algorithm; shapes what jobs surface in /matches |
| `/matches` | AI-recommended jobs based on skills + fit profile | Quality over quantity — the curated job feed |
| `/matches/[id]` | Single match: fit-score breakdown + apply CTA | Transparency on *why* this job was recommended |
| `/jobs` | Browse all open jobs (filterable) | Self-driven exploration beyond the AI recommendations |
| `/apply/[jobId]` | Apply to a specific job with one-click portfolio attachment | Friction-free application using the existing evidence |
| `/applications` | Tracker — application status by stage (PENDING → REVIEWED → INTERVIEW → OFFER) | Closing the loop: where am I in each pipeline |
| `/messages` | Inbox for recruiter messages | Direct contact with hiring teams |
| `/opportunities` | Project-based opportunities (challenges, capstones, hackathons) | Alternative to traditional job applications — show by doing |
| `/challenges` | Company challenges — open problems to solve as a project | Build verified evidence that maps directly to a hiring need |
| `/challenges/[id]` | Detail page for one challenge | Submit work; chance to convert into hire/intern |
| `/roles` | "Roles for you" — career-path suggestions based on skill graph | Long-term direction beyond next job |
| `/tirocinio` | Internship tracking — hours log, evaluations, deadlines | Italian compliance: tirocinio curricolare/extracurricolare lifecycle |
| `/analytics` | Profile analytics — views, recruiter engagement, search position (Premium: 8 dashboards) | Measure visibility; understand what's working |
| `/integrations` | Connect GitHub, LinkedIn, AlmaLaurea sync | Pull verified data automatically rather than retype |
| `/privacy` | Privacy controls — what's public, who can contact, GDPR exports | GDPR Art. 15 + Art. 22 self-service |
| `/privacy/audit-log` | Per-action audit trail of what was viewed/by whom | Transparency-as-product: see who looked at your profile |
| `/settings` | Account settings, notifications, language, dark mode | Standard settings surface |
| `/upgrade` | Premium pitch + Stripe checkout | Convert Free → Premium €3.99/mo (or honour institution-sponsored Premium) |

---

## Companies / Recruiters

### Marketing pages (public)

| Route | Function | Goal |
|---|---|---|
| `/for-companies` | Generic recruiter hero + 5-contact freemium model + €89/mo subscription | Top-of-funnel for any company, any size |
| `/for-startups` | Pitch tailored to small fast-moving teams | Lead with "no card, 5 free contacts/mo" — minimal friction |
| `/for-sme` | Italian SME positioning | Address procurement constraints; CCNL/INAIL compliance signals |
| `/for-enterprise` | Capability-first positioning (ATS bridge, internal AI, EU sovereignty, AI Act) | "We feed your ATS, we don't replace it" — different conversation than SME |
| `/for-agencies` | HR agencies + staffing firms angle | Multi-client workspace, white-label option |

### Dashboard pages (`/dashboard/recruiter/*`)

| Route | Function | Goal |
|---|---|---|
| `/` | Home with action center, contact-quota donut, top candidates, talent recommendations | Daily-use surface — what needs attention today |
| `/candidates` | Search verified profiles with filters (skills, university, discipline, fit score) | Core hiring workflow — find people |
| `/candidates/[id]` | Candidate detail — VerifiedSkillsRibbon, projects, endorsements, decision pack, contact CTA | Decision moment — does this person fit |
| `/ai-talent-search` | Natural-language search ("Python intern from Politecnico with ML thesis") | Alternative to faceted filters — describe the role conversationally |
| `/talent-match` | AI-suggested candidates per open job with fit score breakdown | Hiring inversion — let the system propose, recruiter judges |
| `/jobs` | List of all posted jobs (active, draft, paused, closed) | Job inventory management |
| `/jobs/new` | New job creation: paste-import banner (AI parses JD/URL) + conversational chat | Zero-friction job posting — paste any JD and we structure it |
| `/jobs/[id]` | Job detail — applicants, views, fit-score sorted candidates, edit | Per-role hiring workflow |
| `/applications` (via `/jobs/[id]`) | Application list per job | Process pipeline |
| `/pipeline` | Kanban view across all jobs (NEW → SCREENED → INTERVIEW → OFFER → HIRED) | Workflow operating system for the hiring team |
| `/analytics` | Recruiter analytics — funnel conversion, source-of-hire, time-to-hire | Process improvement — what's working in our funnel |
| `/analytics/pipeline` | Pipeline-specific analytics — drop-off rates per stage | Bottleneck detection |
| `/messages` | Inbox of conversations with candidates | Direct candidate communication |
| `/decision-pack` | List of decision packs generated | Final-interview artifact: one PDF with all evidence |
| `/decision-pack/[candidateId]` | Generate/view decision pack for a specific candidate | Hiring committee sharing artifact |
| `/evidence-packet/[candidateId]` | Quick evidence summary — projects, endorsements, fit score | Internal share before formal decision pack |
| `/compare` | Side-by-side candidate comparison (up to 4) | Final decision support |
| `/interview-kit` | AI-generated interview questions per role + candidate | Reduce time spent prepping interviews |
| `/hiring-advisor` | Conversational AI advisor for hiring decisions | "Should I hire X?" with evidence-grounded reasoning |
| `/assistant` | General AI assistant for recruiter ops | Catch-all conversational helper |
| `/challenges` | Post company challenges (problems for students to solve) | Alternative pipeline — projects-as-tryouts |
| `/challenges/[id]` | Challenge detail — submissions, leaderboard | Identify hires from people who already solved your problem |
| `/watchlist` | Saved candidates for later contact | Long-term talent pool |
| `/followers` | Students who follow your company | Warm leads — already interested in you |
| `/company-profile` | Public-facing company profile (what students see) | Brand presentation; influences who applies |
| `/settings` | Brand identity (logo + auto-fill from domain), company details, notifications, sticky save bar | Operational config + public-facing identity |
| `/documents` | NDA, policy, contract template uploads | Hiring-flow document library |
| `/integrations` | ATS connectors (Esse3, Greenhouse, Workday, Lever) | Two-way sync — keep your existing system of record |
| `/university-insights` | Aggregated insights: which universities → best hires for us | Data-driven targeting of campus relationships |

---

## Institutions (Universities, ITS, Schools)

### Marketing pages (public)

| Route | Function | Goal |
|---|---|---|
| `/for-universities` | Hero + 4-module workspace pitch + country tabs (IT/DE/FR/ES/NL) + savings calculator + FAQ | Convert career office decision-makers; 6-EU-country positioning |
| `/for-its-institutes` | ITS-Academy-specific: stage CRM, MIUR reports, professional registry | Talk to ITS pain points: high placement % under measurement |
| `/for-high-schools` | Orientation + PCTO positioning | Land scuole superiori for the orientation-stage funnel |
| `/for-public-sector` | PA-specific compliance, transparency, EU procurement angle | Niche but high-trust segment for public partnerships |
| `/for-techparks` | Technology parks / incubators — affiliated startups + talent pipeline | Cross-segment: institution + company hybrid |

### Dashboard pages (`/dashboard/university/*`) — institutionDark gradient on flagship pages

| Route | Function | Goal |
|---|---|---|
| `/` | Home with placement metrics, quick actions, recent activity | At-a-glance institutional health |
| `/students` | Verified student roster — filter by program, year, status | Manage the student population the institution warrants |
| `/students/add` | Add a student manually | Onboarding flow |
| `/students/import` | Bulk CSV/Excel import of students | Year-start onboarding |
| `/sync` | AlmaLaurea, Esse3, ERP sync status + manual refresh | Keep institutional data current |
| `/programs` | Curriculum / Career Paths / Skills Intelligence / Exchanges (4 tabs) | Program-level insights |
| `/courses` | All courses offered — filter by department, year | Course inventory |
| `/courses/[id]` | Course detail — projects, students, professor | Drill into one course's outputs |
| `/projects` | All student projects across the institution | Quality control + verification queue |
| `/projects/[id]` | Single project view with verification controls | Project-level moderation |
| `/curriculum-alignment` | Map curriculum learning outcomes to market skill demand | "Is what we teach what employers want?" |
| `/skills-intelligence` | Skill demand vs supply analysis | Strategic curriculum planning |
| `/skills-gap` | Gap analysis between student skills and target roles | Tactical course adjustments |
| `/soft-skills` | Soft-skill measurement across cohorts | The non-technical placement signal |
| `/inbox` (M1) | Mediation Inbox — recruiter→student messages awaiting staff approval | AI Act + GDPR compliance — staff approves before students see |
| `/offers` (M2) | Offer Moderation — job postings awaiting approval | Staff blocks offers that violate stage rules before students see them |
| `/crm` (M3) | Drag-and-drop kanban: company relationships from first contact to signed convention | Replace the career office's spreadsheet |
| `/crm/[id]` | Company relationship detail | Per-company history |
| `/employer-crm` | Aggregate view of employers across all program managers | Cross-team visibility |
| `/employer-crm/[company]` | Single employer history with all touchpoints | Account management |
| `/recruiters` | List of recruiters who've engaged with the institution | Network development |
| `/recruiter-engagement` | Engagement metrics per recruiter / company | Identify warm vs cold accounts |
| `/placement-pipeline` (M4) | Full tirocinio lifecycle — hours, evaluations, deadlines, convention generation | Replace 90% of career-office spreadsheets with one auditable tool |
| `/placement-pipeline/[id]` | One placement detail | Per-student tirocinio management |
| `/placements` | Aggregate placement view | Reporting + KPIs |
| `/internship-pipeline` | Earlier-stage pipeline (pre-tirocinio) | Active sourcing for internships |
| `/internship-tracker` | Tracking-only view (lighter than pipeline) | Quick read on current internships |
| `/stages` | Generic stage management (umbrella for all internship types) | Spans curricular + extracurricular |
| `/stages/[id]` | Stage detail | Per-stage management |
| `/stage-insights` | Stage outcome analytics | Are stages converting to hires? |
| `/conventions` | Convention Builder — AI-personalized clauses, INAIL/CCNL auto-fill, bulk export (Premium) | Generate compliant tripartite agreements in 60 seconds |
| `/career-paths` | Career path templates per program | "Where do graduates of program X end up" |
| `/exchanges` | Erasmus + bilateral exchange tracking | International mobility integration |
| `/orientation` | High-school orientation funnel (for orientation-active institutions) | Pull future students from PCTO partner schools |
| `/pcto` | PCTO (high-school work experience) management | Italian compliance: PCTO is mandatory |
| `/pcto/marketplace` | Browse companies offering PCTO opportunities | Match high schools with companies |
| `/parental-consent` | Parental-consent management for under-18 students | GDPR + minor-protection compliance |
| `/prior-learning` | Recognition of prior learning (RPL) workflow | Italian + EU validation framework support |
| `/fast-track` | Accelerated certification pathway management | Premium credential pipeline |
| `/communications` | Mass communication to students (newsletters, alerts) | Operational comms |
| `/events` | Events / career fairs / employer days | Event management |
| `/alumni` | Alumni database + outreach | Tap alumni for hiring + mentoring |
| `/board` | Board-of-directors-level dashboard (KPIs, outcomes summary) | C-suite reporting |
| `/scorecard` | Standardized scorecard view (placement %, time-to-hire, gross outcome) | Benchmarkable single-page view for accreditation |
| `/analytics` | 7-tab analytics: Overview, Placement, Skills Gap (Premium), Employers (Premium), Salary (Premium), Benchmark (Premium), Scorecard (Premium) | Strategic analytics layer |
| `/audit-log` | Per-action audit trail (Premium: full history + export) | AI Act compliance — every automated decision logged |
| `/assistant` | AI Staff Assistant — Q&A on placement, compliance, regulations (50/mo Free, unlimited Premium) | Reduce time staff spends searching for answers |
| `/certificates` | Issue + manage signed credentials (Premium add-on: bulk W3C VCs) | Diploma + transcript issuance with cryptographic proof |
| `/billing` | Free Core hero + Institutional Premium upsell + add-on marketplace | Revenue surface — convert Free Core to Premium / add-ons |
| `/add-ons` | Browse + buy 9 institutional add-ons (white-label, SSO, ATS bridge, MIUR pack, CSM, etc.) | Modular HubSpot-style upsell |
| `/integrations` | Esse3, U-GOV, AlmaLaurea, ANVUR, MIUR connectors | Connect to existing institutional systems |
| `/documents` | Document library (templates, policies, INAIL forms) | Compliance document hub |
| `/settings` | Institution settings, branding, user permissions | Operational config |

---

## Professors

| Route | Function | Goal |
|---|---|---|
| `/dashboard/professor/` | Home — pending endorsement requests, students | Quick overview of what needs the professor's attention |
| `/dashboard/professor/endorsements` | Manage endorsement requests (approve/decline with rating) | The verification primitive — professor signs off on student work |
| `/dashboard/professor/students` | List students who've requested endorsement | Relationship management |

Goal: enable the verification chain that makes the whole platform credible.
A student claim becomes an InTransparency credential only when a verified
professor signs off.

---

## Marketing / Public

### Top of funnel
| Route | Function | Goal |
|---|---|---|
| `/` (home) | Hero with segment selector (students / companies / institutions), social proof, AppPreview | Single entry that routes to segment-specific funnel |
| `/explore` | Browse verified student profiles publicly (initials only) | Demonstrate platform depth without revealing identities |
| `/discover` | Discover students/companies/institutions | Public-facing search/browse |
| `/pricing` | All 3 segment tiers with FAQ (Students €3.99, Companies €89/mo, Institutions Free Core + €39/mo Premium) | Conversion / pricing transparency |
| `/demo` | Live product demos (AI search, decision pack, analytics) | Lower the activation barrier |
| `/compare` | Comparison table vs LinkedIn, Handshake, JobTeaser, traditional agencies | Competitive positioning |

### Trust + content
| Route | Function | Goal |
|---|---|---|
| `/about` | Mission, team, story | Brand trust |
| `/certification` | Certifications (GDPR, ISO, etc.) | Enterprise gate-clearing |
| `/eu-compliance` | Compliance matrix (GDPR, AI Act, eIDAS, ESCO) | Procurement / legal sign-off enabler |
| `/algorithm-registry` | Public registry of every AI model used + when + how (AI Act compliance) | Transparency-as-product applied to ourselves |
| `/legal` | Legal hub | Hub page |
| `/privacy` | Privacy policy | GDPR compliance |
| `/contact` | Contact form, sales inquiries | Inbound lead capture |
| `/blog` | Editorial content | SEO + thought leadership |
| `/glossary` | Terms used in the product (verification, fit score, decision pack, etc.) | Reduce friction for newcomers |
| `/faq` | Cross-segment FAQ | Pre-sales objection handling |
| `/changelog` | Product release notes | Trust signal — we ship |
| `/facts` | Data + benchmarks page | Industry-data positioning |

### Developer-facing
| Route | Function | Goal |
|---|---|---|
| `/developers` | OpenAPI overview, SDK, integration guides | Position as a verified-data layer for AI agents |
| `/linkedin-integration` | LinkedIn-specific integration docs | Address the "do we replace LinkedIn?" question |
| `/applications` (public) | Active job board snapshot | SEO long-tail for jobs |
| `/messages` (public) | Public message-related landing | (Likely a stub) |
| `/events` (public) | Public events listing | Event-driven acquisition |
| `/onboarding` | Generic onboarding shell | Routes to segment-specific onboarding |
| `/referrals` | Referral program landing | Growth loop |
| `/chat` | Public chat / agent demo | Showcase the platform's conversational capability |

---

## Auth

| Route | Function | Goal |
|---|---|---|
| `/auth/login` | Sign in | Returning users |
| `/auth/signin` | Alternate sign-in entry | NextAuth conventional path |
| `/auth/signup` | Generic signup | Routes to role selection |
| `/auth/forgot-password` | Password reset | Standard auth flow |
| `/auth/register/student` | Student-specific signup | Captures university, year, discipline |
| `/auth/register/recruiter` | Recruiter signup with **live domain enrichment preview** (Brembo logo + name as you type your work email) | Zero-friction recruiter onboarding — first wedge of the 3-wedge flow |
| `/auth/register/academic-partner` | Institution signup | Career office staff signup |
| `/auth/register/professor` | Professor signup | Verification chain enabler |
| `/auth/register/techpark` | Technology park signup | Cross-segment partner |

---

## Cross-segment infrastructure (referenced from many pages)

- **Chatbot widget** — branded InTransparency-logo chatbot mounted globally; per-segment theming (violet / blue / amber)
- **PremiumBadge** — visual indicator on Premium-only features across all segments
- **MetricHero** — shared dashboard hero with per-segment palette (`student` / `company` / `institution` + dark variants)
- **EmptyState** — shared empty-state component with per-segment tone
- **HeroCTA** — refined monochromatic CTA used on all `/for-*` pages

---

## Strategic anchors per segment

**Students** — "Self-discovery before showcasing." Self-discovery flow + verified evidence chain are the moat. Premium is opt-in upgrade, never gating core visibility.

**Companies** — "5 free contacts/mo, then €89/mo subscription. Verified evidence, not declarations." Hiring inversion: AI proposes candidates, recruiter judges. Decision Pack is the closing artifact.

**Institutions** — "Free Core forever. Workspace M1-M4 + AI assistant + AI Act compliance baseline. Premium + add-ons for scale." Replace career-office spreadsheets, not LinkedIn. Convention Builder is the wedge product.

---

## User journeys

Surfaced ambient on every dashboard via `<JourneyPanel/>` (bottom-left,
collapsed by default with progress + next action). Definitions live at
`frontend/lib/journeys/index.ts`. State persists in localStorage. Each
step can declare an async `detect()` that auto-marks completion when the
corresponding API returns truthy state. Users can dismiss the panel; a
small re-open chip stays available in the same corner.

### Student — "Your first week on InTransparency"
Build verified evidence, then let recruiters find you.
1. **Complete your profile** → `/dashboard/student/profile` · auto-detects bio + photo
2. **Add your first project** → `/dashboard/student/projects/new` · auto-detects via `/api/projects?mine=1`
3. **Run the 6-step self-discovery** → `/self-discovery` · auto-detects when stepsCompleted ≥ 6
4. **Generate your Europass CV** → `/dashboard/student/cv`
5. **Apply to your first match** → `/dashboard/student/matches` · auto-detects via applications API
6. **Request a professor endorsement** → `/dashboard/student/projects`

### Recruiter — "First day as a recruiter"
Set up your brand, post a role, find your first verified candidate.
1. **Complete your company profile** → `/dashboard/recruiter/settings` · auto-detects via settings API (uses domain auto-fill)
2. **Post your first job** → `/dashboard/recruiter/jobs/new` · auto-detects when jobs > 0 (uses paste-import banner)
3. **Run a candidate search** → `/dashboard/recruiter/candidates`
4. **Contact your first candidate** → `/dashboard/recruiter/candidates` · auto-detects via contacts API
5. **Generate your first Decision Pack** → `/dashboard/recruiter/decision-pack`
6. **Connect your ATS (optional)** → `/dashboard/recruiter/integrations`

### Institution — "Set up your career office workspace"
Replace spreadsheets with M1–M4: Inbox, Offers, CRM, Pipeline.
1. **Import your students** → `/dashboard/university/students/import` · auto-detects when roster has students
2. **Review the Mediation Inbox (M1)** → `/dashboard/university/inbox`
3. **Add your first company in the CRM (M3)** → `/dashboard/university/crm`
4. **Generate your first convention** → `/dashboard/university/conventions`
5. **Track a placement (M4)** → `/dashboard/university/placement-pipeline`
6. **Review your placement analytics** → `/dashboard/university/analytics`

### Behavior contract
- **Always available on login** — mounted in each dashboard's layout
- **Collapsed by default** — small floating tile, progress ring + next action label
- **Expand on click** — full checklist with hints + per-step CTAs
- **Auto-completion** — runs on mount + on tab refocus; manual marks stay sticky
- **Dismissable** — X button hides the panel; re-open chip persists in the same corner
- **Per-segment theming** — violet (student) / blue (recruiter) / amber (institution), matches `<PremiumBadge/>` and `<MetricHero/>` palette

---

*Last updated: 2026-04-26. Generated from route inventory + product memory.*
