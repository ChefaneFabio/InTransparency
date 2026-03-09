'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  Star,
  Shield,
  Eye,
  MessageSquare,
  TrendingUp,
  Search,
  Filter,
  Briefcase,
  GraduationCap,
  BarChart3,
  Users,
  FileCheck,
  Sparkles,
} from 'lucide-react'
import { useSegment } from '@/lib/segment-context'
import { useTranslations } from 'next-intl'

function StudentPortfolioMockup() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-2xl overflow-hidden">
      {/* Browser chrome */}
      <div className="bg-muted/80 px-4 py-2.5 flex items-center gap-2 border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 bg-background/60 rounded-md px-3 py-1 text-xs text-muted-foreground ml-2">
          intransparency.it/portfolio/marco-r
        </div>
      </div>

      {/* Portfolio content */}
      <div className="p-5">
        {/* Profile header */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
            MR
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">Marco Rossi</span>
              <Badge className="bg-primary/10 text-primary text-[10px] px-1.5 py-0">
                <Shield className="h-2.5 w-2.5 mr-0.5" />
                Verified
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">ITIS Galileo Galilei, Roma</p>
            <div className="flex gap-2 mt-1.5">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Web Dev</Badge>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">React</Badge>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Node.js</Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-primary">
              <Star className="h-3.5 w-3.5 fill-primary" />
              <span className="text-sm font-bold">4.8</span>
            </div>
            <p className="text-[10px] text-muted-foreground">12 projects</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-primary/5 rounded-lg p-2.5 text-center">
            <Eye className="h-3.5 w-3.5 text-primary mx-auto mb-1" />
            <div className="text-sm font-bold text-foreground">284</div>
            <div className="text-[10px] text-muted-foreground">Profile views</div>
          </div>
          <div className="bg-primary/5 rounded-lg p-2.5 text-center">
            <MessageSquare className="h-3.5 w-3.5 text-primary mx-auto mb-1" />
            <div className="text-sm font-bold text-foreground">7</div>
            <div className="text-[10px] text-muted-foreground">Company contacts</div>
          </div>
          <div className="bg-primary/5 rounded-lg p-2.5 text-center">
            <CheckCircle className="h-3.5 w-3.5 text-primary mx-auto mb-1" />
            <div className="text-sm font-bold text-foreground">210h</div>
            <div className="text-[10px] text-muted-foreground">PCTO completed</div>
          </div>
        </div>

        {/* Projects */}
        <div className="space-y-2.5">
          <p className="text-xs font-semibold text-foreground">Verified Projects</p>
          {[
            { name: 'E-commerce Platform', badge: 'PCTO', grade: '9/10', verified: true },
            { name: 'IoT Dashboard', badge: 'Stage', grade: '8/10', verified: true },
          ].map((project) => (
            <div key={project.name} className="flex items-center justify-between bg-muted/30 rounded-lg p-2.5 border border-border/50">
              <div className="flex items-center gap-2">
                <FileCheck className="h-3.5 w-3.5 text-primary" />
                <div>
                  <p className="text-xs font-medium text-foreground">{project.name}</p>
                  <Badge variant="outline" className="text-[9px] px-1 py-0 mt-0.5">{project.badge}</Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-foreground">{project.grade}</span>
                {project.verified && (
                  <Shield className="h-3.5 w-3.5 text-primary" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CompanySearchMockup() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-2xl overflow-hidden">
      {/* Browser chrome */}
      <div className="bg-muted/80 px-4 py-2.5 flex items-center gap-2 border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 bg-background/60 rounded-md px-3 py-1 text-xs text-muted-foreground ml-2">
          intransparency.it/explore
        </div>
      </div>

      <div className="p-5">
        {/* Search bar */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2 border border-border">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">React developer, Milano...</span>
          </div>
          <div className="flex items-center gap-1 bg-primary/10 rounded-lg px-2.5 py-2 border border-primary/20">
            <Filter className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs text-primary font-medium">Filters</span>
          </div>
        </div>

        {/* AI match banner */}
        <div className="bg-primary/5 rounded-lg p-2.5 mb-4 flex items-center gap-2 border border-primary/10">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-xs text-foreground">
            <strong>AI Match:</strong> 47 verified candidates match your search
          </span>
        </div>

        {/* Results */}
        <div className="space-y-2.5">
          {[
            { name: 'Sofia B.', school: 'Politecnico di Milano', match: 94, skills: ['React', 'TypeScript', 'Node.js'], verified: true },
            { name: 'Marco R.', school: 'ITIS Galilei, Roma', match: 91, skills: ['React', 'Python', 'AWS'], verified: true },
            { name: 'Elena V.', school: 'ITS Rizzoli, Milano', match: 87, skills: ['React', 'Vue.js', 'Docker'], verified: true },
          ].map((candidate) => (
            <div key={candidate.name} className="flex items-center justify-between bg-muted/20 rounded-lg p-3 border border-border/50 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-semibold text-xs">
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-foreground">{candidate.name}</span>
                    {candidate.verified && <Shield className="h-3 w-3 text-primary" />}
                  </div>
                  <p className="text-[10px] text-muted-foreground">{candidate.school}</p>
                  <div className="flex gap-1 mt-1">
                    {candidate.skills.map(s => (
                      <Badge key={s} variant="secondary" className="text-[9px] px-1 py-0">{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-primary">{candidate.match}%</div>
                <p className="text-[10px] text-muted-foreground">match</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function InstitutionDashboardMockup() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-2xl overflow-hidden">
      {/* Browser chrome */}
      <div className="bg-muted/80 px-4 py-2.5 flex items-center gap-2 border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 bg-background/60 rounded-md px-3 py-1 text-xs text-muted-foreground ml-2">
          intransparency.it/dashboard/institution
        </div>
      </div>

      <div className="p-5">
        {/* Dashboard header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">Institution Dashboard</h3>
            <p className="text-[10px] text-muted-foreground">ITIS Galileo Galilei, Roma</p>
          </div>
          <Badge className="bg-primary/10 text-primary text-[10px]">
            <Users className="h-3 w-3 mr-1" />
            450 students
          </Badge>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { label: 'Verified', value: '342', icon: Shield, trend: '+28' },
            { label: 'Contacted', value: '89', icon: MessageSquare, trend: '+12' },
            { label: 'Placed', value: '34', icon: Briefcase, trend: '+5' },
            { label: 'Views', value: '2.4K', icon: Eye, trend: '+340' },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-muted/30 rounded-lg p-2 text-center border border-border/50">
                <Icon className="h-3 w-3 text-primary mx-auto mb-1" />
                <div className="text-sm font-bold text-foreground">{stat.value}</div>
                <div className="text-[9px] text-muted-foreground">{stat.label}</div>
                <div className="text-[9px] text-primary font-medium">{stat.trend}</div>
              </div>
            )
          })}
        </div>

        {/* Mini chart area */}
        <div className="bg-muted/20 rounded-lg p-3 mb-4 border border-border/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground">Company Interest</span>
            <Badge variant="outline" className="text-[9px]">Last 30 days</Badge>
          </div>
          <div className="flex items-end gap-1 h-12">
            {[3, 5, 4, 7, 6, 8, 5, 9, 7, 11, 8, 12, 10, 14, 11].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-primary/30 rounded-t"
                style={{ height: `${(h / 14) * 100}%` }}
              />
            ))}
          </div>
        </div>

        {/* Pending verifications */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground">Pending Verifications</span>
            <Badge className="bg-amber-100 text-amber-700 text-[9px]">8 pending</Badge>
          </div>
          {[
            { student: 'Luca M.', project: 'Web App PCTO', date: '2h ago' },
            { student: 'Anna G.', project: 'IoT Project', date: '5h ago' },
          ].map((item) => (
            <div key={item.student} className="flex items-center justify-between bg-muted/20 rounded-lg p-2 mb-1.5 border border-border/50">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                <div>
                  <p className="text-[11px] font-medium text-foreground">{item.student}</p>
                  <p className="text-[9px] text-muted-foreground">{item.project}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-muted-foreground">{item.date}</span>
                <div className="flex gap-1">
                  <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function PlatformPreview() {
  const { segment } = useSegment()
  const t = useTranslations('home.platformPreview')

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-sm font-medium tracking-wide text-primary uppercase mb-3">
            {t('badge')}
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          {segment === 'students' && <StudentPortfolioMockup />}
          {segment === 'companies' && <CompanySearchMockup />}
          {segment === 'institutions' && <InstitutionDashboardMockup />}
        </motion.div>
      </div>
    </section>
  )
}
