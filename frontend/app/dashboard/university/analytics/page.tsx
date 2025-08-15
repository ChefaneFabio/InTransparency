'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'

const placementTrends = [
  { year: '2020', rate: 68, avgSalary: 72000 },
  { year: '2021', rate: 72, avgSalary: 75000 },
  { year: '2022', rate: 76, avgSalary: 78000 },
  { year: '2023', rate: 81, avgSalary: 82000 },
  { year: '2024', rate: 85, avgSalary: 87000 }
]

const skillsInDemand = [
  { skill: 'React', demand: 95, students: 78, gap: 17 },
  { skill: 'Python', demand: 92, students: 85, gap: 7 },
  { skill: 'AWS', demand: 88, students: 45, gap: 43 },
  { skill: 'Machine Learning', demand: 85, students: 52, gap: 33 },
  { skill: 'TypeScript', demand: 82, students: 68, gap: 14 },
  { skill: 'Docker', demand: 78, students: 38, gap: 40 },
  { skill: 'Node.js', demand: 75, students: 71, gap: 4 },
  { skill: 'Kubernetes', demand: 72, students: 22, gap: 50 }
]

const employerEngagement = [
  { month: 'Jan', visits: 45, applications: 234, hires: 18 },
  { month: 'Feb', visits: 52, applications: 289, hires: 22 },
  { month: 'Mar', visits: 48, applications: 267, hires: 19 },
  { month: 'Apr', visits: 67, applications: 356, hires: 28 },
  { month: 'May', visits: 71, applications: 398, hires: 31 },
  { month: 'Jun', visits: 59, applications: 312, hires: 25 }
]

const industryDistribution = [
  { name: 'Technology', value: 45, color: '#0088FE', growth: 8 },
  { name: 'Financial Services', value: 20, color: '#00C49F', growth: 12 },
  { name: 'Healthcare', value: 15, color: '#FFBB28', growth: 15 },
  { name: 'Consulting', value: 10, color: '#FF8042', growth: 5 },
  { name: 'Startups', value: 6, color: '#8884d8', growth: 22 },
  { name: 'Government', value: 4, color: '#82ca9d', growth: -3 }
]

const salaryTrends = [
  { major: 'Computer Science', entry: 78000, mid: 110000, senior: 150000 },
  { major: 'Software Engineering', entry: 75000, mid: 105000, senior: 145000 },
  { major: 'Data Science', entry: 82000, mid: 120000, senior: 170000 },
  { major: 'Cybersecurity', entry: 73000, mid: 108000, senior: 155000 }
]

const competitorAnalysis = [
  { university: 'MIT', placementRate: 92, avgSalary: 95000, rank: 1 },
  { university: 'Stanford', placementRate: 90, avgSalary: 98000, rank: 2 },
  { university: 'Carnegie Mellon', placementRate: 89, avgSalary: 92000, rank: 3 },
  { university: 'Our University', placementRate: 85, avgSalary: 87000, rank: 7 },
  { university: 'UC Berkeley', placementRate: 86, avgSalary: 89000, rank: 5 }
]

