/** @type {import('next').NextConfig} */
const nextConfig = {
  // Increase timeout for static page generation during build
  staticPageGenerationTimeout: 180, // 3 minutes per page (default is 60 seconds)
  
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'escaperoom.local',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'fitnessfriendlyrecipes.online',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'streetviewpixels-pa.googleapis.com',
        port: '',
        pathname: '/v1/thumbnail**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
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
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'escaperoomsfinder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: {
    // Enforce ESLint during builds - catch errors before deployment
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Enforce TypeScript during builds - catch type errors before deployment
    ignoreBuildErrors: false,
  },
  async redirects() {
    return [
      // Redirect old URL pattern: /locations/united/states-{state}/{city}
      // to new pattern: /locations/united-states/{state}/{city}
      // This catches all variations including multi-word states
      {
        source: '/locations/united/states-:state*/:city*',
        destination: '/locations/united-states/:state*/:city*',
        permanent: true, // 301 redirect
      },
      // Handle trailing slash variations
      {
        source: '/locations/united/states-:state*/:city*/',
        destination: '/locations/united-states/:state*/:city*',
        permanent: true,
      },
      // Redirect /locations/usa (exact match) to /locations/united-states
      {
        source: '/locations/usa',
        destination: '/locations/united-states',
        permanent: true, // 301 redirect
      },
      // Redirect /locations/usa/ (with trailing slash) to /locations/united-states
      {
        source: '/locations/usa/',
        destination: '/locations/united-states',
        permanent: true, // 301 redirect
      },
      // Redirect /locations/usa/* to /locations/united-states/*
      {
        source: '/locations/usa/:path+',
        destination: '/locations/united-states/:path+',
        permanent: true, // 301 redirect
      },
    ]
  },
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
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig