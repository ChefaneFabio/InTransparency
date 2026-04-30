import nodemailer from 'nodemailer'

const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD,
      },
    })
  : null

const FROM_EMAIL = process.env.SMTP_FROM || 'info@in-transparency.com'
const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'

async function sendEmail(to: string, subject: string, html: string, text?: string) {
  if (transporter) {
    await transporter.sendMail({ from: FROM_EMAIL, to, subject, html, ...(text ? { text } : {}) })
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
  const html = emailWrapper(`
    <h2 style="color: #0f172a; margin-bottom: 16px;">Verify your email for ${escapeHtml(universityName)}</h2>
    <p>You requested to connect your institutional email with InTransparency.</p>
    <p>Click the button below to verify your email address:</p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${verifyUrl}" style="display: inline-block; background: #4F46E5; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
        Verify Your Email
      </a>
    </div>
    <p style="color: #666; font-size: 14px;">
      If you didn't request this, you can safely ignore this email.
    </p>
    <p style="color: #666; font-size: 12px;">
      Or copy this link: ${verifyUrl}
    </p>
  `)
  const text = `Verify your email for ${universityName}\n\nYou requested to connect your institutional email with InTransparency.\n\nVerify your email: ${verifyUrl}\n\nIf you didn't request this, you can safely ignore this email.`
  await sendEmail(to, `Verify your email - ${universityName}`, html, text)
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
  const html = emailWrapper(`
    <h2 style="color: #0f172a; margin-bottom: 16px;">Endorsement Request from ${escapeHtml(studentName)}</h2>
    <p>Dear Professor ${escapeHtml(professorName)},</p>
    <p>Your student <strong>${escapeHtml(studentName)}</strong> (${escapeHtml(studentEmail)}) has requested your endorsement for their project on InTransparency.</p>
    ${messageBlock}
    <div style="background: #F3F4F6; padding: 16px; border-radius: 8px; margin: 16px 0;">
      <p style="margin: 4px 0;"><strong>Project:</strong> ${escapeHtml(projectTitle)}</p>
      <p style="margin: 4px 0;"><strong>Course:</strong> ${escapeHtml(courseName)} (${escapeHtml(courseCode)}) &mdash; ${escapeHtml(semester)}</p>
    </div>
    <p>To provide your endorsement (or decline), please click the button below:</p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${verifyUrl}" style="display: inline-block; background: #4F46E5; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
        Review &amp; Endorse
      </a>
    </div>
    <p style="color: #666; font-size: 14px;">This link expires in 7 days.</p>
    <p style="color: #666; font-size: 12px;">Or copy this link: ${verifyUrl}</p>
  `)
  const text = `Endorsement Request from ${studentName}\n\nDear Professor ${professorName},\n\nYour student ${studentName} (${studentEmail}) has requested your endorsement for their project on InTransparency.\n\nProject: ${projectTitle}\nCourse: ${courseName} (${courseCode}) - ${semester}\n\nReview & Endorse: ${verifyUrl}\n\nThis link expires in 7 days.`
  await sendEmail(to, `${studentName} is requesting your endorsement`, html, text)
}

export async function sendWelcomeEmail(
  to: string,
  tempPassword: string,
  universityName: string
) {
  const loginUrl = `${BASE_URL}/auth/signin`
  const html = emailWrapper(`
    <h2 style="color: #0f172a; margin-bottom: 16px;">Welcome to InTransparency!</h2>
    <p>${escapeHtml(universityName)} has invited you to join InTransparency, the platform that connects students with employers through verified profiles.</p>
    <p>Your account has been created. Here are your login details:</p>
    <div style="background: #F3F4F6; padding: 16px; border-radius: 8px; margin: 16px 0;">
      <p style="margin: 4px 0;"><strong>Email:</strong> ${escapeHtml(to)}</p>
      <p style="margin: 4px 0;"><strong>Temporary Password:</strong> ${escapeHtml(tempPassword)}</p>
    </div>
    <p><strong>Please change your password after your first login.</strong></p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${loginUrl}" style="display: inline-block; background: #4F46E5; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
        Log In Now
      </a>
    </div>
    <div style="background: #EFF6FF; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #BFDBFE;">
      <p style="margin: 0 0 8px 0; font-weight: 600; color: #1E40AF;">What you can do next:</p>
      <ul style="margin: 0; padding-left: 20px; color: #1E40AF;">
        <li>Complete your profile to be discoverable by recruiters</li>
        <li>Upload projects to build your verified portfolio</li>
        <li>Request endorsements from your professors</li>
        <li>Connect your institutional email for verification</li>
      </ul>
    </div>
  `)
  const text = `Welcome to InTransparency!\n\n${universityName} has invited you to join InTransparency.\n\nYour login details:\nEmail: ${to}\nTemporary Password: ${tempPassword}\n\nPlease change your password after your first login.\n\nLog in: ${loginUrl}\n\nWhat you can do next:\n- Complete your profile to be discoverable by recruiters\n- Upload projects to build your verified portfolio\n- Request endorsements from your professors\n- Connect your institutional email for verification`
  await sendEmail(to, `Welcome to InTransparency - ${universityName}`, html, text)
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
    <div style="text-align: center; margin: 24px 0;">
      <a href="${dashboardUrl}" style="display: inline-block; background: #4F46E5; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
        View Candidates
      </a>
    </div>
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
    <div style="text-align: center; margin: 24px 0;">
      <a href="${dashboardUrl}" style="display: inline-block; background: #4F46E5; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
        Go to Dashboard
      </a>
    </div>
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
    <div style="text-align: center; margin: 24px 0;">
      <a href="${dashboardUrl}" style="display: inline-block; background: #4F46E5; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
        View Referral Dashboard
      </a>
    </div>
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
    <div style="text-align: center; margin: 24px 0;">
      <a href="${dashboardUrl}" style="display: inline-block; background: #4F46E5; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
        View Dashboard
      </a>
    </div>
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
    <div style="text-align: center; margin: 24px 0;">
      <a href="${projectUrl}" style="display: inline-block; background: #4F46E5; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
        View Your Projects
      </a>
    </div>
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
    <div style="text-align: center; margin: 24px 0;">
      <a href="${verifyUrl}" style="display: inline-block; background: #4F46E5; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
        Review &amp; Endorse
      </a>
    </div>
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
    <div style="text-align: center; margin: 24px 0;">
      <a href="${BASE_URL}/dashboard/student/projects" style="display: inline-block; background: #4F46E5; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
        View Your Projects
      </a>
    </div>
  `)
  await sendEmail(to, `Endorsement request for "${projectTitle}" expiring soon`, html)
}

// --- Subscription Trial Ending Email ---

/**
 * Sent ~3 days before a Stripe trial converts to paid. Triggered by the
 * customer.subscription.trial_will_end webhook event.
 */
export async function sendTrialEndingEmail(
  to: string,
  recipientName: string,
  tierLabel: string,
  trialEndsAt: Date,
  manageUrl: string
) {
  const dateStr = trialEndsAt.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
  const html = emailWrapper(`
    <h2 style="color: #0f172a; margin-bottom: 16px;">Your ${escapeHtml(tierLabel)} trial ends ${escapeHtml(dateStr)}</h2>
    <p>Hi ${escapeHtml(recipientName)},</p>
    <p>
      Heads up — your free trial of <strong>${escapeHtml(tierLabel)}</strong> ends on
      <strong>${escapeHtml(dateStr)}</strong>. After that you'll be charged automatically using
      the payment method on file. No action needed if you want to keep the subscription.
    </p>
    <div style="background: #FFFBEB; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #FDE68A;">
      <p style="margin: 0; color: #92400E;">
        Want to cancel before the charge? You can do it in one click from your billing settings — no friction, no questions.
      </p>
    </div>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${manageUrl}" style="display: inline-block; background: #4F46E5; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
        Manage Subscription
      </a>
    </div>
  `)
  await sendEmail(to, `Your ${tierLabel} trial ends ${dateStr}`, html)
}

// --- Subscription Payment Failed Email ---

/**
 * Sent on the first invoice.payment_failed event. Stripe will retry payment
 * automatically over the following days; this email gives the customer a
 * heads-up so they can update their card before retries are exhausted.
 */
export async function sendPaymentFailedEmail(
  to: string,
  recipientName: string,
  tierLabel: string,
  amount: number,        // major units (euros)
  currency: string,      // 'eur'
  manageUrl: string
) {
  const amountStr = `${currency.toUpperCase() === 'EUR' ? '€' : currency.toUpperCase() + ' '}${amount.toFixed(2)}`
  const html = emailWrapper(`
    <h2 style="color: #0f172a; margin-bottom: 16px;">We couldn't charge your card</h2>
    <p>Hi ${escapeHtml(recipientName)},</p>
    <p>
      We tried to charge <strong>${escapeHtml(amountStr)}</strong> for your
      <strong>${escapeHtml(tierLabel)}</strong> subscription, but the card was declined.
      We'll retry automatically over the next few days.
    </p>
    <div style="background: #FEF2F2; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #FECACA;">
      <p style="margin: 0; color: #991B1B;">
        To avoid losing access, please update your payment method as soon as possible.
      </p>
    </div>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${manageUrl}" style="display: inline-block; background: #DC2626; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
        Update Payment Method
      </a>
    </div>
  `)
  await sendEmail(to, `Payment failed for your ${tierLabel} subscription`, html)
}

// --- Account verification email (sent on registration) ---

export async function sendAccountVerificationEmail(
  to: string,
  rawToken: string,
  firstName: string,
  locale: 'en' | 'it' = 'en'
) {
  const verifyUrl = `${BASE_URL}/${locale}/auth/verify-email?token=${rawToken}`
  const isIt = locale === 'it'

  const subject = isIt
    ? 'Conferma il tuo indirizzo email — InTransparency'
    : 'Verify your email address — InTransparency'

  const heading = isIt
    ? 'Conferma il tuo indirizzo email'
    : 'Verify your email address'

  const greeting = isIt
    ? `Ciao ${escapeHtml(firstName)},`
    : `Hi ${escapeHtml(firstName)},`

  const lede = isIt
    ? 'Grazie per esserti registrato a InTransparency. Per attivare l\'account, conferma il tuo indirizzo email cliccando sul pulsante qui sotto.'
    : 'Thanks for signing up to InTransparency. To activate your account, verify your email address by clicking the button below.'

  const ctaLabel = isIt ? 'Conferma email' : 'Verify email'
  const expiry = isIt
    ? 'Il link scade tra 24 ore.'
    : 'This link expires in 24 hours.'
  const fallback = isIt
    ? 'Se il pulsante non funziona, copia e incolla questo link nel browser:'
    : "If the button doesn't work, copy and paste this link into your browser:"
  const ignore = isIt
    ? "Se non hai creato un account, puoi ignorare questa email."
    : "If you didn't create an account, you can safely ignore this email."

  const html = emailWrapper(`
    <h2 style="color: #0f172a; margin-bottom: 16px;">${heading}</h2>
    <p>${greeting}</p>
    <p>${lede}</p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${verifyUrl}" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
        ${ctaLabel}
      </a>
    </div>
    <p style="color: #64748b; font-size: 13px; text-align: center;">${expiry}</p>
    <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 16px 0;" />
    <p style="color: #64748b; font-size: 13px;">${fallback}</p>
    <p style="color: #64748b; font-size: 12px; word-break: break-all;">${verifyUrl}</p>
    <p style="color: #999; font-size: 12px; margin-top: 16px;">${ignore}</p>
  `)

  const text = `${heading}\n\n${greeting}\n\n${lede}\n\n${verifyUrl}\n\n${expiry}\n\n${ignore}`

  await sendEmail(to, subject, html, text)
}

// --- Shared email wrapper ---

function emailWrapper(content: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
          <tr>
            <td style="vertical-align: middle; padding-right: 12px;">
              <img src="${BASE_URL}/favicon.png" alt="InTransparency" width="40" height="40" style="display: block;" />
            </td>
            <td style="vertical-align: middle;">
              <span style="font-size: 24px; font-weight: 700; color: #0f172a; letter-spacing: -0.5px;">In<span style="color: #2563eb;">Transparency</span></span>
            </td>
          </tr>
        </table>
      </div>
      ${content}
      <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
      <p style="color: #999; font-size: 12px;">
        InTransparency — Verified Student Profiles | University-to-Work Platform<br/>
        <a href="${BASE_URL}" style="color: #4F46E5;">in-transparency.com</a>
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
