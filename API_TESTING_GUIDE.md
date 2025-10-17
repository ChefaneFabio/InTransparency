# API Testing Guide - Multi-Discipline Projects

This guide shows how to test project creation across all 15 disciplines using the new `/api/projects` endpoint.

## Prerequisites

1. **Authentication**: All endpoints require `x-user-id` header
2. **Base URL**: `http://localhost:3000` (or your deployment URL)
3. **Content-Type**: `application/json`

---

## API Endpoints

### 1. Create Project
**POST** `/api/projects`

**Headers**:
```
Content-Type: application/json
x-user-id: <your-user-id>
```

### 2. Get All Projects (with filters)
**GET** `/api/projects?discipline=TECHNOLOGY&limit=20`

### 3. Get Single Project
**GET** `/api/projects/:id`

### 4. Update Project
**PATCH** `/api/projects/:id`

### 5. Delete Project
**DELETE** `/api/projects/:id`

### 6. Upload Files
**POST** `/api/projects/:id/files`

**Headers**:
```
Content-Type: multipart/form-data
x-user-id: <your-user-id>
```

---

## Test Cases by Discipline

### 1. TECHNOLOGY - Web Application

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_123" \
  -d '{
    "discipline": "TECHNOLOGY",
    "projectType": "Web Application",
    "title": "E-Commerce Platform with AI Recommendations",
    "description": "Built a full-stack e-commerce platform using Next.js, PostgreSQL, and OpenAI API. Implemented personalized product recommendations using machine learning algorithms. Features include user authentication, payment processing with Stripe, and real-time inventory management.",
    "technologies": ["Next.js", "React", "TypeScript", "PostgreSQL", "Prisma", "Stripe", "OpenAI API"],
    "githubUrl": "https://github.com/student/ecommerce-ai",
    "liveUrl": "https://ecommerce-demo.vercel.app",
    "skills": ["Full-Stack Development", "API Integration", "Database Design", "Machine Learning"],
    "tools": ["VS Code", "Git", "Docker", "Vercel"],
    "imageUrl": "https://example.com/project-screenshot.png",
    "duration": "4 months",
    "teamSize": 1,
    "role": "Full-Stack Developer",
    "outcome": "Deployed successfully, handling 1000+ daily users",
    "courseName": "Advanced Web Development",
    "courseCode": "CS401",
    "semester": "Fall 2024",
    "academicYear": "2024-2025",
    "grade": "A",
    "professor": "Dr. Sarah Johnson",
    "competencies": ["Web Development", "API Design", "Database Management", "Cloud Deployment"],
    "isPublic": true
  }'
```

---

### 2. BUSINESS - Financial Model

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_123" \
  -d '{
    "discipline": "BUSINESS",
    "projectType": "Financial Model",
    "title": "Tesla DCF Valuation Model",
    "description": "Comprehensive discounted cash flow (DCF) valuation model for Tesla Inc. Built in Excel with dynamic assumptions, sensitivity analysis, and scenario planning. Analyzed 10 years of historical financials and projected 5-year future cash flows. Model includes revenue build-up by segment, detailed cost structure, and WACC calculation.",
    "skills": ["Financial Modeling", "DCF Analysis", "Equity Valuation", "Excel", "Financial Analysis"],
    "tools": ["Microsoft Excel", "Bloomberg Terminal", "Capital IQ", "FactSet"],
    "imageUrl": "https://example.com/tesla-model-screenshot.png",
    "duration": "1 semester",
    "teamSize": 2,
    "role": "Lead Analyst",
    "client": "University Investment Club",
    "outcome": "Model predicted stock price within 5% accuracy. Presented to 50+ finance students.",
    "courseName": "Corporate Finance",
    "courseCode": "FIN401",
    "semester": "Fall 2024",
    "academicYear": "2024-2025",
    "grade": "A",
    "professor": "Dr. Michael Chen",
    "competencies": ["Financial Analysis", "Equity Research", "Quantitative Modeling", "Presentation Skills"],
    "isPublic": true
  }'
```

---

### 3. DESIGN - UX/UI Design

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_123" \
  -d '{
    "discipline": "DESIGN",
    "projectType": "UX/UI Design",
    "title": "Mental Health App - Complete UX Redesign",
    "description": "Led complete UX/UI redesign of a mental health tracking app. Conducted user research with 30+ participants, created personas, journey maps, and wireframes. Designed high-fidelity mockups in Figma with a focus on accessibility and emotional design. Implemented design system with 100+ reusable components.",
    "skills": ["User Research", "Wireframing", "Prototyping", "Visual Design", "Accessibility Design"],
    "tools": ["Figma", "Adobe XD", "Miro", "UserTesting.com", "Hotjar"],
    "imageUrl": "https://example.com/mental-health-app-design.png",
    "videos": ["https://www.youtube.com/watch?v=demo-video"],
    "duration": "3 months",
    "teamSize": 3,
    "role": "Lead UX Designer",
    "client": "MindWell Inc.",
    "outcome": "Design increased user engagement by 40% and received 4.8/5 rating from beta testers",
    "courseName": "User Experience Design",
    "courseCode": "DES301",
    "semester": "Spring 2024",
    "academicYear": "2023-2024",
    "grade": "A-",
    "professor": "Prof. Emily Rodriguez",
    "competencies": ["UX Research", "UI Design", "Prototyping", "User Testing", "Design Thinking"],
    "isPublic": true
  }'
