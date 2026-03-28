import { redirect } from 'next/navigation'

export default function InstitutionDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  redirect('/dashboard/university')
}
