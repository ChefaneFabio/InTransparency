import { ReactNode } from 'react'

/**
 * Minimal layout for public parental consent pages.
 * No dashboard sidebar — standalone page.
 */
export default function ConsentLayout({ children }: { children: ReactNode }) {
  return (
    <>{children}</>
  )
}