```

---

### 4. HEALTHCARE - Clinical Case Study

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_123" \
  -d '{
    "discipline": "HEALTHCARE",
    "projectType": "Clinical Case Study",
    "title": "Evidence-Based Wound Care Protocol Implementation",
    "description": "Implemented evidence-based wound care protocol in a 200-bed hospital. Conducted literature review of 50+ peer-reviewed studies. Developed standardized assessment tools and treatment algorithms. Trained 30+ nursing staff on new protocol. Tracked patient outcomes for 6 months showing 25% reduction in healing time and 15% cost reduction.",
    "skills": ["Evidence-Based Practice", "Clinical Research", "Protocol Development", "Staff Training", "Data Analysis"],
    "tools": ["Electronic Health Records", "PubMed", "CINAHL", "Cochrane Library", "Excel"],
    "imageUrl": "https://example.com/wound-care-protocol.png",
    "duration": "6 months",
    "teamSize": 4,
    "role": "Clinical Lead",
    "client": "St. Mary Hospital",
    "outcome": "25% faster healing times, 15% cost reduction, protocol adopted hospital-wide",
    "courseName": "Advanced Clinical Practice",
    "courseCode": "NURS502",
    "semester": "Spring 2024",
    "academicYear": "2023-2024",
    "grade": "A-",
    "professor": "Dr. Michael Park, RN",
    "competencies": ["Clinical Assessment", "Evidence-Based Practice", "Protocol Implementation", "Quality Improvement"],
    "certifications": ["RN License #123456", "Wound Care Certification"],
    "isPublic": true
  }'
```

---

### 5. ENGINEERING - CAD Design

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_123" \
  -d '{
    "discipline": "ENGINEERING",
    "projectType": "CAD Design",
    "title": "Automotive Suspension System Design",
    "description": "Designed complete automotive suspension system using SolidWorks. Performed FEA analysis to optimize weight while maintaining structural integrity. Created manufacturing drawings and bill of materials. System tested in simulation under various load conditions. Achieved 15% weight reduction compared to baseline design while improving ride comfort.",
    "skills": ["CAD Design", "Finite Element Analysis", "Manufacturing Engineering", "Materials Science"],
    "tools": ["SolidWorks", "ANSYS", "MATLAB", "AutoCAD"],
    "imageUrl": "https://example.com/suspension-system-cad.png",
    "duration": "1 semester",
    "teamSize": 2,
    "role": "Design Engineer",
    "outcome": "15% weight reduction, improved ride comfort, approved for prototype manufacturing",
    "courseName": "Mechanical Design",
    "courseCode": "ME401",
    "semester": "Fall 2024",
    "academicYear": "2024-2025",
    "grade": "A",
    "professor": "Dr. James Wilson",
    "competencies": ["CAD Modeling", "FEA Analysis", "Design Optimization", "Engineering Documentation"],
    "certifications": ["SolidWorks CSWA", "FE Exam Passed"],
    "isPublic": true
  }'
```

---

### 6. TRADES - Construction Project

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_123" \
  -d '{
    "discipline": "TRADES",
    "projectType": "Construction Project",
    "title": "Commercial Building Electrical Installation",
    "description": "Led electrical installation for 10,000 sq ft commercial building. Designed electrical layout meeting NEC codes and local regulations. Installed 400+ circuits, lighting systems, fire alarms, and emergency power. Managed team of 3 apprentices. Project completed on time and passed all inspections on first attempt.",
    "skills": ["Electrical Installation", "Code Compliance", "Blueprint Reading", "Team Leadership", "Safety Management"],
    "tools": ["Voltage Testers", "Conduit Benders", "Power Tools", "AutoCAD Electrical"],
    "imageUrl": "https://example.com/electrical-installation.jpg",
    "duration": "6 months",
    "teamSize": 4,
    "role": "Lead Electrician",
    "client": "ABC Construction Inc.",
    "outcome": "Project completed on time, under budget, passed all inspections on first attempt",
    "courseName": "Advanced Electrical Systems",
    "courseCode": "ELEC301",
    "semester": "Spring 2024",
    "academicYear": "2023-2024",
    "grade": "A",
    "professor": "Master Electrician Tom Harris",
    "competencies": ["Electrical Installation", "Code Compliance", "Safety Protocols", "Project Management"],
    "certifications": ["Journeyman Electrician License", "OSHA 30", "First Aid/CPR"],
    "isPublic": true
  }'
```

---

