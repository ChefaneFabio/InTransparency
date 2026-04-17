'use client'

import { createContext, useContext, type ReactNode } from 'react'

export type InstitutionType = 'university' | 'its' | 'school' | 'other'

/**
 * Vocabulary and framing that adapts per institution type.
 * Every dashboard page should use these instead of hardcoded strings.
 */
export interface InstitutionVocabulary {
  type: InstitutionType

  // Entity names
  studentsLabel: string         // "Studenti" / "Allievi"
  studentSingular: string       // "studente" / "allievo"
  projectsLabel: string         // "Progetti" / "Elaborati PCTO"
  stageLabel: string            // "Stage & Tirocini" / "PCTO" / "Stage obbligatorio"
  stageSingular: string         // "tirocinio" / "PCTO" / "stage"
  coursesLabel: string          // "Corsi" / "Percorsi formativi"
  degreesLabel: string          // "Corsi di laurea" / "Percorsi ITS" / "Indirizzi"
  alumniLabel: string           // "Alumni" / "Diplomati" / "Ex-allievi"
  placementsLabel: string       // "Placement" / "Esiti occupazionali"
  employersLabel: string        // "Aziende partner" / "Aziende ospitanti"

  // Dashboard framing
  heroTitle: string
  heroSubtitle: string
  scoreLabel: string            // "Pagella ANVUR" / "Monitoraggio INDIRE" / "Report Ministero"
  complianceBody: string        // "ANVUR" / "INDIRE" / "Ministero" / "Regione/FSE"

  // Stage specifics
  stageHoursLabel: string       // "Ore di tirocinio" / "Ore PCTO" / "Ore stage"
  stageTargetHours: string      // "target" / "obiettivo 800h" / "obiettivo 90-210h"
  supervisorLabel: string       // "Tutor aziendale" / "Tutor PCTO"

  // CRM framing
  crmTitle: string
  crmSubtitle: string

  // Insights framing
  insightsTitle: string
  insightsSubtitle: string
}

const vocabularies: Record<InstitutionType, InstitutionVocabulary> = {
  university: {
    type: 'university',
    studentsLabel: 'Studenti',
    studentSingular: 'studente',
    projectsLabel: 'Progetti',
    stageLabel: 'Stage & Tirocini',
    stageSingular: 'tirocinio',
    coursesLabel: 'Corsi',
    degreesLabel: 'Corsi di laurea',
    alumniLabel: 'Alumni',
    placementsLabel: 'Placement',
    employersLabel: 'Aziende partner',
    heroTitle: 'Career Service Dashboard',
    heroSubtitle: 'Monitora studenti, placement e relazioni con le aziende.',
    scoreLabel: 'Pagella Istituzionale',
    complianceBody: 'ANVUR/MUR',
    stageHoursLabel: 'Ore di tirocinio',
    stageTargetHours: 'target ore',
    supervisorLabel: 'Tutor aziendale',
    crmTitle: 'Employer CRM',
    crmSubtitle: 'Gestisci le relazioni con le aziende che assumono i tuoi laureati.',
    insightsTitle: 'Insight Tirocini',
    insightsSubtitle: 'Come i tuoi studenti si adattano alla prima esperienza lavorativa.',
  },
  its: {
    type: 'its',
    studentsLabel: 'Studenti',
    studentSingular: 'studente',
    projectsLabel: 'Progetti e Laboratori',
    stageLabel: 'Stage Obbligatorio',
    stageSingular: 'stage',
    coursesLabel: 'Percorsi ITS',
    degreesLabel: 'Percorsi formativi',
    alumniLabel: 'Diplomati ITS',
    placementsLabel: 'Esiti Occupazionali',
    employersLabel: 'Aziende del CTS',
    heroTitle: 'Dashboard ITS',
    heroSubtitle: 'Stage, placement e rapporto con le aziende del Comitato Tecnico Scientifico.',
    scoreLabel: 'Monitoraggio INDIRE',
    complianceBody: 'INDIRE',
    stageHoursLabel: 'Ore stage obbligatorio',
    stageTargetHours: 'obiettivo 800h',
    supervisorLabel: 'Tutor aziendale',
    crmTitle: 'Aziende CTS',
    crmSubtitle: 'Monitora le aziende del Comitato Tecnico Scientifico e i loro risultati di assunzione.',
    insightsTitle: 'Insight Stage',
    insightsSubtitle: 'Come i tuoi studenti vivono le 800+ ore di esperienza in azienda.',
  },
  school: {
    type: 'school',
    studentsLabel: 'Studenti',
    studentSingular: 'studente',
    projectsLabel: 'Elaborati PCTO',
    stageLabel: 'PCTO',
    stageSingular: 'PCTO',
    coursesLabel: 'Programmi',
    degreesLabel: 'Indirizzi di studio',
    alumniLabel: 'Ex-studenti',
    placementsLabel: 'Orientamento Post-Diploma',
    employersLabel: 'Aziende PCTO',
    heroTitle: 'Dashboard Scuola',
    heroSubtitle: 'PCTO, orientamento e preparazione al mondo del lavoro per i tuoi studenti.',
    scoreLabel: 'Report Ministero',
    complianceBody: 'MIUR',
    stageHoursLabel: 'Ore PCTO',
    stageTargetHours: 'obiettivo 90-210h',
    supervisorLabel: 'Tutor PCTO',
    crmTitle: 'Aziende PCTO',
    crmSubtitle: 'Le aziende che ospitano i tuoi studenti per i Percorsi per le Competenze Trasversali.',
    insightsTitle: 'Insight PCTO',
    insightsSubtitle: 'Come i tuoi studenti vivono la prima esperienza nel mondo del lavoro.',
  },
  other: {
    type: 'other',
    studentsLabel: 'Allievi',
    studentSingular: 'allievo',
    projectsLabel: 'Portfolio',
    stageLabel: 'Work Placement',
    stageSingular: 'placement',
    coursesLabel: 'Percorsi Formativi',
    degreesLabel: 'Programmi',
    alumniLabel: 'Ex-allievi',
    placementsLabel: 'Esiti Occupazionali',
    employersLabel: 'Aziende partner',
    heroTitle: 'Dashboard Formazione',
    heroSubtitle: 'Monitora i percorsi dei tuoi allievi e il loro inserimento lavorativo.',
    scoreLabel: 'Report FSE/Regione',
    complianceBody: 'Regione/FSE',
    stageHoursLabel: 'Ore di pratica',
    stageTargetHours: 'target ore',
    supervisorLabel: 'Tutor aziendale',
    crmTitle: 'Aziende Partner',
    crmSubtitle: 'Le aziende che collaborano con il vostro centro di formazione.',
    insightsTitle: 'Insight Placement',
    insightsSubtitle: 'Come i vostri allievi si inseriscono nel mondo del lavoro dopo il percorso.',
  },
}

export const getVocabulary = (type: InstitutionType): InstitutionVocabulary => vocabularies[type] || vocabularies.university

// React context for use in client components
const InstitutionContext = createContext<InstitutionVocabulary>(vocabularies.university)

export const InstitutionProvider = ({ type, children }: { type: string; children: ReactNode }) => {
  const vocab = getVocabulary(type as InstitutionType)
  return <InstitutionContext.Provider value={vocab}>{children}</InstitutionContext.Provider>
}

export const useInstitution = () => useContext(InstitutionContext)
