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

// --- Saved Search Alert Email ---

export async function sendSavedSearchAlertEmail(
  to: string,
  recruiterName: string,
  searchName: string,
  newMatches: number,
  totalCandidates: number
) {
  const dashboardUrl = `${BASE_URL}/dashboard/recruiter/saved-searches`
  const html = emailWrapper(`
    <h2>New candidates match "${escapeHtml(searchName)}"</h2>
    <p>Hi ${escapeHtml(recruiterName)},</p>
    <p>Your saved search has found <strong>${newMatches} new candidate${newMatches > 1 ? 's' : ''}</strong> since your last alert.</p>
    <div style="background: #F3F4F6; padding: 16px; border-radius: 8px; margin: 16px 0;">
      <p style="margin: 4px 0;"><strong>Search:</strong> ${escapeHtml(searchName)}</p>
      <p style="margin: 4px 0;"><strong>New matches:</strong> ${newMatches}</p>
      <p style="margin: 4px 0;"><strong>Total candidates:</strong> ${totalCandidates}</p>
    </div>
    <a href="${dashboardUrl}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
      View Candidates
    </a>
    <p style="color: #666; font-size: 14px;">
      You can manage your alert preferences in your dashboard settings.
    </p>
  `)
  await sendEmail(to, `${newMatches} new candidate${newMatches > 1 ? 's' : ''} match "${searchName}"`, html)
}

// --- Weekly Digest Email ---

export async function sendWeeklyDigestEmail(
  to: string,
  userName: string,
  role: string,
  stats: {
    profileViews?: number
    newMessages?: number
    newMatches?: number
    newApplications?: number
    savedSearchUpdates?: number
  }
) {
  const dashboardUrl = `${BASE_URL}/dashboard/${role.toLowerCase()}`

  const statsItems: string[] = []
  if (stats.profileViews) statsItems.push(`<li><strong>${stats.profileViews}</strong> profile view${stats.profileViews > 1 ? 's' : ''}</li>`)
  if (stats.newMessages) statsItems.push(`<li><strong>${stats.newMessages}</strong> new message${stats.newMessages > 1 ? 's' : ''}</li>`)
  if (stats.newMatches) statsItems.push(`<li><strong>${stats.newMatches}</strong> new candidate match${stats.newMatches > 1 ? 'es' : ''}</li>`)
  if (stats.newApplications) statsItems.push(`<li><strong>${stats.newApplications}</strong> new application${stats.newApplications > 1 ? 's' : ''}</li>`)
  if (stats.savedSearchUpdates) statsItems.push(`<li><strong>${stats.savedSearchUpdates}</strong> saved search update${stats.savedSearchUpdates > 1 ? 's' : ''}</li>`)

  const hasActivity = statsItems.length > 0

  const html = emailWrapper(`
    <h2>Your Weekly Summary</h2>
    <p>Hi ${escapeHtml(userName)},</p>
    ${hasActivity ? `
      <p>Here's what happened on InTransparency this week:</p>
      <div style="background: #F3F4F6; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <ul style="margin: 0; padding-left: 20px;">${statsItems.join('')}</ul>
      </div>
    ` : `
      <p>It's been a quiet week. Here are some things you can do to boost your visibility:</p>
      <ul>
        <li>Update your profile with recent achievements</li>
        <li>Upload a new project to your portfolio</li>
        <li>Share your profile link with your network</li>
      </ul>
    `}
    <a href="${dashboardUrl}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
      Go to Dashboard
    </a>
    <p style="color: #666; font-size: 12px;">
      To unsubscribe from weekly digests, update your notification settings in your dashboard.
    </p>
  `)
  await sendEmail(to, `Your InTransparency Weekly Summary`, html)
}

// --- Referral Notification Email ---

export async function sendReferralNotificationEmail(
  to: string,
  referrerName: string,
  referredName: string,
  status: 'registered' | 'completed'
) {
  const dashboardUrl = `${BASE_URL}/dashboard/student/referrals`

  const statusMessage = status === 'registered'
    ? `<strong>${escapeHtml(referredName)}</strong> has signed up using your referral link!`
    : `<strong>${escapeHtml(referredName)}</strong> has completed their profile! This referral now counts toward your rewards.`

  const html = emailWrapper(`
    <h2>Referral Update</h2>
    <p>Hi ${escapeHtml(referrerName)},</p>
    <p>${statusMessage}</p>
    <div style="background: #ECFDF5; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #A7F3D0;">
      <p style="margin: 0; color: #065F46;">
        ${status === 'completed' ? 'You\'re one step closer to your next reward tier!' : 'Encourage them to complete their profile to earn your reward.'}
      </p>
    </div>
    <a href="${dashboardUrl}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
      View Referral Dashboard
    </a>
  `)
  await sendEmail(to, `Referral update: ${referredName} ${status === 'registered' ? 'signed up' : 'completed their profile'}!`, html)
}

// --- Profile View Notification Email ---

