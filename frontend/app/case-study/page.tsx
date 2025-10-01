'use client'

import React, { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  MapPin,
  Users,
  Target,
  CheckCircle,
  TrendingUp,
  Clock,
  Award,
  Brain,
  Search,
  Zap,
  FileText,
  ArrowRight,
  Star,
  GraduationCap,
  Briefcase,
  Database,
  BarChart3
} from 'lucide-react'

const positions = [
  {
    id: 1,
    title: 'Junior Risk Analyst',
    location: 'Milan',
    department: 'Risk Management',
    icon: BarChart3,
    color: 'bg-blue-50 border-blue-200',
    requirements: {
      education: ['Economics', 'Finance', 'Statistics', 'Mathematics'],
      skills: ['Risk Assessment', 'Financial Modeling', 'Data Analysis', 'Excel', 'Python', 'SQL'],
      courses: ['Financial Risk Management', 'Econometrics', 'Corporate Finance', 'Probability Theory'],
      certifications: ['FRM Level 1 (preferred)', 'CFA Level 1 (preferred)'],
      languages: ['Italian (Native)', 'English (B2+)']
    },
    candidate: {
      name: 'Marco Rossi',
      university: 'Bocconi University',
      degree: 'MSc in Finance',
      gpa: '28.5/30',
      location: 'Milan',
      relevantCourses: [
        { name: 'Financial Risk Management', grade: 'A', code: 'FIN-402' },
        { name: 'Quantitative Methods for Finance', grade: 'A-', code: 'FIN-308' },
        { name: 'Corporate Finance', grade: 'A', code: 'FIN-301' },
        { name: 'Advanced Econometrics', grade: 'B+', code: 'ECO-405' }
      ],
      projects: [
        {
          title: 'Credit Risk Model for SME Lending',
          description: 'Built predictive model using logistic regression to assess default probability',
          technologies: ['Python', 'Scikit-learn', 'Pandas', 'SQL'],
          aiScore: 92
        },
        {
          title: 'Portfolio Risk Analysis Dashboard',
          description: 'Interactive dashboard for VaR and CVaR calculations',
          technologies: ['Excel VBA', 'Python', 'Tableau'],
          aiScore: 88
        }
      ],
      skills: ['Python', 'R', 'SQL', 'Excel VBA', 'Financial Modeling', 'Statistical Analysis'],
      matchScore: 94,
      whyPerfectFit: [
        'Strong academic background in finance and quantitative methods',
        'Completed specialized courses in risk management and econometrics',
        'Built practical risk assessment models with real-world applications',
        'Based in Milan - no relocation needed',
        'Fluent in Italian and English'
      ]
    }
  },
  {
    id: 2,
    title: 'Junior Cybersecurity Analyst',
    location: 'Rome',
    department: 'IT Security',
    icon: Database,
    color: 'bg-green-50 border-green-200',
    requirements: {
      education: ['Computer Science', 'Cybersecurity', 'Information Technology', 'Engineering'],
      skills: ['Network Security', 'Penetration Testing', 'SIEM Tools', 'Linux', 'Python', 'Ethical Hacking'],
      courses: ['Network Security', 'Cryptography', 'Cyber Threat Analysis', 'Secure Software Development'],
      certifications: ['CEH (preferred)', 'CompTIA Security+', 'OSCP (preferred)'],
      languages: ['Italian (Native)', 'English (B2+)']
    },
    candidate: {
      name: 'Sofia Bianchi',
      university: 'Sapienza University of Rome',
      degree: 'MSc in Cybersecurity',
      gpa: '29/30',
      location: 'Rome',
      relevantCourses: [
        { name: 'Advanced Network Security', grade: 'A+', code: 'CS-501' },
        { name: 'Applied Cryptography', grade: 'A', code: 'CS-502' },
        { name: 'Digital Forensics', grade: 'A', code: 'CS-505' },
        { name: 'Secure Banking Systems', grade: 'A-', code: 'CS-510' }
      ],
      projects: [
        {
          title: 'Banking API Security Audit',
          description: 'Comprehensive security assessment of RESTful banking APIs, identified 12 vulnerabilities',
          technologies: ['Burp Suite', 'OWASP ZAP', 'Python', 'Metasploit'],
          aiScore: 95
        },
        {
          title: 'Real-time Threat Detection System',
          description: 'ML-based intrusion detection system for financial transactions',
          technologies: ['Python', 'TensorFlow', 'Splunk', 'ELK Stack'],
          aiScore: 91
        }
      ],
      skills: ['Penetration Testing', 'SIEM (Splunk)', 'Python', 'Linux', 'Network Security', 'Ethical Hacking'],
      certifications: ['CEH Certified', 'CompTIA Security+'],
      matchScore: 96,
      whyPerfectFit: [
        'Specialized degree in Cybersecurity from top Italian university',
        'Completed banking-specific security course',
        'Hands-on experience auditing financial systems',
        'Already certified in ethical hacking (CEH)',
        'Based in Rome - perfect for headquarters role'
      ]
    }
  },
  {
    id: 3,
    title: 'Junior Data Scientist',
    location: 'Turin',
    department: 'Analytics & Innovation',
    icon: Brain,
    color: 'bg-purple-50 border-purple-200',
    requirements: {
      education: ['Data Science', 'Computer Science', 'Statistics', 'Mathematics', 'Physics'],
      skills: ['Machine Learning', 'Python', 'TensorFlow', 'SQL', 'Data Visualization', 'Statistical Modeling'],
      courses: ['Machine Learning', 'Deep Learning', 'Big Data Analytics', 'Time Series Analysis'],
      certifications: ['TensorFlow Developer Certificate (preferred)', 'AWS ML Specialty (preferred)'],
      languages: ['Italian (Native)', 'English (B2+)']
    },
    candidate: {
      name: 'Alessandro Ferrari',
      university: 'Politecnico di Torino',
      degree: 'MSc in Data Science',
      gpa: '27.8/30',
      location: 'Turin',
      relevantCourses: [
        { name: 'Machine Learning for Finance', grade: 'A', code: 'DS-401' },
        { name: 'Deep Learning Applications', grade: 'A-', code: 'DS-403' },
        { name: 'Time Series Forecasting', grade: 'A', code: 'DS-410' },
        { name: 'Financial Data Analytics', grade: 'B+', code: 'DS-405' }
      ],
      projects: [
        {
          title: 'Customer Churn Prediction Model',
          description: 'Built LSTM model to predict bank customer churn with 87% accuracy',
          technologies: ['Python', 'TensorFlow', 'Keras', 'Pandas', 'PostgreSQL'],
          aiScore: 93
        },
        {
          title: 'Fraud Detection System',
          description: 'Real-time fraud detection using Random Forest and XGBoost for transaction data',
          technologies: ['Python', 'Scikit-learn', 'Apache Kafka', 'Docker'],
          aiScore: 90
        }
      ],
      skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Tableau', 'Machine Learning', 'Deep Learning'],
      certifications: ['TensorFlow Developer Certificate'],
      matchScore: 93,
      whyPerfectFit: [
        'Specialized in ML applications for financial services',
        'Built banking-specific projects (churn prediction, fraud detection)',
        'Already TensorFlow certified',
        'Strong background in time series and financial data analytics',
        'Based in Turin - ready to start immediately'
      ]
    }
  }
]

