import { redirect } from 'next/navigation'

export default function StudentsPage() {
  // Redirect to featured students page
  redirect('/students/featured')
}
