'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslations } from 'next-intl'

export default function TermsPage() {
  const t = useTranslations('terms')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-16">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Termini e Condizioni di Servizio
          </h1>
          <p className="text-gray-600">
            Ultimo aggiornamento: Gennaio 2026
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Accettazione dei Termini</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Utilizzando InTransparency, accetti di essere vincolato da questi Termini di Servizio.
                Se non accetti tutti i termini e le condizioni di questo accordo, non puoi accedere
                al servizio o utilizzarlo.
              </p>
              <p>
                InTransparency si riserva il diritto di modificare questi termini in qualsiasi momento.
                Ti informeremo di eventuali modifiche pubblicando i nuovi Termini di Servizio su questa pagina.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Descrizione del Servizio</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                InTransparency è una piattaforma che connette studenti universitari e di ITS con
                aziende e recruiter, facilitando il processo di ricerca di lavoro attraverso:
              </p>
              <ul>
                <li>Portfolio verificati con progetti accademici</li>
                <li>Integrazione con università e istituti tecnici superiori</li>
                <li>Matching intelligente basato su competenze e progetti</li>
                <li>Strumenti di comunicazione tra studenti e aziende</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Account Utente</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Per utilizzare alcune funzionalità del servizio, devi creare un account. Sei responsabile di:
              </p>
              <ul>
                <li>Mantenere la riservatezza delle credenziali del tuo account</li>
                <li>Tutte le attività che si verificano sotto il tuo account</li>
                <li>Notificare immediatamente qualsiasi uso non autorizzato del tuo account</li>
              </ul>
              <p>
                Devi avere almeno 16 anni per creare un account. Fornendo informazioni false o
                ingannevoli, violi questi termini e il tuo account potrebbe essere sospeso.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Contenuti degli Utenti</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Gli utenti possono caricare progetti, informazioni sul profilo e altri contenuti.
                Caricando contenuti, dichiari e garantisci che:
              </p>
              <ul>
                <li>Possiedi i diritti necessari sui contenuti che carichi</li>
                <li>I contenuti non violano diritti di terzi</li>
                <li>I contenuti non sono illegali, offensivi o inappropriati</li>
                <li>Le informazioni fornite sono accurate e veritiere</li>
              </ul>
              <p>
                InTransparency si riserva il diritto di rimuovere qualsiasi contenuto che violi
                questi termini o che sia altrimenti discutibile.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Verifica Universitaria</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                InTransparency offre la possibilità di verificare l'affiliazione universitaria
                tramite email istituzionale. Questa verifica:
              </p>
              <ul>
                <li>Conferma la tua appartenenza a un'istituzione educativa</li>
                <li>Aumenta la credibilità del tuo profilo</li>
                <li>Permette la sincronizzazione di dati accademici (dove disponibile)</li>
              </ul>
              <p>
                Non siamo responsabili per la disponibilità o l'accuratezza dei dati
                forniti dalle istituzioni educative partner.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Pagamenti e Abbonamenti</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Alcune funzionalità di InTransparency richiedono un abbonamento a pagamento:
              </p>
              <ul>
                <li>I prezzi sono indicati in Euro (EUR) e includono IVA dove applicabile</li>
                <li>Gli abbonamenti si rinnovano automaticamente salvo cancellazione</li>
                <li>Puoi cancellare il tuo abbonamento in qualsiasi momento</li>
                <li>I rimborsi sono soggetti alla nostra politica di rimborso</li>
              </ul>
              <p>
                Per le aziende con modello "pay-per-contact", ogni contatto viene addebitato
                secondo il listino prezzi corrente.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Proprietà Intellettuale</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Il servizio e i suoi contenuti originali, funzionalità e funzionalità sono e
                rimarranno di proprietà esclusiva di InTransparency e dei suoi licenzianti.
              </p>
              <p>
                I progetti e i contenuti caricati dagli utenti rimangono di proprietà degli
                utenti stessi. Caricando contenuti, concedi a InTransparency una licenza
                non esclusiva per visualizzare e distribuire tali contenuti sulla piattaforma.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Limitazione di Responsabilità</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                InTransparency non sarà responsabile per danni indiretti, incidentali, speciali,
                consequenziali o punitivi, inclusi senza limitazione, perdita di profitti, dati,
                uso, avviamento o altre perdite intangibili.
              </p>
              <p>
                Non garantiamo che il servizio sarà ininterrotto, sicuro o privo di errori.
                Il servizio viene fornito "così com'è" e "come disponibile".
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Privacy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                L'utilizzo del servizio è soggetto anche alla nostra Informativa sulla Privacy,
                che descrive come raccogliamo, utilizziamo e proteggiamo i tuoi dati personali
                in conformità con il GDPR e altre normative applicabili.
              </p>
              <p>
                Consulta la nostra <a href="/privacy" className="text-blue-600 hover:underline">
                Informativa sulla Privacy</a> per maggiori dettagli.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Legge Applicabile</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Questi Termini saranno regolati e interpretati in conformità con le leggi italiane,
                senza riguardo alle sue disposizioni sui conflitti di legge.
              </p>
              <p>
                Qualsiasi controversia derivante da o relativa a questi Termini sarà soggetta
                alla giurisdizione esclusiva dei tribunali di Milano, Italia.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Contatti</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Per domande su questi Termini di Servizio, contattaci a:
              </p>
              <ul>
                <li>Email: legal@in-transparency.com</li>
                <li>Sito web: www.in-transparency.com</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
