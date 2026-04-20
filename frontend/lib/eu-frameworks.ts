/**
 * EU competence frameworks beyond ESCO.
 *
 * The Commission publishes three top-level competence frameworks that
 * ministries and accreditation bodies increasingly mandate alongside (or
 * instead of) pure ESCO mapping:
 *
 *   - DigComp 2.2    — Digital competence (21 competences across 5 areas)
 *                      https://joint-research-centre.ec.europa.eu/digcomp_en
 *   - EntreComp      — Entrepreneurship competence (15 competences, 3 areas)
 *                      https://joint-research-centre.ec.europa.eu/entrecomp_en
 *   - GreenComp      — Sustainability competence (12 competences, 4 areas)
 *                      https://joint-research-centre.ec.europa.eu/greencomp_en
 *
 * InTransparency skills can be tagged with any of these framework URIs so
 * that accreditation reports + learning outcomes align with the framework
 * the institution reports against.
 *
 * The lookups below are the canonical IDs from the JRC publications. We
 * expose them as namespaced URIs under our own domain so they can be
 * resolved, cited, and extended.
 */

const JRC = 'https://joint-research-centre.ec.europa.eu'

export interface FrameworkCompetence {
  framework: 'DigComp' | 'EntreComp' | 'GreenComp'
  frameworkVersion: string
  uri: string
  area: string
  name: string
  description: string
}

/**
 * DigComp 2.2 — 5 areas × 21 competences. We surface the 21 competences.
 */
