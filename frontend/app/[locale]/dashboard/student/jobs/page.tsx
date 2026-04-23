import { redirect } from 'next/navigation'

export default function Page() {
  redirect('/dashboard/student/opportunities?tab=all')
}
