import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Target, Lightbulb, Award, ArrowRight, Heart, Star, TrendingUp } from 'lucide-react'

const team = [
  {
    name: 'Sarah Johnson',
    role: 'CEO & Co-Founder',
    bio: 'Former VP of Engineering at TechCorp with 15+ years in talent acquisition and AI.',
    image: 'SJ'
  },
  {
    name: 'Michael Chen',
    role: 'CTO & Co-Founder',
    bio: 'Machine Learning PhD and former Principal Engineer at Google, specializing in AI-powered matching.',
    image: 'MC'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Head of Product',
    bio: 'Former Product Manager at LinkedIn with expertise in career platforms and user experience.',
    image: 'ER'
  },
  {
    name: 'David Kim',
    role: 'Head of AI Research',
    bio: 'PhD in Computer Science from MIT, published researcher in NLP and recommendation systems.',
    image: 'DK'
  }
]

const values = [
  {
    icon: Users,
    title: 'Student-Centric',
    description: 'Every decision we make puts student success and career outcomes first.'
  },
  {
    icon: Target,
    title: 'Data-Driven',
    description: 'We use AI and analytics to provide actionable insights, not just pretty charts.'
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We continuously push the boundaries of what\'s possible in career development.'
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We maintain the highest standards in everything we build and deliver.'
  }
]

const milestones = [
  {
    year: '2022',
    title: 'Company Founded',
    description: 'InTransparency was founded with the mission to bridge the gap between student potential and career opportunities.'
  },
  {
    year: '2022',
    title: 'First AI Models',
    description: 'Developed our proprietary project analysis and skill assessment algorithms.'
  },
  {
    year: '2023',
    title: 'University Partnerships',
    description: 'Partnered with 25 leading universities to pilot our platform.'
  },
  {
    year: '2023',
    title: 'Series A Funding',
    description: 'Raised $15M Series A to accelerate product development and expansion.'
  },
  {
    year: '2024',
    title: 'AI Story Generation',
    description: 'Launched revolutionary AI-powered professional story generation.'
  },
  {
    year: '2024',
    title: 'Enterprise Launch',
    description: 'Full platform launch with 100+ university partners and 500+ employer partners.'
  }
]

const stats = [
  { label: 'Universities', value: '100+' },
  { label: 'Students Helped', value: '50,000+' },
  { label: 'Employer Partners', value: '500+' },
  { label: 'Successful Placements', value: '25,000+' }
]

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sky-50 via-white to-emerald-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 text-gray-900">
              Transforming How Students Launch Their Careers
            </h1>
            <p className="text-xl mb-8 text-gray-600">
              We use AI to bridge the gap between student potential and career opportunities,
              creating transparent pathways to professional success.
            </p>
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center bg-white/80 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg">
                  <div className="text-3xl font-bold text-teal-600">{stat.value}</div>
                  <div className="text-lg text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl text-muted-foreground">
                To create a world where every student's potential is recognized, 
                nurtured, and connected to the right opportunities.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-6 w-6 text-red-500" />
                    The Problem We Solve
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Talented students struggle to showcase their potential beyond GPA and resumes. 
                    Employers miss out on hidden gems. Universities lack insights into career outcomes. 
                    Traditional recruitment is broken.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-6 w-6 text-yellow-500" />
                    Our Solution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    AI-powered project analysis reveals true potential. Intelligent matching connects 
                    students with ideal opportunities. Data-driven insights help universities improve 
                    outcomes. We make talent transparent.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Our Values</h2>
              <p className="text-xl text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => {
                const Icon = value.icon
                return (
                  <Card key={value.title} className="text-center">
                    <CardHeader>
                      <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Meet Our Team</h2>
              <p className="text-xl text-muted-foreground">
                Experienced leaders from top tech companies and universities
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {team.map((member) => (
                <Card key={member.name} className="text-center">
                  <CardHeader>
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-xl">{member.image}</span>
                    </div>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Our Journey</h2>
              <p className="text-xl text-muted-foreground">
                Key milestones in building the future of career development
              </p>
            </div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      {milestone.year.slice(-2)}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 h-16 bg-border mt-4"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{milestone.title}</h3>
                      <Badge variant="outline">{milestone.year}</Badge>
                    </div>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Join Our Mission</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Whether you're a student, university, or employer, we'd love to help you 
              achieve better career outcomes through AI-powered transparency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2">
                Get Started Today
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Contact Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}