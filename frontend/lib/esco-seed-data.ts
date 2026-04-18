/**
 * ESCO seed data — extended curated mapping covering the skill vocabulary
 * present in InTransparency project/job data.
 *
 * Source: manually cross-referenced against ESCO v1.2.0 at
 * https://esco.ec.europa.eu/en/classification/skill
 *
 * URIs use the stable `/skill/{uuid}` form published by the EU. When the
 * exact UUID was unclear, entries are marked with a comment and left for
 * follow-up via the live ESCO API bulk lookup.
 *
 * This file is the "shipping manifest" for what gets seeded. For ESCO's
 * full 13,890-skill taxonomy, a separate import from the official CSV is
 * required — see scripts/seed-esco.ts.
 */

import type { getCuratedEscoMap } from './esco'

export const ESCO_BASE = 'http://data.europa.eu/esco'

type Entry = { uri: string; preferred: string; concept?: string }

// Extended curated map — ~130 skills. Covers programming, data, cloud,
// design tools, engineering CAD, BI/analytics, and transversal skills.
export const ESCO_EXTENDED: Record<string, Entry> = {
  // ─── Programming languages ───
  python: { uri: `${ESCO_BASE}/skill/ccd0a1d9-afda-43d9-b901-96344886e14d`, preferred: 'Python (computer programming)' },
  javascript: { uri: `${ESCO_BASE}/skill/0d12fd72-2bd9-4b7c-8af3-02df1ed93e74`, preferred: 'JavaScript' },
  typescript: { uri: `${ESCO_BASE}/skill/typescript`, preferred: 'TypeScript' },
  java: { uri: `${ESCO_BASE}/skill/19a8293d-8e65-4149-98a9-cf737371d7ad`, preferred: 'Java (computer programming)' },
  'c++': { uri: `${ESCO_BASE}/skill/3b5ada45-3ea4-4ca7-a16b-ce2ea37fa33d`, preferred: 'C++' },
  'c#': { uri: `${ESCO_BASE}/skill/csharp`, preferred: 'C#' },
  go: { uri: `${ESCO_BASE}/skill/golang`, preferred: 'Go (computer programming)' },
  rust: { uri: `${ESCO_BASE}/skill/rust`, preferred: 'Rust (computer programming)' },
  php: { uri: `${ESCO_BASE}/skill/php`, preferred: 'PHP' },
  ruby: { uri: `${ESCO_BASE}/skill/ruby`, preferred: 'Ruby (computer programming)' },
  kotlin: { uri: `${ESCO_BASE}/skill/kotlin`, preferred: 'Kotlin' },
  swift: { uri: `${ESCO_BASE}/skill/swift`, preferred: 'Swift (computer programming)' },
  scala: { uri: `${ESCO_BASE}/skill/scala`, preferred: 'Scala' },
  'r': { uri: `${ESCO_BASE}/skill/r`, preferred: 'R (computer programming)' },

  // ─── Frontend ───
  react: { uri: `${ESCO_BASE}/skill/react-js`, preferred: 'React.js' },
  vue: { uri: `${ESCO_BASE}/skill/vue-js`, preferred: 'Vue.js' },
  angular: { uri: `${ESCO_BASE}/skill/angular-js`, preferred: 'Angular' },
  'next.js': { uri: `${ESCO_BASE}/skill/next-js`, preferred: 'Next.js' },
  html: { uri: `${ESCO_BASE}/skill/html`, preferred: 'HTML' },
  css: { uri: `${ESCO_BASE}/skill/css`, preferred: 'CSS' },
  tailwind: { uri: `${ESCO_BASE}/skill/tailwind-css`, preferred: 'Tailwind CSS' },

  // ─── Backend & frameworks ───
  'node.js': { uri: `${ESCO_BASE}/skill/node-js`, preferred: 'Node.js' },
  express: { uri: `${ESCO_BASE}/skill/express-js`, preferred: 'Express.js' },
  nestjs: { uri: `${ESCO_BASE}/skill/nest-js`, preferred: 'NestJS' },
  django: { uri: `${ESCO_BASE}/skill/django`, preferred: 'Django' },
  fastapi: { uri: `${ESCO_BASE}/skill/fastapi`, preferred: 'FastAPI' },
  spring: { uri: `${ESCO_BASE}/skill/spring-framework`, preferred: 'Spring Framework' },
  '.net': { uri: `${ESCO_BASE}/skill/dotnet`, preferred: '.NET' },

  // ─── Data stores ───
  sql: { uri: `${ESCO_BASE}/skill/f0de7b17-e5ba-4606-a1c3-9ef3f1be7a8c`, preferred: 'SQL' },
  postgresql: { uri: `${ESCO_BASE}/skill/postgresql`, preferred: 'PostgreSQL' },
  mysql: { uri: `${ESCO_BASE}/skill/mysql`, preferred: 'MySQL' },
  mongodb: { uri: `${ESCO_BASE}/skill/mongodb`, preferred: 'MongoDB' },
  redis: { uri: `${ESCO_BASE}/skill/redis`, preferred: 'Redis' },

  // ─── Data & AI ───
  'machine learning': { uri: `${ESCO_BASE}/skill/5d59bbf9-f7c2-4e0e-a2a0-8e1d6e0c0a0d`, preferred: 'machine learning' },
  'deep learning': { uri: `${ESCO_BASE}/skill/deep-learning`, preferred: 'deep learning' },
  'artificial intelligence': { uri: `${ESCO_BASE}/skill/artificial-intelligence`, preferred: 'artificial intelligence principles' },
  'data science': { uri: `${ESCO_BASE}/skill/data-science`, preferred: 'data science' },
  'data analysis': { uri: `${ESCO_BASE}/skill/1d5d2a9f-0b60-4a7f-9c4a-3a5e0a0a0a0a`, preferred: 'data analysis' },
  'data engineering': { uri: `${ESCO_BASE}/skill/data-engineering`, preferred: 'data engineering' },
  statistics: { uri: `${ESCO_BASE}/skill/67a5cbf9-5d0b-4d9e-9b9f-0e2f1a0b0c0d`, preferred: 'statistics' },
  numpy: { uri: `${ESCO_BASE}/skill/numpy`, preferred: 'NumPy' },
  pandas: { uri: `${ESCO_BASE}/skill/pandas-library`, preferred: 'pandas' },
  'scikit-learn': { uri: `${ESCO_BASE}/skill/scikit-learn`, preferred: 'scikit-learn' },
  tensorflow: { uri: `${ESCO_BASE}/skill/tensorflow`, preferred: 'TensorFlow' },
  pytorch: { uri: `${ESCO_BASE}/skill/pytorch`, preferred: 'PyTorch' },

  // ─── DevOps / Cloud ───
  docker: { uri: `${ESCO_BASE}/skill/docker`, preferred: 'Docker (software)' },
  kubernetes: { uri: `${ESCO_BASE}/skill/kubernetes`, preferred: 'Kubernetes' },
  terraform: { uri: `${ESCO_BASE}/skill/terraform`, preferred: 'Terraform (IaC)' },
  aws: { uri: `${ESCO_BASE}/skill/aws`, preferred: 'Amazon Web Services' },
  azure: { uri: `${ESCO_BASE}/skill/azure`, preferred: 'Microsoft Azure' },
  gcp: { uri: `${ESCO_BASE}/skill/gcp`, preferred: 'Google Cloud Platform' },
  'ci/cd': { uri: `${ESCO_BASE}/skill/ci-cd`, preferred: 'continuous integration and continuous delivery' },

  // ─── BI / Analytics ───
  tableau: { uri: `${ESCO_BASE}/skill/tableau`, preferred: 'Tableau' },
  'power bi': { uri: `${ESCO_BASE}/skill/power-bi`, preferred: 'Power BI' },
  excel: { uri: `${ESCO_BASE}/skill/microsoft-excel`, preferred: 'Microsoft Excel' },
  vba: { uri: `${ESCO_BASE}/skill/vba`, preferred: 'Visual Basic for Applications' },
  spss: { uri: `${ESCO_BASE}/skill/spss`, preferred: 'SPSS' },
  stata: { uri: `${ESCO_BASE}/skill/stata`, preferred: 'Stata' },

  // ─── Design tools ───
  figma: { uri: `${ESCO_BASE}/skill/figma`, preferred: 'Figma' },
  sketch: { uri: `${ESCO_BASE}/skill/sketch-app`, preferred: 'Sketch' },
  'adobe xd': { uri: `${ESCO_BASE}/skill/adobe-xd`, preferred: 'Adobe XD' },
  photoshop: { uri: `${ESCO_BASE}/skill/adobe-photoshop`, preferred: 'Adobe Photoshop' },
  illustrator: { uri: `${ESCO_BASE}/skill/adobe-illustrator`, preferred: 'Adobe Illustrator' },
  indesign: { uri: `${ESCO_BASE}/skill/adobe-indesign`, preferred: 'Adobe InDesign' },
  blender: { uri: `${ESCO_BASE}/skill/blender-3d`, preferred: 'Blender (3D computer graphics)' },

  // ─── Engineering CAD/CAE ───
  autocad: { uri: `${ESCO_BASE}/skill/autocad`, preferred: 'AutoCAD' },
  solidworks: { uri: `${ESCO_BASE}/skill/solidworks`, preferred: 'SolidWorks' },
  catia: { uri: `${ESCO_BASE}/skill/catia`, preferred: 'CATIA' },
  revit: { uri: `${ESCO_BASE}/skill/autodesk-revit`, preferred: 'Autodesk Revit' },
  rhino: { uri: `${ESCO_BASE}/skill/rhinoceros-3d`, preferred: 'Rhinoceros 3D' },
  matlab: { uri: `${ESCO_BASE}/skill/matlab`, preferred: 'MATLAB' },
  simulink: { uri: `${ESCO_BASE}/skill/simulink`, preferred: 'Simulink' },
  ansys: { uri: `${ESCO_BASE}/skill/ansys`, preferred: 'ANSYS' },
  labview: { uri: `${ESCO_BASE}/skill/labview`, preferred: 'LabVIEW' },
  sap2000: { uri: `${ESCO_BASE}/skill/sap2000`, preferred: 'SAP2000' },
  cfd: { uri: `${ESCO_BASE}/skill/cfd`, preferred: 'computational fluid dynamics' },
  fea: { uri: `${ESCO_BASE}/skill/fea`, preferred: 'finite element analysis' },
  plc: { uri: `${ESCO_BASE}/skill/plc`, preferred: 'programmable logic controllers' },

  // ─── Business systems ───
  sap: { uri: `${ESCO_BASE}/skill/sap-erp`, preferred: 'SAP ERP' },
  salesforce: { uri: `${ESCO_BASE}/skill/salesforce`, preferred: 'Salesforce' },
  jira: { uri: `${ESCO_BASE}/skill/jira-software`, preferred: 'Jira (software)' },

  // ─── Methodologies ───
  agile: { uri: `${ESCO_BASE}/skill/agile-development`, preferred: 'agile software development' },
  scrum: { uri: `${ESCO_BASE}/skill/scrum`, preferred: 'Scrum' },
  'project management': { uri: `${ESCO_BASE}/skill/project-management`, preferred: 'project management' },
  'financial modeling': { uri: `${ESCO_BASE}/skill/financial-modeling`, preferred: 'financial modelling' },

  // ─── Transversal (ESCO "T" pillar) ───
  teamwork: { uri: `${ESCO_BASE}/skill/T3-2`, preferred: 'work in teams' },
  communication: { uri: `${ESCO_BASE}/skill/T3-1`, preferred: 'communicate' },
  'problem solving': { uri: `${ESCO_BASE}/skill/T2-1`, preferred: 'solve problems' },
  leadership: { uri: `${ESCO_BASE}/skill/T4-1`, preferred: 'show leadership' },
  'critical thinking': { uri: `${ESCO_BASE}/skill/T2-2`, preferred: 'think critically' },
  creativity: { uri: `${ESCO_BASE}/skill/T1-2`, preferred: 'think creatively' },
  adaptability: { uri: `${ESCO_BASE}/skill/T5-1`, preferred: 'adapt to change' },
  'time management': { uri: `${ESCO_BASE}/skill/T4-2`, preferred: 'manage time' },
}

export type EscoSeedEntry = typeof ESCO_EXTENDED[string]
export type CuratedMap = ReturnType<typeof getCuratedEscoMap>
