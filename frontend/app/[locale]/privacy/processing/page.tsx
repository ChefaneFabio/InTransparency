import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import type { Metadata } from 'next'

/**
 * /privacy/processing
 *
 * GDPR Art. 13/14 detail page: full sub-processor list, retention windows,
 * cross-border transfer safeguards (SCC), legal bases per processing
 * activity. This is the page you cite in a DPA.
 *
 * Authoritative source: keep updated when sub-processors change.
 * Last reviewed: 2026-05-05.
 */

export const metadata: Metadata = {
  title: 'Data Processing Details · InTransparency',
  description:
    'Sub-processors, retention periods, cross-border transfer safeguards, and legal bases for personal data processed by InTransparency.',
}

const SUB_PROCESSORS = [
  {
    name: 'Vercel Inc.',
    role: 'Application hosting + CDN + Web Analytics',
    location: 'EU (Frankfurt) + US (failover)',
    dataTypes: 'Request metadata, IP addresses, page views',
    safeguards: 'EU-US DPF + SCC',
    dpa: 'https://vercel.com/legal/dpa',
  },
  {
    name: 'Neon Inc.',
    role: 'Managed Postgres database (primary data store)',
    location: 'EU (Frankfurt)',
    dataTypes: 'All user-submitted data',
    safeguards: 'EU region only · AES-256 at rest · TLS in transit',
    dpa: 'https://neon.tech/legal/dpa',
  },
  {
    name: 'Cloudflare, Inc.',
    role: 'R2 object storage (uploaded files), Turnstile (bot protection)',
    location: 'EU + global edge',
    dataTypes: 'Uploaded documents, project files, R2 access logs',
    safeguards: 'EU-US DPF + SCC',
    dpa: 'https://www.cloudflare.com/cloudflare-customer-dpa/',
  },
  {
    name: 'Anthropic, PBC',
    role: 'Claude API (AI matching, parsing, project analysis)',
    location: 'US',
    dataTypes:
      'Project descriptions, search queries, profile text passed for AI processing',
    safeguards:
      'SCC · Zero data retention contractual flag · No use for model training',
    dpa: 'https://www.anthropic.com/legal/dpa',
  },
  {
    name: 'Resend Inc.',
    role: 'Transactional email (verification, notifications, magic links)',
    location: 'US',
    dataTypes: 'Email address, message content of system emails',
    safeguards: 'EU-US DPF + SCC',
    dpa: 'https://resend.com/legal/dpa',
  },
  {
    name: 'Stripe Inc.',
    role: 'Payment processing for Premium subscriptions',
    location: 'US (with EU representative)',
    dataTypes: 'Email, billing address, payment method (tokenized)',
    safeguards:
      'PCI-DSS Level 1 · EU-US DPF + SCC · Stripe is an independent controller for fraud prevention',
    dpa: 'https://stripe.com/legal/dpa',
  },
]

const RETENTION = [
  {
    category: 'Active account profile + projects',
    period: 'For the lifetime of the account',
    legalBasis: 'Contract performance (Art. 6.1.b GDPR)',
  },
  {
    category: 'Account after deletion request',
    period: 'Erased within 30 days',
    legalBasis: 'Right to erasure (Art. 17 GDPR)',
  },
  {
    category: 'AuditLog (compliance + AI traceability)',
    period: '7 years from event',
    legalBasis: 'Legal obligation (Art. 5.2 + AI Act Art. 12)',
  },
  {
    category: 'Behavior analytics (page views, clicks, scroll depth)',
    period: '90 days then aggregated · only with analytics consent',
    legalBasis: 'Consent (Art. 6.1.a GDPR)',
  },
  {
    category: 'Profile views (recruiter activity log shown to students)',
    period: '180 days',
    legalBasis: 'Legitimate interest (transparency to data subject)',
  },
  {
    category: 'Email logs (Resend bounce/delivery)',
    period: '30 days',
    legalBasis: 'Legitimate interest (deliverability monitoring)',
  },
  {
    category: 'Stripe billing records',
    period: '10 years',
    legalBasis: 'Legal obligation (Italian fiscal law DPR 600/1973)',
  },
  {
    category: 'Backups (Neon point-in-time recovery)',
    period: '7 days',
    legalBasis: 'Legitimate interest (disaster recovery)',
  },
  {
    category: 'Authentication tokens (NextAuth JWT)',
    period: '30 days from last activity, then revoked',
    legalBasis: 'Contract performance',
  },
]

