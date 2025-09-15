const express = require('express')
const router = express.Router()
const { db } = require('../config/database')
const { v4: uuidv4 } = require('uuid')

// Validation Endpoints for MVP Testing

// Track email signups from landing page
router.post('/signup', async (req, res) => {
  try {
    const { email, userType, source, referrer } = req.body
    
    // Check if email already exists
    const existing = await db('validation_signups')
      .where({ email })
      .first()
    
    if (existing) {
      return res.status(200).json({ 
        message: 'Already signed up',
        alreadyExists: true 
      })
    }
    
    // Store signup
    const signup = {
      id: uuidv4(),
      email,
      user_type: userType,
      source: source || 'organic',
      referrer: referrer || null,
      created_at: new Date(),
      conversion_status: 'pending',
      ab_test_variant: req.headers['x-ab-variant'] || null
    }
    
    await db('validation_signups').insert(signup)
    
    // Track metrics
    await updateValidationMetrics('signups', userType)
    
    res.status(201).json({ 
      message: 'Signup successful',
      position: await getWaitlistPosition(email)
    })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ error: 'Failed to process signup' })
  }
})

// Track pre-orders
router.post('/preorder', async (req, res) => {
  try {
    const { 
      email, 
      plan, 
      amount, 
      paymentMethod,
      companyName,
      companySize 
    } = req.body
    
    const preorder = {
      id: uuidv4(),
      email,
      plan,
      amount,
      payment_method: paymentMethod,
      company_name: companyName,
      company_size: companySize,
      status: 'reserved', // Not charged yet
      created_at: new Date()
    }
    
    await db('validation_preorders').insert(preorder)
    
    // Update metrics
    await updateValidationMetrics('preorders', plan)
    
    res.status(201).json({ 
      message: 'Pre-order reserved successfully',
      orderId: preorder.id,
      estimatedLaunch: '8 weeks'
    })
  } catch (error) {
    console.error('Pre-order error:', error)
    res.status(500).json({ error: 'Failed to process pre-order' })
  }
})

// Track interview insights
router.post('/interview', async (req, res) => {
  try {
    const { 
      intervieweeType,
      insights,
      willingToPay,
      pricePoint,
      mainPainPoints,
      mustHaveFeatures
    } = req.body
    
    const interview = {
      id: uuidv4(),
      interviewee_type: intervieweeType,
      insights: JSON.stringify(insights),
      willing_to_pay: willingToPay,
      price_point: pricePoint,
      pain_points: JSON.stringify(mainPainPoints),
      must_have_features: JSON.stringify(mustHaveFeatures),
      created_at: new Date()
    }
    
    await db('validation_interviews').insert(interview)
    
    res.status(201).json({ 
      message: 'Interview insights recorded',
      interviewId: interview.id
    })
  } catch (error) {
    console.error('Interview error:', error)
    res.status(500).json({ error: 'Failed to record interview' })
  }
})

// Track ad campaign performance
router.post('/campaign', async (req, res) => {
  try {
    const {
      campaignId,
      impressions,
      clicks,
      conversions,
      spend,
      date
    } = req.body
    
    const campaign = {
      id: uuidv4(),
      campaign_id: campaignId,
      impressions,
      clicks,
      conversions,
      spend,
      ctr: clicks / impressions,
      conversion_rate: conversions / clicks,
      cost_per_conversion: spend / conversions,
      date: date || new Date(),
      created_at: new Date()
    }
    
    await db('validation_campaigns').insert(campaign)
    
    res.status(201).json({ 
      message: 'Campaign data recorded',
      metrics: {
        ctr: campaign.ctr,
        conversionRate: campaign.conversion_rate,
        costPerConversion: campaign.cost_per_conversion
      }
    })
  } catch (error) {
    console.error('Campaign error:', error)
    res.status(500).json({ error: 'Failed to record campaign data' })
  }
})

