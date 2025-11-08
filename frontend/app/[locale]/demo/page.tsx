import { redirect } from 'next/navigation'

export default function DemoPage() {
  // Redirect to AI search demo as the main demo
  redirect('/demo/ai-search')
}
