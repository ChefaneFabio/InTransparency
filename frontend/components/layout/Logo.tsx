import { Link } from '@/navigation'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'white'
}

export function Logo({ className = '', size = 'md', variant = 'default' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
  }

  const iconSize = {
    sm: 28,
    md: 36,
    lg: 48,
  }

  const textSize = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  const iconSz = iconSize[size]
  const primaryColor = variant === 'white' ? '#ffffff' : '#0f172a'
  const accentColor = variant === 'white' ? '#93c5fd' : '#2563eb'
  const docColor = variant === 'white' ? 'rgba(255,255,255,0.15)' : '#e8edf2'
  const lineColor = variant === 'white' ? 'rgba(255,255,255,0.25)' : '#94a3b8'

  return (
    <Link href="/" className={`flex items-center gap-2.5 ${sizeClasses[size]} ${className}`}>
      {/* Icon */}
      <svg
        width={iconSz}
        height={iconSz}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Document */}
        <rect x="14" y="4" width="24" height="32" rx="2" fill={docColor} stroke={primaryColor} strokeWidth="1.5" transform="rotate(-6, 26, 20)"/>
        <rect x="19" y="10" width="16" height="1.5" rx="0.75" fill={lineColor} transform="rotate(-6, 27, 10.75)"/>
        <rect x="19" y="15" width="13" height="1.5" rx="0.75" fill={lineColor} transform="rotate(-6, 25.5, 15.75)"/>
        <rect x="19" y="20" width="10" height="1.5" rx="0.75" fill={lineColor} transform="rotate(-6, 24, 20.75)"/>
        {/* Magnifying glass */}
        <circle cx="24" cy="28" r="11" fill="white" stroke={primaryColor} strokeWidth="2.5"/>
        <text x="17.5" y="33.5" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="14" fill={primaryColor}>IN</text>
        <line x1="32" y1="36" x2="40" y2="44" stroke={primaryColor} strokeWidth="3.5" strokeLinecap="round"/>
      </svg>

      {/* Text */}
      <span className={`font-bold tracking-tight ${textSize[size]} leading-none`}>
        <span style={{ color: primaryColor }}>In</span>
        <span style={{ color: accentColor }}>Transparency</span>
      </span>
    </Link>
  )
}