export async function sendProfileViewAlertEmail(
  to: string,
  studentName: string,
  viewerCompany: string,
  viewCount: number
) {
  const dashboardUrl = `${BASE_URL}/dashboard/student`

  const html = emailWrapper(`
    <h2>Someone viewed your profile!</h2>
    <p>Hi ${escapeHtml(studentName)},</p>
    <p>A recruiter from <strong>${escapeHtml(viewerCompany)}</strong> viewed your profile on InTransparency.</p>
    <div style="background: #EFF6FF; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #BFDBFE;">
      <p style="margin: 0; color: #1E40AF;">
        Your profile has been viewed <strong>${viewCount}</strong> time${viewCount > 1 ? 's' : ''} this week.
      </p>
    </div>
    <p>Keep your profile up-to-date to attract more recruiters!</p>
    <a href="${dashboardUrl}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
      View Dashboard
    </a>
  `)
  await sendEmail(to, `A recruiter from ${viewerCompany} viewed your profile`, html)
}

// --- Endorsement Response Email (to student) ---

export async function sendEndorsementResponseEmail(
  to: string,
  studentName: string,
  professorName: string,
  projectTitle: string,
  status: 'VERIFIED' | 'DECLINED',
  projectId: string
) {
  const projectUrl = `${BASE_URL}/dashboard/student/projects`
  const isVerified = status === 'VERIFIED'

  const html = emailWrapper(`
    <h2>${isVerified ? 'Your endorsement request was approved!' : 'Endorsement Request Update'}</h2>
    <p>Hi ${escapeHtml(studentName)},</p>
    <p>
      Professor <strong>${escapeHtml(professorName)}</strong> has
      ${isVerified ? 'endorsed' : 'declined to endorse'} your project
      <strong>${escapeHtml(projectTitle)}</strong>.
    </p>
    ${isVerified ? `
      <div style="background: #ECFDF5; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #A7F3D0;">
        <p style="margin: 0; color: #065F46;">
          Great news! This endorsement is now visible on your profile and will boost your trust score with recruiters.
        </p>
      </div>
    ` : `
      <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #FECACA;">
        <p style="margin: 0; color: #991B1B;">
          Don't worry — you can request endorsements from other professors or update your project and try again.
        </p>
      </div>
    `}
    <a href="${projectUrl}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
      View Your Projects
    </a>
  `)
  await sendEmail(
    to,
    isVerified
      ? `Prof. ${professorName} endorsed your project "${projectTitle}"`
      : `Endorsement update for "${projectTitle}"`,
    html
  )
}

// --- Endorsement Expiry Reminder Email (to professor) ---

export async function sendEndorsementExpiryReminderEmail(
  to: string,
  professorName: string,
  studentName: string,
  projectTitle: string,
  verificationToken: string
) {
  const verifyUrl = `${BASE_URL}/endorsements/verify/${verificationToken}`

  const html = emailWrapper(`
    <h2>Reminder: Endorsement Request Expiring Soon</h2>
    <p>Dear Professor ${escapeHtml(professorName)},</p>
    <p>
      You have a pending endorsement request from <strong>${escapeHtml(studentName)}</strong>
      for their project <strong>${escapeHtml(projectTitle)}</strong> that will expire in 2 days.
    </p>
    <div style="background: #FFFBEB; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #FDE68A;">
      <p style="margin: 0; color: #92400E;">
        This link will expire soon. Please review and respond at your earliest convenience.
      </p>
    </div>
    <a href="${verifyUrl}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
      Review &amp; Endorse
    </a>
    <p style="color: #666; font-size: 12px;">Or copy this link: ${verifyUrl}</p>
  `)
  await sendEmail(to, `Reminder: ${studentName}'s endorsement request expires soon`, html)
}

// --- Endorsement Expiry Notice Email (to student) ---

export async function sendEndorsementExpiryNoticeEmail(
  to: string,
  studentName: string,
  professorName: string,
  projectTitle: string
) {
  const html = emailWrapper(`
    <h2>Endorsement Request Expiring Soon</h2>
    <p>Hi ${escapeHtml(studentName)},</p>
    <p>
      Your endorsement request to <strong>Professor ${escapeHtml(professorName)}</strong>
      for project <strong>${escapeHtml(projectTitle)}</strong> will expire in 2 days.
    </p>
    <p>If the professor hasn't responded yet, you may want to reach out to them directly as a reminder.</p>
    <a href="${BASE_URL}/dashboard/student/projects" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
      View Your Projects
    </a>
  `)
  await sendEmail(to, `Endorsement request for "${projectTitle}" expiring soon`, html)
}

// --- Shared email wrapper ---

function emailWrapper(content: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      ${content}
      <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
      <p style="color: #999; font-size: 12px;">
        InTransparency — Verified Student Profiles | University-to-Work Platform<br/>
        <a href="${BASE_URL}" style="color: #4F46E5;">intransparency.eu</a>
      </p>
    </div>
  `
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