const platformBenefits = [
  {
    icon: Search,
    title: 'Precise Skill Matching',
    description: 'Search by specific courses, grades, and projects - not just keywords',
    stat: '250+ filters'
  },
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'AI RAG analyzes course content and project relevance to job requirements',
    stat: '95% match accuracy'
  },
  {
    icon: MapPin,
    title: 'Geographic Intelligence',
    description: 'Find candidates in specific cities across Italy with location-based search',
    stat: '3 perfect matches'
  },
  {
    icon: Clock,
    title: 'Faster Hiring',
    description: 'Reduced time-to-hire from 45 days to 12 days',
    stat: '73% faster'
  }
]

export default function CaseStudyPage() {
  const [selectedPosition, setSelectedPosition] = useState(1)
  const currentPosition = positions.find(p => p.id === selectedPosition) || positions[0]
  const PositionIcon = currentPosition.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
              <Building2 className="h-3 w-3 mr-1" />
              Case Study
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How Banca Nazionale Found 3 Perfect Junior Candidates Across Italy
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              A leading Italian bank needed to hire three junior specialists with very specific knowledge and skills for positions in Milan, Rome, and Turin. Here's how InTransparency's AI-powered platform matched them with the perfect candidates in just 12 days.
            </p>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">3</div>
                <div className="text-sm text-gray-600">Positions Filled</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">12</div>
                <div className="text-sm text-gray-600">Days to Hire</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">94%</div>
                <div className="text-sm text-gray-600">Average Match Score</div>
              </div>
            </div>
          </div>

          {/* The Challenge */}
          <Card className="mb-16 border-2">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Target className="h-6 w-6 mr-2 text-red-600" />
                The Challenge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700 text-lg">
                  Banca Nazionale needed to hire three junior professionals for critical roles across different Italian cities. Each position required very specific domain knowledge, relevant coursework, and practical project experience.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-900 mb-2">❌ Traditional Approach Issues</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Generic job boards with keyword matching</li>
                      <li>• 500+ applications to review manually</li>
                      <li>• No way to verify course-specific knowledge</li>
                      <li>• 45+ days average time-to-hire</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Specific Requirements</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Must have completed specific courses</li>
                      <li>• Need proven projects in banking domain</li>
                      <li>• Location-specific (Milan/Rome/Turin)</li>
                      <li>• Fluent in Italian and English</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2">✅ InTransparency Solution</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Search by specific courses and grades</li>
                      <li>• Filter by project technologies and domains</li>
                      <li>• Geographic mapping across Italy</li>
                      <li>• AI-powered relevance matching</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* The Problem with Traditional CVs for Juniors */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Why Traditional CVs Fail for Junior Positions
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Traditional CV Example */}
              <Card className="border-2 border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-900">
                    <FileText className="h-5 w-5 mr-2" />
                    Traditional CV (Sterile & Generic)
                  </CardTitle>
                  <CardDescription>What recruiters usually see</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-white p-6 rounded-lg shadow-inner space-y-4">
                    <div>
                      <h4 className="font-bold text-gray-900">Marco Rossi</h4>
                      <p className="text-sm text-gray-600">Recent Graduate • Milan, Italy</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-700 text-sm mb-1">Education</h5>
                      <p className="text-sm text-gray-600">MSc in Finance - Bocconi University</p>
                      <p className="text-xs text-gray-500">Graduated 2024</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-700 text-sm mb-1">Skills</h5>
                      <p className="text-sm text-gray-600">Python, Excel, Risk Management, Financial Analysis</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-700 text-sm mb-1">Experience</h5>
                      <p className="text-sm text-gray-600 italic">None or limited internships</p>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <h5 className="font-semibold text-red-700 text-sm mb-2">❌ What's Missing?</h5>
                      <ul className="text-xs text-red-600 space-y-1">
                        <li>• Which specific courses did they take?</li>
                        <li>• What grades did they get?</li>
                        <li>• What projects did they actually build?</li>
                        <li>• Do they have domain knowledge in banking?</li>
                        <li>• Can they apply theory to practice?</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-red-100 rounded-lg border border-red-300">
                    <p className="text-xs text-red-800">
                      <strong>The Problem:</strong> For junior candidates with little work experience, traditional CVs are essentially empty. They all look the same: education + skills list. There's no way to differentiate truly qualified candidates from those who just list keywords.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* InTransparency Profile Example */}
              <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-900">
                    <Star className="h-5 w-5 mr-2" />
                    InTransparency Profile (Rich & Detailed)
                  </CardTitle>
                  <CardDescription>What our platform reveals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-white p-6 rounded-lg shadow-inner space-y-4">
                    <div>
                      <h4 className="font-bold text-gray-900">Marco Rossi</h4>
                      <p className="text-sm text-gray-600">MSc Finance • Bocconi • GPA: 28.5/30</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-700 text-sm mb-2">Relevant Courses with Grades</h5>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs bg-green-50 p-2 rounded border border-green-200">
                          <span><strong>FIN-402:</strong> Financial Risk Management</span>
                          <Badge className="bg-green-600 text-white text-xs">A</Badge>
                        </div>
                        <div className="flex justify-between text-xs bg-green-50 p-2 rounded border border-green-200">
                          <span><strong>FIN-308:</strong> Quantitative Methods</span>
                          <Badge className="bg-green-600 text-white text-xs">A-</Badge>
                        </div>
                        <div className="flex justify-between text-xs bg-green-50 p-2 rounded border border-green-200">
                          <span><strong>ECO-405:</strong> Advanced Econometrics</span>
                          <Badge className="bg-green-600 text-white text-xs">B+</Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-700 text-sm mb-2">Verified Projects</h5>
                      <div className="bg-purple-50 p-3 rounded border border-purple-200">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-xs font-medium">Credit Risk Model for SME Lending</p>
                          <Badge className="bg-purple-600 text-white text-xs">AI: 92</Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">Built predictive model for default probability</p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">Python</Badge>
                          <Badge variant="outline" className="text-xs">Scikit-learn</Badge>
                          <Badge variant="outline" className="text-xs">SQL</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <h5 className="font-semibold text-green-700 text-sm mb-2">✅ Why This Works</h5>
                      <ul className="text-xs text-green-700 space-y-1">
                        <li>• See exactly which courses they excelled in</li>
                        <li>• Verify they learned the specific topics you need</li>
                        <li>• Review actual projects with technical details</li>
                        <li>• AI scores show project quality and relevance</li>
                        <li>• Proof of applied knowledge, not just theory</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-300">
                    <p className="text-xs text-green-800">
                      <strong>The Solution:</strong> InTransparency shows what junior candidates actually learned and built. For students with no work experience, their courses, grades, and academic projects become their portfolio - proving they have the knowledge and skills to succeed.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Insight */}
            <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 rounded-full p-3 flex-shrink-0">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900 mb-2">The Key Insight for Junior Hiring</h4>
                    <p className="text-gray-700 mb-3">
                      When candidates have little to no work experience, their <strong>academic coursework and projects</strong> are the best indicators of their capabilities. A student who took "Financial Risk Management" and built a credit risk model has more relevant experience than someone with a generic CV listing "risk management" as a skill.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="font-semibold text-blue-900 text-sm mb-1">Courses = Knowledge</div>
                        <p className="text-xs text-gray-600">Specific courses prove they learned exactly what you need</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="font-semibold text-blue-900 text-sm mb-1">Grades = Mastery</div>
                        <p className="text-xs text-gray-600">High grades show they didn't just pass - they excelled</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="font-semibold text-blue-900 text-sm mb-1">Projects = Application</div>
                        <p className="text-xs text-gray-600">Real projects prove they can apply theory to practice</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Position Selector */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">The Three Positions</h2>
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-200">
                <div className="flex space-x-2">
                  {positions.map((position) => {
                    const Icon = position.icon
                    return (
                      <button
                        key={position.id}
                        onClick={() => setSelectedPosition(position.id)}
                        className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-all ${
                          selectedPosition === position.id
                            ? position.color + ' shadow-sm'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        <div className="text-left">
                          <div>{position.title}</div>
                          <div className="text-xs opacity-75">{position.location}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Position Details */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Requirements */}
              <Card className={currentPosition.color}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PositionIcon className="h-5 w-5 mr-2" />
                    {currentPosition.title}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {currentPosition.location} • {currentPosition.department}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Position Requirements
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Education Background</div>
                      <div className="flex flex-wrap gap-2">
                        {currentPosition.requirements.education.map((edu, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">{edu}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Required Courses</div>
                      <div className="flex flex-wrap gap-2">
                        {currentPosition.requirements.courses.map((course, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-white">{course}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Technical Skills</div>
                      <div className="flex flex-wrap gap-2">
                        {currentPosition.requirements.skills.map((skill, idx) => (
                          <Badge key={idx} className="text-xs bg-blue-100 text-blue-700 border-blue-200">{skill}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Languages</div>
                      <div className="flex flex-wrap gap-2">
                        {currentPosition.requirements.languages.map((lang, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">{lang}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Candidate Match */}
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="flex items-center text-green-900">
                      <Award className="h-5 w-5 mr-2" />
                      Perfect Match Found
                    </CardTitle>
                    <Badge className="bg-green-600 text-white">
                      {currentPosition.candidate.matchScore}% Match
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 rounded-full h-12 w-12 flex items-center justify-center">
                      <Users className="h-6 w-6 text-green-700" />
                    </div>
                    <div>
                      <div className="font-bold text-lg text-green-900">{currentPosition.candidate.name}</div>
                      <div className="text-sm text-green-700 flex items-center">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        {currentPosition.candidate.degree} • {currentPosition.candidate.university}
                      </div>
                      <div className="text-sm text-green-700 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {currentPosition.candidate.location} • GPA: {currentPosition.candidate.gpa}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-semibold text-green-900 mb-2">Relevant Courses (Verified)</div>
                      <div className="space-y-1">
                        {currentPosition.candidate.relevantCourses.map((course, idx) => (
                          <div key={idx} className="bg-white p-2 rounded border border-green-200 text-xs flex justify-between items-center">
                            <span><strong>{course.code}:</strong> {course.name}</span>
                            <Badge className="bg-green-100 text-green-700 border-green-300">{course.grade}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-green-900 mb-2">Relevant Projects</div>
                      <div className="space-y-2">
                        {currentPosition.candidate.projects.map((project, idx) => (
                          <div key={idx} className="bg-white p-3 rounded border border-green-200">
                            <div className="flex justify-between items-start mb-1">
                              <div className="font-medium text-xs text-green-900">{project.title}</div>
                              <Badge className="bg-purple-100 text-purple-700 border-purple-300 text-xs">
                                AI Score: {project.aiScore}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{project.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {project.technologies.map((tech, techIdx) => (
                                <Badge key={techIdx} variant="outline" className="text-xs">{tech}</Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-green-900 mb-2">Why This Is a Perfect Fit</div>
                      <ul className="space-y-1">
                        {currentPosition.candidate.whyPerfectFit.map((reason, idx) => (
                          <li key={idx} className="flex items-start text-xs text-green-800">
                            <CheckCircle className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0 text-green-600" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Platform Benefits */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              How InTransparency Made It Possible
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {platformBenefits.map((benefit, idx) => {
                const Icon = benefit.icon
                return (
                  <Card key={idx} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="bg-blue-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600 mb-2">{benefit.stat}</div>
                      <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Results */}
          <Card className="mb-16 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-blue-900">
                <TrendingUp className="h-6 w-6 mr-2" />
                Results & Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-blue-600 mb-2">73%</div>
                  <div className="text-sm text-gray-600 mb-1">Faster Hiring</div>
                  <p className="text-xs text-gray-500">From 45 days to just 12 days</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-green-600 mb-2">94%</div>
                  <div className="text-sm text-gray-600 mb-1">Average Match Score</div>
                  <p className="text-xs text-gray-500">All three candidates were perfect fits</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-purple-600 mb-2">€45K</div>
                  <div className="text-sm text-gray-600 mb-1">Recruitment Cost Savings</div>
                  <p className="text-xs text-gray-500">Compared to traditional agency fees</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-gray-700 italic">
                  "InTransparency transformed our hiring process. Instead of sorting through hundreds of generic CVs, we could search for candidates who actually took the specific courses we needed and built relevant projects. The AI matching gave us confidence that these weren't just keyword matches - these candidates truly understood the banking domain. All three hires are now exceeding expectations."
                </p>
                <div className="mt-3 flex items-center">
                  <div className="bg-blue-100 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                    <Building2 className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Maria Lombardi</div>
                    <div className="text-sm text-gray-600">Head of Talent Acquisition, Banca Nazionale</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Find Your Perfect Candidates?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join leading companies using InTransparency to hire faster and smarter with AI-powered candidate matching
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => window.location.href = '/auth/register/role-selection'}
              >
                Get Started Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/how-it-works'}
              >
                Learn How It Works
                <Briefcase className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
