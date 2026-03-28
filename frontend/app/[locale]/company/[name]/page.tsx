import { Link } from '@/navigation'
import { getTranslations } from 'next-intl/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import type { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  Globe,
  MapPin,
  Users,
  Briefcase,
  ExternalLink,
  Clock,
  ArrowRight,
} from 'lucide-react'

interface Props {
  params: Promise<{ name: string; locale: string }>
}

const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  INTERNSHIP: 'Internship',
  CONTRACT: 'Contract',
  FREELANCE: 'Freelance',
}

const WORK_LOCATION_LABELS: Record<string, string> = {
  REMOTE: 'Remote',
  ONSITE: 'On-site',
  HYBRID: 'Hybrid',
}

async function getCompanyData(companyName: string) {
  const decodedName = decodeURIComponent(companyName).replace(/-/g, ' ')

  // Find recruiter settings matching the company name (case-insensitive)
  const recruiterSettings = await prisma.recruiterSettings.findFirst({
    where: {
      companyName: {
        equals: decodedName,
        mode: 'insensitive',
      },
      user: {
        role: 'RECRUITER',
      },
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          company: true,
        },
      },
    },
  })

  if (!recruiterSettings) {
    // Fallback: try matching via User.company field
    const user = await prisma.user.findFirst({
      where: {
        role: 'RECRUITER',
        company: {
          equals: decodedName,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        company: true,
        recruiterSettings: true,
      },
    })

    if (!user) return null

    return {
      userId: user.id,
      companyName: user.recruiterSettings?.companyName || user.company || decodedName,
      companyLogo: user.recruiterSettings?.companyLogo || null,
      companyWebsite: user.recruiterSettings?.companyWebsite || null,
      companyIndustry: user.recruiterSettings?.companyIndustry || null,
      companySize: user.recruiterSettings?.companySize || null,
      companyLocation: user.recruiterSettings?.companyLocation || null,
      companyDescription: user.recruiterSettings?.companyDescription || null,
    }
  }

  return {
    userId: recruiterSettings.user.id,
    companyName: recruiterSettings.companyName || recruiterSettings.user.company || decodedName,
    companyLogo: recruiterSettings.companyLogo || null,
    companyWebsite: recruiterSettings.companyWebsite || null,
    companyIndustry: recruiterSettings.companyIndustry || null,
    companySize: recruiterSettings.companySize || null,
    companyLocation: recruiterSettings.companyLocation || null,
    companyDescription: recruiterSettings.companyDescription || null,
  }
}

async function getCompanyJobs(recruiterId: string) {
  const jobs = await prisma.job.findMany({
    where: {
      recruiterId,
      status: 'ACTIVE',
      isPublic: true,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      jobType: true,
      workLocation: true,
      location: true,
      salaryMin: true,
      salaryMax: true,
      salaryCurrency: true,
      showSalary: true,
      postedAt: true,
      expiresAt: true,
      requiredSkills: true,
    },
    orderBy: {
      postedAt: 'desc',
    },
    take: 20,
  })

  return jobs
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params
  const company = await getCompanyData(name)
  if (!company) return { title: 'Company Not Found' }

  return {
    title: `${company.companyName} - Company Profile`,
    description: company.companyDescription
      ? company.companyDescription.substring(0, 160)
      : `View the company profile and open positions at ${company.companyName}`,
    openGraph: {
      title: `${company.companyName} - Company Profile`,
      description: company.companyDescription
        ? company.companyDescription.substring(0, 160)
        : `View the company profile and open positions at ${company.companyName}`,
      type: 'profile',
    },
  }
}

export default async function CompanyProfilePage({ params }: Props) {
  const { name } = await params
  const company = await getCompanyData(name)

  if (!company) {
    notFound()
  }

  const jobs = await getCompanyJobs(company.userId)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Company Hero Section */}
        <div className="bg-white border-b">
          <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="flex items-start gap-6">
              {/* Logo */}
              <div className="h-20 w-20 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                {company.companyLogo ? (
                  <img
                    src={company.companyLogo}
                    alt={`${company.companyName} logo`}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                ) : (
                  <Building2 className="h-10 w-10 text-gray-400" />
                )}
              </div>

              {/* Company Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {company.companyName}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  {company.companyIndustry && (
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4" />
                      {company.companyIndustry}
                    </span>
                  )}
                  {company.companySize && (
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      {company.companySize}
                    </span>
                  )}
                  {company.companyLocation && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {company.companyLocation}
                    </span>
                  )}
                  {company.companyWebsite && (
                    <a
                      href={company.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-primary hover:underline"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          {/* About Section */}
          {company.companyDescription && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  About {company.companyName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {company.companyDescription}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Open Positions */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Open Positions {jobs.length > 0 && `(${jobs.length})`}
            </h2>

            {jobs.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No open positions
                  </h3>
                  <p className="text-gray-500">
                    This company does not have any active job listings at the moment. Check back later.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {job.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                            {job.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {job.location}
                              </span>
                            )}
                            {job.postedAt && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                Posted {new Date(job.postedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary">
                              {JOB_TYPE_LABELS[job.jobType] || job.jobType}
                            </Badge>
                            <Badge variant="outline">
                              {WORK_LOCATION_LABELS[job.workLocation] || job.workLocation}
                            </Badge>
                            {job.showSalary && job.salaryMin && job.salaryMax && (
                              <Badge variant="outline">
                                {job.salaryCurrency} {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()}
                              </Badge>
                            )}
                          </div>

                          {job.requiredSkills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {job.requiredSkills.slice(0, 5).map((skill) => (
                                <span
                                  key={skill}
                                  className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                              {job.requiredSkills.length > 5 && (
                                <span className="text-xs text-gray-500 px-1">
                                  +{job.requiredSkills.length - 5} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <Link
                          href="/auth/register/student"
                          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline flex-shrink-0 mt-1"
                        >
                          Apply
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