// Get validation metrics dashboard
router.get('/metrics', async (req, res) => {
  try {
    // Get signup metrics
    const signups = await db('validation_signups')
      .select('user_type')
      .count('* as count')
      .groupBy('user_type')
    
    const totalSignups = signups.reduce((sum, s) => sum + parseInt(s.count), 0)
    
    // Get pre-order metrics
    const preorders = await db('validation_preorders')
      .select('plan')
      .sum('amount as revenue')
      .count('* as count')
      .groupBy('plan')
    
    const totalRevenue = preorders.reduce((sum, p) => sum + parseFloat(p.revenue || 0), 0)
    const totalOrders = preorders.reduce((sum, p) => sum + parseInt(p.count), 0)
    
    // Get interview insights
    const interviews = await db('validation_interviews')
      .select('interviewee_type')
      .avg('willing_to_pay as willing_to_pay_rate')
      .avg('price_point as avg_price_point')
      .count('* as count')
      .groupBy('interviewee_type')
    
    // Get campaign performance
    const campaigns = await db('validation_campaigns')
      .select('campaign_id')
      .avg('ctr as avg_ctr')
      .avg('conversion_rate as avg_conversion_rate')
      .avg('cost_per_conversion as avg_cpc')
      .sum('spend as total_spend')
      .sum('conversions as total_conversions')
      .groupBy('campaign_id')
    
    res.json({
      signups: {
        total: totalSignups,
        breakdown: signups.reduce((acc, s) => {
          acc[s.user_type] = parseInt(s.count)
          return acc
        }, {})
      },
      preorders: {
        totalRevenue,
        totalOrders,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        breakdown: preorders
      },
      interviews: {
        total: interviews.reduce((sum, i) => sum + parseInt(i.count), 0),
        insights: interviews
      },
      campaigns: {
        performance: campaigns,
        totalSpend: campaigns.reduce((sum, c) => sum + parseFloat(c.total_spend || 0), 0),
        totalConversions: campaigns.reduce((sum, c) => sum + parseInt(c.total_conversions || 0), 0)
      },
      validationScore: calculateValidationScore({
        signups: totalSignups,
        revenue: totalRevenue,
        interviews: interviews.length
      })
    })
  } catch (error) {
    console.error('Metrics error:', error)
    res.status(500).json({ error: 'Failed to fetch metrics' })
  }
})

// A/B test tracking
router.post('/abtest', async (req, res) => {
  try {
    const { variant, event, value } = req.body
    
    const test = {
      id: uuidv4(),
      variant,
      event,
      value: value || null,
      session_id: req.sessionID || null,
      created_at: new Date()
    }
    
    await db('validation_abtests').insert(test)
    
    res.status(201).json({ message: 'A/B test event recorded' })
  } catch (error) {
    console.error('A/B test error:', error)
    res.status(500).json({ error: 'Failed to record A/B test' })
  }
})

// Helper functions
async function updateValidationMetrics(type, subtype) {
  try {
    const existing = await db('validation_metrics')
      .where({ metric_type: type, metric_subtype: subtype })
      .first()
    
    if (existing) {
      await db('validation_metrics')
        .where({ id: existing.id })
        .update({
          count: existing.count + 1,
          updated_at: new Date()
        })
    } else {
      await db('validation_metrics').insert({
        id: uuidv4(),
        metric_type: type,
        metric_subtype: subtype,
        count: 1,
        created_at: new Date(),
        updated_at: new Date()
      })
    }
  } catch (error) {
    console.error('Failed to update metrics:', error)
  }
}

async function getWaitlistPosition(email) {
  try {
    const position = await db('validation_signups')
      .where('created_at', '<', db('validation_signups').where({ email }).select('created_at'))
      .count('* as position')
    
    return parseInt(position[0].position) + 1
  } catch (error) {
    return null
  }
}

function calculateValidationScore(metrics) {
  // Simple validation score based on key metrics
  let score = 0
  
  // Signups (max 30 points)
  if (metrics.signups > 100) score += 10
  if (metrics.signups > 500) score += 10
  if (metrics.signups > 1000) score += 10
  
  // Revenue (max 40 points)
  if (metrics.revenue > 1000) score += 10
  if (metrics.revenue > 5000) score += 15
  if (metrics.revenue > 10000) score += 15
  
  // Interviews (max 30 points)
  if (metrics.interviews > 10) score += 10
  if (metrics.interviews > 25) score += 10
  if (metrics.interviews > 50) score += 10
  
  return {
    score,
    maxScore: 100,
    percentage: score,
    status: score >= 70 ? 'validated' : score >= 40 ? 'promising' : 'needs-more-data'
  }
}

module.exports = router