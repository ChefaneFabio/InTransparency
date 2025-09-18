# 💼 Complete Recruiter Hiring Guide

**Everything recruiters need to know about finding, contacting, and hiring students from ANY university through InTransparency.**

---

## 🎯 **What Recruiters Can Do - Overview**

InTransparency gives recruiters **complete access** to hire students from **any university** in the network. Here's exactly what you can do:

### ✅ **Discovery & Search**
- Search 500,000+ students across all universities
- Use AI-powered matching for perfect candidates
- Filter by skills, projects, GPA, graduation year, location
- Get personalized student recommendations

### ✅ **Direct Contact**
- Message students directly (with their consent)
- Send bulk personalized outreach campaigns
- Schedule interviews and calls
- Build ongoing talent relationships

### ✅ **Hiring & Applications**
- Post jobs visible to targeted students
- Invite specific students to apply
- Manage full application process
- Send offers and track responses

### ✅ **Talent Pipeline**
- Follow students for future opportunities
- Build and manage talent pools
- Create recruitment campaigns
- Track student career progression

---

## 🚀 **Quick Start for Recruiters**

### 1. Register Your Company
```bash
POST /api/recruiter/register
Content-Type: application/json

{
  "companyName": "TechCorp Inc",
  "recruiterEmail": "sarah.jones@techcorp.com",
  "recruiterFirstName": "Sarah",
  "recruiterLastName": "Jones",
  "companySize": "500-1000",
  "industry": "Technology",
  "companyWebsite": "techcorp.com",
  "linkedin": "linkedin.com/company/techcorp"
}
```

### 2. Verify Your Company (builds trust with students)
```bash
POST /api/recruiter/verify-company
Authorization: Bearer your-token
Content-Type: application/json

{
  "companyDomain": "techcorp.com",
  "verificationMethod": "dns_verification"
}
```

### 3. Start Finding Students!
```bash
POST /api/recruiter/students/search
Authorization: Bearer your-token
Content-Type: application/json

{
  "searchCriteria": {
    "skills": ["JavaScript", "React", "Python"],
    "graduationYear": [2024, 2025],
    "gpaRange": [3.0, 4.0],
    "universities": ["any"],
    "location": "California",
    "experienceLevel": "entry_level"
  }
}
```

---

## 🔍 **Student Discovery Methods**

### **Method 1: Advanced Search**
Search across ALL universities with precise filters:

```bash
POST /api/recruiter/students/search
Authorization: Bearer your-token
Content-Type: application/json

{
  "searchCriteria": {
    "skills": ["JavaScript", "React", "Node.js"],
    "projects": {
      "minCount": 3,
      "types": ["web_development", "mobile_app"]
    },
    "education": {
      "majors": ["Computer Science", "Software Engineering"],
      "graduationYear": [2024, 2025],
      "gpaRange": [3.2, 4.0]
    },
    "location": {
      "cities": ["San Francisco", "New York", "Austin"],
      "remote": true
    },
    "availability": {
      "jobTypes": ["full_time", "internship"],
      "startDate": "2024-06-01"
    },
    "diversity": {
      "underrepresented": true // Optional: prioritize diversity
    }
  },
  "limit": 50,
  "sortBy": "relevance" // or "gpa", "project_quality", "recent_activity"
}
```

**Response:**
```json
{
  "success": true,
  "students": [
    {
      "studentId": "student_123",
      "firstName": "Alex",
      "lastName": "Chen",
      "university": "Stanford University",
      "major": "Computer Science",
      "graduationYear": 2024,
      "gpa": 3.8,
      "skills": ["JavaScript", "React", "Python", "SQL"],
      "projectCount": 5,
      "topProjects": [
        {
          "title": "E-commerce Platform",
          "tech": ["React", "Node.js", "MongoDB"],
          "complexity": 8.5,
          "github": "github.com/alexchen/ecommerce"
        }
      ],
      "location": "San Francisco, CA",
      "isOpenToWork": true,
      "contactAllowed": true,
      "matchScore": 95
    }
  ],
  "totalFound": 247,
  "searchId": "search_789" // Use for pagination
}
```

### **Method 2: AI-Powered Recommendations**
Get students recommended specifically for your company:

```bash
GET /api/recruiter/students/recommendations?jobRole=Software Engineer&companyStage=startup&techStack=React,Node.js
Authorization: Bearer your-token
```

### **Method 3: Job-Specific Matching**
Post a job and get matched students:

