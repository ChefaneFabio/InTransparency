import NextLink from 'next/link'

// For now, just re-export Next.js Link directly
// The middleware will handle locale routing
export { default as Link } from 'next/link'
export { usePathname, useRouter, redirect } from 'next/navigation'
