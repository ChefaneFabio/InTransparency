import { redirect } from 'next/navigation'

export default async function StudentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  redirect(`/${locale}/students/featured`)
}
