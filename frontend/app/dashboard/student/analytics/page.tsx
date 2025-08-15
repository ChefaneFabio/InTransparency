'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const skillsData = [
  { skill: 'React', level: 85, projects: 5 },
  { skill: 'TypeScript', level: 78, projects: 4 },
  { skill: 'Python', level: 92, projects: 8 },
  { skill: 'Node.js', level: 70, projects: 3 },
  { skill: 'PostgreSQL', level: 65, projects: 6 }
]

const projectViewsData = [
  { month: 'Jan', views: 120, applications: 8 },
  { month: 'Feb', views: 180, applications: 12 },
  { month: 'Mar', views: 250, applications: 18 },
  { month: 'Apr', views: 320, applications: 25 },
  { month: 'May', views: 280, applications: 22 },
  { month: 'Jun', views: 400, applications: 35 }
]

const industryInterestData = [
  { name: 'Fintech', value: 30, color: '#0088FE' },
  { name: 'Healthcare', value: 25, color: '#00C49F' },
  { name: 'E-commerce', value: 20, color: '#FFBB28' },
  { name: 'Gaming', value: 15, color: '#FF8042' },
  { name: 'Other', value: 10, color: '#8884d8' }
]

export default function StudentAnalytics() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Track your portfolio performance and career insights
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="career">Career</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,284</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Job Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">
                  +8% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Interview Invites</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">
                  +15% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Skill Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85/100</div>
                <p className="text-xs text-muted-foreground">
                  Advanced level
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile Views & Applications</CardTitle>
                <CardDescription>
                  Monthly trends for profile engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={projectViewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="applications" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Industry Interest</CardTitle>
                <CardDescription>
                  Where recruiters are viewing your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={industryInterestData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {industryInterestData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skills Assessment</CardTitle>
              <CardDescription>
                Your technical skills based on project analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {skillsData.map((skill) => (
                  <div key={skill.skill} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{skill.skill}</span>
                        <Badge variant="secondary">{skill.projects} projects</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills Market Demand</CardTitle>
              <CardDescription>
                How your skills align with market demand
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={skillsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="skill" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="level" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Project Performance</CardTitle>
                <CardDescription>
                  How your projects are performing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>AI Task Manager</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">245 views</span>
                      <Badge>High Impact</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>E-commerce Platform</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">189 views</span>
                      <Badge variant="secondary">Medium Impact</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Weather App</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">87 views</span>
                      <Badge variant="outline">Entry Level</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technology Usage</CardTitle>
                <CardDescription>
                  Most used technologies in your projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['React', 'Python', 'TypeScript', 'Node.js', 'PostgreSQL'].map((tech, index) => (
                    <div key={tech} className="flex items-center justify-between">
                      <span>{tech}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={85 - (index * 10)} className="w-20 h-2" />
                        <span className="text-sm text-muted-foreground">{85 - (index * 10)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="career" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Career Readiness</CardTitle>
                <CardDescription>
                  Your readiness for different career paths
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Full Stack Developer</span>
                      <span className="text-sm text-muted-foreground">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Frontend Developer</span>
                      <span className="text-sm text-muted-foreground">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Backend Developer</span>
                      <span className="text-sm text-muted-foreground">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>DevOps Engineer</span>
                      <span className="text-sm text-muted-foreground">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Salary Insights</CardTitle>
                <CardDescription>
                  Estimated salary ranges based on your skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">$75,000 - $95,000</div>
                    <p className="text-sm text-muted-foreground">Estimated salary range</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Entry Level</span>
                      <span className="font-medium">$65,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Mid Level</span>
                      <span className="font-medium">$85,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Senior Level</span>
                      <span className="font-medium">$120,000</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}