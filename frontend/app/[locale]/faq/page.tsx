'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, Search, GraduationCap, Building2, Briefcase, CreditCard, Shield, HelpCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqs: FAQItem[] = [
  // Studenti
  {
    category: 'students',
    question: 'Come posso creare un account studente?',
    answer: 'Puoi registrarti gratuitamente cliccando su "Registrati" e selezionando "Studente". Dovrai fornire il tuo nome, email e creare una password. Dopo la registrazione, potrai completare il tuo profilo e connettere la tua università.'
  },
  {
    category: 'students',
    question: 'Come connetto la mia università?',
    answer: 'Dalla tua dashboard, vai alla sezione "Integrazione Università" e clicca su "Connetti Università". Cerca la tua università o ITS, inserisci la tua email istituzionale e verifica il tuo account. Una volta verificato, i tuoi voti e progetti potranno essere sincronizzati automaticamente.'
  },
  {
    category: 'students',
    question: 'I miei progetti sono visibili a tutti?',
    answer: 'No, hai il controllo completo sulla visibilità del tuo profilo. Puoi scegliere di rendere il tuo portfolio pubblico o privato. Puoi anche selezionare quali progetti mostrare e quali nascondere.'
  },
  {
    category: 'students',
    question: 'Come funziona il programma referral?',
    answer: 'Invita i tuoi amici usando il tuo link referral. Per ogni 3 amici che si registrano, ottieni 1 mese di Premium gratuito. Con 10 referral ottieni 6 mesi, e con 50 referral ottieni Premium a vita!'
  },
  {
    category: 'students',
    question: 'Quanto costa InTransparency per gli studenti?',
    answer: 'InTransparency è completamente gratuito per gli studenti! Offriamo anche piani Premium opzionali con funzionalità avanzate come analisi AI approfondite e maggiore visibilità.'
  },

  // Aziende
  {
    category: 'companies',
    question: 'Come posso trovare candidati?',
    answer: 'Puoi utilizzare la nostra ricerca avanzata per filtrare candidati per competenze, università, anno di laurea, GPA e altro. Il nostro sistema di matching AI ti suggerisce automaticamente i candidati più adatti alle tue posizioni aperte.'
  },
  {
    category: 'companies',
    question: 'Quanto costa contattare un candidato?',
    answer: 'Con il piano Pay-per-Contact, ogni contatto costa €5. Se contatti più di 20 candidati al mese, ti consigliamo il piano Enterprise a €99/mese che include contatti illimitati, filtri avanzati e accesso API.'
  },
  {
    category: 'companies',
    question: 'Come funziona il matching AI?',
    answer: 'Il nostro algoritmo analizza i progetti degli studenti, le competenze verificate, i voti universitari e le preferenze per calcolare un punteggio di compatibilità. Più alto è il punteggio, migliore è il match con le tue esigenze.'
  },
  {
    category: 'companies',
    question: 'Posso pubblicare offerte di lavoro?',
    answer: 'Sì! Puoi pubblicare offerte di lavoro dalla tua dashboard. Gli studenti potranno candidarsi direttamente e riceverai notifiche per ogni nuova candidatura.'
  },

  // Università
  {
    category: 'universities',
    question: 'Come può la mia università partecipare?',
    answer: 'Le università possono registrarsi gratuitamente e ottenere una dashboard dedicata per monitorare il placement dei propri studenti, vedere quali aziende sono interessate e accedere ad analytics dettagliate.'
  },
  {
    category: 'universities',
    question: 'Cos\'è il widget embeddabile?',
    answer: 'Il widget embeddabile (€500/anno) permette di integrare InTransparency direttamente nel vostro portale carriere. Mostra match in tempo reale e aumenta le registrazioni degli studenti del 40% in media.'
  },
  {
    category: 'universities',
    question: 'I dati degli studenti sono protetti?',
    answer: 'Assolutamente. Siamo conformi al GDPR e gli studenti hanno sempre il controllo sui propri dati. Le università possono vedere solo statistiche aggregate, non dati personali individuali senza consenso.'
  },

  // Pagamenti
  {
    category: 'payments',
    question: 'Quali metodi di pagamento accettate?',
    answer: 'Accettiamo tutte le principali carte di credito (Visa, Mastercard, American Express), PayPal e bonifico bancario per i piani Enterprise.'
  },
  {
    category: 'payments',
    question: 'Posso cancellare il mio abbonamento?',
    answer: 'Sì, puoi cancellare in qualsiasi momento dalla sezione Abbonamento della tua dashboard. L\'abbonamento rimarrà attivo fino alla fine del periodo di fatturazione corrente.'
  },
  {
    category: 'payments',
    question: 'Offrite rimborsi?',
    answer: 'Offriamo un rimborso completo entro 14 giorni dall\'acquisto se non sei soddisfatto del servizio. Contatta il supporto per richiedere un rimborso.'
  },

  // Privacy e Sicurezza
  {
    category: 'privacy',
    question: 'Come proteggete i miei dati?',
    answer: 'Utilizziamo crittografia end-to-end, server sicuri in Europa e seguiamo le best practice di sicurezza. Siamo conformi al GDPR e non vendiamo mai i tuoi dati a terzi.'
  },
  {
    category: 'privacy',
    question: 'Posso eliminare il mio account?',
    answer: 'Sì, puoi richiedere l\'eliminazione completa del tuo account e di tutti i dati associati in qualsiasi momento dalle impostazioni del profilo o contattando il supporto.'
  },
  {
    category: 'privacy',
    question: 'Chi può vedere il mio profilo?',
    answer: 'Hai il controllo completo. Puoi scegliere se rendere il profilo pubblico, visibile solo alle aziende verificate, o completamente privato. Puoi anche bloccare aziende specifiche.'
  }
]

const categories = [
  { id: 'all', label: 'Tutte', icon: HelpCircle },
  { id: 'students', label: 'Studenti', icon: GraduationCap },
  { id: 'companies', label: 'Aziende', icon: Briefcase },
  { id: 'universities', label: 'Università', icon: Building2 },
  { id: 'payments', label: 'Pagamenti', icon: CreditCard },
  { id: 'privacy', label: 'Privacy', icon: Shield }
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-16">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Domande Frequenti
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Trova risposte alle domande più comuni su InTransparency
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Cerca nelle FAQ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-6 text-lg"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <category.icon className="h-4 w-4" />
              {category.label}
            </Button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <Card className="p-8 text-center">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nessun risultato trovato
              </h3>
              <p className="text-gray-600">
                Prova a modificare i filtri o la ricerca
              </p>
            </Card>
          ) : (
            filteredFaqs.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="capitalize">
                      {categories.find(c => c.id === faq.category)?.label}
                    </Badge>
                    <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                  </div>
                  {openItems.includes(index) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {openItems.includes(index) && (
                  <CardContent className="pt-0 pb-6 px-6">
                    <div className="pl-4 border-l-2 border-blue-200">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Contact Section */}
        <Card className="mt-12 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Non hai trovato quello che cercavi?
            </h2>
            <p className="text-gray-600 mb-6">
              Il nostro team di supporto è pronto ad aiutarti
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/contact">
                  Contattaci
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:support@in-transparency.com">
                  support@in-transparency.com
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
