/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      's3.amazonaws.com',
      'intransparency-files.s3.eu-west-1.amazonaws.com',
      'localhost'
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  compress: true,
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
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

module.exports = nextConfig