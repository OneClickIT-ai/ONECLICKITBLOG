/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      // Redirect old domain to new canonical domain (preserves SEO)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'oneclickit.today' }],
        destination: 'https://oneclickittoday.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.oneclickit.today' }],
        destination: 'https://oneclickittoday.com/:path*',
        permanent: true,
      },
      // Force www → apex on new domain
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.oneclickittoday.com' }],
        destination: 'https://oneclickittoday.com/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
