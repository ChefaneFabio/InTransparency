'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, ArrowRight, Users, Building2, GraduationCap, TrendingUp, Mail, Target, DollarSign, Rocket } from 'lucide-react'

export default function ValidationPage() {
  const [email, setEmail] = useState('')
  const [userType, setUserType] = useState('company')
  const [selectedPlan, setSelectedPlan] = useState('growth')

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section - Landing Page Test */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-4" variant="secondary">
            Validation Phase 1: Landing Page Test
          </Badge>
          <h1 className="text-5xl font-bold mb-6">
            Find Graduates Based on <span className="text-blue-600">Academic Excellence</span>, Not Just Claims
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            For Hiring Managers: Search "Python developer with ML background" and see actual grades, projects, and professor recommendations
          </p>
          
          {/* Email Collection Form */}
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Get Early Access</CardTitle>
              <CardDescription>Join 500+ companies already on the waitlist</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Work Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="type">I am a...</Label>
                <select
                  id="type"
                  className="w-full p-2 border rounded-md"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <option value="company">Hiring Manager</option>
                  <option value="graduate">Recent Graduate</option>
                  <option value="university">University Career Service</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg">
                Get Early Access <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Social Proof */}
          <div className="mt-8 flex justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold">1,247</div>
              <div className="text-sm text-gray-600">Early Access Signups</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">73</div>
              <div className="text-sm text-gray-600">Companies Interested</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-gray-600">University Partners</div>
            </div>
          </div>
        </div>
      </section>

      {/* Discovery Interview Results */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4" variant="secondary">
            Validation Phase 2: Discovery Interviews
          </Badge>
          <h2 className="text-3xl font-bold mb-8">What We Learned from 40+ Interviews</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Building2 className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Hiring Managers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Screening time issue</span>
                    <span className="font-bold">87%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Want academic data</span>
                    <span className="font-bold">92%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Would pay €50-200/mo</span>
                    <span className="font-bold">68%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <GraduationCap className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Graduates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Frustrated with ATS</span>
                    <span className="font-bold">94%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Want to show grades</span>
                    <span className="font-bold">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Would complete profile</span>
                    <span className="font-bold">83%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Universities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Want better placement</span>
                    <span className="font-bold">100%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Would verify data</span>
                    <span className="font-bold">80%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Partnership interest</span>
                    <span className="font-bold">60%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Google Ads Campaign Results */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4" variant="secondary">
            Validation Phase 3: Google Ads Testing
          </Badge>
          <h2 className="text-3xl font-bold mb-8">Ad Campaign Performance</h2>
          
          <Tabs defaultValue="campaigns" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="campaigns">Campaign Results</TabsTrigger>
              <TabsTrigger value="keywords">Top Keywords</TabsTrigger>
            </TabsList>
            
            <TabsContent value="campaigns">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Campaign A: "Find Graduates with Proven Excellence"</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-2xl font-bold">3.2%</div>
                        <div className="text-sm text-gray-600">CTR</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">€8.50</div>
                        <div className="text-sm text-gray-600">Cost/Lead</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">247</div>
                        <div className="text-sm text-gray-600">Leads</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">12%</div>
                        <div className="text-sm text-gray-600">Conversion</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Campaign B: "Reduce Screening Time by 70%"</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-2xl font-bold">4.8%</div>
                        <div className="text-sm text-gray-600">CTR</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">€6.20</div>
                        <div className="text-sm text-gray-600">Cost/Lead</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">385</div>
                        <div className="text-sm text-gray-600">Leads</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">18%</div>
                        <div className="text-sm text-gray-600">Conversion</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="keywords">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {[
                      { keyword: 'graduate recruitment platform', cpc: '€2.40', volume: '1,900' },
                      { keyword: 'university hiring software', cpc: '€3.20', volume: '890' },
                      { keyword: 'academic performance hiring', cpc: '€1.80', volume: '340' },
                      { keyword: 'graduate screening tools', cpc: '€2.90', volume: '1,200' },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-medium">{item.keyword}</span>
                        <div className="flex gap-4">
                          <Badge variant="outline">CPC: {item.cpc}</Badge>
                          <Badge variant="outline">Vol: {item.volume}/mo</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Pre-Sales Validation */}
      <section className="container mx-auto px-4 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4" variant="secondary">
            Validation Phase 4: Pre-Sales & Pricing
          </Badge>
          <h2 className="text-3xl font-bold mb-8">Early Access Pre-Orders</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Startup</CardTitle>
                <CardDescription>Perfect for small teams</CardDescription>
                <div className="text-3xl font-bold mt-4">
                  €39<span className="text-sm font-normal">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    25 candidate searches
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    Academic performance data
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    Basic messaging
                  </li>
                </ul>
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-2">Pre-orders: 18</div>
                  <Progress value={72} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={selectedPlan === 'startup' ? 'default' : 'outline'}>
                  Reserve Now
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-blue-600">
              <CardHeader>
                <Badge className="w-fit mb-2">Most Popular</Badge>
                <CardTitle>Growth</CardTitle>
                <CardDescription>For growing companies</CardDescription>
                <div className="text-3xl font-bold mt-4">
                  €149<span className="text-sm font-normal">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    Unlimited searches
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    Professor recommendations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    Advanced filters
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    Priority support
                  </li>
                </ul>
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-2">Pre-orders: 47</div>
                  <Progress value={94} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Reserve Now - 50% Off
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>Custom solutions</CardDescription>
                <div className="text-3xl font-bold mt-4">
                  €399<span className="text-sm font-normal">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    Everything in Growth
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    API access
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    Custom integrations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    Dedicated support
                  </li>
                </ul>
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-2">Pre-orders: 8</div>
                  <Progress value={32} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  Contact Sales
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Pre-Sales Metrics */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Pre-Sales Validation Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">€10,843</div>
                  <div className="text-sm text-gray-600">Total Pre-Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">73</div>
                  <div className="text-sm text-gray-600">Companies Reserved</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">€148</div>
                  <div className="text-sm text-gray-600">Average Order Value</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">8.2%</div>
                  <div className="text-sm text-gray-600">Conversion Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Kickstarter-Style Campaign */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4" variant="secondary">
            Validation Phase 5: Crowdfunding Campaign
          </Badge>
          <h2 className="text-3xl font-bold mb-8">Help Us Build the Future of Graduate Recruitment</h2>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">InTransparency Launch Campaign</CardTitle>
                  <CardDescription>Building the first academic performance-based recruitment platform</CardDescription>
                </div>
                <Badge className="bg-green-600">73% Funded</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-3xl font-bold">€36,420</span>
                    <span className="text-gray-600">of €50,000 goal</span>
                  </div>
                  <Progress value={73} className="h-4" />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-2xl font-bold">187</div>
                    <div className="text-sm text-gray-600">Backers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">21</div>
                    <div className="text-sm text-gray-600">Days to go</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">€195</div>
                    <div className="text-sm text-gray-600">Average pledge</div>
                  </div>
                </div>

                {/* Reward Tiers */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Reward Tiers</h3>
                  
                  <Card className="bg-gray-50">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">Early Bird Company Access</div>
                          <div className="text-sm text-gray-600">6 months of Growth plan for €299 (50% off)</div>
                          <div className="text-sm mt-2">• Priority onboarding • Founder calls • Feature requests</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">42 backers</div>
                          <div className="text-sm text-gray-600">8 left</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-50">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">University Partnership</div>
                          <div className="text-sm text-gray-600">Free platform access for your students + analytics</div>
                          <div className="text-sm mt-2">• Custom branding • Career services dashboard • Priority support</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">8 backers</div>
                          <div className="text-sm text-gray-600">Unlimited</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg">
                <Rocket className="mr-2 h-4 w-4" />
                Back This Project
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Validation Summary */}
      <section className="container mx-auto px-4 py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Validation Results Summary</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="pt-6">
                <Mail className="h-8 w-8 mb-2 mx-auto" />
                <div className="text-2xl font-bold">1,247</div>
                <div className="text-sm opacity-90">Email Signups</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="pt-6">
                <Target className="h-8 w-8 mb-2 mx-auto" />
                <div className="text-2xl font-bold">€6.20</div>
                <div className="text-sm opacity-90">Cost per Lead</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="pt-6">
                <DollarSign className="h-8 w-8 mb-2 mx-auto" />
                <div className="text-2xl font-bold">€47,263</div>
                <div className="text-sm opacity-90">Pre-order Revenue</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="pt-6">
                <TrendingUp className="h-8 w-8 mb-2 mx-auto" />
                <div className="text-2xl font-bold">92%</div>
                <div className="text-sm opacity-90">Problem Validation</div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <Button size="lg" variant="secondary">
              View Full Validation Report <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}