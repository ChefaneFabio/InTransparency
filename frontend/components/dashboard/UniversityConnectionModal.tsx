'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  School,
  Search,
  CheckCircle,
  Mail,
  Loader2,
  Building2,
  MapPin,
  Shield,
  ArrowRight
} from 'lucide-react'

// List of Italian Universities and ITS
const ITALIAN_INSTITUTIONS = [
  // Major Universities
  { id: 'polimi', name: 'Politecnico di Milano', type: 'university', city: 'Milano', domains: ['polimi.it', 'mail.polimi.it'] },
  { id: 'unibocconi', name: 'Università Bocconi', type: 'university', city: 'Milano', domains: ['unibocconi.it', 'studbocconi.it'] },
  { id: 'unimi', name: 'Università degli Studi di Milano', type: 'university', city: 'Milano', domains: ['unimi.it', 'studenti.unimi.it'] },
  { id: 'unito', name: 'Università degli Studi di Torino', type: 'university', city: 'Torino', domains: ['unito.it', 'edu.unito.it'] },
  { id: 'polito', name: 'Politecnico di Torino', type: 'university', city: 'Torino', domains: ['polito.it', 'studenti.polito.it'] },
  { id: 'unibo', name: 'Alma Mater Studiorum - Università di Bologna', type: 'university', city: 'Bologna', domains: ['unibo.it', 'studio.unibo.it'] },
  { id: 'unipd', name: 'Università degli Studi di Padova', type: 'university', city: 'Padova', domains: ['unipd.it', 'studenti.unipd.it'] },
  { id: 'uniroma1', name: 'Sapienza Università di Roma', type: 'university', city: 'Roma', domains: ['uniroma1.it', 'studenti.uniroma1.it'] },
  { id: 'uniroma2', name: 'Università degli Studi di Roma Tor Vergata', type: 'university', city: 'Roma', domains: ['uniroma2.it'] },
  { id: 'uniroma3', name: 'Università degli Studi Roma Tre', type: 'university', city: 'Roma', domains: ['uniroma3.it'] },
  { id: 'unina', name: 'Università degli Studi di Napoli Federico II', type: 'university', city: 'Napoli', domains: ['unina.it', 'studenti.unina.it'] },
  { id: 'unifi', name: 'Università degli Studi di Firenze', type: 'university', city: 'Firenze', domains: ['unifi.it', 'stud.unifi.it'] },
  { id: 'unige', name: 'Università degli Studi di Genova', type: 'university', city: 'Genova', domains: ['unige.it', 'studenti.unige.it'] },
  { id: 'unipv', name: 'Università degli Studi di Pavia', type: 'university', city: 'Pavia', domains: ['unipv.it'] },
  { id: 'unicatt', name: 'Università Cattolica del Sacro Cuore', type: 'university', city: 'Milano', domains: ['unicatt.it', 'icatt.it'] },
  { id: 'luiss', name: 'LUISS Guido Carli', type: 'university', city: 'Roma', domains: ['luiss.it', 'studenti.luiss.it'] },
  { id: 'unive', name: 'Università Ca\' Foscari Venezia', type: 'university', city: 'Venezia', domains: ['unive.it', 'stud.unive.it'] },
  { id: 'unitn', name: 'Università degli Studi di Trento', type: 'university', city: 'Trento', domains: ['unitn.it', 'studenti.unitn.it'] },
  { id: 'unibz', name: 'Libera Università di Bolzano', type: 'university', city: 'Bolzano', domains: ['unibz.it'] },
  { id: 'units', name: 'Università degli Studi di Trieste', type: 'university', city: 'Trieste', domains: ['units.it'] },

  // ITS (Istituti Tecnici Superiori)
  { id: 'its-rizzoli', name: 'ITS Angelo Rizzoli', type: 'its', city: 'Milano', domains: ['itsrizzoli.it'] },
  { id: 'its-maker', name: 'ITS Maker', type: 'its', city: 'Bologna', domains: ['itsmaker.it'] },
  { id: 'its-cantieri', name: 'ITS Cantieri dell\'Arte', type: 'its', city: 'Roma', domains: ['itscantieridellarte.it'] },
  { id: 'its-moda', name: 'ITS Moda', type: 'its', city: 'Milano', domains: ['itsmoda.it'] },
  { id: 'its-ict', name: 'ITS ICT Piemonte', type: 'its', city: 'Torino', domains: ['itsictpiemonte.it'] },
  { id: 'its-energia', name: 'ITS Energia e Ambiente', type: 'its', city: 'Colle Val d\'Elsa', domains: ['its-energiaeambiente.it'] },
  { id: 'its-kennedy', name: 'ITS Kennedy', type: 'its', city: 'Pordenone', domains: ['itskennedy.it'] },
  { id: 'its-natta', name: 'ITS Giulio Natta', type: 'its', city: 'Bergamo', domains: ['itsnatta.it'] },
  { id: 'its-agroalimentare', name: 'ITS Agroalimentare Puglia', type: 'its', city: 'Locorotondo', domains: ['itsagroalimentarepuglia.it'] },
  { id: 'its-turismo', name: 'ITS Turismo Veneto', type: 'its', city: 'Jesolo', domains: ['itsturismoveneto.it'] },
]

