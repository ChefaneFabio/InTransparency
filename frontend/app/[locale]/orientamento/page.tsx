'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Compass,
  Target,
  TrendingUp,
  Briefcase,
  GraduationCap,
  Users,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Lightbulb,
  Building2,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default function OrientamentoPage({ params }: PageProps) {
  // For client component, we'll use Italian as default since this is /orientamento
  const locale = 'it'
  const isItalian = true

  const content = {
    it: {
      badge: 'Orientamento Professionale',
      title: 'Scopri il Tuo Percorso di Carriera',
      subtitle: 'Non sai cosa fare dopo gli studi? Ti aiutiamo a scoprire le opportunità più adatte alle tue competenze.',

      problemTitle: 'Il Problema dell\'Orientamento',
      problemSubtitle: 'Ogni anno migliaia di studenti si laureano senza sapere cosa fare',
      problems: [
        { title: 'Poca Visibilità', desc: 'Non conosci le opportunità reali del mercato del lavoro' },
        { title: 'Competenze Nascoste', desc: 'Non sai quali delle tue competenze sono più richieste' },
        { title: 'Nessun Feedback', desc: 'Non ricevi riscontro sul tuo profilo professionale' },
        { title: 'Confusione', desc: 'Troppi consigli generici, poche indicazioni concrete' }
      ],

      solutionTitle: 'Come Ti Aiutiamo',
      solutionSubtitle: 'Un approccio basato sui dati, non su opinioni',
      solutions: [
        {
          icon: Target,
          title: 'Analisi delle Competenze',
          desc: 'Caricare i tuoi progetti e il tuo percorso di studi ci permette di identificare le tue competenze più forti'
        },
        {
          icon: TrendingUp,
          title: 'Match con il Mercato',
          desc: 'Confrontiamo le tue competenze con quelle più richieste dalle aziende che cercano nel nostro marketplace'
        },
        {
          icon: Briefcase,
          title: 'Opportunità Reali',
          desc: 'Vedi quali aziende stanno cercando profili come il tuo, in tempo reale'
        },
        {
          icon: Lightbulb,
          title: 'Consigli Personalizzati',
          desc: 'Ricevi suggerimenti su quali competenze sviluppare per aumentare le tue opportunità'
        }
      ],

      howTitle: 'Come Funziona',
      howSteps: [
        { step: '1', title: 'Crea il Tuo Profilo', desc: 'Carica progetti, esami, esperienze' },
        { step: '2', title: 'Analisi Automatica', desc: 'Il sistema identifica le tue competenze chiave' },
        { step: '3', title: 'Vedi le Opportunità', desc: 'Scopri quali aziende cercano profili come il tuo' },
        { step: '4', title: 'Ricevi Contatti', desc: 'Le aziende interessate ti contattano direttamente' }
      ],

      statsTitle: 'Perché Funziona',
      stats: [
        { value: '92%', label: 'Match Accuracy', desc: 'Precisione nel matching competenze-richieste' },
        { value: '€10', label: 'Per Contatto', desc: 'Le aziende pagano per contattarti' },
        { value: '0€', label: 'Per Te', desc: 'Completamente gratuito per gli studenti' }
      ],

      pathsTitle: 'Percorsi di Carriera',
      pathsSubtitle: 'Scopri le aree con più opportunità per il tuo profilo',
      paths: [
        { icon: '💻', title: 'Tech & Development', roles: ['Software Engineer', 'Frontend Developer', 'Data Analyst'] },
        { icon: '📊', title: 'Business & Finance', roles: ['Business Analyst', 'Financial Controller', 'Consultant'] },
        { icon: '🎨', title: 'Design & Creative', roles: ['UX Designer', 'Product Designer', 'Brand Manager'] },
        { icon: '🔬', title: 'Engineering & Science', roles: ['Process Engineer', 'R&D Specialist', 'Quality Manager'] }
      ],

      testimonialTitle: 'Storie di Successo',
      testimonial: {
        quote: 'Non sapevo che le mie competenze in Python fossero così richieste. Grazie a InTransparency ho scoperto opportunità che non avrei mai cercato da solo.',
        author: 'Marco R.',
        role: 'Laureato in Ingegneria Gestionale'
      },

      ctaTitle: 'Inizia il Tuo Percorso',
      ctaSubtitle: 'Crea il tuo profilo gratuito e scopri le opportunità che ti aspettano',
      ctaButton: 'Crea Profilo Gratuito',
      ctaSecondary: 'Scopri Come Funziona'
    },
    en: {
      badge: 'Career Guidance',
      title: 'Discover Your Career Path',
      subtitle: 'Not sure what to do after graduation? We help you discover opportunities that match your skills.',

      problemTitle: 'The Guidance Problem',
      problemSubtitle: 'Every year thousands of students graduate without knowing what to do',
      problems: [
        { title: 'Limited Visibility', desc: 'You don\'t know the real opportunities in the job market' },
        { title: 'Hidden Skills', desc: 'You don\'t know which of your skills are most in demand' },
        { title: 'No Feedback', desc: 'You don\'t receive feedback on your professional profile' },
        { title: 'Confusion', desc: 'Too much generic advice, few concrete directions' }
      ],

      solutionTitle: 'How We Help',
      solutionSubtitle: 'A data-driven approach, not opinions',
      solutions: [
        {
          icon: Target,
          title: 'Skills Analysis',
          desc: 'Uploading your projects and study path allows us to identify your strongest skills'
        },
        {
          icon: TrendingUp,
          title: 'Market Match',
          desc: 'We compare your skills with those most requested by companies searching in our marketplace'
        },
        {
          icon: Briefcase,
          title: 'Real Opportunities',
          desc: 'See which companies are looking for profiles like yours, in real-time'
        },
        {
          icon: Lightbulb,
          title: 'Personalized Advice',
          desc: 'Receive suggestions on which skills to develop to increase your opportunities'
        }
      ],

      howTitle: 'How It Works',
      howSteps: [
        { step: '1', title: 'Create Your Profile', desc: 'Upload projects, exams, experiences' },
        { step: '2', title: 'Automatic Analysis', desc: 'The system identifies your key skills' },
        { step: '3', title: 'See Opportunities', desc: 'Discover which companies are looking for profiles like yours' },
        { step: '4', title: 'Receive Contacts', desc: 'Interested companies contact you directly' }
      ],

      statsTitle: 'Why It Works',
      stats: [
        { value: '92%', label: 'Match Accuracy', desc: 'Precision in skills-requirements matching' },
        { value: '€10', label: 'Per Contact', desc: 'Companies pay to contact you' },
        { value: '€0', label: 'For You', desc: 'Completely free for students' }
      ],

      pathsTitle: 'Career Paths',
      pathsSubtitle: 'Discover areas with the most opportunities for your profile',
      paths: [
        { icon: '💻', title: 'Tech & Development', roles: ['Software Engineer', 'Frontend Developer', 'Data Analyst'] },
        { icon: '📊', title: 'Business & Finance', roles: ['Business Analyst', 'Financial Controller', 'Consultant'] },
        { icon: '🎨', title: 'Design & Creative', roles: ['UX Designer', 'Product Designer', 'Brand Manager'] },
        { icon: '🔬', title: 'Engineering & Science', roles: ['Process Engineer', 'R&D Specialist', 'Quality Manager'] }
      ],

      testimonialTitle: 'Success Stories',
      testimonial: {
        quote: 'I didn\'t know my Python skills were so in demand. Thanks to InTransparency I discovered opportunities I would never have looked for on my own.',
        author: 'Marco R.',
        role: 'Management Engineering Graduate'
      },

      ctaTitle: 'Start Your Journey',
      ctaSubtitle: 'Create your free profile and discover the opportunities waiting for you',
      ctaButton: 'Create Free Profile',
      ctaSecondary: 'Learn How It Works'
    }
  }

  const t = content[isItalian ? 'it' : 'en']

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">
              <Compass className="h-3 w-3 mr-1" />
              {t.badge}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {t.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                <Link href={`/${locale}/auth/register?role=student`}>
                  {t.ctaButton}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={`/${locale}/how-it-works`}>
                  {t.ctaSecondary}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.problemTitle}</h2>
            <p className="text-lg text-gray-600">{t.problemSubtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.problems.map((problem, i) => (
              <Card key={i} className="border-red-200 bg-red-50/50">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <span className="text-red-500 text-xl">?</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{problem.title}</h3>
                  <p className="text-sm text-gray-600">{problem.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.solutionTitle}</h2>
            <p className="text-lg text-gray-600">{t.solutionSubtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {t.solutions.map((solution, i) => {
              const Icon = solution.icon
              return (
                <Card key={i} className="border-green-200 bg-green-50/30">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{solution.title}</h3>
                        <p className="text-sm text-gray-600">{solution.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.howTitle}</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {t.howSteps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {step.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
                {i < t.howSteps.length - 1 && (
                  <div className="hidden md:block absolute transform translate-x-full -translate-y-8">
                    <ArrowRight className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.statsTitle}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {t.stats.map((stat, i) => (
              <Card key={i} className="border-primary/20">
                <CardContent className="pt-6 text-center">
                  <p className="text-4xl font-bold text-primary mb-2">{stat.value}</p>
                  <p className="font-semibold text-gray-900 mb-1">{stat.label}</p>
                  <p className="text-sm text-gray-600">{stat.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Career Paths */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.pathsTitle}</h2>
            <p className="text-lg text-gray-600">{t.pathsSubtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.paths.map((path, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">{path.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-3">{path.title}</h3>
                  <ul className="space-y-2">
                    {path.roles.map((role, j) => (
                      <li key={j} className="text-sm text-gray-600 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        {role}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{t.testimonialTitle}</h2>
          </div>
          <Card className="bg-gradient-to-r from-primary/5 to-purple-50 border-primary/20">
            <CardContent className="pt-8 pb-8 text-center">
              <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
              <blockquote className="text-lg text-gray-700 italic mb-6">
                "{t.testimonial.quote}"
              </blockquote>
              <div>
                <p className="font-semibold text-gray-900">{t.testimonial.author}</p>
                <p className="text-sm text-gray-600">{t.testimonial.role}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">{t.ctaTitle}</h2>
          <p className="text-lg opacity-90 mb-8">{t.ctaSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href={`/${locale}/auth/register?role=student`}>
                {t.ctaButton}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