export const DIGCOMP: FrameworkCompetence[] = [
  // Area 1: Information and data literacy
  { framework: 'DigComp', frameworkVersion: '2.2', uri: `${JRC}/digcomp/1.1`, area: 'Information and data literacy', name: 'Browsing, searching, filtering data, information and digital content', description: 'To articulate information needs, to search for data and digital content in digital environments.' },
  { framework: 'DigComp', frameworkVersion: '2.2', uri: `${JRC}/digcomp/1.2`, area: 'Information and data literacy', name: 'Evaluating data, information and digital content', description: 'To analyse, compare and critically evaluate the credibility of data sources.' },
  { framework: 'DigComp', frameworkVersion: '2.2', uri: `${JRC}/digcomp/1.3`, area: 'Information and data literacy', name: 'Managing data, information and digital content', description: 'To organise, store and retrieve data, information and content in digital environments.' },
  // Area 2: Communication and collaboration
  { framework: 'DigComp', frameworkVersion: '2.2', uri: `${JRC}/digcomp/2.1`, area: 'Communication and collaboration', name: 'Interacting through digital technologies', description: 'To interact through a variety of digital technologies.' },
  { framework: 'DigComp', frameworkVersion: '2.2', uri: `${JRC}/digcomp/2.2`, area: 'Communication and collaboration', name: 'Sharing through digital technologies', description: 'To share data, information and digital content through appropriate digital technologies.' },
  { framework: 'DigComp', frameworkVersion: '2.2', uri: `${JRC}/digcomp/2.3`, area: 'Communication and collaboration', name: 'Engaging in citizenship through digital technologies', description: 'To participate in society through public and private digital services.' },
  { framework: 'DigComp', frameworkVersion: '2.2', uri: `${JRC}/digcomp/2.4`, area: 'Communication and collaboration', name: 'Collaborating through digital technologies', description: 'To use digital tools and technologies for collaborative processes.' },
  { framework: 'DigComp', frameworkVersion: '2.2', uri: `${JRC}/digcomp/2.5`, area: 'Communication and collaboration', name: 'Netiquette', description: 'To be aware of behavioural norms while using digital technologies.' },
  { framework: 'DigComp', frameworkVersion: '2.2', uri: `${JRC}/digcomp/2.6`, area: 'Communication and collaboration', name: 'Managing digital identity', description: 'To create and manage one or multiple digital identities.' },
  // Area 3: Digital content creation
  { framework: 'DigComp', frameworkVersion: '2.2', uri: `${JRC}/digcomp/3.1`, area: 'Digital content creation', name: 'Developing digital content', description: 'To create and edit digital content in different formats.' },
  { framework: 'DigComp', frameworkVersion: '2.2', uri: `${JRC}/digcomp/3.2`, area: 'Digital content creation', name: 'Integrating and re-elaborating digital content', description: 'To modify, refine and integrate information and content.' },
  { framework: 'DigComp', frameworkVersion: '2.2', uri: `${JRC}/digcomp/3.3`, area: 'Digital content creation', name: 'Copyright and licences', description: 'To understand how copyright and licences apply to data and content.' },
  { framework: 'DigComp', frameworkVersion: '2.2', uri: `${JRC}/digcomp/3.4`, area: 'Digital content creation', name: 'Programming', description: 'To plan and develop a sequence of understandable instructions for a computing system.' },
  // Area 4: Safety
  { framework: 'DigComp', frameworkVersion: '2.2', uri: `${JRC}/digcomp/4.1`, area: 'Safety', name: 'Protecting devices', description: 'To protect devices and digital content.' },
  { framework: 'DigComp', frameworkVersion: '2.2', uri: `${JRC}/digcomp/4.2`, area: 'Safety', name: 'Protecting personal data and privacy', description: 'To protect personal data and privacy in digital environments.' },
  { framework: 'DigComp', frameworkVersion: '2.2', uri: `${JRC}/digcomp/4.3`, area: 'Safety', name: 'Protecting health and well-being', description: 'To avoid health-risks associated with the use of digital technologies.' },
  { framework: 'DigComp', frameworkVersion: '2.2', uri: `${JRC}/digcomp/4.4`, area: 'Safety', name: 'Protecting the environment', description: 'To be aware of the environmental impact of digital technologies and their use.' },
  // Area 5: Problem solving
  { framework: 'DigComp', frameworkVersion: '2.2', uri: `${JRC}/digcomp/5.1`, area: 'Problem solving', name: 'Solving technical problems', description: 'To identify and solve technical problems when operating devices.' },
  { framework: 'DigComp', frameworkVersion: '2.2', uri: `${JRC}/digcomp/5.2`, area: 'Problem solving', name: 'Identifying needs and technological responses', description: 'To assess needs and to identify, evaluate, select and use digital tools.' },
  { framework: 'DigComp', frameworkVersion: '2.2', uri: `${JRC}/digcomp/5.3`, area: 'Problem solving', name: 'Creatively using digital technologies', description: 'To use digital tools and technologies to create knowledge.' },
  { framework: 'DigComp', frameworkVersion: '2.2', uri: `${JRC}/digcomp/5.4`, area: 'Problem solving', name: 'Identifying digital competence gaps', description: 'To understand where digital competence needs to be improved or updated.' },
]

/**
 * EntreComp — 3 areas × 15 competences.
 */
