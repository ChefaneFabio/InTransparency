import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Explore Verified Student Profiles — Browse Free',
  description: 'Browse verified student portfolios from Italian universities and ITS academies. Filter by skills, university, location, and availability. Free to explore, pay per contact.',
  keywords: ['browse student profiles', 'verified graduate portfolios', 'hire Italian graduates', 'student talent search'],
}

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return children
}
