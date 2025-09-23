'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  GraduationCap,
  Code,
  TrendingUp,
  Palette,
  Beaker,
  Building,
  Download,
  Eye,
  Star,
  Award,
  Briefcase,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin
} from 'lucide-react'

interface CVSample {
  id: string
  name: string
  degree: string
  university: string
  gpa: number
  graduationDate: string
  specialization: string
  icon: any
  color: string
  skills: string[]
  projects: Array<{
    title: string
    description: string
    technologies: string[]
    githubUrl?: string
    liveUrl?: string
  }>
  internships: Array<{
    company: string
    role: string
    duration: string
    description: string
  }>
  certifications: string[]
  languages: Array<{
    language: string
    level: string
  }>
  achievements: string[]
}

const cvSamples: CVSample[] = [
  {
    id: 'cs-fullstack',
    name: 'Marco Rossi',
    degree: 'Computer Science',
    university: 'Università Bocconi',
    gpa: 3.8,
    graduationDate: 'May 2024',
    specialization: 'Full-Stack Development',
    icon: Code,
    color: 'bg-blue-500',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 'AWS', 'Docker', 'Git'],
    projects: [
      {
        title: 'E-commerce Platform',
        description: 'Full-stack e-commerce solution with React frontend, Node.js backend, and PostgreSQL database. Features include user authentication, payment processing, and admin dashboard.',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS'],
        githubUrl: 'https://github.com/marcorossi/ecommerce',
        liveUrl: 'https://ecommerce-demo.vercel.app'
      },
      {
        title: 'Task Management App',
        description: 'Collaborative project management tool with real-time updates, team collaboration features, and advanced analytics.',
        technologies: ['Vue.js', 'Express', 'MongoDB', 'Socket.io'],
        githubUrl: 'https://github.com/marcorossi/taskmanager'
      },
      {
        title: 'AI-Powered Chat Application',
        description: 'Real-time chat application with AI-powered message suggestions and sentiment analysis.',
        technologies: ['React', 'WebRTC', 'TensorFlow.js', 'Firebase'],
        githubUrl: 'https://github.com/marcorossi/ai-chat'
      }
    ],
    internships: [
      {
        company: 'TechStart Milano',
        role: 'Frontend Developer Intern',
        duration: 'Jun 2023 - Sep 2023',
        description: 'Developed responsive web applications using React and TypeScript. Collaborated with design team to implement pixel-perfect UI components.'
      }
    ],
    certifications: ['AWS Certified Developer', 'React Professional Certificate'],
    languages: [
      { language: 'Italian', level: 'Native' },
      { language: 'English', level: 'Fluent' },
      { language: 'Spanish', level: 'Intermediate' }
    ],
    achievements: [
      'Winner of Bocconi Hackathon 2023',
      'Dean\'s List for 3 consecutive semesters',
      'President of Computer Science Society'
    ]
  },
  {
    id: 'ds-analytics',
    name: 'Sofia Chen',
    degree: 'Data Science',
    university: 'Politecnico di Milano',
    gpa: 3.9,
    graduationDate: 'July 2024',
    specialization: 'Machine Learning & Analytics',
    icon: TrendingUp,
    color: 'bg-green-500',
    skills: ['Python', 'R', 'SQL', 'TensorFlow', 'PyTorch', 'Pandas', 'Scikit-learn', 'Tableau'],
    projects: [
      {
        title: 'Predictive Analytics for Retail',
        description: 'Machine learning model to predict customer behavior and optimize inventory management. Achieved 92% accuracy in demand forecasting.',
        technologies: ['Python', 'TensorFlow', 'Pandas', 'SQL'],
        githubUrl: 'https://github.com/sofiachen/retail-analytics'
      },
      {
        title: 'Real-time Fraud Detection',
        description: 'Deep learning system for detecting fraudulent transactions in real-time with minimal false positives.',
        technologies: ['Python', 'PyTorch', 'Apache Kafka', 'Redis'],
        githubUrl: 'https://github.com/sofiachen/fraud-detection'
      },
      {
        title: 'Social Media Sentiment Analysis',
        description: 'NLP-based sentiment analysis tool for social media monitoring and brand reputation management.',
        technologies: ['Python', 'NLTK', 'Transformers', 'FastAPI'],
        githubUrl: 'https://github.com/sofiachen/sentiment-analysis'
      }
    ],
    internships: [
      {
        company: 'DataCorp',
        role: 'Data Science Intern',
        duration: 'Jun 2023 - Aug 2023',
        description: 'Built predictive models for customer churn and developed data visualization dashboards for executive team.'
      }
    ],
    certifications: ['Google Cloud Professional Data Engineer', 'Microsoft Azure AI Fundamentals'],
    languages: [
      { language: 'English', level: 'Native' },
      { language: 'Italian', level: 'Fluent' },
      { language: 'Mandarin', level: 'Native' }
    ],
    achievements: [
      'Best Data Science Project Award 2023',
      'Published paper in IEEE Data Science Conference',
      'Kaggle Competition Silver Medal'
    ]
  },
  {
    id: 'design-ux',
    name: 'Elena Bianchi',
    degree: 'Digital Design',
    university: 'NABA Milano',
    gpa: 3.7,
    graduationDate: 'June 2024',
    specialization: 'UX/UI Design',
    icon: Palette,
    color: 'bg-purple-500',
    skills: ['Figma', 'Adobe Creative Suite', 'Sketch', 'Principle', 'HTML/CSS', 'JavaScript', 'User Research'],
    projects: [
      {
        title: 'Mobile Banking App Redesign',
        description: 'Complete UX/UI redesign of a mobile banking application, increasing user engagement by 40% and reducing support tickets by 25%.',
        technologies: ['Figma', 'Principle', 'UserTesting'],
        liveUrl: 'https://dribbble.com/shots/banking-app-redesign'
      },
      {
        title: 'E-learning Platform UI',
        description: 'Design system and user interface for an online learning platform serving 10,000+ students.',
        technologies: ['Figma', 'Adobe XD', 'Framer'],
        liveUrl: 'https://behance.net/elearning-platform'
      },
      {
        title: 'Smart Home Control Interface',
        description: 'IoT device interface design with focus on accessibility and intuitive interaction patterns.',
        technologies: ['Sketch', 'Principle', 'ProtoPie'],
        liveUrl: 'https://dribbble.com/shots/smart-home-ui'
      }
    ],
    internships: [
      {
        company: 'Design Studio Milano',
        role: 'UX Design Intern',
        duration: 'Jul 2023 - Sep 2023',
        description: 'Conducted user research and created wireframes for B2B SaaS applications. Led usability testing sessions with 50+ participants.'
      }
    ],
    certifications: ['Google UX Design Certificate', 'Adobe Certified Expert'],
    languages: [
      { language: 'Italian', level: 'Native' },
      { language: 'English', level: 'Fluent' },
      { language: 'French', level: 'Intermediate' }
    ],
    achievements: [
      'Winner of Milan Design Week Student Competition',
      'Featured in Design + Research Magazine',
      'NABA Excellence Scholarship Recipient'
    ]
  },
  {
    id: 'engineering',
    name: 'Alessandro Ferrari',
    degree: 'Mechanical Engineering',
    university: 'Politecnico di Torino',
    gpa: 3.6,
    graduationDate: 'September 2024',
    specialization: 'Automotive Engineering',
    icon: Beaker,
    color: 'bg-orange-500',
    skills: ['CAD/CAM', 'MATLAB', 'SolidWorks', 'AutoCAD', 'FEA Analysis', 'Project Management', 'Lean Manufacturing'],
    projects: [
      {
        title: 'Electric Vehicle Powertrain Design',
        description: 'Designed and optimized electric powertrain for Formula Student competition vehicle, achieving 15% improvement in efficiency.',
        technologies: ['SolidWorks', 'MATLAB/Simulink', 'ANSYS'],
        githubUrl: 'https://github.com/alessandroferrari/ev-powertrain'
      },
      {
        title: 'Automated Quality Control System',
        description: 'Developed automated inspection system for manufacturing line, reducing defect rate by 30%.',
        technologies: ['LabVIEW', 'Computer Vision', 'PLC Programming'],
        githubUrl: 'https://github.com/alessandroferrari/qc-automation'
      },
      {
        title: 'Drone Structural Analysis',
        description: 'Finite element analysis and optimization of drone frame structure for maximum payload capacity.',
        technologies: ['ANSYS', 'SolidWorks', 'MATLAB'],
        githubUrl: 'https://github.com/alessandroferrari/drone-analysis'
      }
    ],
    internships: [
      {
        company: 'Fiat Chrysler Automobiles',
        role: 'Engineering Intern',
        duration: 'Jun 2023 - Aug 2023',
        description: 'Worked on suspension system optimization and participated in vehicle testing procedures.'
      }
    ],
    certifications: ['SolidWorks Professional', 'Six Sigma Green Belt'],
    languages: [
      { language: 'Italian', level: 'Native' },
      { language: 'English', level: 'Fluent' },
      { language: 'German', level: 'Basic' }
    ],
    achievements: [
      'Formula Student Team Captain',
      'Best Engineering Project Award 2023',
      'Scholarship recipient for academic excellence'
    ]
  },
  {
    id: 'business',
    name: 'Francesca Conti',
    degree: 'International Business',
    university: 'Università Bocconi',
    gpa: 3.8,
    graduationDate: 'July 2024',
    specialization: 'Digital Marketing & Strategy',
    icon: Building,
    color: 'bg-indigo-500',
    skills: ['Digital Marketing', 'Business Analytics', 'Excel', 'PowerBI', 'SQL', 'Google Analytics', 'Project Management'],
    projects: [
      {
        title: 'Startup Market Entry Strategy',
        description: 'Developed comprehensive market entry strategy for Italian fintech startup expanding to European markets.',
        technologies: ['Excel', 'PowerBI', 'Google Analytics'],
        liveUrl: 'https://drive.google.com/presentation-link'
      },
      {
        title: 'Social Media Marketing Campaign',
        description: 'Led digital marketing campaign for local fashion brand, achieving 200% increase in online sales.',
        technologies: ['Google Ads', 'Facebook Ads', 'Analytics'],
        liveUrl: 'https://case-study-link.com'
      },
      {
        title: 'E-commerce Business Plan',
        description: 'Created detailed business plan for sustainable fashion e-commerce platform with financial projections.',
        technologies: ['Excel', 'Market Research', 'Financial Modeling'],
        liveUrl: 'https://business-plan-portfolio.com'
      }
    ],
    internships: [
      {
        company: 'McKinsey & Company',
        role: 'Business Analyst Intern',
        duration: 'Jun 2023 - Aug 2023',
        description: 'Supported senior consultants in client engagements, conducted market research, and created executive presentations.'
      }
    ],
    certifications: ['Google Analytics Certified', 'HubSpot Content Marketing'],
    languages: [
      { language: 'Italian', level: 'Native' },
      { language: 'English', level: 'Fluent' },
      { language: 'Spanish', level: 'Fluent' },
      { language: 'French', level: 'Intermediate' }
    ],
    achievements: [
      'Bocconi Dean\'s List 2022-2024',
      'Winner of International Business Case Competition',
      'Study Abroad Excellence Award'
    ]
  }
]

