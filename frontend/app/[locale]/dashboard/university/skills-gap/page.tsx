import { redirect } from 'next/navigation'

export default function Page() {
  redirect('/dashboard/university/analytics?tab=skills')
}