```bash
POST /api/recruiter/jobs
Authorization: Bearer your-token
Content-Type: application/json

{
  "title": "Frontend Developer Intern",
  "description": "Build amazing user interfaces with React",
  "requirements": {
    "skills": ["JavaScript", "React", "CSS"],
    "education": "Currently pursuing CS degree",
    "experience": "0-1 years"
  },
  "location": "San Francisco, CA",
  "jobType": "internship",
  "duration": "3 months",
  "salary": {
    "min": 25,
    "max": 35,
    "period": "hourly"
  },
  "benefits": ["Health insurance", "Mentorship", "Full-time offer potential"],
  "autoMatch": true // Automatically find matching students
}
```

---

## 💬 **How to Contact Students**

### **Direct Messaging (Most Common)**

```bash
POST /api/recruiter/students/student_123/contact
Authorization: Bearer your-token
Content-Type: application/json

{
  "subject": "Exciting Frontend Developer Opportunity at TechCorp",
  "message": "Hi Alex! I came across your e-commerce project and was impressed by your React skills. We have an exciting frontend developer role that would be perfect for your background. Would you be interested in learning more?",
  "opportunityType": "full_time_job",
  "jobId": "job_456", // Optional: link to specific job
  "attachments": [
    {
      "type": "job_description",
      "url": "https://techcorp.com/careers/frontend-dev"
    }
  ]
}
```

### **Bulk Personalized Outreach**

```bash
POST /api/recruiter/students/bulk-contact
Authorization: Bearer your-token
Content-Type: application/json

{
  "studentIds": ["student_123", "student_456", "student_789"],
  "messageTemplate": "Hi {{firstName}}! I was impressed by your {{topSkill}} skills and {{topProject}} project. We have an exciting {{jobTitle}} role at {{companyName}} that matches your background perfectly. {{personalNote}}",
  "subject": "{{jobTitle}} Opportunity at {{companyName}}",
  "personalizations": [
    {
      "studentId": "student_123",
      "variables": {
        "topSkill": "React",
        "topProject": "e-commerce platform",
        "jobTitle": "Frontend Developer",
        "personalNote": "Your use of modern React patterns really stood out to me."
      }
    }
  ],
  "opportunityType": "full_time_job",
  "jobId": "job_456"
}
```

### **Interview Scheduling**

```bash
POST /api/recruiter/students/student_123/schedule-interview
Authorization: Bearer your-token
Content-Type: application/json

{
  "interviewType": "video_call",
  "proposedTimes": [
    "2024-03-20T14:00:00Z",
    "2024-03-20T16:00:00Z",
    "2024-03-21T10:00:00Z"
  ],
  "duration": 60,
  "jobRole": "Frontend Developer",
  "interviewStage": "technical_screen",
  "meetingLink": "https://zoom.us/j/123456789",
  "agenda": [
    "Technical discussion about React",
    "Code review of portfolio projects",
    "Company culture fit"
  ],
  "interviewers": [
    {
      "name": "Sarah Jones",
      "role": "Senior Recruiter",
      "linkedin": "linkedin.com/in/sarahjones"
    }
  ]
}
```

---

## 📋 **Application & Hiring Process**

### **Step 1: Job Invitation**
Invite specific students to apply:

```bash
POST /api/recruiter/jobs/job_456/invite-students
Authorization: Bearer your-token
Content-Type: application/json

{
  "studentIds": ["student_123", "student_456"],
  "personalMessage": "Based on your impressive React projects, I'd love to invite you to apply for our Frontend Developer role. Your e-commerce platform project shows exactly the kind of skills we're looking for!",
  "deadline": "2024-04-01T23:59:59Z",
  "incentives": ["Fast-track interview process", "Signing bonus eligible"]
}
```

### **Step 2: Application Management**
Track and manage applications:

```bash
GET /api/recruiter/applications?status=new&jobId=job_456
Authorization: Bearer your-token
```

```bash
PUT /api/recruiter/applications/app_123/status
Authorization: Bearer your-token
Content-Type: application/json

{
  "status": "interview_scheduled",
  "feedback": "Strong technical background, excited to meet them!",
  "nextSteps": [
    "Technical interview on March 20th",
    "Meet with team lead",
    "Final interview with CTO"
  ],
  "internalNotes": "Great React skills, good culture fit"
}
```

### **Step 3: Job Offers**
Send formal job offers:

