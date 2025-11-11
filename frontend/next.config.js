/** @type {import('next').NextConfig} */

const createNextIntlPlugin = require('next-intl/plugin')
const withNextIntl = createNextIntlPlugin('./i18n.ts')

const isDev = process.env.NODE_ENV === 'development'
const isVercel = process.env.VERCEL === '1'

// Content Security Policy optimized for Next.js - Updated for Google Maps
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.vercel.app https://vitals.vercel-insights.com https://maps.googleapis.com https://*.gstatic.com ${isDev ? "http://localhost:* ws://localhost:*" : ''};
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com data:;
  img-src 'self' data: blob: https: https://*.vercel.app https://*.amazonaws.com https://maps.googleapis.com https://*.gstatic.com https://*.r2.cloudflarestorage.com;
  connect-src 'self' https://vitals.vercel-insights.com https://*.vercel.app https://api-intransparency.onrender.com https://maps.googleapis.com https://*.r2.cloudflarestorage.com ${isDev ? 'http://localhost:* ws://localhost:* wss://localhost:*' : ''};
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

  // Output configuration - disable file tracing to prevent stack overflow
  output: 'standalone',

  // Experimental features
  experimental: {
    // Enable modern JavaScript output
    esmExternals: true,
    // Server components
    serverComponentsExternalPackages: ['@prisma/client'],
    // Disable output file tracing that causes stack overflow with Prisma
    outputFileTracing: false,
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
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:3001/api/:path*',
        },
      ]
    }
    
    return [
      {
        source: '/api/:path*',
        destination: 'https://api-intransparency.onrender.com/api/:path*',
      },
    ]
  },
}

module.exports = withNextIntl(nextConfig)