export default function CVSamplesPage() {
  const [selectedCV, setSelectedCV] = useState<CVSample>(cvSamples[0])
  const [viewMode, setViewMode] = useState<'preview' | 'download'>('preview')

  const CVPreview = ({ cv }: { cv: CVSample }) => (
    <div className="bg-white p-8 shadow-lg max-w-2xl mx-auto">
      {/* Header */}
      <div className="border-b-2 border-gray-200 pb-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${cv.color} text-white`}>
            <cv.icon className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{cv.name}</h1>
            <p className="text-lg text-gray-600">{cv.specialization}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-gray-500" />
            <span>{cv.name.toLowerCase().replace(' ', '.')}@email.com</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-gray-500" />
            <span>+39 123 456 7890</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span>Milano, Italy</span>
          </div>
          <div className="flex items-center">
            <Globe className="h-4 w-4 mr-2 text-gray-500" />
            <span>portfolio.{cv.name.toLowerCase().replace(' ', '')}.com</span>
          </div>
        </div>
      </div>

      {/* Education */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
          <GraduationCap className="h-5 w-5 mr-2" />
          Education
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold">{cv.degree}</h3>
          <p className="text-gray-600">{cv.university}</p>
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-500">GPA: {cv.gpa}/4.0</span>
            <span className="text-sm text-gray-500">Graduated: {cv.graduationDate}</span>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Technical Skills</h2>
        <div className="flex flex-wrap gap-2">
          {cv.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="px-3 py-1">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
          <Code className="h-5 w-5 mr-2" />
          Key Projects
        </h2>
        <div className="space-y-4">
          {cv.projects.map((project, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg">{project.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{project.description}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2 text-xs">
                {project.githubUrl && (
                  <span className="flex items-center text-blue-600">
                    <Github className="h-3 w-3 mr-1" />
                    GitHub
                  </span>
                )}
                {project.liveUrl && (
                  <span className="flex items-center text-green-600">
                    <Globe className="h-3 w-3 mr-1" />
                    Live Demo
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
          <Briefcase className="h-5 w-5 mr-2" />
          Experience
        </h2>
        <div className="space-y-4">
          {cv.internships.map((internship, index) => (
            <div key={index}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{internship.role}</h3>
                  <p className="text-gray-600">{internship.company}</p>
                </div>
                <span className="text-sm text-gray-500">{internship.duration}</span>
              </div>
              <p className="text-sm text-gray-700 mt-1">{internship.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
          <Award className="h-5 w-5 mr-2" />
          Achievements
        </h2>
        <ul className="space-y-1">
          {cv.achievements.map((achievement, index) => (
            <li key={index} className="flex items-center text-sm">
              <Star className="h-4 w-4 mr-2 text-yellow-500" />
              {achievement}
            </li>
          ))}
        </ul>
      </div>

      {/* Languages */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Languages</h2>
        <div className="grid grid-cols-2 gap-2">
          {cv.languages.map((lang, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-sm">{lang.language}</span>
              <span className="text-sm text-gray-600">{lang.level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📄 CV Samples for New Graduates
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore professionally crafted CV templates for different academic paths.
              See how top graduates present their projects, skills, and experience to land their dream jobs.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* CV Selection */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Academic Paths</h2>
              <div className="space-y-3">
                {cvSamples.map((cv) => {
                  const Icon = cv.icon
                  return (
                    <Card
                      key={cv.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedCV.id === cv.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedCV(cv)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded ${cv.color} text-white`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">{cv.degree}</h3>
                            <p className="text-xs text-gray-600">{cv.specialization}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <Button
                  className="w-full"
                  onClick={() => setViewMode('download')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setViewMode('preview')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Mode
                </Button>
              </div>

              {/* Freemium Notice */}
              <Card className="mt-6 border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-green-800 mb-2">
                    🎓 FREE for Graduates!
                  </h3>
                  <p className="text-sm text-green-700">
                    All CV templates, AI optimization, and basic features are completely free for recent graduates.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CV Preview */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCV.name} - {selectedCV.specialization}
                </h2>
                <p className="text-gray-600">
                  {selectedCV.university} • GPA: {selectedCV.gpa} • {selectedCV.graduationDate}
                </p>
              </div>
              <div className="flex space-x-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  ✨ AI Optimized
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  📊 97% Match Rate
                </Badge>
              </div>
            </div>

            <CVPreview cv={selectedCV} />

            {/* Features Highlight */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Why This CV Template Works</CardTitle>
                <CardDescription>
                  AI analysis of successful graduate placements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 p-2 rounded">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Project-Focused</h4>
                      <p className="text-sm text-gray-600">Highlights real work over theoretical knowledge</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded">
                      <Code className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Technical Skills</h4>
                      <p className="text-sm text-gray-600">Clear skill demonstration with proof</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-100 p-2 rounded">
                      <Award className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Achievement-Based</h4>
                      <p className="text-sm text-gray-600">Quantified results and measurable impact</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-100 p-2 rounded">
                      <Star className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">ATS Optimized</h4>
                      <p className="text-sm text-gray-600">Passes automated screening systems</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}