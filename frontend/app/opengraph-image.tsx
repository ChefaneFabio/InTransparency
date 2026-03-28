import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'InTransparency — Verified Student Profiles'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo icon + text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px' }}>
          {/* Magnifying glass icon */}
          <svg width="96" height="96" viewBox="0 0 48 48" fill="none">
            <rect x="14" y="4" width="24" height="32" rx="2" fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="1.5" transform="rotate(-6, 26, 20)"/>
            <rect x="19" y="10" width="16" height="1.5" rx="0.75" fill="rgba(255,255,255,0.3)" transform="rotate(-6, 27, 10.75)"/>
            <rect x="19" y="15" width="13" height="1.5" rx="0.75" fill="rgba(255,255,255,0.3)" transform="rotate(-6, 25.5, 15.75)"/>
            <circle cx="24" cy="28" r="11" fill="white" stroke="#0f172a" strokeWidth="2.5"/>
            <text x="17.5" y="33.5" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="14" fill="#0f172a">IN</text>
            <line x1="32" y1="36" x2="40" y2="44" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
          </svg>

          {/* Brand name */}
          <div style={{ display: 'flex', fontSize: '64px', fontWeight: 700, letterSpacing: '-0.02em' }}>
            <span style={{ color: '#ffffff' }}>In</span>
            <span style={{ color: '#60a5fa' }}>Transparency</span>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '28px',
            color: 'rgba(255,255,255,0.7)',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.4,
          }}
        >
          Verified student portfolios. University-backed skills. AI-powered matching.
        </div>

        {/* Bottom bar with stats */}
        <div
          style={{
            display: 'flex',
            gap: '48px',
            marginTop: '48px',
            padding: '20px 48px',
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {[
            { value: 'Universities & Schools', label: 'Verified by' },
            { value: 'AI-Analyzed', label: 'Project Skills' },
            { value: 'Italy & Europe', label: 'Coverage' },
          ].map((stat) => (
            <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#60a5fa' }}>{stat.value}</span>
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
