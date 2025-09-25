const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Submit survey response
router.post('/submit', async (req, res) => {
  try {
    const { surveyType, responses, metadata } = req.body;

    if (!surveyType || !responses) {
      return res.status(400).json({ error: 'Survey type and responses are required' });
    }

    const surveyResponse = {
      id: uuidv4(),
      survey_type: surveyType,
      responses: JSON.stringify(responses),
      metadata: JSON.stringify(metadata || {}),
      submitted_at: new Date(),
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
      is_complete: true
    };

    const db = req.app.get('db');
    await db('survey_responses').insert(surveyResponse);

    res.json({
      success: true,
      message: 'Survey response submitted successfully',
      responseId: surveyResponse.id
    });
  } catch (error) {
    console.error('Error submitting survey:', error);
    res.status(500).json({ error: 'Failed to submit survey response' });
  }
});

// Get survey analytics (admin only)
router.get('/analytics', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const db = req.app.get('db');

    // Get overview statistics
    const overviewStats = await db('survey_responses')
      .select(
        db.raw('COUNT(*) as total_responses'),
        db.raw("SUM(CASE WHEN survey_type = 'student' THEN 1 ELSE 0 END) as student_responses"),
        db.raw("SUM(CASE WHEN survey_type = 'company' THEN 1 ELSE 0 END) as company_responses"),
        db.raw("SUM(CASE WHEN survey_type = 'university' THEN 1 ELSE 0 END) as university_responses"),
        db.raw("AVG(CASE WHEN is_complete THEN 100 ELSE 0 END) as completion_rate")
      )
      .first();

    // Get daily response timeline (last 30 days)
    const timelineData = await db('survey_responses')
      .select(
        db.raw('DATE(submitted_at) as date'),
        db.raw("SUM(CASE WHEN survey_type = 'student' THEN 1 ELSE 0 END) as students"),
        db.raw("SUM(CASE WHEN survey_type = 'company' THEN 1 ELSE 0 END) as companies"),
        db.raw("SUM(CASE WHEN survey_type = 'university' THEN 1 ELSE 0 END) as universities")
      )
      .where('submitted_at', '>=', db.raw('DATE_SUB(NOW(), INTERVAL 30 DAY)'))
      .groupBy(db.raw('DATE(submitted_at)'))
      .orderBy('date', 'asc');

    // Get response quality metrics
    const qualityMetrics = await db('survey_responses')
      .select(
        db.raw('is_complete'),
        db.raw('COUNT(*) as count')
      )
      .groupBy('is_complete');

    const responseQuality = [
      {
        category: 'Complete Responses',
        count: qualityMetrics.find(m => m.is_complete)?.count || 0,
        percentage: 0
      },
      {
        category: 'Incomplete Responses',
        count: qualityMetrics.find(m => !m.is_complete)?.count || 0,
        percentage: 0
      }
    ];

    // Calculate percentages
    const totalResponses = responseQuality.reduce((sum, item) => sum + item.count, 0);
    responseQuality.forEach(item => {
      item.percentage = totalResponses > 0 ? Math.round((item.count / totalResponses) * 100) : 0;
    });

    // Aggregate insights from student responses
    const studentResponses = await db('survey_responses')
      .where('survey_type', 'student')
      .select('responses');

    const studentInsights = aggregateStudentInsights(studentResponses);

    // Aggregate insights from company responses
    const companyResponses = await db('survey_responses')
      .where('survey_type', 'company')
      .select('responses');

    const companyInsights = aggregateCompanyInsights(companyResponses);

    res.json({
      overview: {
        totalResponses: parseInt(overviewStats.total_responses),
        studentResponses: parseInt(overviewStats.student_responses),
        companyResponses: parseInt(overviewStats.company_responses),
        universityResponses: parseInt(overviewStats.university_responses),
        completionRate: Math.round(parseFloat(overviewStats.completion_rate))
      },
      timeline: timelineData,
      responseQuality,
      insights: {
        studentPriorities: studentInsights.priorities,
        companyNeeds: companyInsights.needs,
        transparencyComfort: studentInsights.transparencyComfort
      }
    });
  } catch (error) {
    console.error('Error fetching survey analytics:', error);
    res.status(500).json({ error: 'Failed to fetch survey analytics' });
  }
});

