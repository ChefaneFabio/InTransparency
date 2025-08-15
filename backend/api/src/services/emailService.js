const nodemailer = require('nodemailer')
const handlebars = require('handlebars')
const fs = require('fs').promises
const path = require('path')

class EmailService {
  constructor() {
    this.transporter = null
    this.templates = new Map()
    this.initializeTransporter()
    this.loadTemplates()
  }

  // Initialize email transporter
  initializeTransporter() {
    const emailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    }

    // Development fallback - use Ethereal Email for testing
    if (process.env.NODE_ENV === 'development' && !process.env.SMTP_USER) {
      console.warn('No SMTP credentials found. Using Ethereal Email for development.')
      this.createTestAccount()
    } else {
      this.transporter = nodemailer.createTransporter(emailConfig)
    }
  }

  // Create test email account for development
  async createTestAccount() {
    try {
      const testAccount = await nodemailer.createTestAccount()
      
      this.transporter = nodemailer.createTransporter({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      })

      console.log('Test email account created:')
      console.log('User:', testAccount.user)
      console.log('Pass:', testAccount.pass)
    } catch (error) {
      console.error('Failed to create test email account:', error)
    }
  }

  // Load email templates
  async loadTemplates() {
    try {
      const templatesDir = path.join(__dirname, '../templates/email')
      
      // Create templates directory if it doesn't exist
      try {
        await fs.access(templatesDir)
      } catch {
        await fs.mkdir(templatesDir, { recursive: true })
        await this.createDefaultTemplates(templatesDir)
      }

      const templateFiles = await fs.readdir(templatesDir)
      
      for (const file of templateFiles) {
        if (file.endsWith('.hbs') || file.endsWith('.handlebars')) {
          const templateName = path.basename(file, path.extname(file))
          const templateContent = await fs.readFile(path.join(templatesDir, file), 'utf8')
          this.templates.set(templateName, handlebars.compile(templateContent))
        }
      }

      console.log(`Loaded ${this.templates.size} email templates`)
    } catch (error) {
      console.error('Failed to load email templates:', error)
      this.createFallbackTemplates()
    }
  }

  // Create default email templates
  async createDefaultTemplates(templatesDir) {
    const templates = {
      'welcome.hbs': `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to InTransparency</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to InTransparency</h1>
        </div>
        <div class="content">
            <h2>Hi {{firstName}}!</h2>
            <p>Welcome to InTransparency, the platform that connects talented students with amazing opportunities.</p>
            <p>To get started, please verify your email address by clicking the button below:</p>
            <a href="{{verificationLink}}" class="button">Verify Email Address</a>
            <p>If you didn't create an account, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 InTransparency. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,

      'password-reset.hbs': `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Password Reset - InTransparency</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .warning { background: #fef2f2; border-left: 4px solid #dc2626; padding: 10px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <h2>Hi {{firstName}}!</h2>
            <p>We received a request to reset your password for your InTransparency account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="{{resetLink}}" class="button">Reset Password</a>
            <div class="warning">
                <p><strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request this reset, please ignore this email and your password will remain unchanged.</p>
            </div>
        </div>
        <div class="footer">
            <p>&copy; 2024 InTransparency. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,

      'notification.hbs': `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{title}} - InTransparency</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{title}}</h1>
        </div>
        <div class="content">
            <h2>Hi {{firstName}}!</h2>
            <p>{{message}}</p>
            {{#if actionData.link}}
            <a href="{{actionData.link}}" class="button">{{actionData.buttonText}}</a>
            {{/if}}
        </div>
        <div class="footer">
            <p>&copy; 2024 InTransparency. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,

      'job-application.hbs': `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Job Application - InTransparency</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #7c3aed; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .info-box { background: white; border: 1px solid #e5e7eb; padding: 15px; margin: 15px 0; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Job Application</h1>
        </div>
        <div class="content">
            <h2>Hi {{recruiterName}}!</h2>
            <p>You have received a new application for your job posting.</p>
            <div class="info-box">
                <h3>Job: {{jobTitle}}</h3>
                <p><strong>Applicant:</strong> {{applicantName}}</p>
                <p><strong>University:</strong> {{applicantUniversity}}</p>
                <p><strong>Applied:</strong> {{applicationDate}}</p>
            </div>
            <a href="{{applicationLink}}" class="button">View Application</a>
        </div>
        <div class="footer">
            <p>&copy; 2024 InTransparency. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`
    }

    for (const [filename, content] of Object.entries(templates)) {
      await fs.writeFile(path.join(templatesDir, filename), content.trim())
    }
  }

  // Create fallback templates in memory
  createFallbackTemplates() {
    const fallbackTemplates = {
      welcome: handlebars.compile(`
        <h1>Welcome to InTransparency, {{firstName}}!</h1>
        <p>Please verify your email: <a href="{{verificationLink}}">Verify Email</a></p>
      `),
      'password-reset': handlebars.compile(`
        <h1>Password Reset Request</h1>
        <p>Hi {{firstName}}, click here to reset your password: <a href="{{resetLink}}">Reset Password</a></p>
      `),
      notification: handlebars.compile(`
        <h1>{{title}}</h1>
        <p>Hi {{firstName}}, {{message}}</p>
      `)
    }

    for (const [name, template] of Object.entries(fallbackTemplates)) {
      this.templates.set(name, template)
    }
  }

  // Send email
  async sendEmail({ to, subject, template, data, attachments = [] }) {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized')
      }

      // Get template
      const templateFunction = this.templates.get(template)
      if (!templateFunction) {
        throw new Error(`Template '${template}' not found`)
      }

      // Compile template with data
      const html = templateFunction(data)

      // Prepare email options
      const mailOptions = {
        from: `"InTransparency" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        attachments
      }

      // Send email
      const result = await this.transporter.sendMail(mailOptions)

      // Log success
      console.log('Email sent successfully:', {
        to,
        subject,
        messageId: result.messageId
      })

      // Log preview URL for development
      if (process.env.NODE_ENV === 'development') {
        console.log('Preview URL:', nodemailer.getTestMessageUrl(result))
      }

      return {
        success: true,
        messageId: result.messageId,
        previewUrl: process.env.NODE_ENV === 'development' ? nodemailer.getTestMessageUrl(result) : null
      }
    } catch (error) {
      console.error('Email send error:', error)
      throw error
    }
  }

  // Send email with plain text fallback
  async sendEmailWithFallback({ to, subject, template, data, textContent }) {
    try {
      const result = await this.sendEmail({ to, subject, template, data })
      return result
    } catch (error) {
      // If template fails, send plain text email
      console.warn('Template email failed, sending plain text fallback')
      
      const mailOptions = {
        from: `"InTransparency" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to,
        subject,
        text: textContent || `Hi there!\n\n${subject}\n\nBest regards,\nThe InTransparency Team`
      }

      const result = await this.transporter.sendMail(mailOptions)
      return {
        success: true,
        messageId: result.messageId,
        fallback: true
      }
    }
  }

  // Send bulk emails
  async sendBulkEmails(emails) {
    const results = []
    const batchSize = 10 // Send in batches to avoid overwhelming the SMTP server

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize)
      
      const batchPromises = batch.map(async (email) => {
        try {
          const result = await this.sendEmail(email)
          return { ...email, success: true, result }
        } catch (error) {
          return { ...email, success: false, error: error.message }
        }
      })

      const batchResults = await Promise.allSettled(batchPromises)
      results.push(...batchResults.map(r => r.value || { success: false, error: r.reason }))

      // Add delay between batches
      if (i + batchSize < emails.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    return results
  }

  // Test email configuration
  async testConnection() {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized')
      }

      await this.transporter.verify()
      console.log('Email service connection successful')
      return { success: true }
    } catch (error) {
      console.error('Email service connection failed:', error)
      return { success: false, error: error.message }
    }
  }

  // Get email statistics
  getStats() {
    return {
      templatesLoaded: this.templates.size,
      transporterStatus: this.transporter ? 'initialized' : 'not initialized',
      environment: process.env.NODE_ENV
    }
  }
}

// Create singleton instance
const emailService = new EmailService()

module.exports = {
  sendEmail: emailService.sendEmail.bind(emailService),
  sendEmailWithFallback: emailService.sendEmailWithFallback.bind(emailService),
  sendBulkEmails: emailService.sendBulkEmails.bind(emailService),
  testConnection: emailService.testConnection.bind(emailService),
  getStats: emailService.getStats.bind(emailService)
}