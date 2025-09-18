# 🎓 University API Integration Guide

Complete guide for integrating your university systems with InTransparency platform.

## 🚀 Quick Start

### 1. Register Your University

```bash
POST /api/university/register
Content-Type: application/json

{
  "name": "Stanford University",
  "domain": "stanford.edu",
  "contactEmail": "integration@stanford.edu",
  "adminFirstName": "John",
  "adminLastName": "Doe",
  "studentInformationSystem": "canvas",
  "expectedStudentCount": 15000,
  "address": {
    "street": "450 Serra Mall",
    "city": "Stanford",
    "state": "CA",
    "country": "USA",
    "postalCode": "94305"
  },
  "phone": "+1-650-723-2300"
}
```

### 2. Get API Credentials

After approval, you'll receive:
- **API Key**: For initial authentication
- **University ID**: Your unique identifier
- **Integration Guide**: Custom setup instructions

### 3. Get Access Token

```bash
POST /api/university/auth/token
Content-Type: application/json
X-API-Key: your-api-key-here

{
  "universityId": "univ_1234567890",
  "apiKey": "your-api-key-here"
}
```

## 🔐 Authentication

### API Key Authentication
For initial setup and token generation:
```bash
X-API-Key: your-api-key-here
```

### JWT Token Authentication
For all subsequent API calls:
```bash
Authorization: Bearer your-jwt-token-here
```

### Token Refresh
```bash
POST /api/university/auth/refresh
Content-Type: application/json

{
  "refresh_token": "your-refresh-token"
}
```

## 👥 Student Data Integration

### Bulk Student Sync

Perfect for initial data migration or periodic full syncs:

```bash
POST /api/university/students/sync
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "students": [
    {
      "studentId": "12345",
      "email": "student@stanford.edu",
      "firstName": "Jane",
      "lastName": "Smith",
      "program": "Computer Science",
      "year": 3,
      "status": "enrolled",
      "gpa": 3.8,
      "enrollmentDate": "2022-09-01",
      "expectedGraduationDate": "2025-06-15"
    }
  ]
}
```

### Individual Student Management

```bash
# Create/Update Student
POST /api/university/students/upsert
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "studentId": "12345",
  "email": "student@stanford.edu",
  "firstName": "Jane",
  "lastName": "Smith",
  "program": "Computer Science",
  "year": 3,
  "status": "enrolled"
}

# Get All Students (with pagination)
GET /api/university/students?page=1&limit=50&program=Computer Science&year=3

# Get Specific Student
GET /api/university/students/12345

# Update Student Status
PUT /api/university/students/12345/status
{
  "status": "graduated",
  "effective_date": "2024-06-15",
  "reason": "Completed degree requirements"
}
```

## 📊 Academic Records Integration

### Grade Synchronization

```bash
POST /api/university/grades/sync
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "grades": [
    {
      "studentId": "12345",
      "courseId": "CS106A",
      "courseName": "Programming Methodology",
      "grade": "A",
      "credits": 4.0,
      "semester": "Fall",
      "year": 2023,
      "instructor": "Dr. Smith",
      "gradeDate": "2023-12-15"
    }
  ]
}
```

### Transcript Upload

```bash
POST /api/university/transcripts/upload
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "transcripts": [
    {
      "studentId": "12345",
      "document": "base64-encoded-pdf-content",
      "type": "official",
      "issueDate": "2024-01-15",
      "semester": "Fall 2023"
    }
  ]
}
```

### Course Catalog Sync

```bash
POST /api/university/courses/sync
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "courses": [
    {
      "courseId": "CS106A",
      "title": "Programming Methodology",
      "description": "Introduction to programming with Java",
      "credits": 4.0,
      "department": "Computer Science",
      "prerequisites": ["CS105"],
      "semester": "Fall",
      "year": 2024,
      "instructor": "Dr. Smith",
      "maxEnrollment": 200
    }
  ]
}
```

## 📝 Project Integration

### Assign Projects from LMS

```bash
POST /api/university/projects/assign
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "studentId": "12345",
  "courseId": "CS106A",
  "projectTitle": "Personal Portfolio Website",
  "description": "Create a responsive personal portfolio using HTML, CSS, and JavaScript",
  "dueDate": "2024-12-15T23:59:59Z",
  "requirements": [
    "Responsive design",
    "At least 3 pages",
    "Contact form",
    "Professional styling"
  ],
  "maxPoints": 100,
  "allowedFileTypes": [".zip", ".html", ".css", ".js"],
  "maxFileSize": 50000000
}
```