// Get detailed responses for export (admin only)
router.get('/responses/:type?', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { type } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const db = req.app.get('db');
    let query = db('survey_responses');

    if (type && ['student', 'company', 'university'].includes(type)) {
      query = query.where('survey_type', type);
    }

    const responses = await query
      .select('id', 'survey_type', 'responses', 'metadata', 'submitted_at')
      .orderBy('submitted_at', 'desc')
      .limit(limit)
      .offset((page - 1) * limit);

    const totalCount = await query.clone().count('* as count').first();

    res.json({
      responses: responses.map(response => ({
        ...response,
        responses: JSON.parse(response.responses),
        metadata: JSON.parse(response.metadata || '{}')
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(totalCount.count),
        pages: Math.ceil(totalCount.count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching survey responses:', error);
    res.status(500).json({ error: 'Failed to fetch survey responses' });
  }
});

// Helper function to aggregate student insights
function aggregateStudentInsights(responses) {
  const priorities = {};
  const transparencyLevels = {};

  responses.forEach(row => {
    try {
      const data = JSON.parse(row.responses);

      // Aggregate platform features (assuming checkbox responses)
      if (data.platformFeatures && Array.isArray(data.platformFeatures)) {
        data.platformFeatures.forEach(feature => {
          priorities[feature] = (priorities[feature] || 0) + 1;
        });
      }

      // Aggregate transparency comfort levels
      if (data.transparencyComfort) {
        transparencyLevels[data.transparencyComfort] = (transparencyLevels[data.transparencyComfort] || 0) + 1;
      }
    } catch (error) {
      console.warn('Failed to parse survey response:', error);
    }
  });

  // Convert to arrays with percentages
  const totalResponses = responses.length;

  const priorityArray = Object.entries(priorities)
    .map(([feature, count]) => ({
      feature,
      percentage: Math.round((count / totalResponses) * 100)
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);

  const transparencyArray = Object.entries(transparencyLevels)
    .map(([level, count]) => ({
      level,
      percentage: Math.round((count / totalResponses) * 100)
    }));

  return {
    priorities: priorityArray,
    transparencyComfort: transparencyArray
  };
}

// Helper function to aggregate company insights
function aggregateCompanyInsights(responses) {
  const needs = {};

  responses.forEach(row => {
    try {
      const data = JSON.parse(row.responses);

      // Aggregate desired features
      if (data.desiredFeatures && Array.isArray(data.desiredFeatures)) {
        data.desiredFeatures.forEach(feature => {
          needs[feature] = (needs[feature] || 0) + 1;
        });
      }
    } catch (error) {
      console.warn('Failed to parse survey response:', error);
    }
  });

  // Convert to array with percentages
  const totalResponses = responses.length;

  const needsArray = Object.entries(needs)
    .map(([need, count]) => ({
      need,
      percentage: Math.round((count / totalResponses) * 100)
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);

  return {
    needs: needsArray
  };
}

// Send survey invitations (admin only)
router.post('/send-invitations', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { recipients, surveyType, message } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: 'Recipients list is required' });
    }

    // In a real app, this would integrate with an email service
    const invitations = recipients.map(email => ({
      id: uuidv4(),
      email,
      survey_type: surveyType,
      message,
      sent_at: new Date(),
      sent_by: req.user.id,
      status: 'sent'
    }));

    const db = req.app.get('db');
    await db('survey_invitations').insert(invitations);

    // Mock email sending
    console.log(`Would send ${invitations.length} survey invitations for ${surveyType} survey`);

    res.json({
      success: true,
      message: `Successfully sent ${invitations.length} survey invitations`,
      invitationsSent: invitations.length
    });
  } catch (error) {
    console.error('Error sending survey invitations:', error);
    res.status(500).json({ error: 'Failed to send survey invitations' });
  }
});

// Get survey invitation status (admin only)
router.get('/invitations', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const db = req.app.get('db');

    const invitations = await db('survey_invitations')
      .select('survey_type', 'status', db.raw('COUNT(*) as count'))
      .groupBy('survey_type', 'status')
      .orderBy('survey_type', 'status');

    res.json({ invitations });
  } catch (error) {
    console.error('Error fetching invitation status:', error);
    res.status(500).json({ error: 'Failed to fetch invitation status' });
  }
});

module.exports = router;