export const ENTRECOMP: FrameworkCompetence[] = [
  // Ideas and opportunities
  { framework: 'EntreComp', frameworkVersion: '1.0', uri: `${JRC}/entrecomp/1.1`, area: 'Ideas and opportunities', name: 'Spotting opportunities', description: 'Identify and seize opportunities to create value.' },
  { framework: 'EntreComp', frameworkVersion: '1.0', uri: `${JRC}/entrecomp/1.2`, area: 'Ideas and opportunities', name: 'Creativity', description: 'Develop creative and purposeful ideas.' },
  { framework: 'EntreComp', frameworkVersion: '1.0', uri: `${JRC}/entrecomp/1.3`, area: 'Ideas and opportunities', name: 'Vision', description: 'Work towards your vision of the future.' },
  { framework: 'EntreComp', frameworkVersion: '1.0', uri: `${JRC}/entrecomp/1.4`, area: 'Ideas and opportunities', name: 'Valuing ideas', description: 'Make the most of ideas and opportunities.' },
  { framework: 'EntreComp', frameworkVersion: '1.0', uri: `${JRC}/entrecomp/1.5`, area: 'Ideas and opportunities', name: 'Ethical and sustainable thinking', description: 'Assess the consequences of ideas and act responsibly.' },
  // Resources
  { framework: 'EntreComp', frameworkVersion: '1.0', uri: `${JRC}/entrecomp/2.1`, area: 'Resources', name: 'Self-awareness and self-efficacy', description: 'Believe in yourself and keep developing.' },
  { framework: 'EntreComp', frameworkVersion: '1.0', uri: `${JRC}/entrecomp/2.2`, area: 'Resources', name: 'Motivation and perseverance', description: 'Stay focused and do not give up.' },
  { framework: 'EntreComp', frameworkVersion: '1.0', uri: `${JRC}/entrecomp/2.3`, area: 'Resources', name: 'Mobilising resources', description: 'Gather and manage the resources you need.' },
  { framework: 'EntreComp', frameworkVersion: '1.0', uri: `${JRC}/entrecomp/2.4`, area: 'Resources', name: 'Financial and economic literacy', description: 'Develop financial and economic know-how.' },
  { framework: 'EntreComp', frameworkVersion: '1.0', uri: `${JRC}/entrecomp/2.5`, area: 'Resources', name: 'Mobilising others', description: 'Inspire, enthuse and get others on board.' },
  // Into action
  { framework: 'EntreComp', frameworkVersion: '1.0', uri: `${JRC}/entrecomp/3.1`, area: 'Into action', name: 'Taking the initiative', description: 'Go for it.' },
  { framework: 'EntreComp', frameworkVersion: '1.0', uri: `${JRC}/entrecomp/3.2`, area: 'Into action', name: 'Planning and management', description: 'Prioritise, organise and follow-up.' },
  { framework: 'EntreComp', frameworkVersion: '1.0', uri: `${JRC}/entrecomp/3.3`, area: 'Into action', name: 'Coping with ambiguity, uncertainty and risk', description: 'Make decisions dealing with uncertainty, ambiguity and risk.' },
  { framework: 'EntreComp', frameworkVersion: '1.0', uri: `${JRC}/entrecomp/3.4`, area: 'Into action', name: 'Working with others', description: 'Team up, collaborate and network.' },
  { framework: 'EntreComp', frameworkVersion: '1.0', uri: `${JRC}/entrecomp/3.5`, area: 'Into action', name: 'Learning through experience', description: 'Learn by doing.' },
]

/**
 * GreenComp — 4 areas × 12 competences.
 */
export const GREENCOMP: FrameworkCompetence[] = [
  // Embodying sustainability values
  { framework: 'GreenComp', frameworkVersion: '1.0', uri: `${JRC}/greencomp/1.1`, area: 'Embodying sustainability values', name: 'Valuing sustainability', description: 'To reflect on personal values.' },
  { framework: 'GreenComp', frameworkVersion: '1.0', uri: `${JRC}/greencomp/1.2`, area: 'Embodying sustainability values', name: 'Supporting fairness', description: 'To support equity and justice for current and future generations.' },
  { framework: 'GreenComp', frameworkVersion: '1.0', uri: `${JRC}/greencomp/1.3`, area: 'Embodying sustainability values', name: 'Promoting nature', description: 'To acknowledge that humans are part of nature.' },
  // Embracing complexity in sustainability
  { framework: 'GreenComp', frameworkVersion: '1.0', uri: `${JRC}/greencomp/2.1`, area: 'Embracing complexity in sustainability', name: 'Systems thinking', description: 'To approach sustainability issues using all their aspects.' },
  { framework: 'GreenComp', frameworkVersion: '1.0', uri: `${JRC}/greencomp/2.2`, area: 'Embracing complexity in sustainability', name: 'Critical thinking', description: 'To assess information and arguments.' },
  { framework: 'GreenComp', frameworkVersion: '1.0', uri: `${JRC}/greencomp/2.3`, area: 'Embracing complexity in sustainability', name: 'Problem framing', description: 'To formulate sustainability challenges.' },
  // Envisioning sustainable futures
  { framework: 'GreenComp', frameworkVersion: '1.0', uri: `${JRC}/greencomp/3.1`, area: 'Envisioning sustainable futures', name: 'Futures literacy', description: 'To envision alternative sustainable futures.' },
  { framework: 'GreenComp', frameworkVersion: '1.0', uri: `${JRC}/greencomp/3.2`, area: 'Envisioning sustainable futures', name: 'Adaptability', description: 'To manage transitions and challenges.' },
  { framework: 'GreenComp', frameworkVersion: '1.0', uri: `${JRC}/greencomp/3.3`, area: 'Envisioning sustainable futures', name: 'Exploratory thinking', description: 'To adopt a relational way of thinking by exploring and linking different disciplines.' },
  // Acting for sustainability
  { framework: 'GreenComp', frameworkVersion: '1.0', uri: `${JRC}/greencomp/4.1`, area: 'Acting for sustainability', name: 'Political agency', description: 'To navigate the political system.' },
  { framework: 'GreenComp', frameworkVersion: '1.0', uri: `${JRC}/greencomp/4.2`, area: 'Acting for sustainability', name: 'Collective action', description: 'To act for change in collaboration with others.' },
  { framework: 'GreenComp', frameworkVersion: '1.0', uri: `${JRC}/greencomp/4.3`, area: 'Acting for sustainability', name: 'Individual initiative', description: 'To identify own potential for sustainability.' },
]