interface UniversityConnectionModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (institution: any, email: string) => Promise<void>
}

export function UniversityConnectionModal({ isOpen, onClose, onConnect }: UniversityConnectionModalProps) {
  const [step, setStep] = useState<'search' | 'verify' | 'success'>('search')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedInstitution, setSelectedInstitution] = useState<typeof ITALIAN_INSTITUTIONS[0] | null>(null)
  const [institutionalEmail, setInstitutionalEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const filteredInstitutions = ITALIAN_INSTITUTIONS.filter(inst =>
    inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inst.city.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectInstitution = (institution: typeof ITALIAN_INSTITUTIONS[0]) => {
    setSelectedInstitution(institution)
    setStep('verify')
    setError('')
  }

  const validateEmail = (email: string, domains: string[]) => {
    const emailDomain = email.split('@')[1]?.toLowerCase()
    return domains.some(d => emailDomain === d || emailDomain?.endsWith('.' + d))
  }

  const handleVerify = async () => {
    if (!selectedInstitution) return

    // Validate email domain
    if (!validateEmail(institutionalEmail, selectedInstitution.domains)) {
      setError(`L'email deve essere del dominio ${selectedInstitution.domains.join(' o ')}`)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await onConnect(selectedInstitution, institutionalEmail)
      setStep('success')
    } catch (err: any) {
      setError(err.message || 'Errore durante la connessione')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setStep('search')
    setSearchQuery('')
    setSelectedInstitution(null)
    setInstitutionalEmail('')
    setError('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <School className="h-5 w-5 text-blue-600" />
            {step === 'search' && 'Connetti la tua Università'}
            {step === 'verify' && 'Verifica Email Istituzionale'}
            {step === 'success' && 'Connessione Completata!'}
          </DialogTitle>
          <DialogDescription>
            {step === 'search' && 'Cerca e seleziona la tua università o ITS per sincronizzare voti e progetti'}
            {step === 'verify' && 'Inserisci la tua email istituzionale per verificare l\'appartenenza'}
            {step === 'success' && 'La tua università è stata connessa con successo'}
          </DialogDescription>
        </DialogHeader>

        {step === 'search' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cerca università o ITS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2">
              {filteredInstitutions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <School className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nessuna istituzione trovata</p>
                  <p className="text-sm">Prova con un altro termine di ricerca</p>
                </div>
              ) : (
                filteredInstitutions.map((inst) => (
                  <button
                    key={inst.id}
                    onClick={() => handleSelectInstitution(inst)}
                    className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all text-left"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      {inst.type === 'university' ? (
                        <Building2 className="h-5 w-5 text-blue-600" />
                      ) : (
                        <School className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{inst.name}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="h-3 w-3" />
                        {inst.city}
                        <Badge variant="outline" className="text-xs">
                          {inst.type === 'university' ? 'Università' : 'ITS'}
                        </Badge>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {step === 'verify' && selectedInstitution && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  {selectedInstitution.type === 'university' ? (
                    <Building2 className="h-6 w-6 text-blue-600" />
                  ) : (
                    <School className="h-6 w-6 text-purple-600" />
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{selectedInstitution.name}</div>
                  <div className="text-sm text-gray-600">{selectedInstitution.city}</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="institutional-email">Email Istituzionale</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="institutional-email"
                  type="email"
                  placeholder={`nome.cognome@${selectedInstitution.domains[0]}`}
                  value={institutionalEmail}
                  onChange={(e) => setInstitutionalEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-gray-500">
                Domini accettati: {selectedInstitution.domains.join(', ')}
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('search')} className="flex-1">
                Indietro
              </Button>
              <Button
                onClick={handleVerify}
                disabled={!institutionalEmail || isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifica...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Verifica e Connetti
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Connessione Completata!
            </h3>
            <p className="text-gray-600 mb-4">
              La tua università è stata collegata. I tuoi voti e progetti verranno sincronizzati automaticamente.
            </p>
            <Button onClick={handleClose} className="w-full">
              Chiudi
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export { ITALIAN_INSTITUTIONS }