### Submit Projects (LMS Integration)

```bash
POST /api/university/projects/submit
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "studentId": "12345",
  "projectId": "proj_1234567890",
  "submissionData": {
    "description": "My personal portfolio website with responsive design",
    "repositoryUrl": "https://github.com/student/portfolio",
    "liveUrl": "https://student-portfolio.vercel.app",
    "technologies": ["HTML", "CSS", "JavaScript", "Bootstrap"],
    "comments": "Added extra animations for better UX"
  },
  "files": [
    {
      "name": "portfolio.zip",
      "type": "application/zip",
      "size": 2048576,
      "content": "base64-encoded-file-content",
      "checksum": "sha256-hash"
    }
  ]
}
```

### Grade Projects

```bash
POST /api/university/projects/proj_1234567890/grade
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "grade": 95,
  "feedback": "Excellent work! Great use of responsive design principles. The site is visually appealing and functions well across devices.",
  "gradedBy": "Dr. Smith",
  "rubric": {
    "design": 25,
    "functionality": 25,
    "code_quality": 20,
    "responsiveness": 25
  }
}
```

## 📈 Analytics & Reporting

### University Dashboard Analytics

```bash
GET /api/university/analytics/dashboard?timeframe=30d
Authorization: Bearer your-jwt-token
```

Response:
```json
{
  "success": true,
  "analytics": {
    "total_students": 15000,
    "active_students": 14500,
    "projects_submitted": 2500,
    "employment_rate": 0.92,
    "top_skills": ["JavaScript", "Python", "React", "SQL"],
    "industry_placements": {
      "technology": 65,
      "finance": 20,
      "consulting": 10,
      "other": 5
    }
  }
}
```

### Student Performance Analytics

```bash
GET /api/university/analytics/students/performance?program=Computer Science&year=2024
Authorization: Bearer your-jwt-token
```

### Employment Outcomes

```bash
GET /api/university/analytics/employment?graduationYear=2023
Authorization: Bearer your-jwt-token
```

### Skills Gap Analysis

```bash
GET /api/university/analytics/skills-gap?program=Computer Science&industry=technology
Authorization: Bearer your-jwt-token
```

## 🔗 LMS Integration

### Supported Platforms

- **Canvas**: Direct API integration
- **Blackboard**: REST API integration
- **Moodle**: Web services integration
- **Brightspace**: Valence API integration
- **Custom**: Webhook-based integration

### Connect to LMS

```bash
GET /api/university/lms/connect/canvas
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "canvas_url": "https://stanford.instructure.com",
  "access_token": "your-canvas-token",
  "account_id": "1"
}
```

### Sync from LMS

```bash
POST /api/university/lms/sync
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "data_types": ["students", "courses", "assignments", "grades"],
  "course_ids": ["1234", "5678"],
  "sync_options": {
    "include_inactive": false,
    "update_existing": true
  }
}
```

## 📡 Webhooks for Real-time Updates

### Configure Webhooks

```bash
POST /api/university/webhooks/configure
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "events": [
    "student.created",
    "student.updated",
    "project.submitted",
    "grade.posted"
  ],
  "endpoint_url": "https://your-university.edu/intransparency-webhook",
  "secret": "your-webhook-secret-key-minimum-16-chars"
}
```

### Available Webhook Events

```bash
GET /api/university/webhooks/events
Authorization: Bearer your-jwt-token
```

### Webhook Payload Example

```json
{
  "event": "project.submitted",
  "timestamp": "2024-03-15T10:30:00Z",
  "university_id": "univ_1234567890",
  "data": {
    "project_id": "proj_1234567890",
    "student_id": "12345",
    "course_id": "CS106A",
    "submission_date": "2024-03-15T10:30:00Z",
    "ai_analysis": {
      "complexity_score": 85,
      "innovation_score": 78,
      "skills_detected": ["JavaScript", "React", "CSS"],
      "recommendations": ["Consider adding TypeScript", "Improve error handling"]
    }
  }
}
```

### Verify Webhook Signatures

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const timestamp = req.headers['x-intransparency-timestamp'];
  const body = JSON.stringify(payload);

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${body}`)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature.replace('sha256=', ''), 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}
```

## 📊 Bulk Operations

### Import Data (CSV/JSON)

```bash
POST /api/university/bulk/import
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "data_type": "students",
  "format": "csv",
  "data": "base64-encoded-csv-content",
  "options": {
    "update_existing": true,
    "skip_duplicates": false,
    "batch_size": 100
  }
}
```