/**
 * Map InTransparency-level skill terms to framework competences. Multiple
 * frameworks can tag the same skill (e.g. "Python" → DigComp 3.4 Programming;
 * "teamwork" → EntreComp 3.4 Working with others; "sustainability analysis"
 * → GreenComp 2.1 Systems thinking).
 */
const MAPPINGS: Record<string, string[]> = {
  // Programming + digital → DigComp
  python: [`${JRC}/digcomp/3.4`, `${JRC}/digcomp/5.3`],
  javascript: [`${JRC}/digcomp/3.4`],
  typescript: [`${JRC}/digcomp/3.4`],
  java: [`${JRC}/digcomp/3.4`],
  sql: [`${JRC}/digcomp/1.3`, `${JRC}/digcomp/3.4`],
  'data analysis': [`${JRC}/digcomp/1.2`, `${JRC}/digcomp/1.3`],
  'data science': [`${JRC}/digcomp/1.2`, `${JRC}/digcomp/5.3`],
  'machine learning': [`${JRC}/digcomp/3.4`, `${JRC}/digcomp/5.3`],
  // Collaboration → DigComp 2.x + EntreComp 3.4
  teamwork: [`${JRC}/digcomp/2.4`, `${JRC}/entrecomp/3.4`],
  communication: [`${JRC}/digcomp/2.1`, `${JRC}/entrecomp/2.5`],
  leadership: [`${JRC}/entrecomp/2.5`, `${JRC}/entrecomp/3.1`],
  // Problem solving → DigComp 5.x + EntreComp 1.1 + GreenComp 2.3
  'problem solving': [`${JRC}/digcomp/5.1`, `${JRC}/entrecomp/1.1`, `${JRC}/greencomp/2.3`],
  'critical thinking': [`${JRC}/greencomp/2.2`],
  creativity: [`${JRC}/entrecomp/1.2`],
  adaptability: [`${JRC}/greencomp/3.2`, `${JRC}/entrecomp/3.3`],
  'project management': [`${JRC}/entrecomp/3.2`],
  'financial modeling': [`${JRC}/entrecomp/2.4`],
  'time management': [`${JRC}/entrecomp/3.2`],
}

/**
 * Given a skill term, return the EU framework competence URIs that apply.
 */
export function getFrameworkCompetencesForSkill(skill: string): string[] {
  return MAPPINGS[skill.toLowerCase().trim()] ?? []
}

/**
 * Look up full FrameworkCompetence records by URI.
 */
export function getCompetenceByUri(uri: string): FrameworkCompetence | undefined {
  return [...DIGCOMP, ...ENTRECOMP, ...GREENCOMP].find(c => c.uri === uri)
}

export function getAllCompetences(): FrameworkCompetence[] {
  return [...DIGCOMP, ...ENTRECOMP, ...GREENCOMP]
}
