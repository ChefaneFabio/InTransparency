import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 10

/**
 * POST /api/contact
 * Sends a contact form submission via email.
 */
export async function POST(request: NextRequest) {
  try {
    const { name, email, company, role, subject, message, priority } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const recipientEmail = 'info@in-transparency.com'

    // Try nodemailer if SMTP is configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      const nodemailer = await import('nodemailer')
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      })

      await transporter.sendMail({
        from: `"InTransparency Contact" <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        replyTo: email,
        subject: `[Contact Form] ${subject || 'New message'} — ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <table style="border-collapse:collapse;width:100%;max-width:600px;">
            <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
            ${company ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Company</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(company)}</td></tr>` : ''}
            ${role ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Role</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(role)}</td></tr>` : ''}
            ${subject ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Subject</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(subject)}</td></tr>` : ''}
            <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Priority</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(priority || 'medium')}</td></tr>
          </table>
          <h3 style="margin-top:20px;">Message</h3>
          <div style="padding:15px;background:#f9fafb;border-radius:8px;white-space:pre-wrap;">${escapeHtml(message)}</div>
        `,
      })

      return NextResponse.json({ success: true })
    }

    // Fallback: store in database as notification
    try {
      const prisma = (await import('@/lib/prisma')).default
      await prisma.notification.create({
        data: {
          userId: 'system',
          type: 'GENERAL',
          title: `Contact: ${subject || 'New message'} from ${name}`,
          body: `${email} | ${company || 'No company'} | ${message.slice(0, 200)}`,
          link: `mailto:${email}`,
        },
      }).catch(() => {})
    } catch { /* silent */ }

    // Log for visibility
    console.log(`[CONTACT FORM] From: ${name} <${email}> | Subject: ${subject} | Company: ${company}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
