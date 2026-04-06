/**
 * Email routes — handles contact forms and transactional emails.
 * Runs on Render for reliable SMTP delivery without serverless timeouts.
 */

const express = require('express')
const nodemailer = require('nodemailer')

const router = express.Router()

let _transporter = null

function getTransporter() {
  if (!_transporter && process.env.SMTP_HOST) {
    _transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  }
  return _transporter
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * POST /api/email/contact
 * Sends a contact form submission.
 */
router.post('/contact', async (req, res) => {
  try {
    const { name, email, company, role, subject, message, priority } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' })
    }

    const recipientEmail = process.env.CONTACT_EMAIL || 'info@in-transparency.com'
    const transporter = getTransporter()

    if (transporter) {
      await transporter.sendMail({
        from: `"InTransparency" <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        replyTo: email,
        subject: `[Contact] ${subject || 'New message'} — ${name}`,
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#f8fafc;border-radius:12px;padding:24px;margin-bottom:16px;">
              <h2 style="margin:0 0 16px;color:#1e293b;">New Contact Form</h2>
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 0;color:#64748b;width:120px;">Name</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(name)}</td></tr>
                <tr><td style="padding:8px 0;color:#64748b;">Email</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#3b82f6;">${escapeHtml(email)}</a></td></tr>
                ${company ? `<tr><td style="padding:8px 0;color:#64748b;">Company</td><td style="padding:8px 0;">${escapeHtml(company)}</td></tr>` : ''}
                ${role ? `<tr><td style="padding:8px 0;color:#64748b;">Role</td><td style="padding:8px 0;">${escapeHtml(role)}</td></tr>` : ''}
                ${subject ? `<tr><td style="padding:8px 0;color:#64748b;">Subject</td><td style="padding:8px 0;">${escapeHtml(subject)}</td></tr>` : ''}
                <tr><td style="padding:8px 0;color:#64748b;">Priority</td><td style="padding:8px 0;">${escapeHtml(priority || 'medium')}</td></tr>
              </table>
            </div>
            <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;">
              <h3 style="margin:0 0 12px;color:#1e293b;font-size:14px;">Message</h3>
              <p style="margin:0;color:#475569;line-height:1.6;white-space:pre-wrap;">${escapeHtml(message)}</p>
            </div>
            <p style="color:#94a3b8;font-size:12px;margin-top:16px;text-align:center;">
              Sent via InTransparency Contact Form
            </p>
          </div>
        `,
      })

      console.log(`[EMAIL] Contact form sent: ${name} <${email}> — ${subject || 'no subject'}`)
      return res.json({ success: true, method: 'smtp' })
    }

    // No SMTP configured — log and return success
    console.log(`[CONTACT] No SMTP. From: ${name} <${email}> | Subject: ${subject} | Company: ${company} | Message: ${message.slice(0, 200)}`)
    res.json({ success: true, method: 'logged' })
  } catch (error) {
    console.error('Contact email error:', error.message)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

/**
 * POST /api/email/notify
 * Sends a notification email (used by cross-segment triggers).
 */
router.post('/notify', async (req, res) => {
  try {
    const { to, subject, html, text } = req.body

    if (!to || !subject) {
      return res.status(400).json({ error: 'to and subject required' })
    }

    const transporter = getTransporter()
    if (!transporter) {
      console.log(`[EMAIL] No SMTP. Would send to: ${to} — ${subject}`)
      return res.json({ success: true, method: 'logged' })
    }

    await transporter.sendMail({
      from: `"InTransparency" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: html || undefined,
      text: text || undefined,
    })

    console.log(`[EMAIL] Notification sent to: ${to} — ${subject}`)
    res.json({ success: true, method: 'smtp' })
  } catch (error) {
    console.error('Notify email error:', error.message)
    res.status(500).json({ error: 'Failed to send notification' })
  }
})

/**
 * GET /api/email/health
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'email',
    smtpConfigured: !!(process.env.SMTP_HOST && process.env.SMTP_USER),
    contactEmail: process.env.CONTACT_EMAIL || 'info@in-transparency.com',
  })
})

module.exports = router
