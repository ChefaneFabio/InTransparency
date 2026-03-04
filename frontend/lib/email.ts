import nodemailer from 'nodemailer'

const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null

const FROM_EMAIL = process.env.SMTP_FROM || 'students@intransparency.it'
const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'

async function sendEmail(to: string, subject: string, html: string) {
  if (transporter) {
    await transporter.sendMail({ from: FROM_EMAIL, to, subject, html })
  } else {
    console.log(`[EMAIL STUB] To: ${to} | Subject: ${subject}`)
    console.log(`[EMAIL STUB] Body preview: ${html.slice(0, 200)}...`)
  }
}

export async function sendVerificationEmail(
  to: string,
  token: string,
  universityName: string
) {
  const verifyUrl = `${BASE_URL}/api/user/university-connection/verify?token=${token}`
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Verify your email for ${universityName}</h2>
      <p>You requested to connect your institutional email with InTransparency.</p>
      <p>Click the button below to verify your email address:</p>
      <a href="${verifyUrl}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
        Verify Email
      </a>
      <p style="color: #666; font-size: 14px;">
        If you didn't request this, you can safely ignore this email.
      </p>
      <p style="color: #666; font-size: 12px;">
        Or copy this link: ${verifyUrl}
      </p>
    </div>
  `
  await sendEmail(to, `Verify your email - ${universityName}`, html)
}

export async function sendEndorsementRequestEmail(
  to: string,
  professorName: string,
  studentName: string,
  studentEmail: string,
  projectTitle: string,
  courseName: string,
  courseCode: string,
  semester: string,
  verificationToken: string,
  personalMessage?: string
) {
  const verifyUrl = `${BASE_URL}/endorsements/verify/${verificationToken}`
  const messageBlock = personalMessage
    ? `<p style="background: #F3F4F6; padding: 12px; border-radius: 8px; font-style: italic;">"${personalMessage}"</p>`
    : ''
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Endorsement Request from ${studentName}</h2>
      <p>Dear Professor ${professorName},</p>
      <p>Your student <strong>${studentName}</strong> (${studentEmail}) has requested your endorsement for their project on InTransparency.</p>
      ${messageBlock}
      <div style="background: #F3F4F6; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p style="margin: 4px 0;"><strong>Project:</strong> ${projectTitle}</p>
        <p style="margin: 4px 0;"><strong>Course:</strong> ${courseName} (${courseCode}) — ${semester}</p>
      </div>
      <p>To provide your endorsement (or decline), please click the button below:</p>
      <a href="${verifyUrl}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
        Review &amp; Endorse
      </a>
      <p style="color: #666; font-size: 14px;">This link expires in 7 days.</p>
      <p style="color: #666; font-size: 12px;">Or copy this link: ${verifyUrl}</p>
      <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
      <p style="color: #999; font-size: 12px;">
        InTransparency is a verified talent marketplace connecting students with recruiters.
        If you didn't expect this email, you can safely ignore it.
      </p>
    </div>
  `
  await sendEmail(to, `${studentName} is requesting your endorsement`, html)
}

export async function sendWelcomeEmail(
  to: string,
  tempPassword: string,
  universityName: string
) {
  const loginUrl = `${BASE_URL}/auth/signin`
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to InTransparency!</h2>
      <p>${universityName} has invited you to join InTransparency, the platform that connects students with employers.</p>
      <p>Your account has been created. Here are your login details:</p>
      <div style="background: #F3F4F6; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p style="margin: 4px 0;"><strong>Email:</strong> ${to}</p>
        <p style="margin: 4px 0;"><strong>Temporary Password:</strong> ${tempPassword}</p>
      </div>
      <p>Please change your password after your first login.</p>
      <a href="${loginUrl}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
        Log In Now
      </a>
      <p style="color: #666; font-size: 14px;">
        Complete your profile to be discoverable by 500+ companies.
      </p>
    </div>
  `
  await sendEmail(to, `Welcome to InTransparency - ${universityName}`, html)
}
