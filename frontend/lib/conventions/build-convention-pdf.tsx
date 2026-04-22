import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

/**
 * Italian "convenzione di tirocinio" draft.
 *
 * Scope: generate a first draft from a Placement record so staff don't
 * start from a blank Word document. NOT a legal template — the career
 * office reviews, tweaks, and signs. v1: no digital signature; the
 * staff sends the PDF to the company for wet-ink or DocuSign.
 *
 * Structure mirrors the common Italian template:
 *   - Header: parties (institution + company)
 *   - Art. 1: tirocinante (the student)
 *   - Art. 2: finalità (curricular / extracurricular)
 *   - Art. 3: durata e orario
 *   - Art. 4: tutor accademico + tutor aziendale
 *   - Art. 5: indennità di partecipazione (if extracurricular)
 *   - Art. 6: obblighi dell'azienda / obblighi dello studente
 *   - Art. 7: copertura assicurativa
 *   - Art. 8: privacy (GDPR Art. 13)
 *   - Signature block (institution / company / student)
 */

export interface ConventionData {
  placementId: string
  generatedAt: Date
  institution: {
    name: string
    legalRepresentative?: string | null
    address?: string | null
    vatNumber?: string | null
    city?: string | null
  }
  company: {
    name: string
    legalRepresentative?: string | null
    address?: string | null
    vatNumber?: string | null
    industry?: string | null
  }
  student: {
    firstName: string
    lastName: string
    taxCode?: string | null
    degree?: string | null
    studentId?: string | null
  }
  placement: {
    jobTitle: string
    offerType: string // TIROCINIO_CURRICULARE | TIROCINIO_EXTRA | ...
    startDate: Date
    endDate?: Date | null
    plannedHours?: number | null
    weeklyHours?: number | null
    locationAddress?: string | null
    compensation?: {
      amount?: number | null
      currency?: string | null
      period?: string | null
    } | null
  }
  academicTutor?: { name: string; email?: string | null } | null
  companyTutor?: { name: string; email?: string | null } | null
}

const s = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.45,
    color: '#111',
  },
  header: { marginBottom: 18, borderBottom: 1, borderBottomColor: '#999', paddingBottom: 10 },
  headerTitle: { fontSize: 13, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  headerSub: { fontSize: 9, color: '#555' },

  parties: { marginBottom: 14 },
  partyLabel: { fontSize: 9, color: '#555', marginBottom: 2 },
  partyLine: { marginBottom: 6 },
  partyName: { fontFamily: 'Helvetica-Bold' },

  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginTop: 12,
    marginBottom: 4,
    color: '#0f172a',
    backgroundColor: '#f1f5f9',
    padding: 4,
  },
  article: { marginBottom: 10 },
  articleTitle: { fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  row: { flexDirection: 'row', marginBottom: 2 },
  rowLabel: { width: 140, color: '#555' },
  rowValue: { flex: 1 },

  small: { fontSize: 8, color: '#666' },

  sigGrid: { flexDirection: 'row', marginTop: 30, gap: 12 },
  sigBox: {
    flex: 1,
    borderTop: 1,
    borderTopColor: '#333',
    paddingTop: 6,
  },
  sigLabel: { fontFamily: 'Helvetica-Bold', fontSize: 9, marginBottom: 2 },
  sigMeta: { fontSize: 8, color: '#555' },

  footer: {
    position: 'absolute',
    bottom: 24,
    left: 48,
    right: 48,
    fontSize: 7,
    color: '#999',
    textAlign: 'center',
  },
  pageNum: { position: 'absolute', bottom: 24, right: 48, fontSize: 7, color: '#999' },

  draftBanner: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: 4,
    fontSize: 8,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Helvetica-Bold',
  },
})

function fmtDate(d: Date): string {
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  }).format(d)
}

function fmtOfferType(t: string): string {
  switch (t) {
    case 'TIROCINIO_CURRICULARE': return 'Tirocinio curriculare'
    case 'TIROCINIO_EXTRA':       return 'Tirocinio extracurricolare'
    case 'APPRENDISTATO':         return 'Apprendistato'
    case 'PLACEMENT':             return 'Placement'
    case 'PART_TIME':             return 'Contratto part-time'
    default:                      return t
  }
}

function fmtMoney(amount?: number | null, currency?: string | null, period?: string | null): string {
  if (!amount) return '—'
  const c = currency || 'EUR'
  const p = period === 'monthly' ? ' / mese' : period === 'hourly' ? ' / ora' : period === 'yearly' ? ' / anno' : ''
  return `${amount.toLocaleString('it-IT')} ${c}${p}`
}

