import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'For Students — Build Your Verified Portfolio | InTransparency',
  description: 'Create a verified academic portfolio that showcases your real skills, grades, and experiences to top employers.',
}

export default function ForStudentsLayout({ children }: { children: React.ReactNode }) {
  return children
}
