# Go-to-Market Strategy & Marketing Improvement Plan

> Last updated: 2026-03-04

## Current State

InTransparency has strong product infrastructure but is pre-traction:
- Segment-specific landing pages exist (students, universities, ITS, companies)
- Custom analytics with A/B testing and validation surveys
- HubSpot booking for demos
- Referral program built but not activated
- No blog, no email list, no SEO, no real testimonials yet
- Company logos are aspirational (Google, Microsoft, etc.) — not actual partners

---

## Phase 1: Foundation (Weeks 1-4)

### 1.1 Fix Credibility Gaps

**Replace aspirational logos with real ones.**
The CompanyLogos component shows Google, Microsoft, Meta — companies that aren't partners. This destroys credibility with anyone who checks. Options:
- Replace with actual partner universities (UniBG, any ITS academies signed)
- Replace with "Trusted by X students at Y universities" counter
- Remove entirely until real logos exist

**Add real testimonials.**
Success stories page is "Coming Soon." Get 3-5 testimonials immediately:
- 2 students who built portfolios
- 1 university career services contact
- 1 recruiter/company (even if from beta testing)
- Video testimonials > text (even 30-second selfie videos)

**Add founder story.**
The about page has the mission but Fabio's personal story of why he built this is missing. Founder credibility is the #1 trust signal for early-stage B2B SaaS. Add a short section: who you are, why you care, why this exists.

### 1.2 SEO Foundation

**Current state:** No sitemap.xml, no robots.txt, generic metadata.

**Actions:**
- Add `sitemap.xml` generation (Next.js has built-in support via `app/sitemap.ts`)
- Add `robots.txt` via `app/robots.ts`
- Add per-page metadata with targeted keywords:
  - Home: "Verified student profiles | University-to-work platform Italy"
  - Pricing: "Pay per contact recruiting | No annual commitment | €10 per hire"
  - For Universities: "Free placement analytics for Italian universities"
  - For ITS: "Piattaforma digitale per ITS Academy"
- Add `<meta name="description">` for every public page
- Add structured data (JSON-LD) for Organization, Product, FAQ pages

**Target keywords (IT market):**
- "piattaforma lavoro studenti universitari"
- "recruiting studenti Italia"
- "ITS Academy piattaforma digitale"
- "alternativa AlmaLaurea"
- "stage curriculare studenti"
- "tirocinio studenti ingegneria"

**Target keywords (EN market):**
- "verified student profiles Europe"
- "pay per contact recruiting"
- "university talent platform Italy"
- "Bologna Process grade normalization"
- "hire graduates no subscription"

### 1.3 Email List Infrastructure

**Current state:** No newsletter signup, no email list, no drip campaigns.

**Actions:**
- Add email signup to footer of all public pages (simple: name + email + role)
- Create 3 lead magnets:
  - Students: "Portfolio Checklist: 10 Things Recruiters Actually Look At"
  - Universities: "How ITS Academies Are Closing the Skills Gap (Case Study)"
  - Companies: "The True Cost of Hiring a Graduate in Italy (2026 Data)"
- Set up drip sequences (3-5 emails per segment) via Nodemailer or switch to Resend/Loops
- Weekly founder update email (builds trust, costs nothing)

---

## Phase 2: Demand Generation (Weeks 5-12)

### 2.1 Content Marketing

**Start a blog.** Target 2 posts/week, alternating Italian and English.

**Content pillars:**

| Pillar | Example Topics | Target Audience |
|--------|---------------|-----------------|
| Skills transparency | "Why Self-Reported Skills Are Worthless," "How Institution Verification Works" | Recruiters, universities |
| Career coaching | "What Your DISC Profile Means for Your First Job," "5 Projects That Get You Hired" | Students |
| ITS Academy spotlight | "Inside [ITS Name]: What Students Actually Learn," "ITS vs University: Which Path?" | Students, parents, ITS staff |
| Hiring insights | "Cost Per Hire in Italy 2026," "Why SMEs Can't Compete for Talent (And How to Fix It)" | SME founders, HR managers |
| European talent market | "Bologna Process Explained," "Hiring Across Borders in the EU" | Recruiters, universities |

