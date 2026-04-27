/**
 * Static data backing the /explore page filters.
 *
 * Pulled out of the page component so the route file stays under 500
 * lines and so the same lists can be reused by sample-profiles.ts and
 * any future search surfaces (chat, command palette, etc.).
 *
 * The strings here are display-side; translation lookup happens in the
 * component via `t(`options.${field}.${value}`)` patterns.
 */

export const INSTITUTION_GROUPS = {
  universities: [
    'Politecnico di Milano',
    'Politecnico di Torino',
    'Sapienza Università di Roma',
    'Università di Bologna',
    'Università di Padova',
    'Università degli Studi di Milano',
    'Università di Firenze',
    'Università di Napoli Federico II',
    'Università di Pisa',
    'Università di Genova',
    'Università di Trento',
    'Università degli Studi di Bergamo',
    'Università Cattolica del Sacro Cuore',
    'Università Bocconi',
    'LUISS Guido Carli',
    "Università Ca' Foscari Venezia",
    'Università di Verona',
    'Università di Parma',
    'Università di Siena',
    'Università di Perugia',
    'Università della Calabria',
    'Università di Catania',
    'Università di Palermo',
    'Università di Cagliari',
    'Università di Bari Aldo Moro',
  ],
  its: [
    'ITS Academy Meccatronico Veneto',
    'ITS Angelo Rizzoli (Milano)',
    'ITS Lombardia Informatica',
    'ITS ICT Piemonte',
    'ITS Maker (Emilia-Romagna)',
    "ITS Energia e Ambiente (Colle Val d'Elsa)",
    'ITS Moda Campania',
    'ITS TAM Biella (Tessile)',
    'ITS Agroalimentare Piemonte',
    'ITS Turismo e Benessere',
    'ITS Biotecnologie (Roma)',
    'ITS Logistica (Verona)',
    'ITS Aerospazio Puglia',
    'ITS Nuove Tecnologie della Vita (Bergamo)',
    'ITS Last (Puglia - Legno Arredo)',
  ],
  highSchools: [
    'Liceo Scientifico A. Volta (Milano)',
    'Liceo Classico G. Berchet (Milano)',
    'Liceo Scientifico G. Galilei (Roma)',
    'ITIS G. Marconi (Verona)',
    'ITIS A. Meucci (Firenze)',
    'Liceo Artistico di Brera (Milano)',
    'IIS Ettore Majorana (Torino)',
    'ITIS Enrico Fermi (Roma)',
    'Liceo Scientifico E. Fermi (Bologna)',
    'ITIS G. Cardano (Pavia)',
    'Liceo Linguistico C. Cattaneo (Torino)',
    'IIS Leonardo da Vinci (Firenze)',
  ],
} as const

export const GRADUATION_YEARS = ['2024', '2025', '2026', '2027'] as const

export const FIELDS_OF_STUDY = [
  'Engineering',
  'Computer Science',
  'Data Science',
  'Business Administration',
  'Economics',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Medicine',
  'Law',
  'Psychology',
  'Architecture',
  'Design',
  'Arts',
  'Literature',
  'Philosophy',
  'Political Science',
] as const

export const LOCATIONS = [
  'Milan, Italy',
  'Rome, Italy',
  'Bologna, Italy',
  'Turin, Italy',
  'Florence, Italy',
  'Naples, Italy',
  'Venice, Italy',
  'Padua, Italy',
  'Remote',
] as const

export const LANGUAGES = [
  'Italian',
  'English',
  'Spanish',
  'French',
  'German',
  'Chinese',
  'Arabic',
  'Portuguese',
] as const

export const AVAILABILITY_OPTIONS = [
  'Available immediately',
  'Open to offers',
  'Not looking',
  'Available for projects only',
] as const

