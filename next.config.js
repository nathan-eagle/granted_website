/** @type {import('next').NextConfig} */
const nextConfig = {
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