```bash
POST /api/recruiter/applications/app_123/send-offer
Authorization: Bearer your-token
Content-Type: application/json

{
  "offerDetails": {
    "position": "Frontend Developer",
    "salary": 95000,
    "equity": "0.1%",
    "benefits": [
      "Health, dental, vision insurance",
      "401k with 4% match",
      "Unlimited PTO",
      "Remote work options"
    ],
    "startDate": "2024-06-15",
    "location": "San Francisco, CA (hybrid)",
    "reportingTo": "Sarah Kim, Engineering Manager"
  },
  "offerExpiration": "2024-04-15T23:59:59Z",
  "signingBonus": 5000,
  "personalNote": "We're thrilled to offer you this position, Alex! Your projects really impressed the team."
}
```

---

## 🏗️ **Building Talent Pipelines**

### **Follow Students for Future Opportunities**

```bash
POST /api/recruiter/students/student_123/follow
Authorization: Bearer your-token
Content-Type: application/json

{
  "reason": "future_opportunities",
  "notes": "Excellent React developer, not ready to graduate until 2025 but perfect for future senior role",
  "tags": ["frontend", "react_expert", "future_senior"],
  "reminderDate": "2024-10-01"
}
```

### **Create Recruitment Campaigns**

```bash
POST /api/recruiter/talent-pipeline/create-campaign
Authorization: Bearer your-token
Content-Type: application/json

{
  "campaignName": "2025 New Grad Recruitment",
  "targetSegment": {
    "graduationYear": [2025],
    "majors": ["Computer Science", "Software Engineering"],
    "skills": ["JavaScript", "Python", "React"],
    "universities": ["Stanford", "MIT", "UC Berkeley"]
  },
  "message": {
    "subject": "Join TechCorp's 2025 New Graduate Program",
    "template": "Hi {{firstName}}! Are you interested in joining an innovative startup where you can make a real impact? Our 2025 New Graduate Program offers mentorship, competitive salary, and equity. Let's chat!",
    "ctaText": "Learn More",
    "ctaUrl": "https://techcorp.com/newgrad2025"
  },
  "schedule": {
    "startDate": "2024-09-01",
    "frequency": "monthly",
    "endDate": "2025-03-01"
  }
}
```

### **Talent Pool Management**

```bash
POST /api/recruiter/talent-pipeline/add-student
Authorization: Bearer your-token
Content-Type: application/json

{
  "studentId": "student_123",
  "pipelineType": "future_senior_engineer",
  "notes": "Amazing React skills, currently junior but has senior potential",
  "targetRole": "Senior Frontend Developer",
  "estimatedReadyDate": "2026-01-01",
  "tags": ["react", "frontend", "high_potential"]
}
```

---

## 🏫 **University Partnerships**

### **Partner with Universities**

```bash
POST /api/recruiter/universities/univ_stanford/partnership
Authorization: Bearer your-token
Content-Type: application/json

{
  "partnershipType": "campus_recruitment",
  "proposal": {
    "programs": ["Career fairs", "Tech talks", "Internship program"],
    "commitment": "10 internships per semester, 5 full-time hires per year",
    "benefits": "Mentorship program, guest lectures, project sponsorship"
  },
  "duration": "2 years",
  "budget": 50000
}
```

### **Campus Events**

```bash
POST /api/recruiter/universities/univ_stanford/campus-event
Authorization: Bearer your-token
Content-Type: application/json

{
  "eventDetails": {
    "title": "TechCorp Tech Talk: Building Scalable React Applications",
    "type": "tech_talk",
    "date": "2024-04-15T18:00:00Z",
    "duration": 120,
    "location": "Gates Building, Room 104",
    "capacity": 100,
    "agenda": [
      "React best practices presentation",
      "Q&A with engineers",
      "Networking and pizza"
    ],
    "speakers": [
      {
        "name": "Alex Johnson",
        "role": "Senior Frontend Engineer",
        "bio": "5 years at TechCorp, React expert"
      }
    ],
    "recruitmentGoal": "Identify 10-15 strong candidates for summer internships"
  }
}
```

---

## 📊 **Analytics & Insights**

### **Recruitment Performance**

```bash
GET /api/recruiter/analytics/dashboard?timeframe=30d
Authorization: Bearer your-token
```

**Response shows:**
- Students contacted: 45
- Response rate: 67%
- Applications received: 23
- Interviews scheduled: 12
- Offers made: 3
- Hires completed: 2

### **Market Intelligence**

```bash
GET /api/recruiter/analytics/market-insights?role=Frontend Developer&location=San Francisco
Authorization: Bearer your-token
```

**Response includes:**
- Average salary expectations: $95k-$120k
- Most in-demand skills: React, TypeScript, Node.js
- Competition level: High
- Best universities for this role: Stanford, UC Berkeley, Carnegie Mellon
- Optimal contact timing: Tuesday-Thursday, 2-4 PM

---