const LEGAL_BASES = [
  {
    purpose: 'Account creation and platform use',
    basis: 'Art. 6.1.b — Contract performance',
    detail: 'Required to provide the service.',
  },
  {
    purpose: 'AI matching between students and opportunities',
    basis: 'Art. 6.1.b — Contract performance',
    detail:
      'Core platform function. Students can opt out via "indexInSearchEngines" + "profilePublic" controls. Each match is logged in MatchExplanation for AI Act Art. 22 transparency.',
  },
  {
    purpose: 'Marketing emails (newsletter, product updates)',
    basis: 'Art. 6.1.a — Consent',
    detail: 'Opt-in only. Withdrawal via account settings or unsubscribe link.',
  },
  {
    purpose: 'Behavior analytics (page views, clicks, heatmaps)',
    basis: 'Art. 6.1.a — Consent',
    detail:
      'Cookie banner gates everything. No tracking happens without analytics consent.',
  },
  {
    purpose: 'Audit log and security monitoring',
    basis: 'Art. 6.1.c + Art. 6.1.f — Legal obligation + legitimate interest',
    detail:
      'GDPR Art. 5.2 accountability, AI Act Art. 12 traceability, fraud prevention.',
  },
  {
    purpose: 'Bot protection (Cloudflare Turnstile)',
    basis: 'Art. 6.1.f — Legitimate interest',
    detail:
      'Necessary to protect the platform from automated abuse. Turnstile is privacy-preserving by design and does not set tracking cookies.',
  },
  {
    purpose: 'Tax and accounting records',
    basis: 'Art. 6.1.c — Legal obligation',
    detail: 'Italian fiscal law requires retention of billing records for 10 years.',
  },
]

