# InTransparency - 60 Day Validation Sprint
## **Critical De-Risk Period: Institutional Data Access + Willingness to Pay**

---

## 🎯 OBJECTIVE

Validate whether InTransparency can access course-level institutional data and whether companies will pay €10/contact for verified talent. This determines if the moat is real (⭐⭐⭐⭐⭐) or non-existent (⭐⭐).

## ⚠️ CRITICAL SUCCESS METRICS

### Week 1-2: Institutional Data Feasibility
**Target:** Contact 5 ITS institutions
**Success:** 2+ ITS confirm they can provide course-level grade data

✅ **GO Signal:** 2+ ITS say "yes, we can share course data with student consent"
⚠️ **WEAK Signal:** 1 ITS interested → expand outreach to 10 institutions
❌ **NO-GO Signal:** 0 ITS willing → PIVOT or SHUTDOWN

### Week 3-4: Chatbot MVP Launch
**Target:** Build and deploy education chatbot
**Success:** Chatbot live on recruiter dashboard, handling basic queries

✅ **COMPLETED:** Chatbot built and integrated into dashboard
⏭️ **Next:** Test with 5-10 recruiters for feedback

### Week 5-8: Company Validation
**Target:** Contact 10-20 companies that hire from ITS
**Success:** 5+ companies commit to paying €10/contact for verified profiles

✅ **GO Signal:** 50%+ conversion (5+ companies willing to pay)
⚠️ **PIVOT Signal:** 10-40% conversion → adjust pricing or model
❌ **NO-GO Signal:** <10% conversion → value prop doesn't resonate

---

## 📋 WEEK-BY-WEEK BREAKDOWN

### WEEK 1-2: Institutional Outreach

#### Day 1-3: ITS Target List
**Task:** Identify 5 ITS institutions (prioritize small-medium, less bureaucratic)

**Suggested Targets:**
- [ ] ITS Rizzoli (Lombardia) - ~500 students, tech-focused
- [ ] ITS Nuove Tecnologie della Vita (Bergamo) - ~400 students, biotech/mechatronics
- [ ] ITS TAM Triveneto Academy (Veneto) - ~600 students, mechanics
- [ ] ITS Angelo Rizzoli (Lombardia) - ~350 students, ICT
- [ ] ITS Meccatronica (Vicenza) - ~450 students, automation

**Research for each ITS:**
- Director name + email
- Career services contact
- Student count + placement rate
- Current tech stack (Esse3? Excel? Custom?)

#### Day 4-7: Email Outreach
**Task:** Send outreach email (see template in TEMPLATES.md)