### 7. WRITING - Research Paper

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_123" \
  -d '{
    "discipline": "WRITING",
    "projectType": "Research Paper",
    "title": "Impact of Social Media on Mental Health: A Meta-Analysis",
    "description": "Comprehensive research paper analyzing 50+ peer-reviewed studies on social media and mental health. Conducted systematic literature review using PRISMA guidelines. Analyzed data from 100,000+ participants across 15 countries. Found significant correlation between social media use and anxiety/depression, particularly in adolescents. Paper accepted for publication in undergraduate research journal.",
    "skills": ["Academic Research", "Literature Review", "Data Analysis", "Scientific Writing", "Critical Thinking"],
    "tools": ["Zotero", "SPSS", "Microsoft Word", "Google Scholar", "Mendeley"],
    "imageUrl": "https://example.com/research-paper-cover.png",
    "duration": "1 semester",
    "teamSize": 1,
    "role": "Author",
    "outcome": "Accepted for publication in Journal of Undergraduate Research. Presented at regional conference.",
    "courseName": "Research Methods in Psychology",
    "courseCode": "PSY401",
    "semester": "Fall 2024",
    "academicYear": "2024-2025",
    "grade": "A",
    "professor": "Dr. Lisa Anderson",
    "competencies": ["Research Methodology", "Data Analysis", "Academic Writing", "Critical Analysis"],
    "isPublic": true
  }'
```

---

## Testing File Uploads

After creating a project, test file upload:

```bash
# Upload a PDF file
curl -X POST http://localhost:3000/api/projects/<project-id>/files \
  -H "x-user-id: user_123" \
  -F "files=@/path/to/document.pdf" \
  -F "files=@/path/to/image.jpg"
```

---

## Testing Filters

### Get all Technology projects
```bash
curl http://localhost:3000/api/projects?discipline=TECHNOLOGY&limit=10
```

### Get projects from a specific course
```bash
curl http://localhost:3000/api/projects?courseCode=CS401
```

### Get featured projects
```bash
curl http://localhost:3000/api/projects?featured=true
```

### Get public projects only
```bash
curl http://localhost:3000/api/projects?isPublic=true
```

---

## Expected Responses

### Success Response (201 Created)
```json
{
  "success": true,
  "message": "Project created successfully",
  "project": {
    "id": "clx123abc",
    "discipline": "TECHNOLOGY",
    "projectType": "Web Application",
    "title": "E-Commerce Platform with AI Recommendations",
    "description": "...",
    "technologies": ["Next.js", "React", "TypeScript"],
    "skills": ["Full-Stack Development", "API Integration"],
    "tools": ["VS Code", "Git", "Docker"],
    "courseName": "Advanced Web Development",
    "courseCode": "CS401",
    "grade": "A",
    "competencies": ["Web Development", "API Design"],
    "createdAt": "2024-10-12T10:30:00Z",
    "user": {
      "id": "user_123",
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe"
    }
  }
}
```

### Error Response (400 Bad Request)
```json
{
  "error": "Missing required fields: title, description, discipline"
}
```

### Error Response (401 Unauthorized)
```json
{
  "error": "Unauthorized"
}
```

---

## Testing Checklist

- [ ] **Technology Project** - Web app with GitHub URL
- [ ] **Business Project** - Financial model with Excel mention
- [ ] **Design Project** - UX design with Figma
- [ ] **Healthcare Project** - Clinical case with certifications
- [ ] **Engineering Project** - CAD design with SolidWorks
- [ ] **Trades Project** - Construction with OSHA certification
- [ ] **Writing Project** - Research paper with academic format
- [ ] **File Upload** - Upload PDF, images, and documents
- [ ] **Update Project** - PATCH endpoint with partial data
- [ ] **Get Projects** - Test all filter combinations
- [ ] **Delete Project** - Ensure cascade deletion works
- [ ] **Course-Based Filtering** - Search by course code
- [ ] **Competency Tracking** - Verify competencies are saved
- [ ] **Academic Context** - All course fields populated

---

## Next Steps After Testing

1. **Implement AI Analysis**
   - Create discipline-specific analysis functions
   - Generate complexity, innovation, and relevance scores

2. **Add University Verification**
   - Build admin dashboard for universities
   - Allow professors to verify projects

3. **Implement Search Filters**
   - Update recruiter dashboard with discipline filters
   - Add course-based search
   - Add competency-based matching

4. **Build Public Portfolio Pages**
   - Show projects grouped by discipline
   - Display academic context (course, grade)
   - Show competencies and certifications

---

## Troubleshooting

### Issue: "Unauthorized" error
- **Solution**: Make sure `x-user-id` header is set

### Issue: "Invalid discipline" error
- **Solution**: Check spelling of discipline (must be uppercase, e.g., "TECHNOLOGY" not "technology")

### Issue: Project created but no competencies shown
- **Solution**: Make sure `competencies` is an array of strings in request body

### Issue: File upload fails
- **Solution**:
  - Check file size (max 100MB)
  - Verify file type is allowed
  - Ensure Content-Type is multipart/form-data

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Replace placeholder file URLs with actual S3/Cloudflare integration
- [ ] Set up environment variables for cloud storage
- [ ] Implement authentication middleware
- [ ] Add rate limiting
- [ ] Enable CORS if needed
- [ ] Set up monitoring and error logging
- [ ] Test with real user accounts
- [ ] Verify database indexes for performance
- [ ] Test file upload with large files
- [ ] Implement AI analysis pipeline