**Distribution:**
- LinkedIn (Fabio's personal account — founder-led content works 10x better than company page)
- Italian university career services WhatsApp/Telegram groups
- ITS Academy director network
- Cross-post to Medium Italia for SEO backlinks

### 2.2 Industry-Specific Landing Pages

**Current state:** "ANY sector" messaging. No industry pages.

**Create 3 vertical pages:**

1. **`/for-engineering`** — Target: Italian manufacturing SMEs
   - Pain: "Can't compete with Siemens/ABB for talent but need 3 engineers this year"
   - Solution: Verified project portfolios, pay €10/contact, see actual CAD/FEA work
   - CTA: "Browse Engineering Students Free"

2. **`/for-consulting`** — Target: Italian consulting firms, Big Four local offices
   - Pain: "500 CVs per analyst opening, no way to verify soft skills"
   - Solution: DISC profiles, personality insights, verified grades normalized across universities
   - CTA: "See How Decision Packs Work"

3. **`/per-aziende-pmi`** (Italian) — Target: Italian SMEs explicitly
   - Pain: "€2,500/anno per AlmaLaurea? €8,000 per LinkedIn? Impossibile."
   - Solution: "Paga solo €10 per contatto. Nessun abbonamento. Nessun rischio."
   - CTA: "Cerca Studenti Gratis"

### 2.3 University Acquisition Playbook

**The network effect is everything.** More universities = more students = more value for recruiters.

**Strategy: Bottom-up, not top-down.**

1. **Target career services offices, not rectors.**
   Career services staff are overworked, underfunded, and desperate for free tools. Offer:
   - Free placement analytics dashboard (already built)
   - Free student portfolio hosting
   - Free institutional verification badges
   - "Import your students in 5 minutes" (import tool exists)

2. **ITS-first strategy.**
   - 120+ ITS academies, zero competitor serves them
   - ITS directors are accessible (small institutions, 200-500 students each)
   - Run a "Free for ITS" campaign: email every ITS director personally
   - Offer: "We'll set up your entire placement tracking for free. You're our pilot partners."
   - Target: 10 ITS academies in 90 days

3. **University referral program.**
   The referral infrastructure exists but isn't activated:
   - €250 per ITS that signs up via referral
   - Activate this by giving first 5 partner ITS directors referral links
   - Create a "Founding Partner University" badge (like the company Founding Partner program)

4. **Academic conferences.**
   - Present at Italian career services association meetings
   - Sponsor university career fairs (€500-1,000 per event, high ROI)
   - Run workshops: "How to Build a Project Portfolio That Gets You Hired"

### 2.4 Company Acquisition Playbook

**Target: Italian SMEs hiring 2-10 graduates/year.**

1. **LinkedIn outreach (Fabio's account).**
   - Connect with HR managers and founders at Italian SMEs
   - Post content about hiring costs: "You're paying €2,500/year for AlmaLaurea. We charge €10 per contact."
   - DM sequence: value post → engagement → soft pitch → demo booking

2. **Founding Partner Program activation.**
   The program exists in the pricing page but needs active sales:
   - 20 founding partner slots at preferential rates
   - Create urgency: "7 of 20 slots filled" (even if starting from 0, fill first 3 with warm contacts)
   - Monthly founder call with all partners (builds community, gets feedback)

3. **Confindustria and trade associations.**
   Italian SMEs are organized via Confindustria (employers' federation) and local Camere di Commercio.
   - Present at local Confindustria events
   - Partner with Confindustria Giovani (young entrepreneurs)
   - Offer group pricing: "Any Confindustria member gets 5 free contacts to try"

4. **Reverse trial / product-led growth.**
   The explore page (`/explore`) lets anyone browse student profiles without signup. This is powerful but underutilized:
   - Add prominent "Unlock Contact" CTA on each profile card
   - Show 80% of the profile freely, gate the last 20% (contact info + full project analysis)
   - Track which profiles recruiters view → retarget with email: "You viewed 5 engineering students. Unlock their contacts for €10 each."

---

## Phase 3: Scale (Months 4-12)

### 3.1 Paid Acquisition

**Only start paid ads after organic foundations are solid.**

| Channel | Budget | Target | Expected CPA |
|---------|--------|--------|-------------|
| Google Ads (IT) | €500/mo | "stage studenti," "recruiting neolaureati" | €5-15/student signup |
| LinkedIn Ads | €1,000/mo | HR managers at Italian companies, 50-500 employees | €30-50/company lead |
| Instagram/TikTok | €300/mo | Italian university students, 20-25 age | €2-5/student signup |
| Google Ads (EN) | €500/mo | "hire graduates Europe," "pay per contact recruiting" | €10-20/company lead |

**Total initial budget: €2,300/mo**

### 3.2 Partnership Channels

| Partner | Value Exchange | Priority |
|---------|---------------|----------|
| **Greenhouse / Lever** | ATS integration already built. Co-marketing: "InTransparency is now integrated with Greenhouse." | High |
| **Italian startup accelerators** (Talent Garden, H-Farm) | They need talent for portfolio companies. Offer bulk contact credits. | High |
| **Study abroad platforms** (Erasmus Student Network) | Erasmus flag is a unique feature. Co-promote to exchange students. | Medium |
| **Italian EdTech companies** | Cross-referrals, shared university network. | Medium |
| **European university networks** (EUA, Coimbra Group) | Access to non-Italian universities for expansion. | Low (for now) |

### 3.3 Community & Events

**Build a student community, not just a platform.**

- **Campus Ambassador Program**: Already built in referral system. Activate it:
  - Recruit 1 ambassador per target university
  - €50/month + €5 per student signup
  - Give them a branded Notion template with social media posts and flyers
  - Monthly ambassador Zoom call

- **"Portfolio Night" events**: Monthly online event
  - Students present their best projects
  - 3 recruiters give live feedback
  - Record and post on LinkedIn/YouTube
  - Builds content + community + recruiter engagement simultaneously

- **ITS Demo Day sponsorship**: ITS academies have final project presentations
  - Sponsor 5-10 ITS demo days (€200-500 each)
  - All presenting students upload projects to InTransparency
  - Recruiters attend via the platform
  - Creates natural supply-demand matching

### 3.4 DACH Market Entry (Month 6+)

**Preconditions:**
- 10+ Italian ITS/universities onboarded (proof of model)
- German locale added (i18n infrastructure ready)
- 3-5 German Fachhochschulen identified as pilot partners

**Entry strategy:**
- Partner with 1-2 German Fachhochschulen (equivalent to ITS)
- Translate core pages to German
- Target Mittelstand companies via IHK (Industrie- und Handelskammer) events
- Position as: "The European alternative to LinkedIn Recruiter — pay per contact, not per year"

---

## Phase 4: Metrics & Tracking

### Key Metrics to Track

| Metric | Current Tracking | Action Needed |
|--------|-----------------|---------------|
| Student signups | Custom analytics | Add funnel tracking (visit → register → complete profile → upload project) |
| University signups | Custom analytics | Add activation tracking (signup → import students → first verification) |
| Company signups | Custom analytics | Add revenue funnel (signup → browse → first contact purchase → second purchase) |
| Activation rate | Not tracked | Define: student = uploaded 1 project; company = purchased 1 contact |
| Retention | Not tracked | Weekly/monthly active users by segment |
| NPS | Not tracked | Add in-app NPS survey after 30 days |
| CAC by channel | Not tracked | Tag signups by UTM source |
| LTV | Stripe webhooks exist | Calculate per-company revenue over time |

### Add Google Analytics 4

Custom analytics is good for product validation but GA4 is needed for:
- SEO performance tracking (organic search queries, landing page performance)
- Audience demographics and interests
- Cross-device tracking
- Retargeting audiences for paid ads
- Industry-standard reporting for investors

---

## Quick Wins (Do This Week)

1. **Remove aspirational company logos** — replace with university partner logos or student count
2. **Add 3 real testimonials** — even informal quotes from beta users
3. **Add sitemap.xml and robots.txt** — 30 minutes, unlocks SEO
4. **Add email signup to footer** — start building a list today
5. **Post 1 LinkedIn article** from Fabio's account about why InTransparency exists
6. **Email 10 ITS directors personally** — offer free setup, no strings
7. **Add meta descriptions** to all public pages
8. **Activate the referral program** — give first partner universities their referral links

---

## Budget Summary

| Item | Monthly Cost | Notes |
|------|-------------|-------|
| Content creation | €0 (founder-led) | Fabio writes 2 posts/week |
| Email tool (Resend/Loops) | €20/mo | Free tier covers early stage |
| Google Ads | €500/mo | Start month 2 |
| LinkedIn Ads | €1,000/mo | Start month 3 |
| Social Ads | €300/mo | Start month 3 |
| Campus ambassadors (5) | €250/mo | Start month 2 |
| Event sponsorships | €500/mo | 1-2 events/month |
| GA4 | €0 | Free |
| **Total Month 1** | **€0-20** | Foundation only |
| **Total Month 3** | **~€2,570** | Full program running |
| **Total Month 6** | **~€3,000** | + DACH pilot costs |

---

## What NOT to Do

1. **Don't buy a booth at a big conference** — too expensive, wrong stage. Do small events.
2. **Don't hire a marketing agency** — founder-led content is 10x more authentic at this stage.
3. **Don't run paid ads before SEO and content foundations are solid** — you'll burn money.
4. **Don't try to serve all of Europe at once** — win Italy first, then Germany.
5. **Don't compete with LinkedIn on features** — compete on pricing and verification.
6. **Don't chase enterprise deals** — SMEs are the beachhead. Enterprises come later.
7. **Don't build more features before activating distribution** — the product is ahead of distribution.