export function ConventionPdfDocument({ data }: { data: ConventionData }) {
  const { institution, company, student, placement, academicTutor, companyTutor } = data
  const isExtracurricular = placement.offerType === 'TIROCINIO_EXTRA'

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.draftBanner}>
          BOZZA — convenzione di tirocinio · generata {fmtDate(data.generatedAt)} · rivedere prima della firma
        </Text>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerTitle}>CONVENZIONE DI TIROCINIO</Text>
          <Text style={s.headerSub}>
            ai sensi del D.M. 25 marzo 1998, n. 142 e della normativa regionale applicabile
          </Text>
        </View>

        {/* Parties */}
        <View style={s.parties}>
          <Text style={s.sectionTitle}>TRA</Text>
          <View style={s.partyLine}>
            <Text style={s.partyLabel}>Soggetto promotore</Text>
            <Text style={s.partyName}>{institution.name}</Text>
            {institution.legalRepresentative && (
              <Text>rappresentato da {institution.legalRepresentative}</Text>
            )}
            {institution.address && <Text>{institution.address}</Text>}
            {institution.vatNumber && <Text>P.IVA / C.F. {institution.vatNumber}</Text>}
          </View>

          <Text style={s.sectionTitle}>E</Text>
          <View style={s.partyLine}>
            <Text style={s.partyLabel}>Soggetto ospitante</Text>
            <Text style={s.partyName}>{company.name}</Text>
            {company.legalRepresentative && (
              <Text>rappresentata da {company.legalRepresentative}</Text>
            )}
            {company.address && <Text>{company.address}</Text>}
            {company.vatNumber && <Text>P.IVA / C.F. {company.vatNumber}</Text>}
            {company.industry && <Text>Settore: {company.industry}</Text>}
          </View>
        </View>

        {/* Articles */}
        <Text style={s.sectionTitle}>Art. 1 — Tirocinante</Text>
        <View style={s.article}>
          <View style={s.row}>
            <Text style={s.rowLabel}>Nome e cognome</Text>
            <Text style={s.rowValue}>{student.firstName} {student.lastName}</Text>
          </View>
          {student.taxCode && (
            <View style={s.row}>
              <Text style={s.rowLabel}>Codice fiscale</Text>
              <Text style={s.rowValue}>{student.taxCode}</Text>
            </View>
          )}
          {student.degree && (
            <View style={s.row}>
              <Text style={s.rowLabel}>Corso di laurea</Text>
              <Text style={s.rowValue}>{student.degree}</Text>
            </View>
          )}
          {student.studentId && (
            <View style={s.row}>
              <Text style={s.rowLabel}>Matricola</Text>
              <Text style={s.rowValue}>{student.studentId}</Text>
            </View>
          )}
        </View>

        <Text style={s.sectionTitle}>Art. 2 — Finalità e tipologia</Text>
        <View style={s.article}>
          <View style={s.row}>
            <Text style={s.rowLabel}>Tipologia</Text>
            <Text style={s.rowValue}>{fmtOfferType(placement.offerType)}</Text>
          </View>
          <View style={s.row}>
            <Text style={s.rowLabel}>Ruolo / progetto</Text>
            <Text style={s.rowValue}>{placement.jobTitle}</Text>
          </View>
          <Text style={{ marginTop: 4, fontSize: 9 }}>
            Il tirocinio ha finalità di orientamento e formazione. Non costituisce rapporto di lavoro.
          </Text>
        </View>

        <Text style={s.sectionTitle}>Art. 3 — Durata, sede e orario</Text>
        <View style={s.article}>
          <View style={s.row}>
            <Text style={s.rowLabel}>Data inizio</Text>
            <Text style={s.rowValue}>{fmtDate(placement.startDate)}</Text>
          </View>
          {placement.endDate && (
            <View style={s.row}>
              <Text style={s.rowLabel}>Data fine prevista</Text>
              <Text style={s.rowValue}>{fmtDate(placement.endDate)}</Text>
            </View>
          )}
          {placement.plannedHours != null && (
            <View style={s.row}>
              <Text style={s.rowLabel}>Ore totali previste</Text>
              <Text style={s.rowValue}>{placement.plannedHours}</Text>
            </View>
          )}
          {placement.weeklyHours != null && (
            <View style={s.row}>
              <Text style={s.rowLabel}>Ore settimanali</Text>
              <Text style={s.rowValue}>{placement.weeklyHours}</Text>
            </View>
          )}
          {placement.locationAddress && (
            <View style={s.row}>
              <Text style={s.rowLabel}>Sede di svolgimento</Text>
              <Text style={s.rowValue}>{placement.locationAddress}</Text>
            </View>
          )}
        </View>

        <Text style={s.sectionTitle}>Art. 4 — Tutoraggio</Text>
        <View style={s.article}>
          {academicTutor && (
            <View style={s.row}>
              <Text style={s.rowLabel}>Tutor accademico</Text>
              <Text style={s.rowValue}>
                {academicTutor.name}{academicTutor.email ? ` — ${academicTutor.email}` : ''}
              </Text>
            </View>
          )}
          {companyTutor && (
            <View style={s.row}>
              <Text style={s.rowLabel}>Tutor aziendale</Text>
              <Text style={s.rowValue}>
                {companyTutor.name}{companyTutor.email ? ` — ${companyTutor.email}` : ''}
              </Text>
            </View>
          )}
          {!academicTutor && !companyTutor && (
            <Text style={s.small}>
              Da nominare prima dell'inizio del tirocinio — cfr. art. 5 D.M. 142/1998.
            </Text>
          )}
        </View>

        {isExtracurricular && (
          <>
            <Text style={s.sectionTitle}>Art. 5 — Indennità di partecipazione</Text>
            <View style={s.article}>
              <View style={s.row}>
                <Text style={s.rowLabel}>Importo lordo</Text>
                <Text style={s.rowValue}>
                  {fmtMoney(placement.compensation?.amount, placement.compensation?.currency, placement.compensation?.period)}
                </Text>
              </View>
              <Text style={s.small}>
                L'indennità non può essere inferiore al minimo previsto dalla normativa regionale applicabile al soggetto ospitante.
              </Text>
            </View>
          </>
        )}

        <Text style={s.sectionTitle}>Art. 6 — Obblighi</Text>
        <View style={s.article}>
          <Text style={s.articleTitle}>Il soggetto ospitante si impegna a:</Text>
          <Text>• garantire al tirocinante l'esperienza formativa oggetto della presente convenzione;</Text>
          <Text>• rispettare le norme sulla sicurezza (D.Lgs. 81/2008) e fornire formazione specifica;</Text>
          <Text>• designare un tutor aziendale responsabile dell'inserimento e dell'attività;</Text>
          <Text>• segnalare tempestivamente eventuali incidenti o interruzioni.</Text>
          <Text style={[s.articleTitle, { marginTop: 6 }]}>Il tirocinante si impegna a:</Text>
          <Text>• svolgere le attività previste rispettando le regole dell'azienda;</Text>
          <Text>• rispettare gli obblighi di riservatezza sui dati aziendali trattati;</Text>
          <Text>• compilare il registro presenze e il rapporto finale di tirocinio.</Text>
        </View>

        <Text style={s.sectionTitle}>Art. 7 — Copertura assicurativa</Text>
        <View style={s.article}>
          <Text>
            Il soggetto promotore garantisce la copertura assicurativa del tirocinante contro gli infortuni
            sul lavoro (INAIL) e per la responsabilità civile verso terzi per l'intera durata del tirocinio.
          </Text>
        </View>

        <Text style={s.sectionTitle}>Art. 8 — Trattamento dati (GDPR)</Text>
        <View style={s.article}>
          <Text>
            I dati personali del tirocinante sono trattati ai sensi del Regolamento (UE) 2016/679 — GDPR.
            Titolari del trattamento sono, per le rispettive competenze, il soggetto promotore e il soggetto
            ospitante. L'informativa estesa è consegnata al tirocinante contestualmente alla sottoscrizione.
          </Text>
        </View>

        {/* Signatures */}
        <View style={s.sigGrid}>
          <View style={s.sigBox}>
            <Text style={s.sigLabel}>Soggetto promotore</Text>
            <Text style={s.sigMeta}>{institution.name}</Text>
            <Text style={s.sigMeta}>Data: ____ / ____ / ______</Text>
          </View>
          <View style={s.sigBox}>
            <Text style={s.sigLabel}>Soggetto ospitante</Text>
            <Text style={s.sigMeta}>{company.name}</Text>
            <Text style={s.sigMeta}>Data: ____ / ____ / ______</Text>
          </View>
          <View style={s.sigBox}>
            <Text style={s.sigLabel}>Tirocinante</Text>
            <Text style={s.sigMeta}>{student.firstName} {student.lastName}</Text>
            <Text style={s.sigMeta}>Data: ____ / ____ / ______</Text>
          </View>
        </View>

        <Text style={s.footer}>
          Documento generato automaticamente da InTransparency · Placement ID {data.placementId} · Bozza da convalidare
        </Text>
        <Text
          style={s.pageNum}
          render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  )
}
