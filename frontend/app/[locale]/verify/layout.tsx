import { ReactNode } from 'react'

/**
 * Minimal layout for public verification pages.
 * No dashboard sidebar — just InTransparency branding.
 */
export default function VerifyLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">IT</span>
          </div>
          <div>
            <span className="font-semibold text-gray-900">InTransparency</span>
            <span className="text-xs text-gray-500 ml-2">Verified Credential</span>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8">
        {children}
      </main>
      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        <p>Verified by InTransparency — The Transparent Talent Marketplace</p>
      </footer>
    </div>
  )
}
