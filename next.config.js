/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/find-grants', destination: '/grants', permanent: true },
    ]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'grantedai.com' },
      { protocol: 'https', hostname: '**.bubbleapps.io' },
      { protocol: 'https', hostname: 'assets-global.website-files.com' },
    ],
  },
  experimental: { mdxRs: true },
}

module.exports = nextConfig