## 🔒 **Privacy & Compliance**

### **Student Consent Management**
Before contacting students, check their privacy settings:

```bash
GET /api/recruiter/privacy/student-consent/student_123
Authorization: Bearer your-token
```

**Response:**
```json
{
  "contactAllowed": true,
  "profileViewAllowed": true,
  "projectViewAllowed": true,
  "consentTypes": {
    "recruitment_messages": true,
    "job_recommendations": true,
    "company_updates": false,
    "profile_sharing": true
  },
  "restrictions": {
    "maxMessagesPerWeek": 2,
    "preferredContactTimes": ["Tuesday", "Wednesday", "Thursday"],
    "blacklistedCompanies": []
  }
}
```

### **Request Additional Consent**

```bash
POST /api/recruiter/privacy/request-consent
Authorization: Bearer your-token
Content-Type: application/json

{
  "studentId": "student_123",
  "consentType": "detailed_background_check",
  "reason": "Final stage of interview process for senior engineering role",
  "explanation": "We'd like to conduct a professional reference check as part of our final interview stage. This would involve contacting previous employers or project collaborators."
}
```

---

## 💎 **Premium Features**

### **AI-Powered Screening**

```bash
POST /api/recruiter/premium/ai-screening
Authorization: Bearer your-token
Content-Type: application/json

{
  "jobRequirements": {
    "role": "Senior Frontend Developer",
    "requiredSkills": ["React", "TypeScript", "Testing"],
    "experienceLevel": "3-5 years",
    "traits": ["leadership potential", "problem solving", "communication"]
  },
  "candidateProfiles": ["student_123", "student_456", "student_789"],
  "screeningDepth": "comprehensive"
}
```

**AI Response:**
```json
{
  "screeningResults": [
    {
      "studentId": "student_123",
      "overallScore": 92,
      "breakdown": {
        "technicalSkills": 95,
        "projectQuality": 88,
        "leadershipPotential": 90,
        "cultureMatch": 94
      },
      "recommendation": "Strong hire - exceptional React skills with leadership experience",
      "redFlags": [],
      "strengths": ["Advanced React patterns", "Open source contributions", "Team leadership in projects"],
      "developmentAreas": ["Could benefit from more TypeScript experience"]
    }
  ]
}
```

---

## 🎯 **Best Practices for Recruiters**

### **1. Personalized Outreach**
❌ **Don't:** "Hi, we have a job opening"
✅ **Do:** "Hi Alex! Your e-commerce platform project really impressed me, especially your use of React hooks for state management. We have a frontend role where you'd build similar user-facing features."

### **2. Respect Student Privacy**
- Always check consent settings before contacting
- Limit message frequency (max 2 per week per student)
- Honor opt-out requests immediately
- Be transparent about how you found them

### **3. Build Relationships**
- Follow students for future opportunities
- Engage with their project updates
- Provide feedback even for rejected candidates
- Maintain professional network connections

### **4. Optimize Timing**
- Contact students Tuesday-Thursday, 2-4 PM
- Avoid exam periods (finals, midterms)
- Follow up within 48 hours of initial interest
- Schedule interviews during non-class hours

### **5. Clear Communication**
- Be specific about role requirements
- Provide detailed job descriptions
- Set clear expectations for process and timeline
- Give constructive feedback at each stage

---

## 🆘 **Support & Resources**

### **Need Help?**
- **Recruiter Support**: recruiters@intransparency.com
- **Technical Issues**: api-support@intransparency.com
- **Partnership Inquiries**: partnerships@intransparency.com
- **24/7 Chat**: Available in recruiter dashboard

### **Resources**
- **Best Practices Guide**: /docs/recruiter-best-practices
- **API Documentation**: /docs/api/recruiter
- **Video Tutorials**: /tutorials/recruiter-onboarding
- **Success Stories**: /case-studies/successful-hires

---

## 📈 **Pricing & Plans**

### **Starter Plan** - $299/month
- Search up to 1,000 students/month
- Contact up to 50 students/month
- 3 active job postings
- Basic analytics

### **Professional Plan** - $599/month
- Search up to 5,000 students/month
- Contact up to 200 students/month
- 10 active job postings
- Advanced analytics + AI recommendations
- University partnership tools

### **Enterprise Plan** - Custom pricing
- Unlimited searches and contacts
- Unlimited job postings
- Premium AI features
- Dedicated account manager
- Custom integrations

---

**Ready to find your next amazing hire? Sign up and start connecting with talented students from top universities today!** 🚀

*With InTransparency, there are no barriers between great companies and great students - regardless of which university they attend.*