**Email Template Checklist:**
- [ ] Personalized greeting (use director's name)
- [ ] Problem statement (aziende can't find ITS talent)
- [ ] Solution (free marketplace with verification)
- [ ] Data request (course-level grades with consent)
- [ ] Call to action (15 min exploratory call)

**Follow-up Schedule:**
- Day 2: Check for replies
- Day 5: Follow-up email if no response
- Day 7: LinkedIn message or phone call

#### Day 8-14: Exploratory Calls
**Task:** 15-minute calls with interested ITS directors

**Call Agenda:**
1. Intro (2 min): Who we are, what we're building
2. Problem validation (3 min): Do they struggle with student placement visibility?
3. Data feasibility (5 min): Can they provide course-level data? Format? Privacy concerns?
4. Pilot proposal (3 min): 50-100 students, 3 months, free
5. Next steps (2 min): Timeline, legal requirements, data sharing agreement

**Key Questions to Ask:**
- "What format do you store course grades in?" (Esse3 API? CSV? Excel?)
- "What's your process for student consent for data sharing?"
- "Have you worked with external platforms before?" (AlmaLaurea? Other?)
- "What would make this a no-brainer for you?" (What value do you need?)

**Success Metric:** 2+ ITS say "yes, we can share data with student consent"

---

### WEEK 3-4: Chatbot MVP & Demo Prep

#### ✅ COMPLETED: Chatbot Implementation
- [x] Knowledge base created (Italian education system)
- [x] API endpoint (/api/chatbot/education)
- [x] UI component integrated into recruiter dashboard
- [x] Fallback responses for demo (works without OpenAI key)

#### Day 15-21: Chatbot Testing & Refinement
**Task:** Test chatbot with 5-10 people (teammates, friends, beta testers)

**Test Scenarios:**
- [ ] "What is a good grade in Italy?"
- [ ] "Find me a React developer"
- [ ] "Is Politecnico Milano prestigious?"
- [ ] "What's the difference between university and ITS?"

**Feedback Collection:**
- Is chatbot helpful? (1-10 rating)
- What questions did it struggle with?
- What additional info would be useful?

**Iterate Based on Feedback:**
- Add missing universities to knowledge base
- Add more role → course mappings
- Improve response tone/clarity

#### Day 22-28: Demo Materials
**Task:** Create demo materials for company validation

**Deliverables:**
- [ ] 2-min demo video (Loom screencast)
- [ ] 1-pager PDF (problem, solution, pricing)
- [ ] Demo account (pre-loaded with 20-30 mock verified profiles)

---

### WEEK 5-6: Company Target List & Outreach

#### Day 29-35: Identify Target Companies
**Task:** List 10-20 companies that hire from ITS (PMI, not Fortune 500)

**Company Profile:**
- Size: 50-500 employees (large enough to have hiring needs, small enough to be agile)
- Industry: Manufacturing, automotive, electronics, construction (ITS-aligned)
- Location: Lombardia, Veneto, Emilia-Romagna (ITS concentrations)
- Hiring frequency: 5-10 technical hires/year minimum

**Research for Each Company:**
- [ ] HR contact name + email (LinkedIn Sales Navigator)
- [ ] Recent job postings (look for technical roles)
- [ ] Current recruitment pain points (LinkedIn, Glassdoor reviews)

**Example Targets:**
- Brembo (automotive - brake systems) - hires mechatronics technicians
- Carel Industries (HVAC controls) - hires electronics/automation
- ABB Italy (automation) - hires PLC programmers, CAD designers
- [Add 7-17 more companies...]

#### Day 36-42: Cold Outreach
**Task:** Email 10 companies with demo offer

**Email Template** (see TEMPLATES.md):
Subject: "Trovare tecnici qualificati (verificati da ITS) - Demo 15 min?"

Body:
- Problem: "So che trovare tecnici CAD/elettronica qualificati è difficile"
- Current pain: "LinkedIn è pieno di CV inflazionati, Indeed ha profili non verificati"
- Solution: "Piattaforma con profili ITS verificati dall'istituto (voti, progetti autenticati)"
- Pricing: "€10 per contatto (vs €50-100 recruiter fee o LinkedIn Recruiter €8K/anno)"
- CTA: "15 min demo questa settimana?"

**Follow-up:**
- Day 2: Check replies
- Day 5: Follow-up email
- Day 7: LinkedIn InMail

**Success Metric:** 50%+ reply rate (5+ companies schedule demo)

---

### WEEK 7-8: Demo Calls & Validation

#### Day 43-56: Demo Calls (15 min each)
**Task:** Run 10 demo calls, pitch value prop, ask for commitment

**Demo Script:**
1. **Problem validation** (3 min):
   - "How do you currently find technical talent?"
   - "What's your biggest pain point with current methods?"
   - "Ever hired someone who oversold their skills?"

2. **Live demo** (5 min):
   - Show chatbot: "I need AutoCAD designer" → bot suggests courses
   - Show filters: Course="Disegno Tecnico" grade≥27/30
   - Show verified profile: "ITS Rizzoli certified this student's CAD project"

3. **Value prop** (3 min):
   - "Every skill is verified by the institution - no resume inflation"
   - "€10/contact vs €100 recruiter fee or €8K/year LinkedIn Recruiter"
   - "Access 235K ITS students (87% placement rate, highly skilled)"

4. **Commitment ask** (4 min):
   - "If we had 50-100 verified ITS students in your area, would you pay €10 to contact top matches?"
   - "What would make this a must-have for you?"
   - Get LOI (letter of intent) or soft commitment

**Success Metric:** 5+ companies say "yes, we'd pay €10/contact"

---

## 🚦 DECISION GATES (Day 60)

### SCENARIO A: ✅ FULL GO (Probability 25-30%)
**Conditions:**
- 2+ ITS willing to share course-level data
- 5+ companies willing to pay €10/contact
- Clear path to pilot execution

**Action:**
- Sign data sharing agreements with ITS
- Build pilot with 1 ITS + 50-100 students
- Onboard 5-10 paying companies
- Build course-level filtering feature
- Raise pre-seed funding (€100-200K) if possible

**Moat:** ⭐⭐⭐⭐⭐ (4-5 years defendability)
**Success odds:** 35-45% (regional €3-8M/year business)

---

### SCENARIO B: ⚠️ PIVOT (Probability 40-50%)
**Conditions:**
- 0-1 ITS willing to share granular data (GDPR/policy blocks)
- But 5+ companies interested in basic verified profiles
- Market interest exists but data access limited

**Action:**
- PIVOT to simpler model:
  - Drop course-level granularity (too hard to get)
  - Focus on project verification only (easier to get)
  - Become "GitHub for all disciplines" (not course-grade platform)
- Lower pricing: €5/contact (less value without course data)
- Adjust value prop: "Verified projects" not "verified course performance"

**Moat:** ⭐⭐⭐ (1-2 years defendability)
**Success odds:** 20-30% (smaller €500K-2M/year business)

---

### SCENARIO C: ❌ MAJOR PIVOT OR SHUTDOWN (Probability 20-30%)
**Conditions:**
- No institutional data access
- Companies not willing to pay (prefer free Indeed/LinkedIn)
- Value prop doesn't resonate

**Action:**
- MAJOR PIVOT:
  - Option 1: SaaS for career services (€500/year per institution)
  - Option 2: Different market (international students? Bootcamps?)
  - Option 3: Shutdown, cut losses, learn

**Moat:** ⭐ (6-12 months)
**Success odds:** <10%

---

## 📊 TRACKING METRICS

### Weekly Metrics Dashboard
Track these every week:

| Metric | Week 1-2 | Week 3-4 | Week 5-6 | Week 7-8 | Target |
|--------|----------|----------|----------|----------|--------|
| ITS contacted | 5 | 5 | - | - | 5 |
| ITS interested calls | 0 | 3 | - | - | 3+ |
| ITS data commitment | 0 | 2 | - | - | 2+ ✅ |
| Chatbot built | 0% | 100% | - | - | 100% ✅ |
| Companies contacted | - | - | 10 | 10 | 20 |
| Demo calls booked | - | - | 5 | 5 | 10 |
| Willing to pay | - | - | 2 | 3 | 5+ ✅ |

**Green (✅):** On track to GO scenario
**Yellow (⚠️):** Risk of PIVOT needed
**Red (❌):** Risk of SHUTDOWN

---

## 💰 BUDGET (60 Days)

### Costs
- OpenAI API (chatbot): €20/month × 2 = €40
- Loom (demo videos): Free
- LinkedIn Sales Navigator: €80/month × 2 = €160 (optional)
- Domain/hosting: €20
- Travel (ITS visits): €200 (if needed)

**Total:** €200-420 (very lean)

### Time Investment
- 2 founders × 60 days × 4 hours/day = 480 hours total
- Assumes working part-time while validating

---

## 📞 NEXT IMMEDIATE ACTIONS (This Week)

### Monday-Tuesday:
- [ ] Finalize ITS target list (5 institutions)
- [ ] Draft personalized emails (1 per ITS)
- [ ] Send 5 outreach emails

### Wednesday-Thursday:
- [ ] Follow up with non-responders
- [ ] Schedule calls with interested ITS
- [ ] Prepare call script + data request template

### Friday:
- [ ] Conduct first 1-2 ITS calls
- [ ] Document learnings
- [ ] Adjust pitch based on feedback

### Weekend:
- [ ] Test chatbot with 5 beta users
- [ ] Refine based on feedback
- [ ] Prepare demo materials for week 5

---

## 🎯 REMEMBER: THIS IS A VALIDATION, NOT EXECUTION PHASE

**You are NOT building the platform yet. You are de-risking the biggest assumptions:**

1. ❓ Can we get institutional data? → Answer in 2 weeks
2. ❓ Will companies pay? → Answer in 6 weeks

**If both = YES:** You have a 35-45% chance at a €3-8M/year business. GO!
**If 1 = NO:** Pivot to simpler model (20-30% chance, smaller business)
**If both = NO:** Major pivot or shutdown to save time/money.

**This 60-day sprint could save you 1-2 years of building the wrong thing. That's the goal.**

---

*Last Updated: 2025-11-01*
*Next Review: Every Friday (weekly sprint review)*
