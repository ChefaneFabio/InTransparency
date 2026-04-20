/** @type {import('next').NextConfig} */

const createNextIntlPlugin = require('next-intl/plugin')
const withNextIntl = createNextIntlPlugin('./i18n.ts')

const isDev = process.env.NODE_ENV === 'development'
const isVercel = process.env.VERCEL === '1'

// Content Security Policy optimized for Next.js - Updated for Google Maps
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.vercel.app https://vitals.vercel-insights.com https://maps.googleapis.com https://*.gstatic.com https://*.hs-scripts.com https://*.hs-analytics.net https://*.hs-banner.com https://*.hsforms.net https://*.hsleadflows.net https://*.hubspot.com ${isDev ? "http://localhost:* ws://localhost:*" : ''};
  script-src-elem 'self' 'unsafe-inline' https://vercel.live https://*.vercel.app https://vitals.vercel-insights.com https://maps.googleapis.com https://*.gstatic.com https://*.hs-scripts.com https://*.hs-analytics.net https://*.hs-banner.com https://*.hsforms.net https://*.hsleadflows.net https://*.hubspot.com ${isDev ? "http://localhost:* ws://localhost:*" : ''};
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com data:;
  img-src 'self' data: blob: https: https://*.vercel.app https://*.amazonaws.com https://maps.googleapis.com https://*.gstatic.com https://*.r2.cloudflarestorage.com https://*.hubspot.com https://track.hubspot.com;
  connect-src 'self' https://vitals.vercel-insights.com https://*.vercel.app https://api-intransparency.onrender.com https://maps.googleapis.com https://*.gstatic.com https://*.r2.cloudflarestorage.com https://*.hubspot.com https://*.hs-analytics.net https://*.hs-banner.com https://*.hsforms.com https://api-eu1.hubapi.com https://forms-eu1.hubspot.com https://track-eu1.hubspot.com ${isDev ? 'http://localhost:* ws://localhost:* wss://localhost:*' : ''};
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  worker-src 'self' blob:;
  child-src 'self' blob:;
  ${!isDev ? 'upgrade-insecure-requests;' : ''}
`

const nextConfig = {
  // Disable x-powered-by header
  poweredByHeader: false,

  // Enable React strict mode
  reactStrictMode: true,

  // Enable SWC minifier for better performance
  swcMinify: true,

  // Image optimization
  images: {
    domains: [
      's3.amazonaws.com',
      'intransparency-files.s3.eu-west-1.amazonaws.com',
      'localhost',
      'vercel.app',
      'vercel.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/api/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },

  // Enable compression
  compress: true,

  // Compiler optimizations
  compiler: {
    // Remove console.logs in production (keep errors)
    removeConsole: !isDev ? {
      exclude: ['error', 'warn']
    } : false
  },

  // Server external packages (moved from experimental in Next.js 15+)
  serverExternalPackages: ['@prisma/client'],

  // Experimental features
  experimental: {
    // Enable modern JavaScript output
    esmExternals: true,
  },

  // Webpack configuration to handle process.env in client
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },

  // Environment variables available to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api-intransparency.onrender.com',
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // Changed from DENY to allow same-origin frames
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          }
        ],
      },
      // Specific headers for static assets
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  },
  
  async rewrites() {
    // NextAuth routes (/api/auth/*) are handled locally by Next.js.
    // Using `fallback` (see below) so Next.js API routes — including dynamic
    // ones like /api/match/[id]/* — take precedence over the proxy. Unknown
    // paths still fall through to the Express backend.
    const devRule = {
      source: '/api/:path((?!auth).*)',
      destination: 'http://localhost:3001/api/:path*',
    }
    const prodRule = {
      source: '/api/:path((?!auth).*)',
      destination: 'https://api-intransparency.onrender.com/api/:path*',
    }
    // `fallback` runs AFTER both filesystem and dynamic routes, so
    // Next.js-owned routes (e.g. /api/match/[id]/why) always resolve locally;
    // only truly unknown paths fall through to the Express backend.
    return {
      fallback: [process.env.NODE_ENV === 'development' ? devRule : prodRule],
    }
  },
}

module.exports = withNextIntl(nextConfig)