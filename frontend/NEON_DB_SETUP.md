# Neon DB Setup Guide for Survey Storage

## 🚀 Quick Setup

### 1. Set up your Neon Database

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project (or use existing)
3. Copy your connection strings from the dashboard

### 2. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Add your Neon DB credentials to `.env.local`:
```env
DATABASE_URL="postgresql://username:password@ep-xyz-123456.us-east-2.aws.neon.tech/intransparency?sslmode=require"
DIRECT_URL="postgresql://username:password@ep-xyz-123456.us-east-2.aws.neon.tech/intransparency?sslmode=require"
```

### 3. Install Dependencies

```bash
npm install @prisma/client prisma
```

### 4. Initialize Database

Push the schema to your Neon database:
```bash
npm run prisma:push
```

Or use migrations for production:
```bash
npm run prisma:migrate
```

### 5. Generate Prisma Client

```bash
npm run prisma:generate
```

### 6. Test the Connection

Visit `/api/surveys/submit` in your browser. You should see:
```json
{
  "status": "ok",
  "message": "Survey API is running",
  "timestamp": "2024-..."
}
```

## 📊 Database Schema

The system stores survey responses in two ways:

1. **Generic Storage** (`SurveyResponse`): All surveys stored as JSON for flexibility
2. **Structured Storage**: Type-specific tables for better querying:
   - `StudentSurvey`
   - `CompanySurvey`
   - `UniversitySurvey`

## 🔧 Available Commands

- `npm run prisma:studio` - Open Prisma Studio to view/edit data
- `npm run prisma:push` - Push schema changes to database
- `npm run prisma:migrate` - Create and apply migrations
- `npm run prisma:generate` - Regenerate Prisma client

## 🛡️ Security Features

### Rate Limiting
- Default: 10 submissions per IP per hour
- Configure via `RATE_LIMIT_PER_IP` env variable

### Validation
- Required fields validation for each survey type
- Input sanitization
- IP tracking for security

### Data Protection
- All connections use SSL
- Sensitive data stored securely
- Optional field encryption (can be added)

## 📈 Admin Dashboard

Access survey statistics and responses at:
```
/admin/surveys
```

Features:
- View total responses
- Filter by survey type
- Export to CSV
- Response analytics
- Average completion times

## 🔍 API Endpoints

### Submit Survey
```
POST /api/surveys/submit
```

Body:
```json
{
  "surveyType": "student|company|university",
  "responses": { ... },
  "metadata": {
    "completionTime": 120000
  }
}
```

### Get Statistics
```
GET /api/surveys/stats
```

Query params:
- `type`: Filter by survey type
- `startDate`: Start date filter
- `endDate`: End date filter

### Export Data
```
GET /api/surveys/export?type=student
```

## 🚨 Troubleshooting

### Connection Issues
1. Verify Neon DB is active (check dashboard)
2. Check connection string format
3. Ensure SSL mode is set to `require`

### Schema Issues
1. Run `npm run prisma:generate` after schema changes
2. Use `npm run prisma:push` for development
3. Use `npm run prisma:migrate` for production

### Common Errors
- `P1001`: Can't reach database - Check connection string
- `P2002`: Unique constraint failed - Duplicate data
- `P2025`: Record not found - Invalid ID

## 📝 Notes

- The system works in "fail-safe" mode - if structured storage fails, data is still saved as JSON
- All timestamps are in UTC
- Survey responses are immutable (no updates, only inserts)
- Consider adding backup/archive strategy for old data

## 🔄 Next Steps

1. Set up automated backups in Neon dashboard
2. Configure monitoring/alerts
3. Add data export automation
4. Implement survey result analytics
5. Add email notifications for new responses