export const SKILL_CATEGORIES: Record<string, string[]> = {
  engineeringTech: [
    'Python', 'JavaScript', 'Java', 'C++', 'C#', 'SQL', 'R', 'MATLAB',
    'React', 'Node.js', 'Machine Learning', 'Data Analysis', 'AWS', 'Docker',
    'CAD', 'AutoCAD', 'SolidWorks', 'CATIA', 'Revit', 'Civil 3D',
    'Structural Analysis', 'FEM/FEA', 'CFD', 'ANSYS', 'Simulink',
    'PLC Programming', 'SCADA', 'Industrial Automation', 'Robotics',
    'Electrical Design', 'PCB Design', 'Embedded Systems', 'IoT',
    'BIM', 'GIS', 'Project Engineering', 'Quality Control',
  ],
  businessManagement: [
    'Business Strategy', 'Business Development', 'Market Analysis', 'Competitive Analysis',
    'Financial Modeling', 'Budgeting', 'Forecasting', 'Business Planning',
    'Operations Management', 'Supply Chain', 'Logistics', 'Procurement',
    'Project Management', 'Agile', 'Scrum', 'Lean Six Sigma',
    'Change Management', 'Risk Management', 'Stakeholder Management',
    'Consulting', 'Management Consulting', 'Strategy Consulting',
  ],
  financeAccounting: [
    'Financial Analysis', 'Financial Reporting', 'IFRS', 'GAAP',
    'Accounting', 'Auditing', 'Tax Planning', 'Corporate Finance',
    'Investment Analysis', 'Portfolio Management', 'Valuation', 'M&A',
    'Risk Analysis', 'Credit Analysis', 'Treasury', 'Controlling',
    'SAP', 'Bloomberg Terminal', 'Excel Advanced', 'Power BI',
  ],
  marketingComms: [
    'Digital Marketing', 'SEO', 'SEM', 'Social Media Marketing',
    'Content Marketing', 'Brand Management', 'Product Marketing',
    'Marketing Strategy', 'Market Research', 'Consumer Insights',
    'Public Relations', 'Corporate Communications', 'Event Management',
    'Copywriting', 'Content Creation', 'Video Production', 'Photography',
    'Google Analytics', 'HubSpot', 'Salesforce',
  ],
  designCreative: [
    'Graphic Design', 'UI/UX Design', 'Web Design', 'Brand Identity',
    'Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Figma', 'Sketch',
    'Motion Graphics', 'Video Editing', 'Adobe Premiere', 'After Effects',
    '3D Modeling', 'Blender', 'Maya', 'Cinema 4D', 'Rendering',
    'Interior Design', 'Product Design', 'Fashion Design', 'Packaging Design',
  ],
  healthcareLifeSciences: [
    'Clinical Research', 'Clinical Trials', 'GCP', 'Regulatory Affairs',
    'Medical Writing', 'Pharmacovigilance', 'Drug Development',
    'Laboratory Techniques', 'PCR', 'HPLC', 'Mass Spectrometry',
    'Biotechnology', 'Molecular Biology', 'Cell Culture', 'Bioinformatics',
    'Healthcare Management', 'Patient Care', 'Medical Imaging',
    'Nursing', 'Physiotherapy', 'Nutrition', 'Public Health',
  ],
  lawLegal: [
    'Legal Research', 'Contract Law', 'Corporate Law', 'Commercial Law',
    'Intellectual Property', 'Patent Law', 'Trademark', 'Copyright',
    'Labor Law', 'Employment Law', 'GDPR', 'Privacy Law',
    'Litigation', 'Legal Writing', 'Due Diligence', 'Compliance',
  ],
  sciences: [
    'Research Methodology', 'Statistical Analysis', 'SPSS', 'Stata',
    'Laboratory Management', 'Scientific Writing', 'Peer Review',
    'Physics', 'Chemistry', 'Biology', 'Environmental Science',
    'Geology', 'Materials Science', 'Nanotechnology',
  ],
  educationTraining: [
    'Teaching', 'Curriculum Development', 'Instructional Design',
    'E-Learning', 'Training Delivery', 'Educational Technology',
    'Assessment Design', 'Student Mentoring', 'Academic Writing',
  ],
  languages: [
    'English', 'Italian', 'Spanish', 'French', 'German', 'Chinese', 'Arabic',
    'Translation', 'Interpretation', 'Localization', 'Technical Translation',
  ],
  softSkills: [
    'Leadership', 'Team Management', 'Communication', 'Presentation',
    'Negotiation', 'Problem Solving', 'Critical Thinking', 'Analytical Thinking',
    'Creativity', 'Innovation', 'Adaptability', 'Time Management',
    'Emotional Intelligence', 'Conflict Resolution', 'Cross-cultural Communication',
  ],
  hospitalityTourism: [
    'Hotel Management', 'Event Planning', 'Tourism Management',
    'Customer Service', 'Front Office', 'Food & Beverage',
  ],
  agricultureEnvironment: [
    'Agronomy', 'Sustainable Agriculture', 'Food Science',
    'Environmental Management', 'Sustainability', 'Renewable Energy',
    'Waste Management', 'Water Management', 'Climate Science',
  ],
}

export const ALL_SKILLS: string[] = Object.values(SKILL_CATEGORIES).flat()