export default function ProcessingDetailsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-slate max-w-none">
          <h1 className="text-3xl font-bold mb-2">Data Processing Details</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Sub-processors, retention periods, cross-border transfers, and legal
            bases. Last reviewed: 2026-05-05. For the high-level user-facing
            policy, see <a href="/privacy">/privacy</a>.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">Sub-processors</h2>
          <p className="text-sm text-muted-foreground mb-4">
            InTransparency engages the following sub-processors to deliver the
            service. We commit to inform users of any changes to this list with
            30 days&apos; notice via product update or email.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-left">
                  <th className="py-2 pr-3">Provider</th>
                  <th className="py-2 pr-3">Role</th>
                  <th className="py-2 pr-3">Location</th>
                  <th className="py-2 pr-3">Data types</th>
                  <th className="py-2 pr-3">Safeguards</th>
                  <th className="py-2">DPA</th>
                </tr>
              </thead>
              <tbody>
                {SUB_PROCESSORS.map(p => (
                  <tr key={p.name} className="border-b border-slate-100 align-top">
                    <td className="py-3 pr-3 font-medium">{p.name}</td>
                    <td className="py-3 pr-3">{p.role}</td>
                    <td className="py-3 pr-3">{p.location}</td>
                    <td className="py-3 pr-3 text-muted-foreground">{p.dataTypes}</td>
                    <td className="py-3 pr-3 text-muted-foreground">{p.safeguards}</td>
                    <td className="py-3">
                      <a
                        href={p.dpa}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:underline"
                      >
                        view
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-semibold mt-10 mb-4">
            Cross-border data transfers
          </h2>
          <p>
            Personal data is primarily stored in the European Union (Neon
            Frankfurt region). Where a sub-processor is established outside the
            EEA — currently Anthropic, Resend, Stripe, and Cloudflare for parts
            of its infrastructure — transfers rely on:
          </p>
          <ul className="list-disc pl-6 my-3">
            <li>
              <strong>EU-US Data Privacy Framework</strong> certification, where
              the provider is certified.
            </li>
            <li>
              <strong>Standard Contractual Clauses (SCC)</strong> Module 2
              (controller → processor), as fallback and complement.
            </li>
            <li>
              <strong>Supplementary measures</strong>: encryption in transit and
              at rest, contractual prohibitions on government access requests
              without prior notice (where legally permitted), data minimization
              before transfer.
            </li>
          </ul>
          <p>
            For Anthropic specifically, project content sent for AI processing
            is governed by zero-data-retention terms — content is not stored on
            their side and is not used to train their models.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">Retention periods</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-left">
                  <th className="py-2 pr-3">Data category</th>
                  <th className="py-2 pr-3">Retention</th>
                  <th className="py-2">Legal basis</th>
                </tr>
              </thead>
              <tbody>
                {RETENTION.map(r => (
                  <tr key={r.category} className="border-b border-slate-100 align-top">
                    <td className="py-3 pr-3 font-medium">{r.category}</td>
                    <td className="py-3 pr-3">{r.period}</td>
                    <td className="py-3 text-muted-foreground">{r.legalBasis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-semibold mt-10 mb-4">
            Legal bases per processing activity
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-left">
                  <th className="py-2 pr-3">Purpose</th>
                  <th className="py-2 pr-3">Legal basis</th>
                  <th className="py-2">Detail</th>
                </tr>
              </thead>
              <tbody>
                {LEGAL_BASES.map(l => (
                  <tr key={l.purpose} className="border-b border-slate-100 align-top">
                    <td className="py-3 pr-3 font-medium">{l.purpose}</td>
                    <td className="py-3 pr-3">{l.basis}</td>
                    <td className="py-3 text-muted-foreground">{l.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-semibold mt-10 mb-4">
            Automated decision-making (AI Act Art. 22 GDPR)
          </h2>
          <p>
            Our matching engine ranks candidates against open positions. While
            the platform surfaces matches, every decision to contact a candidate
            is taken by a human recruiter — there is no fully automated
            decision-making with legal or similarly significant effects on data
            subjects. Each match is accompanied by a structured explanation
            (visible to the student via{' '}
            <a href="/dashboard/student" className="text-blue-700 hover:underline">
              the student dashboard
            </a>
            ) and persisted in the AuditLog for 7 years.
          </p>
          <p>
            Public-facing details on the matching algorithm are available in our{' '}
            <a href="/algorithm-registry" className="text-blue-700 hover:underline">
              algorithm registry
            </a>
            .
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">Security measures</h2>
          <ul className="list-disc pl-6 my-3">
            <li>AES-256 encryption at rest (Neon, AWS-KMS managed keys)</li>
            <li>TLS 1.2+ for all in-transit traffic</li>
            <li>
              Application-level AES-256-GCM encryption for sensitive secrets
              (TOTP secrets, MFA backup codes via bcrypt)
            </li>
            <li>Bcrypt cost-10 password hashing</li>
            <li>Two-factor authentication (TOTP) available for all accounts</li>
            <li>Role-based access control + per-request audit logging</li>
            <li>Rate limiting on authentication, AI, and public endpoints</li>
            <li>HSTS, CSP, X-Frame-Options DENY, SameSite cookies</li>
            <li>Cloudflare Turnstile bot protection on registration and login</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">
            Data subject rights & how to exercise them
          </h2>
          <ul className="list-disc pl-6 my-3">
            <li>
              <strong>Access (Art. 15)</strong>: download your data via{' '}
              <a href="/dashboard/student/privacy" className="text-blue-700 hover:underline">
                /dashboard/student/privacy
              </a>{' '}
              → Export.
            </li>
            <li>
              <strong>Rectification (Art. 16)</strong>: edit your profile in the
              dashboard at any time.
            </li>
            <li>
              <strong>Erasure (Art. 17)</strong>: account deletion via{' '}
              <a
                href="/dashboard/student/settings"
                className="text-blue-700 hover:underline"
              >
                settings
              </a>{' '}
              → Delete account. Erasure executed within 30 days; backups purged
              within 7 days thereafter.
            </li>
            <li>
              <strong>Portability (Art. 20)</strong>: same export endpoint
              returns machine-readable JSON.
            </li>
            <li>
              <strong>Objection (Art. 21)</strong>: opt out of marketing emails
              in settings; revoke analytics consent via the cookie banner
              (re-open it from the footer).
            </li>
            <li>
              <strong>Complaint to supervisory authority</strong>: Garante per
              la protezione dei dati personali —{' '}
              <a
                href="https://www.garanteprivacy.it"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:underline"
              >
                garanteprivacy.it
              </a>
              .
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">Contact</h2>
          <p>
            Privacy enquiries:{' '}
            <a
              href="mailto:info@in-transparency.com"
              className="text-blue-700 hover:underline"
            >
              info@in-transparency.com
            </a>
            . We respond within 30 days as required by GDPR.
          </p>

          <p className="text-xs text-muted-foreground mt-12">
            This document is informational and forms part of our overall privacy
            framework with the high-level{' '}
            <a href="/privacy" className="underline">
              Privacy Policy
            </a>{' '}
            and the{' '}
            <a href="/terms" className="underline">
              Terms of Service
            </a>
            . If you are signing a Data Processing Agreement (DPA), please
            request the latest version at the contact above.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