export default function UniversityAnalytics() {
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('1year')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">University Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into student outcomes and program effectiveness
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
            <SelectItem value="2years">Last 2 Years</SelectItem>
            <SelectItem value="5years">Last 5 Years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="placement">Placement</TabsTrigger>
          <TabsTrigger value="skills">Skills Gap</TabsTrigger>
          <TabsTrigger value="employers">Employers</TabsTrigger>
          <TabsTrigger value="salary">Salary</TabsTrigger>
          <TabsTrigger value="benchmark">Benchmark</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">
                  +4% from last year
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Starting Salary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$87,000</div>
                <p className="text-xs text-muted-foreground">
                  +$5,000 from last year
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Employer Partners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">147</div>
                <p className="text-xs text-muted-foreground">
                  +23 new this year
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time to Placement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2 months</div>
                <p className="text-xs text-muted-foreground">
                  -0.5 months improvement
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Placement Rate Trends</CardTitle>
                <CardDescription>
                  5-year trend of graduate placement rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={placementTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="rate" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Industry Distribution</CardTitle>
                <CardDescription>
                  Where our graduates are being placed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={industryDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {industryDistribution.map((entry, index) => (
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

        <TabsContent value="placement" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Placement Rate by Major</CardTitle>
                <CardDescription>
                  Success rates across different programs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { major: 'Data Science', rate: 92 },
                    { major: 'Computer Science', rate: 88 },
                    { major: 'Software Engineering', rate: 85 },
                    { major: 'Cybersecurity', rate: 82 },
                    { major: 'Information Systems', rate: 79 }
                  ].map((item) => (
                    <div key={item.major} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.major}</span>
                        <span className="text-sm text-muted-foreground">{item.rate}%</span>
                      </div>
                      <Progress value={item.rate} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Time to Placement Distribution</CardTitle>
                <CardDescription>
                  How long students take to find employment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { timeframe: 'Before Graduation', percentage: 35 },
                    { timeframe: '0-1 months', percentage: 28 },
                    { timeframe: '1-3 months', percentage: 22 },
                    { timeframe: '3-6 months', percentage: 12 },
                    { timeframe: '6+ months', percentage: 3 }
                  ].map((item) => (
                    <div key={item.timeframe} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.timeframe}</span>
                        <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Graduate Outcomes Over Time</CardTitle>
              <CardDescription>
                Employment status progression for recent graduates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={placementTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="rate" fill="#8884d8" name="Placement Rate %" />
                  <Line yAxisId="right" type="monotone" dataKey="avgSalary" stroke="#82ca9d" strokeWidth={3} name="Avg Salary" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skills Gap Analysis</CardTitle>
              <CardDescription>
                Market demand vs student proficiency in key technologies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {skillsInDemand.map((skill) => (
                  <div key={skill.skill} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{skill.skill}</h3>
                      <Badge variant={skill.gap > 30 ? 'destructive' : skill.gap > 15 ? 'default' : 'secondary'}>
                        {skill.gap}% gap
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Market Demand</span>
                          <span>{skill.demand}%</span>
                        </div>
                        <Progress value={skill.demand} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Student Proficiency</span>
                          <span>{skill.students}%</span>
                        </div>
                        <Progress value={skill.students} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Curriculum Recommendations</CardTitle>
                <CardDescription>
                  Suggested improvements based on market gaps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { priority: 'High', recommendation: 'Add comprehensive AWS certification track' },
                    { priority: 'High', recommendation: 'Integrate Docker/Kubernetes in DevOps course' },
                    { priority: 'Medium', recommendation: 'Expand Machine Learning practical projects' },
                    { priority: 'Medium', recommendation: 'Include TypeScript in web development curriculum' },
                    { priority: 'Low', recommendation: 'Add advanced React patterns workshop' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Badge variant={
                        item.priority === 'High' ? 'destructive' : 
                        item.priority === 'Medium' ? 'default' : 'secondary'
                      }>
                        {item.priority}
                      </Badge>
                      <p className="text-sm flex-1">{item.recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Industry Partnerships</CardTitle>
                <CardDescription>
                  Companies that could help bridge skill gaps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { company: 'Amazon Web Services', skills: ['AWS', 'Cloud Computing'], type: 'Training Partner' },
                    { company: 'Google', skills: ['Machine Learning', 'TensorFlow'], type: 'Education Partner' },
                    { company: 'Microsoft', skills: ['Azure', 'TypeScript'], type: 'Technology Partner' },
                    { company: 'Docker Inc.', skills: ['Containerization', 'DevOps'], type: 'Training Partner' }
                  ].map((partner, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{partner.company}</span>
                        <Badge variant="outline">{partner.type}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {partner.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employer Engagement Trends</CardTitle>
              <CardDescription>
                Monthly activity from recruiting partners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={employerEngagement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="visits" stroke="#8884d8" strokeWidth={2} name="Company Visits" />
                  <Line type="monotone" dataKey="applications" stroke="#82ca9d" strokeWidth={2} name="Applications" />
                  <Line type="monotone" dataKey="hires" stroke="#ffc658" strokeWidth={2} name="Hires" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Hiring Partners</CardTitle>
                <CardDescription>
                  Companies with highest hiring volumes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { company: 'Google', hires: 23, growth: 15 },
                    { company: 'Microsoft', hires: 19, growth: 8 },
                    { company: 'Amazon', hires: 16, growth: 22 },
                    { company: 'Meta', hires: 12, growth: -5 },
                    { company: 'Apple', hires: 9, growth: 12 }
                  ].map((company) => (
                    <div key={company.company} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{company.company}</p>
                        <p className="text-sm text-muted-foreground">{company.hires} hires this year</p>
                      </div>
                      <Badge variant={company.growth > 0 ? 'default' : 'destructive'}>
                        {company.growth > 0 ? '+' : ''}{company.growth}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recruitment Events</CardTitle>
                <CardDescription>
                  Upcoming and recent employer events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { event: 'Spring Career Fair', date: 'March 15, 2024', companies: 45, type: 'Career Fair' },
                    { event: 'Tech Talk: AI at Scale', date: 'March 22, 2024', companies: 1, type: 'Tech Talk' },
                    { event: 'Startup Showcase', date: 'April 5, 2024', companies: 12, type: 'Networking' },
                    { event: 'Industry Panel Discussion', date: 'April 18, 2024', companies: 6, type: 'Panel' }
                  ].map((event, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{event.event}</span>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {event.date} • {event.companies} {event.companies === 1 ? 'company' : 'companies'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="salary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Salary Progression by Major</CardTitle>
              <CardDescription>
                Career progression and earning potential across programs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={salaryTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="major" />
                  <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Bar dataKey="entry" fill="#8884d8" name="Entry Level" />
                  <Bar dataKey="mid" fill="#82ca9d" name="Mid Level" />
                  <Bar dataKey="senior" fill="#ffc658" name="Senior Level" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Salary Growth Factors</CardTitle>
                <CardDescription>
                  Skills and factors that drive higher compensation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { factor: 'Machine Learning Expertise', impact: '+$15,000' },
                    { factor: 'Full-Stack Development', impact: '+$12,000' },
                    { factor: 'Cloud Certifications (AWS/Azure)', impact: '+$10,000' },
                    { factor: 'Leadership Experience', impact: '+$8,000' },
                    { factor: 'Open Source Contributions', impact: '+$6,000' }
                  ].map((item) => (
                    <div key={item.factor} className="flex items-center justify-between">
                      <span className="text-sm">{item.factor}</span>
                      <Badge className="bg-green-600">{item.impact}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Salary Comparison</CardTitle>
                <CardDescription>
                  Average starting salaries by location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { location: 'San Francisco Bay Area', salary: 115000, col: 'High' },
                    { location: 'Seattle', salary: 105000, col: 'High' },
                    { location: 'New York City', salary: 98000, col: 'Very High' },
                    { location: 'Austin', salary: 92000, col: 'Medium' },
                    { location: 'Boston', salary: 88000, col: 'High' },
                    { location: 'Chicago', salary: 82000, col: 'Medium' }
                  ].map((location) => (
                    <div key={location.location} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{location.location}</p>
                        <p className="text-sm text-muted-foreground">Cost of Living: {location.col}</p>
                      </div>
                      <p className="font-medium">${(location.salary / 1000).toFixed(0)}k</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="benchmark" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Competitive Analysis</CardTitle>
              <CardDescription>
                How we compare to peer institutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competitorAnalysis.map((university) => (
                  <div key={university.university} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                          #{university.rank}
                        </div>
                        <div>
                          <h3 className="font-medium">{university.university}</h3>
                          <p className="text-sm text-muted-foreground">
                            {university.university === 'Our University' ? 'Current Institution' : 'Competitor'}
                          </p>
                        </div>
                      </div>
                      {university.university === 'Our University' && (
                        <Badge variant="outline">Us</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Placement Rate</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-lg">{university.placementRate}%</p>
                          <Progress value={university.placementRate} className="flex-1 h-2" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Average Salary</p>
                        <p className="font-medium text-lg">${(university.avgSalary / 1000).toFixed(0)}k</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Improvement Opportunities</CardTitle>
                <CardDescription>
                  Areas where we can gain competitive advantage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { area: 'Industry Partnerships', gap: '15 fewer than top performers', priority: 'High' },
                    { area: 'Alumni Network Engagement', gap: '20% lower participation', priority: 'Medium' },
                    { area: 'Placement Rate', gap: '7% below top tier', priority: 'High' },
                    { area: 'Starting Salaries', gap: '$8k below competitors', priority: 'Medium' },
                    { area: 'Career Services', gap: 'Limited AI-powered matching', priority: 'High' }
                  ].map((item) => (
                    <div key={item.area} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.area}</span>
                        <Badge variant={item.priority === 'High' ? 'destructive' : 'default'}>
                          {item.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.gap}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ranking Factors</CardTitle>
                <CardDescription>
                  Key metrics that influence institutional rankings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { metric: 'Graduate Employment Rate', weight: '25%', score: 85 },
                    { metric: 'Starting Salary Outcomes', weight: '20%', score: 78 },
                    { metric: 'Industry Recognition', weight: '15%', score: 82 },
                    { metric: 'Alumni Success', weight: '15%', score: 79 },
                    { metric: 'Employer Satisfaction', weight: '15%', score: 88 },
                    { metric: 'Innovation Index', weight: '10%', score: 75 }
                  ].map((metric) => (
                    <div key={metric.metric} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{metric.metric}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{metric.weight}</span>
                          <span className="text-sm font-medium">{metric.score}/100</span>
                        </div>
                      </div>
                      <Progress value={metric.score} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}