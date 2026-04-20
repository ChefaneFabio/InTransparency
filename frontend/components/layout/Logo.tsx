import { Link } from '@/navigation'
import Image from 'next/image'

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
    sm: 32,
    md: 40,
    lg: 56,
  }

  const textSize = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  const iconSz = iconSize[size]
  const primaryColor = variant === 'white' ? '#ffffff' : '#0f172a'
  const accentColor = variant === 'white' ? '#93c5fd' : '#2563eb'

  return (
    <Link href="/" className={`flex items-center gap-2.5 ${sizeClasses[size]} ${className}`}>
      <Image
        src="/logo.png"
        alt="InTransparency logo"
        width={iconSz}
        height={iconSz}
        priority
        className="rounded-md flex-shrink-0"
      />
      <span className={`font-bold tracking-tight ${textSize[size]} leading-none`}>
        <span style={{ color: primaryColor }}>In</span>
        <span style={{ color: accentColor }}>Transparency</span>
      </span>
    </Link>
  )
}