### Export Data

```bash
GET /api/university/bulk/export?data_type=students&format=json&filters={"status":"enrolled"}
Authorization: Bearer your-jwt-token
```

### Get Import Templates

```bash
GET /api/university/bulk/template/students
Authorization: Bearer your-jwt-token
```

## 🔒 Privacy & Compliance

### Manage Student Consent

```bash
POST /api/university/privacy/consent
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "studentId": "12345",
  "consentType": "data_sharing",
  "granted": true,
  "metadata": {
    "ip_address": "192.168.1.1",
    "user_agent": "Mozilla/5.0...",
    "method": "web"
  }
}
```

### Privacy Audit Log

```bash
GET /api/university/privacy/audit?student_id=12345&start_date=2024-01-01&end_date=2024-03-15
Authorization: Bearer your-jwt-token
```

### GDPR/FERPA Data Deletion

```bash
DELETE /api/university/students/12345/data
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "reason": "Student requested data deletion",
  "retain_anonymous_analytics": true
}
```

## 🚦 Rate Limits

- **Standard**: 1,000 requests per 15 minutes
- **Bulk Operations**: 100 requests per hour
- **Webhooks**: 10,000 events per day

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1640995200
```

## 🔧 Error Handling

### Standard Error Response

```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "validation_errors": [
    {
      "field": "email",
      "message": "Valid email address is required",
      "value": "invalid-email"
    }
  ],
  "request_id": "req_1234567890",
  "timestamp": "2024-03-15T10:30:00Z"
}
```

### Common Error Codes

- `MISSING_API_KEY`: API key not provided
- `INVALID_API_KEY`: API key is invalid or inactive
- `EXPIRED_TOKEN`: JWT token has expired
- `VALIDATION_ERROR`: Request validation failed
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INSUFFICIENT_PERMISSIONS`: Missing required permissions
- `RESOURCE_NOT_FOUND`: Requested resource doesn't exist

## 📚 SDK and Libraries

### Official SDKs

- **Node.js**: `npm install @intransparency/university-sdk`
- **Python**: `pip install intransparency-university`
- **Java**: Maven/Gradle dependency available
- **PHP**: Composer package available

### Example Node.js Usage

```javascript
const InTransparency = require('@intransparency/university-sdk');

const client = new InTransparency({
  universityId: 'univ_1234567890',
  apiKey: 'your-api-key',
  environment: 'production' // or 'sandbox'
});

// Sync students
const result = await client.students.sync([
  {
    studentId: '12345',
    email: 'student@university.edu',
    firstName: 'Jane',
    lastName: 'Smith',
    program: 'Computer Science',
    year: 3,
    status: 'enrolled'
  }
]);

console.log('Sync result:', result);
```

## 🧪 Testing & Sandbox

### Sandbox Environment

- **Base URL**: `https://sandbox-api.intransparency.com`
- **Test Data**: Pre-populated with sample students and courses
- **Rate Limits**: Reduced for testing
- **Webhooks**: Test endpoint available

### Integration Testing Checklist

- [ ] University registration
- [ ] API authentication
- [ ] Student data sync
- [ ] Grade import
- [ ] Project assignment
- [ ] Webhook delivery
- [ ] Error handling
- [ ] Rate limit compliance

## 🆘 Support & Resources

### Documentation
- **API Reference**: https://docs.intransparency.com/api
- **Integration Examples**: https://github.com/intransparency/examples
- **Postman Collection**: Available for download

### Support Channels
- **Technical Support**: api-support@intransparency.com
- **Integration Help**: integrations@intransparency.com
- **Emergency**: +1-800-INTR-API (24/7)

### Status & Monitoring
- **API Status**: https://status.intransparency.com
- **Incident Reports**: Real-time notifications
- **Maintenance Windows**: Advance notice provided

---

## 🎯 Best Practices

1. **Always use HTTPS** for all API calls
2. **Store credentials securely** - never in code repositories
3. **Implement retry logic** with exponential backoff
4. **Monitor rate limits** and implement queuing
5. **Validate webhooks** using signature verification
6. **Handle errors gracefully** with proper user messaging
7. **Use bulk operations** for large data sets
8. **Cache frequently accessed data** to reduce API calls
9. **Log all API interactions** for debugging and auditing
10. **Test in sandbox** before production deployment

Ready to transform your university's career services? Start integrating today! 🚀