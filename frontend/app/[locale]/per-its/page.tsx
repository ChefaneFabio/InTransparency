import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function PerITSPage({ params }: PageProps) {
  const { locale } = await params
  redirect(`/${locale}/for-its-institutes`)
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params
  return {
    title: locale === 'it' ? 'Per ITS | InTransparency' : 'For ITS | InTransparency',
    description: locale === 'it'
      ? 'Piattaforma gratuita per ITS: fai assumere i tuoi studenti attraverso il marketplace verificato'
      : 'Free platform for ITS: get your students hired through the verified marketplace',
    alternates: {
      canonical: `/${locale}/for-its-institutes`
    }
  }
}
