/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    esmExternals: 'loose',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
