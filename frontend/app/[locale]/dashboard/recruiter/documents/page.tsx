import { redirect } from 'next/navigation'

export default function Page() {
  redirect('/dashboard/recruiter/settings?tab=documents')
}
