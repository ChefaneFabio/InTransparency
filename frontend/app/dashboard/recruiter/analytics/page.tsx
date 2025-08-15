'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList } from 'recharts'

const hiringFunnelData = [
  { name: 'Applications', value: 150, fill: '#0088FE' },
  { name: 'Phone Screen', value: 45, fill: '#00C49F' },
  { name: 'Technical Interview', value: 25, fill: '#FFBB28' },
  { name: 'Final Interview', value: 12, fill: '#FF8042' },
  { name: 'Offers Extended', value: 8, fill: '#8884d8' },
  { name: 'Offers Accepted', value: 6, fill: '#82ca9d' }
]

const sourcingData = [
  { source: 'InTransparency', candidates: 45, hires: 12, cost: 2400 },
  { source: 'LinkedIn', candidates: 38, hires: 8, cost: 4500 },
  { source: 'Indeed', candidates: 52, hires: 6, cost: 1800 },
  { source: 'Referrals', candidates: 23, hires: 9, cost: 0 },
  { source: 'Career Fair', candidates: 19, hires: 4, cost: 1200 }
]

const timeToHireData = [
  { month: 'Jan', days: 21 },
  { month: 'Feb', days: 18 },
  { month: 'Mar', days: 24 },
  { month: 'Apr', days: 19 },
  { month: 'May', days: 16 },
  { month: 'Jun', days: 22 }
]

const diversityData = [
  { category: 'Gender', male: 65, female: 35 },
  { category: 'Ethnicity', white: 45, asian: 25, hispanic: 15, black: 10, other: 5 },
  { category: 'Education', bachelor: 60, master: 30, phd: 10 }
]

const topSkills = [
  { skill: 'React', demand: 95, supply: 70, gap: 25 },
  { skill: 'Python', demand: 90, supply: 80, gap: 10 },
  { skill: 'TypeScript', demand: 85, supply: 60, gap: 25 },
  { skill: 'AWS', demand: 80, supply: 55, gap: 25 },
  { skill: 'Node.js', demand: 75, supply: 65, gap: 10 }
]

export default function RecruiterAnalytics() {
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('6months')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recruitment Analytics</h1>
          <p className="text-muted-foreground">
            Track hiring performance and optimize your recruitment process
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1month">Last Month</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="funnel">Hiring Funnel</TabsTrigger>
          <TabsTrigger value="sourcing">Sourcing</TabsTrigger>
          <TabsTrigger value="diversity">Diversity</TabsTrigger>
          <TabsTrigger value="skills">Skills Gap</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,284</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">
                  +8% from last period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Offers Extended</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">
                  +15% from last period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time to Hire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18 days</div>
                <p className="text-xs text-muted-foreground">
                  -2 days from last period
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Time to Hire Trend</CardTitle>
                <CardDescription>
                  Average days from application to offer acceptance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeToHireData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="days" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Rates</CardTitle>
                <CardDescription>
                  Success rates at each stage of the hiring process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Application to Phone Screen</span>
                      <span className="text-sm font-medium">30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Phone Screen to Technical</span>
                      <span className="text-sm font-medium">56%</span>
                    </div>
                    <Progress value={56} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Technical to Final Interview</span>
                      <span className="text-sm font-medium">48%</span>
                    </div>
                    <Progress value={48} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Interview to Offer</span>
                      <span className="text-sm font-medium">67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Offer Acceptance Rate</span>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hiring Funnel</CardTitle>
              <CardDescription>
                Candidate flow through the recruitment process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  {hiringFunnelData.map((stage, index) => (
                    <div key={stage.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{stage.name}</span>
                        <span className="text-sm text-muted-foreground">{stage.value}</span>
                      </div>
                      <Progress value={(stage.value / hiringFunnelData[0].value) * 100} className="h-3" />
                      {index > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {((stage.value / hiringFunnelData[index - 1].value) * 100).toFixed(1)}% conversion rate
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={hiringFunnelData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {hiringFunnelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sourcing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sourcing Performance</CardTitle>
              <CardDescription>
                Compare effectiveness of different candidate sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {sourcingData.map((source) => (
                  <div key={source.source} className="space-y-3 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-lg">{source.source}</h3>
                      <Badge variant={source.source === 'InTransparency' ? 'default' : 'secondary'}>
                        {((source.hires / source.candidates) * 100).toFixed(1)}% hire rate
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Candidates</p>
                        <p className="font-medium text-lg">{source.candidates}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Successful Hires</p>
                        <p className="font-medium text-lg">{source.hires}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Cost per Hire</p>
                        <p className="font-medium text-lg">
                          {source.cost === 0 ? 'Free' : `$${(source.cost / source.hires).toFixed(0)}`}
                        </p>
                      </div>
                    </div>
                    <Progress value={(source.hires / source.candidates) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diversity" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
                <CardDescription>
                  Current gender breakdown of candidates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Male</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <Progress value={65} className="h-3" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Female</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <Progress value={35} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Education Background</CardTitle>
                <CardDescription>
                  Educational qualifications of candidates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Bachelor's Degree</span>
                      <span className="font-medium">60%</span>
                    </div>
                    <Progress value={60} className="h-3" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Master's Degree</span>
                      <span className="font-medium">30%</span>
                    </div>
                    <Progress value={30} className="h-3" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>PhD</span>
                      <span className="font-medium">10%</span>
                    </div>
                    <Progress value={10} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Diversity Goals</CardTitle>
              <CardDescription>
                Progress towards diversity and inclusion targets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Underrepresented Minorities</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">25% / 30% goal</span>
                      <Badge variant="outline">83%</Badge>
                    </div>
                  </div>
                  <Progress value={83} className="h-3" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Women in Tech Roles</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">35% / 40% goal</span>
                      <Badge variant="outline">88%</Badge>
                    </div>
                  </div>
                  <Progress value={88} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skills Gap Analysis</CardTitle>
              <CardDescription>
                Market demand vs available talent for key skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {topSkills.map((skill) => (
                  <div key={skill.skill} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{skill.skill}</h3>
                      <Badge variant={skill.gap > 20 ? 'destructive' : skill.gap > 10 ? 'default' : 'secondary'}>
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
                          <span>Available Talent</span>
                          <span>{skill.supply}%</span>
                        </div>
                        <Progress value={skill.supply} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}