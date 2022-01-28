/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/auth/:path*',
        destination: process.env.NEXT_PUBLIC_SUPABASE_URL + '/auth/:path*'
      },
      {
        source: '/rest/:path*',
        destination: process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/:path*'
      }
    ]
  }
}

module.exports = nextConfig
