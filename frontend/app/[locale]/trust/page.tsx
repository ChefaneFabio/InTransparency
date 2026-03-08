import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import {
  Shield,
  CheckCircle2,
  GraduationCap,
  Brain,
  Award,
  Lock,
  ExternalLink,
  ArrowRight,
  FileCheck,
  Database,
  Fingerprint,
  Eye,
  Users,
  Building2,
} from 'lucide-react'

export default function TrustPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/20 rounded-full text-green-700 text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            How Verification Works
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Every claim is verified.<br />
            Every score is earned.
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            InTransparency eliminates guesswork from hiring by building a chain of trust
            from university records to AI-analyzed portfolios to cryptographic verification.
          </p>
        </div>
      </section>

      {/* The Verification Chain */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-12 text-center">
            The Verification Chain
          </h2>

          <div className="space-y-0">
            {/* Step 1 */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
                  1
                </div>
                <div className="w-0.5 flex-1 bg-blue-200 my-2" />
              </div>
              <div className="pb-12">
                <div className="flex items-center gap-3 mb-3">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold text-gray-900">University Data Sync</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Students connect their institutional email (.edu or university domain). We verify ownership
                  through a confirmation link. Once verified, academic data — courses, grades, thesis records —
                  syncs directly from university systems via secure API integrations.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/5 text-blue-700 rounded-full text-sm">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Email verification
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/5 text-blue-700 rounded-full text-sm">
                    <Database className="h-3.5 w-3.5" /> Esse3 / SIFA integration
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/5 text-blue-700 rounded-full text-sm">
                    <Lock className="h-3.5 w-3.5" /> Encrypted sync
                  </span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
                  2
                </div>
                <div className="w-0.5 flex-1 bg-purple-200 my-2" />
              </div>
              <div className="pb-12">
                <div className="flex items-center gap-3 mb-3">
                  <FileCheck className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold text-gray-900">Professor Endorsement</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Students request endorsements from their professors. Each professor receives a unique,
                  time-limited verification link. They can confirm project supervision, rate the work,
                  and add their professional endorsement. This is the highest-credibility signal
                  on the platform — a direct confirmation from the academic supervisor.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/5 text-purple-700 rounded-full text-sm">
                    <Fingerprint className="h-3.5 w-3.5" /> Unique token per request
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/5 text-purple-700 rounded-full text-sm">
                    <Lock className="h-3.5 w-3.5" /> 7-day expiry
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/5 text-purple-700 rounded-full text-sm">
                    <Award className="h-3.5 w-3.5" /> Skill-level endorsements
                  </span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
                  3
                </div>
                <div className="w-0.5 flex-1 bg-indigo-200 my-2" />
              </div>
              <div className="pb-12">
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold text-gray-900">AI Analysis</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Every submitted project is analyzed by Claude, our AI engine. The analysis is
                  discipline-aware — a mechanical engineering thesis is evaluated differently
                  from a React web app. Each project receives scores for innovation, complexity,
                  and market relevance, plus detected competencies with evidence citations.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/5 text-primary rounded-full text-sm">
                    <Brain className="h-3.5 w-3.5" /> 15 discipline models
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/5 text-primary rounded-full text-sm">
                    <Eye className="h-3.5 w-3.5" /> Evidence-based scoring
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/5 text-primary rounded-full text-sm">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Soft skills detection
                  </span>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
                  4
                </div>
                <div className="w-0.5 flex-1 bg-green-200 my-2" />
              </div>
              <div className="pb-12">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold text-gray-900">Badge Issuance</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Verified projects receive a portable verification badge compliant with
                  Open Badges 3.0. Each badge contains a SHA-256 hash of the project data
                  at verification time — any tampering is cryptographically detectable.
                  Badges can be embedded on LinkedIn, personal sites, or shared via URL.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/5 text-green-700 rounded-full text-sm">
                    <Shield className="h-3.5 w-3.5" /> SHA-256 integrity hash
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/5 text-green-700 rounded-full text-sm">
                    <ExternalLink className="h-3.5 w-3.5" /> Open Badges 3.0
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/5 text-green-700 rounded-full text-sm">
                    <Fingerprint className="h-3.5 w-3.5" /> Tamper-proof
                  </span>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-lg flex-shrink-0">
                  5
                </div>
              </div>
              <div className="pb-8">
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="h-6 w-6 text-amber-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Public Verification</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Anyone can verify a badge by visiting its public URL. The verification page
                  shows the institution, project details, grade (with cross-country normalization),
                  professor endorsements, and a QR code. No account needed — just scan or click.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm">
                    <Eye className="h-3.5 w-3.5" /> No login required
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Grade normalization
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust for each segment */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">
            What this means for you
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Students */}
            <div className="bg-white rounded-xl p-6 border">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Students</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  Your grades and projects are verified, not self-reported
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  Professor endorsements prove real supervision
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  Portable badges work on LinkedIn, CVs, and websites
                </li>
              </ul>
            </div>

            {/* Recruiters */}
            <div className="bg-white rounded-xl p-6 border">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Companies</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  No fake profiles — every student is university-verified
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  AI scores are evidence-based, not self-assessed
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  Decision Packs aggregate all verified signals in one view
                </li>
              </ul>
            </div>

            {/* Universities */}
            <div className="bg-white rounded-xl p-6 border">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Universities</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  Your students carry your institution&apos;s verified badge
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  Placement tracking proves your educational outcomes
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  Professor endorsements showcase faculty engagement
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Technical Details
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Data Security</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>All data encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
                <li>University credentials never stored — only verification tokens</li>
                <li>GDPR compliant with full data portability and deletion rights</li>
                <li>SOC 2 Type II compliance (in progress)</li>
              </ul>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Badge Integrity</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>SHA-256 hash computed from project data at verification time</li>
                <li>Open Badges 3.0 / W3C Verifiable Credentials format</li>
                <li>Interoperable with Badgr, Credly, EU Digital Credentials</li>
                <li>Any modification to source data invalidates the badge</li>
              </ul>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">AI Analysis</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Powered by Claude (Anthropic) — no data used for model training</li>
                <li>15 discipline-specific evaluation models</li>
                <li>Scores calibrated against peer benchmarks</li>
                <li>Every score includes evidence citations from the project</li>
              </ul>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Grade Normalization</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Cross-country comparison: IT (18-30), DE (1.0-5.0), FR (0-20), UK (%)</li>
                <li>Normalized to 0-100 scale with original grade preserved</li>
                <li>ECTS letter grade support (A-E)</li>
                <li>Bologna Process alignment for European universities</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            See it in action
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Browse verified student portfolios or create your own verified profile.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/explore"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors"
            >
              Explore portfolios
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Create your profile
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
